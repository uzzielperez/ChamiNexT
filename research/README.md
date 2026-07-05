# ChamiNexT Autoresearch Loops

Autonomous keep-or-discard experiment loops, modeled on
[karpathy/autoresearch](https://github.com/karpathy/autoresearch).
Strategy and metric rationale: `tasks/brief-autoresearch-loops.md`.

The contract (identical to autoresearch): an agent edits **one allowed file**,
runs the eval, **keeps the change if the metric improves, reverts if not**,
logs the experiment, and repeats. The harness, gold sets, and this folder are
frozen during a run.

```
research/
  README.md               <- you are here (human instructions)
  program.md              <- agent instructions; the file the HUMAN iterates on
  gold/                   <- frozen hand-labeled sets (never edited by agents)
    extract-gold.json     <- Scout loop gold set
  eval-extract.mjs        <- Scout harness: prints F1
  make-gold-template.mjs  <- one-time gold-set bootstrapper
  log.md                  <- experiment log (agents append, humans read)
```

## Loop 1 — Scout (intel extraction quality) — READY TO SET UP

**Agent edits:** `scripts/interview-intel/extract.mjs` only (the
`heuristicExtract` function and its regexes/helpers).
**Metric:** F1 on the train split of `gold/extract-gold.json`.
**Final judge:** F1 on the held-out split (human runs this once, at the end).

### One-time setup (~1 hour, mostly labeling)

1. Refresh the scrape cache first: `npm run intel:scrape` (run it twice ~10 min
   apart to backfill PullPush rate-limit gaps). The cache drifts between runs —
   the gold set is the thing that freezes ground truth, so build it from a
   full cache.
2. Generate the gold template (pre-filled with current extractor output):

```bash
node research/make-gold-template.mjs --count 30
```

3. **Label it by hand** — open `research/gold/extract-gold.json` and for each doc:
   - delete `goldQuestions` entries that are NOT real interview questions;
   - read `text` and ADD real questions the extractor missed;
   - fix wrong `kind` values (`coding | system-design | behavioral | recruiter | take-home | domain-knowledge`);
   - set `"labeled": true`.
   Do NOT change `split` assignments. Once done, the file is **frozen**.
4. Sanity-check the harness:

```bash
node research/eval-extract.mjs            # train F1 (agent's number)
node research/eval-extract.mjs --verbose  # + sample false positives / misses
```

### Running the loop (overnight)

Open a fresh agent session in this repo (Cursor agent, `cursor-agent` CLI, or
similar) and prompt:

```
Read research/program.md and run the Scout loop. Work autonomously;
do not stop to ask questions.
```

Or headless from the terminal:

```bash
cursor-agent -p "Read research/program.md and run the Scout loop autonomously." &
```

The agent will cycle: edit `extract.mjs` → `node research/eval-extract.mjs` →
keep or revert → append to `research/log.md`.

### Morning after

```bash
git diff scripts/interview-intel/extract.mjs   # what changed
cat research/log.md                            # what was tried, what stuck
node research/eval-extract.mjs --held-out      # THE verdict (agent never saw this)
```

Accept the changes only if **held-out F1** improved — train F1 alone can be
overfit to the gold set. Then regenerate intel to see the effect on the product:

```bash
npm run intel:extract
```

## Loop 2 — Examiner (scoring fidelity) — NEEDS GOLD SET

**Agent edits:** prompt constants in `netlify/functions/interview-agent.js`
(CHAT_PROTOCOL, SOFT_PROTOCOL, SCORE_RUBRIC, TRACK_FOCUS, SOFT_FOCUS).
**Metric:** `correlation with human scores − λ·(replay variance)`, λ = 0.5.
**Blocked on:** ~30 interview transcripts hand-scored once (do sessions,
export from localStorage, score them in `gold/scoring-gold.json`). Requires
`GROQ_API_KEY` to replay. Harness (`eval-scoring.mjs`) gets built when the
gold set exists — not before, to avoid designing against imaginary data.

## Loop 3 — Drill grader — NEEDS GOLD SET

Same pattern: gold answers labeled strong/partial/miss →
`netlify/functions/drill-agent.js` grading prompt → agreement metric.

## Rules (from the brief — non-negotiable)

1. The agent edits ONLY the file its loop allows. Harness, gold sets, and
   `program.md` are off-limits to agents.
2. Held-out split is never run by the agent; it is the human's final check.
3. If the metric can be gamed (verbosity, self-agreement), fix the harness
   before running the loop.
4. New gold labels only between runs, never during.
5. Run loops on a branch (`git checkout -b research/scout-N`) so a bad night
   is one `git branch -D` away.
