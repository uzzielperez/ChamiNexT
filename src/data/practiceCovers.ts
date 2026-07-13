import type { PracticeProblem, PracticeTrack, ProblemDomain, ShipTestChallenge } from '../types/interview';
import { getLessonCover, type LessonCover } from './lessonCovers';

export type { LessonCover as PracticeCover };

const DOMAIN_COVERS: Partial<Record<ProblemDomain, LessonCover>> = {
  arrays: {
    gradient: 'linear-gradient(135deg, #4338ca 0%, #818cf8 100%)',
    icon: 'layout-grid',
    problemYouSolve: 'Arrays, two pointers, sliding windows',
  },
  trees: {
    gradient: 'linear-gradient(135deg, #065f46 0%, #34d399 100%)',
    icon: 'network',
    problemYouSolve: 'Trees, graphs, traversals',
  },
  strings: {
    gradient: 'linear-gradient(135deg, #9a3412 0%, #fb923c 100%)',
    icon: 'type',
    problemYouSolve: 'Parse and transform strings under pressure',
  },
  debugging: {
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #f87171 100%)',
    icon: 'bug',
    problemYouSolve: 'Find root cause when time is tight',
  },
  'system-design': {
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)',
    icon: 'server',
    problemYouSolve: 'Scale, latency, trade-offs out loud',
  },
  rag: {
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)',
    icon: 'book-open',
    problemYouSolve: 'Retrieval, grounding, citation',
  },
  agents: {
    gradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
    icon: 'sparkles',
    problemYouSolve: 'Orchestrate tools and multi-step flows',
  },
  prompting: {
    gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
    icon: 'brain',
    problemYouSolve: 'Prompt design and eval intuition',
  },
  evals: {
    gradient: 'linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)',
    icon: 'scale',
    problemYouSolve: 'Measure model quality rigorously',
  },
  'ai-system-design': {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    icon: 'server',
    problemYouSolve: 'Design production AI systems',
  },
  safety: {
    gradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)',
    icon: 'shield',
    problemYouSolve: 'Guardrails, abuse, responsible deploy',
  },
  behavioral: {
    gradient: 'linear-gradient(135deg, #581c87 0%, #db2777 100%)',
    icon: 'heart-handshake',
    problemYouSolve: 'STAR stories — the round that decides offers',
  },
  recruiter: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0f766e 100%)',
    icon: 'users',
    problemYouSolve: 'Pass the recruiter screen with clarity',
  },
  'research-ethics': {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
    icon: 'shield',
    problemYouSolve: 'Ethics probes at mission-driven labs',
  },
  'mission-problems': {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    icon: 'flask-conical',
    problemYouSolve: 'Deep mission-shaped technical screens',
  },
  experimentation: {
    gradient: 'linear-gradient(135deg, #713f12 0%, #eab308 100%)',
    icon: 'line-chart',
    problemYouSolve: 'Design and read experiments',
  },
  'funnel-analytics': {
    gradient: 'linear-gradient(135deg, #831843 0%, #ec4899 100%)',
    icon: 'trending-up',
    problemYouSolve: 'Funnels, conversion, product metrics',
  },
};

export interface PracticeModeCard {
  id: string;
  title: string;
  tagline: string;
  href?: string;
  cover: LessonCover;
  badge?: string;
}

export const PRACTICE_MODE_CARDS: PracticeModeCard[] = [
  {
    id: 'loop',
    title: 'Interview Loop',
    tagline: 'Full company-style loop — recruiter, technical, behavioral',
    href: '/loop',
    cover: {
      gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      icon: 'target',
      problemYouSolve: 'Simulate the full hiring loop end-to-end',
    },
    badge: '3 stages',
  },
  {
    id: 'drill',
    title: 'Rapid-fire drill',
    tagline: '5 minutes · 8 screening questions · graded',
    href: '/drill',
    cover: {
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
      icon: 'sparkles',
      problemYouSolve: 'Warm up before a real screen',
    },
    badge: '5 min',
  },
  {
    id: 'soft-skills',
    title: 'Ethics & soft skills',
    tagline: 'Sample Q&A + behavioral mocks (VERVE-style)',
    href: '/coaching/ethics-soft-skills',
    cover: {
      gradient: 'linear-gradient(135deg, #581c87 0%, #db2777 100%)',
      icon: 'heart-handshake',
      problemYouSolve: 'The round that decides the offer',
    },
    badge: '7 episodes',
  },
  {
    id: 'project-walkthrough',
    title: 'Project walkthrough',
    tagline: 'Deployment, tests, PRs — defend your decisions',
    href: '/coaching/project-walkthrough',
    cover: {
      gradient: 'linear-gradient(135deg, #1e3a5f 0%, #6366f1 100%)',
      icon: 'layers',
      problemYouSolve: 'The onsite story that replaces feature tours',
    },
    badge: '6 episodes',
  },
  {
    id: 'ship',
    title: 'Ship Tests',
    tagline: 'Work Tickets & sprints — build real output, AI allowed',
    cover: {
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #f97316 100%)',
      icon: 'rocket',
      problemYouSolve: 'Replace whiteboard puzzles with a scoped PR',
    },
    badge: 'VERVE',
  },
  {
    id: 'skills',
    title: 'Skill trees',
    tagline: 'Fundamentals for all six tracks — every problem mapped',
    href: '/skills',
    cover: {
      gradient: 'linear-gradient(135deg, #134e4a 0%, #0891b2 100%)',
      icon: 'git-branch',
      problemYouSolve: 'See what to drill before the mock',
    },
  },
  {
    id: 'intel',
    title: 'Interview intel',
    tagline: 'Real processes and exact questions from the field',
    href: '/intel',
    cover: {
      gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
      icon: 'brain',
      problemYouSolve: 'Know what they actually ask before you walk in',
    },
  },
  {
    id: 'frontier',
    title: 'Frontier tests',
    tagline: 'Climate, health, poverty, ethics — DeepMind-style',
    href: '/frontier',
    cover: {
      gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
      icon: 'flask-conical',
      problemYouSolve: 'Mission probes with explicit ethics gates',
    },
  },
  {
    id: 'quant-hm',
    title: 'Quant HM prep',
    tagline: 'Research hygiene + production — SIG / systematic fund style',
    href: '/coaching/quant-hm-prep',
    cover: {
      gradient: 'linear-gradient(135deg, #134e4a 0%, #0891b2 100%)',
      icon: 'line-chart',
      problemYouSolve: 'Pass the hiring manager judgment filter',
    },
    badge: '4 episodes',
  },
  {
    id: 'journey',
    title: 'Hiring journey',
    tagline: 'Choose your adventure — CV → ship → soft skills',
    href: '/journey',
    cover: {
      gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
      icon: 'target',
      problemYouSolve: 'See the full loop before you are in it',
    },
  },
];

const SHIP_FORMAT_COVERS: Record<string, LessonCover> = {
  ticket: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    icon: 'rocket',
    problemYouSolve: 'Fork, implement, open a PR — AI allowed',
  },
  '24h': {
    gradient: 'linear-gradient(135deg, #1e40af 0%, #38bdf8 100%)',
    icon: 'rocket',
    problemYouSolve: 'Ship a deployable MVP in 24 hours',
  },
  '72h': {
    gradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
    icon: 'rocket',
    problemYouSolve: 'Multi-day build with PM + reviewer personas',
  },
  '7d': {
    gradient: 'linear-gradient(135deg, #134e4a 0%, #059669 100%)',
    icon: 'rocket',
    problemYouSolve: 'Week-long sprint — production-grade output',
  },
};

const SHIP_FORMAT_LABEL: Record<string, string> = {
  ticket: '4h Work Ticket',
  '24h': '24h Sprint',
  '72h': '72h Build',
  '7d': '7-Day Sprint',
};

export function getPracticeProblemCover(problem: PracticeProblem): LessonCover {
  const domainCover = DOMAIN_COVERS[problem.domain];
  if (domainCover) return domainCover;
  return getLessonCover(problem.domain, problem.track);
}

export function getShipTestCover(challenge: ShipTestChallenge): LessonCover {
  if (challenge.track === 'quant') {
    return {
      gradient: 'linear-gradient(135deg, #134e4a 0%, #0891b2 100%)',
      icon: 'line-chart',
      problemYouSolve:
        challenge.description.slice(0, 90) + (challenge.description.length > 90 ? '…' : ''),
    };
  }
  const base = SHIP_FORMAT_COVERS[challenge.format] ?? SHIP_FORMAT_COVERS['24h'];
  return {
    ...base,
    problemYouSolve: challenge.description.slice(0, 80) + (challenge.description.length > 80 ? '…' : ''),
  };
}

export function getShipFormatLabel(format: string): string {
  return SHIP_FORMAT_LABEL[format] ?? format;
}

export function problemTagline(problem: PracticeProblem): string {
  return getPracticeProblemCover(problem).problemYouSolve;
}

export const TRACK_LABELS: Record<PracticeTrack, string> = {
  software: 'Software',
  'ai-engineer': 'AI Engineer',
  quant: 'Quant',
  cybersecurity: 'Cybersecurity',
  'market-engineering': 'Market Eng',
  'ai-for-science': 'AI for Science',
};
