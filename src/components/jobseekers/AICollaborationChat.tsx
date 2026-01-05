import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle, X, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import Button from '../common/Button';
import { 
  ChatMessage, 
  CVOptimizationSuggestion, 
  CVOptimizationSession,
  MessageType 
} from '../../types/cvOptimization';
import { 
  getAIOptimizationSuggestions, 
  addChatMessage, 
  formatSuggestionForDisplay,
  applySuggestionToCV
} from '../../utils/aiCVOptimizer';

interface AICollaborationChatProps {
  session: CVOptimizationSession;
  onSessionUpdate: (session: CVOptimizationSession) => void;
  onCVUpdate: (newContent: string) => void;
  className?: string;
}

const AICollaborationChat: React.FC<AICollaborationChatProps> = ({
  session,
  onSessionUpdate,
  onCVUpdate,
  className = ''
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [session.chatHistory, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // Add user message to chat
      let updatedSession = addChatMessage(session, 'user', userMessage);
      onSessionUpdate(updatedSession);

      // Get AI response
      const aiResponse = await getAIOptimizationSuggestions({
        cvContent: session.currentCV.content,
        jobDescription: session.jobDescription,
        optimizationLevel: 'moderate',
        preservePersonality: true,
        focusAreas: extractFocusAreasFromMessage(userMessage)
      });

      // Create AI response message
      const aiMessageContent = generateAIResponseMessage(aiResponse.suggestions, userMessage);
      updatedSession = addChatMessage(
        updatedSession, 
        'ai', 
        aiMessageContent, 
        aiResponse.suggestions
      );

      // Update suggestions in session
      updatedSession.suggestions = [...updatedSession.suggestions, ...aiResponse.suggestions];
      
      onSessionUpdate(updatedSession);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorSession = addChatMessage(
        session, 
        'system', 
        'Sorry, I encountered an error processing your request. Please try again.'
      );
      onSessionUpdate(errorSession);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, session, onSessionUpdate]);

  const handleApplySuggestion = useCallback((suggestion: CVOptimizationSuggestion) => {
    try {
      const newCVContent = applySuggestionToCV(session.currentCV.content, suggestion);
      
      // Update CV content
      onCVUpdate(newCVContent);
      
      // Add system message about applied suggestion
      const systemMessage = `Applied suggestion: ${suggestion.suggestedText}`;
      const updatedSession = addChatMessage(session, 'system', systemMessage);
      
      // Mark suggestion as applied
      updatedSession.currentCV.appliedSuggestions.push(suggestion.id);
      
      onSessionUpdate(updatedSession);
    } catch (error) {
      console.error('Error applying suggestion:', error);
    }
  }, [session, onCVUpdate, onSessionUpdate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleSuggestionExpansion = useCallback((suggestionId: string) => {
    setExpandedSuggestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(suggestionId)) {
        newSet.delete(suggestionId);
      } else {
        newSet.add(suggestionId);
      }
      return newSet;
    });
  }, []);

  const copyMessageToClipboard = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const renderMessage = useCallback((message: ChatMessage) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-gold-500' : isSystem ? 'bg-gray-600' : 'bg-blue-500'
            }`}>
              {isUser ? (
                <User className="w-4 h-4 text-white" />
              ) : isSystem ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className={`rounded-lg px-4 py-3 ${
            isUser 
              ? 'bg-gold-500 text-white' 
              : isSystem 
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-800 text-white'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            
            {/* Message Actions */}
            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
              <span>{message.timestamp.toLocaleTimeString()}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyMessageToClipboard(message.content)}
                  className="hover:opacity-100 transition-opacity"
                  title="Copy message"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {!isUser && !isSystem && (
                  <>
                    <button className="hover:opacity-100 transition-opacity" title="Helpful">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="hover:opacity-100 transition-opacity" title="Not helpful">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Suggestions */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Suggestions:</h4>
                {message.suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    isExpanded={expandedSuggestions.has(suggestion.id)}
                    isApplied={session.currentCV.appliedSuggestions.includes(suggestion.id)}
                    onToggleExpansion={() => toggleSuggestionExpansion(suggestion.id)}
                    onApply={() => handleApplySuggestion(suggestion)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [expandedSuggestions, session.currentCV.appliedSuggestions, toggleSuggestionExpansion, handleApplySuggestion, copyMessageToClipboard]);

  return (
    <div className={`flex flex-col h-full bg-gray-900 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI CV Optimizer</h3>
            <p className="text-sm text-gray-400">
              {session.chatHistory.length} messages • {session.suggestions.length} suggestions
            </p>
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          Session: {session.status}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.chatHistory.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-400 mb-2">Start Your CV Optimization</h4>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Ask me anything about optimizing your CV for this job. I can help with keywords, 
              content improvements, structure, and more!
            </p>
            
            {/* Quick Start Suggestions */}
            <div className="mt-6 space-y-2">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Quick Start:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Analyze my CV for missing keywords",
                  "Suggest improvements for my experience section",
                  "Help me write a better summary",
                  "What skills should I highlight?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          session.chatHistory.map(renderMessage)
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-400">Analyzing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about optimizing your CV..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="px-4 py-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{inputMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
};

// Suggestion Card Component
interface SuggestionCardProps {
  suggestion: CVOptimizationSuggestion;
  isExpanded: boolean;
  isApplied: boolean;
  onToggleExpansion: () => void;
  onApply: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  isExpanded,
  isApplied,
  onToggleExpansion,
  onApply
}) => {
  const priorityColors = {
    high: 'border-red-500 bg-red-500 bg-opacity-10',
    medium: 'border-yellow-500 bg-yellow-500 bg-opacity-10',
    low: 'border-green-500 bg-green-500 bg-opacity-10'
  };

  const typeIcons = {
    keyword: '🔑',
    content: '📝',
    structure: '🏗️',
    formatting: '✨'
  };

  return (
    <div className={`border rounded-lg p-3 ${priorityColors[suggestion.priority]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm">{typeIcons[suggestion.type]}</span>
            <span className="text-xs font-medium text-gray-300 uppercase">
              {suggestion.type} • {suggestion.section}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              suggestion.priority === 'high' ? 'bg-red-500 text-white' :
              suggestion.priority === 'medium' ? 'bg-yellow-500 text-black' :
              'bg-green-500 text-white'
            }`}>
              {suggestion.priority}
            </span>
          </div>
          
          <p className="text-sm text-gray-200 mb-2">{suggestion.suggestedText}</p>
          
          {isExpanded && (
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-400">Reasoning:</span>
                <p className="text-xs text-gray-300 mt-1">{suggestion.reasoning}</p>
              </div>
              {suggestion.originalText && (
                <div>
                  <span className="text-xs text-gray-400">Original text:</span>
                  <p className="text-xs text-gray-300 mt-1 font-mono bg-gray-800 p-2 rounded">
                    {suggestion.originalText}
                  </p>
                </div>
              )}
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Confidence: {Math.round(suggestion.confidence * 100)}%</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          <button
            onClick={onToggleExpansion}
            className="text-gray-400 hover:text-white transition-colors"
            title={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </button>
          
          {!isApplied ? (
            <Button
              onClick={onApply}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Apply
            </Button>
          ) : (
            <div className="flex items-center space-x-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Applied</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const extractFocusAreasFromMessage = (message: string): string[] => {
  const focusKeywords = {
    'keyword': ['keyword', 'keywords', 'terms', 'buzzword'],
    'content': ['content', 'writing', 'description', 'text'],
    'structure': ['structure', 'format', 'layout', 'organization'],
    'experience': ['experience', 'work', 'job', 'career'],
    'skills': ['skill', 'skills', 'technical', 'competenc'],
    'summary': ['summary', 'profile', 'objective', 'intro']
  };

  const areas: string[] = [];
  const lowerMessage = message.toLowerCase();

  Object.entries(focusKeywords).forEach(([area, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      areas.push(area);
    }
  });

  return areas.length > 0 ? areas : ['general'];
};

const generateAIResponseMessage = (suggestions: CVOptimizationSuggestion[], userMessage: string): string => {
  if (suggestions.length === 0) {
    return "I've analyzed your request, but I don't see any immediate improvements needed in that area. Your CV looks good! Is there anything specific you'd like me to focus on?";
  }

  const highPriority = suggestions.filter(s => s.priority === 'high').length;
  const mediumPriority = suggestions.filter(s => s.priority === 'medium').length;
  const lowPriority = suggestions.filter(s => s.priority === 'low').length;

  let response = `I found ${suggestions.length} suggestions to improve your CV`;
  
  if (highPriority > 0) {
    response += `, including ${highPriority} high-priority improvements`;
  }
  
  response += ". Here are my recommendations:";

  return response;
};

export default AICollaborationChat;