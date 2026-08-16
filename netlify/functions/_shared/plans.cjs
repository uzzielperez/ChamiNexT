/**
 * Canonical plan catalog for Checkout + verify + tests.
 * Founding cohort: first FOUNDING_MAX_REDEMPTIONS use code FOUNDING40 (40% off).
 */

const FOUNDING = {
  code: 'FOUNDING40',
  percentOff: 40,
  maxRedemptions: 30,
  label: 'Founding 40% off — first 30 payers',
};

/** Consumer plans sold on /pricing */
const CONSUMER_PLANS = {
  builder: {
    id: 'builder',
    name: 'ChamiNext Season',
    mode: 'subscription',
    amount: 4900,
    currency: 'eur',
    interval: 'month',
    audience: 'consumer',
  },
  'interview-season': {
    id: 'interview-season',
    name: 'ChamiNext Sprint (90 days)',
    mode: 'payment',
    amount: 14900,
    currency: 'eur',
    audience: 'consumer',
    accessDays: 90,
  },
  // Legacy SKUs kept for existing links / SuccessPage
  pro: {
    id: 'pro',
    name: 'ChamiNext Pro',
    mode: 'subscription',
    amount: 1900,
    currency: 'eur',
    interval: 'month',
    audience: 'consumer',
  },
  premium: {
    id: 'premium',
    name: 'ChamiNext Premium',
    mode: 'subscription',
    amount: 8900,
    currency: 'eur',
    interval: 'month',
    audience: 'consumer',
  },
};

/** Company plans — Stripe Checkout or mailto for enterprise */
const COMPANY_PLANS = {
  'biz-small': {
    id: 'biz-small',
    name: 'ChamiNext Small Business',
    mode: 'subscription',
    amount: 25000,
    currency: 'eur',
    interval: 'month',
    audience: 'company',
    trialDays: 60,
  },
  'biz-growth': {
    id: 'biz-growth',
    name: 'ChamiNext Growth',
    mode: 'subscription',
    amount: 90000,
    currency: 'eur',
    interval: 'month',
    audience: 'company',
    trialDays: 60,
  },
};

const ALL_PLANS = { ...CONSUMER_PLANS, ...COMPANY_PLANS };

function getPlan(planId) {
  return ALL_PLANS[planId] || null;
}

function discountedAmount(amountCents, percentOff = FOUNDING.percentOff) {
  return Math.round(amountCents * (1 - percentOff / 100));
}

function formatEur(cents) {
  return `€${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

module.exports = {
  FOUNDING,
  CONSUMER_PLANS,
  COMPANY_PLANS,
  ALL_PLANS,
  getPlan,
  discountedAmount,
  formatEur,
};
