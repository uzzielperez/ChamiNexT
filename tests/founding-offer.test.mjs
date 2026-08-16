/**
 * Client founding math mirrors server.
 * Run: node --test tests/founding-offer.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, '../src/data/foundingOffer.ts'), 'utf8');

describe('client foundingOffer.ts', () => {
  it('keeps FOUNDING40 / 40% / 30 spots in sync with copy', () => {
    assert.match(src, /code: 'FOUNDING40'/);
    assert.match(src, /percentOff: 40/);
    assert.match(src, /maxRedemptions: 30/);
  });

  it('lists Sprint and Season list prices', () => {
    assert.match(src, /'interview-season': 14900/);
    assert.match(src, /builder: 4900/);
    assert.match(src, /'biz-small': 25000/);
  });
});

describe('CSV export helper shape', () => {
  it('employerStorage exports applicationsToCsv', () => {
    const storage = readFileSync(join(__dirname, '../src/utils/employerStorage.ts'), 'utf8');
    assert.match(storage, /export function applicationsToCsv/);
  });
});
