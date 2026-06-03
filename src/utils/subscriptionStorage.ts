import type { SubscriptionPlan, UserSubscription } from '../types/employer';

const SUB_KEY = 'chaminext_subscription';

export const PLAN_LIMITS: Record<
  SubscriptionPlan,
  { interviewsPerDay: number; shipTestsPerMonth: number; label: string }
> = {
  free: { interviewsPerDay: 2, shipTestsPerMonth: 1, label: 'Free' },
  pro: { interviewsPerDay: 999, shipTestsPerMonth: 0, label: 'Pro' },
  builder: { interviewsPerDay: 999, shipTestsPerMonth: 999, label: 'Builder' },
  premium: { interviewsPerDay: 999, shipTestsPerMonth: 999, label: 'Premium' },
};

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
  localStorage.setItem(
    SUB_KEY,
    JSON.stringify({ plan, since: new Date().toISOString() } satisfies UserSubscription)
  );
}

const USAGE_KEY = 'chaminext_usage_day';

export function canStartInterview(): boolean {
  if (loadSubscription().plan !== 'free') return true;
  const usage = getTodayUsage();
  return usage.interviews < PLAN_LIMITS.free.interviewsPerDay;
}

export function recordInterviewStart(): void {
  const usage = getTodayUsage();
  usage.interviews += 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

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
