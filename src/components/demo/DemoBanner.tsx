import React, { useState } from 'react';
import { Play, X, Sparkles } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { seedDemoPresentation } from '../../utils/seedDemo';
import { isDemoMode, setDemoMode } from '../../utils/demoMode';

const STEPS = [
  { n: 1, text: 'Home → thesis & differentiation (30 sec)' },
  { n: 2, text: 'Practice → Run AI interview → End & score (3 min)' },
  { n: 3, text: 'Ship Tests → 24h sprint → submit deploy URL (2 min)' },
  { n: 4, text: 'Profile → copy link → share with employer (1 min)' },
  { n: 5, text: 'Interview Studio → ranked candidates on shipped output (2 min)' },
];

const DemoBanner: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [demo, setDemo] = useState(isDemoMode());

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 btn-primary shadow-lg text-sm py-2 px-4"
      >
        <Play className="w-4 h-4 inline mr-2" />
        Demo script
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full card border-accent-blue/40 p-4 shadow-2xl">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-blue" />
          <span className="font-bold text-text-primary">Demo week</span>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="text-text-secondary hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <ol className="text-sm text-text-secondary space-y-2 mb-4">
        {STEPS.map((s) => (
          <li key={s.n}>
            <span className="text-accent-blue font-bold mr-2">{s.n}.</span>
            {s.text}
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-2">
        <PremiumButton
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => {
            seedDemoPresentation();
            setDemoMode(true);
            setDemo(true);
            window.location.href = '/practice';
          }}
        >
          Load demo data & go to Practice
        </PremiumButton>
        {demo && (
          <p className="text-xs text-green-400 text-center">Demo mode on — short Ship timers, all formats unlocked</p>
        )}
      </div>
    </div>
  );
};

export default DemoBanner;
