import React, { useState, useEffect } from 'react';
import PremiumButton from '../ui/PremiumButton';
import ShipScoreBreakdown from './ShipScoreBreakdown';
import { shipTestChallenges } from '../../data/shipTests';
import type { ShipTestEnrollment, ShipTestEvent } from '../../types/interview';
import { loadShipEnrollment, saveShipEnrollment } from '../../utils/interviewStorage';
import { evaluateShipTest } from '../../utils/shipTestEvaluator';
import { getShipDurationMs } from '../../utils/demoMode';
import { ExternalLink, GitPullRequest } from 'lucide-react';

interface ShipTestSessionProps {
  onExit: () => void;
}

const ShipTestSession: React.FC<ShipTestSessionProps> = ({ onExit }) => {
  const [enrollment, setEnrollment] = useState<ShipTestEnrollment | null>(loadShipEnrollment);
  const [deploymentUrl, setDeploymentUrl] = useState(enrollment?.deploymentUrl ?? '');
  const [prUrl, setPrUrl] = useState(enrollment?.prUrl ?? '');
  const [remaining, setRemaining] = useState('');
  const [evaluating, setEvaluating] = useState(false);

  const challenge = shipTestChallenges.find((c) => c.id === enrollment?.challengeId);
  const isWorkTicket = challenge?.format === 'ticket' || challenge?.submitMode === 'pr';

  useEffect(() => {
    if (!enrollment) return;
    const tick = () => {
      const ms = new Date(enrollment.endsAt).getTime() - Date.now();
      if (ms <= 0) {
        setRemaining('Time expired');
        return;
      }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [enrollment]);

  const pushEvent = (role: ShipTestEvent['role'], message: string) => {
    if (!enrollment) return;
    const event: ShipTestEvent = {
      id: `ev-${Date.now()}`,
      role,
      message,
      at: new Date().toISOString(),
    };
    const next = { ...enrollment, events: [...enrollment.events, event] };
    setEnrollment(next);
    saveShipEnrollment(next);
  };

  const canSubmit = isWorkTicket ? prUrl.trim().length > 0 : deploymentUrl.trim().length > 0;

  const submitShip = async () => {
    if (!enrollment || !challenge || !canSubmit) return;
    setEvaluating(true);
    try {
      const { scores, feedback } = await evaluateShipTest(
        challenge,
        enrollment,
        deploymentUrl,
        prUrl || undefined
      );
      const next: ShipTestEnrollment = {
        ...enrollment,
        deploymentUrl: deploymentUrl || undefined,
        prUrl: prUrl || undefined,
        status: 'evaluated',
        scores,
        feedback,
      };
      setEnrollment(next);
      saveShipEnrollment(next);
      pushEvent('reviewer', feedback);
    } finally {
      setEvaluating(false);
    }
  };

  if (!enrollment || !challenge) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary mb-4">No active Ship Test.</p>
        <PremiumButton variant="primary" onClick={onExit}>
          Back to lobby
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-wrap justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{challenge.title}</h1>
          <p className="text-accent-blue font-mono text-lg mt-1">{remaining}</p>
          {isWorkTicket && (
            <p className="text-xs text-text-secondary mt-1 uppercase tracking-wide">
              Work Ticket · AI allowed · PR submit
            </p>
          )}
        </div>
        <PremiumButton variant="ghost" size="sm" onClick={onExit}>
          Exit
        </PremiumButton>
      </div>

      {isWorkTicket && challenge.ticketBrief && (
        <div className="card p-6 mb-6 border-accent-blue/30">
          <h3 className="font-bold text-text-primary mb-2 flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-accent-blue" />
            Engineering ticket
          </h3>
          <pre className="text-text-secondary text-sm whitespace-pre-wrap font-sans">
            {challenge.ticketBrief}
          </pre>
          {challenge.starterRepoUrl && (
            <a
              href={challenge.starterRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-accent-blue text-sm mt-4 hover:underline"
            >
              Open starter repo <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      <div className="card p-6 mb-6 border-accent-blue/20">
        <h3 className="font-bold text-text-primary mb-2">Product Manager</h3>
        <p className="text-text-secondary text-sm">{challenge.pmBrief}</p>
        <ul className="mt-4 text-sm text-text-secondary space-y-1">
          {challenge.constraints.map((c) => (
            <li key={c}>• {c}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <PremiumButton
          variant="secondary"
          size="sm"
          onClick={() =>
            pushEvent(
              'tech-lead',
              isWorkTicket
                ? 'Checkpoint: paste your PR link when ready — reviewer will check tests and scope.'
                : 'Checkpoint: share your architecture in 3 bullets before coding more.'
            )
          }
        >
          Tech Lead checkpoint
        </PremiumButton>
        <PremiumButton
          variant="secondary"
          size="sm"
          onClick={() =>
            pushEvent(
              'user-simulator',
              isWorkTicket
                ? 'CI note: lint passed but integration test flaky — document in PR.'
                : 'User report: mobile layout breaks on small screens.'
            )
          }
        >
          {isWorkTicket ? 'CI / reviewer event' : 'User simulator event'}
        </PremiumButton>
      </div>

      {enrollment.events.length > 0 && (
        <div className="card p-4 mb-6 max-h-48 overflow-y-auto">
          <h4 className="text-sm font-semibold text-text-secondary mb-3">Simulation log</h4>
          {enrollment.events.map((e) => (
            <p key={e.id} className="text-sm text-text-secondary mb-2">
              <span className="text-accent-blue capitalize">{e.role}</span>: {e.message}
            </p>
          ))}
        </div>
      )}

      {enrollment.status !== 'evaluated' ? (
        <div className="card p-6">
          <h3 className="font-bold mb-3">{isWorkTicket ? 'Submit PR' : 'Deploy & submit'}</h3>
          {isWorkTicket && (
            <input
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/org/repo/pull/42"
              className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-gray-700 text-text-primary mb-4"
            />
          )}
          <input
            value={deploymentUrl}
            onChange={(e) => setDeploymentUrl(e.target.value)}
            placeholder={
              isWorkTicket
                ? 'Optional preview URL (Vercel, Railway, …)'
                : 'https://your-deployed-app.vercel.app'
            }
            className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-gray-700 text-text-primary mb-4"
          />
          <PremiumButton
            variant="primary"
            onClick={submitShip}
            disabled={!canSubmit}
            loading={evaluating}
          >
            Submit for AI evaluation
          </PremiumButton>
        </div>
      ) : (
        <>
          {enrollment.scores && (
            <ShipScoreBreakdown scores={enrollment.scores} feedback={enrollment.feedback} />
          )}
          {prUrl && (
            <a
              href={prUrl}
              className="text-accent-blue text-sm mt-4 inline-block"
              target="_blank"
              rel="noreferrer"
            >
              View pull request →
            </a>
          )}
          {deploymentUrl && (
            <a
              href={deploymentUrl}
              className="text-accent-blue text-sm mt-4 ml-4 inline-block"
              target="_blank"
              rel="noreferrer"
            >
              View deployment →
            </a>
          )}
        </>
      )}
    </div>
  );
};

export function enrollInShipTest(challengeId: string): ShipTestEnrollment {
  const challenge = shipTestChallenges.find((c) => c.id === challengeId);
  const duration = challenge ? getShipDurationMs(challenge.format) : getShipDurationMs('24h');
  const enrolledAt = new Date().toISOString();
  const enrollment: ShipTestEnrollment = {
    challengeId,
    enrolledAt,
    endsAt: new Date(Date.now() + duration).toISOString(),
    status: 'active',
    events: [
      {
        id: 'ev-start',
        role: 'pm',
        message: shipTestChallenges.find((c) => c.id === challengeId)?.pmBrief ?? 'Build the MVP.',
        at: enrolledAt,
      },
    ],
  };
  saveShipEnrollment(enrollment);
  return enrollment;
}

export default ShipTestSession;
