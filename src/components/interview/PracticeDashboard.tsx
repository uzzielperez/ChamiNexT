import React from 'react';
import { ArrowRight, Brain, Rocket } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { practiceProblems } from '../../data/practiceProblems';
import { loadSessions } from '../../utils/interviewStorage';
import type { PracticeProblem } from '../../types/interview';

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
  const sessions = loadSessions();
  const lastSession = sessions[0];
  const recommended = practiceProblems.find((p) => p.id !== lastSession?.problemId) ?? practiceProblems[0];

  const domainCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const p = practiceProblems.find((x) => x.id === s.problemId);
    if (p) domainCount[p.domain] = (domainCount[p.domain] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-hero-headline font-bold text-text-primary mb-4">Practice</h1>
        <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
          AI interviews, adaptive problems, and Ship Tests—built for how you’ll work with AI on the job.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card border-accent-blue/30 p-6">
          <Brain className="w-8 h-8 text-accent-blue mb-4" />
          <h3 className="text-lg font-bold mb-2">Recommended next</h3>
          <p className="text-text-secondary text-sm mb-4">{recommended.title}</p>
          <PremiumButton variant="primary" size="md" className="w-full" onClick={() => onStartInterview(recommended)}>
            Start interview
          </PremiumButton>
        </div>
        <div className="card p-6">
          <Rocket className="w-8 h-8 text-accent-blue mb-4" />
          <h3 className="text-lg font-bold mb-2">Ship Tests</h3>
          <p className="text-text-secondary text-sm mb-4">24h sprint live. 72h & 7-day coming soon.</p>
          <PremiumButton variant="secondary" size="md" className="w-full" onClick={onOpenShipTests}>
            View challenges
          </PremiumButton>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-2">Your signal</h3>
          <p className="text-3xl font-bold text-gradient mb-1">{sessions.length}</p>
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

      <h2 className="text-xl font-bold mb-4">Problem bank</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {practiceProblems.map((problem) => (
          <div key={problem.id} className="card p-5 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-text-primary">{problem.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-text-secondary capitalize">
                {problem.difficulty}
              </span>
            </div>
            <p className="text-xs text-accent-blue capitalize mb-2">{problem.domain}</p>
            <p className="text-text-secondary text-sm flex-grow mb-4 line-clamp-2">{problem.prompt}</p>
            {domainCount[problem.domain] !== undefined && (
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
