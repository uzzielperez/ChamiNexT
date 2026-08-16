import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, it, before, after } from 'node:test';

const require = createRequire(import.meta.url);

describe('googleAuth state', () => {
  let encodeOAuthState;
  let decodeOAuthState;
  let prevSecret;

  before(() => {
    prevSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test-secret-for-google-oauth';
    const mod = require('../netlify/functions/_shared/googleAuth.cjs');
    encodeOAuthState = mod.encodeOAuthState;
    decodeOAuthState = mod.decodeOAuthState;
  });

  after(() => {
    if (prevSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevSecret;
  });

  it('round-trips origin in signed state', () => {
    const state = encodeOAuthState({ origin: 'http://localhost:5173', exp: Date.now() + 60_000 });
    const decoded = decodeOAuthState(state);
    assert.equal(decoded.origin, 'http://localhost:5173');
  });

  it('rejects tampered state', () => {
    const state = encodeOAuthState({
      origin: 'https://chaminext.netlify.app',
      exp: Date.now() + 60_000,
    });
    const [body] = state.split('.');
    assert.equal(decodeOAuthState(`${body}.bogussig`), null);
  });

  it('rejects expired state', () => {
    const state = encodeOAuthState({ origin: 'https://example.com', exp: Date.now() - 1000 });
    assert.equal(decodeOAuthState(state), null);
  });
});
