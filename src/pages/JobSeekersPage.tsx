import React, { useState } from 'react';
import Questionnaire from '../components/jobseekers/Questionnaire';
import CVIterator from '../components/jobseekers/CVIterator';
import { parseCV } from '../utils/cvParser';
import PremiumButton from '../components/ui/PremiumButton';
import PremiumTabs from '../components/ui/PremiumTabs';
import AuroraBackground from '../components/ui/AuroraBackground';
import { Sparkles, FileText, Zap, ArrowLeft } from 'lucide-react';


type ViewMode = 'overview' | 'cv-iterator' | 'profile-builder';

const JobSeekersPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const text = await parseCV(file);
        setParsedText(text);
      } catch (error) {
        console.error('Error parsing CV:', error);
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Zap className="w-4 h-4" /> },
    { id: 'cv-iterator', label: 'AI CV Optimizer', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'profile-builder', label: 'Profile Builder', icon: <FileText className="w-4 h-4" /> }
  ];

  const renderOverview = () => (
    <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-hero-headline font-bold mb-lg leading-tight text-text-primary">
          Advance Your Career
        </h1>
        <p className="text-subheadline text-text-secondary mb-xl max-w-3xl mx-auto">
          Choose how you want to enhance your professional profile and land your dream job.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* AI CV Iterator */}
        <div className="card group">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-accent-blue rounded-lg flex items-center justify-center mr-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary">AI CV Optimizer</h3>
              <p className="text-accent-blue text-sm font-medium">NEW FEATURE</p>
            </div>
          </div>
          
          <p className="text-text-secondary mb-6">
            Use AI to optimize your CV for specific job descriptions. Get real-time suggestions, 
            keyword analysis, and iterative improvements through AI collaboration.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-text-secondary">
              <Zap className="w-4 h-4 mr-2 text-accent-blue" />
              Real-time AI collaboration
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <Zap className="w-4 h-4 mr-2 text-accent-blue" />
              Job description analysis
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <Zap className="w-4 h-4 mr-2 text-accent-blue" />
              Version control & comparison
            </div>
          </div>
          
          <PremiumButton 
            onClick={() => setCurrentView('cv-iterator')}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Start AI Optimization
          </PremiumButton>
        </div>

        {/* Profile Builder */}
        <div className="card group">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-accent-purple rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary">Profile Builder</h3>
              <p className="text-accent-purple text-sm font-medium">CLASSIC TOOL</p>
            </div>
          </div>
          
          <p className="text-text-secondary mb-6">
            Create a professional profile through our guided questionnaire. Upload your CV 
            and answer questions to generate a polished profile.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-text-secondary">
              <Zap className="w-4 h-4 mr-2 text-accent-purple" />
              Guided questionnaire
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <Zap className="w-4 h-4 mr-2 text-accent-purple" />
              CV upload & parsing
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <Zap className="w-4 h-4 mr-2 text-accent-purple" />
              Professional templates
            </div>
          </div>
          
          <PremiumButton 
            onClick={() => setCurrentView('profile-builder')}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Build Profile
          </PremiumButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-accent-blue mb-2">10,000+</div>
          <div className="text-text-secondary">CVs Optimized</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent-blue mb-2">85%</div>
          <div className="text-text-secondary">Interview Rate Increase</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent-blue mb-2">24/7</div>
          <div className="text-text-secondary">AI Assistant Available</div>
        </div>
      </div>
    </div>
  );

  const renderProfileBuilder = () => (
    <div className="container mx-auto px-4 py-16 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-section-header font-bold text-text-primary mb-4">Profile Builder</h1>
        <p className="text-subheadline text-text-secondary">Create your professional profile through our guided process</p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">Upload Your CV</h2>
          <div className="space-y-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-text-secondary 
                file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 
                file:text-sm file:font-semibold file:bg-accent-blue file:text-white 
                hover:file:bg-accent-secondary file:transition-colors file:cursor-pointer
                border border-border-color rounded-lg p-3 bg-bg-secondary"
            />
            <PremiumButton 
              onClick={handleUpload} 
              disabled={!file} 
              variant="primary"
              size="md"
              className="w-full"
            >
              Upload & Parse CV
            </PremiumButton>
          </div>
        </div>
      </div>

      <Questionnaire parsedText={parsedText} />
    </div>
  );

  const renderCVIterator = () => (
    <CVIterator
      userId="user-123" // In a real app, this would come from authentication
      initialCVContent={parsedText || ''}
      onExit={() => setCurrentView('overview')}
      onSave={(session) => {
        console.log('Session saved:', session);
        // In a real app, save to backend
      }}
    />
  );

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      {/* Aurora Background */}
      <AuroraBackground opacity={0.6} speed={1.0} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation Tabs */}
        {currentView !== 'cv-iterator' && (
          <div className="container mx-auto px-4 pt-8">
            <PremiumTabs
              tabs={tabs}
              activeTab={currentView}
              onTabChange={(tabId) => setCurrentView(tabId as ViewMode)}
            />
          </div>
        )}
        
        {currentView === 'overview' && renderOverview()}
        {currentView === 'profile-builder' && renderProfileBuilder()}
        {currentView === 'cv-iterator' && renderCVIterator()}
      </div>
    </div>
  );
};

export default JobSeekersPage;
