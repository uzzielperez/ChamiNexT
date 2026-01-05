import {
  JobDescription,
  CVOptimizationSuggestion,
  CVVersion,
  CVOptimizationSession,
  ChatMessage,
  OptimizationAnalysis,
  CVComparisonResult,
  AIOptimizationRequest,
  AIOptimizationResponse,
  OptimizationType,
  SuggestionPriority
} from '../types/cvOptimization';

// API endpoint for AI optimization
const AI_ENDPOINT = '/.netlify/functions/ai-cv-optimizer';

/**
 * Analyzes a job description and extracts key requirements and keywords
 */
export const analyzeJobDescription = (description: string): JobDescription => {
  const lines = description.split('\n').filter(line => line.trim());
  const keywords = extractKeywords(description);
  const requirements = extractRequirements(description);
  
  return {
    id: generateId(),
    title: extractJobTitle(description),
    company: extractCompany(description),
    description: description.trim(),
    requirements,
    keywords,
    createdAt: new Date()
  };
};

/**
 * Extracts keywords from job description using basic NLP techniques
 */
export const extractKeywords = (text: string): string[] => {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));

  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);
};

/**
 * Extracts requirements from job description
 */
export const extractRequirements = (description: string): string[] => {
  const requirementPatterns = [
    /(?:requirements?|qualifications?|must have|required|essential)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
    /(?:experience with|proficient in|knowledge of)[\s\S]*?(?=\n|\.|,)/gi,
    /(?:\d+\+?\s*years?)[\s\S]*?(?=\n|\.|,)/gi
  ];

  const requirements: string[] = [];
  
  requirementPatterns.forEach(pattern => {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const cleaned = match.trim().replace(/^[^\w]*/, '').replace(/[^\w]*$/, '');
        if (cleaned.length > 10) {
          requirements.push(cleaned);
        }
      });
    }
  });

  return requirements.slice(0, 10); // Limit to top 10 requirements
};

/**
 * Attempts to extract job title from description
 */
export const extractJobTitle = (description: string): string => {
  const lines = description.split('\n').filter(line => line.trim());
  const firstLine = lines[0]?.trim() || '';
  
  // Look for common job title patterns
  const titlePatterns = [
    /(?:job title|position|role):\s*(.+)/i,
    /^(.+?)\s*(?:-|–|—|\|)/,
    /^(.+?)(?:\s+at\s+|\s+@\s+)/i
  ];

  for (const pattern of titlePatterns) {
    const match = firstLine.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return firstLine.length > 0 && firstLine.length < 100 ? firstLine : 'Job Position';
};

/**
 * Attempts to extract company name from description
 */
export const extractCompany = (description: string): string => {
  const companyPatterns = [
    /(?:company|organization):\s*(.+)/i,
    /(?:at|@)\s+([A-Z][a-zA-Z\s&]+?)(?:\s|,|\n|$)/,
    /([A-Z][a-zA-Z\s&]+?)\s+is\s+(?:looking|seeking|hiring)/i
  ];

  for (const pattern of companyPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return 'Company';
};

/**
 * Sends CV and job description to AI for optimization suggestions
 */
export const getAIOptimizationSuggestions = async (
  request: AIOptimizationRequest
): Promise<AIOptimizationResponse> => {
  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`AI optimization failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI optimization error:', error);
    // Fallback to basic suggestions if AI fails
    return generateFallbackSuggestions(request);
  }
};

/**
 * Generates basic suggestions when AI service is unavailable
 */
export const generateFallbackSuggestions = (
  request: AIOptimizationRequest
): AIOptimizationResponse => {
  const suggestions: CVOptimizationSuggestion[] = [];
  const { cvContent, jobDescription } = request;

  // Check for missing keywords
  jobDescription.keywords.forEach((keyword, index) => {
    if (!cvContent.toLowerCase().includes(keyword.toLowerCase())) {
      suggestions.push({
        id: generateId(),
        type: 'keyword',
        section: 'skills',
        originalText: '',
        suggestedText: `Consider adding "${keyword}" to your skills or experience section`,
        reasoning: `This keyword appears in the job description but not in your CV`,
        priority: index < 5 ? 'high' : 'medium',
        confidence: 0.7
      });
    }
  });

  // Basic structure suggestions
  if (!cvContent.toLowerCase().includes('summary') && !cvContent.toLowerCase().includes('objective')) {
    suggestions.push({
      id: generateId(),
      type: 'structure',
      section: 'summary',
      originalText: '',
      suggestedText: 'Add a professional summary section at the top of your CV',
      reasoning: 'A summary helps recruiters quickly understand your value proposition',
      priority: 'high',
      confidence: 0.8
    });
  }

  const analysis: OptimizationAnalysis = {
    overallScore: calculateBasicScore(cvContent, jobDescription),
    keywordMatch: calculateKeywordMatch(cvContent, jobDescription.keywords),
    contentRelevance: 70, // Default moderate score
    structureScore: 75,
    improvementAreas: ['Keyword optimization', 'Content relevance'],
    strengths: ['Professional formatting'],
    missingKeywords: jobDescription.keywords.filter(k => 
      !cvContent.toLowerCase().includes(k.toLowerCase())
    ),
    recommendedChanges: suggestions.length
  };

  return {
    suggestions,
    analysis,
    sessionId: generateId()
  };
};

/**
 * Calculates keyword match percentage
 */
export const calculateKeywordMatch = (cvContent: string, keywords: string[]): number => {
  if (keywords.length === 0) return 100;
  
  const matchedKeywords = keywords.filter(keyword =>
    cvContent.toLowerCase().includes(keyword.toLowerCase())
  );
  
  return Math.round((matchedKeywords.length / keywords.length) * 100);
};

/**
 * Calculates basic optimization score
 */
export const calculateBasicScore = (cvContent: string, jobDescription: JobDescription): number => {
  let score = 50; // Base score
  
  // Keyword matching (40% of score)
  const keywordScore = calculateKeywordMatch(cvContent, jobDescription.keywords);
  score += (keywordScore * 0.4);
  
  // Length appropriateness (10% of score)
  const wordCount = cvContent.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 800) {
    score += 10;
  } else if (wordCount >= 200 && wordCount <= 1000) {
    score += 5;
  }
  
  return Math.min(100, Math.round(score));
};

/**
 * Applies a suggestion to CV content
 */
export const applySuggestionToCV = (
  cvContent: string,
  suggestion: CVOptimizationSuggestion
): string => {
  if (suggestion.originalText && suggestion.originalText.trim()) {
    // Replace existing text
    return cvContent.replace(suggestion.originalText, suggestion.suggestedText);
  } else {
    // Add new content based on section
    return addContentToSection(cvContent, suggestion.section, suggestion.suggestedText);
  }
};

/**
 * Adds content to specific CV section
 */
export const addContentToSection = (
  cvContent: string,
  section: string,
  content: string
): string => {
  const sectionHeaders = {
    summary: ['summary', 'profile', 'objective'],
    experience: ['experience', 'work history', 'employment'],
    skills: ['skills', 'technical skills', 'competencies'],
    education: ['education', 'qualifications', 'academic'],
    general: []
  };

  const headers = sectionHeaders[section as keyof typeof sectionHeaders] || [];
  
  for (const header of headers) {
    const regex = new RegExp(`(${header}[^\\n]*\\n)`, 'i');
    const match = cvContent.match(regex);
    if (match) {
      return cvContent.replace(regex, `$1${content}\n`);
    }
  }
  
  // If no section found, append at the end
  return `${cvContent}\n\n${content}`;
};

/**
 * Compares two CV versions and generates comparison result
 */
export const compareCVVersions = (
  beforeVersion: CVVersion,
  afterVersion: CVVersion
): CVComparisonResult => {
  const scoreIncrease = afterVersion.optimizationScore - beforeVersion.optimizationScore;
  
  // Simple diff calculation (in a real implementation, you'd use a proper diff library)
  const beforeWords = new Set(beforeVersion.content.toLowerCase().split(/\s+/));
  const afterWords = new Set(afterVersion.content.toLowerCase().split(/\s+/));
  
  const additions = Array.from(afterWords).filter(word => !beforeWords.has(word));
  const deletions = Array.from(beforeWords).filter(word => !afterWords.has(word));
  
  return {
    beforeVersion,
    afterVersion,
    improvements: {
      scoreIncrease,
      keywordsAdded: additions.slice(0, 10), // Limit for display
      sectionsImproved: ['skills', 'experience'], // Simplified
      suggestionsApplied: afterVersion.appliedSuggestions.length
    },
    visualDiff: {
      additions,
      deletions,
      modifications: [] // Simplified for now
    }
  };
};

/**
 * Creates a new CV optimization session
 */
export const createOptimizationSession = (
  userId: string,
  jobDescription: JobDescription,
  originalCV: string
): CVOptimizationSession => {
  const originalVersion: CVVersion = {
    id: generateId(),
    version: 1,
    content: originalCV,
    createdAt: new Date(),
    jobDescriptionId: jobDescription.id,
    optimizationScore: calculateBasicScore(originalCV, jobDescription),
    appliedSuggestions: []
  };

  return {
    id: generateId(),
    userId,
    jobDescription,
    originalCV: originalVersion,
    currentCV: originalVersion,
    versions: [originalVersion],
    suggestions: [],
    chatHistory: [],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Adds a chat message to the session
 */
export const addChatMessage = (
  session: CVOptimizationSession,
  type: 'user' | 'ai' | 'system',
  content: string,
  suggestions?: CVOptimizationSuggestion[]
): CVOptimizationSession => {
  const message: ChatMessage = {
    id: generateId(),
    type,
    content,
    timestamp: new Date(),
    suggestions
  };

  return {
    ...session,
    chatHistory: [...session.chatHistory, message],
    updatedAt: new Date()
  };
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * Validates CV content
 */
export const validateCVContent = (content: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!content || content.trim().length < 50) {
    errors.push('CV content is too short (minimum 50 characters)');
  }
  
  if (content.length > 10000) {
    errors.push('CV content is too long (maximum 10,000 characters)');
  }
  
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 20) {
    errors.push('CV should contain at least 20 words');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formats suggestions for display
 */
export const formatSuggestionForDisplay = (suggestion: CVOptimizationSuggestion): string => {
  const priorityEmoji = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  
  const typeEmoji = {
    keyword: '🔑',
    content: '📝',
    structure: '🏗️',
    formatting: '✨'
  };
  
  return `${priorityEmoji[suggestion.priority]} ${typeEmoji[suggestion.type]} ${suggestion.suggestedText}`;
};