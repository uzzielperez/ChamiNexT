#!/usr/bin/env node
/**
 * Build content/lessons/manifest.json from skill-tree.json.
 * Each leaf gets a TTS-ready script from its label + fundamentals.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const tree = JSON.parse(readFileSync(join(root, 'content/fundamentals/skill-tree.json'), 'utf8'));

const entries = [];

for (const [trackId, meta] of Object.entries(tree.tracks)) {
  for (const branch of meta.branches) {
    for (const leaf of branch.leaves) {
      const bullets = leaf.fundamentals.map((f) => f).join('. ');
      const script = [
        `Today's skill: ${leaf.label}.`,
        `Here's what interviewers look for.`,
        bullets,
        `Practice this on the tree, then run a mock or drill on ${leaf.domains.join(' and ')} problems.`,
        `Reflect: where did you last use this in real work?`,
      ].join(' ');

      entries.push({
        leafId: leaf.id,
        track: trackId,
        title: leaf.label,
        scriptVersion: 1,
        script,
      });
    }
  }
}

const outDir = join(root, 'content/lessons');
mkdirSync(outDir, { recursive: true });
const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  lessonCount: entries.length,
  lessons: entries,
};

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Wrote ${entries.length} lesson scripts to content/lessons/manifest.json`);
