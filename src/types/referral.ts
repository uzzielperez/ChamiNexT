export interface ReferralStats {
  qualified: number;
  pendingRewardDays: number;
  claimedRewardDays: number;
}

export interface ReferralProfile {
  userId: string;
  referralCode: string;
  referredByCode?: string;
  referredByCapturedAt?: string;
  referralQualifiedAt?: string;
  /** Referee welcome bonus */
  bonusInterviewsPerDay: number;
  bonusExpiresAt?: string;
  /** Local cache from last server sync */
  stats: ReferralStats;
  lastSyncedAt?: string;
}

export type ReferralTrackEvent = 'capture' | 'qualified' | 'claim';
