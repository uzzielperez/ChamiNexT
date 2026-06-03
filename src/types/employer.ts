export interface EmployerRole {
  id: string;
  title: string;
  level: string;
  shipTestId: string;
  assessmentType: 'ship-test' | 'ai-interview' | 'both';
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
}

export type SubscriptionPlan = 'free' | 'pro' | 'builder' | 'premium';

export interface UserSubscription {
  plan: SubscriptionPlan;
  since: string;
}
