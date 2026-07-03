const { Groq } = require('groq-sdk');
const { checkRateLimit, rateLimitResponse } = require('./_shared/rateLimit');

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Deterministic transform used when no API key is configured.
function localProblems(report) {
  return (report.questionsAsked || [])
    .map((q) => String(q).trim())
    .filter(Boolean)
    .map((q) => ({
      title: `${report.company}: ${q.slice(0, 60)}`,
      prompt: `Asked in a real ${report.stage} at ${report.company} for a ${report.role} role.\n\n"${q}"\n\nExplain your approach and trade-offs, then solve.`,
      domain: 'arrays',
      difficulty: report.difficulty || 'medium',
      track: report.track || 'software',
      estimatedMinutes: 15,
    }));
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'field-report', 20);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  try {
    const body = JSON.parse(event.body || '{}');
    const report = body.report;
    if (!report || !Array.isArray(report.questionsAsked) || report.questionsAsked.length === 0) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing report questions' }) };
    }

    if (!groq) {
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ problems: localProblems(report) }) };
    }

    const system = `You convert real technical interview questions into reusable practice problems for ChamiNext.
For each input question, produce a practice problem that tests the same underlying skill with reasoning and AI-collaboration in mind (not rote recall).
Pick "domain" from: arrays, trees, strings, system-design, debugging, rag, agents, prompting, evals, ai-system-design, safety, experimentation, funnel-analytics, growth-systems, attribution, martech-integrations, gtm-strategy.
Return ONLY JSON of shape:
{"problems":[{"title":"short title","prompt":"problem statement that asks for approach + trade-offs then solution","domain":"...","difficulty":"easy|medium|hard","track":"software|ai-engineer|quant|cybersecurity|market-engineering","estimatedMinutes":10|15|20}]}`;

    const user = `COMPANY: ${report.company}
ROLE: ${report.role}
STAGE: ${report.stage}
TRACK: ${report.track}
DIFFICULTY: ${report.difficulty}
CANDIDATE STRUGGLED WITH: ${report.whatStruggled || 'n/a'}
REAL QUESTIONS:
${report.questionsAsked.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : { problems: localProblems(report) };
    if (!parsed.problems || parsed.problems.length === 0) parsed.problems = localProblems(report);

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error('field-report-agent error', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Generation failed' }) };
  }
};
