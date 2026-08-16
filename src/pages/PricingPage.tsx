import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PremiumButton from '../components/ui/PremiumButton';
import { Check, ArrowLeft, Building2, Calendar, User, Zap, TreePine } from 'lucide-react';
import {
  canStartFreeTrial,
  saveSubscription,
  startFreeTrial,
} from '../utils/subscriptionStorage';
import type { SubscriptionPlan } from '../types/employer';
import {
  FOUNDING,
  LIST_PRICES,
  discountedCents,
  formatEurFromCents,
  type FoundingOfferResponse,
} from '../data/foundingOffer';

type JourneyTier = {
  id: SubscriptionPlan | 'daily';
  name: string;
  tagline: string;
  priceCents: number;
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
    priceCents: 0,
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
    priceCents: LIST_PRICES['interview-season'],
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
    priceCents: LIST_PRICES.builder,
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
  id: 'biz-small' | 'biz-growth' | 'biz-enterprise';
  name: string;
  size: string;
  priceCents: number | null;
  priceDetail: string;
  desc: string;
  features: string[];
  recommended?: boolean;
  cta: string;
  checkout?: boolean;
}[] = [
  {
    id: 'biz-small',
    name: 'Small Business',
    size: 'Up to 50 employees',
    priceCents: LIST_PRICES['biz-small'],
    priceDetail: 'or annual (2 months free) · 60-day free trial',
    desc: 'For startups hiring their first engineers — priced for a small team, not an enterprise.',
    features: [
      '2 open roles at a time',
      '25 assessments / month',
      'AI interviews + one custom Ship Test',
      'Soft-skills rubric pack in Studio',
      'Ranked shortlists + CSV export',
      'Email support',
    ],
    cta: 'Start 60-day free pilot',
    checkout: true,
  },
  {
    id: 'biz-growth',
    name: 'Growth',
    size: '50–500 employees',
    priceCents: LIST_PRICES['biz-growth'],
    priceDetail: 'or annual (2 months free) · 60-day free trial',
    desc: 'For scale-ups hiring every quarter across multiple teams.',
    features: [
      '10 open roles at a time',
      '150 assessments / month',
      'Custom Ship Tests + Work Tickets per role',
      'Soft-skills rubric packs',
      'ATS export (CSV) + priority support',
    ],
    recommended: true,
    cta: 'Start 60-day free pilot',
    checkout: true,
  },
  {
    id: 'biz-enterprise',
    name: 'Enterprise',
    size: '500+ employees',
    priceCents: null,
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

const CONTACT_EMAIL = 'chaminxt@gmail.com';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const audience = searchParams.get('for') === 'companies' ? 'companies' : 'individuals';
  const [loading, setLoading] = useState<string | null>(null);
  const [foundingOpen, setFoundingOpen] = useState(true);
  const [foundingRemaining, setFoundingRemaining] = useState(FOUNDING.maxRedemptions);
  const trialAvailable = canStartFreeTrial();

  useEffect(() => {
    let cancelled = false;
    fetch('/.netlify/functions/founding-offer')
      .then((r) => r.json())
      .then((data: FoundingOfferResponse) => {
        if (cancelled || !data?.founding) return;
        setFoundingOpen(data.founding.open);
        setFoundingRemaining(data.founding.remaining);
      })
      .catch(() => {
        /* offline / demo — keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setAudience = (a: 'individuals' | 'companies') => {
    setSearchParams(a === 'companies' ? { for: 'companies' } : {}, { replace: true });
  };

  const startTrial = () => {
    if (startFreeTrial()) {
      navigate('/journey');
      return;
    }
    navigate('/pricing');
  };

  const checkout = async (plan: SubscriptionPlan) => {
    if (plan === 'free') {
      saveSubscription('free');
      navigate('/journey');
      return;
    }
    setLoading(plan);
    try {
      const isCompany = plan === 'biz-small' || plan === 'biz-growth';
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          applyFoundingDiscount: foundingOpen,
          successUrl: `${window.location.origin}/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing${isCompany ? '?for=companies' : ''}`,
        }),
      });
      const data = await res.json();
      if (data.demoMode) {
        saveSubscription(plan);
        navigate(`/success?plan=${plan}&demo=1`);
        return;
      }
      if (data.url) window.location.href = data.url;
      else if (data.error) alert(data.error);
    } finally {
      setLoading(null);
    }
  };

  const priceBlock = (cents: number, monthly?: boolean) => {
    if (cents === 0) {
      return (
        <>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent-bright)' }}>
            €0
          </p>
        </>
      );
    }
    const list = formatEurFromCents(cents);
    const founding = formatEurFromCents(discountedCents(cents));
    if (foundingOpen) {
      return (
        <>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent-bright)' }}>
            {founding}
            {monthly ? '/mo' : ''}
          </p>
          <p className="text-xs text-text-secondary line-through">{list}{monthly ? '/mo' : ''}</p>
          <p className="text-xs text-accent-blue font-medium mt-0.5">
            {FOUNDING.code} · {FOUNDING.percentOff}% off founding
          </p>
        </>
      );
    }
    return (
      <p className="text-2xl font-bold" style={{ color: 'var(--accent-bright)' }}>
        {list}
        {monthly ? '/mo' : ''}
      </p>
    );
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

        {foundingOpen && (
          <div className="card p-4 md:p-5 mb-8 border-accent-blue/40 bg-[var(--bg-secondary)] text-center">
            <p className="text-sm font-semibold text-text-primary">
              Founding cohort: {FOUNDING.percentOff}% off with code{' '}
              <span className="font-mono text-accent-blue">{FOUNDING.code}</span>
            </p>
            <p className="text-xs text-text-secondary mt-1">
              First {FOUNDING.maxRedemptions} paying users · {foundingRemaining} spots left · auto-applied
              at checkout when configured (or enter the code on Stripe Checkout)
            </p>
          </div>
        )}

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
                  {t.priceCents == null ? (
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent-bright)' }}>
                      Custom
                    </p>
                  ) : (
                    priceBlock(t.priceCents, true)
                  )}
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
                  {t.checkout ? (
                    <PremiumButton
                      variant={t.recommended ? 'primary' : 'secondary'}
                      size="md"
                      fullWidth
                      loading={loading === t.id}
                      onClick={() => checkout(t.id)}
                    >
                      {t.cta}
                    </PremiumButton>
                  ) : (
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                        `ChamiNext ${t.name} — pilot request`
                      )}`}
                    >
                      <PremiumButton variant="secondary" size="md" fullWidth>
                        {t.cta}
                      </PremiumButton>
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="card p-6 mb-8 text-center">
              <p className="text-sm text-text-secondary max-w-2xl mx-auto">
                <span className="font-semibold text-text-primary">
                  Every paid company plan includes a 60-day free trial
                </span>{' '}
                on Stripe Checkout. Soft-skills packs, invite links, and CSV export are live in
                Interview Studio. No setup fees.
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
                    {priceBlock(t.priceCents, t.id === 'builder')}
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
              Checkout opens Stripe with promotion codes enabled. Without{' '}
              <code className="text-xs">STRIPE_SECRET_KEY</code>, plans activate locally for demos.
            </p>

            <p className="text-center text-sm text-text-secondary mt-6">
              Hiring engineers?{' '}
              <button
                type="button"
                onClick={() => setAudience('companies')}
                className="text-accent-blue font-medium hover:underline"
              >
                See company plans from{' '}
                {foundingOpen
                  ? formatEurFromCents(discountedCents(LIST_PRICES['biz-small']))
                  : formatEurFromCents(LIST_PRICES['biz-small'])}
                /mo →
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingPage;
