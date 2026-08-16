import type { InterviewMessage } from '../types/interview';
import type { PracticeProblem } from '../types/interview';
import { callInterviewAgent } from './interviewAgent';

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

function buildSyntheticProblem(ctx: WorkspaceAgentContext): PracticeProblem {
  const fileSummary = Object.keys(ctx.files)
    .sort()
    .map((p) => `- ${p} (${ctx.files[p].split('\n').length} lines)`)
    .join('\n');

  return {
    id: 'workspace-studio',
    title: ctx.title,
    track: 'software',
    domain: 'technical',
    difficulty: 'medium',
    estimatedMinutes: 45,
    prompt: `${ctx.brief}\n\nWorkspace files:\n${fileSummary}\n\nActive file: ${ctx.activePath}`,
    starterCode: ctx.files[ctx.activePath] ?? '',
    hints: [],
    runLanguage: 'javascript',
  };
}

function buildMessages(history: InterviewMessage[], userText: string): InterviewMessage[] {
  const userMsg: InterviewMessage = {
    id: `ws-${Date.now()}`,
    role: 'candidate',
    content: userText,
    timestamp: new Date().toISOString(),
  };
  return [...history, userMsg];
}

export async function callWorkspaceAgent(
  ctx: WorkspaceAgentContext,
  history: InterviewMessage[],
  userText: string
): Promise<{ reply: string; followUp?: string; messages: InterviewMessage[] }> {
  const problem = buildSyntheticProblem(ctx);
  const code = [
    `// Active: ${ctx.activePath}`,
    ctx.files[ctx.activePath] ?? '',
    '',
    '// --- other files (truncated) ---',
    ...Object.entries(ctx.files)
      .filter(([p]) => p !== ctx.activePath)
      .map(([p, c]) => `// ${p}\n${c.slice(0, 400)}${c.length > 400 ? '\n// ...' : ''}`),
    ctx.terminalLog ? `\n// Terminal\n${ctx.terminalLog.slice(-800)}` : '',
  ].join('\n\n');

  const prior = history.map((m) => ({
    ...m,
    role: m.role === 'interviewer' ? 'interviewer' : m.role,
  })) as InterviewMessage[];

  const messages = buildMessages(
    prior.map((m) =>
      m.role === 'candidate' || m.role === 'interviewer' || m.role === 'system'
        ? m
        : { ...m, role: 'system' as const }
    ),
    userText
  );

  const res = await callInterviewAgent({
    problem,
    code,
    messages,
    action: 'chat',
    candidateMessage: userText,
  });

  const interviewerMsg: InterviewMessage = {
    id: `agent-${Date.now()}`,
    role: 'interviewer',
    content: res.reply ?? 'Walk me through your plan for the active file.',
    timestamp: new Date().toISOString(),
  };

  const extra: InterviewMessage[] = [interviewerMsg];
  if (res.followUp) {
    extra.push({
      id: `agent-fu-${Date.now()}`,
      role: 'interviewer',
      content: res.followUp,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    reply: res.reply ?? interviewerMsg.content,
    followUp: res.followUp,
    messages: [...messages, ...extra],
  };
}
