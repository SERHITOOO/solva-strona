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

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const maxBodySize = 16 * 1024;
const rateLimitWindowMs = 60 * 1000;
const rateLimitMaxRequests = 120;
const recentRequests = new Map<string, number[]>();
const allowedEvents = new Set([
  "page_view",
  "form_view",
  "form_submit_attempt",
  "form_submit_success",
  "form_submit_error",
  "mailto_fallback"
]);

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

function cleanText(value: unknown, maxLength = 260) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function cleanPath(value: unknown) {
  const path = cleanText(value, 180);

  if (!path.startsWith("/")) {
    return "/";
  }

  return path.split("?")[0].slice(0, 180) || "/";
}

function normalizeTracking(raw: unknown) {
  const tracking = typeof raw === "object" && raw ? raw as Record<string, unknown> : {};

  return {
    referrer: cleanText(tracking.referrer, 260),
    utm_source: cleanText(tracking.utm_source, 80),
    utm_medium: cleanText(tracking.utm_medium, 80),
    utm_campaign: cleanText(tracking.utm_campaign, 120),
    utm_content: cleanText(tracking.utm_content, 120),
    utm_term: cleanText(tracking.utm_term, 120)
  };
}

function normalizeMetadata(raw: unknown) {
  const metadata = typeof raw === "object" && raw ? raw as Record<string, unknown> : {};
  const allowedKeys = ["kind", "mode", "title", "hash", "error", "route"];
  const output: Record<string, string> = {};

  for (const key of allowedKeys) {
    const value = cleanText(metadata[key], 180);
    if (value) {
      output[key] = value;
    }
  }

  return output;
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
    return new Response(JSON.stringify({ error: "Ta domena nie może wysyłać eventów." }), { status: 403, headers });
  }

  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Za dużo zdarzeń w krótkim czasie." }), { status: 429, headers });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > maxBodySize) {
    return new Response(JSON.stringify({ error: "Event jest zbyt duży." }), { status: 413, headers });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Endpoint nie ma ustawionej konfiguracji Supabase." }), { status: 500, headers });
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > maxBodySize) {
    return new Response(JSON.stringify({ error: "Event jest zbyt duży." }), { status: 413, headers });
  }

  const payload = await Promise.resolve()
    .then(() => JSON.parse(rawBody || "{}") as Record<string, unknown>)
    .catch(() => null);

  if (!payload) {
    return new Response(JSON.stringify({ error: "Nieprawidłowe dane eventu." }), { status: 400, headers });
  }

  const event = cleanText(payload.event, 60);
  if (!allowedEvents.has(event)) {
    return new Response(JSON.stringify({ error: "Nieznany event." }), { status: 400, headers });
  }

  const tracking = normalizeTracking(payload.tracking);
  const row = {
    event,
    session_id: cleanText(payload.sessionId, 80),
    path: cleanPath(payload.path),
    referrer: tracking.referrer,
    utm_source: tracking.utm_source,
    utm_medium: tracking.utm_medium,
    utm_campaign: tracking.utm_campaign,
    utm_content: tracking.utm_content,
    utm_term: tracking.utm_term,
    metadata: normalizeMetadata(payload.metadata)
  };

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase.from("analytics_events").insert(row);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Nie udało się zapisać eventu." }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 201, headers });
});
