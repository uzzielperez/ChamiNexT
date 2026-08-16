const crypto = require('crypto');
const { saveMagicToken } = require('./_shared/coachStore');
const {
  googleConfigured,
  googleRedirectUri,
  decodeOAuthState,
  exchangeGoogleCode,
  siteOriginFromEvent,
} = require('./_shared/googleAuth.cjs');

function redirect(url) {
  return {
    statusCode: 302,
    headers: { Location: url, 'Cache-Control': 'no-store' },
    body: '',
  };
}

function failRedirect(origin, message) {
  const base = origin || siteOriginFromEvent({ headers: {} });
  const q = new URLSearchParams({ error: message });
  return redirect(`${base}/login?${q}`);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const qs = event.queryStringParameters || {};
  const state = decodeOAuthState(qs.state);
  const appOrigin = state?.origin || siteOriginFromEvent(event);

  if (qs.error) {
    return failRedirect(appOrigin, qs.error_description || qs.error || 'Google sign-in cancelled');
  }

  if (!googleConfigured()) {
    return failRedirect(appOrigin, 'Google sign-in is not configured');
  }

  if (!state) {
    return failRedirect(appOrigin, 'Invalid or expired Google sign-in state');
  }

  const code = qs.code;
  if (!code) {
    return failRedirect(appOrigin, 'Missing authorization code');
  }

  try {
    const redirectUri = googleRedirectUri(event);
    const profile = await exchangeGoogleCode({ code, redirectUri });

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await saveMagicToken(token, profile.email, expiresAt);

    return redirect(`${appOrigin}/auth/callback?token=${token}`);
  } catch (err) {
    console.error('auth-google-callback error', err);
    return failRedirect(appOrigin, 'Google sign-in failed. Try again or use email.');
  }
};
