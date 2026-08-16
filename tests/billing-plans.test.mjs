/**
 * Smoke tests for founding billing / plan catalog.
 * Run: node --test tests/billing-plans.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  FOUNDING,
  getPlan,
  discountedAmount,
  formatEur,
  CONSUMER_PLANS,
  COMPANY_PLANS,
} = require('../netlify/functions/_shared/plans.cjs');

describe('founding cohort', () => {
  it('offers 40% off for first 30', () => {
    assert.equal(FOUNDING.percentOff, 40);
    assert.equal(FOUNDING.maxRedemptions, 30);
    assert.equal(FOUNDING.code, 'FOUNDING40');
  });

  it('discounts Sprint and Season correctly', () => {
    assert.equal(discountedAmount(14900), 8940);
    assert.equal(discountedAmount(4900), 2940);
    assert.equal(formatEur(8940), '€89.40');
  });
});

describe('plan catalog', () => {
  it('Sprint is one-time payment with 90-day access', () => {
    const p = getPlan('interview-season');
    assert.equal(p.mode, 'payment');
    assert.equal(p.accessDays, 90);
    assert.equal(p.amount, 14900);
  });

  it('Season is monthly subscription', () => {
    const p = getPlan('builder');
    assert.equal(p.mode, 'subscription');
    assert.equal(p.interval, 'month');
  });

  it('company plans include 60-day trial', () => {
    assert.equal(getPlan('biz-small').trialDays, 60);
    assert.equal(getPlan('biz-growth').trialDays, 60);
    assert.equal(getPlan('biz-small').amount, 25000);
  });

  it('rejects unknown plans', () => {
    assert.equal(getPlan('nope'), null);
  });

  it('exposes consumer + company maps', () => {
    assert.ok(CONSUMER_PLANS.builder);
    assert.ok(COMPANY_PLANS['biz-growth']);
  });
});
