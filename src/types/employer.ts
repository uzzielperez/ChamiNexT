export type SubscriptionPlan =
  | 'free'
  | 'pro'
  | 'builder'
  | 'premium'
  | 'interview-season'
  | 'biz-small'
  | 'biz-growth';

export interface UserSubscription {
  plan: SubscriptionPlan;
  since: string;
  /** Set for time-boxed plans (Interview Season) or 30-day free trial. */
  expiresAt?: string;
  /** Builder trial; one per device until accounts are server-backed. */
  isTrial?: boolean;
  /** Set after Stripe verify-checkout succeeds. */
  verified?: boolean;
  stripeSessionId?: string;
  email?: string;
  /** Company Interview Studio workspace (Blobs-backed). */
  workspaceId?: string;
  companyPlan?: 'biz-small' | 'biz-growth';
  trialEndsAt?: string;
}

export interface EmployerRole {
  id: string;
  title: string;
  level: string;
  shipTestId: string;
  assessmentType: 'ship-test' | 'ai-interview' | 'both';
  /** Soft-skills rubric pack (growth-stage 5-phase). */
  softSkillsPack?: boolean;
  createdAt: string;
}

export interface CandidateApplication {
  id: string;
  roleId: string;
  displayName: string;
  profileSlug: string;
  thinking: number;
  shipping: number;
  shipTestTitle: string;
  deploymentUrl?: string;
  appliedAt: string;
  status: 'new' | 'review' | 'strong' | 'hold';
  /** Studio submission with prompt trail (Interview Studio demo). */
  submissionId?: string;
  /** Company interview loop from landing showcase */
  companyLoopId?: string;
}
