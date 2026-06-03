const { Groq } = require('groq-sdk');

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

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
    const { challenge, deploymentUrl, events = [], enrolledAt, endsAt } = JSON.parse(event.body || '{}');

    const fallback = {
      scores: {
        shipping: deploymentUrl ? 82 : 45,
        productThinking: 78,
        engineeringQuality: 75,
        executionSpeed: 80,
        tradeoffAwareness: 77,
        overall: 78,
      },
      feedback:
        'Demo evaluation. Set GROQ_API_KEY for AI-generated Ship Test feedback.',
    };

    if (!groq) {
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(fallback) };
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You evaluate ChamiNext Ship Tests. Score 0-100 on: shipping, productThinking, engineeringQuality, executionSpeed, tradeoffAwareness. overall = average. Return ONLY JSON:
{"scores":{"shipping":N,"productThinking":N,"engineeringQuality":N,"executionSpeed":N,"tradeoffAwareness":N,"overall":N},"feedback":"2-4 sentences for the candidate"}`,
        },
        {
          role: 'user',
          content: `CHALLENGE: ${challenge?.title}\n${challenge?.pmBrief}\nDEPLOY URL: ${deploymentUrl || 'none'}\nEVENTS:\n${events.map((e) => `${e.role}: ${e.message}`).join('\n')}\nTIME: ${enrolledAt} to ${endsAt}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : fallback;
    if (parsed.scores && !parsed.scores.overall) {
      const s = parsed.scores;
      parsed.scores.overall = Math.round(
        (s.shipping + s.productThinking + s.engineeringQuality + s.executionSpeed + s.tradeoffAwareness) / 5
      );
    }
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error('ship-test-evaluator error', err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Evaluation failed' }) };
  }
};
