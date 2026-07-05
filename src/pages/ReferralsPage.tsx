import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Gift, RefreshCw, Share2, Users } from 'lucide-react';
import PremiumButton from '../components/ui/PremiumButton';
import {
  REFEREE_BONUS,
  REFERRER_REWARD_DAYS,
  REFERRER_MAX_REWARDS_PER_MONTH,
  getOrCreateReferralProfile,
  getReferralLink,
} from '../utils/referralStorage';
import { syncReferrerRewards } from '../utils/referralApi';
import { getEffectivePlan, getTrialDaysRemaining, isOnActiveTrial } from '../utils/subscriptionStorage';

const ReferralsPage: React.FC = () => {
  const [profile, setProfile] = useState(getOrCreateReferralProfile);
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(false);

  const link = getReferralLink();

  const refresh = useCallback(() => {
    setProfile(getOrCreateReferralProfile());
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('chaminext_ref_welcome') === '1') {
      setWelcome(true);
    }
    void (async () => {
      setSyncing(true);
      try {
        const { claimedDays } = await syncReferrerRewards();
        if (claimedDays > 0) {
          setClaimMsg(`+${claimedDays} days of Builder access applied to your account.`);
        }
        refresh();
      } finally {
        setSyncing(false);
      }
    })();
  }, [refresh]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'ChamiNexT — AI interview prep',
        text: 'Practice reasoning-first interviews (not LeetCode trivia). My referral link:',
        url: link,
      });
    } else {
      copyLink();
    }
  };

  const plan = getEffectivePlan();
  const trialDays = getTrialDaysRemaining();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl pb-24 md:pb-12">
      <div className="text-center mb-10">
        <p className="text-sm text-emerald-400 font-medium uppercase tracking-wide flex items-center justify-center gap-2">
          <Gift className="w-4 h-4" /> Referral program
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-2 mb-4">
          Invite friends. Earn interview prep time.
        </h1>
        <p className="text-subheadline text-text-secondary max-w-xl mx-auto">
          Beta program: friends get bonus practice; you get{' '}
          <strong className="text-text-primary">{REFERRER_REWARD_DAYS} extra days</strong> of Builder
          access when they complete their first scored interview.
        </p>
      </div>

      {welcome && (
        <div className="mb-6 p-4 rounded-[var(--radius-card)] border border-emerald-400/40 bg-emerald-400/10 text-sm text-text-primary">
          Welcome — your referral bonus is active:{' '}
          <strong>+{REFEREE_BONUS.extraInterviewsPerDay} interviews/day</strong> for{' '}
          {REFEREE_BONUS.days} days.
        </div>
      )}

      {claimMsg && (
        <div className="mb-6 p-4 rounded-[var(--radius-card)] border border-accent-blue/40 bg-accent-blue/10 text-sm text-text-primary">
          {claimMsg}
        </div>
      )}

      <div className="p-6 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] mb-6">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
          Your referral code
        </p>
        <p className="text-3xl font-bold text-emerald-400 tracking-widest mb-4">{profile.referralCode}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <PremiumButton variant="primary" size="sm" onClick={copyLink}>
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied' : 'Copy link'}
          </PremiumButton>
          <PremiumButton variant="outline" size="sm" onClick={shareNative}>
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </PremiumButton>
          <PremiumButton
            variant="ghost"
            size="sm"
            onClick={async () => {
              setSyncing(true);
              setClaimMsg(null);
              try {
                const { claimedDays } = await syncReferrerRewards();
                if (claimedDays > 0) {
                  setClaimMsg(`+${claimedDays} days applied.`);
                } else {
                  setClaimMsg('No pending rewards right now — check back after friends finish an interview.');
                }
                refresh();
              } finally {
                setSyncing(false);
              }
            }}
            disabled={syncing}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${syncing ? 'animate-spin' : ''}`} />
            Sync rewards
          </PremiumButton>
        </div>
        <p className="text-xs text-text-secondary break-all font-mono bg-black/20 rounded px-3 py-2">{link}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          value={profile.stats.qualified}
          label="Friends who qualified"
        />
        <StatCard
          icon={<Gift className="w-5 h-5" />}
          value={profile.stats.pendingRewardDays}
          label="Reward days pending"
        />
        <StatCard
          icon={<Check className="w-5 h-5" />}
          value={profile.stats.claimedRewardDays}
          label="Days claimed total"
        />
      </div>

      <div className="space-y-4 text-sm text-text-secondary mb-8">
        <h2 className="text-lg font-bold text-text-primary">How it works</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Share your link — friends land on practice with your code attached.</li>
          <li>
            They get <strong className="text-text-primary">+{REFEREE_BONUS.extraInterviewsPerDay} interviews/day</strong>{' '}
            for {REFEREE_BONUS.days} days (free tier).
          </li>
          <li>
            When they finish <strong className="text-text-primary">one full scored interview</strong>, you earn{' '}
            {REFERRER_REWARD_DAYS} days of Builder access (max {REFERRER_MAX_REWARDS_PER_MONTH}/month).
          </li>
          <li>Open this page and tap <strong className="text-text-primary">Sync rewards</strong> to apply pending days.</li>
        </ol>
        <p className="text-xs">
          Current plan: <span className="text-text-primary capitalize">{plan}</span>
          {isOnActiveTrial() && trialDays !== null ? ` · ${trialDays} trial days left` : ''}.
          Server-side accounts coming soon — rewards sync via your referral code.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/practice">
          <PremiumButton variant="primary">Start practicing</PremiumButton>
        </Link>
        <Link to="/pricing">
          <PremiumButton variant="outline">Founding member pricing</PremiumButton>
        </Link>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({
  icon,
  value,
  label,
}) => (
  <div className="p-4 rounded-[var(--radius-card)] border border-[var(--border-color)] bg-[var(--bg-secondary)] text-center">
    <div className="text-accent-blue flex justify-center mb-2">{icon}</div>
    <div className="text-2xl font-bold text-text-primary">{value}</div>
    <div className="text-xs text-text-secondary mt-1">{label}</div>
  </div>
);

export default ReferralsPage;
