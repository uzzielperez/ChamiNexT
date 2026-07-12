# NotebookLM → Soft Skills & Ethics Coaching

How to generate in-depth Coach audio and study guides from ChamiNexT rubrics, then wire them into the app.

## Goal

Produce **Spotify-style episodes** for the **Ethics & Soft Skills Interview** playlist (`/coaching/ethics-soft-skills`) with:

- Sample questions interviewers ask
- Strong vs weak answer patterns
- Follow-up probes
- Optional 10–15 min “deep dive” audio per episode

NotebookLM is ideal for **synthesizing rubrics into conversational coaching** — not for replacing the structured JSON we ship in the app.

---

## Source files (upload to NotebookLM)

Upload these from the ChamiNexT repo as a single notebook:

| File | Why |
|------|-----|
| `content/employers/verve-soft-skills.json` | Canonical VERVE 5-phase rubrics |
| `content/question-bank/verve-soft-skills.json` | Practice prompts |
| `content/coaching/soft-skills-playlists.json` | Episode structure + frameworks |
| `content/frontier-problems/tests.json` | Ethics probes (dual-use, mission) |
| `tasks/brief-verve-pipeline.md` | Pipeline context |

Optional: your own STAR stories, company-specific values docs, or exported Glassdoor/Blind threads (respect copyright — summarize in your own words).

---

## NotebookLM workflow

### 1. Create notebook

1. Go to [notebooklm.google.com](https://notebooklm.google.com)
2. New notebook → **Add sources** → upload the files above
3. Name: `ChamiNexT — Ethics & Soft Skills`

### 2. Generate study material per episode

For each VERVE phase, run a prompt like:

```text
Using only the sources, create a 12-minute Coach script for "VERVE Phase 2: Pushback on No".

Include:
1. What the interviewer is really testing (one paragraph)
2. Three exact questions they ask, with follow-ups
3. A strong STAR outline (bullet points, not a fake personal story)
4. Three weak answer patterns and why they fail
5. One ethics-adjacent variant for a mission-driven company
6. A 30-second closing: what to practice on ChamiNexT today

Tone: direct, senior engineer coaching a friend. No fluff.
```

Repeat for phases 1–5 plus ethics episodes.

### 3. Audio Overview (optional)

- NotebookLM → **Audio Overview** → generates a podcast-style discussion
- Good for **your own listening** and drafting; export is limited
- For **production Coach voice** in the app, copy the script into `content/coaching/scripts/` and run ElevenLabs batch (see below)

### 4. Export scripts into ChamiNexT

Save each script as:

```
content/coaching/scripts/{episode-id}.md
```

Example: `content/coaching/scripts/verve-pushback.md`

Then extend `content/coaching/soft-skills-playlists.json`:

```json
{
  "id": "verve-pushback",
  "coachScriptPath": "content/coaching/scripts/verve-pushback.md",
  "notebookLmGeneratedAt": "2026-07-12"
}
```

### 5. ElevenLabs batch (same pipeline as skill lessons)

Add to `scripts/voice-lessons/build-lesson-manifest.mjs` or a sibling script `scripts/voice-lessons/build-coaching-manifest.mjs` that reads coaching scripts and outputs URLs under `public/audio/coaching/`.

Run:

```bash
npm run lessons:generate   # or future: npm run coaching:generate
```

---

## Custom cover images (Spotify-style)

Today: **gradient + icon** per card (`src/data/lessonCovers.ts`, episode `cover` in JSON).

To add real artwork:

1. Generate 512×512 covers in NotebookLM / Midjourney / Figma — one visual metaphor per skill (e.g. scales for pragmatism, shield for ethics)
2. Save to `public/images/coaching/{episode-id}.webp`
3. Add `"coverImage": "/images/coaching/verve-pushback.webp"` to episode JSON
4. Update `CoverCard.tsx` to prefer `coverImage` over gradient when present

---

## What stays in the app vs NotebookLM

| In app (structured) | NotebookLM (generative) |
|---------------------|-------------------------|
| Sample questions list | Long-form Coach monologue |
| Strong/weak rubrics | Podcast-style overview for you |
| Mock interview routing | Draft scripts for ElevenLabs |
| Spotify card metadata | Brainstorm follow-up questions |

Never paste NotebookLM output into rubrics without human review — behavioral scoring must stay aligned with `verve-soft-skills.json`.

---

## Success criteria

- User lands on `/journey` and sees **full hiring loop** in one glance
- **Ethics & Soft Skills** playlist has 7 episodes with Q&A visible without audio
- At least 5 episodes have Coach MP3 generated from NotebookLM scripts
- Each card answers: **“What interview problem am I solving?”**
