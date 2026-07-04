import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, RefreshCw, Repeat } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import InterviewSimulator from '../components/interview/InterviewSimulator';
import ScoreBreakdown from '../components/interview/ScoreBreakdown';
import {
  computeReadiness,
  LOOP_STAGES,
  problemForStage,
  weakestStage,
  type LoopRun,
  type LoopStageResult,
} from '../data/interviewLoop';
import { loadLoopRuns, saveLoopRun } from '../utils/loopStorage';
import type { InterviewSession, PracticeProblem, PracticeTrack } from '../types/interview';

type Phase = 'intro' | 'stage' | 'interstitial' | 'debrief';

const TRACKS: { id: PracticeTrack; label: string }[] = [
  { id: 'software', label: 'Software' },
  { id: 'ai-engineer', label: 'AI Engineer' },
  { id: 'quant', label: 'Quant' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'market-engineering', label: 'Market Engineering' },
];

const readinessTone = (n: number) =>
  n >= 80 ? 'text-emerald-400' : n >= 60 ? 'text-accent-bright' : 'text-amber-400';

const Stepper: React.FC<{ current: number; results: LoopStageResult[] }> = ({
  current,
  results,
}) => (
  <ol className="flex items-center justify-center gap-0 mb-8" aria-label="Loop stages">
    {LOOP_STAGES.map((stage, i) => {
      const done = results[i]?.scores !== undefined;
      const active = i === current;
      return (
        <li key={stage.id} className="flex items-center">
          {i > 0 && <span className="w-8 sm:w-14 h-px bg-[var(--border-color)]" aria-hidden />}
          <span className="flex items-center gap-2 px-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                done
                  ? 'bg-emerald-400 text-[var(--bg-primary)]'
                  : active
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--bg-tertiary)] text-text-secondary'
              }`}
            >
              {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={`text-sm hidden sm:inline ${
                active ? 'text-text-primary font-semibold' : 'text-text-secondary'
              }`}
            >
              {stage.label}
            </span>
          </span>
        </li>
      );
    })}
  </ol>
);

const InterviewLoopPage: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [track, setTrack] = useState<PracticeTrack>('software');
  const [stageIndex, setStageIndex] = useState(0);
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [results, setResults] = useState<LoopStageResult[]>([]);
  const [runId, setRunId] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const pastRuns = loadLoopRuns();

  const startLoop = () => {
    setRunId(`loop-${Date.now()}`);
    setStartedAt(new Date().toISOString());
    setResults([]);
    setStageIndex(0);
    setProblem(problemForStage(LOOP_STAGES[0].id, track));
    setPhase('stage');
  };

  const handleStageComplete = (session: InterviewSession) => {
    const stage = LOOP_STAGES[stageIndex];
    const result: LoopStageResult = {
      stageId: stage.id,
      label: stage.label,
      problemId: session.problemId,
      problemTitle: problem?.title ?? '',
      scores: session.scores,
      scoreNotes: session.scoreNotes,
    };
    const next = [...results, result];
    setResults(next);
    if (stageIndex === LOOP_STAGES.length - 1) {
      const run: LoopRun = {
        id: runId,
        track,
        startedAt,
        completedAt: new Date().toISOString(),
        stages: next,
        readiness: computeReadiness(next),
      };
      saveLoopRun(run);
    }
    setPhase('interstitial');
  };

  const advance = () => {
    if (stageIndex === LOOP_STAGES.length - 1) {
      setPhase('debrief');
      return;
    }
    const nextIndex = stageIndex + 1;
    setStageIndex(nextIndex);
    setProblem(problemForStage(LOOP_STAGES[nextIndex].id, track));
    setPhase('stage');
  };

  if (phase === 'stage' && problem) {
    return (
      <div>
        <div className="container mx-auto px-4 pt-8 max-w-7xl">
          <Stepper current={stageIndex} results={results} />
        </div>
        <InterviewSimulator
          key={problem.id}
          problem={problem}
          stage={{
            label: LOOP_STAGES[stageIndex].label,
            index: stageIndex + 1,
            total: LOOP_STAGES.length,
          }}
          onComplete={handleStageComplete}
          onExit={() => setPhase('intro')}
        />
      </div>
    );
  }

  if (phase === 'interstitial') {
    const last = results[results.length - 1];
    const isFinal = stageIndex === LOOP_STAGES.length - 1;
    const soft = last?.stageId !== 'technical-screen';
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl pb-24 md:pb-12">
        <Stepper current={stageIndex} results={results} />
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            {last?.label} complete
          </h1>
          <p className="text-sm text-text-secondary">{last?.problemTitle}</p>
        </div>
        {last?.scores && <ScoreBreakdown scores={last.scores} notes={last.scoreNotes} soft={soft} />}
        <div className="mt-6 flex justify-center">
          <PremiumButton variant="primary" size="md" onClick={advance}>
            {isFinal ? 'See your readiness debrief' : `Next: ${LOOP_STAGES[stageIndex + 1].label}`}
            <ArrowRight className="w-4 h-4 ml-2" />
          </PremiumButton>
        </div>
      </div>
    );
  }

  if (phase === 'debrief') {
    const readiness = computeReadiness(results);
    const weakest = weakestStage(results);
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl pb-24 md:pb-12">
        <div className="text-center mb-10">
          <p className="text-sm text-accent-blue font-medium uppercase tracking-wide">
            Loop complete
          </p>
          <h1 className="text-3xl font-bold text-text-primary mt-2 mb-3">Readiness debrief</h1>
          <p className={`text-6xl font-bold tabular-nums ${readinessTone(readiness)}`}>
            {readiness}
          </p>
          <p className="text-sm text-text-secondary mt-2">
            Average across your {results.length} stages, {TRACKS.find((t) => t.id === track)?.label} track
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {results.map((r) => (
            <div
              key={r.stageId}
              className="p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="font-semibold text-text-primary">{r.label}</h3>
                <span
                  className={`text-xl font-bold tabular-nums ${readinessTone(r.scores?.overall ?? 0)}`}
                >
                  {r.scores?.overall ?? '—'}
                </span>
              </div>
              <p className="text-xs text-text-secondary mb-2">{r.problemTitle}</p>
              {r.scoreNotes && <p className="text-sm text-text-secondary">{r.scoreNotes}</p>}
            </div>
          ))}
        </div>

        {weakest && (
          <div className="p-4 mb-8 rounded-[var(--radius-card)] border border-accent-blue/30 bg-accent-blue/5">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">
                Weakest stage: {weakest.label}.
              </span>{' '}
              {weakest.stageId === 'technical-screen' ? (
                <>
                  Drill that domain from the{' '}
                  <Link to="/skills" className="text-accent-blue hover:underline">
                    skill tree
                  </Link>{' '}
                  before your next loop.
                </>
              ) : (
                <>
                  Practice more{' '}
                  <Link to="/intel" className="text-accent-blue hover:underline">
                    real {weakest.stageId === 'behavioral' ? 'behavioral' : 'recruiter'} questions
                  </Link>{' '}
                  from the field.
                </>
              )}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <PremiumButton variant="primary" size="md" onClick={startLoop}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Run another loop
          </PremiumButton>
          <PremiumButton variant="ghost" size="md" onClick={() => setPhase('intro')}>
            Back to overview
          </PremiumButton>
        </div>
      </div>
    );
  }

  // Intro
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <p className="text-sm text-accent-blue font-medium uppercase tracking-wide flex items-center justify-center gap-2">
          <Repeat className="w-4 h-4" /> Interview loop
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-4">
          Rehearse the whole loop, not just the hard part
        </h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          Field reports say candidates get blindsided by stages, not questions. Run a full
          company-style loop in about 40 minutes: recruiter screen, technical screen, behavioral
          round — scored stage by stage.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {LOOP_STAGES.map((stage, i) => (
          <div
            key={stage.id}
            className="flex items-center gap-4 p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]"
          >
            <span className="w-7 h-7 rounded-full bg-accent-blue/15 text-accent-bright text-sm font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-text-primary text-sm">{stage.label}</h3>
              <p className="text-xs text-text-secondary">{stage.description}</p>
            </div>
            <span className="text-xs text-text-secondary tabular-nums shrink-0">
              ~{stage.minutes} min
            </span>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-text-primary mb-3 text-center">Pick your track</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrack(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors filter-pill ${
                track === t.id ? 'filter-pill-active' : ''
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <PremiumButton variant="primary" size="lg" onClick={startLoop}>
          Start the loop
          <ArrowRight className="w-4 h-4 ml-2" />
        </PremiumButton>
      </div>

      {pastRuns.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">Past loops</h2>
          <div className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] divide-y divide-[var(--border-color)]">
            {pastRuns.slice(0, 5).map((run) => (
              <div key={run.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-text-primary capitalize">
                    {TRACKS.find((t) => t.id === run.track)?.label ?? run.track}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(run.startedAt).toLocaleDateString()} ·{' '}
                    {run.stages.map((s) => s.scores?.overall ?? '—').join(' / ')}
                  </p>
                </div>
                <span
                  className={`text-lg font-bold tabular-nums ${readinessTone(run.readiness ?? 0)}`}
                >
                  {run.readiness ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default InterviewLoopPage;
