import type { InterviewMessage } from '../types/interview';
import {
  DEFAULT_STUDIO_MODEL_ID,
  loadStudioModelId,
  saveStudioModelId,
  type StudioModel,
  STUDIO_MODELS,
} from '../data/studioModels';

export type WorkspaceAgentContext = {
  title: string;
  brief: string;
  activePath: string;
  files: Record<string, string>;
  terminalLog?: string;
};

const QUICK_PROMPTS = [
  'Review my approach before I code more',
  'What edge cases should I test?',
  'Challenge one assumption in my design',
  'Suggest a minimal first commit scope',
] as const;

export const WORKSPACE_QUICK_PROMPTS = QUICK_PROMPTS;

export type StudioModelsResponse = {
  models: Array<{ id: string; provider: string; model: string; available: boolean }>;
  providers: { groq: boolean; openrouter: boolean };
  defaultModelId: string;
};

export async function fetchStudioModels(): Promise<StudioModelsResponse | null> {
  try {
    const res = await fetch('/.netlify/functions/workspace-agent');
    if (!res.ok) return null;
    return (await res.json()) as StudioModelsResponse;
  } catch {
    return null;
  }
}

export function getStudioModelLabel(modelId: string): string {
  return STUDIO_MODELS.find((m) => m.id === modelId)?.label ?? modelId;
}

export { loadStudioModelId, saveStudioModelId, STUDIO_MODELS, DEFAULT_STUDIO_MODEL_ID };
export type { StudioModel };

function buildMessages(history: InterviewMessage[], userText: string): InterviewMessage[] {
  const userMsg: InterviewMessage = {
    id: `ws-${Date.now()}`,
    role: 'candidate',
    content: userText,
    timestamp: new Date().toISOString(),
  };
  return [...history, userMsg];
}

const FALLBACK_REPLIES = [
  'Walk me through your plan for the active file.',
  'What edge cases would break your current approach?',
  'How would you verify this with npm test?',
  'What trade-off did you make in the last edit?',
];

function offlineReply(history: InterviewMessage[]): string {
  const turns = history.filter((m) => m.role === 'candidate').length;
  return `${FALLBACK_REPLIES[turns % FALLBACK_REPLIES.length]}\n\n(Offline — connect GROQ_API_KEY or OPENROUTER_API_KEY for live models.)`;
}

export async function callWorkspaceAgent(
  ctx: WorkspaceAgentContext,
  history: InterviewMessage[],
  userText: string,
  modelId: string = loadStudioModelId()
): Promise<{ reply: string; followUp?: string; messages: InterviewMessage[]; modelId: string }> {
  const prior = history.filter(
    (m) => m.role === 'candidate' || m.role === 'interviewer' || m.role === 'system'
  );

  const messages = buildMessages(prior, userText);

  try {
    const res = await fetch('/.netlify/functions/workspace-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelId,
        title: ctx.title,
        brief: ctx.brief,
        activePath: ctx.activePath,
        files: ctx.files,
        terminalLog: ctx.terminalLog ?? '',
        messages: prior,
        userMessage: userText,
      }),
    });

    if (res.status === 429) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || 'Rate limited — wait a minute.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || `Agent HTTP ${res.status}`);
    }

    const data = (await res.json()) as { reply?: string; modelId?: string };
    const reply = data.reply?.trim() || offlineReply(prior);

    const interviewerMsg: InterviewMessage = {
      id: `agent-${Date.now()}`,
      role: 'interviewer',
      content: reply,
      timestamp: new Date().toISOString(),
    };

    return {
      reply,
      messages: [...messages, interviewerMsg],
      modelId: data.modelId ?? modelId,
    };
  } catch (err) {
    const reply =
      err instanceof Error && err.message.includes('Rate limited')
        ? err.message
        : offlineReply(prior);

    const interviewerMsg: InterviewMessage = {
      id: `agent-${Date.now()}`,
      role: 'interviewer',
      content: reply,
      timestamp: new Date().toISOString(),
    };

    return {
      reply,
      messages: [...messages, interviewerMsg],
      modelId,
    };
  }
}
