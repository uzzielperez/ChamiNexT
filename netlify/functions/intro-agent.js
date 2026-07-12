const { Groq } = require('groq-sdk');
const { checkRateLimit, rateLimitResponse } = require('./_shared/rateLimit');

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'intro', 10);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  try {
    const { job, coachProfile, talentSummary, profileSlug } = JSON.parse(event.body || '{}');

    const fallback = {
      email: {
        subject: `Interest in ${job?.title} at ${job?.company}`,
        body: `Hi,\n\nI'm exploring the ${job?.title} role at ${job?.company}. ${coachProfile?.summaryForMatching || 'I build and ship production software.'}\n\nProfile: ${profileSlug ? `${profileSlug}` : 'available on request'}\n\nWould welcome a brief conversation.\n\nBest`,
      },
      linkedin: {
        connectionNote: `Hi — interested in the ${job?.title} opening. ${talentSummary || 'Engineer with ship history on ChamiNexT.'}`.slice(
          0,
          300
        ),
        followUp: `Thanks for connecting. I applied to ${job?.title} and would love to share how I've prepared (mock interviews + ship tests).`,
      },
      demoMode: true,
    };

    if (!groq || !job) {
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(fallback) };
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `Write warm intro drafts for a job seeker. Fiduciary tone — honest, specific, not desperate.
Return ONLY JSON: {"email":{"subject":"","body":""},"linkedin":{"connectionNote":"max 300 chars","followUp":""}}`,
        },
        {
          role: 'user',
          content: `Job: ${job.title} at ${job.company}\n${job.description?.slice(0, 500)}\n\nCandidate: ${coachProfile?.summaryForMatching}\nStack: ${(coachProfile?.stack || []).join(', ')}\nTalent: ${talentSummary}\nProfile URL slug: ${profileSlug || 'n/a'}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : fallback;
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error('intro-agent error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Intro draft failed' }),
    };
  }
};
