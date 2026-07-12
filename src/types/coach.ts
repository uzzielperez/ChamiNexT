import type { PracticeTrack } from './interview';

export type VoicePreference = 'male' | 'female';

export type CoachTimeline = 'exploring' | 'active-search' | 'offer-stage';

export type RemotePreference = 'remote-only' | 'hybrid' | 'onsite' | 'any';

export interface CoachCompRange {
  min?: number;
  max?: number;
  currency: string;
}

export interface CoachProfile {
  onboardingComplete: boolean;
  voicePreference: VoicePreference;
  targetTrack: PracticeTrack;
  targetRoles: string[];
  experienceYears?: number;
  currentRole?: string;
  remotePreference: RemotePreference;
  timeline: CoachTimeline;
  compRange?: CoachCompRange;
  stack: string[];
  weakAreas: string[];
  missionPreferred: boolean;
  recommendedLeafIds: string[];
  summaryForMatching: string;
  updatedAt?: string;
}

export interface CoachMessage {
  id: string;
  role: 'coach' | 'user' | 'system';
  content: string;
  at: string;
}

export interface CoachSession {
  messages: CoachMessage[];
  voicePreference?: VoicePreference;
  startedAt: string;
}

export interface OnboardingAgentResponse {
  reply: string;
  topicsComplete?: number;
  topicsTotal?: number;
  profilePatch?: Partial<CoachProfile>;
  onboardingComplete?: boolean;
  profile?: CoachProfile;
  demoMode?: boolean;
}

export interface JobMatchResult {
  jobId: string;
  score: number;
  fitLabel: 'Strong fit' | 'Good fit' | 'Possible fit';
  whyOneLine: string;
  prepTrack: PracticeTrack;
}

export interface IntroDraft {
  id: string;
  jobId: string;
  channel: 'email' | 'linkedin';
  subject?: string;
  body: string;
  createdAt: string;
}

export interface IntroAgentResponse {
  email: { subject: string; body: string };
  linkedin: { connectionNote: string; followUp: string };
  demoMode?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
}
