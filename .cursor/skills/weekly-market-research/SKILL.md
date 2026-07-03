---
name: weekly-market-research
description: Run ChamiNext's weekly competitive and market research for AI-era technical hiring (quant, ML, AI-company segments) and update the market briefing. Use when the user asks for a market research run, weekly market update, competitor scan, or to refresh the market briefing.
disable-model-invocation: true
---

# Weekly Market Research

Refreshes ChamiNext's view of the technical-hiring market and updates the living briefing.

## Source of truth

- Update: `tasks/chaminext-market-briefing.md` (the canonical briefing)
- Cross-reference: `tasks/chaminext-discovery-gtm-strategy.md` (strategy), `tasks/pitch-deck-chaminext.md` (deck)

## Workflow

```
- [ ] 1. Re-run searches across the 5 themes below (use current year in queries)
- [ ] 2. Diff findings against the existing briefing — flag what CHANGED
- [ ] 3. Update the briefing in place; keep prior structure
- [ ] 4. Append a dated "What changed this week" entry at the top of the briefing
- [ ] 5. Surface 2-3 implications for strategy / deck / PoC
```

**Step 1 — Search themes** (one focused query each):
1. AI-cheating / interview-integrity crisis (new stats, tools, employer reactions)
2. Competitor moves (Dex, Mercor, Humanly, Fika, HackerRank, CodeSignal, Karat) — funding, pivots, pricing
3. How target segments hire (quant funds, AI labs, AI startups) — process changes
4. Hiring cost/WTP benchmarks (cost-per-hire, time-to-fill, bad-hire cost, agency fees)
5. New entrants / category framing for "evaluation layer" / self-improving assessment

**Step 2 — Diff discipline:** only highlight genuinely new or changed facts. Don't restate the whole market.

## Output

Prepend this block to `tasks/chaminext-market-briefing.md`:

```markdown
## What changed this week — [YYYY-MM-DD]

- **New:** [fact + 1-line source]
- **Competitor:** [move + implication]
- **Implication for us:** [strategy / deck / PoC consequence]
```

## Rules

- Sources are mostly vendor/industry blogs — treat figures as directional, cite ranges, note when uncertain.
- Use the current year in every search query.
- Do not delete prior weeks' entries; keep a running log.

## Cadence

Intended to run weekly. To automate, pair with a Cursor Automation (see the `automate` skill) that invokes this skill on a weekly schedule.
