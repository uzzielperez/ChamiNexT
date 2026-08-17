const { requireUser } = require('./_shared/auth');
const { getWorkspace, saveWorkspace } = require('./_shared/studioStore');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Studio-Session',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
};

function ownerIdFromEvent(event) {
  const user = requireUser(event);
  if (user?.id) return user.id;
  const session =
    event.headers['x-studio-session'] ||
    event.headers['X-Studio-Session'] ||
    '';
  if (session && session.length >= 8) return `session:${session.slice(0, 64)}`;
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const ownerId = ownerIdFromEvent(event);
  if (!ownerId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'X-Studio-Session or Authorization required' }),
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      const templateId = event.queryStringParameters?.templateId;
      if (!templateId) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'templateId query required' }),
        };
      }
      const workspace = await getWorkspace(ownerId, templateId);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ workspace }),
      };
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const { templateId, files, activePath, terminalLog } = body;
      if (!templateId || !files || typeof files !== 'object') {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'templateId and files required' }),
        };
      }
      const workspace = {
        templateId,
        files,
        activePath: activePath || Object.keys(files)[0] || '',
        terminalLog: terminalLog || '',
        updatedAt: new Date().toISOString(),
      };
      await saveWorkspace(ownerId, templateId, workspace);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ workspace, saved: true }),
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (err) {
    console.error('studio-workspace error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Workspace sync failed' }),
    };
  }
};
