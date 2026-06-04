import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import {
  canStartFreeTrial,
  getTrialDaysRemaining,
  isOnActiveTrial,
} from '../../utils/subscriptionStorage';

const TrialBanner: React.FC = () => {
  const daysLeft = getTrialDaysRemaining();
  const onTrial = isOnActiveTrial();

  if (onTrial && daysLeft !== null) {
    return (
      <div className="bg-accent-blue/10 border-b border-accent-blue/30 px-4 py-2.5 text-center text-sm text-text-primary">
        <span className="inline-flex items-center gap-2 justify-center flex-wrap">
          <Clock className="w-4 h-4 text-accent-blue shrink-0" />
          <strong>Free trial:</strong> {daysLeft} day{daysLeft === 1 ? '' : 's'} left of full
          Builder access (Ship Tests + unlimited interviews).
          <Link to="/pricing" className="text-accent-blue font-medium underline-offset-2 hover:underline">
            Upgrade before it ends
          </Link>
        </span>
      </div>
    );
  }

  if (canStartFreeTrial()) {
    return (
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 py-2.5 text-center text-sm text-text-secondary">
        New here?{' '}
        <Link to="/pricing" className="text-accent-blue font-medium">
          Start your free 30-day trial
        </Link>{' '}
        (full Builder access, no card in demo mode).
      </div>
    );
  }

  return null;
};

export default TrialBanner;
