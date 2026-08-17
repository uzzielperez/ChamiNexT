const { Groq } = require('groq-sdk');

const groqClient = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function chatViaGroq({ model, messages, temperature = 0.5, maxTokens = 2048 }) {
  if (!groqClient) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  const completion = await groqClient.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });
  return completion.choices[0]?.message?.content ?? '';
}

async function chatViaOpenRouter({ model, messages, temperature = 0.5, maxTokens = 2048 }) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://chaminext.netlify.app';

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': siteUrl,
      'X-Title': 'ChamiNexT Studio',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || data?.error || `OpenRouter HTTP ${res.status}`;
    throw new Error(String(msg));
  }

  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * Route a chat completion to Groq or OpenRouter.
 * @param {{ provider: 'groq'|'openrouter', model: string, messages: Array, temperature?: number, maxTokens?: number }} opts
 */
async function chatCompletion(opts) {
  const { provider, model, messages, temperature, maxTokens } = opts;
  if (provider === 'groq') {
    return chatViaGroq({ model, messages, temperature, maxTokens });
  }
  if (provider === 'openrouter') {
    return chatViaOpenRouter({ model, messages, temperature, maxTokens });
  }
  throw new Error(`Unknown provider: ${provider}`);
}

module.exports = { chatCompletion, chatViaGroq, chatViaOpenRouter };
