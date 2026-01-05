import React, { useState } from 'react';
import Questionnaire from '../components/jobseekers/Questionnaire';
import CVIterator from '../components/jobseekers/CVIterator';
import { parseCV } from '../utils/cvParser';
import Button from '../components/common/Button';
import { Sparkles, FileText, Zap } from 'lucide-react';


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

  const renderOverview = () => (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-gold-400 sm:text-6xl">
          Advance Your Career
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
          Choose how you want to enhance your professional profile and land your dream job.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* AI CV Iterator */}
        <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-8 border border-blue-500/20">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">AI CV Optimizer</h3>
              <p className="text-blue-200">NEW FEATURE</p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">
            Use AI to optimize your CV for specific job descriptions. Get real-time suggestions, 
            keyword analysis, and iterative improvements through AI collaboration.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-300">
              <Zap className="w-4 h-4 mr-2 text-gold-400" />
              Real-time AI collaboration
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Zap className="w-4 h-4 mr-2 text-gold-400" />
              Job description analysis
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Zap className="w-4 h-4 mr-2 text-gold-400" />
              Version control & comparison
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentView('cv-iterator')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Start AI Optimization
          </Button>
        </div>

        {/* Profile Builder */}
        <div className="bg-gradient-to-br from-gold-900 to-orange-900 rounded-xl p-8 border border-gold-500/20">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Profile Builder</h3>
              <p className="text-gold-200">CLASSIC TOOL</p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">
            Create a professional profile through our guided questionnaire. Upload your CV 
            and answer questions to generate a polished profile.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-300">
              <Zap className="w-4 h-4 mr-2 text-gold-400" />
              Guided questionnaire
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Zap className="w-4 h-4 mr-2 text-gold-400" />
              CV upload & parsing
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Zap className="w-4 h-4 mr-2 text-gold-400" />
              Professional templates
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentView('profile-builder')}
            className="w-full bg-gold-600 hover:bg-gold-700"
          >
            Build Profile
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gold-400 mb-2">10,000+</div>
          <div className="text-gray-400">CVs Optimized</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gold-400 mb-2">85%</div>
          <div className="text-gray-400">Interview Rate Increase</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gold-400 mb-2">24/7</div>
          <div className="text-gray-400">AI Assistant Available</div>
        </div>
      </div>
    </div>
  );

  const renderProfileBuilder = () => (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center mb-8">
        <Button 
          onClick={() => setCurrentView('overview')}
          variant="outline"
          className="mr-4"
        >
          ← Back to Overview
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Builder</h1>
          <p className="text-gray-400">Create your professional profile</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Upload Your CV</h2>
        <div className="flex items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-black hover:file:bg-gold-600"
          />
          <Button onClick={handleUpload} disabled={!file} className="ml-4">
            Upload
          </Button>
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
    <div className="min-h-screen bg-black">
      {currentView === 'overview' && renderOverview()}
      {currentView === 'profile-builder' && renderProfileBuilder()}
      {currentView === 'cv-iterator' && renderCVIterator()}
    </div>
  );
};

export default JobSeekersPage;
