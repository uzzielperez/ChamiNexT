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

// Grades a whole rapid-fire screening drill in one call.
// Input: { track, items: [{ id, question, answer }] }
// Output: { results: [{ id, verdict: 'strong'|'partial'|'miss', ideal, note }], summary }
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'drill', 10);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  try {
    const body = JSON.parse(event.body || '{}');
    const { track = 'software', items } = body;

    if (!Array.isArray(items) || items.length === 0 || items.length > 12) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'items must be a non-empty array (max 12)' }),
      };
    }

    if (!groq) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ graded: false }),
      };
    }

    const system = `You grade a rapid-fire technical phone-screen drill for a ${track} candidate. Each answer was typed in under ~40 seconds, so judge substance, not polish.

For EACH item return:
- "verdict": "strong" (correct core idea, would pass a phone screen), "partial" (right direction but missing the key point or imprecise), or "miss" (wrong, empty, or non-answer).
- "ideal": the 1-2 sentence answer a strong candidate gives on the phone. Concrete and technical, no filler.
- "note": ONE short sentence on what this candidate specifically got right or missed. Reference their words. Empty answers get "No answer given."

Rules:
- Judge against what a screener needs to hear, not textbook completeness.
- Do not reward confident-sounding fluff; a vague answer with no technical content is a "miss".
- Then write "summary": 2 sentences max on the overall pattern (what to review first).

Respond ONLY with JSON:
{"results":[{"id":"...","verdict":"strong|partial|miss","ideal":"...","note":"..."}],"summary":"..."}`;

    const user = items
      .map((it, i) => `Q${i + 1} (id: ${it.id}): ${it.question}\nANSWER: ${it.answer?.trim() || '(no answer)'}`)
      .join('\n\n');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    if (!Array.isArray(parsed.results)) {
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ graded: false }) };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ graded: true, results: parsed.results, summary: parsed.summary || '' }),
    };
  } catch (err) {
    console.error('drill-agent error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Drill agent failed' }),
    };
  }
};
