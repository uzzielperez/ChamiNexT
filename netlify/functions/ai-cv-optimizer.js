const { Groq } = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();

// Rate limiting function
const checkRateLimit = (userId, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const userRequests = rateLimitStore.get(userId) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitStore.set(userId, validRequests);
  return true;
};

// Generate optimization suggestions using Groq
const generateOptimizationSuggestions = async (cvContent, jobDescription, options = {}) => {
  const {
    optimizationLevel = 'moderate',
    preservePersonality = true,
    focusAreas = ['general']
  } = options;

  const systemPrompt = `You are an expert CV optimization assistant. Your task is to analyze a CV against a specific job description and provide actionable improvement suggestions.

IMPORTANT: Respond ONLY with valid JSON in the exact format specified below. Do not include any other text, explanations, or markdown formatting.

Response format:
{
  "suggestions": [
    {
      "id": "unique_id",
      "type": "keyword|content|structure|formatting",
      "section": "summary|experience|skills|education|general",
      "originalText": "text to replace (empty if adding new content)",
      "suggestedText": "suggested improvement",
      "reasoning": "why this change is recommended",
      "priority": "high|medium|low",
      "confidence": 0.8
    }
  ],
  "analysis": {
    "overallScore": 75,
    "keywordMatch": 60,
    "contentRelevance": 80,
    "structureScore": 70,
    "improvementAreas": ["keyword optimization", "content relevance"],
    "strengths": ["professional formatting", "clear structure"],
    "missingKeywords": ["react", "typescript", "agile"],
    "recommendedChanges": 5
  }
}

Optimization levels:
- conservative: Minimal changes, preserve original style
- moderate: Balanced improvements, some restructuring
- aggressive: Significant changes for maximum optimization

Focus areas: ${focusAreas.join(', ')}
Preserve personality: ${preservePersonality}
Optimization level: ${optimizationLevel}`;

  const userPrompt = `JOB DESCRIPTION:
${jobDescription.description}

KEY REQUIREMENTS:
${jobDescription.requirements.join('\n')}

KEY KEYWORDS:
${jobDescription.keywords.join(', ')}

CURRENT CV:
${cvContent}

Please analyze this CV against the job description and provide optimization suggestions in the specified JSON format.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI service');
    }

    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse AI response:', response);
      throw new Error('Invalid JSON response from AI service');
    }

    // Validate response structure
    if (!parsedResponse.suggestions || !parsedResponse.analysis) {
      throw new Error('Invalid response structure from AI service');
    }

    // Add unique IDs if missing
    parsedResponse.suggestions = parsedResponse.suggestions.map((suggestion, index) => ({
      ...suggestion,
      id: suggestion.id || `suggestion_${Date.now()}_${index}`
    }));

    return parsedResponse;

  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
};

// Generate fallback suggestions when AI is unavailable
const generateFallbackSuggestions = (cvContent, jobDescription) => {
  const suggestions = [];
  const missingKeywords = [];

  // Check for missing keywords
  jobDescription.keywords.forEach((keyword, index) => {
    if (!cvContent.toLowerCase().includes(keyword.toLowerCase())) {
      missingKeywords.push(keyword);
      suggestions.push({
        id: `fallback_keyword_${index}`,
        type: 'keyword',
        section: 'skills',
        originalText: '',
        suggestedText: `Consider adding "${keyword}" to your skills or experience section`,
        reasoning: `This keyword appears in the job description but not in your CV`,
        priority: index < 3 ? 'high' : 'medium',
        confidence: 0.7
      });
    }
  });

  // Basic structure check
  if (!cvContent.toLowerCase().includes('summary') && !cvContent.toLowerCase().includes('objective')) {
    suggestions.push({
      id: 'fallback_summary',
      type: 'structure',
      section: 'summary',
      originalText: '',
      suggestedText: 'Add a professional summary section at the top of your CV',
      reasoning: 'A summary helps recruiters quickly understand your value proposition',
      priority: 'high',
      confidence: 0.8
    });
  }

  // Calculate basic scores
  const keywordMatchCount = jobDescription.keywords.filter(keyword =>
    cvContent.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  const keywordMatch = jobDescription.keywords.length > 0 
    ? Math.round((keywordMatchCount / jobDescription.keywords.length) * 100)
    : 100;

  const overallScore = Math.min(100, 50 + (keywordMatch * 0.4) + (cvContent.length > 500 ? 10 : 0));

  return {
    suggestions: suggestions.slice(0, 8), // Limit suggestions
    analysis: {
      overallScore: Math.round(overallScore),
      keywordMatch,
      contentRelevance: 70,
      structureScore: 75,
      improvementAreas: ['Keyword optimization', 'Content relevance'],
      strengths: ['Professional formatting'],
      missingKeywords,
      recommendedChanges: suggestions.length
    }
  };
};

// Main handler function
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { 
      cvContent, 
      jobDescription, 
      optimizationLevel = 'moderate',
      preservePersonality = true,
      focusAreas = ['general'],
      userId = 'anonymous'
    } = body;

    // Validate required fields
    if (!cvContent || !jobDescription) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: cvContent and jobDescription' 
        }),
      };
    }

    // Validate CV content length
    if (cvContent.length < 50) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'CV content is too short (minimum 50 characters)' 
        }),
      };
    }

    if (cvContent.length > 10000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'CV content is too long (maximum 10,000 characters)' 
        }),
      };
    }

    // Check rate limiting
    if (!checkRateLimit(userId)) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.' 
        }),
      };
    }

    let result;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Try to get AI suggestions first
      if (process.env.GROQ_API_KEY) {
        result = await generateOptimizationSuggestions(cvContent, jobDescription, {
          optimizationLevel,
          preservePersonality,
          focusAreas
        });
      } else {
        throw new Error('AI service not configured');
      }
    } catch (aiError) {
      console.error('AI service failed, using fallback:', aiError);
      // Fall back to basic suggestions
      result = generateFallbackSuggestions(cvContent, jobDescription);
    }

    // Add session ID to response
    result.sessionId = sessionId;

    // Log usage for analytics (in production, use proper logging service)
    console.log(`CV optimization request: ${userId}, suggestions: ${result.suggestions.length}, score: ${result.analysis.overallScore}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('CV optimization error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      }),
    };
  }
};

// Health check endpoint
exports.healthCheck = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'ai-cv-optimizer'
    }),
  };
};