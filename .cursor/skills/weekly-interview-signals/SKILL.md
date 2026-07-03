---
name: weekly-interview-signals
description: Synthesize ChamiNext's field-sourced interview reports into a weekly interview-signals digest (real questions, recurring themes, weak areas, company patterns). Use when the user asks for interview signals, a weekly signals report, what real interviews are telling us, or to analyze field reports.
disable-model-invocation: true
---

# Weekly Interview Signals

Turns the real interview reports captured in the product into a weekly signal digest the team can act on. This is the candidate-side data flywheel.

## Where the data lives

The Field Reports feature stores data in the browser (localStorage), so it is not directly readable from the repo. Two input modes:

1. **Exported data** — the user pastes a JSON export of reports / field problems, or points to a file under `tasks/signals/`. Keys: `chaminext_interview_reports`, `chaminext_field_problems`.
2. **No export available** — say so plainly and ask the user to paste the latest reports. Do not fabricate signals.

Relevant code (for reference, not to re-implement): `src/utils/fieldReportStorage.ts` (`deriveInsights`), `src/pages/FieldReportsPage.tsx`.

## Workflow

```
- [ ] 1. Load the week's reports (export or pasted)
- [ ] 2. Cluster questions by domain and by company/segment
- [ ] 3. Identify recurring questions and recurring struggle areas
- [ ] 4. Compare to last week's digest — note new patterns
- [ ] 5. Write the digest + 3 concrete recommendations
```

Analysis to compute:
- Top domains by frequency; trend vs last week
- Most-asked / repeated real questions
- Common `whatStruggled` themes (candidate weak areas)
- Company / segment patterns (quant vs AI lab vs startup)
- Outcome mix (offer / passed / rejected) where reported

## Output

Write to `tasks/signals/interview-signals-[YYYY-MM-DD].md`:

```markdown
# Interview Signals — [YYYY-MM-DD]

## Volume
[N reports, M questions, K companies this week]

## Top themes
- [domain]: [count] — [1-line takeaway]

## Recurring real questions
- "[question]" — seen at [companies]

## Where candidates struggle
- [theme] — [implication for practice content]

## Recommendations
1. [practice-content / rubric / product action]
2. [...]
3. [...]
```

## Rules

- Never invent reports or questions. If data is missing, ask for it.
- Keep candidate data anonymized — reference companies/roles, not personal identities.
- Feed weak-area findings to the `poc-redesign` skill and theme shifts to `pitch-deck-update`.

## Cadence

Intended to run weekly. Automate via a Cursor Automation (see the `automate` skill).
