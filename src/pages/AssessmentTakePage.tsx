import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, ClipboardList, Send, Sparkles } from 'lucide-react';
import CodingWorkspace, {
  type CodingWorkspaceHandle,
} from '../components/workspace/CodingWorkspace';
import PremiumButton from '../components/ui/PremiumButton';
import { assessmentForRole } from '../data/companyAssessments';
import { loadRoles } from '../utils/employerStorage';
import { loadProfileName } from '../utils/interviewStorage';
import { saveSubmission } from '../utils/studioSubmissionStorage';
import { gradeSubmissionPackage } from '../utils/submissionGrader';
import { addApplication } from '../utils/employerStorage';
import { getOrCreateProfileSlug } from '../utils/profileSlug';
import type { PromptRecord, StudioSubmission } from '../types/studioSubmission';

function countChangedFiles(
  starter: Record<string, string>,
  current: Record<string, string>
): number {
  return Object.keys(current).filter((k) => starter[k] !== current[k]).length;
}

export default function AssessmentTakePage() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const workspaceRef = useRef<CodingWorkspaceHandle>(null);
  const [promptTrail, setPromptTrail] = useState<PromptRecord[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const role = loadRoles().find((r) => r.id === roleId);
  const assessment = role ? assessmentForRole(role) : null;

  if (!role || !assessment) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-3">Assessment not found</h1>
        <p className="text-text-secondary mb-6">
          Ask your recruiter for a valid assessment link, or start the guided demo.
        </p>
        <Link to="/demo" className="text-accent-blue hover:underline">Go to demo →</Link>
      </div>
    );
  }

  const submitAssessment = async () => {
    setSubmitting(true);
    setError('');
    try {
      const ws = workspaceRef.current;
      if (!ws) throw new Error('Studio not ready');

      const { output, passed } = await ws.runTests();
      const snap = ws.getSnapshot();
      const filesChanged = countChangedFiles(snap.starterFiles, snap.files);

      const { gradedPrompts, overallScores, summary } = gradeSubmissionPackage({
        promptTrail,
        testPassed: passed,
        filesChanged,
      });

      const submissionId = `sub-${Date.now()}`;
      const submission: StudioSubmission = {
        id: submissionId,
        roleId: role.id,
        companyName: assessment.companyName,
        taskTitle: assessment.taskTitle,
        taskBrief: assessment.taskBrief,
        candidateName: loadProfileName() || 'Candidate',
        submittedAt: new Date().toISOString(),
        files: snap.files,
        starterFiles: snap.starterFiles,
        promptTrail,
        terminalLog: snap.terminalLog,
        testOutput: output,
        testPassed: passed,
        overallScores,
        gradedPrompts,
        summary,
      };

      saveSubmission(submission);

      const slug = getOrCreateProfileSlug();
      addApplication({
        roleId: role.id,
        displayName: submission.candidateName,
        profileSlug: slug,
        thinking: overallScores.thinking,
        shipping: overallScores.shipping,
        shipTestTitle: assessment.taskTitle,
        status: overallScores.overall >= 75 ? 'strong' : 'review',
        submissionId,
      });

      navigate(`/demo/submitted/${submissionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="card p-6 mb-6 border-accent-blue/30">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-blue flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {assessment.companyName} assigned you a task
              </p>
              <h1 className="text-2xl font-bold text-text-primary mt-2">{assessment.roleTitle}</h1>
              <p className="text-text-secondary mt-1">{assessment.taskTitle}</p>
            </div>
            <div className="text-right text-sm text-text-secondary">
              <p className="flex items-center gap-1 justify-end">
                <ClipboardList className="w-4 h-4 text-accent-blue" />
                {promptTrail.length} prompts logged
              </p>
              <p className="text-xs mt-1">AI use allowed — prompts are part of your trail</p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">PM brief:</span> {assessment.pmBrief}
            </p>
            {assessment.ticketMarkdown && (
              <pre className="mt-3 text-xs text-text-secondary whitespace-pre-wrap font-sans border-t border-[var(--border-color)] pt-3">
                {assessment.ticketMarkdown}
              </pre>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <PremiumButton variant="primary" loading={submitting} onClick={() => void submitAssessment()}>
            <Send className="w-4 h-4 mr-1" />
            Submit assessment package
          </PremiumButton>
          <p className="text-xs text-text-secondary flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-accent-bright" />
            Auto-packages code, terminal log, and every agent prompt for grading
          </p>
        </div>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <CodingWorkspace
          ref={workspaceRef}
          template={assessment.workspace}
          hideBriefFooter
          onPromptRecorded={(r) => setPromptTrail((prev) => [...prev, r])}
        />
      </div>
    </div>
  );
}
