#!/usr/bin/env node
/**
 * One-time helper: samples docs from the scrape cache and pre-fills a gold-set
 * template with the CURRENT extractor's output as a starting point.
 *
 * The human then edits research/gold/extract-gold.json by hand:
 *   - delete goldQuestions entries that are NOT real interview questions
 *   - add questions the extractor missed (read fullText)
 *   - fix wrong "kind" values
 *   - leave "split" alone (assigned round-robin: 2/3 train, 1/3 held-out)
 *
 * After labeling, the gold file is FROZEN. Never regenerate over a labeled file.
 *
 * Usage: node research/make-gold-template.mjs [--count 30]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const rawPath = join(root, 'scripts', 'interview-intel', '.cache', 'raw-docs.json');
const goldDir = join(here, 'gold');
const goldPath = join(goldDir, 'extract-gold.json');

if (existsSync(goldPath)) {
  console.error(`${goldPath} already exists. Refusing to overwrite a (possibly labeled) gold set.`);
  console.error('Delete it manually if you really want to start over.');
  process.exit(1);
}
if (!existsSync(rawPath)) {
  console.error('No scrape cache. Run: npm run intel:scrape');
  process.exit(1);
}

const count = process.argv.includes('--count')
  ? Number(process.argv[process.argv.indexOf('--count') + 1])
  : 30;

const { heuristicExtract } = await import('../scripts/interview-intel/extract.mjs');

const rawDocs = JSON.parse(readFileSync(rawPath, 'utf8'));
const relevanceRe = /interview|recruiter|onsite|phone screen|hiring process|offer|behavioral|take.?home/i;
const relevant = rawDocs.filter((d) => relevanceRe.test(`${d.title} ${d.text}`));

// Deterministic spread across the cache; mix docs where the extractor currently
// finds questions with docs where it finds nothing (recall blind spots).
const withHits = [];
const withoutHits = [];
for (const doc of relevant) {
  const ex = heuristicExtract({ ...doc, meta: doc.meta ?? {} });
  (ex?.questions?.length ? withHits : withoutHits).push({ doc, ex });
}
const pickEvery = (arr, n) => {
  if (arr.length <= n) return arr;
  const step = arr.length / n;
  return Array.from({ length: n }, (_, i) => arr[Math.floor(i * step)]);
};
const sample = [
  ...pickEvery(withHits, Math.ceil(count / 2)),
  ...pickEvery(withoutHits, Math.floor(count / 2)),
];

const docs = sample.map(({ doc, ex }, i) => ({
  id: doc.id,
  split: (i + 1) % 3 === 0 ? 'held-out' : 'train',
  source: doc.source,
  url: doc.url,
  title: doc.title,
  // Full text kept so the labeler can find missed questions and the harness
  // can re-run extraction. Do not trim.
  text: doc.text,
  meta: doc.meta ?? {},
  // PRE-FILLED with current extractor output — CORRECT THIS BY HAND.
  goldQuestions: (ex?.questions ?? []).map((q) => ({
    text: q.text,
    kind: q.kind,
  })),
  labeled: false,
}));

if (!existsSync(goldDir)) mkdirSync(goldDir, { recursive: true });
writeFileSync(
  goldPath,
  JSON.stringify(
    {
      createdAt: new Date().toISOString(),
      instructions:
        'For each doc: verify goldQuestions (delete junk, add missed real questions from text, fix kind), then set labeled:true. Kinds: coding | system-design | behavioral | recruiter | take-home | domain-knowledge. When all labeled, the file is FROZEN.',
      docs,
    },
    null,
    2
  )
);

const prefilled = docs.reduce((n, d) => n + d.goldQuestions.length, 0);
console.log(`Wrote ${docs.length} docs (${docs.filter((d) => d.split === 'train').length} train / ${docs.filter((d) => d.split === 'held-out').length} held-out) to ${goldPath}`);
console.log(`${prefilled} pre-filled questions to verify. Now label by hand, then never touch again.`);
