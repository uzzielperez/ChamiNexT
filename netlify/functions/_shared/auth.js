const crypto = require('crypto');

const DEFAULT_SECRET = 'chaminext-dev-jwt-change-in-production';

function getSecret() {
  return process.env.JWT_SECRET || DEFAULT_SECRET;
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwt(payload, expiresInSec = 60 * 60 * 24 * 30) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  const body = base64url(JSON.stringify({ ...payload, exp }));
  const data = `${header}.${body}`;
  const sig = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const data = `${header}.${body}`;
  const expected = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
  if (sig !== expected) return null;
  try {
    const json = JSON.parse(Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    if (json.exp && json.exp < Math.floor(Date.now() / 1000)) return null;
    return json;
  } catch {
    return null;
  }
}

function userIdFromEmail(email) {
  return crypto.createHash('sha256').update(String(email).trim().toLowerCase()).digest('hex').slice(0, 32);
}

function bearerFromEvent(event) {
  const auth = event.headers.authorization || event.headers.Authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

function requireUser(event) {
  const token = bearerFromEvent(event);
  const payload = verifyJwt(token);
  if (!payload?.sub || !payload?.email) return null;
  return { id: payload.sub, email: payload.email };
}

module.exports = { signJwt, verifyJwt, userIdFromEmail, bearerFromEvent, requireUser };
