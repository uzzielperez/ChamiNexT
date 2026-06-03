import React, { useState } from 'react';
import CVIterator from '../components/jobseekers/CVIterator';
import Questionnaire from '../components/jobseekers/Questionnaire';
import PremiumTabs from '../components/ui/PremiumTabs';
import AuroraBackground from '../components/ui/AuroraBackground';
import PracticeDashboard from '../components/interview/PracticeDashboard';
import InterviewSimulator from '../components/interview/InterviewSimulator';
import TalentProfile from '../components/interview/TalentProfile';
import ShipTestLobby from '../components/ship-tests/ShipTestLobby';
import ShipTestSession, { enrollInShipTest } from '../components/ship-tests/ShipTestSession';
import { parseCV } from '../utils/cvParser';
import { loadShipEnrollment } from '../utils/interviewStorage';
import type { PracticeProblem } from '../types/interview';
import type { ShipTestChallenge } from '../types/interview';
import { Brain, Rocket, User, Wrench, Sparkles, FileText } from 'lucide-react';
import { canStartInterview, recordInterviewStart } from '../utils/subscriptionStorage';
import { useNavigate } from 'react-router-dom';

type ViewMode =
  | 'practice'
  | 'interview'
  | 'ship-lobby'
  | 'ship-session'
  | 'profile'
  | 'tools';

type ToolsSubview = 'menu' | 'cv' | 'builder';

const JobSeekersPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewMode>('practice');
  const [toolsSubview, setToolsSubview] = useState<ToolsSubview>('menu');
  const [activeProblem, setActiveProblem] = useState<PracticeProblem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const shipEnrollment = loadShipEnrollment();

  const tabs = [
    { id: 'practice', label: 'Practice', icon: <Brain className="w-4 h-4" /> },
    { id: 'ship-lobby', label: 'Ship Tests', icon: <Rocket className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <Wrench className="w-4 h-4" /> },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        setParsedText(await parseCV(file));
      } catch (error) {
        console.error('Error parsing CV:', error);
      }
    }
  };

  const startInterview = (problem: PracticeProblem) => {
    if (!canStartInterview()) {
      navigate('/pricing');
      return;
    }
    recordInterviewStart();
    setActiveProblem(problem);
    setCurrentView('interview');
  };

  const handleShipEnroll = (challenge: ShipTestChallenge) => {
    if (shipEnrollment?.challengeId === challenge.id && shipEnrollment.status === 'active') {
      setCurrentView('ship-session');
      return;
    }
    enrollInShipTest(challenge.id);
    setCurrentView('ship-session');
  };

  const fullScreenViews: ViewMode[] = ['interview', 'ship-session'];
  const toolsFullScreen = currentView === 'tools' && toolsSubview === 'cv';

  return (
    <div className="min-h-screen bg-primary-dark text-text-primary relative overflow-hidden">
      <AuroraBackground opacity={0.6} speed={1.0} />

      <div className="relative z-10">
        {!fullScreenViews.includes(currentView) && !toolsFullScreen && (
          <div className="w-full px-4 pt-8">
            <div className="container mx-auto max-w-5xl">
              <PremiumTabs
                tabs={tabs}
                activeTab={currentView}
                onTabChange={(tabId) => {
                  if (tabId === 'tools') {
                    setToolsSubview('menu');
                    setCurrentView('tools');
                  } else if (tabId === 'ship-lobby' && shipEnrollment?.status === 'active') {
                    setCurrentView('ship-session');
                  } else setCurrentView(tabId as ViewMode);
                }}
              />
            </div>
          </div>
        )}

        {currentView === 'practice' && (
          <PracticeDashboard
            onStartInterview={startInterview}
            onOpenShipTests={() =>
              shipEnrollment?.status === 'active'
                ? setCurrentView('ship-session')
                : setCurrentView('ship-lobby')
            }
            onOpenProfile={() => setCurrentView('profile')}
          />
        )}

        {currentView === 'interview' && activeProblem && (
          <InterviewSimulator
            problem={activeProblem}
            onExit={() => {
              setActiveProblem(null);
              setCurrentView('practice');
            }}
          />
        )}

        {currentView === 'ship-lobby' && (
          <ShipTestLobby
            onBack={() => setCurrentView('practice')}
            onEnroll={handleShipEnroll}
            activeChallengeId={shipEnrollment?.challengeId}
          />
        )}

        {currentView === 'ship-session' && (
          <ShipTestSession onExit={() => setCurrentView('ship-lobby')} />
        )}

        {currentView === 'profile' && (
          <TalentProfile onBack={() => setCurrentView('practice')} />
        )}

        {currentView === 'tools' && toolsSubview === 'menu' && (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <p className="text-center text-text-secondary mb-8 text-sm">
              Legacy tools — core prep is Practice & Ship Tests.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                type="button"
                className="card p-6 text-left hover:border-accent-blue/40 transition-colors"
                onClick={() => setToolsSubview('cv')}
              >
                <Sparkles className="w-8 h-8 text-accent-blue mb-3" />
                <h3 className="font-bold text-lg">AI CV Optimizer</h3>
                <p className="text-text-secondary text-sm mt-2">Tailor your CV to a job description.</p>
              </button>
              <button
                type="button"
                className="card p-6 text-left hover:border-accent-blue/40 transition-colors"
                onClick={() => setToolsSubview('builder')}
              >
                <FileText className="w-8 h-8 text-accent-blue mb-3" />
                <h3 className="font-bold text-lg">Profile Builder</h3>
                <p className="text-text-secondary text-sm mt-2">Guided questionnaire + CV upload.</p>
              </button>
            </div>
          </div>
        )}

        {currentView === 'tools' && toolsSubview === 'cv' && (
          <CVIterator
            userId="local-user"
            initialCVContent={parsedText || ''}
            onExit={() => setToolsSubview('menu')}
            onSave={() => {}}
          />
        )}

        {currentView === 'tools' && toolsSubview === 'builder' && (
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <button
              type="button"
              className="text-accent-blue text-sm mb-6"
              onClick={() => setToolsSubview('menu')}
            >
              ← Back to tools
            </button>
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">Upload CV (PDF)</h2>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-blue file:text-white"
              />
              <button
                type="button"
                className="btn-primary mt-4 w-full"
                onClick={handleUpload}
                disabled={!file}
              >
                Parse CV
              </button>
            </div>
            <Questionnaire parsedText={parsedText} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekersPage;
