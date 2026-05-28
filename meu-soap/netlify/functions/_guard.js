const rateBuckets = new Map();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const parseAllowedOrigins = () => {
  const raw = process.env.ALLOWED_ORIGINS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const matchesAllowed = (value, allowed) => {
  if (!value) return false;
  try {
    const host = new URL(value).origin;
    return allowed.some((rule) => {
      if (rule === host) return true;
      if (rule.startsWith("*.")) {
        const suffix = rule.slice(1);
        return host.endsWith(suffix);
      }
      return false;
    });
  } catch {
    return false;
  }
};

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const guard = (req) => {
  const allowed = parseAllowedOrigins();
  if (allowed.length === 0) {
    return json(500, {
      error: "ALLOWED_ORIGINS nao configurado no Netlify.",
    });
  }

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const originOk =
    matchesAllowed(origin, allowed) ||
    (!origin && matchesAllowed(referer, allowed));
  if (!originOk) {
    return json(403, { error: "Origin nao autorizado." });
  }

  const ip =
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  if (bucket.count > RATE_LIMIT_MAX) {
    return json(429, {
      error: "Muitas requisicoes. Tente novamente em alguns instantes.",
    });
  }

  return null;
};
