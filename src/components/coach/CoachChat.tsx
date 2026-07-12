import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import type { CoachMessage, CoachProfile, VoicePreference } from '../../types/coach';
import { sendCoachMessage } from '../../utils/coachAgent';
import {
  appendCoachMessage,
  loadCoachSession,
  saveCoachProfile,
  saveCoachSession,
  syncCoachProfileToServer,
} from '../../utils/coachStorage';
import CoachCompletionCTA from './CoachCompletionCTA';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authSession';

interface CoachChatProps {
  voicePreference: VoicePreference;
  initialProfile?: Partial<CoachProfile>;
  onComplete?: (profile: CoachProfile) => void;
}

const CoachChat: React.FC<CoachChatProps> = ({ voicePreference, initialProfile, onComplete }) => {
  const [messages, setMessages] = useState<CoachMessage[]>(() => loadCoachSession().messages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [topicsComplete, setTopicsComplete] = useState(0);
  const [topicsTotal, setTopicsTotal] = useState(7);
  const [profilePatch, setProfilePatch] = useState<Partial<CoachProfile>>(initialProfile ?? {});
  const [complete, setComplete] = useState(Boolean(initialProfile?.onboardingComplete));
  const [profile, setProfile] = useState<CoachProfile | null>(
    initialProfile?.onboardingComplete ? (initialProfile as CoachProfile) : null
  );
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const authed = isAuthenticated();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (started.current || messages.length > 0) return;
    started.current = true;
    void kickoff();
  }, []);

  const persistMessages = (next: CoachMessage[]) => {
    setMessages(next);
    saveCoachSession({ messages: next, voicePreference, startedAt: loadCoachSession().startedAt });
  };

  const kickoff = async () => {
    setLoading(true);
    try {
      const res = await sendCoachMessage([], voicePreference, profilePatch);
      const msg = appendCoachMessage('coach', res.reply);
      persistMessages([msg]);
      if (res.topicsComplete) setTopicsComplete(res.topicsComplete);
      if (res.topicsTotal) setTopicsTotal(res.topicsTotal);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading || complete) return;

    if (!authed && messages.filter((m) => m.role === 'user').length >= 1) {
      appendCoachMessage(
        'system',
        'Sign in to save your progress and unlock job matches → /login'
      );
      setMessages(loadCoachSession().messages);
      return;
    }

    const userMsg = appendCoachMessage('user', text);
    const nextMsgs = [...messages, userMsg];
    persistMessages(nextMsgs);
    setInput('');
    setLoading(true);

    try {
      const patch = { ...profilePatch, voicePreference };
      const res = await sendCoachMessage(nextMsgs, voicePreference, patch);
      const coachMsg = appendCoachMessage('coach', res.reply);
      persistMessages([...nextMsgs, coachMsg]);
      if (res.profilePatch) setProfilePatch((p) => ({ ...p, ...res.profilePatch }));
      if (res.topicsComplete) setTopicsComplete(res.topicsComplete);
      if (res.topicsTotal) setTopicsTotal(res.topicsTotal);

      if (res.onboardingComplete && res.profile) {
        const full = { ...res.profile, voicePreference, onboardingComplete: true } as CoachProfile;
        saveCoachProfile(full);
        await syncCoachProfileToServer(full);
        setProfile(full);
        setComplete(true);
        onComplete?.(full);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <p className="text-xs text-accent-blue font-medium uppercase tracking-wide">Coach</p>
          <p className="text-sm text-text-secondary">Your career agent</p>
        </div>
        {!complete && (
          <p className="text-xs text-text-secondary">
            Getting to know you ({topicsComplete}/{topicsTotal})
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[90%] rounded-lg px-4 py-2 text-sm ${
              m.role === 'user'
                ? 'ml-auto bg-accent-blue/20 text-text-primary'
                : m.role === 'system'
                  ? 'mx-auto text-center text-xs text-text-secondary border border-[var(--border-color)]'
                  : 'bg-[var(--bg-secondary)] text-text-secondary border border-[var(--border-color)]'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <p className="text-sm text-text-secondary animate-pulse">Coach is thinking…</p>
        )}
        <div ref={endRef} />
      </div>

      {!complete ? (
        <>
          {!authed && messages.filter((m) => m.role === 'user').length >= 1 && (
            <p className="text-xs text-center text-accent-blue mb-2">
              <Link to="/login" className="hover:underline">
                Sign in to continue →
              </Link>
            </p>
          )}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Tell Coach about your goals…"
              className="flex-1 px-4 py-3 rounded-lg bg-bg-secondary border border-gray-700 text-text-primary text-sm"
              disabled={loading}
            />
            <PremiumButton variant="primary" onClick={send} disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </PremiumButton>
          </div>
        </>
      ) : (
        profile && <CoachCompletionCTA />
      )}
    </div>
  );
};

export default CoachChat;
