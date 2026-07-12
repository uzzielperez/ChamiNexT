import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
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

function ChallengeGrid({
  challenges,
  activeChallengeId,
  onEnroll,
}: {
  challenges: ShipTestChallenge[];
  activeChallengeId?: string;
  onEnroll: (c: ShipTestChallenge) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {challenges.map((c) => {
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
                : c.track === 'quant'
                  ? 'Quant'
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
  );
}

function ChallengeDetails({
  challenges,
  activeChallengeId,
  onEnroll,
}: {
  challenges: ShipTestChallenge[];
  activeChallengeId?: string;
  onEnroll: (c: ShipTestChallenge) => void;
}) {
  return (
    <div className="space-y-4">
      {challenges.map((c) => {
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
                  {c.format === 'ticket' ? ' · Work Ticket · AI allowed' : ''}
                  {c.track === 'quant' ? ' · Quant finance' : ''}
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
            {c.ticketBrief && (
              <p className="text-sm text-text-secondary mb-3 whitespace-pre-wrap border-l-2 border-accent-blue pl-4">
                {c.ticketBrief.slice(0, 400)}
                {c.ticketBrief.length > 400 ? '…' : ''}
              </p>
            )}
            <p className="text-sm text-text-secondary italic border-l-2 border-[var(--border-color)] pl-4">
              PM brief: {c.pmBrief}
            </p>
          </article>
        );
      })}
    </div>
  );
}

const ShipTestLobby: React.FC<ShipTestLobbyProps> = ({ onEnroll, onBack, activeChallengeId }) => {
  const { quant, general } = useMemo(() => {
    const quant = shipTestChallenges.filter((c) => c.track === 'quant');
    const general = shipTestChallenges.filter((c) => c.track !== 'quant');
    return { quant, general };
  }, []);

  return (
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
            Work Tickets and sprints — including quant finance tickets (backtest linter, VWAP sim, order book stats).
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        {quant.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-text-primary mb-1">Quant finance work tickets</h2>
            <p className="text-sm text-text-secondary mb-4">
              Prop-shop style — research hygiene, execution, market data. AI allowed; submit a PR.
            </p>
            <ChallengeGrid challenges={quant} activeChallengeId={activeChallengeId} onEnroll={onEnroll} />
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold text-text-primary mb-4">All challenges</h2>
          <ChallengeGrid challenges={general} activeChallengeId={activeChallengeId} onEnroll={onEnroll} />
        </section>

        <HorizontalShelf title="Quick enroll" subtitle="Swipe to pick a ticket or sprint">
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
                badge={c.track === 'quant' ? 'Quant' : c.format === 'ticket' ? 'Ticket' : undefined}
                onClick={unlocked ? () => onEnroll(c) : undefined}
              />
            );
          })}
        </HorizontalShelf>

        {quant.length > 0 && (
          <section className="mt-12 mb-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">Quant ticket details</h2>
            <ChallengeDetails challenges={quant} activeChallengeId={activeChallengeId} onEnroll={onEnroll} />
          </section>
        )}

        <section className="mt-8 mb-8">
          <h2 className="text-lg font-bold text-text-primary mb-4">General challenges</h2>
          <ChallengeDetails challenges={general} activeChallengeId={activeChallengeId} onEnroll={onEnroll} />
        </section>

        {!isDemoMode() && (
          <p className="text-center text-xs text-text-secondary pb-8">
            Enable demo mode in settings to unlock 72h and 7d formats.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShipTestLobby;
