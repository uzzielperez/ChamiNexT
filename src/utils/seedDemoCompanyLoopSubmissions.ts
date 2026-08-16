import type { PromptRecord, StudioSubmission } from '../types/studioSubmission';
import { getCompanyLoops } from '../data/loadCompanyLoops';
import { saveSubmission } from './studioSubmissionStorage';
import { gradeSubmissionPackage, enrichSubmissionWithAssessment } from './submissionGrader';
import type { CandidateApplication } from '../types/employer';
import { loadApplications, saveApplications } from './employerStorage';
import { filesToMap, RATE_LIMITER_WORKSPACE } from '../data/workspaceTemplates';
import { shipTestChallenges } from '../data/shipTests';

const DEMO_CANDIDATES: Record<
  string,
  { name: string; slug: string; quizScore: number; status: 'strong' | 'review' | 'hold' }
> = {
  'loop-pulse': { name: 'Mia Torres (demo)', slug: 'demo-mia-torres', quizScore: 100, status: 'strong' },
  'loop-meridian': { name: 'Raj Patel (demo)', slug: 'demo-raj-patel', quizScore: 67, status: 'review' },
  'loop-searchco': { name: 'Alex Chen (demo)', slug: 'demo-alex-chen', quizScore: 100, status: 'strong' },
  'loop-socialgraph': { name: 'Jordan K. (demo)', slug: 'demo-jordan-k', quizScore: 50, status: 'hold' },
  'loop-constellation': { name: 'Elena Wu (demo)', slug: 'demo-elena-wu', quizScore: 100, status: 'strong' },
  'loop-frontier': { name: 'Sam P. (demo)', slug: 'demo-sam-p', quizScore: 100, status: 'review' },
};

function promptsForLoop(loopId: string): PromptRecord[] {
  const base = Date.now() - 600000;
  const texts: Record<string, string[]> = {
    'loop-pulse': [
      'Review my token bucket approach before I wire Retry-After',
      'Should sliding window or token bucket for per-IP limits on POST /api/echo?',
      'agent What edge cases for concurrent requests on the same IP?',
      'I used AI for test scaffolding — how do I verify bucket reset after 60s?',
    ],
    'loop-meridian': [
      'Sanity check: does my point-in-time filter avoid look-ahead?',
      'agent How many charts is too many for a trading signal report?',
      'Walk me through validating feature timestamps vs label cutoffs',
    ],
    'loop-searchco': [
      'Hash map vs trie for this API — tradeoffs at L4 scope?',
      'agent How would you test rate limit behavior under burst traffic?',
      'I will disclose AI help on tests in the submission package',
    ],
    'loop-socialgraph': [
      'Production-minded: what metrics should I log on 429 responses?',
      'agent How to simulate partition behavior in unit tests?',
      'Disclose AI use on linter tests — verify Retry-After header',
    ],
    'loop-constellation': [
      'Define eval metrics before coding the limiter — failure modes?',
      'agent How to test for train/validation leakage in this ticket context',
      'I used AI for boilerplate — verifying token refill logic manually',
    ],
    'loop-frontier': [
      'Work-trial framing: defend token bucket vs fixed window',
      'agent What would you probe in a live defense of this change?',
      'Disclosing AI on tests — show verification steps in PR narrative',
    ],
  };
  const lines = texts[loopId] ?? texts['loop-pulse'];
  return lines.map((text, i) => ({
    id: `demo-${loopId}-p${i + 1}`,
    at: new Date(base + i * 90000).toISOString(),
    source: i % 2 === 0 ? 'panel' : 'terminal',
    text,
    activeFile: i < 2 ? 'src/rateLimiter.ts' : 'tests/rateLimiter.test.ts',
  })) as PromptRecord[];
}

export function seedDemoCompanyLoopSubmissions(): StudioSubmission[] {
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

  const out: StudioSubmission[] = [];
  const loopEntries: CandidateApplication[] = [];
  const demoLoopIds = getCompanyLoops().map((l) => l.id);

  for (const loop of getCompanyLoops()) {
    const demo = DEMO_CANDIDATES[loop.id];
    if (!demo) continue;

    const promptTrail = promptsForLoop(loop.id);
    const workStage = loop.stages.find((s) => s.id === 'work-ticket');
    const shipChallenge = workStage?.shipTestId
      ? shipTestChallenges.find((c) => c.id === workStage.shipTestId)
      : undefined;
    const taskTitle = shipChallenge?.title ?? 'Work Ticket';

    const { gradedPrompts, overallScores, summary } = gradeSubmissionPackage({
      promptTrail,
      testPassed: true,
      filesChanged: 1,
    });

    const submission = enrichSubmissionWithAssessment({
      id: `sub-demo-${loop.id}`,
      roleId: loop.id,
      companyLoopId: loop.id,
      companyName: loop.placeholderName,
      taskTitle,
      taskBrief: workStage?.summary ?? loop.tagline,
      candidateName: demo.name,
      submittedAt: new Date(Date.now() - loop.id.length * 3600000).toISOString(),
      files,
      starterFiles,
      promptTrail,
      terminalLog: '> npm test\nPASS: rate limit engaged after 10 requests',
      testOutput: 'PASS: rate limit engaged after 10 requests',
      testPassed: true,
      overallScores,
      gradedPrompts,
      summary,
      loopQuizScore: demo.quizScore,
      cvSummary: `Demo CV — ${loop.roleTitle} at ${loop.placeholderName}. Impact bullets aligned to loop rubric.`,
      loopStagesCompleted: 4,
    });

    saveSubmission(submission);

    loopEntries.push({
      roleId: loop.id,
      displayName: demo.name,
      profileSlug: demo.slug,
      thinking: overallScores.thinking,
      shipping: overallScores.shipping,
      shipTestTitle: `${loop.roleTitle} · ${taskTitle}`,
      status: demo.status,
      submissionId: submission.id,
      companyLoopId: loop.id,
      appliedAt: submission.submittedAt,
      id: `app-demo-${loop.id}`,
    });

    out.push(submission);
  }

  const kept = loadApplications().filter(
    (a) => !a.companyLoopId || !demoLoopIds.includes(a.companyLoopId)
  );
  saveApplications([...loopEntries, ...kept]);

  return out;
}
