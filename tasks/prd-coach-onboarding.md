# PRD: Coach Onboarding, Skill Tree Progression & Job Matching

> **Status:** Draft — ready for implementation planning  
> **Author:** Product (from user decisions 2026-07-12)  
> **Related:** `tasks/brief-verve-pipeline.md`, `tasks/fundraising-playbook.md`, `content/fundamentals/skill-tree.json`

---

## 1. Introduction / Overview

ChamiNexT will adopt a **Jack & Jill–inspired job-seeker journey** with a key differentiation: candidates don't just get matched to jobs — they **prepare** through a personalized skill tree, AI mocks, and Ship Tests before warm intros go out.

**Problem:** Job seekers bounce between generic job boards, LeetCode grinds, and cold applications. Hiring teams drown in unvetted applicants. Jack & Jill solves matching with a voice-first AI coach ("Jack"); ChamiNexT solves **readiness + proof of output** on the same path.

**Solution:** After sign-in, users meet **Coach** (Groq text chat in v1; voice later). Coach learns goals, background, and preferences through conversation, then drives:

1. A **structured candidate profile** (server-persisted via Neon)
2. **Personalized job recommendations** from the existing jobs board
3. **AI-drafted warm intro messages** (email / LinkedIn — user sends manually in v1)
4. A **hybrid skill tree path**: linear fundamentals, then branch by target role
5. **Voice-generated lessons** (ElevenLabs) for every skill-tree leaf — batch-generated when audio ships (phase 2)

**Goal:** Make sign-in → Coach chat the primary front door for job seekers, replacing the current "pick Daily or Practice yourself" model.

---

## 2. Goals

| # | Goal | Measure |
|---|------|---------|
| G1 | ≥70% of new sign-ups complete Coach onboarding (profile ≥80% filled) | Funnel analytics |
| G2 | Coach session → first practice action within 5 minutes (skill leaf or mock) | Time-to-first-action |
| G3 | Job feed shows ≥3 "strong match" roles for ≥60% of onboarded users | Match score distribution |
| G4 | ≥25% of users copy or send at least one warm intro draft in first 14 days | Intro draft events |
| G5 | Skill tree completion of "fundamentals belt" within 14 days for Daily-active users | Leaf unlock rate |
| G6 | Server-side auth eliminates trial abuse and enables cross-device profiles | Auth + profile sync |

---

## 3. User Stories

### Job seeker

- **US-1:** As a new user, I want to sign in with a magic link so my progress follows me across devices.
- **US-2:** As a job seeker, I want to talk to Coach in chat (not fill a form) so I feel understood before I grind.
- **US-3:** As a job seeker, I want Coach to ask about my current role, target role, comp, timeline, and stack so recommendations feel personal.
- **US-4:** As a job seeker, I want to see jobs ranked for me with a short "why this fits" note and a prep path link.
- **US-5:** As a job seeker, I want Coach to draft a warm intro email or LinkedIn message I can edit and send myself.
- **US-6:** As a job seeker, I want a skill tree that starts with fundamentals (everyone) then branches to my target role (e.g. AI engineer vs backend).
- **US-7:** As a job seeker, I want to pick Coach's voice (friendly guy or friendly girl — deep but warm) so lessons feel personal when audio is available.
- **US-8:** As a job seeker, I want voice lessons on each skill leaf (when available) so I can learn like a podcast while commuting.
- **US-9:** As a job seeker, I want Daily loop step 1 to be my current skill-tree lesson, not a random bite.

### Employer (future — Jill side)

- **US-9:** As a hiring manager, I want candidates who arrive via intro to already have a talent profile with thinking scores and ship history (existing Interview Studio path).

---

## 4. Functional Requirements

### 4.1 Authentication (Neon + magic link)

1. The system must support email magic-link sign-in backed by **Neon PostgreSQL** for user records and profile storage.
2. The system must migrate critical localStorage data (talent profile, coach state, skill progress, daily streak) to server on first login, with local fallback if offline.
3. The system must expose `/login` (currently dead link in header) with email input → magic link sent → callback route.
4. The system must protect `/coach`, `/jobs` personalized feed, and intro drafts behind authenticated session (or allow anonymous Coach preview with prompt to save progress — **decision: require auth before saving profile**).

### 4.2 Coach onboarding chat (Groq text — Phase 1)

5. The system must route **new authenticated users** to `/coach` as the default post-sign-in destination (override: returning users with complete profile → `/daily` or last route).
6. The system must implement `onboarding-agent` (Netlify function) modeled on `interview-agent.js`: structured JSON output, rate limits, offline demo fallbacks.
7. Coach must conduct a **multi-turn conversation** (not a single form) covering at minimum:
   - Current role and years of experience
   - Target role(s) and company stage preference (startup / growth / enterprise)
   - Location / remote preference
   - Compensation range (optional, skippable)
   - Timeline (exploring / active search / offer stage)
   - Primary stack and weak areas (self-reported)
   - Mission interest flag (climate, health, frontier science — aligns with existing jobs `mission` filter)
8. Coach must emit a **`CoachProfile` JSON** object when onboarding is complete (or pausable mid-session):

```json
{
  "onboardingComplete": true,
  "voicePreference": "male",
  "targetTrack": "ai-engineer",
  "targetRoles": ["ML Engineer", "Applied Scientist"],
  "experienceYears": 4,
  "remotePreference": "remote-only",
  "timeline": "active-search",
  "compRange": { "min": 120000, "max": 180000, "currency": "USD" },
  "stack": ["Python", "PyTorch", "FastAPI"],
  "weakAreas": ["system design", "behavioral"],
  "missionPreferred": true,
  "recommendedLeafIds": ["decomposition", "rag-basics"],
  "summaryForMatching": "2-3 sentence natural language profile for job scoring"
}
```

9. Coach UI must reuse patterns from `InterviewSimulator.tsx`: message list, typing indicator, scroll, session persistence.
10. Coach must offer **clear CTAs** on completion: "See your jobs", "Start your skill path", "Run a mock interview".
11. Coach must **not** use voice or ElevenLabs in Phase 1 (text only).

### 4.2.1 Coach persona & voice preference

12. The product persona name is **Coach** (always "Coach" in UI copy — not Jack, not a fictional first name).
13. During onboarding (early in chat or a one-screen picker before first message), the user must choose **Coach's voice** for Phase 2 audio:
    - **Friendly guy** — deep, warm, calm male voice (ElevenLabs preset TBD)
    - **Friendly girl** — deep, warm, calm female voice (ElevenLabs preset TBD)
14. Both options must feel **deep-voiced but approachable** — mentor tone, not announcer or hype. Avoid chipper/cartoon voices.
15. The selection must persist on `CoachProfile.voicePreference` (`"male"` | `"female"`) and in user settings (changeable later).
16. Phase 1 UI may show the picker with copy like *"Pick how Coach will sound in your lessons"* even before audio exists — sets expectation and avoids re-onboarding.
17. Skill-tree and Daily audio must play the variant matching `voicePreference`; batch pipeline generates **both variants per leaf** at build time (see §4.7).

### 4.3 Job recommendations

18. The system must score each job in `content/jobs/jobs.json` against `CoachProfile` using a deterministic baseline (track match, remote, mission flag, keyword overlap) plus optional Groq rerank for top 10.
19. The Jobs page (`/jobs`) must show a **"For you"** tab when profile exists, sorted by match score, with a one-line "why" per job.
20. Each recommended job card must link to existing **prep path** (`/drill?track=…`, relevant skill leaves, optional mock).
21. The system must log `job_view` and `job_save` events for future intro automation.

### 4.4 Warm intro drafts (Phase 1: manual send)

22. For jobs the user marks "Interested", Coach (or a dedicated `intro-agent`) must generate:
    - **Email draft** — subject + body to hiring manager or careers inbox
    - **LinkedIn draft** — connection note (≤300 chars) + follow-up message
23. Drafts must reference the user's **talent profile slug**, top thinking score, and relevant ship history when available.
24. The UI must provide **Copy**, **mailto:**, and "Open LinkedIn" (prefill where possible) — **no automated send in Phase 1**.
25. The system must store draft history per user + job in Neon.

### 4.5 Warm intro automation (Phase 3 — out of scope for v1)

26. *(Future)* Automated intro send via email provider (Resend/SendGrid) with user opt-in.
27. *(Future)* LinkedIn integration or recruiter-assisted intro queue (compliance review required).

### 4.6 Skill tree — hybrid progression (Model C)

28. The skill tree must use a **two-phase structure**:
    - **Phase A — Fundamentals (linear):** All users complete the same ordered leaves (e.g. decomposition → arrays → communication) before branching. Visual: "white belt" segment.
    - **Phase B — Role branch:** After fundamentals, unlock a branch determined by `CoachProfile.targetTrack` (software, ai-engineer, quant, etc.).
29. Each leaf must define: `prerequisites[]`, `belt` or `rank`, `domains[]`, `fundamentals[]`, `lessonScriptId` (nullable until audio exists).
30. A leaf unlocks when: (a) all prerequisites complete, (b) lesson marked complete (text or audio), (c) optional drill pass ≥ threshold.
31. `SkillTreesPage` must show locked/unlocked state, current belt, and "Coach picked this path" banner when profile exists.
32. Progress must sync to Neon per user.

### 4.7 Voice lessons — ElevenLabs (Phase 2)

33. **Phase 1:** Coach and skill tree use **text lessons** only (markdown scripts stored in repo or DB).
34. **Phase 2:** Batch-generate **ElevenLabs audio for every skill-tree leaf** in **two voice variants** (male + female) per user decision on persona.
35. Each leaf must have: `lessonScript` (markdown), `audioUrlMale`, `audioUrlFemale`, `durationSec`, `generatedAt`.
36. Daily loop step 1 ("Learn") must play the **current unlocked leaf** audio (variant per `voicePreference`) with transcript + reflect prompt.
37. Reuse ElevenLabs pipeline patterns from **Manifesto** and **Apprie Embers** projects (external repos — implement as shared script or documented pipeline in `scripts/voice-lessons/`).
38. Voice casting: select two ElevenLabs presets — **deep, warm, friendly male** and **deep, warm, friendly female** — audition before batch run; document IDs in `content/voice/coach-voices.json`.
39. Cache audio aggressively; regenerate only when script version changes.

### 4.8 Navigation & entry flow

40. Post-sign-in default route: `/coach` (incomplete profile) → `/daily` (complete profile + active user).
41. Homepage "I'm job hunting" CTA should go to `/login` → `/coach` (not directly `/daily`) once auth ships.
42. Simplified nav unchanged: Daily · Practice · Jobs · Pricing; Coach accessible from avatar menu or first-run redirect.

---

## 5. Non-Goals (Out of Scope)

- **Voice onboarding for Coach** in v1 (Jack's 20-min voice call — deferred)
- **Automated email/LinkedIn send** in v1 (Phase 3)
- **Jill employer agent** matching candidates to companies autonomously (existing Interview Studio remains manual/demo)
- **Replacing** existing interview simulator, Ship Tests, or VERVE pipeline — Coach **routes into** them
- **New job scraping sources** — use existing `jobs.json` pipeline
- **Mobile native app** — responsive web only
- **Real-time LinkedIn API** for profile import in v1 (optional: paste LinkedIn URL / upload CV as enhancement)

---

## 6. Design Considerations

### Coach chat UI

- Calm, conversational — not IDE-heavy like technical mocks
- Progress indicator: "Getting to know you (3/7 topics)"
- Persona name: **Coach** — subtitle *"Your career agent"*
- **Voice picker** (before or during onboarding): two cards — **Friendly guy** / **Friendly girl** — with short audio preview clips in Phase 2; static labels + illustration in Phase 1
- Avatar: neutral Coach mark (not gendered until user picks; optional subtle accent color per voice choice)
- Tone in copy: direct, warm, fiduciary to the candidate (Jack & Jill-style trust, ChamiNexT brand)
- Mobile-first: full-screen chat on small viewports

### Coach voice (ElevenLabs — Phase 2)

| Option | UI label | Character |
|--------|----------|-----------|
| Male | Friendly guy | Deep, calm, mentor — think experienced eng lead, not radio DJ |
| Female | Friendly girl | Deep, warm, grounded — think staff engineer who explains clearly |

- User can change voice in **Settings → Coach**; switching does not re-run onboarding
- Preview: 10-second sample *"Hi, I'm Coach. I'll learn how you think and help you land the right role."*

### Skill tree (jiujitsu-inspired)

- Belt colors per segment: fundamentals = white, branch = blue/purple by track
- Leaf nodes: locked (gray), available (pulse), complete (check + belt stripe)
- Tap leaf → lesson player (audio + transcript) → "Practice this" → drill or mock

### Jobs "For you"

- Match score badge (e.g. 87% fit)
- Expandable "Why Coach picked this"
- Actions: Save · Prep · Draft intro

### Reference products

- [Jack & Jill](https://jackandjill.ai/) — onboarding-first, warm intros, mutual opt-in
- Jiujitsu app (internal) — linear rank progression, unlock next technique
- Manifesto / Apprie Embers — ElevenLabs lesson generation pipeline

---

## 7. Technical Considerations

### Stack

| Layer | Choice |
|-------|--------|
| Auth | Neon Auth or custom magic link (JWT) + Neon Postgres |
| Profile / progress | Neon tables: `users`, `coach_profiles`, `skill_progress`, `intro_drafts`, `job_saves` |
| Coach agent | `netlify/functions/onboarding-agent.js` (Groq `llama-3.3-70b-versatile`) |
| Intro drafts | `netlify/functions/intro-agent.js` |
| Job scoring | Client-side deterministic + optional Groq rerank function |
| Voice | ElevenLabs API; store MP3 in Netlify Blobs or S3; `scripts/voice-lessons/generate.mjs` |
| Existing reuse | `interview-agent.js`, `InterviewSimulator.tsx`, `loadSkillTree.ts`, `loadJobs.ts`, `DailyPracticePage.tsx` |

### Schema sketch (Neon)

```sql
users (id, email, created_at)
coach_profiles (user_id, profile_json, onboarding_complete, updated_at)
skill_progress (user_id, leaf_id, status, completed_at)
intro_drafts (user_id, job_id, channel, subject, body, created_at)
job_saves (user_id, job_id, match_score, saved_at)
```

### Migration

- On login: read `localStorage` keys (`chaminext_*`), merge into server, dedupe by timestamp
- Public profile slug: preserve existing `profileSlug.ts` behavior, link to `user_id`

### Cost controls

- Groq text Coach: rate limit 20 msgs/session, 5 sessions/day free tier
- ElevenLabs: batch offline generation (~N leaves × ~2 min audio); no realtime TTS in v1
- No OpenAI Realtime / voice STT until unit economics work

### Dependencies

- Neon project provisioned (already in roadmap per `tasks/pitch-deck-chaminext.md`)
- `GROQ_API_KEY` (existing)
- `ELEVENLABS_API_KEY` (Phase 2 only)

---

## 8. Success Metrics

| Metric | Target (90 days post-launch) |
|--------|------------------------------|
| Sign-up → onboarding complete | ≥50% |
| Onboarding complete → job "For you" view | ≥80% |
| Intro draft copied/sent (manual) | ≥25% of active users |
| Fundamentals belt complete (≥5 leaves) | ≥30% of Daily-active users |
| Voice lesson listen rate (Phase 2) | ≥40% of Daily step-1 starts |
| Employer pilot intros from Coach profiles | ≥5 design-partner intros |

---

## 9. Implementation Phases

### Phase 1 — Coach + Auth + Jobs + Manual intros (MVP)

- Neon magic link auth + `/login`
- `onboarding-agent` + `/coach` UI
- **Voice preference picker** (Friendly guy / Friendly girl — UI only until audio ships)
- `CoachProfile` persistence (includes `voicePreference`)
- Jobs "For you" tab + match scoring
- Intro draft generator (copy/mailto)
- Skill tree: hybrid model in JSON + unlock logic (text lessons only)
- Post-sign-in routing

### Phase 2 — Voice lessons (full skill tree)

- `content/voice/coach-voices.json` — ElevenLabs voice IDs (male + female presets)
- `lessonScript` per leaf in content repo
- `scripts/voice-lessons/generate.mjs` — batch **both** variants per leaf
- Audio player in skill tree + Daily step 1 (respects `voicePreference`)
- CDN/blob storage for MP3s

### Phase 3 — Intro automation + voice Coach

- Email send with opt-in
- LinkedIn workflow (manual queue → automated where legal)
- Optional voice onboarding for Coach (STT + ElevenLabs)

---

## 10. Open Questions

1. ~~**Coach name/branding**~~ — **Resolved:** persona name is **Coach**; user picks **Friendly guy** or **Friendly girl** voice.
2. **CV upload in Coach flow:** Should Coach accept PDF/LinkedIn paste in v1 or chat-only?
3. **Fundamentals belt size:** How many linear leaves before branch — 3, 5, or 7?
4. **Match score transparency:** Show numeric score to user or qualitative only ("Strong fit")?
5. **Free tier limits:** How many intro drafts per month on Daily (free) vs Sprint?
6. ~~**ElevenLabs voice ID**~~ — **Resolved:** two ChamiNexT-specific presets (deep friendly male + female); audition separately from Manifesto/Embers unless those voices already fit.
7. **Employer opt-in for intros:** Do companies in `jobs.json` consent to warm intros, or only scraped public postings + user-initiated outreach?

---

## Appendix: User decisions (2026-07-12)

| Question | Selection |
|----------|-----------|
| 1. Post sign-in entry | **A** — Coach chat first |
| 2. Warm intros | **A** now (manual drafts), **C** later (full automation) |
| 3. Skill tree model | **C** — Hybrid: linear fundamentals, branch by target role |
| 4. Voice timing | **A + C** — Groq Coach text in Phase 1; ElevenLabs batch for **entire** skill tree in Phase 2 |
| 5. Auth | **B** — Neon + magic link |
| 6. Persona | **Coach** — user chooses **Friendly guy** or **Friendly girl** (deep, warm voice; ElevenLabs in Phase 2) |

---

*Next step: generate `tasks-coach-onboarding.md` task list on user confirmation ("Go"). Do not implement until task list is approved.*
