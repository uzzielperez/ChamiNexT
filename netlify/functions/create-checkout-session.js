const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PLANS = {
  pro: { amount: 1900, name: 'ChamiNext Pro' },
  builder: { amount: 4900, name: 'ChamiNext Builder' },
  premium: { amount: 8900, name: 'ChamiNext Premium' },
  'interview-season': {
    amount: 14900,
    name: 'ChamiNext Interview Season (90 days)',
  },
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ demoMode: true, plan: JSON.parse(event.body || '{}').plan }),
    };
  }

  try {
    const { plan, successUrl, cancelUrl } = JSON.parse(event.body || '{}');
    const selected = PLANS[plan];
    if (!selected) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid plan' }) };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: selected.amount,
            product_data: { name: selected.name },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${event.headers.origin}/success?plan=${plan}`,
      cancel_url: cancelUrl || `${event.headers.origin}/pricing`,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
