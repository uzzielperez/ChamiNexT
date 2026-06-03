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

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ scores, notes }) => (
  <div className="card border-accent-blue/20 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-text-primary">Session scores</h3>
      <span className="text-3xl font-bold text-gradient">{scores.overall}</span>
    </div>
    <div className="space-y-4">
      {labels.map(({ key, label }) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">{label}</span>
            <span className="text-text-primary font-medium">{scores[key]}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-accent-blue h-2 rounded-full transition-all"
              style={{ width: `${scores[key]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
    {notes && <p className="text-text-secondary text-sm mt-6 border-t border-gray-700 pt-4">{notes}</p>}
  </div>
);

export default ScoreBreakdown;
