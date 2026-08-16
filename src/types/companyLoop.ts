export type CompanyLoopStageId = 'cv' | 'quiz' | 'work-ticket' | 'ethics';

export type CompanyLoopStage = {
  id: CompanyLoopStageId;
  title: string;
  summary: string;
  shipTestId?: string;
  behavioralKind?: string;
};

export type CompanyLoopQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explain: string;
};

export type CompanyInterviewLoop = {
  id: string;
  placeholderName: string;
  logoAbbr: string;
  logoGradient: string;
  roleTitle: string;
  track: string;
  salaryMin: number;
  salaryMax: number;
  salaryLabel: string;
  region: string;
  internalRef: string;
  tagline: string;
  stages: CompanyLoopStage[];
  quizQuestions: CompanyLoopQuizQuestion[];
};

export type CompanyLoopProgress = {
  loopId: string;
  completedStages: CompanyLoopStageId[];
  cvSummary?: string;
  quizScore?: number;
  updatedAt: string;
};
