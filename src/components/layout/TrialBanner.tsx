import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import {
  canStartFreeTrial,
  getTrialDaysRemaining,
  isOnActiveTrial,
} from '../../utils/subscriptionStorage';

const barStyle: React.CSSProperties = {
  backgroundColor: '#1e3a5f',
  borderBottom: '1px solid rgba(59, 130, 246, 0.35)',
};

const TrialBanner: React.FC = () => {
  const daysLeft = getTrialDaysRemaining();
  const onTrial = isOnActiveTrial();

  if (onTrial && daysLeft !== null) {
    return (
      <div className="px-4 py-2.5 text-center text-sm text-[#e8eef7]" style={barStyle}>
        <span className="inline-flex items-center gap-2 justify-center flex-wrap">
          <Clock className="w-4 h-4 text-[#93c5fd] shrink-0" />
          <strong className="font-medium text-white">Free trial:</strong> {daysLeft} day
          {daysLeft === 1 ? '' : 's'} left of full Builder access (Ship Tests + unlimited
          interviews).
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
      <div className="px-4 py-2.5 text-center text-sm text-[#c5d4e8]" style={barStyle}>
        New here?{' '}
        <Link
          to="/pricing"
          className="text-[#93c5fd] font-medium hover:text-white transition-colors"
        >
          Start your free 30-day trial
        </Link>{' '}
        <span className="text-[#9ab0cc]">(full Builder access, no card in demo mode)</span>
      </div>
    );
  }

  return null;
};

export default TrialBanner;
