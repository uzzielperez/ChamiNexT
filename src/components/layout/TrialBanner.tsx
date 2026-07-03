import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import {
  canStartFreeTrial,
  getEffectivePlan,
  getTrialDaysRemaining,
  isOnActiveTrial,
} from '../../utils/subscriptionStorage';
import { dismissTrialBanner, isTrialBannerDismissed } from '../../utils/trialBannerStorage';

const barStyle: React.CSSProperties = {
  backgroundColor: '#1a2744',
  borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
};

/** Show only for free-tier guests who have not dismissed the bar */
export function shouldShowTrialBanner(): boolean {
  if (isTrialBannerDismissed()) return false;
  if (getEffectivePlan() !== 'free') return false;
  return canStartFreeTrial() || isOnActiveTrial();
}

const TrialBanner: React.FC = () => {
  const [dismissed, setDismissed] = React.useState(() => isTrialBannerDismissed());
  const daysLeft = getTrialDaysRemaining();
  const onTrial = isOnActiveTrial();

  if (dismissed || getEffectivePlan() !== 'free') return null;
  if (!canStartFreeTrial() && !onTrial) return null;

  const dismiss = () => {
    dismissTrialBanner();
    setDismissed(true);
  };

  if (onTrial && daysLeft !== null) {
    return (
      <div
        className="relative px-4 py-2.5 text-center text-sm text-[#e8eef7]"
        style={barStyle}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9ab0cc] hover:text-white"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="inline-flex items-center gap-2 justify-center flex-wrap pr-8">
          <Clock className="w-4 h-4 text-[#93c5fd] shrink-0" />
          <strong className="font-medium text-white">Free trial:</strong> {daysLeft} day
          {daysLeft === 1 ? '' : 's'} left of full Builder access.
          <Link
            to="/pricing"
            className="text-[#93c5fd] font-medium underline-offset-2 hover:underline hover:text-white"
          >
            Upgrade before it ends
          </Link>
        </span>
      </div>
    );
  }

  if (canStartFreeTrial()) {
    return (
      <div
        className="relative px-4 py-2.5 text-center text-sm text-[#c5d4e8]"
        style={barStyle}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9ab0cc] hover:text-white"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="inline-block pr-8">
          New here?{' '}
          <Link
            to="/pricing"
            className="text-[#93c5fd] font-medium hover:text-white transition-colors"
          >
            Start your free 30-day trial
          </Link>{' '}
          <span className="text-[#9ab0cc]">(full Builder access, no card in demo mode)</span>
        </span>
      </div>
    );
  }

  return null;
};

export default TrialBanner;
