# Coach Onboarding — Implementation Tasks

**PRD:** `tasks/prd-coach-onboarding.md`  
**IP / lineage:** `tasks/learnings-jack-and-jill.md`  
**Last synced to `main`:** 2026-07-14  
**Branch suggestion:** `feature/coach-onboarding` (work landed on `main`)

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
- `netlify/functions/_shared/coachStore.js` — **shipped** (Netlify Blobs + memory); `neon.js` still pending
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
- **Storage divergence:** PRD specified Neon; runtime uses `coachStore.js` (Blobs + memory). `migrate-coach.sql` ready for Neon cutover.
- Fundamentals belt = **5 leaves** (`coach-progression.json`: decomposition → arrays → strings → trees → debugging).
- Intro drafts = **3/mo free**, unlimited Sprint (`coachStorage.ts`).
- Unit tests: `jobMatching.test.ts` still pending.
- Run `npm run build` after each parent task milestone.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, check it off in this markdown file by changing `- [ ]` to `- [x]`.

Example: `- [ ] 1.1 Read file` → `- [x] 1.1 Read file`

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Work merged to `main` (feature branch optional)
  - [ ] 0.2 Confirm `GROQ_API_KEY` in Netlify env; **`DATABASE_URL` / Neon not wired in prod**

- [x] 1.0 Magic-link auth (Neon schema drafted; Blobs runtime)
  - [x] 1.1 `scripts/db/migrate-coach.sql`
  - [ ] 1.2 `netlify/functions/_shared/neon.js` — **not implemented**; using `coachStore.js` (Blobs + memory)
  - [x] 1.3 `netlify/functions/_shared/auth.js`
  - [x] 1.4 `auth-magic-link.js` (demo: returns `verifyUrl` when email not configured)
  - [x] 1.5 `auth-verify.js` (JWT session; user id from email hash)
  - [x] 1.6 `LoginPage.tsx`
  - [x] 1.7 `/login`, `/auth/callback` in `App.tsx`
  - [x] 1.8 `authSession.ts` (no React hook — functions only)
  - [x] 1.9 Header Sign In + Meet Coach when authed (`PremiumHeader.tsx`)

- [x] 2.0 Coach profile types & persistence (partial server sync)
  - [x] 2.1 `src/types/coach.ts`
  - [x] 2.2 `coachStorage.ts` — local + `syncCoachProfileToServer` / `fetchCoachProfileFromServer`
  - [x] 2.3 `coach-profile.js` (Blobs-backed)
  - [ ] 2.4 Full localStorage migration (`interviewStorage`, `dailyStorage`, skill progress) on login
  - [ ] 2.5 `profileSlug.ts` linked to `user_id` (slug used in intros; not server-bound)

- [x] 3.0 Voice preference picker (Coach persona)
  - [x] 3.1 `VoicePreferencePicker.tsx`
  - [x] 3.2 Copy on CoachPage + Settings
  - [x] 3.3 Persist `voicePreference` before chat
  - [x] 3.4 `/settings` voice change
  - [ ] 3.5 Optional accent styling on Coach avatar

- [x] 4.0 Onboarding agent (Groq)
  - [x] 4.1 `onboarding-agent.js`
  - [x] 4.2 Fiduciary Coach system prompt + topic slots
  - [x] 4.3 JSON schema with `profilePatch`, `onboardingComplete`
  - [x] 4.4 Full `CoachProfile` on complete + `recommendedLeafIds`
  - [x] 4.5 `coachAgent.ts`
  - [ ] 4.6 Dedicated rate limit (inherits shared patterns; not separately tuned)

- [x] 5.0 Coach chat UI & `/coach` route
  - [x] 5.1 `CoachChat.tsx`
  - [x] 5.2 Topics progress (N/7)
  - [x] 5.3 `CoachPage.tsx`
  - [x] 5.4 Auth gate after ~1 user message
  - [x] 5.5 `CoachCompletionCTA.tsx`
  - [x] 5.6 `/coach` + `AuthCallbackPage` → `/coach` or `/journey`
  - [x] 5.7 Transcript persist/restore

- [x] 6.0 Job matching — "For you" tab (mostly)
  - [x] 6.1 `jobMatching.ts`
  - [x] 6.2 `score`, `whyOneLine`, `prepTrack`, `fitLabel`
  - [ ] 6.3 `job-rerank.js` (optional Groq rerank)
  - [x] 6.4 JobsPage **All** | **For you**
  - [x] 6.5 Match badge + save
  - [ ] 6.6 `job_view` / `job_save` analytics endpoint
  - [ ] 6.7 `jobMatching.test.ts`

- [x] 7.0 Warm intro drafts (manual send; local history)
  - [x] 7.1 `intro-agent.js`
  - [x] 7.2 Profile slug + talent summary in drafts
  - [x] 7.3 `IntroDraftModal.tsx`
  - [x] 7.4 Draft intro on JobsPage
  - [ ] 7.5 Server `intro_drafts` table (local `chaminext_intro_history` only)
  - [x] 7.6 Tier limits via `canCreateIntroDraft`

- [x] 8.0 Skill tree — hybrid progression (Model C)
  - [x] 8.1 `coach-progression.json` + `skillProgress.ts` (belt via fundamentals chain)
  - [x] 8.2 Five fundamentals: decomposition → arrays → strings → trees → debugging
  - [x] 8.3 Branch gated until fundamentals complete
  - [x] 8.4 `skillProgress.ts` — unlock/complete (**localStorage**; Neon sync pending)
  - [x] 8.5 Fundamentals path exposed to Daily + SkillTrees
  - [x] 8.6 `SkillTreePanel.tsx` unlock states
  - [x] 8.7 `SkillTreesPage` Coach banner
  - [ ] 8.8 Text lessons — only `decomposition.md`; scripts mostly in `audio-manifest` / manifest builder
  - [x] 8.9 Lesson player + practice CTA on tree (`LessonAudioPlayer`, `/lessons`)

- [x] 9.0 Entry flow, navigation & homepage (partial)
  - [x] 9.1 Post-login: incomplete → `/coach`; complete → `/journey` (not `/daily` — daily redirects to journey)
  - [x] 9.2 Homepage CTA → `/login` or `/coach` if authed
  - [x] 9.3 Header: Meet Coach, Settings (`/settings`)
  - [x] 9.4 Auth gate on Coach save; intros tier-gated
  - [ ] 9.5 `brief-soft-skills-pipeline.md` cross-link

- [x] 10.0 Phase 2 — ElevenLabs voice lessons (substantial)
  - [x] 10.1 `coach-voices.json`
  - [x] 10.2 Preview clips (`public/audio/coach/`)
  - [x] 10.3 Scripts via `build-lesson-manifest.mjs` + skill-tree fundamentals
  - [x] 10.4 `scripts/voice-lessons/generate.mjs`
  - [ ] 10.5 `upload.mjs` — MP3s committed under `public/audio/lessons/` (no separate upload script)
  - [x] 10.6 `audio-manifest.json` — male/female URLs per leaf (~36 leaves)
  - [x] 10.7 `LessonAudioPlayer.tsx`
  - [x] 10.8 `DailyPracticePage` uses `getCurrentDailyLeaf`
  - [x] 10.9 `VoicePreviewButton.tsx` on picker

- [ ] 11.0 Phase 3 — Future (out of v1 scope; track only)
  - [ ] 11.1 Automated email send (Resend) with double opt-in
  - [ ] 11.2 LinkedIn intro queue / compliance review
  - [ ] 11.3 Voice Coach onboarding (STT + ElevenLabs realtime) — **Jack & Jill pattern rejected for v1**
  - [ ] 11.4 Jill-side: employer match from Coach network

- [x] 12.0 Verification & documentation (partial)
  - [x] 12.1 `npm run build` passes
  - [ ] 12.2 Manual E2E test checklist run
  - [ ] 12.3 Skill tree E2E verified
  - [ ] 12.4 Env vars documented in README / DEMO-WEEK
  - [x] 12.5 `tasks/learnings-jack-and-jill.md` + synced task list (this file)
