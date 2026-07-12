const { Groq } = require('groq-sdk');
const { checkRateLimit, rateLimitResponse } = require('./_shared/rateLimit');
const progression = require('../../content/fundamentals/coach-progression.json');

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const TOPICS = [
  'current role & experience',
  'target role & company stage',
  'location & remote preference',
  'timeline & urgency',
  'stack & weak areas',
  'compensation (optional)',
  'mission-driven roles interest',
];

const DEMO_REPLIES = [
  "Hi — I'm Coach, your career agent. What role are you in today, and what are you aiming for next?",
  'Got it. Are you actively interviewing, or still exploring? And remote-only, hybrid, or open to onsite?',
  'What stack do you work in most, and where do you feel least ready in interviews?',
  'Last one: any interest in mission-driven orgs — climate, health, frontier science?',
  "Perfect. I've got enough to build your path. Let's look at jobs and your skill tree.",
];

function demoResponse(messages, voicePreference) {
  const userTurns = messages.filter((m) => m.role === 'user').length;
  const idx = Math.min(userTurns, DEMO_REPLIES.length - 1);
  const complete = userTurns >= 4;
  const profile = complete
    ? {
        onboardingComplete: true,
        voicePreference: voicePreference || 'male',
        targetTrack: 'software',
        targetRoles: ['Software Engineer'],
        experienceYears: 3,
        currentRole: 'Software Engineer',
        remotePreference: 'remote-only',
        timeline: 'active-search',
        stack: ['TypeScript', 'React'],
        weakAreas: ['system design', 'behavioral'],
        missionPreferred: true,
        recommendedLeafIds: progression.fundamentals.map((f) => f.leafId),
        summaryForMatching:
          'Mid-level software engineer seeking remote startup roles with interest in mission-driven companies.',
      }
    : undefined;

  return {
    reply: DEMO_REPLIES[idx],
    topicsComplete: Math.min(userTurns + 1, TOPICS.length),
    topicsTotal: TOPICS.length,
    onboardingComplete: complete,
    profile,
    demoMode: true,
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'coach', 20);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  try {
    const { messages = [], voicePreference, profilePatch = {} } = JSON.parse(event.body || '{}');

    if (!groq) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(demoResponse(messages, voicePreference)),
      };
    }

    const transcript = messages.map((m) => `${m.role}: ${m.content}`).join('\n');

    const system = `You are Coach — ChamiNexT's career agent. Warm, direct, fiduciary to the candidate (never a recruiter shill).
Conduct onboarding chat to learn: ${TOPICS.join('; ')}.
Ask ONE question per reply (2-3 sentences max). Probe vague answers.
When you have enough info (usually after 5-8 exchanges), set onboardingComplete true and emit full profile.
Tracks: software, ai-engineer, quant, cybersecurity, market-engineering, ai-for-science.
Recommended fundamentals leaves: ${progression.fundamentals.map((f) => f.leafId).join(', ')}.

Return ONLY JSON:
{
  "reply": "string",
  "topicsComplete": number,
  "topicsTotal": ${TOPICS.length},
  "profilePatch": { partial fields },
  "onboardingComplete": boolean,
  "profile": { full CoachProfile when complete — include voicePreference "${voicePreference || 'male'}", targetTrack, targetRoles[], experienceYears, currentRole, remotePreference, timeline, stack[], weakAreas[], missionPreferred, recommendedLeafIds[], summaryForMatching }
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: `Voice preference: ${voicePreference || 'male'}\nExisting patch: ${JSON.stringify(profilePatch)}\n\nTranscript:\n${transcript || '(session start — greet and ask first question)'}`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { reply: 'Tell me about your current role.' };
    if (!parsed.topicsTotal) parsed.topicsTotal = TOPICS.length;

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(parsed) };
  } catch (err) {
    console.error('onboarding-agent error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Coach unavailable' }),
    };
  }
};
