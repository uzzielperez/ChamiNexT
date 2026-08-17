import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/** Inline mirror of bundleWorkspaceTests for unit smoke (see src/utils/workspaceTestRunner.ts). */
function bundleWorkspaceTests(files) {
  const testPaths = Object.keys(files).filter((p) => /\.test\.(ts|js)$/.test(p)).sort();
  if (testPaths.length === 0) return null;
  const sourcePaths = Object.keys(files).filter(
    (p) => !/\.test\.(ts|js)$/.test(p) && !p.endsWith('.md') && p.startsWith('src/')
  );
  return `${sourcePaths.map((p) => files[p]).join('\n')}\n${testPaths.map((p) => files[p]).join('\n')}`;
}

describe('workspace test bundling', () => {
  it('includes source and test files when tests present', () => {
    const files = {
      'src/rateLimiter.ts': 'export function checkRateLimit() { return true; }',
      'tests/rateLimiter.test.ts': "describe('x', () => it('y', () => {}));",
    };
    const bundled = bundleWorkspaceTests(files);
    assert.ok(bundled?.includes('checkRateLimit'));
    assert.ok(bundled?.includes("describe('x'"));
  });

  it('returns null without test files', () => {
    assert.equal(bundleWorkspaceTests({ 'src/foo.js': 'x' }), null);
  });
});
