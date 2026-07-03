#!/usr/bin/env node
/**
 * Prints skill-tree leaf coverage vs question-bank manifest domains.
 * Usage: node scripts/skill-tree-coverage.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tree = JSON.parse(readFileSync(join(root, 'content/fundamentals/skill-tree.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'content/question-bank/manifest.json'), 'utf8'));

const domainsByTrack = {
  software: new Set(manifest.software.map((p) => p.domain)),
  quant: new Set((manifest.quant || []).map((p) => p.domain)),
  cybersecurity: new Set((manifest.cybersecurity || []).map((p) => p.domain)),
  'ai-engineer': new Set(manifest.aiEngineer.map((p) => p.domain)),
  'market-engineering': new Set(manifest.marketEngineering.map((p) => p.domain)),
};

const domainOwners = {
  software: domainsByTrack.software,
  quant: domainsByTrack.quant,
  cybersecurity: domainsByTrack.cybersecurity,
  'ai-engineer': domainsByTrack['ai-engineer'],
};

let covered = 0;
let total = 0;
const gaps = [];

for (const [trackId, track] of Object.entries(tree.tracks)) {
  const owned = domainOwners[trackId] || new Set();
  console.log(`\n## ${track.label} (${trackId})`);
  console.log(`  root: ${track.root.label}`);
  for (const branch of track.branches) {
    console.log(`  branch: ${branch.label}`);
    for (const leaf of branch.leaves) {
      total += 1;
      const hit = leaf.domains.some((d) => owned.has(d));
      if (hit) covered += 1;
      else gaps.push({ track: trackId, branch: branch.id, leaf: leaf.id, label: leaf.label, domains: leaf.domains });
      const status = hit ? 'OK' : 'GAP';
      console.log(`    [${status}] ${leaf.id} — domains: ${leaf.domains.join(', ')}`);
    }
  }
}

const pct = total ? Math.round((covered / total) * 100) : 0;
console.log(`\n--- Summary: ${covered}/${total} leaves have bank coverage (${pct}%) ---`);
if (gaps.length) {
  console.log('\nUncovered leaves:');
  gaps.forEach((g) => console.log(`  - ${g.track}.${g.branch}.${g.leaf} (${g.label})`));
}
