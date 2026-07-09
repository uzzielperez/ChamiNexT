# VERVE Pipeline Brief

Design-partner mapping: how a VERVE-style engineering hiring pipeline maps onto ChamiNexT surfaces, with soft-skill rubrics wired into the interview agent.

## Context

VERVE (and similar growth-stage companies) hire on **day-to-day work**, not LeetCode speed:

1. CV / profile pre-screen  
2. HR + high-level fit (recruiter screen)  
3. **Online coding** — small ticket, PR submit, **AI allowed**  
4. **Soft skills** — five structured behavioral phases  
5. Personal IDE / pairing — repo review, Codespaces, devcontainer  

ChamiNexT should let employers configure this pipeline in Interview Studio and let candidates practice each stage before the real loop.

---

## Pipeline stages → ChamiNexT mapping

| VERVE stage | ChamiNexT surface | Status |
|-------------|-------------------|--------|
| CV pre-screen | Talent profile + mission rubric | Planned |
| HR + high-level | Recruiter mock (`domain: recruiter`) | Live |
| Online coding / Work Ticket | Ship Test `format: ticket`, PR submit | **Live** (template) |
| Soft skills (5 phases) | Behavioral mocks + VERVE rubrics | **Live** (rubrics + agent) |
| Personal IDE | Repo + PR review, Codespaces / devcontainer | Planned (employer UI) |

---

## Work Ticket (stage 3)

**Goal:** Replace whiteboard puzzles with a realistic ticket: fork starter repo, implement scoped change, open PR.

**Candidate experience**

- Enroll in **Work Ticket: Rate Limiter API** from Ship Test lobby (`/practice` → Ship Tests).  
- 4-hour window (20 min in demo mode).  
- Starter repo link, ticket markdown, PM brief.  
- Submit **GitHub PR URL** (required); preview deploy optional.  
- AI assistants allowed — must disclose in PR description.  

**Employer experience (next)**

- Assign ticket per role from Interview Studio.  
- Custom starter repos per stack (Node, Python, Java/Kotlin via devcontainer branches).  
- Reviewer rubric: tests, scope, README, trade-offs in PR body.  

**Files**

- `content/ship-tests/challenges.json` — `work-ticket-rate-limiter`  
- `src/components/ship-tests/ShipTestSession.tsx` — PR submit UI  
- `netlify/functions/ship-test-evaluator.js` — Work Ticket scoring prompt  

**Starter repo (to create)**

- `github.com/chaminext-templates/work-ticket-rate-limiter`  
- Minimal HTTP service + failing test stub for rate limiter.  
- `.devcontainer/` for Java/Kotlin variants on separate branches.  

---

## Soft skills — 5 phases (stage 4)

Canonical rubrics live in:

```
content/employers/verve-soft-skills.json
```

Practice problems (question bank):

```
content/question-bank/verve-soft-skills.json
```

Interview agent loads rubrics when `problem.id` matches a phase id (e.g. `verve-ownership`) or `source` contains `verve-pipeline:phase-N`.

### Phase summary

| Phase | ID | Title |
|-------|-----|-------|
| 1 | `verve-ownership` | Ownership & big picture |
| 2 | `verve-pushback` | Pushback on "No" |
| 3 | `verve-mentorship` | Force multiplier & mentorship |
| 4 | `verve-pragmatism` | Pragmatism vs perfectionism |
| 5 | `verve-candidate-questions` | Candidate questions |

Each phase JSON includes:

- `prompt` — opening question  
- `focusAreas`, `strongSignals`, `weakSignals`  
- `followUps` — suggested interviewer probes  
- `scoringDimensions` — maps to ChamiNexT scores (thinking, decomposition, communication, codeQuality)  

**Agent wiring:** `netlify/functions/interview-agent.js` requires the JSON and appends `VERVE SOFT-SKILL PHASE` protocol to behavioral rounds.

**How to practice**

1. `/practice` → pick behavioral track or search VERVE problems.  
2. Or run full loop at `/loop` (recruiter → technical → behavioral).  
3. Employer pilots: assign phase pack per role in Interview Studio (UI TBD).  

---

## Employer pilot offer

Align with pricing **Growth** tier (€900/mo):

- Custom Work Ticket per open role  
- VERVE soft-skill rubric pack pre-loaded  
- 60-day free pilot on one role → ranked shortlist in 72h  

CTA: `hello@chaminext.com` with subject `ChamiNext Growth — pilot request`.

---

## Implementation checklist

- [x] `content/employers/verve-soft-skills.json` — 5 phase rubrics  
- [x] `content/question-bank/verve-soft-skills.json` — 5 practice problems  
- [x] `netlify/functions/interview-agent.js` — rubric injection  
- [x] Work Ticket challenge + PR submit in Ship Test session  
- [ ] Starter GitHub template repo (external)  
- [ ] Interview Studio: assign ticket + rubric pack per role  
- [ ] Employer dashboard: PR diff viewer / Codespaces launch  
- [ ] Talent profile: aggregate VERVE stage scores  

---

## JSON schema reference (soft-skill phase)

```json
{
  "id": "verve-ownership",
  "phase": 1,
  "title": "Ownership & big picture",
  "prompt": "...",
  "focusAreas": ["..."],
  "strongSignals": ["..."],
  "weakSignals": ["..."],
  "followUps": ["..."],
  "scoringDimensions": {
    "thinking": "...",
    "decomposition": "...",
    "communication": "...",
    "codeQuality": "..."
  }
}
```

Full file: `content/employers/verve-soft-skills.json`.

---

## Related docs

- `tasks/fundraising-playbook.md` — GTM, founding members  
- `tasks/brief-frontier-mission-screening.md` — mission-layer screening  
- `src/pages/PricingPage.tsx` — Daily · Sprint · Season (job seeker) + company tiers  
