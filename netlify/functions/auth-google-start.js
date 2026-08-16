const {
  googleConfigured,
  googleRedirectUri,
  encodeOAuthState,
  buildGoogleAuthUrl,
  siteOriginFromEvent,
} = require('./_shared/googleAuth.cjs');
const { checkRateLimit, rateLimitResponse } = require('./_shared/rateLimit');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function htmlError(title, detail) {
  return {
    statusCode: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
    body: `<!doctype html><html><body style="font-family:system-ui;background:#0a0b0d;color:#eee;padding:2rem">
      <h1>${title}</h1>
      <p>${detail}</p>
      <p><a href="/login" style="color:#60a5fa">Back to sign in</a></p>
    </body></html>`,
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'auth-google', 10, 300_000);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  if (!googleConfigured()) {
    return htmlError(
      'Google sign-in not configured',
      'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Netlify env, then add the callback URL in Google Cloud Console.'
    );
  }

  const qs = event.queryStringParameters || {};
  const requestedOrigin = qs.origin ? String(qs.origin).replace(/\/$/, '') : '';
  const siteOrigin = siteOriginFromEvent(event);
  // Only allow same-site or localhost origins to avoid open redirects
  let appOrigin = siteOrigin;
  if (requestedOrigin) {
    try {
      const u = new URL(requestedOrigin);
      const okHost =
        u.hostname === 'localhost' ||
        u.hostname === '127.0.0.1' ||
        u.hostname.endsWith('.netlify.app') ||
        u.hostname === 'chaminext.com' ||
        u.hostname.endsWith('.chaminext.com') ||
        requestedOrigin === siteOrigin;
      if (okHost) appOrigin = requestedOrigin;
    } catch {
      /* keep siteOrigin */
    }
  }

  const redirectUri = googleRedirectUri(event);
  const state = encodeOAuthState({
    origin: appOrigin,
    exp: Date.now() + 15 * 60 * 1000,
    n: Math.random().toString(36).slice(2),
  });

  const url = buildGoogleAuthUrl({ redirectUri, state });
  return {
    statusCode: 302,
    headers: {
      Location: url,
      'Cache-Control': 'no-store',
    },
    body: '',
  };
};
