import React from 'react';
import PremiumButton from '../ui/PremiumButton';
import CoverCard from '../spotify/CoverCard';
import HorizontalShelf from '../spotify/HorizontalShelf';
import { shipTestChallenges } from '../../data/shipTests';
import { getShipFormatLabel, getShipTestCover } from '../../data/practiceCovers';
import type { ShipTestChallenge } from '../../types/interview';
import { isDemoMode, isShipFormatUnlocked } from '../../utils/demoMode';

interface ShipTestLobbyProps {
  onEnroll: (challenge: ShipTestChallenge) => void;
  onBack: () => void;
  activeChallengeId?: string;
}

const ShipTestLobby: React.FC<ShipTestLobbyProps> = ({ onEnroll, onBack, activeChallengeId }) => (
  <div className="min-h-screen pb-28 md:pb-12">
    <div
      className="px-4 pt-8 pb-6 md:px-8"
      style={{ background: 'linear-gradient(180deg, rgba(234,88,12,0.12) 0%, transparent 100%)' }}
    >
      <div className="container mx-auto max-w-5xl">
        <PremiumButton variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2">
          ← Back to Practice
        </PremiumButton>
        <p className="text-sm font-medium text-orange-400 uppercase tracking-widest mb-2">Ship Tests</p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-2">
          Build something real
        </h1>
        <p className="text-text-secondary text-sm md:text-base max-w-2xl">
          Time-boxed sprints and Work Tickets. Each card shows what hiring teams are testing — output
          beats whiteboard puzzles.
        </p>
      </div>
    </div>

    <div className="container mx-auto max-w-5xl px-4 md:px-8">
      <section className="mb-10">
        <h2 className="text-xl font-bold text-text-primary mb-4">Pick a challenge</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {shipTestChallenges.map((c) => {
            const unlocked = isShipFormatUnlocked(c.format);
            const isActive = activeChallengeId === c.id;
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
                badge={
                  isActive
                    ? 'Active'
                    : c.format === 'ticket'
                      ? 'VERVE'
                      : unlocked
                        ? 'Open'
                        : 'Locked'
                }
                onClick={unlocked ? () => onEnroll(c) : undefined}
              />
            );
          })}
        </div>
      </section>

      <HorizontalShelf title="Work Tickets & sprints" subtitle="Tap for PM brief and enroll">
        {shipTestChallenges.map((c) => {
          const unlocked = isShipFormatUnlocked(c.format);
          const cover = getShipTestCover(c);
          return (
            <CoverCard
              key={`shelf-${c.id}`}
              title={c.title}
              tagline={cover.problemYouSolve}
              duration={getShipFormatLabel(c.format)}
              gradient={cover.gradient}
              icon={cover.icon}
              badge={c.format === 'ticket' ? 'VERVE-style' : undefined}
              onClick={unlocked ? () => onEnroll(c) : undefined}
            />
          );
        })}
      </HorizontalShelf>

      <div className="space-y-4 mt-8">
        {shipTestChallenges.map((c) => {
          const unlocked = isShipFormatUnlocked(c.format);
          const isActive = activeChallengeId === c.id;
          const cover = getShipTestCover(c);
          return (
            <article
              key={`detail-${c.id}`}
              className={`p-5 md:p-6 rounded-2xl border ${
                unlocked ? 'border-[var(--border-color)] bg-[var(--bg-secondary)]' : 'border-[var(--border-color)] opacity-75'
              }`}
            >
              <div className="flex flex-wrap items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl shrink-0 ring-1 ring-white/10"
                  style={{ background: cover.gradient }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent-blue mb-1">
                    {getShipFormatLabel(c.format)}
                    {c.format === 'ticket' ? ' · VERVE-style · AI allowed' : ''}
                  </p>
                  <h2 className="text-xl font-bold text-text-primary">{c.title}</h2>
                  <p className="text-sm text-accent-bright font-medium mt-1">{cover.problemYouSolve}</p>
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
                    Enable demo mode
                  </span>
                )}
              </div>
              <p className="text-text-secondary text-sm mb-3">{c.description}</p>
              <p className="text-sm text-text-secondary italic border-l-2 border-accent-blue pl-4">
                PM brief: {c.pmBrief}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  </div>
);

export default ShipTestLobby;
