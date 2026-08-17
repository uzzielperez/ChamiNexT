import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ExternalLink, Monitor } from 'lucide-react';
import CodingWorkspace from '../components/workspace/CodingWorkspace';
import StudioShell from '../components/studio/StudioShell';
import ChamiNextLogo from '../components/brand/ChamiNextLogo';
import { DEMO_ASSESSMENT_ROLE_ID } from '../data/companyAssessments';
import { getProblemById } from '../data/loadQuestionBank';
import { getShipChallengeById, shipTestChallenges } from '../data/shipTests';
import { RATE_LIMITER_WORKSPACE, workspaceForChallenge, workspaceFromProblem } from '../data/workspaceTemplates';
import { studioTicketUrl } from '../utils/studioLinks';

const DEFAULT_TICKET_ID = 'work-ticket-rate-limiter';

const STUDIO_TICKETS = shipTestChallenges.filter(
  (c) => c.format === 'ticket' || c.submitMode === 'pr'
);

export default function StudioPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const problemId = searchParams.get('problem');
  const ticketId = searchParams.get('ticket') ?? DEFAULT_TICKET_ID;
  const problem = problemId ? getProblemById(problemId) : null;
  const challenge = !problemId
    ? getShipChallengeById(ticketId) ?? getShipChallengeById(DEFAULT_TICKET_ID)
    : null;

  const template = useMemo(() => {
    if (problem) return workspaceFromProblem(problem);
    if (challenge) return workspaceForChallenge(challenge);
    return RATE_LIMITER_WORKSPACE;
  }, [problem, challenge]);

  const mode = problem ? 'problem' : 'ticket';

  const setTicket = (id: string) => {
    setSearchParams({ ticket: id }, { replace: true });
  };

  return (
    <StudioShell>
      <header className="shrink-0 flex items-center gap-3 px-3 py-2 border-b border-[var(--border-color)] bg-[#0d1117]">
        <Link
          to="/practice"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Practice
        </Link>

        <div className="h-5 w-px bg-[var(--border-color)]" aria-hidden />

        <ChamiNextLogo size="sm" showWordmark={false} className="shrink-0" />

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-secondary ml-1">
          <Monitor className="w-3.5 h-3.5 text-accent-blue" />
          <span className="font-medium text-text-primary">Studio</span>
        </div>

        <div className="relative ml-2 min-w-0 flex-1 max-w-md">
          {mode === 'problem' && problem ? (
            <p className="text-sm text-text-primary truncate px-2 py-1.5">
              Practice · {problem.title}
            </p>
          ) : (
            <>
              <label htmlFor="studio-ticket" className="sr-only">
                Work Ticket
              </label>
              <div className="relative">
                <select
                  id="studio-ticket"
                  value={challenge?.id ?? DEFAULT_TICKET_ID}
                  onChange={(e) => setTicket(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-text-primary focus:outline-none focus:border-accent-blue truncate"
                >
                  {STUDIO_TICKETS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          {mode === 'problem' && problem && (
            <Link
              to={studioTicketUrl(DEFAULT_TICKET_ID)}
              className="hidden md:inline text-xs text-text-secondary hover:text-accent-bright"
            >
              Switch to Work Ticket
            </Link>
          )}
          <Link
            to="/demo"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-text-secondary hover:text-accent-bright transition-colors"
          >
            Full demo loop
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            type="button"
            onClick={() => navigate(`/assess/${DEMO_ASSESSMENT_ROLE_ID}`)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-blue text-white hover:bg-blue-600 transition-colors"
          >
            Submit as assessment
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <CodingWorkspace
          key={template.id}
          template={template}
          immersive
          persistKey={template.id}
          className="h-full rounded-none border-0 shadow-none"
        />
      </div>
    </StudioShell>
  );
}
