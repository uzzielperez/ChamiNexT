import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import { Check, ArrowLeft, Calendar } from 'lucide-react';
import {
  canStartFreeTrial,
  saveSubscription,
  startFreeTrial,
} from '../utils/subscriptionStorage';
import type { SubscriptionPlan } from '../types/employer';

const INTERVIEW_SEASON: {
  id: SubscriptionPlan;
  name: string;
  price: string;
  priceDetail: string;
  roiLine: string;
  desc: string;
  features: string[];
} = {
  id: 'interview-season',
  name: 'Interview Season',
  price: '€149',
  priceDetail: '90 days · one payment',
  roiLine:
    'Less than one human mock interview. Built for a 2–4 month hiring sprint toward six-figure roles.',
  desc: 'Full Builder access while you interview. No monthly churn.',
  features: [
    'Everything in Builder for 90 days',
    'Unlimited AI interviews + all Ship Test formats',
    'Portfolio export + AI product reviewer',
    'Daily practice + talent profile for employers',
  ],
};

const monthlyTiers: {
  id: SubscriptionPlan;
  name: string;
  price: string;
  desc: string;
  features: string[];
  recommended?: boolean;
}[] = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    desc: 'Explore the platform',
    features: ['2 AI interviews / day', '1 Ship Test / month', 'Basic talent profile'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€19/mo',
    desc: 'For consistent daily practice',
    features: ['Unlimited AI interviews', 'Personalized roadmap', 'Score reports & replay'],
  },
  {
    id: 'builder',
    name: 'Builder',
    price: '€49/mo',
    desc: 'For active job seekers',
    features: [
      'Everything in Pro',
      'All Ship Test formats',
      'Portfolio export',
      'AI product reviewer',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '€89/mo',
    desc: 'For competitive roles at top companies',
    features: ['System design simulations', 'Elite mock interviews', 'Deep coaching notes'],
  },
];

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const trialAvailable = canStartFreeTrial();

  const startTrial = () => {
    if (startFreeTrial()) {
      navigate('/practice');
      return;
    }
    navigate('/pricing');
  };

  const checkout = async (plan: SubscriptionPlan) => {
    if (plan === 'free') {
      saveSubscription('free');
      navigate('/practice');
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          successUrl: `${window.location.origin}/success?plan=${plan}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });
      const data = await res.json();
      if (data.demoMode) {
        saveSubscription(plan);
        navigate(`/success?plan=${plan}&demo=1`);
        return;
      }
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="app-shell">
      <div className="container mx-auto px-4 py-12 max-w-6xl pb-24 md:pb-12">
        <PremiumButton variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </PremiumButton>
        <div className="text-center mb-12">
          <h1 className="text-hero-headline font-bold mb-4">Pricing</h1>
          <p className="text-subheadline text-text-secondary max-w-xl mx-auto">
            Built for engineers targeting six-figure roles.
          </p>
          <p className="text-sm text-text-secondary mt-4">
            Hiring?{' '}
            <Link to="/employers" className="text-accent-blue font-medium hover:underline">
              Interview Studio starts at €500/mo
            </Link>{' '}
            →{' '}
            <Link to="/employers" className="text-accent-blue font-medium hover:underline">
              View company plans
            </Link>
          </p>
        </div>

        {trialAvailable && (
          <div className="card p-6 md:p-8 mb-6 border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Free 30-day trial</h2>
              <p className="text-text-secondary text-sm max-w-xl">
                Full Builder for one month: unlimited AI interviews, all Ship Test formats, portfolio
                export. No credit card in demo mode. One trial per device until accounts are live.
              </p>
            </div>
            <PremiumButton variant="primary" size="lg" onClick={startTrial} className="shrink-0">
              Start free trial
            </PremiumButton>
          </div>
        )}

        <div className="card plan-featured p-8 md:p-10 mb-4">
          <div className="popular-badge">Most Popular</div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pt-2">
            <div className="flex-1 max-w-2xl">
              <span className="text-xs font-bold text-accent-blue uppercase tracking-wide mb-3 inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Best for active job search
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{INTERVIEW_SEASON.name}</h2>
              <p className="text-text-secondary mb-4">{INTERVIEW_SEASON.desc}</p>
              <p className="text-sm text-text-secondary border-l-2 border-accent-blue/50 pl-4 mb-6">
                {INTERVIEW_SEASON.roiLine}
              </p>
              <ul className="space-y-2">
                {INTERVIEW_SEASON.features.map((f) => (
                  <li key={f} className="text-sm text-text-secondary flex gap-2">
                    <Check className="w-4 h-4 text-accent-blue shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:text-right shrink-0">
              <p className="text-4xl font-bold text-text-primary">{INTERVIEW_SEASON.price}</p>
              <p className="text-sm text-text-secondary mt-1">{INTERVIEW_SEASON.priceDetail}</p>
              <p className="text-xs text-text-secondary mt-2">vs ~€147 for 3× Builder monthly</p>
              <PremiumButton
                variant="primary"
                size="lg"
                className="mt-6 w-full lg:w-auto"
                onClick={() => checkout(INTERVIEW_SEASON.id)}
                loading={loading === INTERVIEW_SEASON.id}
              >
                Start Interview Season
              </PremiumButton>
            </div>
          </div>
        </div>

        <div className="section-divider">
          <span>Or pay monthly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {monthlyTiers.map((t) => (
            <div
              key={t.id}
              className={`card p-6 flex flex-col ${t.recommended ? 'plan-builder-recommended' : ''}`}
            >
              {t.recommended && (
                <span className="text-xs font-semibold text-accent-blue mb-2">Recommended</span>
              )}
              <h2 className="text-xl font-bold">{t.name}</h2>
              <p className="text-2xl font-bold my-2" style={{ color: 'var(--accent-bright)' }}>
                {t.price}
              </p>
              <p className="text-text-secondary text-sm mb-4">{t.desc}</p>
              <ul className="space-y-2 mb-6 flex-grow">
                {t.features.map((f) => (
                  <li key={f} className="text-sm text-text-secondary flex gap-2">
                    <Check className="w-4 h-4 text-accent-blue shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {t.id === 'free' ? (
                <button
                  type="button"
                  onClick={() => checkout('free')}
                  className="text-link text-left w-full"
                  disabled={loading === 'free'}
                >
                  Start for free →
                </button>
              ) : t.id === 'builder' ? (
                <PremiumButton
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => checkout(t.id)}
                  loading={loading === t.id}
                >
                  Get Builder
                </PremiumButton>
              ) : (
                <PremiumButton
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => checkout(t.id)}
                  loading={loading === t.id}
                >
                  Get {t.name}
                </PremiumButton>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-text-secondary text-sm mt-10 max-w-lg mx-auto">
          Without Stripe keys, checkout activates plans locally for your demo. Add STRIPE_SECRET_KEY
          in Netlify for live payments.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
