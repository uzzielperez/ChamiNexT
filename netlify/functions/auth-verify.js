const { signJwt, userIdFromEmail } = require('./_shared/auth');
const { consumeMagicToken } = require('./_shared/coachStore');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { token } = JSON.parse(event.body || '{}');
    const email = await consumeMagicToken(String(token || ''));
    if (!email) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid or expired link' }),
      };
    }

    const userId = userIdFromEmail(email);
    const sessionToken = signJwt({ sub: userId, email });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        token: sessionToken,
        user: { id: userId, email },
      }),
    };
  } catch (err) {
    console.error('auth-verify error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Verification failed' }),
    };
  }
};
