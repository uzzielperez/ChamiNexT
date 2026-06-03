import React from 'react';
import type { ShipTestScores } from '../../types/interview';

const ShipScoreBreakdown: React.FC<{ scores: ShipTestScores; feedback?: string }> = ({
  scores,
  feedback,
}) => {
  const rows = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'productThinking', label: 'Product thinking' },
    { key: 'engineeringQuality', label: 'Engineering quality' },
    { key: 'executionSpeed', label: 'Execution speed' },
    { key: 'tradeoffAwareness', label: 'Tradeoff awareness' },
  ] as const;

  return (
    <div className="card border-green-500/30 p-6">
      <div className="flex justify-between mb-6">
        <h3 className="font-bold text-green-400">Ship Test evaluated</h3>
        <span className="text-3xl font-bold text-gradient">{scores.overall}</span>
      </div>
      <div className="space-y-3 mb-4">
        {rows.map(({ key, label }) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">{label}</span>
              <span>{scores[key]}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${scores[key]}%` }} />
            </div>
          </div>
        ))}
      </div>
      {feedback && <p className="text-sm text-text-secondary border-t border-gray-700 pt-4">{feedback}</p>}
    </div>
  );
};

export default ShipScoreBreakdown;
