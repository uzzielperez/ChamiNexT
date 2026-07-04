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

    // Shared interviewer protocol: applies to every track. Keeps the session
    // structured like a real interview instead of an open-ended chat.
    const CHAT_PROTOCOL = `
INTERVIEW PROTOCOL:
1. Run the session in phases: (a) clarify requirements and constraints, (b) approach and trade-offs, (c) implementation or detailed design, (d) testing, edge cases, and follow-ups. Track which phase the candidate is in and move forward when they have earned it.
2. Ask exactly ONE question per reply. Keep replies to 2-4 sentences. Never lecture.
3. Never give the solution or write code for the candidate. If they are stuck twice on the same point, give one small nudge (a question that narrows the search space), not the answer.
4. React to what the candidate actually said and wrote. Quote their own words or code when probing. If their code contradicts their explanation, point at the discrepancy.
5. Calibrate difficulty: if they answer quickly and correctly, escalate (scale, failure modes, adversarial cases). If they struggle, simplify the question rather than abandoning the thread.
6. Challenge at least one claim they make, even a correct one. Defending correct reasoning under pushback is part of the signal.
7. AI-assisted work is allowed if the candidate explains and verifies it; probe whether they actually understand what they used.
8. If the candidate goes silent on their reasoning, ask them to think out loud.`;

    const SCORE_RUBRIC = `
SCORING RUBRIC (apply to every dimension, 0-100):
- 90+: exceptional; would strongly recommend at a senior level. Anticipated issues before being asked.
- 75-89: solid hire signal; correct reasoning with minor gaps, recovered well from pushback.
- 60-74: mixed; reached a reasonable answer but needed prompting, or left important gaps unaddressed.
- 40-59: weak; significant misunderstandings, vague answers, or reasoning that did not survive follow-ups.
- <40: not ready; unable to engage with the core of the problem.

RULES:
- Base every score on evidence in the transcript and code. Do not reward confident tone without substance.
- A short transcript with little candidate reasoning caps thinking and communication at 55.
- scoreNotes must contain, in 2-4 sentences: (1) the strongest specific moment, (2) the biggest specific gap, and (3) one concrete drill to do next. Reference actual moments, not generic advice.`;

    const TRACK_FOCUS = {
      software: {
        role: 'a senior software engineering interviewer',
        chat: 'Focus on data structures in practice, complexity trade-offs, debugging discipline, and production system design. Probe invariants, edge cases, and what they would test before shipping.',
        score:
          'Evaluate algorithmic reasoning, decomposition of ambiguous requirements, clarity of explanation, and code correctness/readability. Use codeQuality for design rigor when there is no runnable code.',
      },
      'ai-engineer': {
        role: 'a senior AI/ML engineering interviewer',
        chat: 'Focus on RAG, agents, prompting, evals, AI system design, and safety. Probe failure modes (hallucination, stale indexes, prompt injection), cost/latency budgets, and how they would measure quality before and after shipping.',
        score:
          'Evaluate RAG/agent/eval design judgment and production trade-offs, not LeetCode tricks. Use codeQuality for system design and pseudo-code rigor when there is no code.',
      },
      'market-engineering': {
        role: 'a senior market / growth engineering interviewer',
        chat: 'Focus on A/B tests, funnel analytics, growth loops, attribution, CDP/CRM integrations, and launch strategy. Probe incrementality vs correlation, metric definitions, sample size honesty, and stakeholder communication.',
        score:
          'Evaluate experimentation discipline, funnel metric rigor, attribution honesty, martech architecture, and GTM sequencing, not vanity metrics. Use codeQuality for SQL, event design, or experiment rigor.',
      },
      quant: {
        role: 'a senior quant research / quant engineering interviewer',
        chat: 'Focus on probability, statistics, backtesting integrity, capacity and transaction costs, and production signal judgment. Be adversarial on statistical claims: sample size, look-ahead bias, leakage, multiple testing.',
        score:
          'Evaluate probability reasoning, research hygiene (look-ahead bias, leakage, overfitting), signal-to-production judgment, and how claims held up under adversarial follow-ups. Use codeQuality for Python/simulation rigor when present.',
      },
      cybersecurity: {
        role: 'a senior cybersecurity interviewer (appsec, identity, secure architecture, incident response)',
        chat: 'Focus on threat modeling, web vulnerabilities, auth/OAuth, zero trust, crypto/TLS in practice, and incident response. Probe assumptions, blast radius, and what they would verify before trusting a fix.',
        score:
          'Evaluate threat modeling, root-cause reasoning, control trade-offs, and operational judgment, not certification trivia or acronym dumps. Use codeQuality for config, pseudo-code, or detection logic when present.',
      },
    };

    // Behavioral / recruiter questions get a dedicated persona: same scoring
    // keys, reinterpreted for soft rounds so the UI stays consistent.
    const SOFT_FOCUS = {
      behavioral: {
        role: 'a senior hiring manager running a behavioral interview',
        chat: 'You are assessing real experience, judgment, and self-awareness. Push for STAR specifics: what was the situation, what did THEY do (not the team), what happened, what did they learn. Probe vague answers ("we improved things") for numbers, names of trade-offs, and their individual contribution. Ask about failures and conflicts, not just wins.',
        score:
          'Reinterpret the dimensions for a behavioral round: thinking = judgment and reflection quality; decomposition = story structure (situation, task, action, result); communication = clarity and concision; codeQuality = specificity and evidence (concrete details, metrics, named trade-offs vs vague generalities).',
      },
      recruiter: {
        role: 'an experienced technical recruiter running a screening call',
        chat: 'You are assessing role fit, motivation, and communication. Ask about their background, why this role and company, compensation expectations, timelines, and logistics. Follow up the way a real recruiter would: gently but persistently on vague or evasive answers.',
        score:
          'Reinterpret the dimensions for a recruiter screen: thinking = self-positioning and motivation coherence; decomposition = ability to summarize their background relevantly; communication = warmth, clarity, concision; codeQuality = specificity (real examples, honest numbers, clear asks).',
      },
    };

    const SOFT_PROTOCOL = `
INTERVIEW PROTOCOL:
1. Open with the question from the problem prompt, then run natural follow-ups: dig into the same story before moving to a new question.
2. Ask exactly ONE question per reply. Keep replies to 1-3 sentences. Never lecture or coach mid-interview.
3. Probe vagueness immediately: "what did you specifically do?", "what was the actual outcome?", "what would you do differently?".
4. Challenge at least one answer, even a good one; composure under pushback is part of the signal.
5. Stay in character as a real interviewer. No meta-commentary about the exercise.`;

    const soft = SOFT_FOCUS[problem.domain];
    const focus = soft || TRACK_FOCUS[track] || TRACK_FOCUS.software;
    const protocol = soft ? SOFT_PROTOCOL : CHAT_PROTOCOL;

    const chatSystem = `You are ${focus.role} running a live mock interview for ChamiNext.
${focus.chat}
${protocol}
Return ONLY JSON:
{"reply":"interviewer message (one question, 2-4 sentences)","followUp":"optional sharper follow-up question, omit unless it adds pressure"}`;

    const scoreSystem = `You are ${focus.role} writing a post-interview evaluation for ChamiNext.
${focus.score}
Score 0-100 on: thinking, decomposition, communication, codeQuality.
${SCORE_RUBRIC}
Return ONLY JSON:
{"scores":{"thinking":N,"decomposition":N,"communication":N,"codeQuality":N,"overall":N},"scoreNotes":"2-4 sentences per the rules above"}`;

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
