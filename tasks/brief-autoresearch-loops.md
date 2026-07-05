# Brief: Autoresearch Loops for ChamiNexT

> **Read this when:** deciding what the agents should work on overnight, or when
> tempted to "automate product improvement" without a metric.
> **Pattern source:** [karpathy/autoresearch](https://github.com/karpathy/autoresearch)
> **Related:** `tasks/pitch-deck-chaminext.md` (v1.1, Slide 17 test plan),
> `tasks/learnings-interview-intel.md`, `PRODUCT.md`

## The pattern (why autoresearch works)

Karpathy's setup succeeds because of three brutal constraints:

1. **One fixed metric** (`val_bpb`) computed by a script in minutes — no human in the loop.
2. **One file the agent edits** (`train.py`); the harness (`prepare.py`) is frozen.
3. **Fixed budget per experiment** (5 min) → ~100 keep-or-discard cycles overnight.

We can copy this **only for the parts of ChamiNexT with a computable metric.**
Everything else gets a weekly human-gated loop, not an overnight one. Do not
fake it: an LLM judging its own output is Goodhart, not research.

## Metric hierarchy (don't lie to yourself)

| Level | Metric | Autoresearch-able? |
|-------|--------|--------------------|
| North star | Verified interviews booked from profiles | No — needs users |
| Business | Free→paid conversion, retention | No — needs traffic; weekly A/B at best |
| **Product internals** | **Scoring fidelity, extraction F1, grading accuracy** | **Yes — tonight** |

Two internal metrics are already committed to in the pitch deck (Slide 17,
Bedrock test plan): **<10% score variance on replay** and **≥0.75 correlation
with human-labeled gold sets**. That test plan IS the eval harness spec.

## The three runnable loops

### 1. Examiner loop — scoring fidelity (highest value)
- **Gold set:** ~30 interview transcripts, hand-scored once by me. Frozen. Split train/held-out.
- **Agent edits:** interviewer/scoring prompts in `netlify/functions/interview-agent.js` only.
- **Harness:** replay transcripts → correlation with my labels + variance across 3 replays.
- **Metric:** `correlation − λ·variance`. The rubric is the product; this loop improves the product core.

### 2. Scout loop — intel extraction (build first, cheapest)
- **Gold set:** ~30 of the 238 cached scraped docs, labeled (which sentences are
  real interview questions + kind/stage).
- **Agent edits:** `scripts/interview-intel/extract.mjs` only.
- **Harness:** precision/recall → **F1**.
- **Why first:** lowest labeling cost, simplest harness, proves the pattern in a day.
  (We hand-tuned those regexes for hours in July 2026 — this does it while sleeping.)

### 3. Drill-grader loop — grading accuracy
- **Gold set:** answers labeled strong/partial/miss.
- **Agent edits:** grading prompt in `netlify/functions/drill-agent.js` only.
- **Metric:** agreement with labels.

## Agent roster (name → cadence → metric)

| Agent | Owns | Cadence | Metric / judge |
|-------|------|---------|----------------|
| **Examiner** (Science & Tech) | Loop 1 | Overnight, autonomous | Gold-set correlation + replay variance |
| **Scout** (Science & Tech) | Loop 2 | Overnight, autonomous | Extraction F1 vs gold labels |
| **Question Smith** (optional later) | Loop 3 + bank quality | Overnight | Agreement with labeled answers |
| **Market Engineer** | Conversion/copy experiments | **Weekly, human-gated** | Real analytics only. No traffic → no loop. Proposes ONE A/B change per week |
| **Pitcher** | Deck, outreach copy | **On demand** | Human reactions (Tom, angels). No computable metric exists; LLM-judged "pitch score" optimizes for what an LLM likes |

## Goodhart rules (non-negotiable)

1. The agent that edits a prompt **never touches the judge or the gold set**.
2. Gold sets are hand-labeled by me, frozen, and split — held-out portion the
   agent never sees (train/val discipline).
3. If a metric can be gamed by verbosity, formatting, or self-agreement, it is
   not a metric. Fix the harness before running the loop.
4. New gold labels only between loop runs, never during.

## Repo structure (mirrors autoresearch)

```
research/
  program.md        ← the org file I edit (which agent, which file it may
                       touch, metric, budget) — equivalent of karpathy's program.md
  gold/             ← frozen labeled sets (transcripts, docs, answers)
  eval-extract.mjs  ← prints one number (F1)
  eval-scoring.mjs  ← prints one number (correlation − λ·variance)
  log.md            ← experiment log the agent appends to
```

Agent contract per cycle (identical to autoresearch): edit the one allowed
file → run the eval → keep if the number improves, revert if not → log → repeat.

## Prototype changes for v1.1 (separate from loops, do by hand)

1. **"AI for Science" skill-tree track** — experiment design, stats hygiene,
   reproducibility, domain data. Config + content in
   `content/fundamentals/skill-tree.json`; infrastructure already exists.
2. **Mission-org intel sources** — add frontier-science orgs to
   `scripts/interview-intel/sources.json`.
3. **Frontier-science landing copy** — per pitch-deck v1.1 copy split
   (mission-forward on home/founder story, neutral on employer surfaces).

Note the flywheel: the AI-for-Science rubric ("did they catch the leakage?")
and the Examiner's gold set are the same artifact — building one improves the other.

## Sequencing

1. **Scout loop** (a day: label 30 docs, write `eval-extract.mjs`, run overnight).
2. **Examiner loop** (needs ~30 hand-scored transcripts from me — the real cost).
3. AI-for-Science track + mission intel sources (by hand, feeds gold sets).
4. Drill-grader loop.
5. Market Engineer weekly loop — **only after real traffic exists.**

## Refresh loops vs metric loops (added July 5)

Two different things both get called "loops" — don't confuse them:

| | Refresh loop (cron) | Metric loop (autoresearch) |
|--|--------------------|-----------------------------|
| What repeats | Data collection | Keep-or-discard code edits |
| Judge | None — newer data wins | Frozen gold set + eval number |
| Examples | **Jobs board** (`.github/workflows/refresh-jobs.yml`, 2x/week), intel scrape | Scout, Examiner, Drill-grader |

The jobs board (`/jobs`, `scripts/jobs/`) is a refresh loop. A future
**Matchmaker** metric loop on top of it would need a labeled gold set of
(profile, job) pairs judged good/bad matches — only worth building once real
users generate application outcomes. Until then, track inference + the mission
flag are simple heuristics, deliberately not "optimized" against anything.

## The one-sentence version

Autoresearch the parts with a number (rubric fidelity, extraction F1); keep
humans as the judge for the parts without one (pitch, conversion, mission).
