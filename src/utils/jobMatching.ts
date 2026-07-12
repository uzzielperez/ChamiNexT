import type { CoachProfile, JobMatchResult } from '../types/coach';
import type { JobPosting } from '../data/loadJobs';
import type { PracticeTrack } from '../types/interview';

function fitLabel(score: number): JobMatchResult['fitLabel'] {
  if (score >= 75) return 'Strong fit';
  if (score >= 55) return 'Good fit';
  return 'Possible fit';
}

function trackMatch(jobTrack: PracticeTrack, profile: CoachProfile): number {
  if (jobTrack === profile.targetTrack) return 35;
  if (profile.targetTrack === 'software' && jobTrack === 'ai-engineer') return 15;
  return 5;
}

function remoteMatch(job: JobPosting, profile: CoachProfile): number {
  if (profile.remotePreference === 'any') return 10;
  if (profile.remotePreference === 'remote-only' && job.remote) return 20;
  if (profile.remotePreference === 'remote-only' && !job.remote) return -15;
  return 8;
}

function keywordMatch(job: JobPosting, profile: CoachProfile): number {
  const hay = `${job.title} ${job.description}`.toLowerCase();
  let score = 0;
  profile.stack.forEach((s) => {
    if (hay.includes(s.toLowerCase())) score += 4;
  });
  profile.targetRoles.forEach((r) => {
    const words = r.toLowerCase().split(/\s+/);
    if (words.some((w) => w.length > 3 && hay.includes(w))) score += 6;
  });
  return Math.min(score, 25);
}

export function scoreJob(job: JobPosting, profile: CoachProfile): JobMatchResult {
  let score = 20 + trackMatch(job.track, profile) + remoteMatch(job, profile) + keywordMatch(job, profile);
  if (profile.missionPreferred && job.mission) score += 12;
  if (profile.timeline === 'active-search') score += 5;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const whyParts: string[] = [];
  if (job.track === profile.targetTrack) whyParts.push(`Matches your ${profile.targetTrack} track`);
  if (job.remote && profile.remotePreference === 'remote-only') whyParts.push('remote-friendly');
  if (job.mission && profile.missionPreferred) whyParts.push('mission-driven org');
  if (profile.stack.length && keywordMatch(job, profile) > 8) whyParts.push('stack overlap');

  return {
    jobId: job.id,
    score,
    fitLabel: fitLabel(score),
    whyOneLine: whyParts.length ? whyParts.join(' · ') : 'Worth exploring for interview prep',
    prepTrack: job.track,
  };
}

export function rankJobsForProfile(jobs: JobPosting[], profile: CoachProfile): (JobPosting & JobMatchResult)[] {
  return jobs
    .map((job) => ({ ...job, ...scoreJob(job, profile) }))
    .sort((a, b) => b.score - a.score);
}

export function hasCoachProfile(profile: CoachProfile | null): profile is CoachProfile {
  return Boolean(profile?.onboardingComplete && profile.summaryForMatching);
}
