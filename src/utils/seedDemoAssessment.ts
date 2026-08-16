import type { PromptRecord, StudioSubmission } from '../types/studioSubmission';
import { saveSubmission } from './studioSubmissionStorage';
import { gradeSubmissionPackage } from './submissionGrader';
import { DEMO_ASSESSMENT_ROLE_ID } from '../data/companyAssessments';
import { addApplication } from './employerStorage';
import { filesToMap, RATE_LIMITER_WORKSPACE } from '../data/workspaceTemplates';

const DEMO_PROMPTS: PromptRecord[] = [
  {
    id: 'demo-p1',
    at: new Date(Date.now() - 420000).toISOString(),
    source: 'quick',
    text: 'Review my approach before I code more',
    activeFile: 'src/rateLimiter.ts',
  },
  {
    id: 'demo-p2',
    at: new Date(Date.now() - 360000).toISOString(),
    source: 'panel',
    text: 'Should I use a sliding window or token bucket for per-IP limits? We need Retry-After on 429.',
    activeFile: 'src/rateLimiter.ts',
  },
  {
    id: 'demo-p3',
    at: new Date(Date.now() - 300000).toISOString(),
    source: 'terminal',
    text: 'agent What edge cases should I test for concurrent requests?',
    activeFile: 'src/rateLimiter.ts',
  },
  {
    id: 'demo-p4',
    at: new Date(Date.now() - 240000).toISOString(),
    source: 'panel',
    text: 'I used AI to sketch tests — I will disclose in PR. How do I verify the bucket resets after 60s?',
    activeFile: 'tests/rateLimiter.test.ts',
  },
];

export function seedDemoAssessmentSubmission(): StudioSubmission {
  const starterFiles = filesToMap(RATE_LIMITER_WORKSPACE.files);
  const files = { ...starterFiles };
  files['src/rateLimiter.ts'] = `const BUCKET_SIZE = 10;
const WINDOW_MS = 60_000;
const buckets = new Map();

export function checkRateLimit(key) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now - b.windowStart >= WINDOW_MS) {
    b = { tokens: BUCKET_SIZE, windowStart: now };
    buckets.set(key, b);
  }
  return b.tokens > 0;
}

export function recordRequest(key, opts) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now - b.windowStart >= WINDOW_MS) {
    b = { tokens: BUCKET_SIZE, windowStart: now };
    buckets.set(key, b);
  }
  if (opts?.peekOnly) {
    const elapsed = now - b.windowStart;
    return Math.ceil((WINDOW_MS - elapsed) / 1000);
  }
  if (b.tokens > 0) b.tokens -= 1;
  const elapsed = now - b.windowStart;
  return Math.ceil((WINDOW_MS - elapsed) / 1000);
}
`;

  const { gradedPrompts, overallScores, summary } = gradeSubmissionPackage({
    promptTrail: DEMO_PROMPTS,
    testPassed: true,
    filesChanged: 1,
  });

  const submission: StudioSubmission = {
    id: 'sub-demo-nebula',
    roleId: DEMO_ASSESSMENT_ROLE_ID,
    companyName: 'Nebula Analytics',
    taskTitle: 'Work Ticket: Rate Limiter API',
    taskBrief: 'Add token-bucket rate limiting before beta traffic.',
    candidateName: 'Alex Chen (demo)',
    submittedAt: new Date(Date.now() - 120000).toISOString(),
    files,
    starterFiles,
    promptTrail: DEMO_PROMPTS,
    terminalLog: '> npm test\nPASS: rate limit engaged after 10 requests',
    testOutput: 'PASS: rate limit engaged after 10 requests',
    testPassed: true,
    overallScores,
    gradedPrompts,
    summary,
  };

  saveSubmission(submission);

  addApplication({
    roleId: DEMO_ASSESSMENT_ROLE_ID,
    displayName: submission.candidateName,
    profileSlug: 'demo-alex-chen',
    thinking: overallScores.thinking,
    shipping: overallScores.shipping,
    shipTestTitle: submission.taskTitle,
    status: 'strong',
    submissionId: submission.id,
  });

  return submission;
}
