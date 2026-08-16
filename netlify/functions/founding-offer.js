const { getFoundingStats } = require('./_shared/billingStore.cjs');
const { FOUNDING, CONSUMER_PLANS, COMPANY_PLANS, discountedAmount, formatEur } = require('./_shared/plans.cjs');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const stats = await getFoundingStats();
  const used = stats.redemptions || 0;
  const remaining = Math.max(0, FOUNDING.maxRedemptions - used);
  const open = remaining > 0;

  const consumer = Object.values(CONSUMER_PLANS)
    .filter((p) => p.id === 'builder' || p.id === 'interview-season')
    .map((p) => ({
      id: p.id,
      name: p.name,
      listPrice: formatEur(p.amount),
      foundingPrice: formatEur(discountedAmount(p.amount)),
      mode: p.mode,
    }));

  const company = Object.values(COMPANY_PLANS).map((p) => ({
    id: p.id,
    name: p.name,
    listPrice: formatEur(p.amount),
    foundingPrice: formatEur(discountedAmount(p.amount)),
    trialDays: p.trialDays,
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      founding: {
        ...FOUNDING,
        used,
        remaining,
        open,
      },
      consumer,
      company,
    }),
  };
};
