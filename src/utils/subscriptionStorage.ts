import type { SubscriptionPlan, UserSubscription } from '../types/employer';

const SUB_KEY = 'chaminext_subscription';
const TRIAL_USED_KEY = 'chaminext_trial_used';
const REFERRAL_BONUS_KEY = 'chaminext_referral_bonus';
const INTERVIEW_SEASON_DAYS = 90;
const TRIAL_DAYS = 30;

export const PLAN_LIMITS: Record<
  SubscriptionPlan,
  { interviewsPerDay: number; shipTestsPerMonth: number; label: string }
> = {
  free: { interviewsPerDay: 2, shipTestsPerMonth: 1, label: 'Free' },
  pro: { interviewsPerDay: 999, shipTestsPerMonth: 0, label: 'Pro' },
  builder: { interviewsPerDay: 999, shipTestsPerMonth: 999, label: 'Builder' },
  premium: { interviewsPerDay: 999, shipTestsPerMonth: 999, label: 'Premium' },
  'interview-season': {
    interviewsPerDay: 999,
    shipTestsPerMonth: 999,
    label: 'Interview Season',
  },
};

function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function loadSubscription(): UserSubscription {
  try {
    const raw = localStorage.getItem(SUB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { plan: 'free', since: new Date().toISOString() };
}

export function saveSubscription(plan: SubscriptionPlan): void {
  const payload: UserSubscription = {
    plan,
    since: new Date().toISOString(),
    isTrial: false,
  };
  if (plan === 'interview-season') {
    payload.expiresAt = addDaysIso(INTERVIEW_SEASON_DAYS);
  }
  localStorage.setItem(SUB_KEY, JSON.stringify(payload));
}

/** One 30-day Builder trial per browser (upgrade to server-side check with Neon later). */
export function canStartFreeTrial(): boolean {
  return localStorage.getItem(TRIAL_USED_KEY) !== '1';
}

export function startFreeTrial(): boolean {
  if (!canStartFreeTrial()) return false;
  localStorage.setItem(TRIAL_USED_KEY, '1');
  const payload: UserSubscription = {
    plan: 'builder',
    since: new Date().toISOString(),
    expiresAt: addDaysIso(TRIAL_DAYS),
    isTrial: true,
  };
  localStorage.setItem(SUB_KEY, JSON.stringify(payload));
  return true;
}

export function isOnActiveTrial(): boolean {
  const sub = loadSubscription();
  if (!sub.isTrial || !sub.expiresAt) return false;
  return new Date(sub.expiresAt) >= new Date();
}

export function getTrialDaysRemaining(): number | null {
  if (!isOnActiveTrial()) return null;
  const sub = loadSubscription();
  if (!sub.expiresAt) return null;
  const ms = new Date(sub.expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

/** Active plan; expired paid/trial entitlements fall back to free. */
export function getEffectivePlan(): SubscriptionPlan {
  const sub = loadSubscription();
  if (sub.expiresAt && new Date(sub.expiresAt) < new Date()) {
    return 'free';
  }
  return sub.plan;
}

export function getSubscriptionExpiry(): string | undefined {
  const sub = loadSubscription();
  if (!sub.expiresAt || new Date(sub.expiresAt) < new Date()) return undefined;
  return sub.expiresAt;
}

export function hasBuilderAccess(): boolean {
  const plan = getEffectivePlan();
  return plan === 'builder' || plan === 'premium' || plan === 'interview-season';
}

export function canStartInterview(): boolean {
  const limit = getDailyInterviewLimit();
  const usage = getTodayUsage();
  return usage.interviews < limit;
}

/** Free tier + optional referral bonus interviews per day. */
export function getDailyInterviewLimit(): number {
  if (getEffectivePlan() !== 'free') return 999;
  const base = PLAN_LIMITS.free.interviewsPerDay;
  try {
    const raw = localStorage.getItem(REFERRAL_BONUS_KEY);
    if (!raw) return base;
    const bonus = JSON.parse(raw) as { extraPerDay: number; expiresAt: string };
    if (new Date(bonus.expiresAt) < new Date()) return base;
    return base + (bonus.extraPerDay || 0);
  } catch {
    return base;
  }
}

export function grantReferralBonusInterviews(extraPerDay: number, days: number): void {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  localStorage.setItem(
    REFERRAL_BONUS_KEY,
    JSON.stringify({ extraPerDay, expiresAt: expiresAt.toISOString() })
  );
}

/** Extend trial or paid plan expiry; grants builder trial if on free. */
export function extendSubscriptionDays(days: number): number {
  if (days <= 0) return 0;
  const sub = loadSubscription();
  const now = new Date();

  if (sub.expiresAt && new Date(sub.expiresAt) >= now) {
    const d = new Date(sub.expiresAt);
    d.setDate(d.getDate() + days);
    sub.expiresAt = d.toISOString();
    saveSubscriptionPayload(sub);
    return days;
  }

  if (getEffectivePlan() === 'free') {
    const payload: UserSubscription = {
      plan: 'builder',
      since: sub.since || now.toISOString(),
      expiresAt: addDaysIso(days),
      isTrial: true,
    };
    saveSubscriptionPayload(payload);
    return days;
  }

  const d = new Date();
  d.setDate(d.getDate() + days);
  sub.expiresAt = d.toISOString();
  saveSubscriptionPayload(sub);
  return days;
}

function saveSubscriptionPayload(payload: UserSubscription): void {
  localStorage.setItem(SUB_KEY, JSON.stringify(payload));
}

export function recordInterviewStart(): void {
  const usage = getTodayUsage();
  usage.interviews += 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

const USAGE_KEY = 'chaminext_usage_day';

function getTodayUsage(): { date: string; interviews: number } {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : { date: today, interviews: 0 };
    if (parsed.date !== today) return { date: today, interviews: 0 };
    return parsed;
  } catch {
    return { date: today, interviews: 0 };
  }
}
