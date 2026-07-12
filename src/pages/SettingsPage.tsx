import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoicePreferencePicker from '../components/coach/VoicePreferencePicker';
import type { VoicePreference } from '../types/coach';
import { loadCoachProfile, saveCoachProfile, syncCoachProfileToServer } from '../utils/coachStorage';
import PremiumButton from '../components/ui/PremiumButton';
import { clearSession, isAuthenticated, loadAuthUser } from '../utils/authSession';
import { ArrowLeft } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [voice, setVoice] = useState<VoicePreference>(() => loadCoachProfile()?.voicePreference ?? 'male');
  const user = loadAuthUser();

  const saveVoice = async () => {
    const profile = loadCoachProfile();
    if (profile) {
      const next = { ...profile, voicePreference: voice };
      saveCoachProfile(next);
      await syncCoachProfileToServer(next);
    }
    navigate(-1);
  };

  const signOut = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md pb-24">
      <button type="button" className="text-sm text-text-secondary mb-6 flex items-center gap-1" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      {user && <p className="text-sm text-text-secondary mb-8">Signed in as {user.email}</p>}
      <VoicePreferencePicker value={voice} onChange={setVoice} />
      <PremiumButton variant="primary" className="mt-8 w-full" onClick={saveVoice}>
        Save voice preference
      </PremiumButton>
      {isAuthenticated() && (
        <PremiumButton variant="ghost" className="mt-4 w-full" onClick={signOut}>
          Sign out
        </PremiumButton>
      )}
    </div>
  );
};

export default SettingsPage;
