const { Groq } = require('groq-sdk');

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

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
    const body = JSON.parse(event.body || '{}');
    const { problem, code, messages = [], action, candidateMessage } = body;

    if (!problem?.prompt) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing problem' }),
      };
    }

    if (!groq) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(
          action === 'score'
            ? {
                scores: { thinking: 70, decomposition: 68, communication: 72, codeQuality: 65, overall: 69 },
                scoreNotes: 'Demo mode: set GROQ_API_KEY for live AI scoring.',
              }
            : {
                reply: 'Tell me your high-level approach before we dive into code.',
                followUp: 'What is the time and space complexity?',
              }
        ),
      };
    }

    const transcript = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    if (action === 'score') {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `You are a senior engineering interviewer. Score the session 0-100 on: thinking, decomposition, communication, codeQuality. Return ONLY JSON:
{"scores":{"thinking":N,"decomposition":N,"communication":N,"codeQuality":N,"overall":N},"scoreNotes":"2-3 sentences"}`,
          },
          {
            role: 'user',
            content: `PROBLEM: ${problem.title}\n${problem.prompt}\n\nCODE:\n${code}\n\nTRANSCRIPT:\n${transcript}`,
          },
        ],
      });

      const text = completion.choices[0]?.message?.content || '{}';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      if (parsed.scores && !parsed.scores.overall) {
        const s = parsed.scores;
        parsed.scores.overall = Math.round(
          (s.thinking + s.decomposition + s.communication + s.codeQuality) / 4
        );
      }
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(parsed) };
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      messages: [
        {
          role: 'system',
          content: `You are an adaptive technical interviewer for ChamiNext. Be Socratic: short questions, no full solutions. Encourage reasoning and tradeoffs. AI-assisted coding is allowed if explained. Return ONLY JSON:
{"reply":"interviewer message","followUp":"optional sharper question"}`,
        },
        {
          role: 'user',
          content: `PROBLEM (${problem.domain}): ${problem.title}\n${problem.prompt}\n\nCANDIDATE CODE:\n${code}\n\nTRANSCRIPT:\n${transcript}\n\nCANDIDATE SAID:\n${candidateMessage || '(starting session)'}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { reply: 'Walk me through your approach.' };

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error('interview-agent error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Interview agent failed' }),
    };
  }
};
