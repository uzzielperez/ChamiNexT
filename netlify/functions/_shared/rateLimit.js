/**
 * Per-function-instance rate limit. Survives warm invocations only.
 * For multi-instance production traffic, add Upstash Redis or Netlify Blobs.
 */
const buckets = new Map();

function prune(now) {
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }
}

function getClientKey(event) {
  const forwarded = event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return event.headers['client-ip'] || 'anonymous';
}

/**
 * @returns {{ allowed: boolean, retryAfterSec?: number }}
 */
function checkRateLimit(event, namespace, maxPerWindow, windowMs = 60_000) {
  const limit = Number(process.env[`RATE_LIMIT_${namespace.toUpperCase()}`] || maxPerWindow);
  const key = `${namespace}:${getClientKey(event)}`;
  const now = Date.now();
  prune(now);

  let entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(key, entry);
  }

  entry.count += 1;
  if (entry.count > limit) {
    const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, retryAfterSec };
  }
  return { allowed: true };
}

function rateLimitResponse(retryAfterSec, corsHeaders) {
  return {
    statusCode: 429,
    headers: {
      ...corsHeaders,
      'Retry-After': String(retryAfterSec),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      error: 'Too many requests. Please wait and try again.',
      retryAfterSec,
    }),
  };
}

module.exports = { checkRateLimit, rateLimitResponse, getClientKey };
