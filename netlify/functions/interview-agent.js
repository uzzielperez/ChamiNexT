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

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'interview', 30);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

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

    const track = problem.track || 'software';

    const TRACK_PROMPTS = {
      software: {
        score: `You are a senior software engineering interviewer. Score 0-100 on: thinking, decomposition, communication, codeQuality. Return ONLY JSON:
{"scores":{"thinking":N,"decomposition":N,"communication":N,"codeQuality":N,"overall":N},"scoreNotes":"2-3 sentences"}`,
        chat: `You are an adaptive technical interviewer for ChamiNext. Be Socratic: short questions, no full solutions. Encourage reasoning and tradeoffs. AI-assisted coding is allowed if explained. Return ONLY JSON:
{"reply":"interviewer message","followUp":"optional sharper question"}`,
      },
      'ai-engineer': {
        score: `You are a senior AI/ML engineering interviewer. Score 0-100 on: thinking, decomposition, communication, codeQuality (use codeQuality for system design / pseudo-code rigor when no code). Evaluate RAG design, evals, prompting, agents, safety, and production tradeoffs—not LeetCode tricks. Return ONLY JSON:
{"scores":{"thinking":N,"decomposition":N,"communication":N,"codeQuality":N,"overall":N},"scoreNotes":"2-3 sentences"}`,
        chat: `You are an adaptive AI engineering interviewer for ChamiNext. Topics: RAG, agents, prompting, evals, AI system design, safety. Be Socratic; probe failure modes, cost/latency, and eval strategy. Return ONLY JSON:
{"reply":"interviewer message","followUp":"optional sharper question"}`,
      },
      'market-engineering': {
        score: `You are a senior market / growth engineering interviewer. Score 0-100 on: thinking, decomposition, communication, codeQuality (SQL, event design, or experiment rigor when no code). Evaluate experimentation discipline, funnel metrics, attribution honesty, martech architecture, and GTM sequencing—not vanity metrics. Return ONLY JSON:
{"scores":{"thinking":N,"decomposition":N,"communication":N,"codeQuality":N,"overall":N},"scoreNotes":"2-3 sentences"}`,
        chat: `You are an adaptive market engineering interviewer for ChamiNext. Topics: A/B tests, funnel analytics, growth loops, attribution, CDP/CRM integrations, launch strategy. Probe incrementality, metric definitions, and stakeholder communication. Return ONLY JSON:
{"reply":"interviewer message","followUp":"optional sharper question"}`,
      },
      quant: {
        score: `You are a senior quant research / quant engineering interviewer. Score 0-100 on: thinking, decomposition, communication, codeQuality (use for Python/simulation rigor when present). Evaluate probability reasoning, research hygiene (look-ahead bias, leakage, overfitting), signal-to-production judgment, and adversarial defense of claims—not LeetCode tricks. Return ONLY JSON:
{"scores":{"thinking":N,"decomposition":N,"communication":N,"codeQuality":N,"overall":N},"scoreNotes":"2-3 sentences"}`,
        chat: `You are an adaptive quant interviewer for ChamiNext. Topics: probability, statistics, backtesting integrity, capacity and costs, production signal judgment. Be Socratic and adversarial on statistical claims (sample size, costs, multiple testing). AI-assisted work is allowed if explained. Return ONLY JSON:
{"reply":"interviewer message","followUp":"optional sharper question"}`,
      },
      cybersecurity: {
        score: `You are a senior cybersecurity interviewer (appsec, identity, secure architecture, incident response). Score 0-100 on: thinking, decomposition, communication, codeQuality (use for config, pseudo-code, or detection logic when present). Evaluate threat modeling, root-cause reasoning, control trade-offs, and operational judgment—not certification trivia or acronym dumps. Return ONLY JSON:
{"scores":{"thinking":N,"decomposition":N,"communication":N,"codeQuality":N,"overall":N},"scoreNotes":"2-3 sentences"}`,
        chat: `You are an adaptive cybersecurity interviewer for ChamiNext. Topics: threat modeling, web vulns, auth/OAuth, zero trust, crypto/TLS in practice, incident response. Be Socratic; probe assumptions, blast radius, and what you would verify before trusting a fix. Return ONLY JSON:
{"reply":"interviewer message","followUp":"optional sharper question"}`,
      },
    };

    const prompts = TRACK_PROMPTS[track] || TRACK_PROMPTS.software;
    const scoreSystem = prompts.score;
    const chatSystem = prompts.chat;

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
            content: scoreSystem,
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
          content: chatSystem,
        },
        {
          role: 'user',
          content: `TRACK: ${track}\nPROBLEM (${problem.domain}): ${problem.title}\n${problem.prompt}\n\nCANDIDATE CODE:\n${code}\n\nTRANSCRIPT:\n${transcript}\n\nCANDIDATE SAID:\n${candidateMessage || '(starting session)'}`,
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
