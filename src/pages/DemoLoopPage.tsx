import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Play, Sparkles, User } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import {
  DEMO_ASSESSMENT_ROLE_ID,
  seedAssessmentRole,
} from '../data/companyAssessments';
import { loadRoles, saveRoles } from '../utils/employerStorage';
import { seedDemoAssessmentSubmission } from '../utils/seedDemoAssessment';
import { getLatestSubmissionForRole } from '../utils/studioSubmissionStorage';

function ensureDemoRole() {
  const roles = loadRoles();
  if (!roles.some((r) => r.id === DEMO_ASSESSMENT_ROLE_ID)) {
    saveRoles([seedAssessmentRole(), ...roles]);
  }
}

export default function DemoLoopPage() {
  ensureDemoRole();
  const existing = getLatestSubmissionForRole(DEMO_ASSESSMENT_ROLE_ID);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-sm font-semibold text-accent-blue flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" />
          End-to-end demo
        </p>
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Company task → studio → graded prompts
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          <strong className="text-text-primary">Nebula Analytics</strong> assigns a Work Ticket. The
          candidate codes in-browser with an AI agent. On submit, ChamiNexT packages code + terminal +
          <strong className="text-text-primary"> every prompt</strong>. Employers see raw prompts and
          per-prompt grades in Interview Studio.
        </p>

        <ol className="space-y-4 mb-10 text-sm text-text-secondary">
          <li className="flex gap-3">
            <span className="font-mono text-accent-blue">1</span>
            Company sets task (PM brief + engineering ticket)
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-accent-blue">2</span>
            Candidate works in studio — prompts are collected automatically
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-accent-blue">3</span>
            Submit packages everything and runs auto-grade
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-accent-blue">4</span>
            Employer reviews raw prompts + graded rubric
          </li>
        </ol>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link to={`/assess/${DEMO_ASSESSMENT_ROLE_ID}`} className="card p-6 border-accent-blue/40 hover:border-accent-blue transition-colors group">
            <User className="w-8 h-8 text-accent-blue mb-3" />
            <h2 className="font-bold text-text-primary group-hover:text-accent-bright">I'm the candidate</h2>
            <p className="text-sm text-text-secondary mt-2 mb-4">
              Open Nebula's rate-limiter ticket. Use the agent (try the quick chips), run tests, submit.
            </p>
            <span className="text-accent-blue text-sm font-medium flex items-center">
              Start assessment <Play className="w-4 h-4 ml-1" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              const sub = existing ?? seedDemoAssessmentSubmission();
              window.location.href = `/employers/review/${sub.id}`;
            }}
            className="card p-6 border-[var(--border-color)] hover:border-accent-blue/40 transition-colors text-left group"
          >
            <Building2 className="w-8 h-8 text-accent-bright mb-3" />
            <h2 className="font-bold text-text-primary group-hover:text-accent-bright">I'm the employer</h2>
            <p className="text-sm text-text-secondary mt-2 mb-4">
              See a sample submission: raw prompt trail, graded prompts, code package.
            </p>
            <span className="text-accent-blue text-sm font-medium flex items-center">
              Open employer review <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </button>
        </div>

        {existing && (
          <p className="text-sm text-text-secondary text-center">
            You already submitted once —{' '}
            <Link to={`/employers/review/${existing.id}`} className="text-accent-blue hover:underline">
              view your last review
            </Link>
            or submit again as candidate.
          </p>
        )}

        <div className="text-center mt-8">
          <Link to="/employers">
            <PremiumButton variant="ghost" size="sm">Interview Studio home</PremiumButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
