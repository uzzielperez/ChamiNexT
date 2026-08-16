import type { WorkspaceSnapshot } from '../components/workspace/workspaceTypes';
import type { CompanyInterviewLoop, CompanyLoopProgress } from '../types/companyLoop';
import type { PromptRecord, StudioSubmission } from '../types/studioSubmission';
import { gradeSubmissionPackage, enrichSubmissionWithAssessment } from './submissionGrader';
import { saveSubmission } from './studioSubmissionStorage';
import { addApplication } from './employerStorage';
import { loadProfileName } from './interviewStorage';
import { getOrCreateProfileSlug } from './profileSlug';
import { shipTestChallenges } from '../data/shipTests';

export function packageCompanyLoopSubmission(
  loop: CompanyInterviewLoop,
  progress: CompanyLoopProgress,
  snap: WorkspaceSnapshot | null,
  promptTrail: PromptRecord[]
): StudioSubmission {
  const workStage = loop.stages.find((s) => s.id === 'work-ticket');
  const shipChallenge = workStage?.shipTestId
    ? shipTestChallenges.find((c) => c.id === workStage.shipTestId)
    : undefined;

  const files = snap?.files ?? {};
  const starterFiles = snap?.starterFiles ?? {};
  const terminalLog = snap?.terminalLog ?? '';
  const testOutput = snap?.testOutput;
  const testPassed = snap?.testPassed;
  const filesChanged = Object.keys(files).filter(
    (k) => files[k] !== starterFiles[k]
  ).length;

  const { gradedPrompts, overallScores, summary } = gradeSubmissionPackage({
    promptTrail,
    testPassed,
    filesChanged,
  });

  const submissionId = progress.submissionId ?? `sub-loop-${loop.id}-${Date.now()}`;
  const taskTitle = shipChallenge?.title ?? workStage?.title ?? 'Work Ticket';

  const submission = enrichSubmissionWithAssessment({
    id: submissionId,
    roleId: loop.id,
    companyLoopId: loop.id,
    companyName: loop.placeholderName,
    taskTitle,
    taskBrief: workStage?.summary ?? loop.tagline,
    candidateName: loadProfileName() || 'Candidate',
    submittedAt: new Date().toISOString(),
    files,
    starterFiles,
    promptTrail,
    terminalLog,
    testOutput,
    testPassed,
    overallScores,
    gradedPrompts,
    summary,
    loopQuizScore: progress.quizScore,
    cvSummary: progress.cvSummary,
    loopStagesCompleted: progress.completedStages.length,
  });

  saveSubmission(submission);

  const slug = getOrCreateProfileSlug();
  addApplication({
    roleId: loop.id,
    displayName: submission.candidateName,
    profileSlug: slug,
    thinking: overallScores.thinking,
    shipping: overallScores.shipping,
    shipTestTitle: `${loop.roleTitle} · ${taskTitle}`,
    status: overallScores.overall >= 75 ? 'strong' : 'review',
    submissionId,
    companyLoopId: loop.id,
  });

  return submission;
}
