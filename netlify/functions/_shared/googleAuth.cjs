const crypto = require('crypto');

function getSecret() {
  return process.env.JWT_SECRET || 'chaminext-dev-jwt-change-in-production';
}

function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function siteOriginFromEvent(event) {
  const proto = event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || 'https';
  const host = event.headers['x-forwarded-host'] || event.headers.host || event.headers.Host;
  if (host) return `${proto}://${host}`.replace(/\/$/, '');
  if (process.env.URL) return process.env.URL.replace(/\/$/, '');
  if (process.env.DEPLOY_PRIME_URL) return process.env.DEPLOY_PRIME_URL.replace(/\/$/, '');
  return 'https://chaminext.netlify.app';
}

function googleRedirectUri(event) {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;
  return `${siteOriginFromEvent(event)}/.netlify/functions/auth-google-callback`;
}

function encodeOAuthState(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function decodeOAuthState(state) {
  if (!state || typeof state !== 'string') return null;
  const [body, sig] = state.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  if (sig !== expected) return null;
  try {
    const json = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (json.exp && json.exp < Date.now()) return null;
    return json;
  } catch {
    return null;
  }
}

function buildGoogleAuthUrl({ redirectUri, state }) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

async function exchangeGoogleCode({ code, redirectUri }) {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok || !tokenJson.access_token) {
    const err = new Error(tokenJson.error_description || tokenJson.error || 'Token exchange failed');
    err.details = tokenJson;
    throw err;
  }

  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
  });
  const user = await userRes.json();
  if (!userRes.ok || !user.email) {
    const err = new Error('Could not load Google profile');
    err.details = user;
    throw err;
  }
  if (user.email_verified === false) {
    throw new Error('Google email is not verified');
  }
  return {
    email: String(user.email).trim().toLowerCase(),
    name: user.name || undefined,
    picture: user.picture || undefined,
    sub: user.sub,
  };
}

module.exports = {
  googleConfigured,
  siteOriginFromEvent,
  googleRedirectUri,
  encodeOAuthState,
  decodeOAuthState,
  buildGoogleAuthUrl,
  exchangeGoogleCode,
};
