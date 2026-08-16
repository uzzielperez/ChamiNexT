import type { WorkspaceTemplate } from '../components/workspace/workspaceTypes';
import type { PracticeProblem } from '../types/interview';
import type { ShipTestChallenge } from '../types/interview';

const RATE_LIMITER_FILES: WorkspaceTemplate['files'] = [
  {
    path: 'README.md',
    language: 'markdown',
    content: `# PLAT-1842 — Rate limiter

Add token-bucket rate limiting for \`POST /api/echo\`.

## Run in browser studio
\`\`\`bash
npm test    # run unit tests in sandbox
run         # execute bundled sandbox
help        # terminal commands
\`\`\`

## Acceptance
- 10 req/min per client IP
- 429 + Retry-After when limited
- Tests for limiter logic
`,
  },
  {
    path: 'src/server.ts',
    language: 'typescript',
    content: `/**
 * Express-style handler sketch — implement limiter in rateLimiter.ts
 */
import { checkRateLimit, recordRequest } from './rateLimiter';

export function handleEcho(req: { ip: string; body: string }) {
  const key = req.ip;
  if (!checkRateLimit(key)) {
    const retryAfter = recordRequest(key, { peekOnly: true });
    return { status: 429, headers: { 'Retry-After': String(retryAfter) }, body: 'Too Many Requests' };
  }
  recordRequest(key);
  return { status: 200, body: req.body };
}
`,
  },
  {
    path: 'src/rateLimiter.ts',
    language: 'typescript',
    content: `/**
 * Token bucket — 10 requests per 60s per key (IP).
 * TODO: implement checkRateLimit + recordRequest
 */
const BUCKET_SIZE = 10;
const WINDOW_MS = 60_000;

type BucketState = { tokens: number; windowStart: number };

const buckets = new Map<string, BucketState>();

export function checkRateLimit(key: string): boolean {
  // Stub: always allow — replace with real token bucket
  return true;
}

export function recordRequest(
  key: string,
  opts?: { peekOnly?: boolean }
): number {
  void key;
  void opts;
  return 60;
}
`,
  },
  {
    path: 'tests/rateLimiter.test.ts',
    language: 'typescript',
    content: `import { checkRateLimit, recordRequest } from '../src/rateLimiter';

describe('rateLimiter', () => {
  it('allows first request', () => {
    expect(checkRateLimit('1.2.3.4')).toBe(true);
    recordRequest('1.2.3.4');
  });

  it('blocks after bucket exhausted', () => {
    const ip = '9.9.9.9';
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(ip)).toBe(true);
      recordRequest(ip);
    }
    expect(checkRateLimit(ip)).toBe(false);
  });
});
`,
  },
  {
    path: 'sandbox/run.js',
    language: 'javascript',
    content: `// Bundled by studio on "run" — quick smoke check
console.log('ChamiNexT studio sandbox');
console.log('Edit src/rateLimiter.ts then: npm test');
`,
  },
];

function bundleRateLimiter(files: Record<string, string>): string {
  const limiter = files['src/rateLimiter.ts'] ?? '';
  const jsBody = limiter
    .replace(/export function/g, 'function')
    .replace(/export const/g, 'const')
    .replace(/: boolean/g, '')
    .replace(/: number/g, '')
    .replace(/: string/g, '')
    .replace(/opts\?: \{ peekOnly\?: boolean \}/g, 'opts')
    .replace(/void \w+;\s*/g, '');

  return `${jsBody}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

// Smoke tests (mirrors tests/rateLimiter.test.ts intent)
const ip = '9.9.9.9';
assert(checkRateLimit(ip) === true, 'first check');
recordRequest(ip);
for (let i = 0; i < 9; i++) {
  assert(checkRateLimit(ip) === true, 'within bucket ' + i);
  recordRequest(ip);
}
const blocked = checkRateLimit(ip) === false;
console.log(blocked ? 'PASS: rate limit engaged after 10 requests' : 'FAIL: limiter still allowing (implement token bucket)');
if (!blocked) {
  console.log('Hint: track tokens per key in a Map with 60s window');
}
`;
}

export const RATE_LIMITER_WORKSPACE: WorkspaceTemplate = {
  id: 'rate-limiter',
  title: 'Work Ticket: Rate Limiter API',
  subtitle: 'PLAT-1842 · Interview Studio sandbox',
  ticketBrief:
    'Add token-bucket rate limiting for POST /api/echo — 10 req/min per IP, 429 + Retry-After, tests.',
  pmBrief:
    'Platform needs per-IP rate limiting before beta traffic. Ship reviewed code with tests — AI assistants allowed (disclose prompts).',
  files: RATE_LIMITER_FILES,
  entryPath: 'src/rateLimiter.ts',
  runLanguage: 'javascript',
  bundleForRun: bundleRateLimiter,
};

export const WORKSPACE_TEMPLATES: Record<string, WorkspaceTemplate> = {
  [RATE_LIMITER_WORKSPACE.id]: RATE_LIMITER_WORKSPACE,
};

export function getWorkspaceTemplate(id: string): WorkspaceTemplate | undefined {
  return WORKSPACE_TEMPLATES[id];
}

export function filesToMap(files: WorkspaceTemplate['files']): Record<string, string> {
  return Object.fromEntries(files.map((f) => [f.path, f.content]));
}

export function mapToFiles(map: Record<string, string>, languages: Record<string, string>): WorkspaceTemplate['files'] {
  return Object.entries(map).map(([path, content]) => ({
    path,
    content,
    language: languages[path] ?? inferLanguage(path),
  }));
}

function inferLanguage(path: string): string {
  if (path.endsWith('.ts')) return 'typescript';
  if (path.endsWith('.js')) return 'javascript';
  if (path.endsWith('.py')) return 'python';
  if (path.endsWith('.md')) return 'markdown';
  return 'plaintext';
}

export function workspaceFromProblem(problem: PracticeProblem): WorkspaceTemplate {
  const ext = problem.runLanguage === 'python' ? 'py' : 'js';
  const solutionPath = `src/solution.${ext}`;
  const lang = problem.runLanguage ?? 'javascript';

  return {
    id: `practice-${problem.id}`,
    title: problem.title,
    subtitle: `${problem.track} · ${problem.difficulty}`,
    pmBrief: problem.prompt.slice(0, 280),
    files: [
      {
        path: 'README.md',
        language: 'markdown',
        content: `# ${problem.title}\n\n${problem.prompt}\n\nRun: \`run\` in terminal · Agent: side panel or \`agent <question>\``,
      },
      {
        path: solutionPath,
        language: lang,
        content: problem.starterCode,
      },
    ],
    entryPath: solutionPath,
    runLanguage: lang === 'python' ? 'python' : lang === 'typescript' ? 'javascript' : 'javascript',
    bundleForRun: (files) => files[solutionPath] ?? '',
  };
}

export function workspaceForChallenge(challenge: ShipTestChallenge): WorkspaceTemplate {
  const base = challenge.id === 'work-ticket-rate-limiter'
    ? RATE_LIMITER_WORKSPACE
    : {
        ...RATE_LIMITER_WORKSPACE,
        files: RATE_LIMITER_WORKSPACE.files.map((f) => ({ ...f })),
      };

  return {
    ...base,
    id: challenge.id,
    title: challenge.title,
    ticketBrief: challenge.ticketBrief ?? challenge.description,
    pmBrief: challenge.pmBrief,
    subtitle: challenge.format === 'ticket' ? 'Work Ticket · browser studio' : base.subtitle,
  };
}
