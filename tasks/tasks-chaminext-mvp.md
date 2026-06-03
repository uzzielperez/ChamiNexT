# ChamiNext MVP — Implementation Tasks

**PRD:** `tasks/prd-chaminext-ai-interview-platform.md`  
**Brand:** ChamiNext (display); repo may remain `ChamiNexT` until rename.

## Relevant Files

- `src/pages/HomePage.tsx` — Landing & thesis
- `src/pages/JobSeekersPage.tsx` — Practice hub (`/practice`)
- `src/pages/EmployersPage.tsx` — Company Interview Studio (preview)
- `src/types/interview.ts` — Scores, sessions, ship test types
- `src/data/practiceProblems.ts` — Problem bank
- `src/data/shipTests.ts` — Ship Test challenges
- `src/utils/interviewStorage.ts` — localStorage sessions & profile
- `src/utils/interviewAgent.ts` — Client for interview API
- `src/components/interview/InterviewSimulator.tsx`
- `src/components/interview/PracticeDashboard.tsx`
- `src/components/interview/TalentProfile.tsx`
- `src/components/interview/ScoreBreakdown.tsx`
- `src/components/ship-tests/ShipTestLobby.tsx`
- `src/components/ship-tests/ShipTestSession.tsx`
- `netlify/functions/interview-agent.js` — AI interviewer API
- `netlify/functions/ship-test-evaluator.js` — Ship Test scoring (future)

### Notes

- PRD suggests Flask + Next.js; current stack is React (Vite) + Netlify. Phase 1 can ship on existing stack; backend migration is a later decision.

## Instructions

Check off sub-tasks as completed: `- [ ]` → `- [x]`.

## Tasks

- [x] 0.0 Product foundation
  - [x] 0.1 Save PRD to `tasks/prd-chaminext-ai-interview-platform.md`
  - [x] 0.2 Align landing page copy with PRD (Ship Tests, principles)
  - [x] 0.3 Rename user-facing brand to ChamiNext (header, footer, meta)
  - [x] 0.4 Add `src/types/interview.ts` data models

- [x] 1.0 Phase 1 — AI Interview Simulator (MVP)
  - [x] 1.1 Interview session UI (problem, editor, chat with AI interviewer)
  - [x] 1.2 Netlify function: adaptive follow-up questions (Groq/LLM)
  - [x] 1.3 Scoring v1: Thinking, Decomposition, Communication, Code Quality
  - [x] 1.4 Session replay + transparent score breakdown
  - [x] 1.5 Wire Practice page (`/practice`) with interview flow
  - [x] 1.6 Simple talent profile stub (latest scores)

- [x] 2.0 Phase 1 — Adaptive Practice Engine (lite)
  - [x] 2.1 Problem bank (5 domains: arrays, trees, strings, system design, debugging)
  - [x] 2.2 Weakness tags from session history (domain attempt counts)
  - [x] 2.3 "Practice next" recommendation on dashboard

- [x] 3.0 Phase 2 — Ship Tests (24h only)
  - [x] 3.1 Ship Test lobby: list challenges, enroll, timer
  - [x] 3.2 AI roles UI: PM brief, Tech Lead checkpoints, User Simulator events
  - [x] 3.3 Deployment URL capture + submit flow
  - [x] 3.4 Evaluator v1: five PRD scores (demo scoring; live AI evaluator next)
  - [x] 3.5 Ship Test counts on talent profile

- [x] 4.0 Phase 3 — B2B Interview Studio (demo)
  - [x] 4.0a Preview UI: roles, assessments, ranked candidates table
  - [x] 4.1 Create role + copy invite link (`/apply?role=`)
  - [x] 4.2 Candidate apply flow + application inbox
  - [x] 4.3 Ranked comparison by shipping score
  - [x] 4.4 Stripe checkout session + local demo activation

- [x] 5.0 Monetization (demo-ready)
  - [x] 5.1 B2C: Free / Pro / Builder / Premium (`/pricing`)
  - [x] 5.2 B2B pricing teaser on Interview Studio
  - [x] 5.3 Free tier: 2 interviews/day gate

- [x] 6.0 Demo week tooling
  - [x] 6.1 Demo banner + seed data (`DemoBanner`, `seedDemo.ts`)
  - [x] 6.2 Demo mode: short Ship timers, unlock 72h/7d
  - [x] 6.3 `tasks/DEMO-WEEK.md` presenter script
  - [x] 6.4 Code runner (Piston via `code-run`)
  - [x] 6.5 AI Ship Test evaluator (`ship-test-evaluator`)
  - [x] 6.6 Public profiles `/profile/:slug`

- [ ] 6.0 GTM content
  - [ ] 6.1 One public 24h Ship Test challenge (dogfood)
  - [ ] 6.2 Record one mock interview clip for LinkedIn/YouTube
  - [ ] 6.3 Landing: pricing section (optional, when Stripe live)
