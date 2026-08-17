const { checkRateLimit, rateLimitResponse } = require('./_shared/rateLimit');
const { chatCompletion } = require('./_shared/llmRouter.cjs');
const {
  resolveModel,
  listAvailableModels,
  DEFAULT_MODEL_ID,
  hasGroq,
  hasOpenRouter,
} = require('./_shared/studioModels.cjs');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const STUDIO_SYSTEM = `You are the coding agent in ChamiNexT Studio — a browser IDE for Work Tickets (like Cursor).
Candidates may use AI; every prompt they send you is logged for employer review.

Your job: sharp pair-programmer — reviews, edge cases, test ideas, architecture pushback, debugging hints.
NOT a solution vending machine.

Rules:
1. Read the ticket brief, active file, workspace files, and terminal output before replying.
2. Keep replies concise (3-8 sentences). Use short bullet lists when helpful.
3. Reference specific symbols, functions, or lines in their code when critiquing.
4. Do not dump full file rewrites unless they explicitly ask for code AND you've already nudged twice.
5. If tests fail, help interpret failures — guide, don't silently fix everything.
6. Plain text only. No JSON wrappers.`;

const DEMO_REPLIES = [
  'Walk me through your plan for the active file before you write more code.',
  'What edge cases would break your current approach?',
  'How would you verify this with npm test?',
  'Challenge one assumption in your design — what if traffic is 10x?',
];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        models: listAvailableModels(),
        providers: {
          groq: hasGroq(),
          openrouter: hasOpenRouter(),
        },
        defaultModelId: DEFAULT_MODEL_ID,
      }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const rl = checkRateLimit(event, 'workspace-agent', 40);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterSec, corsHeaders);

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      modelId = DEFAULT_MODEL_ID,
      title = 'Work Ticket',
      brief = '',
      activePath = '',
      files = {},
      terminalLog = '',
      messages = [],
      userMessage = '',
    } = body;

    const resolved = resolveModel(modelId);
    const anyProvider = hasGroq() || hasOpenRouter();

    if (!anyProvider || !resolved) {
      const turn = messages.filter((m) => m.role === 'candidate').length;
      const reply = DEMO_REPLIES[turn % DEMO_REPLIES.length];
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          reply: `${reply}\n\n(Demo mode — set GROQ_API_KEY and/or OPENROUTER_API_KEY on Netlify for live models.)`,
          modelId: 'demo',
          provider: 'demo',
          demo: true,
        }),
      };
    }

    const fileSummary = Object.keys(files)
      .sort()
      .map((p) => `--- ${p} ---\n${String(files[p]).slice(0, 2500)}`)
      .join('\n\n');

    const transcript = messages
      .filter((m) => m.role === 'candidate' || m.role === 'interviewer')
      .map((m) => `${m.role === 'candidate' ? 'Candidate' : 'Agent'}: ${m.content}`)
      .join('\n');

    const userContent = [
      `TICKET: ${title}`,
      brief ? `BRIEF: ${brief}` : '',
      activePath ? `ACTIVE FILE: ${activePath}` : '',
      '',
      'WORKSPACE FILES:',
      fileSummary.slice(0, 12000),
      terminalLog ? `\nTERMINAL (recent):\n${String(terminalLog).slice(-2000)}` : '',
      transcript ? `\nPRIOR CHAT:\n${transcript.slice(-6000)}` : '',
      `\nCANDIDATE PROMPT:\n${userMessage || '(empty)'}`,
    ]
      .filter(Boolean)
      .join('\n');

    const chatMessages = [
      { role: 'system', content: STUDIO_SYSTEM },
      { role: 'user', content: userContent },
    ];

    const text = await chatCompletion({
      provider: resolved.provider,
      model: resolved.model,
      messages: chatMessages,
      temperature: 0.55,
      maxTokens: 1800,
    });

    const reply = (text || '').trim() || 'Tell me what you changed since the last run.';

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        reply,
        modelId: resolved.id,
        provider: resolved.provider,
        model: resolved.model,
      }),
    };
  } catch (err) {
    console.error('workspace-agent error', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: err instanceof Error ? err.message : 'Workspace agent failed',
      }),
    };
  }
};
