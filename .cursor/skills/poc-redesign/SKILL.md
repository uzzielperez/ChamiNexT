---
name: poc-redesign
description: Redesign and improve ChamiNext's interview-prep PoC (the self-improving Field Reports loop and AI interview flow) based on user feedback and interview-signal weak areas. Use when the user asks to redesign the PoC, improve the prep product based on users, act on user feedback, or evolve the self-improving loop.
disable-model-invocation: true
---

# PoC Redesign

Evolves the candidate-facing PoC based on real user feedback and the signals digest. The PoC is a React + TypeScript + Vite app; AI runs via Groq (Netlify functions) with offline fallbacks.

## Read before editing

1. `PRODUCT.md` and `DESIGN.md` (repo root) — product + design intent
2. `.cursor/rules/impeccable-chaminext.mdc` — UI rules (match design tokens, avoid listed anti-patterns)
3. Current PoC code:
   - `src/pages/FieldReportsPage.tsx` — self-improving loop UI
   - `src/utils/fieldReportStorage.ts`, `src/utils/fieldReportGenerator.ts`
   - `netlify/functions/field-report-agent.js`
   - `src/components/interview/InterviewSimulator.tsx`, `PracticeDashboard.tsx`

## Inputs that drive the redesign

- **User feedback** the user provides (verbatim quotes preferred)
- `tasks/signals/` weak-area findings (what candidates struggle with)
- `tasks/chaminext-market-briefing.md` (what the market now rewards)

## Workflow

```
- [ ] 1. Restate the user problem/feedback in one sentence
- [ ] 2. Map it to a concrete change in the PoC (UI, generation, scoring, or loop)
- [ ] 3. Make the smallest change that delivers the value; reuse existing components/tokens
- [ ] 4. Keep offline fallback working (plain `npm run dev` must not break)
- [ ] 5. Typecheck + build; fix lints in touched files
- [ ] 6. Summarize what changed and how to demo it
```

## Design + engineering rules

- Match existing design tokens in `src/styles/design-system.css`; prefer CSS variables. Reuse `PremiumButton`, card patterns.
- Every AI call needs a graceful fallback (no API key / no functions runtime must still work).
- Persist new candidate data via the existing localStorage pattern; keep the data flywheel intact.
- Honor the self-improving thesis: changes should make signal → sharper prep more visible or more accurate.
- Verify with `npm run build` (the build is `vite build`; ignore unrelated pre-existing type errors, fix only touched files).

## Output

- Implement the change, then provide:
  - One-line summary of the user need addressed
  - Files changed
  - Demo steps (URL/route + what to click)

## Cadence

On demand after user testing sessions, or after a weekly signals digest reveals a recurring weak area.
