import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, RefreshCw, SkipForward, Timer, Zap } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import {
  buildDrillQuestions,
  DRILL_QUESTION_COUNT,
  DRILL_SECONDS,
  drillScore,
  type DrillItemResult,
  type DrillQuestion,
  type DrillRun,
  type DrillVerdict,
} from '../data/rapidFireDrill';
import { callDrillAgent } from '../utils/drillAgent';
import { loadDrillRuns, saveDrillRun } from '../utils/drillStorage';
import type { SkillTreeTrackId } from '../data/loadSkillTree';

type Phase = 'intro' | 'running' | 'grading' | 'results';

const TRACKS: { id: SkillTreeTrackId; label: string }[] = [
  { id: 'software', label: 'Software' },
  { id: 'ai-engineer', label: 'AI Engineer' },
  { id: 'quant', label: 'Quant' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'market-engineering', label: 'Market Engineering' },
];

const VERDICT_STYLE: Record<DrillVerdict, { label: string; className: string }> = {
  strong: { label: 'Strong', className: 'bg-emerald-400/15 text-emerald-400' },
  partial: { label: 'Partial', className: 'bg-amber-400/15 text-amber-400' },
  miss: { label: 'Miss', className: 'bg-red-400/15 text-red-400' },
};

const scoreTone = (n: number) =>
  n >= 80 ? 'text-emerald-400' : n >= 60 ? 'text-accent-bright' : 'text-amber-400';

const formatClock = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const TRACK_IDS = TRACKS.map((t) => t.id);

const RapidFireDrillPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const trackParam = searchParams.get('track') as SkillTreeTrackId | null;
  const [phase, setPhase] = useState<Phase>('intro');
  const [track, setTrack] = useState<SkillTreeTrackId>(
    trackParam && TRACK_IDS.includes(trackParam) ? trackParam : 'software'
  );
  const [questions, setQuestions] = useState<DrillQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(DRILL_SECONDS);
  const [items, setItems] = useState<DrillItemResult[]>([]);
  const [summary, setSummary] = useState('');
  const [graded, setGraded] = useState(false);
  const [saved, setSaved] = useState(false);
  const answersRef = useRef<Map<string, string>>(new Map());
  const startedAtRef = useRef('');
  const finishingRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pastRuns = loadDrillRuns();

  const finishDrill = useCallback(
    async (qs: DrillQuestion[]) => {
      if (finishingRef.current) return;
      finishingRef.current = true;
      setPhase('grading');
      const durationSec = Math.min(
        DRILL_SECONDS,
        Math.round((Date.now() - new Date(startedAtRef.current).getTime()) / 1000)
      );

      const drafts: DrillItemResult[] = qs.map((q) => ({
        question: q,
        answer: answersRef.current.get(q.id)?.trim() ?? '',
      }));

      const res = await callDrillAgent(
        track,
        drafts.map((d) => ({ id: d.question.id, question: d.question.text, answer: d.answer }))
      );

      let finalItems = drafts;
      if (res.graded && res.results) {
        const byId = new Map(res.results.map((r) => [r.id, r]));
        finalItems = drafts.map((d) => {
          const g = byId.get(d.question.id);
          return g ? { ...d, verdict: g.verdict, ideal: g.ideal, note: g.note } : d;
        });
        setSummary(res.summary ?? '');
      }
      setGraded(Boolean(res.graded));
      setItems(finalItems);
      setSaved(false);

      if (res.graded) {
        saveDrillRun({
          id: `drill-${Date.now()}`,
          track,
          startedAt: startedAtRef.current,
          durationSec,
          items: finalItems,
          score: drillScore(finalItems),
          graded: true,
          summary: res.summary,
        });
        setSaved(true);
      }
      setPhase('results');
    },
    [track]
  );

  useEffect(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          void finishDrill(questions);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, questions, finishDrill]);

  const startDrill = () => {
    const qs = buildDrillQuestions(track);
    setQuestions(qs);
    setIndex(0);
    setAnswer('');
    setItems([]);
    setSummary('');
    setSecondsLeft(DRILL_SECONDS);
    answersRef.current = new Map();
    startedAtRef.current = new Date().toISOString();
    finishingRef.current = false;
    setPhase('running');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const nextQuestion = () => {
    answersRef.current.set(questions[index].id, answer);
    if (index === questions.length - 1) {
      void finishDrill(questions);
      return;
    }
    setIndex(index + 1);
    setAnswer('');
    inputRef.current?.focus();
  };

  const setSelfVerdict = (i: number, verdict: DrillVerdict) => {
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, verdict } : it)));
  };

  const saveSelfReview = () => {
    saveDrillRun({
      id: `drill-${Date.now()}`,
      track,
      startedAt: startedAtRef.current,
      durationSec: Math.min(
        DRILL_SECONDS,
        Math.round((Date.now() - new Date(startedAtRef.current).getTime()) / 1000)
      ),
      items,
      score: drillScore(items),
      graded: false,
    });
    setSaved(true);
  };

  if (phase === 'running') {
    const q = questions[index];
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl pb-24 md:pb-12">
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-text-secondary tabular-nums">
            Question {index + 1} of {questions.length}
          </span>
          <span
            className={`flex items-center gap-1.5 text-lg font-bold tabular-nums ${
              secondsLeft <= 60 ? 'text-amber-400' : 'text-text-primary'
            }`}
          >
            <Timer className="w-4 h-4" />
            {formatClock(secondsLeft)}
          </span>
        </div>

        <div className="h-1 rounded-full bg-[var(--bg-tertiary)] mb-8 overflow-hidden">
          <div
            className="h-full bg-[var(--accent-primary)] transition-all duration-300"
            style={{ width: `${(index / questions.length) * 100}%` }}
          />
        </div>

        <div className="mb-2">
          <span className="text-xs font-medium text-accent-bright uppercase tracking-wide">
            {q.source === 'intel' ? 'Asked in a real interview' : q.leafLabel}
          </span>
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-6">{q.text}</h1>

        <textarea
          ref={inputRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              nextQuestion();
            }
          }}
          placeholder="Answer like you're on the phone — two sentences, the core idea first."
          className="w-full min-h-[120px] p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] text-text-primary text-sm resize-none focus:outline-none focus:border-accent-blue/50 mb-4"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">⌘+Enter to submit</span>
          <PremiumButton variant="primary" size="md" onClick={nextQuestion}>
            {answer.trim() ? (
              <>
                {index === questions.length - 1 ? 'Finish drill' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Skip
                <SkipForward className="w-4 h-4 ml-2" />
              </>
            )}
          </PremiumButton>
        </div>
      </div>
    );
  }

  if (phase === 'grading') {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md text-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-primary font-medium">Grading your answers…</p>
        <p className="text-sm text-text-secondary mt-1">
          Each one is checked against what a phone screener needs to hear.
        </p>
      </div>
    );
  }

  if (phase === 'results') {
    const allRated = items.every((it) => it.verdict);
    const score = drillScore(items);
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl pb-24 md:pb-12">
        <div className="text-center mb-10">
          <p className="text-sm text-accent-blue font-medium uppercase tracking-wide">
            Drill complete
          </p>
          {allRated ? (
            <>
              <p className={`text-6xl font-bold tabular-nums mt-3 ${scoreTone(score)}`}>{score}</p>
              <p className="text-sm text-text-secondary mt-2">
                {items.filter((i) => i.verdict === 'strong').length} strong ·{' '}
                {items.filter((i) => i.verdict === 'partial').length} partial ·{' '}
                {items.filter((i) => i.verdict === 'miss').length} missed
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-bold text-text-primary mt-2">
              Rate each answer yourself
            </h1>
          )}
          {summary && (
            <p className="text-sm text-text-secondary mt-4 max-w-xl mx-auto">{summary}</p>
          )}
          {!graded && (
            <p className="text-sm text-text-secondary mt-4 max-w-xl mx-auto">
              AI grading is unavailable right now, so compare each answer against the checklist and
              rate it honestly — the score still feeds your drill history.
            </p>
          )}
        </div>

        <div className="space-y-4 mb-8">
          {items.map((it, i) => (
            <div
              key={it.question.id}
              className="p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-xs text-text-secondary mb-1">
                    {it.question.source === 'intel'
                      ? 'Asked in a real interview'
                      : it.question.leafLabel}
                  </p>
                  <p className="font-medium text-text-primary text-sm">{it.question.text}</p>
                </div>
                {it.verdict && (
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${VERDICT_STYLE[it.verdict].className}`}
                  >
                    {VERDICT_STYLE[it.verdict].label}
                  </span>
                )}
              </div>

              <p className="text-sm text-text-secondary mb-2">
                <span className="text-text-primary font-medium">You: </span>
                {it.answer || <em>No answer</em>}
              </p>

              {it.ideal && (
                <p className="text-sm text-text-secondary mb-1">
                  <span className="text-emerald-400 font-medium">Strong answer: </span>
                  {it.ideal}
                </p>
              )}
              {it.note && <p className="text-xs text-text-secondary">{it.note}</p>}

              {!graded && it.question.reference && (
                <p className="text-sm text-text-secondary mb-2">
                  <span className="text-accent-bright font-medium">What to cover: </span>
                  {it.question.reference}
                </p>
              )}
              {!graded && (
                <div className="flex gap-2 mt-2">
                  {(Object.keys(VERDICT_STYLE) as DrillVerdict[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelfVerdict(i, v)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                        it.verdict === v
                          ? VERDICT_STYLE[v].className
                          : 'bg-[var(--bg-tertiary)] text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {VERDICT_STYLE[v].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          {!graded && !saved && (
            <PremiumButton variant="primary" size="md" onClick={saveSelfReview} disabled={!allRated}>
              Save score
            </PremiumButton>
          )}
          <PremiumButton variant={graded || saved ? 'primary' : 'ghost'} size="md" onClick={startDrill}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Run another drill
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
          <Zap className="w-4 h-4" /> Rapid-fire drill
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-4">
          Five minutes. {DRILL_QUESTION_COUNT} screening questions.
        </h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          Phone screens are fast recall plus a crisp explanation — field reports say they filter
          more candidates than the coding rounds. This drill pulls from your track's fundamentals
          and real screening questions from the field, then grades every answer.
        </p>
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
        <PremiumButton variant="primary" size="lg" onClick={startDrill}>
          Start the drill
          <Timer className="w-4 h-4 ml-2" />
        </PremiumButton>
      </div>

      {pastRuns.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3">Past drills</h2>
          <div className="rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] divide-y divide-[var(--border-color)]">
            {pastRuns.slice(0, 5).map((run) => (
              <div key={run.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-text-primary">
                    {TRACKS.find((t) => t.id === run.track)?.label ?? run.track}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(run.startedAt).toLocaleDateString()} ·{' '}
                    {run.items.filter((i) => i.verdict === 'strong').length}/{run.items.length}{' '}
                    strong{run.graded ? '' : ' · self-rated'}
                  </p>
                </div>
                <span className={`text-lg font-bold tabular-nums ${scoreTone(run.score)}`}>
                  {run.score}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-sm text-text-secondary">
        Want the full experience?{' '}
        <Link to="/loop" className="text-accent-blue hover:underline">
          Run a complete interview loop
        </Link>{' '}
        — recruiter, technical, and behavioral stages.
      </p>
    </div>
  );
};

export default RapidFireDrillPage;
