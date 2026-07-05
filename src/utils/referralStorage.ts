import type { ReferralProfile, ReferralStats } from '../types/referral';
import { extendSubscriptionDays, grantReferralBonusInterviews } from './subscriptionStorage';

const PROFILE_KEY = 'chaminext_referral_profile';
const QUALIFIED_KEY = 'chaminext_referral_qualified';

/** Referee welcome bonus when landing via ?ref= */
export const REFEREE_BONUS = {
  extraInterviewsPerDay: 2,
  days: 14,
} as const;

/** Referrer earns when a friend completes their first scored interview */
export const REFERRER_REWARD_DAYS = 7;
export const REFERRER_MAX_REWARDS_PER_MONTH = 4;

function randomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Stable short code from user id (not reversible, self-referral safe). */
export function referralCodeFromUserId(userId: string): string {
  let h = 0;
  for (let i = 0; i < userId.length; i += 1) {
    h = (Math.imul(31, h) + userId.charCodeAt(i)) | 0;
  }
  const n = Math.abs(h);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  let x = n;
  for (let i = 0; i < 6; i += 1) {
    code += chars[x % chars.length];
    x = Math.floor(x / chars.length) + i * 7;
  }
  return code;
}

function defaultStats(): ReferralStats {
  return { qualified: 0, pendingRewardDays: 0, claimedRewardDays: 0 };
}

export function getOrCreateReferralProfile(): ReferralProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ReferralProfile;
      if (parsed.userId && parsed.referralCode) return parsed;
    }
  } catch {
    /* ignore */
  }
  const userId = randomId();
  const profile: ReferralProfile = {
    userId,
    referralCode: referralCodeFromUserId(userId),
    bonusInterviewsPerDay: 0,
    stats: defaultStats(),
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function saveReferralProfile(profile: ReferralProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getReferralLink(origin = window.location.origin): string {
  const { referralCode } = getOrCreateReferralProfile();
  return `${origin}/practice?ref=${referralCode}`;
}

export function isSelfReferral(code: string): boolean {
  const profile = getOrCreateReferralProfile();
  return referralCodeFromUserId(profile.userId) === code.toUpperCase();
}

/** Persist ?ref= from URL (call once on app load). */
export function captureReferralCode(code: string | null | undefined): boolean {
  if (!code) return false;
  const normalized = code.trim().toUpperCase();
  if (normalized.length < 4 || normalized.length > 12) return false;
  if (isSelfReferral(normalized)) return false;

  const profile = getOrCreateReferralProfile();
  if (profile.referredByCode) return false;

  profile.referredByCode = normalized;
  profile.referredByCapturedAt = new Date().toISOString();
  profile.bonusInterviewsPerDay = REFEREE_BONUS.extraInterviewsPerDay;
  const expires = new Date();
  expires.setDate(expires.getDate() + REFEREE_BONUS.days);
  profile.bonusExpiresAt = expires.toISOString();
  saveReferralProfile(profile);
  grantReferralBonusInterviews(REFEREE_BONUS.extraInterviewsPerDay, REFEREE_BONUS.days);
  return true;
}

export function hasReferralBonus(): boolean {
  const profile = getOrCreateReferralProfile();
  if (!profile.bonusExpiresAt) return false;
  return new Date(profile.bonusExpiresAt) >= new Date() && profile.bonusInterviewsPerDay > 0;
}

export function getReferralBonusInterviewsPerDay(): number {
  if (!hasReferralBonus()) return 0;
  return getOrCreateReferralProfile().bonusInterviewsPerDay;
}

export function hasAlreadyQualifiedReferral(): boolean {
  return localStorage.getItem(QUALIFIED_KEY) === '1';
}

export function markReferralQualifiedLocally(): void {
  localStorage.setItem(QUALIFIED_KEY, '1');
  const profile = getOrCreateReferralProfile();
  profile.referralQualifiedAt = new Date().toISOString();
  saveReferralProfile(profile);
}

/** Apply server-reported pending reward days to subscription. */
export function applyReferrerRewardDays(days: number): number {
  if (days <= 0) return 0;
  const profile = getOrCreateReferralProfile();
  const applied = extendSubscriptionDays(days);
  profile.stats.claimedRewardDays += days;
  profile.stats.pendingRewardDays = Math.max(0, profile.stats.pendingRewardDays - days);
  saveReferralProfile(profile);
  return applied;
}

export function mergeServerStats(server: Partial<ReferralStats>): ReferralProfile {
  const profile = getOrCreateReferralProfile();
  profile.stats = {
    qualified: server.qualified ?? profile.stats.qualified,
    pendingRewardDays: server.pendingRewardDays ?? profile.stats.pendingRewardDays,
    claimedRewardDays: server.claimedRewardDays ?? profile.stats.claimedRewardDays,
  };
  profile.lastSyncedAt = new Date().toISOString();
  saveReferralProfile(profile);
  return profile;
}
