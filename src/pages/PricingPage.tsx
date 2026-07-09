import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import { Check, ArrowLeft, Building2, Calendar, User, Zap, TreePine } from 'lucide-react';
import {
  canStartFreeTrial,
  saveSubscription,
  startFreeTrial,
} from '../utils/subscriptionStorage';
import type { SubscriptionPlan } from '../types/employer';

type JourneyTier = {
  id: SubscriptionPlan | 'daily';
  name: string;
  tagline: string;
  price: string;
  priceDetail: string;
  duration: string;
  desc: string;
  features: string[];
  recommended?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  cta: string;
};

const JOURNEY_TIERS: JourneyTier[] = [
  {
    id: 'free',
    name: 'Daily',
    tagline: 'Build the habit',
    price: '€0',
    priceDetail: 'forever',
    duration: 'Every day',
    desc: 'Duolingo-style loop: one bite, one problem, one micro-ship. Your free front door.',
    features: [
      'Daily loop + streak tracking',
      '2 AI interviews / day',
      '1 Ship Test / month',
      'Basic talent profile',
    ],
    icon: Calendar,
    cta: 'Start Daily',
  },
  {
    id: 'interview-season',
    name: 'Sprint',
    tagline: 'Active job hunt',
    price: '€149',
    priceDetail: 'one payment',
    duration: '2–3 weeks intense · 90-day access',
    desc: 'When interviews are scheduled. Unlimited mocks, all Ship formats, portfolio export.',
    features: [
      'Everything in Season for 90 days',
      'Unlimited AI interviews + all Ship Tests',
      'Work Ticket practice (PR submit)',
      'Portfolio export + AI product reviewer',
      'Talent profile visible to employers',
    ],
    recommended: true,
    icon: Zap,
    cta: 'Start Sprint',
  },
  {
    id: 'builder',
    name: 'Season',
    tagline: 'Long runway',
    price: '€49/mo',
    priceDetail: 'cancel anytime',
    duration: '3–4 months typical',
    desc: 'Skill trees, ships, and profile depth when you have time to compound — not just cram.',
    features: [
      'Unlimited AI interviews',
      'All Ship Test + Work Ticket formats',
      'Skill tree tracks + drill paths',
      'Portfolio export + coaching notes',
    ],
    icon: TreePine,
    cta: 'Get Season',
  },
];

const businessTiers: {
  id: string;
  name: string;
  size: string;
  price: string;
  priceDetail: string;
  desc: string;
  features: string[];
  recommended?: boolean;
  cta: string;
}[] = [
  {
    id: 'biz-small',
    name: 'Small Business',
    size: 'Up to 50 employees',
    price: '€250/mo',
    priceDetail: 'or €2,400/yr (2 months free)',
    desc: 'For startups hiring their first engineers — priced for a small team, not an enterprise.',
    features: [
      '2 open roles at a time',
      '25 assessments / month',
      'AI interviews + one custom Ship Test',
      'Ranked shortlists with rubric notes',
      'Email support',
    ],
    cta: 'Start 60-day free pilot',
  },
  {
    id: 'biz-growth',
    name: 'Growth',
    size: '50–500 employees',
    price: '€900/mo',
    priceDetail: 'or €9,000/yr (2 months free)',
    desc: 'For scale-ups hiring every quarter across multiple teams.',
    features: [
      '10 open roles at a time',
      '150 assessments / month',
      'Custom Ship Tests + Work Tickets per role',
      'VERVE-style soft-skill rubric packs',
      'ATS export (CSV) + priority support',
    ],
    recommended: true,
    cta: 'Start 60-day free pilot',
  },
  {
    id: 'biz-enterprise',
    name: 'Enterprise',
    size: '500+ employees',
    price: 'Custom',
    priceDetail: 'annual contract',
    desc: 'For companies that need governance, integrations, and volume.',
    features: [
      'Unlimited roles + volume assessment pricing',
      'SSO / SAML',
      'API + ATS integrations (Greenhouse, Lever)',
      'Custom rubrics calibrated to your bar',
      'Dedicated support + security review',
    ],
    cta: 'Talk to us',
  },
];

const CONTACT_EMAIL = 'hello@chaminext.com';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const audience = searchParams.get('for') === 'companies' ? 'companies' : 'individuals';
  const [loading, setLoading] = useState<string | null>(null);
  const trialAvailable = canStartFreeTrial();

  const setAudience = (a: 'individuals' | 'companies') => {
    setSearchParams(a === 'companies' ? { for: 'companies' } : {}, { replace: true });
  };

  const startTrial = () => {
    if (startFreeTrial()) {
      navigate('/daily');
      return;
    }
    navigate('/pricing');
  };

  const checkout = async (plan: SubscriptionPlan) => {
    if (plan === 'free') {
      saveSubscription('free');
      navigate('/daily');
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
        <div className="text-center mb-8">
          <h1 className="text-hero-headline font-bold mb-4">
            {audience === 'companies' ? 'Hiring plans' : 'Daily · Sprint · Season'}
          </h1>
          <p className="text-subheadline text-text-secondary max-w-xl mx-auto">
            {audience === 'companies'
              ? 'Priced by company size — a five-person startup should not pay enterprise rates.'
              : 'Start free with Daily. Upgrade when your job hunt intensifies or you need a longer runway.'}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1">
            <button
              type="button"
              onClick={() => setAudience('individuals')}
              className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                audience === 'individuals'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <User className="w-4 h-4" />
              Job seeker
            </button>
            <button
              type="button"
              onClick={() => setAudience('companies')}
              className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                audience === 'companies'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Hiring team
            </button>
          </div>
        </div>

        {audience === 'companies' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {businessTiers.map((t) => (
                <div
                  key={t.id}
                  className={`card p-6 flex flex-col ${t.recommended ? 'plan-builder-recommended' : ''}`}
                >
                  {t.recommended && (
                    <span className="text-xs font-semibold text-accent-blue mb-2">Most common</span>
                  )}
                  <h2 className="text-xl font-bold">{t.name}</h2>
                  <p className="text-xs text-text-secondary mt-0.5 mb-2">{t.size}</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--accent-bright)' }}>
                    {t.price}
                  </p>
                  <p className="text-xs text-text-secondary mb-3">{t.priceDetail}</p>
                  <p className="text-text-secondary text-sm mb-4">{t.desc}</p>
                  <ul className="space-y-2 mb-6 flex-grow">
                    {t.features.map((f) => (
                      <li key={f} className="text-sm text-text-secondary flex gap-2">
                        <Check className="w-4 h-4 text-accent-blue shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                      `ChamiNext ${t.name} — pilot request`
                    )}`}
                  >
                    <PremiumButton
                      variant={t.recommended ? 'primary' : 'secondary'}
                      size="md"
                      fullWidth
                    >
                      {t.cta}
                    </PremiumButton>
                  </a>
                </div>
              ))}
            </div>

            <div className="card p-6 mb-8 text-center">
              <p className="text-sm text-text-secondary max-w-2xl mx-auto">
                <span className="font-semibold text-text-primary">
                  Every plan starts with a free 60-day pilot
                </span>{' '}
                on one open role: we configure a Ship Test, seed your pipeline, and deliver a ranked
                shortlist in 72 hours. No setup fees.
              </p>
            </div>

            <p className="text-center text-sm text-text-secondary mb-4">
              Want to see the employer product first?{' '}
              <Link to="/employers" className="text-accent-blue font-medium hover:underline">
                Tour the Interview Studio →
              </Link>
            </p>
          </>
        ) : (
          <>
            {trialAvailable && (
              <div className="card p-6 md:p-8 mb-8 border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Try Sprint free for 30 days</h2>
                  <p className="text-text-secondary text-sm max-w-xl">
                    Full Season access for one month: unlimited AI interviews, all Ship formats,
                    Work Tickets. No credit card in demo mode.
                  </p>
                </div>
                <PremiumButton variant="primary" size="lg" onClick={startTrial} className="shrink-0">
                  Start free trial
                </PremiumButton>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {JOURNEY_TIERS.map((t) => {
                const Icon = t.icon;
                const planId = t.id === 'daily' ? 'free' : t.id;
                return (
                  <div
                    key={t.name}
                    className={`card p-6 flex flex-col ${t.recommended ? 'plan-featured plan-builder-recommended' : ''}`}
                  >
                    {t.recommended && (
                      <span className="text-xs font-semibold text-accent-blue mb-2">
                        Best for active search
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-accent-blue" />
                      <h2 className="text-xl font-bold">{t.name}</h2>
                    </div>
                    <p className="text-xs text-accent-blue font-medium mb-1">{t.tagline}</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent-bright)' }}>
                      {t.price}
                    </p>
                    <p className="text-xs text-text-secondary">{t.priceDetail}</p>
                    <p className="text-xs text-text-secondary mt-1 mb-3">{t.duration}</p>
                    <p className="text-text-secondary text-sm mb-4">{t.desc}</p>
                    <ul className="space-y-2 mb-6 flex-grow">
                      {t.features.map((f) => (
                        <li key={f} className="text-sm text-text-secondary flex gap-2">
                          <Check className="w-4 h-4 text-accent-blue shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <PremiumButton
                      variant={t.recommended ? 'primary' : 'secondary'}
                      size="md"
                      fullWidth
                      onClick={() => checkout(planId as SubscriptionPlan)}
                      loading={loading === planId}
                    >
                      {t.cta}
                    </PremiumButton>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-text-secondary text-sm max-w-lg mx-auto">
              Without Stripe keys, checkout activates plans locally for your demo. Add STRIPE_SECRET_KEY
              in Netlify for live payments.
            </p>

            <p className="text-center text-sm text-text-secondary mt-6">
              Hiring engineers?{' '}
              <button
                type="button"
                onClick={() => setAudience('companies')}
                className="text-accent-blue font-medium hover:underline"
              >
                See company plans from €250/mo →
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingPage;
