import React, { useMemo, useState } from 'react';
import { ArrowRight, Brain, Rocket, Radio, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumButton from '../ui/PremiumButton';
import {
  allPracticeProblems,
  getProblemsByTrack,
} from '../../data/loadQuestionBank';
import { loadSessions } from '../../utils/interviewStorage';
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

  const recommended =
    filtered.find((p) => p.id !== lastSession?.problemId) ?? filtered[0];

  const domainCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const p = allPracticeProblems.find((x) => x.id === s.problemId);
    if (p) domainCount[p.domain] = (domainCount[p.domain] || 0) + 1;
  });

  const tabs: { id: FilterMode; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'software', label: 'Software' },
    { id: 'ai-engineer', label: 'AI Engineer' },
    { id: 'quant', label: 'Quant' },
    { id: 'cybersecurity', label: 'Cybersecurity' },
    { id: 'market-engineering', label: 'Market Eng' },
    { id: 'daily', label: 'Daily 10 min' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Practice</h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          AI interviews, adaptive problems, and Ship Tests — built for how you&apos;ll work with
          AI on the job.
        </p>
      </div>

      <Link
        to="/skills"
        className="flex items-center justify-between gap-3 p-4 mb-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-accent-blue/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <GitBranch className="w-5 h-5 text-accent-blue shrink-0" />
          <p className="text-sm text-text-secondary min-w-0">
            <span className="font-semibold text-text-primary">Skill trees</span> — software, AI,
            quant, and cybersecurity fundamentals with every bank problem mapped.
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-accent-blue shrink-0" />
      </Link>

      <Link
        to="/field-reports"
        className="flex items-center justify-between gap-3 p-4 mb-8 rounded-[var(--radius-card)] border border-accent-blue/30 bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Radio className="w-5 h-5 text-accent-blue shrink-0" />
          <p className="text-sm text-text-secondary min-w-0">
            <span className="font-semibold text-text-primary">Had a real interview?</span> Log the
            questions — we turn them into fresh practice and sharpen prep for everyone.
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-accent-blue shrink-0" />
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-[var(--radius-card)] card-recommended bg-[var(--bg-secondary)] md:scale-[1.02] md:-translate-y-0.5">
          <Brain className="w-8 h-8 text-accent-blue mb-4" />
          <h3 className="text-lg font-bold mb-2">Recommended next</h3>
          <p className="text-text-secondary text-sm mb-4">{recommended?.title}</p>
          <PremiumButton
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => recommended && onStartInterview(recommended)}
          >
            Start interview
          </PremiumButton>
        </div>
        <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <Rocket className="w-8 h-8 text-accent-blue mb-4" />
          <h3 className="text-lg font-bold mb-2">Ship Tests</h3>
          <p className="text-text-secondary text-sm mb-4">8 challenges: 24h, 72h, and 7-day sprints.</p>
          <PremiumButton variant="secondary" size="md" className="w-full" onClick={onOpenShipTests}>
            View challenges
          </PremiumButton>
        </div>
        <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 className="text-lg font-bold mb-2">Your signal</h3>
          <p className="text-sm text-text-secondary mb-2">
            {completed} / {PROFILE_MILESTONE} interviews
          </p>
          <div
            className="h-2 rounded-full bg-[var(--bg-tertiary)] mb-2 overflow-hidden"
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
          <p className="text-text-secondary text-xs mb-4">
            {completed >= PROFILE_MILESTONE
              ? 'Full talent profile visibility unlocked'
              : `Complete ${PROFILE_MILESTONE - completed} more to unlock full profile visibility`}
          </p>
          <button
            type="button"
            onClick={onOpenProfile}
            className="text-accent-blue text-sm font-medium inline-flex items-center gap-1"
          >
            View profile <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors filter-pill ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((problem) => (
          <div
            key={problem.id}
            className="problem-card p-5 flex flex-col rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]"
          >
            <div className="flex justify-between items-start mb-2 gap-2">
              <h3 className="font-bold text-text-primary">{problem.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-text-secondary capitalize shrink-0">
                {problem.difficulty}
              </span>
            </div>
            <p className="text-xs text-accent-blue capitalize mb-1">
              {problem.domain} · {problem.track} · ~{problem.estimatedMinutes}m
            </p>
            <p className="text-text-secondary text-sm flex-grow mb-4 line-clamp-2">{problem.prompt}</p>
            {domainCount[problem.domain] !== undefined && domainCount[problem.domain] > 0 && (
              <p className="text-xs text-text-secondary mb-2">
                Attempts in domain: {domainCount[problem.domain]}
              </p>
            )}
            <div className="problem-cta">
              <PremiumButton variant="outline" size="sm" className="w-full" onClick={() => onStartInterview(problem)}>
                Run AI interview
              </PremiumButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeDashboard;
