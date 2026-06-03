export type ProblemDomain =
  | 'arrays'
  | 'trees'
  | 'strings'
  | 'system-design'
  | 'debugging';

export type InterviewMessageRole = 'interviewer' | 'candidate' | 'system';

export interface InterviewMessage {
  id: string;
  role: InterviewMessageRole;
  content: string;
  timestamp: string;
}

export interface InterviewScores {
  thinking: number;
  decomposition: number;
  communication: number;
  codeQuality: number;
  overall: number;
}

export interface PracticeProblem {
  id: string;
  title: string;
  domain: ProblemDomain;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  hints: string[];
  starterCode: string;
  runLanguage?: 'javascript' | 'python' | null;
}

export interface InterviewSession {
  id: string;
  problemId: string;
  startedAt: string;
  endedAt?: string;
  messages: InterviewMessage[];
  code: string;
  scores?: InterviewScores;
  scoreNotes?: string;
}

export type ShipTestFormat = '24h' | '72h' | '7d';

export type ShipTestStatus = 'available' | 'active' | 'submitted' | 'evaluated';

export interface ShipTestChallenge {
  id: string;
  title: string;
  format: ShipTestFormat;
  description: string;
  pmBrief: string;
  constraints: string[];
  exampleDeliverables: string[];
}

export interface ShipTestScores {
  shipping: number;
  productThinking: number;
  engineeringQuality: number;
  executionSpeed: number;
  tradeoffAwareness: number;
  overall: number;
}

export interface ShipTestEnrollment {
  challengeId: string;
  enrolledAt: string;
  endsAt: string;
  deploymentUrl?: string;
  status: ShipTestStatus;
  scores?: ShipTestScores;
  feedback?: string;
  events: ShipTestEvent[];
}

export interface ShipTestEvent {
  id: string;
  role: 'pm' | 'tech-lead' | 'reviewer' | 'user-simulator';
  message: string;
  at: string;
}

export interface TalentProfile {
  displayName: string;
  thinkingScoreAvg: number;
  shipTestsCompleted: number;
  interviewsCompleted: number;
  strengthDomains: ProblemDomain[];
  weaknessDomains: ProblemDomain[];
  summary: string;
}
