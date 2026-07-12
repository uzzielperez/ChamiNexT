import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VoicePreferencePicker from '../components/coach/VoicePreferencePicker';
import CoachChat from '../components/coach/CoachChat';
import type { CoachProfile, VoicePreference } from '../types/coach';
import {
  defaultCoachProfile,
  fetchCoachProfileFromServer,
  loadCoachProfile,
  saveCoachProfile,
} from '../utils/coachStorage';
import { isAuthenticated } from '../utils/authSession';
import PremiumButton from '../components/ui/PremiumButton';

type Step = 'voice' | 'chat';

const CoachPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('voice');
  const [voice, setVoice] = useState<VoicePreference>('male');
  const [profile, setProfile] = useState<CoachProfile | null>(() => loadCoachProfile());

  useEffect(() => {
    if (isAuthenticated()) void fetchCoachProfileFromServer().then(setProfile);
  }, []);

  useEffect(() => {
    if (profile?.voicePreference) setVoice(profile.voicePreference);
    if (profile?.onboardingComplete) setStep('chat');
    else if (profile?.voicePreference) setStep('chat');
  }, [profile]);

  const startChat = () => {
    const base = profile ?? defaultCoachProfile(voice);
    const next = { ...base, voicePreference: voice };
    saveCoachProfile(next);
    setProfile(next);
    setStep('chat');
  };

  const onComplete = (p: CoachProfile) => {
    setProfile(p);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl pb-24 md:pb-12">
      <div className="text-center mb-8">
        <p className="text-xs text-accent-blue font-medium uppercase tracking-wide">Coach</p>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">Your career agent</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">
          A short conversation so job matches and your skill path fit how you actually work.
        </p>
      </div>

      {!isAuthenticated() && (
        <div className="card p-4 mb-6 text-center text-sm">
          <Link to="/login" className="text-accent-blue font-medium hover:underline">
            Sign in
          </Link>{' '}
          to save progress and unlock personalized jobs.
        </div>
      )}

      {step === 'voice' && !profile?.onboardingComplete ? (
        <div>
          <VoicePreferencePicker value={voice} onChange={setVoice} />
          <div className="mt-8 flex justify-center">
            <PremiumButton variant="primary" size="lg" onClick={startChat}>
              Continue with Coach
            </PremiumButton>
          </div>
        </div>
      ) : (
        <div className="card p-4 md:p-6 min-h-[420px] flex flex-col">
          <CoachChat
            voicePreference={voice}
            initialProfile={profile ?? undefined}
            onComplete={onComplete}
          />
          {profile?.onboardingComplete && (
            <button
              type="button"
              className="text-xs text-text-secondary mt-4 text-center hover:text-accent-blue"
              onClick={() => navigate('/settings')}
            >
              Change Coach voice in settings
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoachPage;
