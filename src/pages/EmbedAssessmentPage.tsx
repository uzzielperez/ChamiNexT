import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, ClipboardList, Send, Sparkles } from 'lucide-react';
import CodingWorkspace, {
  type CodingWorkspaceHandle,
} from '../components/workspace/CodingWorkspace';
import PremiumButton from '../components/ui/PremiumButton';
import StudioShell from '../components/studio/StudioShell';
import ChamiNextLogo from '../components/brand/ChamiNextLogo';
import { assessmentForRole } from '../data/companyAssessments';
import { loadRoles } from '../utils/employerStorage';
import { loadProfileName } from '../utils/interviewStorage';
import { saveSubmission } from '../utils/studioSubmissionStorage';
import { gradeSubmissionPackage, enrichSubmissionWithAssessment } from '../utils/submissionGrader';
import { addApplication } from '../utils/employerStorage';
import { getOrCreateProfileSlug } from '../utils/profileSlug';
import type { PromptRecord } from '../types/studioSubmission';

function countChangedFiles(
  starter: Record<string, string>,
  current: Record<string, string>
): number {
  return Object.keys(current).filter((k) => starter[k] !== current[k]).length;
}

function postEmbedMessage(type: string, payload: Record<string, unknown>) {
  if (window.parent === window) return;
  window.parent.postMessage({ source: 'chaminext-studio', type, ...payload }, '*');
}

export default function EmbedAssessmentPage() {
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
      <StudioShell>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <h1 className="text-xl font-bold text-text-primary mb-2">Assessment not found</h1>
            <p className="text-text-secondary text-sm mb-4">Invalid embed link — check the role id.</p>
            <Link to="/demo" className="text-accent-blue hover:underline text-sm">
              Go to demo →
            </Link>
          </div>
        </div>
      </StudioShell>
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
      const submission = enrichSubmissionWithAssessment({
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
      });

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

      postEmbedMessage('assessment_submitted', {
        submissionId,
        roleId: role.id,
        overall: overallScores.overall,
        testPassed: passed,
      });

      navigate(`/demo/submitted/${submissionId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Submit failed';
      setError(msg);
      postEmbedMessage('assessment_error', { message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudioShell>
      <header className="shrink-0 flex items-center gap-3 px-3 py-2 border-b border-[var(--border-color)] bg-[#0d1117]">
        <ChamiNextLogo size="sm" showWordmark={false} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wide text-accent-blue flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {assessment.companyName}
          </p>
          <h1 className="text-sm font-bold text-text-primary truncate">{assessment.taskTitle}</h1>
        </div>
        <div className="text-right text-xs text-text-secondary shrink-0">
          <p className="flex items-center gap-1 justify-end">
            <ClipboardList className="w-3.5 h-3.5 text-accent-blue" />
            {promptTrail.length} prompts
          </p>
        </div>
      </header>

      <div className="shrink-0 px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs text-text-secondary max-h-20 overflow-y-auto">
        <span className="font-semibold text-text-primary">Brief:</span> {assessment.pmBrief}
      </div>

      <div className="shrink-0 flex flex-wrap items-center gap-3 px-3 py-2 border-b border-[var(--border-color)]">
        <PremiumButton variant="primary" size="sm" loading={submitting} onClick={() => void submitAssessment()}>
          <Send className="w-4 h-4 mr-1" />
          Submit package
        </PremiumButton>
        <p className="text-[11px] text-text-secondary flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-accent-bright" />
          AI allowed — prompts logged
        </p>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      <div className="flex-1 min-h-0">
        <CodingWorkspace
          ref={workspaceRef}
          template={assessment.workspace}
          immersive
          persistKey={`assess-${role.id}`}
          hideBriefFooter
          onPromptRecorded={(r) => setPromptTrail((prev) => [...prev, r])}
          className="h-full rounded-none border-0 shadow-none"
        />
      </div>
    </StudioShell>
  );
}
