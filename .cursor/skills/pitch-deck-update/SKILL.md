---
name: pitch-deck-update
description: Update the ChamiNext pitch deck and one-pagers using the latest market research and interview signals, keeping messaging consistent across artifacts. Use when the user asks to update the pitch deck, refresh the narrative, incorporate new research/signals into the deck, or align decks with the latest data.
disable-model-invocation: true
---

# Pitch Deck Update

Keeps the deck and supporting one-pagers current and internally consistent with the latest evidence.

## Inputs (read these first)

- `tasks/chaminext-market-briefing.md` — latest market facts (esp. newest "What changed this week")
- `tasks/signals/` — latest interview-signals digest, if present
- `tasks/pitch-deck-chaminext.md` — deck content
- `tasks/ApexLabs-onepager.md`, `tasks/ApexLabs.md` — partner/POC artifacts to keep aligned

## Workflow

```
- [ ] 1. Pull the latest market briefing + signals digest
- [ ] 2. Identify which deck claims are now stale, weak, or newly supportable
- [ ] 3. Update deck copy (problem, market, competition, traction, ask)
- [ ] 4. Propagate any changed numbers/claims to the one-pagers
- [ ] 5. List the specific slides changed and why
```

Prioritize updating:
- **Problem / market** slides — new pain stats (e.g. AI-cheating fraud rates)
- **Competition** slide — competitor funding/pivots/pricing
- **Traction** — new field-report volume, companies covered, generated-practice counts
- **Ask** — keep consistent with current partnership/funding stance

## Consistency rules

- Brand spelling: **ChamiNext** everywhere.
- Every quantitative claim must trace to the briefing or signals digest; cite ranges, avoid false precision.
- Keep model/architecture claims **model-agnostic** unless a specific backend is the point.
- If a claim can't be sourced, mark it `[needs source]` rather than asserting it.

## Output

- Edit deck/one-pager markdown in place.
- End with a short changelog:

```markdown
## Deck update — [YYYY-MM-DD]
- Slide [X]: [what changed] (source: [briefing/signals])
```

Offer to regenerate PDFs after edits (the project converts markdown → styled HTML → PDF via headless Chrome).

## Cadence

Run after each weekly research + signals refresh, or on demand before investor/partner conversations.
