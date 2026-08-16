const Stripe = require('stripe');
const { getPlan, FOUNDING } = require('./_shared/plans.cjs');
const {
  saveEntitlement,
  getEntitlement,
  incrementFoundingRedemption,
  saveCompanyWorkspace,
} = require('./_shared/billingStore.cjs');

function addDaysIso(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

async function activateFromSession(session) {
  const planId = session.metadata?.plan || session.client_reference_id;
  const plan = getPlan(planId);
  if (!plan) return;

  const email = session.customer_details?.email || session.customer_email;
  if (!email) return;

  const entitlement = {
    plan: plan.id,
    audience: plan.audience,
    status: 'active',
    stripeSessionId: session.id,
    stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
    stripeSubscriptionId:
      typeof session.subscription === 'string' ? session.subscription : undefined,
    amountTotal: session.amount_total,
    currency: session.currency,
    discountApplied: Boolean(session.total_details?.amount_discount),
    foundingCode: FOUNDING.code,
    since: new Date().toISOString(),
  };

  if (plan.accessDays) entitlement.expiresAt = addDaysIso(plan.accessDays);
  if (plan.audience === 'company') {
    entitlement.companyPlan = plan.id;
    if (plan.trialDays) entitlement.trialEndsAt = addDaysIso(plan.trialDays);
  }

  const existing = await getEntitlement(email);
  const already = existing?.stripeSessionId === session.id;

  const saved = await saveEntitlement(email, {
    ...entitlement,
    foundingCounted: already || entitlement.discountApplied,
    workspaceId: existing?.workspaceId,
  });

  if (entitlement.discountApplied && !already && !existing?.foundingCounted) {
    await incrementFoundingRedemption();
  }

  if (plan.audience === 'company' && !saved.workspaceId) {
    const workspaceId = `ws-${Buffer.from(email).toString('hex').slice(0, 12)}`;
    await saveCompanyWorkspace(workspaceId, {
      plan: plan.id,
      ownerEmail: email,
      companyName: session.metadata?.companyName || '',
      roles: [],
      applications: [],
      softSkillsPackEnabled: true,
      pilot: true,
    });
    saved.workspaceId = workspaceId;
    await saveEntitlement(email, saved);
  }
}

exports.handler = async (event) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, skipped: 'no stripe key' }) };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;
  try {
    if (webhookSecret && sig) {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    } else {
      // Local / misconfigured: parse JSON (not for production)
      stripeEvent = JSON.parse(event.body || '{}');
    }
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    if (
      stripeEvent.type === 'checkout.session.completed' ||
      stripeEvent.type === 'checkout.session.async_payment_succeeded'
    ) {
      await activateFromSession(stripeEvent.data.object);
    }

    if (stripeEvent.type === 'customer.subscription.deleted') {
      const sub = stripeEvent.data.object;
      const email = sub.metadata?.email;
      if (email) {
        const existing = await getEntitlement(email);
        if (existing) {
          await saveEntitlement(email, { ...existing, status: 'canceled', plan: 'free' });
        }
      }
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
