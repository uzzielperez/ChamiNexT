import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import {
  getSubscriptionExpiry,
  PLAN_LIMITS,
  saveSubscription,
} from '../utils/subscriptionStorage';
import type { SubscriptionPlan } from '../types/employer';

const PAID_PLANS: SubscriptionPlan[] = [
  'pro',
  'builder',
  'premium',
  'interview-season',
  'free',
];

const SuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const plan = (params.get('plan') as SubscriptionPlan) || 'pro';
  const isDemo = params.get('demo') === '1';

  if (plan && PAID_PLANS.includes(plan)) {
    saveSubscription(plan);
  }

  const label = PLAN_LIMITS[plan]?.label ?? plan;
  const expiresAt = plan === 'interview-season' ? getSubscriptionExpiry() : undefined;
  const expiryText =
    expiresAt &&
    new Date(expiresAt).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg">
      <h1 className="text-4xl font-bold mb-4 text-text-primary">You&apos;re on {label}!</h1>
      <p className="text-text-secondary mb-8">
        {isDemo
          ? 'Demo activation: plan saved locally. Ready to present Practice and Ship Tests.'
          : plan === 'interview-season' && expiryText
            ? `Full Builder access until ${expiryText}. Start your hiring sprint.`
            : 'Plan active. Start practicing with full access.'}
      </p>
      <div className="flex flex-col gap-3">
        <PremiumButton variant="primary" size="lg" onClick={() => navigate('/practice')}>
          Go to Practice
        </PremiumButton>
        <PremiumButton variant="secondary" onClick={() => navigate('/employers')}>
          View Interview Studio
        </PremiumButton>
      </div>
    </div>
  );
};

export default SuccessPage;
