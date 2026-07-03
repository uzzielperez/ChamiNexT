---
name: skill-tree-gap-analysis
description: Analyze ChamiNext fundamentals skill-tree coverage against the question bank and field-report signals; output a gap report with prioritized new problems. Use for monthly skill-tree review, coverage check, quant/AI/SWE fundamentals gaps, or before expanding the question bank.
disable-model-invocation: true
---

# Skill Tree Gap Analysis

Compares the curated fundamentals tree to what exists in the product and what field reports demand.

## Source files (read only)

- `content/fundamentals/skill-tree.json` — canonical tree (do not regenerate)
- `content/question-bank/manifest.json` — static bank coverage by domain
- `tasks/signals/export.json` — optional field reports export
- Latest `tasks/signals/interview-signals-*.md` — if present

## Workflow

```
- [ ] 1. Run `node scripts/skill-tree-coverage.mjs` and capture output
- [ ] 2. Map field-report domains and weak areas to tree nodes
- [ ] 3. List uncovered or under-covered nodes (priority: quant → ai-engineer → software)
- [ ] 4. Propose at most 3 new problems (titles + domains only) — do not bulk-generate
- [ ] 5. Write gap report; do not edit question bank unless user says "implement"
```

## Output

Write `tasks/signals/skill-tree-gaps-[YYYY-MM-DD].md`:

```markdown
# Skill tree gaps — [YYYY-MM-DD]

## Coverage summary
[paste script summary]

## Field-signal pressure
[domains / struggles from export or signals digest]

## Gaps (prioritized)
1. [track].[node] — [why] — propose: [problem title sketch]

## Recommended actions (max 3)
- [ ] ...
```

## Rules

- Never rewrite `skill-tree.json` in an automated run without explicit user approval.
- Max 3 proposed problems per run (token discipline).
- Quant track gaps are first-class even if the app UI track is still `software` / `ai-engineer`.
