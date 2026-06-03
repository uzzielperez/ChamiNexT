import type {
  InterviewSession,
  ShipTestEnrollment,
  TalentProfile,
} from '../types/interview';
import { practiceProblems } from '../data/practiceProblems';

const SESSIONS_KEY = 'chaminext_interview_sessions';
const SHIP_KEY = 'chaminext_ship_enrollment';
const PROFILE_KEY = 'chaminext_talent_profile';

export function loadSessions(): InterviewSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: InterviewSession): void {
  const sessions = loadSessions().filter((s) => s.id !== session.id);
  sessions.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 50)));
}

export function loadShipEnrollment(): ShipTestEnrollment | null {
  try {
    const raw = localStorage.getItem(SHIP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveShipEnrollment(enrollment: ShipTestEnrollment | null): void {
  if (!enrollment) {
    localStorage.removeItem(SHIP_KEY);
    return;
  }
  localStorage.setItem(SHIP_KEY, JSON.stringify(enrollment));
}

export function buildTalentProfile(name = 'Engineer'): TalentProfile {
  const sessions = loadSessions().filter((s) => s.scores);
  const ship = loadShipEnrollment();
  const shipDone = ship?.status === 'evaluated' || ship?.status === 'submitted' ? 1 : 0;

  const domainScores: Record<string, number[]> = {};
  sessions.forEach((s) => {
    const problem = practiceProblems.find((p) => p.id === s.problemId);
    if (!problem || !s.scores) return;
    if (!domainScores[problem.domain]) domainScores[problem.domain] = [];
    domainScores[problem.domain].push(s.scores.thinking);
  });

  const domains = Object.keys(domainScores) as TalentProfile['strengthDomains'];
  const avgs = domains.map((d) => ({
    d,
    avg: domainScores[d].reduce((a, b) => a + b, 0) / domainScores[d].length,
  }));
  avgs.sort((a, b) => b.avg - a.avg);

  const thinkingScoreAvg =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (s.scores?.thinking ?? 0), 0) / sessions.length
        )
      : 0;

  return {
    displayName: name,
    thinkingScoreAvg,
    shipTestsCompleted: shipDone,
    interviewsCompleted: sessions.length,
    strengthDomains: avgs.slice(0, 2).map((x) => x.d) as TalentProfile['strengthDomains'],
    weaknessDomains: avgs.slice(-2).map((x) => x.d) as TalentProfile['weaknessDomains'],
    summary:
      sessions.length === 0
        ? 'Complete an AI interview or Ship Test to build your hiring profile.'
        : `Strong ${avgs[0]?.d ?? 'fundamentals'} signal; ${sessions.length} interview(s) on record.`,
  };
}

export function loadProfileName(): string {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw).displayName ?? 'Engineer';
  } catch {
    /* ignore */
  }
  return 'Engineer';
}

export function saveProfileName(displayName: string): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ displayName }));
}
