import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const defaultOrigins = [
  "https://solvaoze.pl",
  "https://www.solvaoze.pl",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173"
];

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") || defaultOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const notifyEmail = Deno.env.get("NOTIFY_EMAIL") || "kontakt@solvaoze.pl";
const fromEmail = Deno.env.get("FROM_EMAIL") || "SOLVA <kontakt@solvaoze.pl>";
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const googleSheetsWebhookUrl = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL") || "";
const googleSheetsWebhookToken = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_TOKEN") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY") || "";
const maxBodySize = 96 * 1024;
const rateLimitWindowMs = 60 * 1000;
const rateLimitMaxRequests = 8;
const recentRequests = new Map<string, number[]>();

function getCorsHeaders(origin: string | null) {
  const safeOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": safeOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
    "Content-Type": "application/json"
  };
}

function isAllowedRequestOrigin(origin: string | null) {
  return !origin || allowedOrigins.includes(origin);
}

function cleanText(value: unknown, maxLength = 320) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function hasConsent(value: unknown) {
  return value === true || cleanText(value, 12).toLowerCase() === "tak";
}

function isValidEmail(value: unknown) {
  const email = cleanText(value, 120);

  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getKind(payload: Record<string, unknown>) {
  const rawKind = cleanText(payload.kind, 20);

  if (rawKind === "lead" || rawKind === "partner") {
    return rawKind;
  }

  // Backward compatibility for older mail/form payloads that used only the Polish label.
  return cleanText(payload.typ, 80).toLowerCase().includes("handlowca") ? "partner" : "lead";
}

function normalizeTracking(raw: unknown) {
  const tracking = typeof raw === "object" && raw ? raw as Record<string, unknown> : {};

  return {
    page: cleanText(tracking.page, 260),
    referrer: cleanText(tracking.referrer, 260),
    utm_source: cleanText(tracking.utm_source, 80),
    utm_medium: cleanText(tracking.utm_medium, 80),
    utm_campaign: cleanText(tracking.utm_campaign, 120),
    utm_content: cleanText(tracking.utm_content, 120),
    utm_term: cleanText(tracking.utm_term, 120)
  };
}

function validate(payload: Record<string, unknown>, kind: "lead" | "partner") {
  const botTrap = cleanText(payload.confirmWebsite, 120) || cleanText(payload.websiteUrl, 120);
  if (botTrap) {
    return "Nie udało się zapisać zgłoszenia.";
  }

  if (!hasConsent(payload.consent)) {
    return "Zgoda na kontakt jest wymagana.";
  }

  if (cleanText(payload.fullName, 120).length < 3) {
    return "Podaj imię i nazwisko.";
  }

  const phone = cleanText(payload.phone, 40).replace(/[^\d+]/g, "");
  if (phone.length < 7) {
    return "Podaj prawidłowy numer telefonu.";
  }

  if (!isValidEmail(payload.email)) {
    return "Podaj prawidłowy adres e-mail albo zostaw to pole puste.";
  }

  if (kind === "lead" && cleanText(payload.location, 120).length < 2) {
    return "Podaj miejscowość inwestycji.";
  }

  if (kind === "partner" && cleanText(payload.city, 120).length < 2) {
    return "Podaj miasto lub region pracy.";
  }

  return "";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = (recentRequests.get(ip) || []).filter((timestamp) => now - timestamp < rateLimitWindowMs);

  if (current.length >= rateLimitMaxRequests) {
    recentRequests.set(ip, current);
    return true;
  }

  current.push(now);
  recentRequests.set(ip, current);

  for (const [key, timestamps] of recentRequests) {
    const active = timestamps.filter((timestamp) => now - timestamp < rateLimitWindowMs);

    if (active.length) {
      recentRequests.set(key, active);
    } else {
      recentRequests.delete(key);
    }
  }

  return false;
}

async function verifyTurnstile(token: string, ip: string) {
  if (!turnstileSecret) {
    return true;
  }

  if (!token) {
    return false;
  }

  const form = new FormData();
  form.append("secret", turnstileSecret);
  form.append("response", token);
  form.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form
  });
  const result = await response.json().catch(() => ({ success: false }));

  return Boolean(result.success);
}

function submissionSummary(payload: Record<string, unknown>, kind: "lead" | "partner") {
  const rows = kind === "lead"
    ? [
      ["Typ", "Zgłoszenie klienta"],
      ["Imię i nazwisko", payload.fullName],
      ["Telefon", payload.phone],
      ["E-mail", payload.email],
      ["Miejscowość", payload.location],
      ["Rachunek", payload.monthlyBill],
      ["Rozwiązanie", payload.solution],
      ["Obiekt", payload.roofType],
      ["Termin", payload.investmentTime],
      ["Wiadomość", payload.message]
    ]
    : [
      ["Typ", "Zgłoszenie handlowca"],
      ["Imię i nazwisko", payload.fullName],
      ["Telefon", payload.phone],
      ["E-mail", payload.email],
      ["Region", payload.city],
      ["Doświadczenie", payload.experience],
      ["Źródła klientów", payload.leadSource],
      ["Zakres", payload.preferredProducts],
      ["Dostępność", payload.availableFrom],
      ["Własny zespół", payload.hasTeam],
      ["Wiadomość", payload.message]
    ];

  return rows
    .map(([label, value]) => `${label}: ${cleanText(value, 900) || "-"}`)
    .join("\n");
}

async function sendNotification(payload: Record<string, unknown>, kind: "lead" | "partner") {
  if (!resendApiKey) {
    return;
  }

  const subject = kind === "lead"
    ? "SOLVA - nowe zgłoszenie klienta"
    : "SOLVA - nowe zgłoszenie handlowca";
  const text = submissionSummary(payload, kind);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notifyEmail],
      subject,
      text
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Resend notification failed: ${response.status} ${details.slice(0, 240)}`);
  }
}

async function mirrorToGoogleSheets(row: Record<string, unknown>) {
  if (!googleSheetsWebhookUrl) {
    return { ok: false, skipped: true, error: "GOOGLE_SHEETS_WEBHOOK_URL is not set" };
  }

  const targetUrl = new URL(googleSheetsWebhookUrl);
  if (googleSheetsWebhookToken) {
    targetUrl.searchParams.set("token", googleSheetsWebhookToken);
  }

  const response = await fetch(targetUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(row)
  });
  const responseText = await response.text().catch(() => "");
  const result = responseText
    ? await Promise.resolve()
      .then(() => JSON.parse(responseText) as Record<string, unknown>)
      .catch(() => null)
    : null;

  if (!response.ok || result?.ok === false) {
    const details = cleanText(result?.error || responseText, 240);
    throw new Error(`Google Sheets webhook failed: ${response.status} ${details}`);
  }

  return { ok: true, skipped: false, status: response.status };
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  const headers = getCorsHeaders(origin);

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Metoda niedozwolona." }), { status: 405, headers });
  }

  if (!isAllowedRequestOrigin(origin)) {
    return new Response(JSON.stringify({ error: "Ta domena nie może wysyłać zgłoszeń." }), { status: 403, headers });
  }

  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Za dużo zgłoszeń w krótkim czasie. Spróbuj ponownie za chwilę." }), { status: 429, headers });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > maxBodySize) {
    return new Response(JSON.stringify({ error: "Zgłoszenie jest zbyt duże." }), { status: 413, headers });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Endpoint nie ma ustawionej konfiguracji Supabase." }), { status: 500, headers });
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > maxBodySize) {
    return new Response(JSON.stringify({ error: "Zgłoszenie jest zbyt duże." }), { status: 413, headers });
  }

  const payload = await Promise.resolve()
    .then(() => JSON.parse(rawBody || "{}") as Record<string, unknown>)
    .catch(() => null);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Nieprawidłowe dane formularza." }), { status: 400, headers });
  }

  const kind = getKind(payload);
  const validationError = validate(payload, kind);
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), { status: 400, headers });
  }

  const turnstileToken = cleanText(payload.turnstileToken, 1200);
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return new Response(JSON.stringify({ error: "Nie udało się potwierdzić zabezpieczenia formularza." }), { status: 400, headers });
  }

  const tracking = normalizeTracking(payload.tracking);
  const storedPayload = { ...payload };
  delete storedPayload.companyWebsite;
  delete storedPayload.turnstileToken;

  const row = {
    kind,
    status: "new",
    full_name: cleanText(payload.fullName, 120),
    phone: cleanText(payload.phone, 40),
    email: cleanText(payload.email, 120),
    location: kind === "lead" ? cleanText(payload.location, 120) : cleanText(payload.city, 120),
    source: "solvaoze.pl",
    payload: storedPayload,
    tracking
  };
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: insertedRow, error } = await supabase.from("submissions").insert(row).select().single();

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Nie udało się zapisać zgłoszenia." }), { status: 500, headers });
  }

  const storedRow = (insertedRow || row) as Record<string, unknown>;
  let sheetsMirror = { ok: false, skipped: true, error: "Nie wykonano synchronizacji z Google Sheets." };

  await sendNotification(payload, kind).catch((error) => console.error(error));
  await mirrorToGoogleSheets(storedRow)
    .then((result) => {
      sheetsMirror = {
        ok: Boolean(result.ok),
        skipped: Boolean(result.skipped),
        error: cleanText(result.error, 240)
      };
    })
    .catch((error) => {
      console.error(error);
      sheetsMirror = {
        ok: false,
        skipped: false,
        error: cleanText(error.message, 240)
      };
    });

  return new Response(JSON.stringify({ ok: true, sheetsMirror }), { status: 201, headers });
});
