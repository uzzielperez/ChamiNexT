const Stripe = require('stripe');
const { getPlan, FOUNDING } = require('./_shared/plans.cjs');
const { getFoundingStats } = require('./_shared/billingStore.cjs');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function originFromEvent(event) {
  return event.headers.origin || event.headers.Origin || 'http://localhost:5173';
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    const body = JSON.parse(event.body || '{}');
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        demoMode: true,
        plan: body.plan,
        foundingCode: FOUNDING.code,
        message: 'Stripe not configured — client will activate locally for demo.',
      }),
    };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const {
      plan,
      successUrl,
      cancelUrl,
      email,
      applyFoundingDiscount = true,
      companyName,
    } = JSON.parse(event.body || '{}');

    const selected = getPlan(plan);
    if (!selected) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid plan' }) };
    }

    const origin = originFromEvent(event);
    const stats = await getFoundingStats();
    const foundingStillOpen = (stats.redemptions || 0) < FOUNDING.maxRedemptions;

    const sessionParams = {
      mode: selected.mode,
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      customer_email: email || undefined,
      client_reference_id: plan,
      metadata: {
        plan,
        audience: selected.audience,
        companyName: companyName || '',
        foundingEligible: foundingStillOpen ? '1' : '0',
      },
      success_url:
        successUrl ||
        `${origin}/success?plan=${encodeURIComponent(plan)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/pricing${selected.audience === 'company' ? '?for=companies' : ''}`,
    };

    if (selected.mode === 'subscription') {
      sessionParams.line_items = [
        {
          price_data: {
            currency: selected.currency,
            unit_amount: selected.amount,
            recurring: { interval: selected.interval || 'month' },
            product_data: { name: selected.name },
          },
          quantity: 1,
        },
      ];
      if (selected.trialDays) {
        sessionParams.subscription_data = {
          trial_period_days: selected.trialDays,
          metadata: { plan, audience: selected.audience },
        };
      } else {
        sessionParams.subscription_data = { metadata: { plan, audience: selected.audience } };
      }
    } else {
      sessionParams.line_items = [
        {
          price_data: {
            currency: selected.currency,
            unit_amount: selected.amount,
            product_data: { name: selected.name },
          },
          quantity: 1,
        },
      ];
    }

    // Auto-apply founding promo when configured and cohort still open
    const promoId = process.env.STRIPE_FOUNDING_PROMOTION_CODE_ID;
    if (applyFoundingDiscount && foundingStillOpen && promoId) {
      sessionParams.discounts = [{ promotion_code: promoId }];
      delete sessionParams.allow_promotion_codes; // Stripe: can't mix both
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        url: session.url,
        sessionId: session.id,
        founding: {
          code: FOUNDING.code,
          percentOff: FOUNDING.percentOff,
          remaining: Math.max(0, FOUNDING.maxRedemptions - (stats.redemptions || 0)),
          autoApplied: Boolean(promoId && foundingStillOpen && applyFoundingDiscount),
        },
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

