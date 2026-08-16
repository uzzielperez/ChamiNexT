export type PromptSource = 'panel' | 'terminal' | 'quick';

export type PromptRecord = {
  id: string;
  at: string;
  source: PromptSource;
  text: string;
  activeFile: string;
};

export type GradedPrompt = {
  promptId: string;
  text: string;
  at: string;
  source: PromptSource;
  scores: {
    decomposition: number;
    verification: number;
    iteration: number;
    aiDisclosure: number;
  };
  overall: number;
  verdict: string;
  flags: string[];
};

export type EmployerRecommendation =
  | 'strong_yes'
  | 'proceed'
  | 'mixed'
  | 'no'
  | 'insufficient';

export type EmployerAssessment = {
  recommendation: EmployerRecommendation;
  headline: string;
  summaryParagraph: string;
  strengths: string[];
  weaknesses: string[];
  probeInInterview: string[];
  confidence: 'high' | 'medium' | 'low';
};

export type StudioSubmission = {
  id: string;
  roleId: string;
  /** Landing showcase loop id (e.g. loop-pulse) when submitted via /challenge/:loopId */
  companyLoopId?: string;
  companyName: string;
  taskTitle: string;
  taskBrief: string;
  candidateName: string;
  submittedAt: string;
  files: Record<string, string>;
  starterFiles: Record<string, string>;
  promptTrail: PromptRecord[];
  terminalLog: string;
  testOutput?: string;
  testPassed?: boolean;
  overallScores: {
    thinking: number;
    promptTrail: number;
    shipping: number;
    overall: number;
  };
  gradedPrompts: GradedPrompt[];
  summary: string;
  /** Narrative hire recommendation — computed at grade time or on read */
  employerAssessment?: EmployerAssessment;
  /** Loop-only metadata for employer loop dashboard */
  loopQuizScore?: number;
  cvSummary?: string;
  loopStagesCompleted?: number;
};
