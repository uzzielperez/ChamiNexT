import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';
import PremiumButton from '../components/ui/PremiumButton';
import { Check, ArrowLeft } from 'lucide-react';
import { saveSubscription } from '../utils/subscriptionStorage';
import type { SubscriptionPlan } from '../types/employer';

const tiers: {
  id: SubscriptionPlan;
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    desc: 'Try the loop',
    features: ['2 AI interviews / day', '1 Ship Test / month', 'Basic talent profile'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€19/mo',
    desc: 'Daily interview prep',
    features: ['Unlimited AI interviews', 'Personalized roadmap', 'Score reports & replay'],
  },
  {
    id: 'builder',
    name: 'Builder',
    price: '€49/mo',
    desc: 'Ship Tests unlocked',
    features: ['Everything in Pro', 'All Ship Test formats', 'Portfolio export', 'AI product reviewer'],
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '€89/mo',
    desc: 'Elite loop',
    features: ['System design simulations', 'Elite mock interviews', 'Deep coaching notes'],
  },
];

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

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
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground opacity={0.5} speed={0.9} />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <PremiumButton variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </PremiumButton>
        <div className="text-center mb-12">
          <h1 className="text-hero-headline font-bold mb-4">Pricing</h1>
          <p className="text-subheadline text-text-secondary max-w-xl mx-auto">
            B2C plans for engineers. Companies: Interview Studio from €500/mo — contact for demo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tiers.map((t) => (
            <div
              key={t.id}
              className={`card p-6 flex flex-col ${t.highlight ? 'border-accent-blue ring-1 ring-accent-blue/30' : ''}`}
            >
              {t.highlight && (
                <span className="text-xs font-bold text-accent-blue mb-2">BEST FOR DEMO</span>
              )}
              <h2 className="text-xl font-bold">{t.name}</h2>
              <p className="text-2xl font-bold text-gradient my-2">{t.price}</p>
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
                variant={t.highlight ? 'primary' : 'secondary'}
                size="md"
                fullWidth
                onClick={() => checkout(t.id)}
                loading={loading === t.id}
              >
                {t.id === 'free' ? 'Start free' : 'Get plan'}
              </PremiumButton>
            </div>
          ))}
        </div>
        <p className="text-center text-text-secondary text-sm mt-10 max-w-lg mx-auto">
          Without Stripe keys, checkout activates plans locally for your demo. Add STRIPE_SECRET_KEY in Netlify for live payments.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
