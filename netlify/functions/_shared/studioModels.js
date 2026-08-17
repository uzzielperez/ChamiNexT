/** Server-side studio model allowlist (keep in sync with src/data/studioModels.ts). */

const STUDIO_MODELS = [
  { id: 'groq:llama-3.3-70b-versatile', provider: 'groq', model: 'llama-3.3-70b-versatile' },
  { id: 'groq:llama-3.1-8b-instant', provider: 'groq', model: 'llama-3.1-8b-instant' },
  { id: 'openrouter:deepseek/deepseek-chat', provider: 'openrouter', model: 'deepseek/deepseek-chat' },
  { id: 'openrouter:deepseek/deepseek-r1', provider: 'openrouter', model: 'deepseek/deepseek-r1' },
  { id: 'openrouter:qwen/qwen-2.5-coder-32b-instruct', provider: 'openrouter', model: 'qwen/qwen-2.5-coder-32b-instruct' },
  { id: 'openrouter:meta-llama/llama-3.3-70b-instruct', provider: 'openrouter', model: 'meta-llama/llama-3.3-70b-instruct' },
  { id: 'openrouter:meta-llama/llama-3.1-405b-instruct', provider: 'openrouter', model: 'meta-llama/llama-3.1-405b-instruct' },
];

const DEFAULT_MODEL_ID = 'groq:llama-3.3-70b-versatile';

function hasGroq() {
  return Boolean(process.env.GROQ_API_KEY);
}

function hasOpenRouter() {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

function resolveModel(modelId) {
  const id = modelId || DEFAULT_MODEL_ID;
  const entry = STUDIO_MODELS.find((m) => m.id === id) || STUDIO_MODELS.find((m) => m.id === DEFAULT_MODEL_ID);
  if (!entry) return null;
  if (entry.provider === 'groq' && !hasGroq()) return null;
  if (entry.provider === 'openrouter' && !hasOpenRouter()) return null;
  return entry;
}

function listAvailableModels() {
  return STUDIO_MODELS.filter((m) => {
    if (m.provider === 'groq') return hasGroq();
    if (m.provider === 'openrouter') return hasOpenRouter();
    return false;
  }).map((m) => ({
    id: m.id,
    provider: m.provider,
    model: m.model,
    available: true,
  }));
}

module.exports = {
  STUDIO_MODELS,
  DEFAULT_MODEL_ID,
  resolveModel,
  listAvailableModels,
  hasGroq,
  hasOpenRouter,
};
