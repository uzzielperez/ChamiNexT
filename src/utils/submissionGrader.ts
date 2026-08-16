import type { GradedPrompt, PromptRecord, StudioSubmission } from '../types/studioSubmission';
import { buildEmployerAssessment } from './employerAssessment';

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function gradePromptHeuristic(prompt: PromptRecord): GradedPrompt {
  const t = prompt.text.toLowerCase();
  const flags: string[] = [];

  let decomposition = 52;
  if (/constraint|requirement|edge|case|scope|assumption/.test(t)) decomposition += 18;
  if (/approach|design|architecture|trade.?off|bucket|window/.test(t)) decomposition += 12;
  if (t.length < 24) {
    decomposition -= 12;
    flags.push('Very short prompt — weak decomposition signal');
  }
  if (/just give|write the code|complete solution/.test(t)) {
    decomposition -= 20;
    flags.push('Asked for solution without reasoning');
  }

  let verification = 50;
  if (/test|verify|assert|lint|ci|npm test/.test(t)) verification += 20;
  if (/how do i know|validate|check/.test(t)) verification += 12;

  let iteration = 48;
  if (/retry|iterate|fix|refactor|improve|second pass/.test(t)) iteration += 15;
  if (/review my|before i code|minimal first/.test(t)) iteration += 10;

  let aiDisclosure = 45;
  if (/ai|copilot|chatgpt|claude|assistant|disclose/.test(t)) aiDisclosure += 25;
  if (prompt.source === 'terminal' && t.startsWith('agent ')) aiDisclosure += 5;

  const scores = {
    decomposition: clamp(decomposition),
    verification: clamp(verification),
    iteration: clamp(iteration),
    aiDisclosure: clamp(aiDisclosure),
  };
  const overall = clamp(
    scores.decomposition * 0.35 +
      scores.verification * 0.25 +
      scores.iteration * 0.2 +
      scores.aiDisclosure * 0.2
  );

  let verdict = 'Mixed signal — probe further in live interview.';
  if (overall >= 78) verdict = 'Strong thinking-process prompt — constraints and verification present.';
  if (overall < 55) verdict = 'Weak prompt trail — mostly output-seeking or too vague.';

  return {
    promptId: prompt.id,
    text: prompt.text,
    at: prompt.at,
    source: prompt.source,
    scores,
    overall,
    verdict,
    flags,
  };
}

export function gradePromptTrail(prompts: PromptRecord[]): GradedPrompt[] {
  return prompts.map(gradePromptHeuristic);
}

export function gradeSubmissionPackage(input: {
  promptTrail: PromptRecord[];
  testPassed?: boolean;
  filesChanged: number;
}): {
  gradedPrompts: GradedPrompt[];
  overallScores: StudioSubmission['overallScores'];
  summary: string;
} {
  const gradedPrompts = gradePromptTrail(input.promptTrail);
  const promptAvg =
    gradedPrompts.length > 0
      ? gradedPrompts.reduce((a, g) => a + g.overall, 0) / gradedPrompts.length
      : 40;

  const shipping = input.testPassed ? 82 : input.filesChanged > 0 ? 58 : 45;
  const thinking = clamp(promptAvg * 0.6 + (input.testPassed ? 28 : 12));
  const promptTrail = clamp(promptAvg);
  const overall = clamp(thinking * 0.45 + promptTrail * 0.35 + shipping * 0.2);

  const summary =
    input.promptTrail.length === 0
      ? 'No agent prompts captured — candidate did not use the coding agent (or submitted without prompting).'
      : `${input.promptTrail.length} prompts captured. Average prompt quality ${promptTrail}/100. ${
          input.testPassed ? 'Sandbox tests passed.' : 'Sandbox tests did not pass — implementation incomplete.'
        }`;

  return {
    gradedPrompts,
    overallScores: {
      thinking,
      promptTrail,
      shipping,
      overall,
    },
    summary,
  };
}

export function enrichSubmissionWithAssessment(submission: StudioSubmission): StudioSubmission {
  return {
    ...submission,
    employerAssessment: buildEmployerAssessment(submission),
  };
}
