import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Download, History, RotateCcw, Save, Share2 } from 'lucide-react';
import Button from '../common/Button';
import JobDescriptionInput from './JobDescriptionInput';
import AICollaborationChat from './AICollaborationChat';
import { 
  JobDescription, 
  CVOptimizationSession, 
  CVVersion,
  CVComparisonResult 
} from '../../types/cvOptimization';
import { 
  createOptimizationSession, 
  calculateBasicScore, 
  compareCVVersions,
  generateId
} from '../../utils/aiCVOptimizer';

interface CVIteratorProps {
  userId: string;
  initialCVContent?: string;
  onSave?: (session: CVOptimizationSession) => void;
  onExit?: () => void;
  className?: string;
}

type ViewMode = 'input' | 'optimize' | 'compare' | 'history';

const CVIterator: React.FC<CVIteratorProps> = ({
  userId,
  initialCVContent = '',
  onSave,
  onExit,
  className = ''
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>('input');
  const [session, setSession] = useState<CVOptimizationSession | null>(null);
  const [currentCVContent, setCurrentCVContent] = useState(initialCVContent);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<CVComparisonResult | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<{ before: string; after: string }>({
    before: '',
    after: ''
  });

  // Initialize session when job description is analyzed
  const handleJobDescriptionAnalyzed = useCallback((jobDescription: JobDescription) => {
    if (!currentCVContent.trim()) return;

    const newSession = createOptimizationSession(userId, jobDescription, currentCVContent);
    setSession(newSession);
    setCurrentView('optimize');
  }, [userId, currentCVContent]);

  // Handle CV content changes
  const handleCVContentChange = useCallback((content: string) => {
    setCurrentCVContent(content);
  }, []);

  // Handle session updates from AI chat
  const handleSessionUpdate = useCallback((updatedSession: CVOptimizationSession) => {
    setSession(updatedSession);
    
    // Save to localStorage for persistence
    localStorage.setItem(`cv-session-${updatedSession.id}`, JSON.stringify(updatedSession));
  }, []);

  // Handle CV updates from AI suggestions
  const handleCVUpdate = useCallback((newContent: string) => {
    if (!session) return;

    // Create new version
    const newVersion: CVVersion = {
      id: generateId(),
      version: session.versions.length + 1,
      content: newContent,
      createdAt: new Date(),
      jobDescriptionId: session.jobDescription.id,
      optimizationScore: calculateBasicScore(newContent, session.jobDescription),
      appliedSuggestions: [...session.currentCV.appliedSuggestions]
    };

    // Update session
    const updatedSession: CVOptimizationSession = {
      ...session,
      currentCV: newVersion,
      versions: [...session.versions, newVersion],
      updatedAt: new Date()
    };

    setSession(updatedSession);
    setCurrentCVContent(newContent);
  }, [session]);

  // Handle version comparison
  const handleCompareVersions = useCallback(() => {
    if (!session || session.versions.length < 2) return;

    const beforeVersion = session.versions.find(v => v.id === selectedVersions.before) || session.originalCV;
    const afterVersion = session.versions.find(v => v.id === selectedVersions.after) || session.currentCV;

    const comparison = compareCVVersions(beforeVersion, afterVersion);
    setComparisonResult(comparison);
    setCurrentView('compare');
  }, [session, selectedVersions]);

  // Handle save session
  const handleSaveSession = useCallback(() => {
    if (!session) return;

    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem(`cv-session-${session.id}`, JSON.stringify(session));
      
      // Call parent save handler if provided
      if (onSave) {
        onSave(session);
      }
      
      // Show success message (you could add a toast notification here)
      console.log('Session saved successfully');
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session, onSave]);

  // Handle download CV
  const handleDownloadCV = useCallback(() => {
    if (!currentCVContent) return;

    const blob = new Blob([currentCVContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-cv-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentCVContent]);

  // Handle reset to original
  const handleResetToOriginal = useCallback(() => {
    if (!session) return;

    setCurrentCVContent(session.originalCV.content);
    
    const resetSession: CVOptimizationSession = {
      ...session,
      currentCV: session.originalCV,
      updatedAt: new Date()
    };
    
    setSession(resetSession);
  }, [session]);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSessions = Object.keys(localStorage)
      .filter(key => key.startsWith('cv-session-'))
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key) || '');
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    // For now, just load the most recent session if available
    if (savedSessions.length > 0) {
      const mostRecent = savedSessions.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      
      // Only load if it's for the same user
      if (mostRecent.userId === userId) {
        setSession(mostRecent);
        setCurrentCVContent(mostRecent.currentCV.content);
        if (mostRecent.jobDescription) {
          setCurrentView('optimize');
        }
      }
    }
  }, [userId]);

  const renderProgressBar = () => {
    if (!session) return null;

    const progress = Math.min(100, (session.currentCV.optimizationScore / 100) * 100);
    const scoreImprovement = session.currentCV.optimizationScore - session.originalCV.optimizationScore;

    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Optimization Score</span>
          <span className="text-lg font-bold text-gold-400">
            {session.currentCV.optimizationScore}/100
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-gold-500 to-gold-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Original: {session.originalCV.optimizationScore}</span>
          {scoreImprovement > 0 && (
            <span className="text-green-400">+{scoreImprovement} improvement</span>
          )}
          <span>{session.versions.length} versions</span>
        </div>
      </div>
    );
  };

  const renderNavigation = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button
          onClick={onExit}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit
        </Button>
        
        <div className="flex items-center space-x-2">
          {(['input', 'optimize', 'compare', 'history'] as ViewMode[]).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              disabled={view === 'optimize' && !session}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                currentView === view
                  ? 'bg-gold-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } ${view === 'optimize' && !session ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {session && (
          <>
            <Button
              onClick={handleResetToOriginal}
              variant="outline"
              size="sm"
              title="Reset to original CV"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleSaveSession}
              variant="outline"
              size="sm"
              disabled={isLoading}
              title="Save session"
            >
              <Save className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleDownloadCV}
              variant="outline"
              size="sm"
              title="Download optimized CV"
            >
              <Download className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );

  const renderInputView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">CV Optimization Assistant</h2>
        <p className="text-gray-400 text-lg">
          Paste a job description and your CV to get AI-powered optimization suggestions
        </p>
      </div>
      
      <JobDescriptionInput
        onJobDescriptionAnalyzed={handleJobDescriptionAnalyzed}
        onCVContentChange={handleCVContentChange}
        initialCVContent={currentCVContent}
        isLoading={isLoading}
      />
    </div>
  );

  const renderOptimizeView = () => {
    if (!session) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* CV Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Your CV</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Version {session.currentCV.version}</span>
              <Button
                onClick={() => setCurrentView('history')}
                variant="outline"
                size="sm"
              >
                <History className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <textarea
            value={currentCVContent}
            onChange={(e) => handleCVContentChange(e.target.value)}
            className="w-full h-96 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none font-mono text-sm"
            placeholder="Your CV content will appear here..."
          />
        </div>

        {/* AI Chat */}
        <div className="bg-gray-800 rounded-lg">
          <AICollaborationChat
            session={session}
            onSessionUpdate={handleSessionUpdate}
            onCVUpdate={handleCVUpdate}
            className="h-full"
          />
        </div>
      </div>
    );
  };

  const renderCompareView = () => {
    if (!session || session.versions.length < 2) {
      return (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">No Versions to Compare</h3>
          <p className="text-gray-500">
            You need at least 2 CV versions to use the comparison feature.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Version Selector */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Compare Versions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Before Version</label>
              <select
                value={selectedVersions.before}
                onChange={(e) => setSelectedVersions(prev => ({ ...prev, before: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Select version...</option>
                {session.versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    Version {version.version} - Score: {version.optimizationScore}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">After Version</label>
              <select
                value={selectedVersions.after}
                onChange={(e) => setSelectedVersions(prev => ({ ...prev, after: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Select version...</option>
                {session.versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    Version {version.version} - Score: {version.optimizationScore}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <Button
            onClick={handleCompareVersions}
            disabled={!selectedVersions.before || !selectedVersions.after}
          >
            Compare Versions
          </Button>
        </div>

        {/* Comparison Results */}
        {comparisonResult && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Comparison Results</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">
                  +{comparisonResult.improvements.scoreIncrease}
                </div>
                <div className="text-sm text-gray-400">Score Improvement</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">
                  {comparisonResult.improvements.keywordsAdded.length}
                </div>
                <div className="text-sm text-gray-400">Keywords Added</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-400">
                  {comparisonResult.improvements.suggestionsApplied}
                </div>
                <div className="text-sm text-gray-400">Suggestions Applied</div>
              </div>
            </div>
            
            {/* Side-by-side comparison would go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-300 mb-2">Before (Version {comparisonResult.beforeVersion.version})</h5>
                <div className="bg-gray-700 rounded p-4 h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {comparisonResult.beforeVersion.content}
                  </pre>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-300 mb-2">After (Version {comparisonResult.afterVersion.version})</h5>
                <div className="bg-gray-700 rounded p-4 h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {comparisonResult.afterVersion.content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistoryView = () => {
    if (!session) return null;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Version History</h3>
        
        <div className="space-y-4">
          {session.versions.map((version) => (
            <div
              key={version.id}
              className={`p-4 rounded-lg border ${
                version.id === session.currentCV.id
                  ? 'border-gold-500 bg-gold-500 bg-opacity-10'
                  : 'border-gray-600 bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-white">Version {version.version}</span>
                  {version.id === session.currentCV.id && (
                    <span className="px-2 py-1 bg-gold-500 text-white text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    Score: {version.optimizationScore}/100
                  </span>
                  <span className="text-sm text-gray-400">
                    {version.createdAt.toLocaleString()}
                  </span>
                  
                  {version.id !== session.currentCV.id && (
                    <Button
                      onClick={() => {
                        setCurrentCVContent(version.content);
                        const updatedSession = { ...session, currentCV: version };
                        setSession(updatedSession);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-300">
                Applied suggestions: {version.appliedSuggestions.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-900 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {renderNavigation()}
        {renderProgressBar()}
        
        <div className="min-h-[600px]">
          {currentView === 'input' && renderInputView()}
          {currentView === 'optimize' && renderOptimizeView()}
          {currentView === 'compare' && renderCompareView()}
          {currentView === 'history' && renderHistoryView()}
        </div>
      </div>
    </div>
  );
};

export default CVIterator;