#!/usr/bin/env node
/**
 * Create founding cohort coupon + promotion code in Stripe.
 * Usage: STRIPE_SECRET_KEY=sk_... node scripts/stripe-setup-founding.mjs
 *
 * Prints STRIPE_FOUNDING_PROMOTION_CODE_ID to set in Netlify env.
 */

import Stripe from 'stripe';

const CODE = 'FOUNDING40';
const PERCENT = 40;
const MAX = 30;

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error('Set STRIPE_SECRET_KEY');
    process.exit(1);
  }

  const stripe = new Stripe(key);

  const coupon = await stripe.coupons.create({
    id: 'founding40',
    percent_off: PERCENT,
    duration: 'once',
    max_redemptions: MAX,
    name: 'Founding cohort 40% off',
  }).catch(async (err) => {
    if (err.code === 'resource_already_exists') {
      return stripe.coupons.retrieve('founding40');
    }
    throw err;
  });

  console.log('Coupon:', coupon.id, `${coupon.percent_off}% off`);

  const existing = await stripe.promotionCodes.list({ code: CODE, limit: 1 });
  let promo = existing.data[0];
  if (!promo) {
    promo = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: CODE,
      max_redemptions: MAX,
      active: true,
    });
  }

  console.log('Promotion code:', promo.code);
  console.log('\nAdd to Netlify env:');
  console.log(`STRIPE_FOUNDING_PROMOTION_CODE_ID=${promo.id}`);
  console.log('STRIPE_WEBHOOK_SECRET=whsec_...  # from Stripe webhook endpoint');
  console.log('\nWebhook URL: https://<your-site>/.netlify/functions/stripe-webhook');
  console.log('Events: checkout.session.completed, checkout.session.async_payment_succeeded, customer.subscription.deleted');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
