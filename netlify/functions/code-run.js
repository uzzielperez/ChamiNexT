const { checkRateLimit, rateLimitResponse } = require('./_shared/rateLimit');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'coderun', 40);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  try {
    const { code, language = 'javascript', stdin = '' } = JSON.parse(event.body || '{}');
    const config = LANGUAGE_MAP[language] || LANGUAGE_MAP.javascript;

    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [{ name: 'main', content: code }],
        stdin,
      }),
    });

    const data = await res.json();
    const stdout = data.run?.stdout ?? '';
    const stderr = data.run?.stderr ?? '';
    const exitCode = data.run?.code ?? 1;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        stdout,
        stderr,
        exitCode,
        success: exitCode === 0,
      }),
    };
  } catch (err) {
    console.error('code-run error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        stdout: '',
        stderr: 'Runner unavailable. Explain your approach verbally to the interviewer.',
        exitCode: 1,
        success: false,
      }),
    };
  }
};
