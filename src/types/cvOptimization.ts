export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
  createdAt: Date;
}

export interface CVOptimizationSuggestion {
  id: string;
  type: 'keyword' | 'content' | 'structure' | 'formatting';
  section: 'summary' | 'experience' | 'skills' | 'education' | 'general';
  originalText: string;
  suggestedText: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number; // 0-1 scale
}

export interface CVVersion {
  id: string;
  version: number;
  content: string;
  createdAt: Date;
  jobDescriptionId?: string;
  optimizationScore: number; // 0-100 scale
  appliedSuggestions: string[]; // Array of suggestion IDs
}

export interface CVOptimizationSession {
  id: string;
  userId: string;
  jobDescription: JobDescription;
  originalCV: CVVersion;
  currentCV: CVVersion;
  versions: CVVersion[];
  suggestions: CVOptimizationSuggestion[];
  chatHistory: ChatMessage[];
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: CVOptimizationSuggestion[];
  appliedSuggestion?: string; // Suggestion ID if this message applied a suggestion
}

export interface OptimizationAnalysis {
  overallScore: number; // 0-100
  keywordMatch: number; // 0-100
  contentRelevance: number; // 0-100
  structureScore: number; // 0-100
  improvementAreas: string[];
  strengths: string[];
  missingKeywords: string[];
  recommendedChanges: number;
}

export interface CVComparisonResult {
  beforeVersion: CVVersion;
  afterVersion: CVVersion;
  improvements: {
    scoreIncrease: number;
    keywordsAdded: string[];
    sectionsImproved: string[];
    suggestionsApplied: number;
  };
  visualDiff: {
    additions: string[];
    deletions: string[];
    modifications: Array<{
      original: string;
      modified: string;
      section: string;
    }>;
  };
}

export interface AIOptimizationRequest {
  cvContent: string;
  jobDescription: JobDescription;
  focusAreas?: string[];
  optimizationLevel: 'conservative' | 'moderate' | 'aggressive';
  preservePersonality: boolean;
}

export interface AIOptimizationResponse {
  suggestions: CVOptimizationSuggestion[];
  analysis: OptimizationAnalysis;
  optimizedContent?: string;
  sessionId: string;
}

// Utility types
export type OptimizationType = CVOptimizationSuggestion['type'];
export type CVSection = CVOptimizationSuggestion['section'];
export type SuggestionPriority = CVOptimizationSuggestion['priority'];
export type SessionStatus = CVOptimizationSession['status'];
export type MessageType = ChatMessage['type'];
export type OptimizationLevel = AIOptimizationRequest['optimizationLevel'];