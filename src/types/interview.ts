export type ProblemDomain =
  | 'arrays'
  | 'trees'
  | 'strings'
  | 'system-design'
  | 'debugging'
  | 'rag'
  | 'agents'
  | 'prompting'
  | 'evals'
  | 'ai-system-design'
  | 'safety'
  | 'experimentation'
  | 'funnel-analytics'
  | 'growth-systems'
  | 'attribution'
  | 'martech-integrations'
  | 'gtm-strategy'
  | 'behavioral'
  | 'recruiter'
  | 'research-ethics'
  | 'scientific-methods'
  | 'mission-problems';

export type PracticeTrack =
  | 'software'
  | 'ai-engineer'
  | 'quant'
  | 'cybersecurity'
  | 'market-engineering'
  | 'ai-for-science';

export type MissionArea = 'climate' | 'health' | 'poverty' | 'science' | 'ethics';

export interface FrontierProblemTest {
  id: string;
  mission: MissionArea;
  title: string;
  /** Who asks this kind of question (from field intel). */
  orgExamples: string[];
  prompt: string;
  ethicsPrompts: string[];
  whatGoodLooksLike: string;
  practiceProblemId?: string;
  estimatedMinutes: 20 | 30 | 45;
}

export type EstimatedMinutes = 10 | 15 | 20 | 30 | 45;

export interface ProblemTestCase {
  stdin?: string;
  expectedStdout?: string;
}

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
  track: PracticeTrack;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: EstimatedMinutes;
  prompt: string;
  hints: string[];
  starterCode: string;
  runLanguage?: 'javascript' | 'python' | null;
  tests?: ProblemTestCase[];
  source?: string;
  license?: string;
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

export type ShipTestFormat = '24h' | '72h' | '7d' | 'ticket';

export type ShipTestSubmitMode = 'url' | 'pr';

export type ShipTestStatus = 'available' | 'active' | 'submitted' | 'evaluated';

export interface ShipTestChallenge {
  id: string;
  title: string;
  format: ShipTestFormat;
  description: string;
  pmBrief: string;
  constraints: string[];
  exampleDeliverables: string[];
  submitMode?: ShipTestSubmitMode;
  starterRepoUrl?: string;
  ticketBrief?: string;
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
  prUrl?: string;
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

export type InterviewStage =
  | 'recruiter-screen'
  | 'technical-screen'
  | 'take-home'
  | 'onsite'
  | 'system-design'
  | 'other';

export type InterviewOutcome =
  | 'pending'
  | 'passed-round'
  | 'rejected'
  | 'offer'
  | 'unknown';

// A real interview a candidate actually went through. This is the signal that
// makes the platform self-improving: real questions in, sharper practice out.
export interface InterviewReport {
  id: string;
  company: string;
  role: string;
  track: PracticeTrack;
  stage: InterviewStage;
  difficulty: 'easy' | 'medium' | 'hard';
  questionsAsked: string[];
  whatWentWell?: string;
  whatStruggled?: string;
  outcome: InterviewOutcome;
  usedAI?: boolean;
  reportedAt: string;
}

// A practice problem generated from a real interview report.
export interface FieldSourcedProblem extends PracticeProblem {
  originReportId: string;
  originCompany: string;
  createdAt: string;
}

// ── Interview intel (scraped from public sources) ──────────────────
// Built offline by scripts/interview-intel/; bundled as static content.

export type IntelQuestionKind =
  | 'coding'
  | 'system-design'
  | 'behavioral'
  | 'recruiter'
  | 'take-home'
  | 'domain-knowledge';

export type IntelSourceType = 'reddit' | 'hn' | 'blog' | 'youtube';

export interface IntelQuestion {
  id: string;
  text: string;
  kind: IntelQuestionKind;
  stage: InterviewStage;
  track: PracticeTrack;
  sourceUrl: string;
  sourceType: IntelSourceType;
}

export interface IntelStage {
  stage: InterviewStage;
  notes: string;
}

export interface IntelSourceRef {
  type: IntelSourceType;
  title: string;
  url: string;
}

export interface CompanyIntel {
  id: string;
  company: string;
  tracks: PracticeTrack[];
  roles: string[];
  stages: IntelStage[];
  processNotes: string[];
  questions: IntelQuestion[];
  sources: IntelSourceRef[];
}

export interface InterviewIntelData {
  version: number;
  generatedAt: string;
  extraction: 'llm' | 'heuristic';
  totalSourceDocs: number;
  companies: CompanyIntel[];
  generalQuestions: IntelQuestion[];
}

export interface FieldReportInsights {
  totalReports: number;
  totalQuestions: number;
  problemsGenerated: number;
  companies: string[];
  domainFrequency: { domain: ProblemDomain; count: number }[];
  weakAreas: string[];
  outcomes: Record<InterviewOutcome, number>;
}
