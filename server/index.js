import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const distDir = path.join(rootDir, "dist");

const app = express();
const port = Number(process.env.PORT || 8787);
const adminToken = process.env.ADMIN_TOKEN || "";
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const recentRequests = new Map();

app.use(
  cors({
    origin(origin, callback) {
      if (!allowedOrigins.length || !origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    }
  })
);
app.use(express.json({ limit: "96kb" }));
app.use(express.urlencoded({ extended: false }));

function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
}

function rateLimit(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowMs = 60 * 1000;
  const current = recentRequests.get(ip)?.filter((timestamp) => now - timestamp < windowMs) || [];

  if (current.length >= 8) {
    return res.status(429).json({ error: "Za dużo zgłoszeń w krótkim czasie. Spróbuj ponownie za chwilę." });
  }

  current.push(now);
  recentRequests.set(ip, current);
  next();
}

function cleanText(value, maxLength = 320) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function normalizeTracking(raw = {}) {
  return {
    page: cleanText(raw.page, 260),
    referrer: cleanText(raw.referrer, 260),
    utm_source: cleanText(raw.utm_source, 80),
    utm_medium: cleanText(raw.utm_medium, 80),
    utm_campaign: cleanText(raw.utm_campaign, 120),
    utm_content: cleanText(raw.utm_content, 120),
    utm_term: cleanText(raw.utm_term, 120)
  };
}

function normalizeSubmission(raw, type) {
  const base = {
    id: crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    source: "website",
    tracking: normalizeTracking(raw.tracking)
  };

  if (type === "lead") {
    return {
      ...base,
      fullName: cleanText(raw.fullName, 120),
      phone: cleanText(raw.phone, 40),
      email: cleanText(raw.email, 120),
      location: cleanText(raw.location, 120),
      monthlyBill: cleanText(raw.monthlyBill, 30),
      solution: cleanText(raw.solution, 120),
      roofType: cleanText(raw.roofType, 80),
      investmentTime: cleanText(raw.investmentTime, 80),
      message: cleanText(raw.message, 800)
    };
  }

  return {
    ...base,
    fullName: cleanText(raw.fullName, 120),
    phone: cleanText(raw.phone, 40),
    email: cleanText(raw.email, 120),
    city: cleanText(raw.city, 120),
    experience: cleanText(raw.experience, 120),
    leadSource: cleanText(raw.leadSource, 140),
    preferredProducts: cleanText(raw.preferredProducts, 140),
    availableFrom: cleanText(raw.availableFrom, 80),
    hasTeam: Boolean(raw.hasTeam),
    message: cleanText(raw.message, 800)
  };
}

function validateSubmission(raw, type) {
  if (cleanText(raw.companyWebsite, 120)) {
    return "Nie udało się zapisać zgłoszenia.";
  }

  if (!raw.consent) {
    return "Zgoda na kontakt jest wymagana.";
  }

  const fullName = cleanText(raw.fullName, 120);
  const phone = cleanText(raw.phone, 40).replace(/[^\d+]/g, "");

  if (fullName.length < 3) {
    return "Podaj imię i nazwisko.";
  }

  if (phone.length < 7) {
    return "Podaj prawidłowy numer telefonu.";
  }

  if (type === "lead" && cleanText(raw.location, 120).length < 2) {
    return "Podaj miejscowość inwestycji.";
  }

  if (type === "partner" && cleanText(raw.city, 120).length < 2) {
    return "Podaj miasto lub region pracy.";
  }

  return "";
}

async function readJsonList(fileName) {
  const filePath = path.join(dataDir, fileName);
  await mkdir(dataDir, { recursive: true });

  if (!existsSync(filePath)) {
    return [];
  }

  const raw = await readFile(filePath, "utf8");
  return raw ? JSON.parse(raw) : [];
}

async function appendSubmission(fileName, submission) {
  const items = await readJsonList(fileName);
  items.unshift(submission);
  await writeFile(path.join(dataDir, fileName), `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "solva-leads-api" });
});

app.post("/api/leads", rateLimit, async (req, res) => {
  const error = validateSubmission(req.body, "lead");

  if (error) {
    return res.status(400).json({ error });
  }

  const submission = normalizeSubmission(req.body, "lead");
  await appendSubmission("leads.json", submission);
  res.status(201).json({ ok: true, id: submission.id });
});

app.post("/api/partners", rateLimit, async (req, res) => {
  const error = validateSubmission(req.body, "partner");

  if (error) {
    return res.status(400).json({ error });
  }

  const submission = normalizeSubmission(req.body, "partner");
  await appendSubmission("partners.json", submission);
  res.status(201).json({ ok: true, id: submission.id });
});

app.get("/api/submissions", async (req, res) => {
  if (!adminToken || req.query.token !== adminToken) {
    return res.status(401).json({ error: "Brak dostępu." });
  }

  const [leads, partners] = await Promise.all([readJsonList("leads.json"), readJsonList("partners.json")]);
  res.json({ leads, partners });
});

if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Wystąpił błąd serwera." });
});

app.listen(port, () => {
  console.log(`SOLVA API listening on http://localhost:${port}`);
});
