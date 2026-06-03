import type { ShipTestChallenge } from '../types/interview';

export const shipTestChallenges: ShipTestChallenge[] = [
  {
    id: 'habit-tracker-24h',
    title: 'Habit Tracker',
    format: '24h',
    description: 'Ship a minimal habit tracker with daily check-ins and streaks.',
    pmBrief:
      'Users want a dead-simple habit tracker. MVP: add habit, mark done today, see streak. Mobile-friendly.',
    constraints: ['No auth required for MVP', 'Must be deployable via public URL'],
    exampleDeliverables: ['Live URL', 'README with tradeoffs', '1-min demo script'],
  },
  {
    id: 'rag-chatbot-72h',
    title: 'Document Q&A Bot',
    format: '72h',
    description: 'Build a RAG-based chatbot over uploaded markdown or PDF snippets.',
    pmBrief:
      'Team leads need to query internal docs. Start with 3–5 sample documents and citations in answers.',
    constraints: ['Show source snippets', 'Handle empty retrieval gracefully'],
    exampleDeliverables: ['Deployed app', 'Architecture diagram', 'Cost estimate note'],
  },
  {
    id: 'micro-saas-7d',
    title: 'Micro-SaaS MVP',
    format: '7d',
    description: 'Pick a niche productivity problem and ship payments + accounts.',
    pmBrief:
      'Validate a tiny paid workflow. Stripe test mode is fine. Focus on one killer workflow.',
    constraints: ['Auth required', 'One paid tier', 'Onboarding < 2 minutes'],
    exampleDeliverables: ['Production URL', 'Pricing page', 'Post-mortem: what you cut'],
  },
];

export const formatDurationMs: Record<string, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '72h': 72 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
};
