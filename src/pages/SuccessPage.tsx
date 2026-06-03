import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import { saveSubscription } from '../utils/subscriptionStorage';
import type { SubscriptionPlan } from '../types/employer';

const SuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const plan = (params.get('plan') as SubscriptionPlan) || 'pro';
  const isDemo = params.get('demo') === '1';

  if (plan && ['pro', 'builder', 'premium', 'free'].includes(plan)) {
    saveSubscription(plan);
  }

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg">
      <h1 className="text-4xl font-bold mb-4 text-text-primary">You&apos;re on {plan}!</h1>
      <p className="text-text-secondary mb-8">
        {isDemo
          ? 'Demo activation — plan saved locally. Ready to present Practice & Ship Tests.'
          : 'Subscription active. Start practicing with full access.'}
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
