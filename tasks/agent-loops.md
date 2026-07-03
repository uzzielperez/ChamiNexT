# ChamiNext — Agent Loops Runbook

**Purpose:** run autonomous-ish loops without burning tokens. One loop = one artifact.

## Loops

| Loop | Cadence | Skill | Writes to | Stops when |
|------|---------|-------|-----------|------------|
| Market research | Weekly (Mon) | `weekly-market-research` | `tasks/chaminext-market-briefing.md` | No new facts in 5-query diff |
| Interview signals | Weekly (Mon) | `weekly-interview-signals` | `tasks/signals/interview-signals-YYYY-MM-DD.md` | Needs `tasks/signals/export.json` |
| Skill-tree gaps | Monthly | `skill-tree-gap-analysis` | `tasks/signals/skill-tree-gaps-YYYY-MM-DD.md` | Gap report only (no mass codegen) |
| Pitch deck | On demand | `pitch-deck-update` | `tasks/pitch-deck-chaminext.md` | After briefing + signals refresh |
| PoC redesign | On demand | `poc-redesign` | `src/` (small diff) | One user pain per run |

## Token rules

1. **Diff only** — never rewrite whole docs if a section changed.
2. **Read artifacts, not chat** — each run starts from files in `tasks/` and `content/`.
3. **One artifact per automation** — no "build ChamiNext" mega-prompts.
4. **Human gate** — auto research/signals yes; auto merge to main no.

## Data flow

```
Field Reports (app) → Export JSON → weekly-interview-signals
                                      ↓
skill-tree.json + question bank → skill-tree-gap-analysis → new problems (gated)
                                      ↓
market briefing + signals → pitch-deck-update
```

## Export field reports (for signals loop)

1. Open `/field-reports` in the app.
2. Click **Export for signals loop** → saves `tasks/signals/export.json` (download).
3. Commit or paste into `tasks/signals/export.json` before running `weekly-interview-signals`.

## Coverage check (local)

```bash
node scripts/skill-tree-coverage.mjs
```

Prints node coverage vs `content/question-bank/manifest.json`.

## Benchmarks (what we check)

| Layer | Metric | Target |
|-------|--------|--------|
| Skill tree | Nodes with ≥1 bank problem | 100% over time |
| Field validation | Top field domains map to tree nodes | Manual review in signals digest |
| Eval quality | Human–AI score correlation | ≥ 0.6 (aspirational; validate with labeled set) |
| Market | Weekly diff non-empty | Only when market actually moved |
| Loop health | Empty-diff weeks | ~40%+ is fine (cheap weeks) |

Source of truth for tree: `content/fundamentals/skill-tree.json`.

## Cursor Automations (setup)

Create two weekly automations in Cursor (Agents window):

1. **ChamiNext — weekly market** — trigger: schedule Mon 9am — prompt: "Run weekly-market-research skill."
2. **ChamiNext — weekly signals** — trigger: schedule Mon 10am — prompt: "Run weekly-interview-signals skill. Read tasks/signals/export.json if present."

Narrow tools to `tasks/`, `content/`, web search (market only).
