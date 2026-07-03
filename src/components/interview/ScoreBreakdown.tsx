import React from 'react';
import type { InterviewScores } from '../../types/interview';

interface ScoreBreakdownProps {
  scores: InterviewScores;
  notes?: string;
}

const labels: { key: keyof Omit<InterviewScores, 'overall'>; label: string }[] = [
  { key: 'thinking', label: 'Thinking' },
  { key: 'decomposition', label: 'Decomposition' },
  { key: 'communication', label: 'Communication' },
  { key: 'codeQuality', label: 'Code Quality' },
];

const scoreTone = (n: number) =>
  n >= 80 ? 'text-emerald-400' : n >= 60 ? 'text-accent-bright' : 'text-amber-400';

const barTone = (n: number) =>
  n >= 80 ? 'bg-emerald-400' : n >= 60 ? 'bg-accent-blue' : 'bg-amber-400';

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ scores, notes }) => (
  <div className="card border-accent-blue/20 p-6">
    <div className="flex items-baseline justify-between mb-6">
      <h3 className="text-xl font-bold text-text-primary">Session scores</h3>
      <span className={`text-3xl font-bold tabular-nums ${scoreTone(scores.overall)}`}>
        {scores.overall}
      </span>
    </div>
    <div className="space-y-4">
      {labels.map(({ key, label }) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">{label}</span>
            <span className="text-text-primary font-medium tabular-nums">{scores[key]}</span>
          </div>
          <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${barTone(scores[key])}`}
              style={{ width: `${scores[key]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
    {notes && (
      <p className="text-text-secondary text-sm mt-6 border-t border-[var(--border-color)] pt-4">
        {notes}
      </p>
    )}
  </div>
);

export default ScoreBreakdown;
