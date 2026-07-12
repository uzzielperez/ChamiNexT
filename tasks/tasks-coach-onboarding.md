# Coach Onboarding — Implementation Tasks

**PRD:** `tasks/prd-coach-onboarding.md`  
**Branch suggestion:** `feature/coach-onboarding`

## Relevant Files

- `tasks/prd-coach-onboarding.md` — Product requirements and phased scope
- `src/App.tsx` — Add `/login`, `/coach`, `/auth/callback`, protected routes
- `src/pages/LoginPage.tsx` — Magic-link email form (new)
- `src/pages/CoachPage.tsx` — Coach onboarding shell (new)
- `src/pages/JobsPage.tsx` — "For you" tab + match scores + intro CTA
- `src/pages/SkillTreesPage.tsx` — Belt/unlock UI + Coach path banner
- `src/pages/DailyPracticePage.tsx` — Step 1 → current skill leaf (Phase 2 audio)
- `src/pages/HomePage.tsx` — Job-hunting CTA → `/login`
- `src/components/coach/CoachChat.tsx` — Chat UI (new; fork from InterviewSimulator)
- `src/components/coach/VoicePreferencePicker.tsx` — Friendly guy / Friendly girl (new)
- `src/components/coach/CoachCompletionCTA.tsx` — Post-onboarding actions (new)
- `src/components/coach/IntroDraftModal.tsx` — Email + LinkedIn drafts (new)
- `src/components/skills/SkillTreePanel.tsx` — Locked/unlocked leaves, belt display
- `src/components/layout/PremiumHeader.tsx` — Avatar menu → Coach, Settings
- `src/types/coach.ts` — `CoachProfile`, `VoicePreference`, session types (new)
- `src/utils/coachStorage.ts` — localStorage + sync hooks (new)
- `src/utils/coachAgent.ts` — Client for onboarding-agent (new)
- `src/utils/jobMatching.ts` — Deterministic job scoring (new)
- `src/utils/introAgent.ts` — Client for intro-agent (new)
- `src/utils/skillProgress.ts` — Leaf unlock logic + Neon sync (new)
- `src/data/loadSkillTree.ts` — Extend for prerequisites, belts, branch routing
- `content/fundamentals/skill-tree.json` — Add `prerequisites`, `belt`, `fundamentalsOrder`, branch gates
- `content/lessons/` — Text lesson scripts per leaf (new directory)
- `content/voice/coach-voices.json` — ElevenLabs voice IDs (Phase 2)
- `netlify/functions/onboarding-agent.js` — Groq Coach chat (new)
- `netlify/functions/intro-agent.js` — Warm intro drafts (new)
- `netlify/functions/auth-magic-link.js` — Send magic link (new)
- `netlify/functions/auth-verify.js` — Verify token, issue session JWT (new)
- `netlify/functions/coach-profile.js` — CRUD coach profile + progress (new)
- `netlify/functions/_shared/neon.js` — DB client helper (new)
- `netlify/functions/_shared/auth.js` — JWT verify middleware (new)
- `scripts/db/migrate-coach.sql` — Neon schema (new)
- `scripts/voice-lessons/generate.mjs` — ElevenLabs batch (Phase 2)
- `scripts/voice-lessons/upload.mjs` — Blob/CDN upload (Phase 2)
- `src/components/interview/InterviewSimulator.tsx` — Reference for chat patterns
- `netlify/functions/interview-agent.js` — Reference for Groq agent pattern
- `src/utils/interviewStorage.ts` — Migrate talent profile on login
- `src/utils/dailyStorage.ts` — Wire Daily step 1 to skill leaf
- `src/utils/profileSlug.ts` — Link public slug to user id

### Notes

- Phase 1 ships **text Coach only**; voice picker is UI + persisted preference.
- Require auth before saving `CoachProfile` (anonymous users can preview one message, then gate).
- Default open questions until decided: fundamentals belt = **5 leaves**, match score = **qualitative + numeric**, intro drafts = **3/mo free, unlimited Sprint**.
- Unit tests alongside new utils where non-trivial (`jobMatching.test.ts`, `skillProgress.test.ts`).
- Run `npm run build` after each parent task milestone.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, check it off in this markdown file by changing `- [ ]` to `- [x]`.

Example: `- [ ] 1.1 Read file` → `- [x] 1.1 Read file`

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout `feature/coach-onboarding`
  - [ ] 0.2 Confirm `GROQ_API_KEY` in Netlify env; note Neon + `DATABASE_URL` needed for auth

- [ ] 1.0 Neon database & magic-link auth
  - [ ] 1.1 Create `scripts/db/migrate-coach.sql` with tables: `users`, `coach_profiles`, `skill_progress`, `intro_drafts`, `job_saves`, `magic_link_tokens`
  - [ ] 1.2 Add `netlify/functions/_shared/neon.js` — pooled Postgres client via `@neondatabase/serverless`
  - [ ] 1.3 Add `netlify/functions/_shared/auth.js` — sign/verify JWT session cookie or Bearer token
  - [ ] 1.4 Implement `netlify/functions/auth-magic-link.js` — validate email, store token (15 min TTL), send via Resend/SMTP (demo: log link to console)
  - [ ] 1.5 Implement `netlify/functions/auth-verify.js` — exchange token for session, upsert `users` row
  - [ ] 1.6 Build `src/pages/LoginPage.tsx` — email input, "Send magic link", success state
  - [ ] 1.7 Add `/login` and `/auth/callback` routes in `src/App.tsx`
  - [ ] 1.8 Add `src/utils/authSession.ts` — read/write session token, `useAuth()` hook
  - [ ] 1.9 Wire header Sign In → `/login`; show avatar + email when authenticated

- [ ] 2.0 Coach profile types & persistence
  - [ ] 2.1 Add `src/types/coach.ts` — `CoachProfile`, `VoicePreference`, `CoachMessage`, `OnboardingAgentResponse`
  - [ ] 2.2 Add `src/utils/coachStorage.ts` — load/save profile + chat transcript locally; `syncToServer()` when authed
  - [ ] 2.3 Implement `netlify/functions/coach-profile.js` — GET/PUT profile JSON, merge strategy (server wins on conflict)
  - [ ] 2.4 On first login: migrate `interviewStorage`, `dailyStorage`, skill progress from localStorage → Neon via coach-profile endpoint
  - [ ] 2.5 Link `profileSlug.ts` to `user_id` when authenticated

- [ ] 3.0 Voice preference picker (Coach persona)
  - [ ] 3.1 Add `src/components/coach/VoicePreferencePicker.tsx` — two cards: **Friendly guy** / **Friendly girl**
  - [ ] 3.2 Copy: *"Pick how Coach will sound in your lessons"* + subtitle *"Deep, warm, mentor tone"*
  - [ ] 3.3 Persist selection to `CoachProfile.voicePreference` before chat starts
  - [ ] 3.4 Add Settings section (avatar menu or `/settings`) to change voice without re-onboarding
  - [ ] 3.5 Optional accent styling on Coach avatar/header based on selection (subtle, not stereotyped)

- [ ] 4.0 Onboarding agent (Groq)
  - [ ] 4.1 Create `netlify/functions/onboarding-agent.js` — fork patterns from `interview-agent.js` (rate limit, CORS, demo fallback)
  - [ ] 4.2 System prompt: Coach persona, fiduciary tone, slot-filling for role/target/timeline/stack/mission/weak areas
  - [ ] 4.3 JSON output schema: `{ reply, topicsComplete, topicsTotal, profilePatch?, onboardingComplete? }`
  - [ ] 4.4 When `onboardingComplete: true`, emit full `CoachProfile` including `recommendedLeafIds` from skill tree
  - [ ] 4.5 Add `src/utils/coachAgent.ts` — `sendCoachMessage()`, offline demo replies for demo mode
  - [ ] 4.6 Rate limit: 20 messages/session, 5 sessions/day (reuse `_shared/rateLimit.js`)

- [ ] 5.0 Coach chat UI & `/coach` route
  - [ ] 5.1 Create `src/components/coach/CoachChat.tsx` — message list, input, typing indicator (no code editor)
  - [ ] 5.2 Progress bar: "Getting to know you (N/7 topics)" from agent metadata
  - [ ] 5.3 Create `src/pages/CoachPage.tsx` — voice picker → chat flow; header "Coach · Your career agent"
  - [ ] 5.4 Gate save behind auth: preview allowed, prompt login to continue after ~2 exchanges
  - [ ] 5.5 Add `src/components/coach/CoachCompletionCTA.tsx` — buttons: See your jobs · Start skill path · Run mock interview
  - [ ] 5.6 Register `/coach` in `App.tsx`; redirect authenticated incomplete users here post-login
  - [ ] 5.7 Persist transcript in coachStorage; restore on return visit

- [ ] 6.0 Job matching — "For you" tab
  - [ ] 6.1 Add `src/utils/jobMatching.ts` — score jobs vs `CoachProfile` (track, remote, mission, keyword overlap on title/description)
  - [ ] 6.2 Return `{ score, whyOneLine, prepTrack }` per job; sort descending
  - [ ] 6.3 Optional: `netlify/functions/job-rerank.js` — Groq rerank top 20 for richer "why" copy
  - [ ] 6.4 Update `src/pages/JobsPage.tsx` — tabs: **All** | **For you** (hidden if no profile)
  - [ ] 6.5 Job card: match badge (e.g. "Strong fit · 87%"), expandable why, Save button
  - [ ] 6.6 Log `job_view` / `job_save` to coach-profile or analytics endpoint
  - [ ] 6.7 Add `src/utils/jobMatching.test.ts` — fixture profile + expected ordering

- [ ] 7.0 Warm intro drafts (manual send)
  - [ ] 7.1 Create `netlify/functions/intro-agent.js` — input: job, coachProfile, talentProfile; output: email + LinkedIn drafts JSON
  - [ ] 7.2 Include talent profile slug, top thinking score, ship count in draft body when available
  - [ ] 7.3 Add `src/components/coach/IntroDraftModal.tsx` — tabs Email | LinkedIn, Copy, mailto, Open LinkedIn
  - [ ] 7.4 Wire "Draft intro" on saved/interested jobs in JobsPage
  - [ ] 7.5 Persist drafts via `intro_drafts` table; show history per job
  - [ ] 7.6 Enforce tier limits: 3 drafts/mo free, unlimited on Sprint/Season (read from `subscriptionStorage.ts`)

- [ ] 8.0 Skill tree — hybrid progression (Model C)
  - [ ] 8.1 Extend `content/fundamentals/skill-tree.json` — add `belt`, `prerequisites`, `segment` (`fundamentals` | `branch`), `lessonScriptId`
  - [ ] 8.2 Define fundamentals chain (5 leaves): e.g. decomposition → arrays → strings → behavioral-basics → communication
  - [ ] 8.3 Gate branch leaves until fundamentals complete; branch = `CoachProfile.targetTrack`
  - [ ] 8.4 Add `src/utils/skillProgress.ts` — `isLeafUnlocked()`, `completeLeaf()`, sync to Neon
  - [ ] 8.5 Update `src/data/loadSkillTree.ts` — expose ordered fundamentals + branch for track
  - [ ] 8.6 Update `SkillTreePanel.tsx` — locked/available/complete states, belt stripe, pulse on next leaf
  - [ ] 8.7 Banner on `SkillTreesPage`: "Coach picked this path" + link to `/coach` if incomplete
  - [ ] 8.8 Add text lessons: `content/lessons/{leafId}.md` for each fundamentals + branch leaf (Phase 1 minimum: fundamentals only)
  - [ ] 8.9 Leaf detail panel: read lesson → mark complete → CTA Practice (drill/mock)

- [ ] 9.0 Entry flow, navigation & homepage
  - [ ] 9.1 Post-login router: incomplete onboarding → `/coach`; complete → `/daily` (or last visited)
  - [ ] 9.2 Homepage "I'm job hunting" → `/login` (or `/coach` if authed)
  - [ ] 9.3 Avatar dropdown: Coach · Settings · Sign out
  - [ ] 9.4 Protect `/coach` profile save + `/jobs?tab=for-you` + intro drafts behind auth
  - [ ] 9.5 Update `tasks/brief-verve-pipeline.md` cross-link if needed (optional)

- [ ] 10.0 Phase 2 — ElevenLabs voice lessons (full skill tree)
  - [ ] 10.1 Create `content/voice/coach-voices.json` — audition and document male + female ElevenLabs voice IDs
  - [ ] 10.2 Generate 10s preview clips for voice picker ("Hi, I'm Coach…")
  - [ ] 10.3 Write `lessonScript` in each leaf JSON or `content/lessons/{id}.md` (batch input for TTS)
  - [ ] 10.4 Implement `scripts/voice-lessons/generate.mjs` — batch both variants per leaf via ElevenLabs API
  - [ ] 10.5 Implement `scripts/voice-lessons/upload.mjs` — upload MP3s to Netlify Blobs or static `public/audio/lessons/`
  - [ ] 10.6 Extend skill-tree leaf schema: `audioUrlMale`, `audioUrlFemale`, `durationSec`, `scriptVersion`
  - [ ] 10.7 Add `src/components/skills/LessonAudioPlayer.tsx` — play/pause, transcript, respect `voicePreference`
  - [ ] 10.8 Wire `DailyPracticePage` step 1 to current unlocked leaf lesson (audio if available, else text)
  - [ ] 10.9 Voice picker: play preview clips on card tap (Phase 2)

- [ ] 11.0 Phase 3 — Future (out of v1 scope; track only)
  - [ ] 11.1 Automated email send (Resend) with double opt-in
  - [ ] 11.2 LinkedIn intro queue / compliance review
  - [ ] 11.3 Voice Coach onboarding (STT + ElevenLabs realtime)
  - [ ] 11.4 Jill-side: employer match from Coach network

- [ ] 12.0 Verification & documentation
  - [ ] 12.1 Run `npm run build` — fix type errors
  - [ ] 12.2 Manual test: login → voice pick → coach chat → profile saved → For you jobs → intro draft copy
  - [ ] 12.3 Manual test: skill tree unlock flow after onboarding
  - [ ] 12.4 Document env vars in `tasks/DEMO-WEEK.md` or README snippet: `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`, `ELEVENLABS_API_KEY`
  - [ ] 12.5 Remind deploy: hard refresh for PWA cache
