import type { ReferralTrackEvent } from '../types/referral';
import {
  applyReferrerRewardDays,
  getOrCreateReferralProfile,
  hasAlreadyQualifiedReferral,
  markReferralQualifiedLocally,
  mergeServerStats,
} from './referralStorage';

const BASE = '/.netlify/functions/referral-track';

async function postEvent(body: Record<string, unknown>): Promise<Response> {
  return fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Fire-and-forget: referee landed with a referral code. */
export async function trackReferralCapture(referralCode: string): Promise<void> {
  const { userId } = getOrCreateReferralProfile();
  try {
    await postEvent({
      event: 'capture' satisfies ReferralTrackEvent,
      referralCode,
      userId,
    });
  } catch {
    /* offline ok */
  }
}

/** Call after first completed scored interview (referee). */
export async function trackReferralQualified(): Promise<void> {
  if (hasAlreadyQualifiedReferral()) return;
  const profile = getOrCreateReferralProfile();
  if (!profile.referredByCode) return;

  markReferralQualifiedLocally();
  try {
    await postEvent({
      event: 'qualified' satisfies ReferralTrackEvent,
      referralCode: profile.referredByCode,
      userId: profile.userId,
    });
  } catch {
    /* offline ok */
  }
}

/** Fetch referrer stats and claim pending reward days. */
export async function syncReferrerRewards(): Promise<{
  claimedDays: number;
  stats: ReturnType<typeof getOrCreateReferralProfile>['stats'];
}> {
  const profile = getOrCreateReferralProfile();
  let claimedDays = 0;

  try {
    const statsRes = await fetch(
      `${BASE}?code=${encodeURIComponent(profile.referralCode)}&userId=${encodeURIComponent(profile.userId)}`
    );
    if (statsRes.ok) {
      const data = await statsRes.json();
      mergeServerStats(data.stats ?? data);
    }

    const claimRes = await postEvent({
      event: 'claim' satisfies ReferralTrackEvent,
      referralCode: profile.referralCode,
      userId: profile.userId,
    });
    if (claimRes.ok) {
      const data = await claimRes.json();
      if (typeof data.claimedDays === 'number' && data.claimedDays > 0) {
        claimedDays = applyReferrerRewardDays(data.claimedDays);
      }
      if (data.stats) mergeServerStats(data.stats);
    }
  } catch {
    /* show cached local stats */
  }

  const updated = getOrCreateReferralProfile();
  return { claimedDays, stats: updated.stats };
}
