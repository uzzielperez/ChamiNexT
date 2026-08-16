export type WorkspaceFile = {
  path: string;
  language: string;
  content: string;
};

export type WorkspaceAgentMessage = {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  at: string;
};

export type WorkspaceTemplate = {
  id: string;
  title: string;
  subtitle?: string;
  ticketBrief?: string;
  pmBrief?: string;
  files: WorkspaceFile[];
  entryPath: string;
  runLanguage?: 'javascript' | 'typescript' | 'python';
  /** Concatenate files into a single runnable script for the sandbox terminal. */
  bundleForRun: (files: Record<string, string>) => string;
};
