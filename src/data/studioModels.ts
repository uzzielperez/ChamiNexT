/** Studio coding-agent models — client catalog. Server allowlist in netlify/functions/_shared/studioModels.js */

export type StudioModelProvider = 'groq' | 'openrouter';

export type StudioModel = {
  id: string;
  provider: StudioModelProvider;
  model: string;
  label: string;
  description: string;
  badge?: string;
};

export const STUDIO_MODELS: StudioModel[] = [
  {
    id: 'groq:llama-3.3-70b-versatile',
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    label: 'Llama 3.3 70B',
    description: 'Default Groq — fast, strong reasoning',
    badge: 'Groq',
  },
  {
    id: 'groq:llama-3.1-8b-instant',
    provider: 'groq',
    model: 'llama-3.1-8b-instant',
    label: 'Llama 3.1 8B',
    description: 'Groq instant — lowest latency',
    badge: 'Groq',
  },
  {
    id: 'openrouter:deepseek/deepseek-chat',
    provider: 'openrouter',
    model: 'deepseek/deepseek-chat',
    label: 'DeepSeek Chat',
    description: 'Strong coding + reasoning via OpenRouter',
    badge: 'OpenRouter',
  },
  {
    id: 'openrouter:deepseek/deepseek-r1',
    provider: 'openrouter',
    model: 'deepseek/deepseek-r1',
    label: 'DeepSeek R1',
    description: 'Chain-of-thought style reasoning',
    badge: 'OpenRouter',
  },
  {
    id: 'openrouter:qwen/qwen-2.5-coder-32b-instruct',
    provider: 'openrouter',
    model: 'qwen/qwen-2.5-coder-32b-instruct',
    label: 'Qwen 2.5 Coder 32B',
    description: 'Code-specialized model',
    badge: 'OpenRouter',
  },
  {
    id: 'openrouter:meta-llama/llama-3.3-70b-instruct',
    provider: 'openrouter',
    model: 'meta-llama/llama-3.3-70b-instruct',
    label: 'Llama 3.3 70B (OR)',
    description: 'Llama via OpenRouter routing',
    badge: 'OpenRouter',
  },
  {
    id: 'openrouter:meta-llama/llama-3.1-405b-instruct',
    provider: 'openrouter',
    model: 'meta-llama/llama-3.1-405b-instruct',
    label: 'Llama 3.1 405B',
    description: 'Large Llama for hard tickets',
    badge: 'OpenRouter',
  },
];

export const DEFAULT_STUDIO_MODEL_ID = 'groq:llama-3.3-70b-versatile';

const MODEL_KEY = 'chaminext_studio_model';

export function getStudioModelById(id: string): StudioModel | undefined {
  return STUDIO_MODELS.find((m) => m.id === id);
}

export function loadStudioModelId(): string {
  try {
    const saved = localStorage.getItem(MODEL_KEY);
    if (saved && STUDIO_MODELS.some((m) => m.id === saved)) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_STUDIO_MODEL_ID;
}

export function saveStudioModelId(id: string): void {
  try {
    localStorage.setItem(MODEL_KEY, id);
  } catch {
    /* ignore */
  }
}

export function parseStudioModelId(id: string): { provider: StudioModelProvider; model: string } | null {
  const entry = getStudioModelById(id);
  if (!entry) return null;
  return { provider: entry.provider, model: entry.model };
}
