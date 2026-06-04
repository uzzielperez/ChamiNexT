import React, { useMemo, useState } from 'react';
import { ArrowRight, Brain, Rocket } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import {
  allPracticeProblems,
  getProblemsByTrack,
} from '../../data/loadQuestionBank';
import { loadSessions } from '../../utils/interviewStorage';
import type { PracticeProblem, PracticeTrack } from '../../types/interview';

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
    { id: 'daily', label: 'Daily 10 min' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-hero-headline font-bold text-text-primary mb-4">
          Practice
        </h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          {allPracticeProblems.length} interview prompts: classic CS plus AI engineering
          proficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-[var(--radius-card)] border border-accent-blue/40 bg-[var(--bg-secondary)]">
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
          <p className="text-3xl font-bold text-accent-blue mb-1">{sessions.length}</p>
          <p className="text-text-secondary text-sm mb-4">interviews completed</p>
          <button
            type="button"
            onClick={onOpenProfile}
            className="text-accent-blue text-sm font-medium inline-flex items-center gap-1"
          >
            Talent profile <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === t.id
                ? 'bg-accent-blue text-white'
                : 'bg-[var(--bg-secondary)] text-text-secondary border border-[var(--border-color)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">
        Problem bank <span className="text-text-secondary font-normal text-base">({filtered.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((problem) => (
          <div
            key={problem.id}
            className="p-5 flex flex-col rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)]"
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
            <PremiumButton variant="outline" size="sm" onClick={() => onStartInterview(problem)}>
              Run AI interview
            </PremiumButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeDashboard;
