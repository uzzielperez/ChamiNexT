import type { CoachMessage, OnboardingAgentResponse, VoicePreference } from '../types/coach';
import type { CoachProfile } from '../types/coach';

export async function sendCoachMessage(
  messages: CoachMessage[],
  voicePreference: VoicePreference,
  profilePatch: Partial<CoachProfile>
): Promise<OnboardingAgentResponse> {
  const res = await fetch('/.netlify/functions/onboarding-agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role === 'coach' ? 'assistant' : m.role, content: m.content })),
      voicePreference,
      profilePatch,
    }),
  });
  if (!res.ok) throw new Error('Coach unavailable');
  return res.json();
}
