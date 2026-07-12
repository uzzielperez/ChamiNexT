const { requireUser } = require('./_shared/auth');
const { getProfile, saveProfile } = require('./_shared/coachStore');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const user = requireUser(event);
  if (!user) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      const profile = await getProfile(user.id);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ profile, user }),
      };
    }

    if (event.httpMethod === 'PUT') {
      const { profile } = JSON.parse(event.body || '{}');
      if (!profile || typeof profile !== 'object') {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'profile object required' }),
        };
      }
      const next = { ...profile, updatedAt: new Date().toISOString() };
      await saveProfile(user.id, next);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ profile: next, user }),
      };
    }

    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    console.error('coach-profile error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Profile sync failed' }),
    };
  }
};
