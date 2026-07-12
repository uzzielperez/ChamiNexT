/** Spotify-style cover art for lessons — gradient + tagline until custom images ship. */

export interface LessonCover {
  gradient: string;
  icon: string;
  problemYouSolve: string;
}

const TRACK_DEFAULTS: Record<string, LessonCover> = {
  software: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    icon: 'code-2',
    problemYouSolve: 'Pass the technical screen on fundamentals',
  },
  'ai-engineer': {
    gradient: 'linear-gradient(135deg, #312e81 0%, #7c3aed 100%)',
    icon: 'brain',
    problemYouSolve: 'Prove you can ship AI systems safely',
  },
  quant: {
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0891b2 100%)',
    icon: 'line-chart',
    problemYouSolve: 'Reason under uncertainty with rigor',
  },
  cybersecurity: {
    gradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)',
    icon: 'shield',
    problemYouSolve: 'Think like an attacker and a defender',
  },
  'market-engineering': {
    gradient: 'linear-gradient(135deg, #713f12 0%, #ca8a04 100%)',
    icon: 'trending-up',
    problemYouSolve: 'Connect systems to market outcomes',
  },
  'ai-for-science': {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    icon: 'flask-conical',
    problemYouSolve: 'Ship research-grade ML responsibly',
  },
};

const LEAF_OVERRIDES: Record<string, Partial<LessonCover>> = {
  decomposition: {
    gradient: 'linear-gradient(135deg, #1e40af 0%, #38bdf8 100%)',
    icon: 'git-branch',
    problemYouSolve: 'Break ambiguous problems before you code',
  },
  arrays: {
    gradient: 'linear-gradient(135deg, #4338ca 0%, #818cf8 100%)',
    icon: 'layout-grid',
    problemYouSolve: 'Two pointers, sliding windows, invariants',
  },
  trees: {
    gradient: 'linear-gradient(135deg, #065f46 0%, #34d399 100%)',
    icon: 'network',
    problemYouSolve: 'Traversals, recursion, graph intuition',
  },
  strings: {
    gradient: 'linear-gradient(135deg, #9a3412 0%, #fb923c 100%)',
    icon: 'type',
    problemYouSolve: 'Parse, hash, and reason character-by-character',
  },
  debugging: {
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #f87171 100%)',
    icon: 'bug',
    problemYouSolve: 'Find root cause when the clock is ticking',
  },
  'system-design-swe': {
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)',
    icon: 'server',
    problemYouSolve: 'Scale, latency, and trade-offs out loud',
  },
  'ai-collaboration-swe': {
    gradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
    icon: 'sparkles',
    problemYouSolve: 'Use AI without losing ownership of decisions',
  },
  'rag-fundamentals': {
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)',
    icon: 'book-open',
    problemYouSolve: 'Ground LLMs in real documents',
  },
};

export function getLessonCover(leafId: string, track: string): LessonCover {
  const base = TRACK_DEFAULTS[track] ?? TRACK_DEFAULTS.software;
  const override = LEAF_OVERRIDES[leafId];
  return { ...base, ...override };
}
