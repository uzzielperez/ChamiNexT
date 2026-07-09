import React from 'react';
import { Clock, Rocket } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { shipTestChallenges } from '../../data/shipTests';
import type { ShipTestChallenge } from '../../types/interview';
import { isDemoMode, isShipFormatUnlocked } from '../../utils/demoMode';

interface ShipTestLobbyProps {
  onEnroll: (challenge: ShipTestChallenge) => void;
  onBack: () => void;
  activeChallengeId?: string;
}

const ShipTestLobby: React.FC<ShipTestLobbyProps> = ({ onEnroll, onBack, activeChallengeId }) => (
  <div className="container mx-auto px-4 py-12 max-w-5xl">
    <PremiumButton variant="ghost" size="sm" onClick={onBack} className="mb-6">
      ← Back
    </PremiumButton>
    <div className="text-center mb-12">
      <h1 className="text-hero-headline font-bold text-text-primary mb-4">Ship Tests</h1>
      <p className="text-subheadline text-text-secondary max-w-2xl mx-auto">
        Time-boxed builds. AI plays PM, Tech Lead, reviewer, and user. Ship a URL—not a snippet.
      </p>
    </div>

    <div className="space-y-6">
      {shipTestChallenges.map((c) => {
        const unlocked = isShipFormatUnlocked(c.format);
        const isActive = activeChallengeId === c.id;
        return (
          <div
            key={c.id}
            className={`card p-6 md:p-8 ${unlocked ? 'border-accent-blue/40' : 'opacity-80'}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                {unlocked && (
                  <span className="text-xs font-semibold text-accent-blue uppercase mb-2 block">
                    {c.format === 'ticket'
                      ? 'VERVE-style · Open now'
                      : c.format === '24h'
                        ? 'Open now'
                        : isDemoMode()
                          ? 'Demo unlocked'
                          : 'Preview'}
                  </span>
                )}
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-accent-blue" />
                  {c.title}
                </h2>
                <p className="text-accent-blue text-sm font-medium mt-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {c.format === 'ticket'
                    ? '4h Work Ticket'
                    : c.format === '24h'
                      ? '24h Sprint'
                      : c.format === '72h'
                        ? '72h Build'
                        : '7-Day Sprint'}
                </p>
              </div>
              {unlocked ? (
                <PremiumButton
                  variant="primary"
                  onClick={() => onEnroll(c)}
                  disabled={!!activeChallengeId && !isActive}
                >
                  {isActive ? 'Continue sprint' : 'Enroll'}
                </PremiumButton>
              ) : (
                <span className="text-sm text-text-secondary px-3 py-2 rounded-lg border border-gray-700">
                  Enable demo mode for all formats
                </span>
              )}
            </div>
            <p className="text-text-secondary mt-4">{c.description}</p>
            <p className="text-sm text-text-secondary mt-4 italic border-l-2 border-accent-blue pl-4">
              PM brief: {c.pmBrief}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

export default ShipTestLobby;
