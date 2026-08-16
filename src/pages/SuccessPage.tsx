import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import {
  getSubscriptionExpiry,
  PLAN_LIMITS,
  saveSubscription,
  saveVerifiedSubscription,
} from '../utils/subscriptionStorage';
import type { SubscriptionPlan } from '../types/employer';

const SuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const planHint = (params.get('plan') as SubscriptionPlan) || 'builder';
  const sessionId = params.get('session_id');
  const isDemo = params.get('demo') === '1';
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>(
    sessionId || isDemo ? 'loading' : 'ok'
  );
  const [plan, setPlan] = useState<SubscriptionPlan>(planHint);
  const [error, setError] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      // Legacy forgeable path without session — only allow free/demo, not paid grant
      if (!sessionId && !isDemo) {
        if (planHint === 'free') saveSubscription('free');
        setStatus('ok');
        return;
      }

      try {
        const res = await fetch('/.netlify/functions/verify-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            plan: planHint,
            demo: isDemo || !sessionId,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.verified) {
          throw new Error(data.error || 'Verification failed');
        }
        if (cancelled) return;

        const nextPlan = (data.plan as SubscriptionPlan) || planHint;
        setPlan(nextPlan);
        setWorkspaceId(data.workspaceId);
        saveVerifiedSubscription({
          plan: nextPlan,
          expiresAt: data.expiresAt,
          trialEndsAt: data.trialEndsAt,
          email: data.email,
          stripeSessionId: sessionId || undefined,
          workspaceId: data.workspaceId,
          companyPlan:
            nextPlan === 'biz-small' || nextPlan === 'biz-growth' ? nextPlan : undefined,
        });
        setStatus('ok');
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Could not verify payment');
        setStatus('error');
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, isDemo, planHint]);

  const label = PLAN_LIMITS[plan]?.label ?? plan;
  const expiresAt = plan === 'interview-season' ? getSubscriptionExpiry() : undefined;
  const expiryText =
    expiresAt &&
    new Date(expiresAt).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  const isCompany = plan === 'biz-small' || plan === 'biz-growth';

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Confirming your plan…</h1>
        <p className="text-text-secondary text-sm">Verifying checkout with Stripe.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Payment verification failed</h1>
        <p className="text-text-secondary mb-6 text-sm">{error}</p>
        <PremiumButton variant="primary" onClick={() => navigate('/pricing')}>
          Back to pricing
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg">
      <h1 className="text-4xl font-bold mb-4 text-text-primary">You&apos;re on {label}!</h1>
      <p className="text-text-secondary mb-8">
        {isDemo
          ? 'Demo activation: plan saved locally. Ready to present Practice and Ship Tests.'
          : isCompany
            ? `Company pilot active${workspaceId ? ` · workspace ${workspaceId}` : ''}. Open Interview Studio to create roles and assign soft-skill packs.`
            : plan === 'interview-season' && expiryText
              ? `Full Season access until ${expiryText}. Start your hiring sprint.`
              : 'Plan active. Start practicing with full access.'}
      </p>
      <div className="flex flex-col gap-3">
        <PremiumButton
          variant="primary"
          size="lg"
          onClick={() => navigate(isCompany ? '/employers' : '/practice')}
        >
          {isCompany ? 'Open Interview Studio' : 'Go to Practice'}
        </PremiumButton>
        <PremiumButton
          variant="secondary"
          onClick={() => navigate(isCompany ? '/pricing?for=companies' : '/employers')}
        >
          {isCompany ? 'Company plans' : 'View Interview Studio'}
        </PremiumButton>
      </div>
    </div>
  );
};

export default SuccessPage;
