import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Leaf, Shield, Users } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import InterviewSimulator from '../components/interview/InterviewSimulator';
import {
  getFrontierTests,
  getFrontierTestById,
  MISSION_LABELS,
} from '../data/loadFrontierProblems';
import { practiceProblemFromFrontierTest } from '../utils/frontierPractice';
import { getProblemById } from '../data/loadQuestionBank';
import type { FrontierProblemTest, MissionArea } from '../types/interview';

const MISSIONS: { id: MissionArea | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All missions', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'climate', label: 'Climate', icon: <Leaf className="w-4 h-4" /> },
  { id: 'health', label: 'Health', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'poverty', label: 'Poverty', icon: <Users className="w-4 h-4" /> },
  { id: 'ethics', label: 'Ethics', icon: <Shield className="w-4 h-4" /> },
  { id: 'science', label: 'Frontier science', icon: <FlaskConical className="w-4 h-4" /> },
];

const FrontierProblemsPage: React.FC = () => {
  const [mission, setMission] = useState<MissionArea | 'all'>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const tests = getFrontierTests({ mission });
  const active = activeId ? getFrontierTestById(activeId) : null;

  if (active) {
    const linked = active.practiceProblemId
      ? getProblemById(active.practiceProblemId)
      : undefined;
    const problem = linked ?? practiceProblemFromFrontierTest(active);
    return (
      <InterviewSimulator
        key={problem.id}
        problem={problem}
        onExit={() => setActiveId(null)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <p className="text-sm text-emerald-400 font-medium uppercase tracking-wide flex items-center justify-center gap-2">
          <FlaskConical className="w-4 h-4" /> Frontier problem tests
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-4">
          Screen for people who think well about hard problems
        </h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          Deep scenarios for climate, cancer research, poverty alleviation, and AI
          ethics — styled after interviews at DeepMind, Anthropic, and mission-driven
          labs. Every test includes explicit ethics probes.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {MISSIONS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMission(m.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors filter-pill ${
              mission === m.id ? 'filter-pill-active' : ''
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tests.map((test) => (
          <TestCard key={test.id} test={test} onStart={() => setActiveId(test.id)} />
        ))}
      </div>

      <p className="text-center text-sm text-text-secondary mt-10">
        Questions are enriched from{' '}
        <Link to="/intel" className="text-accent-blue hover:underline">
          interview intel
        </Link>{' '}
        (run <code className="text-xs">npm run intel:frontier</code> to scrape
        DeepMind, Anthropic, and mission-org threads) and the{' '}
        <Link to="/skills" className="text-accent-blue hover:underline">
          AI for Science
        </Link>{' '}
        skill tree.
      </p>
    </div>
  );
};

const TestCard: React.FC<{ test: FrontierProblemTest; onStart: () => void }> = ({
  test,
  onStart,
}) => (
  <div className="p-5 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-emerald-400/40 transition-colors">
    <div className="flex items-start justify-between gap-3 mb-2">
      <div>
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
          {MISSION_LABELS[test.mission]}
        </span>
        <h2 className="text-lg font-bold text-text-primary mt-1">{test.title}</h2>
        <p className="text-xs text-text-secondary mt-1">
          Reported style: {test.orgExamples.join(' · ')} · ~{test.estimatedMinutes} min
        </p>
      </div>
    </div>
    <p className="text-sm text-text-secondary mb-3 line-clamp-3">{test.prompt}</p>
    {test.ethicsPrompts.length > 0 && (
      <p className="text-xs text-text-secondary mb-3">
        <span className="text-emerald-400 font-medium">Ethics: </span>
        {test.ethicsPrompts[0]}
        {test.ethicsPrompts.length > 1 ? ` (+${test.ethicsPrompts.length - 1} more)` : ''}
      </p>
    )}
    <PremiumButton variant="primary" size="sm" onClick={onStart}>
      Run deep test
    </PremiumButton>
  </div>
);

export default FrontierProblemsPage;
