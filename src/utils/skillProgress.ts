import progression from '../../content/fundamentals/coach-progression.json';
import type { CoachProfile } from '../types/coach';
import type { PracticeTrack } from '../types/interview';
import { loadCoachProfile } from './coachStorage';

const PROGRESS_KEY = 'chaminext_skill_leaf_progress';

export type FundamentalsEntry = {
  leafId: string;
  track: PracticeTrack;
  prerequisites: string[];
};

export const fundamentalsPath: FundamentalsEntry[] = progression.fundamentals.map((f) => ({
  leafId: f.leafId,
  track: f.track as PracticeTrack,
  prerequisites: f.prerequisites || [],
}));

export function loadCompletedLeafIds(): Set<string> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function completeLeaf(leafId: string): Set<string> {
  const ids = loadCompletedLeafIds();
  ids.add(leafId);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...ids]));
  return ids;
}

export function isFundamentalsComplete(): boolean {
  const done = loadCompletedLeafIds();
  return fundamentalsPath.every((f) => done.has(f.leafId));
}

export function isLeafUnlocked(
  leafId: string,
  track: PracticeTrack,
  profile: CoachProfile | null
): boolean {
  const done = loadCompletedLeafIds();
  const fund = fundamentalsPath.find((f) => f.leafId === leafId);
  if (fund) {
    return fund.prerequisites.every((p) => done.has(p));
  }

  if (!isFundamentalsComplete()) return false;
  const target = profile?.targetTrack ?? loadCoachProfile()?.targetTrack ?? 'software';
  if (track !== target) return done.has(leafId);
  return true;
}

export function leafUnlockState(
  leafId: string,
  track: PracticeTrack
): 'locked' | 'available' | 'complete' {
  const done = loadCompletedLeafIds();
  if (done.has(leafId)) return 'complete';
  const profile = loadCoachProfile();
  return isLeafUnlocked(leafId, track, profile) ? 'available' : 'locked';
}

export function fundamentalsProgress(): { done: number; total: number } {
  const done = loadCompletedLeafIds();
  const total = fundamentalsPath.length;
  const count = fundamentalsPath.filter((f) => done.has(f.leafId)).length;
  return { done: count, total };
}

export function nextFundamentalsLeaf(): FundamentalsEntry | null {
  const done = loadCompletedLeafIds();
  return fundamentalsPath.find((f) => !done.has(f.leafId) && f.prerequisites.every((p) => done.has(p))) ?? null;
}

/** Current leaf for Daily step 1 — next fundamentals, or next incomplete on target track. */
export function getCurrentDailyLeaf(): FundamentalsEntry | { leafId: string; track: PracticeTrack } | null {
  const nextFund = nextFundamentalsLeaf();
  if (nextFund) return nextFund;

  const profile = loadCoachProfile();
  const target = profile?.targetTrack ?? 'software';
  const done = loadCompletedLeafIds();
  const recommended = profile?.recommendedLeafIds?.find((id) => !done.has(id));
  if (recommended) {
    return { leafId: recommended, track: target };
  }
  return null;
}
