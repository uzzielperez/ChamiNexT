import React, { useMemo, useState } from 'react';
import { Brain, Check } from 'lucide-react';
import CoverCard from '../spotify/CoverCard';
import HorizontalShelf from '../spotify/HorizontalShelf';
import PremiumButton from '../ui/PremiumButton';
import { allPracticeProblems, getProblemsByTrack } from '../../data/loadQuestionBank';
import {
  getPracticeProblemCover,
  PRACTICE_MODE_CARDS,
  problemTagline,
  TRACK_LABELS,
} from '../../data/practiceCovers';
import { loadSessions } from '../../utils/interviewStorage';
import { shipTestChallenges } from '../../data/shipTests';
import { getShipFormatLabel, getShipTestCover } from '../../data/practiceCovers';
import type { PracticeProblem, PracticeTrack } from '../../types/interview';

const PROFILE_MILESTONE = 10;

type FilterMode = 'all' | PracticeTrack | 'daily';

interface PracticeDashboardProps {
  onStartInterview: (problem: PracticeProblem) => void;
  onOpenShipTests: () => void;
  onOpenProfile: () => void;
}

const PracticeDashboard: React.FC<PracticeDashboardProps> = ({
  onStartInterview,
  onOpenShipTests,
  onOpenProfile,
}) => {
  const [filter, setFilter] = useState<FilterMode>('all');
  const sessions = loadSessions();
  const lastSession = sessions[0];
  const completed = sessions.length;
  const progressPct = Math.min(100, Math.round((completed / PROFILE_MILESTONE) * 100));

  const filtered = useMemo(() => {
    if (filter === 'daily') {
      return allPracticeProblems.filter((p) => p.estimatedMinutes <= 15);
    }
    if (filter === 'all') return allPracticeProblems;
    return getProblemsByTrack(filter);
  }, [filter]);

  const bestScoreByProblem: Record<string, number> = {};
  const domainScores: Record<string, number[]> = {};
  sessions.forEach((s) => {
    if (!s.scores) return;
    const prev = bestScoreByProblem[s.problemId];
    if (prev === undefined || s.scores.overall > prev) {
      bestScoreByProblem[s.problemId] = s.scores.overall;
    }
    const p = allPracticeProblems.find((x) => x.id === s.problemId);
    if (p) (domainScores[p.domain] ??= []).push(s.scores.overall);
  });

  const { recommended, recommendReason } = useMemo(() => {
    const unpracticed = filtered.filter((p) => bestScoreByProblem[p.id] === undefined);
    const domainAvgs = Object.entries(domainScores)
      .map(([d, scores]) => ({ d, avg: scores.reduce((a, b) => a + b, 0) / scores.length }))
      .sort((a, b) => a.avg - b.avg);
    for (const { d, avg } of domainAvgs) {
      const hit = unpracticed.find((p) => p.domain === d);
      if (hit) {
        return {
          recommended: hit,
          recommendReason: `Weakest domain (avg ${Math.round(avg)}). Reps here move your profile most.`,
        };
      }
    }
    if (unpracticed.length > 0) {
      return {
        recommended: unpracticed[0],
        recommendReason: 'New territory — no scored attempt in this domain yet.',
      };
    }
    const fallback = filtered.find((p) => p.id !== lastSession?.problemId) ?? filtered[0];
    return {
      recommended: fallback,
      recommendReason: 'Retry to push your best scores up.',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, lastSession?.problemId]);

  const recommendedCover = recommended ? getPracticeProblemCover(recommended) : null;
  const quantShipTests = useMemo(() => shipTestChallenges.filter((c) => c.track === 'quant'), []);

  const filterTabs: { id: FilterMode; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'software', label: 'Software' },
    { id: 'ai-engineer', label: 'AI Engineer' },
    { id: 'quant', label: 'Quant' },
    { id: 'cybersecurity', label: 'Cybersecurity' },
    { id: 'market-engineering', label: 'Market Eng' },
    { id: 'ai-for-science', label: 'AI for Science' },
    { id: 'daily', label: 'Quick ≤15m' },
  ];

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <div
        className="px-4 pt-8 pb-6 md:px-8"
        style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.12) 0%, transparent 100%)' }}
      >
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm font-medium text-accent-bright uppercase tracking-widest flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4" /> Practice
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-2">
            What are you preparing for?
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl">
            Each card shows the interview problem it solves — pick a mode or jump into the bank.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        {/* Recommended — hero card */}
        {recommended && recommendedCover && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-text-primary mb-1">Recommended next</h2>
            <p className="text-sm text-text-secondary mb-4">{recommendReason}</p>
            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 p-5 rounded-2xl border border-accent-blue/30 bg-accent-blue/5">
              <CoverCard
                size="md"
                title={recommended.title}
                tagline={recommendedCover.problemYouSolve}
                gradient={recommendedCover.gradient}
                icon={recommendedCover.icon}
                badge={
                  bestScoreByProblem[recommended.id] !== undefined
                    ? `Best ${bestScoreByProblem[recommended.id]}`
                    : 'New'
                }
                onClick={() => onStartInterview(recommended)}
              />
              <div className="flex flex-col justify-center min-w-0">
                <p className="text-xs text-accent-blue capitalize mb-2">
                  {recommended.domain} · {TRACK_LABELS[recommended.track]} · ~{recommended.estimatedMinutes}m
                </p>
                <p className="text-sm text-text-secondary line-clamp-3 mb-4">{recommended.prompt}</p>
                <PremiumButton variant="primary" size="md" className="w-fit" onClick={() => onStartInterview(recommended)}>
                  {bestScoreByProblem[recommended.id] !== undefined ? 'Retry interview' : 'Run AI interview'}
                </PremiumButton>
              </div>
            </div>
          </section>
        )}

        {/* Practice modes grid */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-1">Practice modes</h2>
          <p className="text-sm text-text-secondary mb-4">Loops, drills, ship tests, and coaching</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRACTICE_MODE_CARDS.map((mode) =>
              mode.id === 'ship' ? (
                <CoverCard
                  key={mode.id}
                  size="sm"
                  title={mode.title}
                  tagline={mode.tagline}
                  gradient={mode.cover.gradient}
                  icon={mode.cover.icon}
                  badge={mode.badge}
                  onClick={onOpenShipTests}
                />
              ) : (
                <CoverCard
                  key={mode.id}
                  size="sm"
                  title={mode.title}
                  tagline={mode.tagline}
                  gradient={mode.cover.gradient}
                  icon={mode.cover.icon}
                  badge={mode.badge}
                  href={mode.href}
                />
              )
            )}
          </div>
        </section>

        <HorizontalShelf title="More prep" subtitle="Swipe for intel, frontier, jobs, referrals">
          {PRACTICE_MODE_CARDS.filter((m) => ['intel', 'frontier', 'journey', 'skills'].includes(m.id)).map(
            (mode) => (
              <CoverCard
                key={mode.id}
                title={mode.title}
                tagline={mode.tagline}
                gradient={mode.cover.gradient}
                icon={mode.cover.icon}
                href={mode.href}
              />
            )
          )}
          <CoverCard
            title="Field reports"
            tagline="Log real interview questions — we turn them into practice"
            gradient="linear-gradient(135deg, #262a31 0%, #3b82f6 100%)"
            icon="target"
            href="/field-reports"
          />
          <CoverCard
            title="Find jobs"
            tagline="Roles mapped to your practice tracks"
            gradient="linear-gradient(135deg, #1e3a5f 0%, #0f766e 100%)"
            icon="users"
            href="/jobs"
          />
        </HorizontalShelf>

        {/* Profile signal */}
        <section className="mb-10 p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-text-primary">Your signal</h3>
              <p className="text-sm text-text-secondary">
                {completed} / {PROFILE_MILESTONE} interviews scored
              </p>
            </div>
            <button type="button" onClick={onOpenProfile} className="text-accent-blue text-sm font-medium">
              View profile →
            </button>
          </div>
          <div
            className="h-2 rounded-full bg-[var(--bg-tertiary)] mt-3 overflow-hidden"
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={PROFILE_MILESTONE}
          >
            <div
              className="h-full rounded-full bg-[var(--accent-primary)] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </section>

        {/* Problem bank */}
        {(filter === 'quant' || filter === 'all') && quantShipTests.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-text-primary mb-1">Quant work tickets</h2>
            <p className="text-sm text-text-secondary mb-4">
              SIG-style tickets — backtest linter, VWAP sim, order book stats, pairs monitor
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {quantShipTests.map((c) => {
                const cover = getShipTestCover(c);
                return (
                  <CoverCard
                    key={c.id}
                    size="sm"
                    title={c.title}
                    tagline={cover.problemYouSolve}
                    subtitle={getShipFormatLabel(c.format)}
                    gradient={cover.gradient}
                    icon={cover.icon}
                    badge="Quant"
                    onClick={onOpenShipTests}
                  />
                );
              })}
            </div>
            <PremiumButton variant="secondary" size="sm" onClick={onOpenShipTests}>
              Open Ship Test lobby →
            </PremiumButton>
          </section>
        )}

        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors filter-pill shrink-0 ${
                filter === t.id ? 'filter-pill-active' : ''
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">
          Problem bank <span className="count-badge">{filtered.length}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filtered.map((problem) => {
            const cover = getPracticeProblemCover(problem);
            const bestScore = bestScoreByProblem[problem.id];
            return (
              <CoverCard
                key={problem.id}
                size="sm"
                title={problem.title}
                tagline={cover.problemYouSolve}
                subtitle={`${TRACK_LABELS[problem.track]} · ~${problem.estimatedMinutes}m`}
                gradient={cover.gradient}
                icon={cover.icon}
                badge={
                  bestScore !== undefined
                    ? `${bestScore}`
                    : problem.difficulty === 'hard'
                      ? 'Hard'
                      : undefined
                }
                onClick={() => onStartInterview(problem)}
              />
            );
          })}
        </div>

        {/* Expanded list for context + prompt preview */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-text-secondary">Quick preview</h3>
          {filtered.slice(0, 6).map((problem) => {
            const bestScore = bestScoreByProblem[problem.id];
            const cover = getPracticeProblemCover(problem);
            return (
              <button
                key={`row-${problem.id}`}
                type="button"
                onClick={() => onStartInterview(problem)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-accent-blue/40 text-left transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-lg shrink-0 ring-1 ring-white/10"
                  style={{ background: cover.gradient }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text-primary text-sm truncate">{problem.title}</p>
                  <p className="text-xs text-accent-bright truncate">{problemTagline(problem)}</p>
                </div>
                {bestScore !== undefined && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 shrink-0">
                    <Check className="w-3.5 h-3.5" /> {bestScore}
                  </span>
                )}
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default PracticeDashboard;
