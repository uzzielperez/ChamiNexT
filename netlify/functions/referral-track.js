const { checkRateLimit, rateLimitResponse } = require('./_shared/rateLimit');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const REFERRER_REWARD_DAYS = 7;
const MAX_REWARDS_PER_MONTH = 4;

/** In-process fallback when Netlify Blobs unavailable (dev / cold start). */
const memoryLedger = new Map();
const memoryReferees = new Set();

function codeKey(code) {
  return String(code || '').trim().toUpperCase();
}

function defaultStats() {
  return { qualified: 0, pendingRewardDays: 0, claimedRewardDays: 0, rewardsThisMonth: 0, monthKey: monthNow() };
}

function monthNow() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

async function getBlobStore() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore({ name: 'chaminext-referrals', consistency: 'strong' });
  } catch {
    return null;
  }
}

async function readStats(code) {
  const key = codeKey(code);
  if (!key) return defaultStats();

  const store = await getBlobStore();
  if (store) {
    const data = await store.get(`stats:${key}`, { type: 'json' });
    if (data) return { ...defaultStats(), ...data };
  }
  return { ...defaultStats(), ...(memoryLedger.get(key) || {}) };
}

async function writeStats(code, stats) {
  const key = codeKey(code);
  memoryLedger.set(key, stats);
  const store = await getBlobStore();
  if (store) {
    await store.setJSON(`stats:${key}`, stats);
  }
}

function referralCodeFromUserId(userId) {
  let h = 0;
  for (let i = 0; i < userId.length; i += 1) {
    h = (Math.imul(31, h) + userId.charCodeAt(i)) | 0;
  }
  const n = Math.abs(h);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  let x = n;
  for (let i = 0; i < 6; i += 1) {
    out += chars[x % chars.length];
    x = Math.floor(x / chars.length) + i * 7;
  }
  return out;
}

function isSelfReferral(referralCode, userId) {
  return codeKey(referralCode) === referralCodeFromUserId(String(userId || ''));
}

async function forwardWebhook(payload) {
  const url = process.env.REFERRAL_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'chaminext-referral', ...payload }),
    });
  } catch (err) {
    console.warn('referral webhook failed', err.message);
  }
}

async function handleQualified(referralCode, userId) {
  if (isSelfReferral(referralCode, userId)) {
    return { ok: false, error: 'self_referral' };
  }

  const refereeKey = `referee:${userId}`;
  const store = await getBlobStore();
  if (store) {
    const seen = await store.get(refereeKey);
    if (seen) return { ok: true, duplicate: true };
    await store.set(refereeKey, new Date().toISOString());
  } else if (memoryReferees.has(refereeKey)) {
    return { ok: true, duplicate: true };
  } else {
    memoryReferees.add(refereeKey);
  }

  const stats = await readStats(referralCode);
  const mk = monthNow();
  if (stats.monthKey !== mk) {
    stats.monthKey = mk;
    stats.rewardsThisMonth = 0;
  }

  stats.qualified += 1;
  if (stats.rewardsThisMonth < MAX_REWARDS_PER_MONTH) {
    stats.pendingRewardDays += REFERRER_REWARD_DAYS;
    stats.rewardsThisMonth += 1;
  }

  await writeStats(referralCode, stats);
  await forwardWebhook({ event: 'qualified', referralCode, userId, stats });

  return { ok: true, stats };
}

async function handleClaim(referralCode, userId) {
  const expected = referralCodeFromUserId(String(userId || ''));
  if (codeKey(referralCode) !== expected) {
    return { ok: false, error: 'invalid_owner' };
  }

  const stats = await readStats(referralCode);
  const claimedDays = stats.pendingRewardDays || 0;
  if (claimedDays > 0) {
    stats.claimedRewardDays = (stats.claimedRewardDays || 0) + claimedDays;
    stats.pendingRewardDays = 0;
    await writeStats(referralCode, stats);
    await forwardWebhook({ event: 'claim', referralCode, userId, claimedDays, stats });
  }

  return { ok: true, claimedDays, stats };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const rl = checkRateLimit(event, 'referral', 40);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  try {
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {};
      const code = codeKey(params.code);
      const userId = params.userId || '';
      if (!code) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing code' }) };
      }
      if (userId && code !== referralCodeFromUserId(userId)) {
        return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: 'Forbidden' }) };
      }
      const stats = await readStats(code);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ok: true, stats }),
      };
    }

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const body = JSON.parse(event.body || '{}');
    const eventType = body.event;
    const referralCode = codeKey(body.referralCode);
    const userId = String(body.userId || '');

    if (!referralCode || !userId) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    if (eventType === 'capture') {
      await forwardWebhook({ event: 'capture', referralCode, userId });
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) };
    }

    if (eventType === 'qualified') {
      const result = await handleQualified(referralCode, userId);
      return {
        statusCode: result.ok ? 200 : 400,
        headers: corsHeaders,
        body: JSON.stringify(result),
      };
    }

    if (eventType === 'claim') {
      const result = await handleClaim(referralCode, userId);
      return {
        statusCode: result.ok ? 200 : 403,
        headers: corsHeaders,
        body: JSON.stringify(result),
      };
    }

    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Unknown event' }) };
  } catch (err) {
    console.error('referral-track error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
