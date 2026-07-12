import type { CoachProfile, IntroAgentResponse } from '../types/coach';
import type { JobPosting } from '../data/loadJobs';

export async function generateIntroDrafts(
  job: JobPosting,
  coachProfile: CoachProfile,
  extras: { talentSummary?: string; profileSlug?: string }
): Promise<IntroAgentResponse> {
  const res = await fetch('/.netlify/functions/intro-agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job,
      coachProfile,
      talentSummary: extras.talentSummary,
      profileSlug: extras.profileSlug,
    }),
  });
  if (!res.ok) throw new Error('Intro draft failed');
  return res.json();
}
