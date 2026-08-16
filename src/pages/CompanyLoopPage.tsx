import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, MapPin } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import CodingWorkspace, { type CodingWorkspaceHandle } from '../components/workspace/CodingWorkspace';
import { getCompanyLoop, formatSalaryRange } from '../data/loadCompanyLoops';
import { shipTestChallenges } from '../data/shipTests';
import { workspaceForChallenge } from '../data/workspaceTemplates';
import type { CompanyLoopStageId, CompanyLoopQuizQuestion } from '../types/companyLoop';
import {
  loadLoopProgress,
  markStageComplete,
  saveLoopProgress,
} from '../utils/companyLoopProgress';

const STAGE_ORDER: CompanyLoopStageId[] = ['cv', 'quiz', 'work-ticket', 'ethics'];

const BEHAVIORAL_PROBLEM: Record<string, string> = {
  ownership: 'soft-ownership',
  collaboration: 'soft-pragmatism',
  'research-integrity': 'quant-hm-behavioral',
  'ethics-values': 'soft-candidate-questions',
};

function LoopStepper({
  stages,
  completed,
  current,
}: {
  stages: { id: CompanyLoopStageId; title: string }[];
  completed: CompanyLoopStageId[];
  current: CompanyLoopStageId;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-2 mb-8" aria-label="Loop progress">
      {stages.map((stage, i) => {
        const done = completed.includes(stage.id);
        const active = stage.id === current;
        return (
          <li key={stage.id} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="w-4 h-4 text-text-secondary/40 hidden sm:block" />}
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                done
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : active
                    ? 'border-accent-blue bg-accent-blue/15 text-accent-bright'
                    : 'border-[var(--border-color)] text-text-secondary'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  done ? 'bg-emerald-500 text-black' : active ? 'bg-accent-blue text-white' : 'bg-[var(--bg-tertiary)]'
                }`}
              >
                {done ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{stage.title}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function QuizStage({
  questions,
  onComplete,
}: {
  questions: CompanyLoopQuizQuestion[];
  onComplete: (score: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const q = questions[index];

  const submit = () => {
    if (selected === null) return;
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) setCorrect((c) => c + 1);
    setRevealed(true);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      onComplete(Math.round((correct / questions.length) * 100));
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="card p-6 max-w-2xl">
      <p className="text-xs text-text-secondary mb-2">
        Question {index + 1} of {questions.length}
      </p>
      <h3 className="font-bold text-text-primary mb-4">{q.prompt}</h3>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={revealed}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
              selected === i
                ? 'border-accent-blue bg-accent-blue/10 text-text-primary'
                : 'border-[var(--border-color)] text-text-secondary hover:border-accent-blue/40'
            } ${revealed && i === q.correctIndex ? 'border-emerald-500/50 bg-emerald-500/10' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {revealed && (
        <p className="text-sm text-text-secondary mb-4 border-l-2 border-accent-blue pl-3">
          {q.explain}
        </p>
      )}
      <div className="flex gap-2">
        {!revealed ? (
          <PremiumButton variant="primary" size="sm" onClick={submit} disabled={selected === null}>
            Check answer
          </PremiumButton>
        ) : (
          <PremiumButton variant="primary" size="sm" onClick={next}>
            {index + 1 >= questions.length ? 'Finish quiz' : 'Next question'}
          </PremiumButton>
        )}
      </div>
    </div>
  );
}

export default function CompanyLoopPage() {
  const { loopId } = useParams<{ loopId: string }>();
  const navigate = useNavigate();
  const loop = loopId ? getCompanyLoop(loopId) : undefined;
  const [progress, setProgress] = useState(() =>
    loop ? loadLoopProgress(loop.id) : loadLoopProgress('')
  );
  const workspaceRef = useRef<CodingWorkspaceHandle>(null);

  const currentStageId = useMemo(() => {
    if (!loop) return 'cv' as CompanyLoopStageId;
    for (const id of STAGE_ORDER) {
      if (!progress.completedStages.includes(id)) return id;
    }
    return 'ethics' as CompanyLoopStageId;
  }, [loop, progress.completedStages]);

  if (!loop) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Loop not found.</p>
        <Link to="/" className="text-accent-blue mt-4 inline-block">Back to home</Link>
      </div>
    );
  }

  const salary = formatSalaryRange(loop.salaryMin, loop.salaryMax);
  const stageMeta = loop.stages.find((s) => s.id === currentStageId)!;
  const workChallenge = loop.stages.find((s) => s.id === 'work-ticket');
  const shipChallenge = workChallenge?.shipTestId
    ? shipTestChallenges.find((c) => c.id === workChallenge.shipTestId)
    : undefined;
  const workspaceTemplate = shipChallenge ? workspaceForChallenge(shipChallenge) : null;

  const completeStage = (stageId: CompanyLoopStageId, extra?: Partial<typeof progress>) => {
    const next = markStageComplete(loop.id, stageId);
    const merged = { ...next, ...extra };
    saveLoopProgress(merged);
    setProgress(merged);
    const nextId = STAGE_ORDER.find((id) => !merged.completedStages.includes(id));
    if (!nextId) return;
    if (stageId !== nextId) {
      /* state updates — user stays on page, currentStageId derived */
    }
  };

  const behavioralProblemId =
    BEHAVIORAL_PROBLEM[stageMeta.behavioralKind ?? 'ownership'] ?? 'soft-ownership';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-wrap items-start gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
            style={{ background: loop.logoGradient }}
          >
            {loop.logoAbbr}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-text-secondary">{loop.placeholderName}</p>
            <h1 className="text-2xl font-bold text-text-primary">{loop.roleTitle}</h1>
            <p className="text-sm text-text-secondary flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {loop.region} · <span className="text-accent-bright font-semibold">{salary}</span>
            </p>
          </div>
          <Link to="/#company-loops" className="text-sm text-text-secondary hover:text-accent-blue">
            All loops
          </Link>
        </div>

        <LoopStepper stages={loop.stages} completed={progress.completedStages} current={currentStageId} />

        <div className="mb-6">
          <h2 className="text-xl font-bold text-text-primary">{stageMeta.title}</h2>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl">{stageMeta.summary}</p>
        </div>

        {currentStageId === 'cv' && (
          <div className="card p-6 max-w-2xl">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Paste CV summary or LinkedIn headline + top bullets
            </label>
            <textarea
              className="w-full min-h-[160px] px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-text-primary text-sm"
              placeholder="3–5 impact bullets aligned to this role…"
              value={progress.cvSummary ?? ''}
              onChange={(e) =>
                setProgress((p) => ({ ...p, cvSummary: e.target.value }))
              }
            />
            <PremiumButton
              variant="primary"
              className="mt-4"
              onClick={() => completeStage('cv', { cvSummary: progress.cvSummary })}
            >
              Submit CV & continue
            </PremiumButton>
          </div>
        )}

        {currentStageId === 'quiz' && (
          <QuizStage
            questions={loop.quizQuestions}
            onComplete={(score) => completeStage('quiz', { quizScore: score })}
          />
        )}

        {currentStageId === 'work-ticket' && workspaceTemplate && (
          <div>
            <p className="text-sm text-text-secondary mb-4 max-w-2xl">
              Complete the ticket in studio. Use the coding agent — prompts are collected. When done,
              mark complete (or submit full package from the{' '}
              <Link to="/demo" className="text-accent-blue hover:underline">assessment demo</Link>).
            </p>
            <CodingWorkspace
              ref={workspaceRef}
              template={{
                ...workspaceTemplate,
                title: `${loop.placeholderName}: ${workspaceTemplate.title}`,
              }}
              hideBriefFooter
            />
            <PremiumButton
              variant="primary"
              className="mt-4"
              onClick={() => completeStage('work-ticket')}
            >
              Mark Work Ticket complete
            </PremiumButton>
          </div>
        )}

        {currentStageId === 'ethics' && (
          <div className="card p-6 max-w-2xl">
            <p className="text-sm text-text-secondary mb-4">
              Run a behavioral mock scored on real stories — ethics, ownership, and values under
              pushback.
            </p>
            <div className="flex flex-wrap gap-3">
              <PremiumButton
                variant="primary"
                onClick={() => {
                  completeStage('ethics');
                  navigate('/practice', { state: { problemId: behavioralProblemId } });
                }}
              >
                Start behavioral mock
              </PremiumButton>
              <PremiumButton variant="secondary" onClick={() => completeStage('ethics')}>
                Mark complete
              </PremiumButton>
            </div>
          </div>
        )}

        {progress.completedStages.length >= 4 && (
          <div className="card p-6 mt-8 border-emerald-500/30 max-w-2xl">
            <h3 className="font-bold text-emerald-300 mb-2">Loop complete</h3>
            <p className="text-sm text-text-secondary mb-4">
              You finished all four stages for {loop.placeholderName}. Quiz score:{' '}
              {progress.quizScore ?? '—'}%
            </p>
            <Link to="/#company-loops">
              <PremiumButton variant="secondary" size="sm">Pick another loop</PremiumButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
