import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCode2,
  MessageSquareText,
} from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import { getSubmission } from '../utils/studioSubmissionStorage';

export default function AssessmentSubmittedPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const submission = submissionId ? getSubmission(submissionId) : undefined;

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Submission not found.</p>
        <Link to="/demo" className="text-accent-blue mt-4 inline-block">Back to demo</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="card p-8 max-w-lg w-full text-center border-accent-blue/30">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">Assessment submitted</h1>
        <p className="text-text-secondary text-sm mb-6">
          {submission.companyName} received your code package, terminal log, and{' '}
          <strong className="text-text-primary">{submission.promptTrail.length} prompts</strong> for
          grading.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-8 text-sm">
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
            <p className="text-text-secondary text-xs">Thinking</p>
            <p className="text-xl font-bold text-text-primary">{submission.overallScores.thinking}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
            <p className="text-text-secondary text-xs">Prompt trail</p>
            <p className="text-xl font-bold text-accent-blue">
              {submission.overallScores.promptTrail}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
            <p className="text-text-secondary text-xs">Overall</p>
            <p className="text-xl font-bold text-text-primary">{submission.overallScores.overall}</p>
          </div>
        </div>
        <Link to={`/employers/review/${submission.id}`} className="block mb-3">
          <PremiumButton variant="primary" fullWidth>
            View employer review (demo)
            <ArrowRight className="w-4 h-4 ml-1" />
          </PremiumButton>
        </Link>
        <Link to="/demo" className="text-sm text-text-secondary hover:text-accent-blue">
          Run demo again
        </Link>
      </div>
    </div>
  );
}
