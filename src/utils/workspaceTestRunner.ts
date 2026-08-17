import { runCode } from './codeRunner';

export type WorkspaceTestResult = {
  output: string;
  passed: boolean;
  passedCount: number;
  totalCount: number;
};

/** Strip TS types / exports for Piston JavaScript execution. */
function tsToJs(source: string): string {
  return source
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace(/^export\s+(default\s+)?/gm, '')
    .replace(/:\s*[A-Za-z_][\w<>,[\]| ]*(\s*\|\s*[A-Za-z_][\w<>,[\]| ]*)*(?=\s*[=;,)\{])/g, '')
    .replace(/\bvoid\s+\w+;\s*/g, '');
}

function inferRunLanguage(files: Record<string, string>): 'javascript' | 'python' {
  const paths = Object.keys(files);
  if (paths.some((p) => p.endsWith('.py'))) return 'python';
  return 'javascript';
}

/** Bundle src modules + test files into a single runnable script with a mini test harness. */
export function bundleWorkspaceTests(files: Record<string, string>): string | null {
  const testPaths = Object.keys(files)
    .filter((p) => /\.test\.(ts|js)$/.test(p))
    .sort();

  if (testPaths.length === 0) return null;

  const sourcePaths = Object.keys(files)
    .filter(
      (p) =>
        !/\.test\.(ts|js)$/.test(p) &&
        !p.endsWith('.md') &&
        (p.startsWith('src/') || p.endsWith('.ts') || p.endsWith('.js'))
    )
    .sort((a, b) => a.split('/').length - b.split('/').length);

  const modules = sourcePaths
    .map((p) => `// --- ${p} ---\n${tsToJs(files[p] ?? '')}`)
    .join('\n\n');

  const tests = testPaths
    .map((p) => `// --- ${p} ---\n${tsToJs(files[p] ?? '')}`)
    .join('\n\n');

  return `
${modules}

let __passed = 0;
let __failed = 0;
let __total = 0;
let __currentSuite = '';

function describe(name, fn) {
  __currentSuite = name;
  try { fn(); } catch (e) {
    __failed++;
    __total++;
    console.log('FAIL: ' + name + ' — suite error: ' + e.message);
  }
}

function it(name, fn) {
  __total++;
  try {
    fn();
    __passed++;
    console.log('PASS: ' + __currentSuite + ' › ' + name);
  } catch (e) {
    __failed++;
    console.log('FAIL: ' + __currentSuite + ' › ' + name + ' — ' + e.message);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error('expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error('expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
      }
    },
    toBeTruthy() {
      if (!actual) throw new Error('expected truthy, got ' + JSON.stringify(actual));
    },
    toBeFalsy() {
      if (actual) throw new Error('expected falsy, got ' + JSON.stringify(actual));
    },
  };
}

${tests}

console.log('');
console.log('---');
console.log(__failed === 0
  ? 'PASS: ' + __passed + '/' + __total + ' tests'
  : 'FAIL: ' + __passed + '/' + __total + ' passed, ' + __failed + ' failed');
`.trim();
}

export async function runWorkspaceTests(
  files: Record<string, string>,
  fallbackBundle?: (files: Record<string, string>) => string
): Promise<WorkspaceTestResult> {
  const bundled = bundleWorkspaceTests(files);
  const lang = inferRunLanguage(files);

  if (!bundled) {
    if (!fallbackBundle) {
      return { output: 'No test files found in workspace.', passed: false, passedCount: 0, totalCount: 0 };
    }
    const code = fallbackBundle(files);
    const result = await runCode(code, lang);
    const output = result.success
      ? result.stdout || '(no output)'
      : `${result.stderr}\nexit ${result.exitCode}`;
    const passed = /PASS:/i.test(output) && !/FAIL:/i.test(output);
    return { output, passed, passedCount: passed ? 1 : 0, totalCount: 1 };
  }

  const result = await runCode(bundled, 'javascript');
  const output = result.success
    ? result.stdout || '(no output)'
    : `${result.stderr}\n${result.stdout}\nexit ${result.exitCode}`;

  const summaryMatch = output.match(/(\d+)\/(\d+)/);
  const passedCount = summaryMatch ? Number(summaryMatch[1]) : 0;
  const totalCount = summaryMatch ? Number(summaryMatch[2]) : 0;
  const passed = /PASS:\s*\d+\/\d+\s*tests/i.test(output) && !/FAIL:/i.test(output);

  return { output, passed, passedCount, totalCount };
}
