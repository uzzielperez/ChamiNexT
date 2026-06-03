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

const FALLBACK_REPLIES = [
  'Walk me through your approach before optimizing.',
  'What tradeoff did you choose and what would you do with more time?',
  'How would you test this? Any edge cases you are worried about?',
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

  const idx = payload.messages.length % FALLBACK_REPLIES.length;
  return {
    reply: FALLBACK_REPLIES[idx],
    followUp: 'Can you explain the complexity of your solution?',
  };
}
