const Stripe = require('stripe');
const { getPlan, FOUNDING } = require('./_shared/plans.cjs');
const {
  saveEntitlement,
  getEntitlement,
  incrementFoundingRedemption,
  saveCompanyWorkspace,
} = require('./_shared/billingStore.cjs');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function addDaysIso(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function buildEntitlementFromSession(session, plan) {
  const email = session.customer_details?.email || session.customer_email;
  const paid =
    session.payment_status === 'paid' ||
    session.payment_status === 'no_payment_required' ||
    session.status === 'complete';

  const entitlement = {
    plan: plan.id,
    audience: plan.audience,
    status: paid ? 'active' : 'pending',
    stripeSessionId: session.id,
    stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
    stripeSubscriptionId:
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
    amountTotal: session.amount_total,
    currency: session.currency,
    discountApplied: Boolean(session.total_details?.amount_discount),
    foundingCode: FOUNDING.code,
    since: new Date().toISOString(),
  };

  if (plan.accessDays) {
    entitlement.expiresAt = addDaysIso(plan.accessDays);
  }

  if (plan.audience === 'company') {
    entitlement.companyPlan = plan.id;
    entitlement.trialEndsAt = plan.trialDays ? addDaysIso(plan.trialDays) : undefined;
  }

  return { email, entitlement, paid };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { sessionId, plan: planHint, demo } = JSON.parse(event.body || '{}');

  // Demo path: no Stripe — still record a lightweight entitlement if email provided
  if (!process.env.STRIPE_SECRET_KEY || demo) {
    const plan = getPlan(planHint) || getPlan('interview-season');
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        demoMode: true,
        verified: true,
        plan: plan.id,
        audience: plan.audience,
        expiresAt: plan.accessDays ? addDaysIso(plan.accessDays) : undefined,
        founding: FOUNDING,
      }),
    };
  }

  if (!sessionId) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing sessionId' }) };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['total_details'],
    });

    const planId = session.metadata?.plan || session.client_reference_id || planHint;
    const plan = getPlan(planId);
    if (!plan) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Unknown plan on session' }) };
    }

    const { email, entitlement, paid } = buildEntitlementFromSession(session, plan);
    if (!paid) {
      return {
        statusCode: 402,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Payment not completed', status: session.payment_status }),
      };
    }

    if (!email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Checkout session missing customer email' }),
      };
    }

    const existing = await getEntitlement(email);
    const alreadyCounted =
      existing?.stripeSessionId === session.id || existing?.foundingCounted === true;

    const saved = await saveEntitlement(email, {
      ...entitlement,
      foundingCounted: alreadyCounted || entitlement.discountApplied,
    });

    if (entitlement.discountApplied && !alreadyCounted) {
      await incrementFoundingRedemption();
    }

    if (plan.audience === 'company') {
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

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        verified: true,
        plan: plan.id,
        audience: plan.audience,
        email,
        expiresAt: saved.expiresAt,
        trialEndsAt: saved.trialEndsAt,
        workspaceId: saved.workspaceId,
        amountTotal: saved.amountTotal,
        discountApplied: saved.discountApplied,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
