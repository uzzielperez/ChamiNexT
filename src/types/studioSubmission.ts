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

export type StudioSubmission = {
  id: string;
  roleId: string;
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
};
