import { saveSession, saveShipEnrollment, saveProfileName } from './interviewStorage';
import { saveRoles, saveApplications } from './employerStorage';
import { saveSubscription } from './subscriptionStorage';
import { setDemoMode } from './demoMode';
import { getOrCreateProfileSlug, exportPublicProfile } from './profileSlug';
import type { InterviewSession } from '../types/interview';

export function seedDemoPresentation(): void {
  setDemoMode(true);
  saveProfileName('Demo Engineer');
  saveSubscription('builder');

  const sessions: InterviewSession[] = [
    {
      id: 'demo-session-1',
      problemId: 'two-sum-variant',
      startedAt: new Date(Date.now() - 86400000).toISOString(),
      endedAt: new Date(Date.now() - 86000000).toISOString(),
      messages: [],
      code: 'function twoSum(nums, target) { /* hash map */ }',
      scores: { thinking: 84, decomposition: 81, communication: 79, codeQuality: 77, overall: 80 },
      scoreNotes: 'Clear complexity explanation; good edge-case awareness.',
    },
    {
      id: 'demo-session-2',
      problemId: 'rate-limiter-design',
      startedAt: new Date(Date.now() - 172800000).toISOString(),
      endedAt: new Date(Date.now() - 172000000).toISOString(),
      messages: [],
      code: '// token bucket + redis',
      scores: { thinking: 88, decomposition: 85, communication: 82, codeQuality: 80, overall: 84 },
      scoreNotes: 'Strong tradeoff discussion on distributed vs single-node.',
    },
  ];
  sessions.forEach(saveSession);

  saveShipEnrollment({
    challengeId: 'habit-tracker-24h',
    enrolledAt: new Date(Date.now() - 3600000).toISOString(),
    endsAt: new Date(Date.now() + 1800000).toISOString(),
    deploymentUrl: 'https://habit-tracker-demo.vercel.app',
    status: 'evaluated',
    scores: {
      shipping: 92,
      productThinking: 85,
      engineeringQuality: 83,
      executionSpeed: 88,
      tradeoffAwareness: 86,
      overall: 87,
    },
    events: [
      { id: 'e1', role: 'pm', message: 'Ship a minimal habit tracker MVP.', at: new Date().toISOString() },
      { id: 'e2', role: 'tech-lead', message: 'Prefer local-first state; defer auth.', at: new Date().toISOString() },
      { id: 'e3', role: 'reviewer', message: 'Deployed URL verified.', at: new Date().toISOString() },
    ],
  });

  saveRoles([
    {
      id: 'role-demo-1',
      title: 'Full Stack Engineer',
      level: 'Mid',
      shipTestId: 'habit-tracker-24h',
      assessmentType: 'both',
      createdAt: new Date().toISOString(),
    },
  ]);

  const slug = getOrCreateProfileSlug();
  exportPublicProfile(slug);

  saveApplications([
    {
      id: 'app-seed-1',
      roleId: 'role-demo-1',
      displayName: 'Demo Engineer',
      profileSlug: slug,
      thinking: 82,
      shipping: 87,
      shipTestTitle: '24h Habit Tracker',
      deploymentUrl: 'https://habit-tracker-demo.vercel.app',
      appliedAt: new Date().toISOString(),
      status: 'strong',
    },
    {
      id: 'app-seed-2',
      roleId: 'role-demo-1',
      displayName: 'Jordan K.',
      profileSlug: 'eng-demo-jordan',
      thinking: 74,
      shipping: 88,
      shipTestTitle: '24h Habit Tracker',
      appliedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'review',
    },
    {
      id: 'app-seed-3',
      roleId: 'role-demo-1',
      displayName: 'Sam P.',
      profileSlug: 'eng-demo-sam',
      thinking: 68,
      shipping: 71,
      shipTestTitle: 'AI Interview only',
      appliedAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'hold',
    },
  ]);
}
