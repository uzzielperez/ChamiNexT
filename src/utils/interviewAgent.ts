import type { InterviewMessage, InterviewScores } from '../types/interview';
import type { PracticeProblem } from '../types/interview';

export interface InterviewAgentRequest {
  problem: PracticeProblem;
  code: string;
  messages: InterviewMessage[];
  action: 'chat' | 'score';
  candidateMessage?: string;
}

export interface InterviewAgentResponse {
  reply?: string;
  followUp?: string;
  scores?: InterviewScores;
  scoreNotes?: string;
}

// Ordered like a real interview: clarify, approach, trade-offs, testing, wrap-up.
const FALLBACK_REPLIES = [
  'Before you start: what constraints or requirements would you clarify first?',
  'Walk me through your approach at a high level before writing any code.',
  'What trade-off did you just make, and what would you do differently with more time?',
  'What is the time and space complexity, and where is the bottleneck?',
  'How would you test this? Name the edge cases you are most worried about.',
  'If the input were 100x larger, what would break first?',
];

export async function callInterviewAgent(
  payload: InterviewAgentRequest
): Promise<InterviewAgentResponse> {
  try {
    const res = await fetch('/.netlify/functions/interview-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.status === 429) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { error?: string }).error || 'Too many requests. Please wait a minute.'
      );
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return fallbackAgent(payload);
  }
}

function fallbackAgent(payload: InterviewAgentRequest): InterviewAgentResponse {
  if (payload.action === 'score') {
    const base = 62 + Math.min(28, payload.messages.filter((m) => m.role === 'candidate').length * 4);
    const scores: InterviewScores = {
      thinking: base,
      decomposition: base - 3,
      communication: base + 2,
      codeQuality: base - 5,
      overall: base,
    };
    return {
      scores,
      scoreNotes:
        'Sample scores (connect GROQ_API_KEY for live AI evaluation). Replay this session to improve weak areas.',
    };
  }

  const candidateTurns = payload.messages.filter((m) => m.role === 'candidate').length;
  const idx = Math.min(candidateTurns, FALLBACK_REPLIES.length - 1);
  return {
    reply: FALLBACK_REPLIES[idx],
  };
}
