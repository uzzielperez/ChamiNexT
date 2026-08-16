# Learnings: Jack & Jill (comparative study)

**Status:** Living doc — July 2026  
**Related PRD:** `tasks/prd-coach-onboarding.md`  
**IP note:** This is a **category comparison**, not a product clone. ChamiNexT uses its own brand (**Coach**), architecture, rubrics, and surfaces. Do not reuse Jack & Jill trademarks, character names, UI copy, or proprietary flows.

---

## IP framing (read first)

### What ChamiNexT owns (original product thesis — pre-Coach PRD)

These are **ChamiNexT ideas**, documented in `PRODUCT.md`, `tasks/prd-chaminext-ai-interview-platform.md`, and the June 2026 pitch deck **before** the July 2026 Coach/Jack & Jill alignment work:

| Idea | ChamiNexT formulation |
|------|------------------------|
| **Evaluation layer** | Practice → scored signal → hire — not a job board |
| **Ship Tests** | 24h/72h/7d builds + Work Tickets (PR + tests) as hiring signal |
| **Rubric-scored AI interviews** | Thinking, decomposition, communication, code quality |
| **AI as workflow, not cheating** | Explicit product principle #4 |
| **Talent profile + public slug** | Portable proof URL for intros |
| **Interview Intel pipeline** | Field-data flywheel from public sources |
| **Full interview loop** | Recruiter → technical → behavioral (`/loop`) |
| **growth-stage soft skills** | Five-phase behavioral coaching (employer-inspired, not J&J) |
| **Skill trees mapped to problems** | First-principles paths, not random LeetCode |
| **Frontier / mission screening** | AI-for-science ethics probes |
| **Project walkthrough coaching** | Deployment, tests, PR defense (July 2026) |

**Positioning:** ChamiNexT competes in **readiness + proof**, not in **matching-first recruitment**. The Coach layer adds job-seeker onboarding *on top of* an evaluation platform that already existed.

### What Jack & Jill is (external reference)

[Jack & Jill](https://jackandjill.ai/) is a UK-focused AI recruitment product with:

- **Jack** — candidate-side, voice-first career agent
- **Jill** — employer-side matching agent
- **Warm intros** — mutual opt-in introductions
- **Onboarding-first** — long voice conversation before matching

We studied them for **category validation** (AI agents in hiring are fundable and legible to users). We do **not** implement their stack, personas, or matching graph.

### Safe to say publicly

- “Jack & Jill–**inspired** job-seeker **journey**” (onboarding → match → intro)
- “We solve a **different half** of the problem: readiness before intro”
- “Coach is our persona — not Jack”

### Do not say / do not ship

- Jack, Jill, or J&J character names in UI
- Clone their voice-onboarding UX verbatim
- Imply endorsement or partnership without agreement
- Copy marketing lines, pricing packaging, or proprietary matching claims

---

## Convergent ideas (industry-common — no single owner)

These appear in many hiring products; neither side has exclusive claim:

- Magic-link or low-friction auth
- Chat-based preference gathering vs long forms
- Job recommendations from a profile
- Draft outreach the **user** sends (human-in-the-loop)
- Employer + candidate two-sided marketplace (conceptually)

**ChamiNexT implementation choices** that differ:

| Pattern | Jack & Jill (public positioning) | ChamiNexT |
|---------|----------------------------------|-----------|
| Entry | Voice call with Jack | Text Coach (Groq); voice **lessons** separate |
| Persona | Named characters Jack / Jill | Neutral **Coach** + user-picked voice timbre |
| Core value | Match + intro | **Prepare** (mocks, Ship Tests, skill tree) then intro |
| Proof | Profile from conversation | **Rubric scores + ship URL + PR artifacts** |
| Employer side | Jill agent | **Interview Studio** (demo / design partners) — Jill analogue **deferred** |

---

## What we deliberately adopted (inspiration → ChamiNexT design)

Documented in `prd-coach-onboarding.md` Appendix (2026-07-12 decisions):

| Inspired pattern | ChamiNexT adaptation | Status |
|------------------|----------------------|--------|
| Onboarding before job list | `/coach` as post-sign-in front door | Shipped |
| Fiduciary tone to candidate | Coach system prompt + copy guidelines | Shipped |
| Warm intro drafts | `intro-agent` + Email/LinkedIn modal; **user sends** | Shipped |
| “For you” job feed | `jobMatching.ts` + Jobs tab | Shipped |
| Voice preference | Friendly guy / girl picker → ElevenLabs lessons | Shipped (lessons); not Coach chat |
| Hybrid skill path | Linear fundamentals → branch by `targetTrack` | Shipped |
| Cross-device profile | Magic link + `coach-profile` API | Shipped (Blobs-backed; Neon roadmap) |

---

## What we deliberately rejected (differentiation)

| Jack & Jill pattern | Why ChamiNexT rejected or deferred |
|---------------------|--------------------------------------|
| **20-min voice onboarding** with Jack | Cost, latency, STT complexity; text Coach in v1 (PRD §5) |
| **Jill autonomous employer matching** | Out of scope; Interview Studio stays human/design-partner led |
| **Automated intro send** | Legal/ToS risk; manual copy/mailto in v1 (Phase 3) |
| **Matching as primary moat** | Our moat is **assessment IP + ship rubric + field intel** |
| **Character dual-brand** | Single **Coach** brand; avoids confusion and IP overlap |

---

## Feature lineage map (who had the idea first)

Use this internally to avoid “we copied X” or “they copied us” narratives in fundraising or press.

```
ChamiNexT original (2025–June 2026)          Coach layer (July 2026, J&J-informed)
────────────────────────────────────         ─────────────────────────────────────
Ship Tests, AI mocks, talent profile    →    Coach routes users *into* these
Interview Intel, /loop, /drill          →    Coach recommends prep paths
Skill trees, Daily loop                 →    Coach sets targetTrack + fundamentals belt
Jobs board (scraped)                    →    “For you” scoring + intro drafts
Soft-skills / ethics coaching                 →    Unchanged; parallel to Coach

External (Jack & Jill category)         →    What we borrowed
────────────────────────────────────         ─────────────────────────────────────
Onboarding-first entry                  →    Post-login → /coach
Warm intro workflow                     →    Draft-only intros (not their graph)
Voice-first candidate agent             →    **Rejected for Coach**; lessons only
Two-sided Jill matching                 →    **Deferred** (Phase 3 task 11.4)
```

---

## Implementation status vs PRD (July 2026)

See synced checklist: `tasks/tasks-coach-onboarding.md`.

**Summary:**

- **Phase 1 (Coach MVP):** ~85% shipped in code; production gaps (Neon, email send, tests)
- **Phase 2 (voice lessons):** ~70% — batch pipeline + many leaves in `audio-manifest.json`
- **Phase 3 (Jill, automation, voice Coach):** Not started

---

## Open product questions (from comparative study)

1. **Do we need voice Coach at all?** Lessons already use voice; text Coach may be sufficient until unit economics clear.
2. **Intro without matching graph:** Is draft-only enough if our wedge is readiness, not liquidity?
3. **Employer consent:** Warm intros to scraped `jobs.json` postings — user-initiated only until consent registry exists.
4. **Category story for investors:** “Jack & Jill matches; ChamiNexT **qualifies**” — complementary, not competitive clone.

---

## References

- ChamiNexT: `PRODUCT.md`, `tasks/prd-coach-onboarding.md`, `tasks/pitch-deck-chaminext.md`
- External: [jackandjill.ai](https://jackandjill.ai/) (public positioning only — no scraping of non-public assets)
- Related: `tasks/learnings-interview-intel.md`, `tasks/prd-career-ops-integration.md`
