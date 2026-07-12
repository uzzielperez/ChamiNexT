import type { CoachMessage, CoachProfile, CoachSession, VoicePreference } from '../types/coach';
import { authHeaders, isAuthenticated } from './authSession';

const PROFILE_KEY = 'chaminext_coach_profile';
const SESSION_KEY = 'chaminext_coach_session';
const INTRO_COUNT_KEY = 'chaminext_intro_drafts_month';
const SAVED_JOBS_KEY = 'chaminext_saved_jobs';

export function defaultCoachProfile(voice: VoicePreference = 'male'): CoachProfile {
  return {
    onboardingComplete: false,
    voicePreference: voice,
    targetTrack: 'software',
    targetRoles: [],
    remotePreference: 'any',
    timeline: 'exploring',
    stack: [],
    weakAreas: [],
    missionPreferred: false,
    recommendedLeafIds: [],
    summaryForMatching: '',
  };
}

export function loadCoachProfile(): CoachProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as CoachProfile) : null;
  } catch {
    return null;
  }
}

export function saveCoachProfile(profile: CoachProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }));
}

export function loadCoachSession(): CoachSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as CoachSession;
  } catch {
    /* ignore */
  }
  return { messages: [], startedAt: new Date().toISOString() };
}

export function saveCoachSession(session: CoachSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function appendCoachMessage(role: CoachMessage['role'], content: string): CoachMessage {
  const session = loadCoachSession();
  const msg: CoachMessage = {
    id: `cm-${Date.now()}`,
    role,
    content,
    at: new Date().toISOString(),
  };
  session.messages.push(msg);
  saveCoachSession(session);
  return msg;
}

export async function syncCoachProfileToServer(profile: CoachProfile): Promise<void> {
  if (!isAuthenticated()) return;
  await fetch('/.netlify/functions/coach-profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ profile }),
  });
}

export async function fetchCoachProfileFromServer(): Promise<CoachProfile | null> {
  if (!isAuthenticated()) return null;
  const res = await fetch('/.netlify/functions/coach-profile', {
    headers: authHeaders(),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.profile) {
    saveCoachProfile(data.profile);
    return data.profile;
  }
  return null;
}

export function loadSavedJobIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function toggleSavedJob(jobId: string): Set<string> {
  const ids = loadSavedJobIds();
  if (ids.has(jobId)) ids.delete(jobId);
  else ids.add(jobId);
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify([...ids]));
  return ids;
}

function monthKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function introDraftsUsedThisMonth(): number {
  try {
    const raw = localStorage.getItem(INTRO_COUNT_KEY);
    if (!raw) return 0;
    const { month, count } = JSON.parse(raw) as { month: string; count: number };
    return month === monthKey() ? count : 0;
  } catch {
    return 0;
  }
}

export function recordIntroDraft(): void {
  const month = monthKey();
  const used = introDraftsUsedThisMonth();
  localStorage.setItem(INTRO_COUNT_KEY, JSON.stringify({ month, count: used + 1 }));
}

export function canCreateIntroDraft(isPaid: boolean): boolean {
  if (isPaid) return true;
  return introDraftsUsedThisMonth() < 3;
}

export function loadIntroDrafts(): { jobId: string; channel: string; body: string; createdAt: string }[] {
  try {
    const raw = localStorage.getItem('chaminext_intro_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveIntroDraftLocal(entry: {
  jobId: string;
  channel: string;
  subject?: string;
  body: string;
}): void {
  const history = loadIntroDrafts();
  history.unshift({ ...entry, createdAt: new Date().toISOString() });
  localStorage.setItem('chaminext_intro_history', JSON.stringify(history.slice(0, 50)));
  recordIntroDraft();
}
