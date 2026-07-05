#!/usr/bin/env node
/**
 * Scout loop harness: scores heuristicExtract() against the frozen gold set.
 *
 * Prints one number (F1) plus precision/recall. The agent's job is to make
 * this number go up by editing scripts/interview-intel/extract.mjs ONLY.
 *
 * Usage:
 *   node research/eval-extract.mjs            # train split (agent uses this)
 *   node research/eval-extract.mjs --held-out # human-only final check
 *
 * DO NOT MODIFY this file or research/gold/* during a loop run.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const goldPath = join(here, 'gold', 'extract-gold.json');

if (!existsSync(goldPath)) {
  console.error('No gold set. Run: node research/make-gold-template.mjs, then label it.');
  process.exit(1);
}

const { heuristicExtract } = await import('../scripts/interview-intel/extract.mjs');

const heldOut = process.argv.includes('--held-out');
const gold = JSON.parse(readFileSync(goldPath, 'utf8'));
const docs = gold.docs.filter((d) => (heldOut ? d.split === 'held-out' : d.split === 'train'));

if (docs.length === 0) {
  console.error(`Gold set has no ${heldOut ? 'held-out' : 'train'} docs.`);
  process.exit(1);
}

// Match on normalized text overlap: a predicted question counts as a hit if
// it shares >=70% of its normalized tokens with a gold question (order-free).
const normalize = (s) =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

function tokenOverlap(a, b) {
  const ta = new Set(normalize(a).split(' '));
  const tb = new Set(normalize(b).split(' '));
  if (ta.size === 0 || tb.size === 0) return 0;
  let common = 0;
  for (const t of ta) if (tb.has(t)) common += 1;
  return common / Math.min(ta.size, tb.size);
}

let tp = 0;
let fp = 0;
let fn = 0;
let kindHits = 0;
let kindTotal = 0;
const falsePositives = [];
const misses = [];

for (const doc of docs) {
  const ex = heuristicExtract({ ...doc, meta: doc.meta ?? {} });
  const predicted = ex?.questions ?? [];
  const goldQs = doc.goldQuestions ?? [];
  const matchedGold = new Set();

  for (const p of predicted) {
    let best = -1;
    let bestScore = 0;
    goldQs.forEach((g, i) => {
      if (matchedGold.has(i)) return;
      const s = tokenOverlap(p.text, g.text);
      if (s > bestScore) {
        bestScore = s;
        best = i;
      }
    });
    if (bestScore >= 0.7) {
      tp += 1;
      matchedGold.add(best);
      kindTotal += 1;
      if (predicted && goldQs[best].kind === p.kind) kindHits += 1;
    } else {
      fp += 1;
      if (falsePositives.length < 8) falsePositives.push({ doc: doc.id, text: p.text });
    }
  }
  goldQs.forEach((g, i) => {
    if (!matchedGold.has(i)) {
      fn += 1;
      if (misses.length < 8) misses.push({ doc: doc.id, text: g.text });
    }
  });
}

const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
const kindAcc = kindTotal === 0 ? 0 : kindHits / kindTotal;

console.log(`split:      ${heldOut ? 'held-out' : 'train'} (${docs.length} docs)`);
console.log(`precision:  ${precision.toFixed(3)}  (${tp} tp / ${fp} fp)`);
console.log(`recall:     ${recall.toFixed(3)}  (${fn} missed)`);
console.log(`kind acc:   ${kindAcc.toFixed(3)}  (of matched)`);
console.log(`F1:         ${f1.toFixed(4)}   <- THE METRIC`);

if (process.argv.includes('--verbose')) {
  if (falsePositives.length) {
    console.log('\nSample false positives (extracted but not real questions):');
    for (const x of falsePositives) console.log(`  [${x.doc}] ${x.text.slice(0, 110)}`);
  }
  if (misses.length) {
    console.log('\nSample misses (gold questions not extracted):');
    for (const x of misses) console.log(`  [${x.doc}] ${x.text.slice(0, 110)}`);
  }
}
