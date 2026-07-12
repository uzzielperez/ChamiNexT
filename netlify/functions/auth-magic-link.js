const { checkRateLimit, rateLimitResponse } = require('./_shared/rateLimit');
const { saveMagicToken } = require('./_shared/coachStore');
const crypto = require('crypto');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'auth', 5, 300_000);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  try {
    const { email, redirectOrigin } = JSON.parse(event.body || '{}');
    const normalized = String(email || '')
      .trim()
      .toLowerCase();
    if (!normalized || !normalized.includes('@')) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Valid email required' }),
      };
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await saveMagicToken(token, normalized, expiresAt);

    const origin =
      redirectOrigin ||
      event.headers.origin ||
      event.headers.Origin ||
      'https://chaminext.netlify.app';
    const verifyUrl = `${origin}/auth/callback?token=${token}`;

    const hasResend = Boolean(process.env.RESEND_API_KEY);
    if (hasResend) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.MAGIC_LINK_FROM || 'Coach <hello@chaminext.com>',
          to: normalized,
          subject: 'Sign in to ChamiNexT',
          html: `<p>Click to sign in (expires in 15 minutes):</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
        }),
      });
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        ok: true,
        demoMode: !hasResend,
        message: hasResend
          ? 'Check your email for a sign-in link.'
          : 'Demo mode: use the link below to sign in.',
        verifyUrl: hasResend ? undefined : verifyUrl,
      }),
    };
  } catch (err) {
    console.error('auth-magic-link error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Could not send magic link' }),
    };
  }
};
