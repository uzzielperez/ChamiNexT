# NotebookLM → Project Walkthrough Coaching

How to generate Coach audio and study guides for **"Walk me through a project you built"**
— the onsite / HM round that tests decisions, deployment, tests, and PRs, not LeetCode.

Aligned with ChamiNexT principles: **Shipping > Solving**, **Real output is the only signal**.

Patterns borrowed from [career-ops](https://github.com/santifer/career-ops): STAR+R story bank,
Interview Pack (one-pager + demo + postmortem), and treating PRs/tests as *evidence*, not vanity metrics.

---

## Goal

Produce **Spotify-style episodes** for `/coaching/project-walkthrough` with:

- The 10-minute answer spine (hook → decisions → execution → failure → results → reflection)
- Deep dives on **deployment platform**, **unit/integration tests**, and **PR artifacts**
- Musk-style engineering judgment (question requirements → delete → simplify → accelerate → automate)
- Follow-up probes interviewers actually use (from intel + VERVE-style loops)
- Optional 12–15 min NotebookLM Audio Overview per episode → ElevenLabs Coach MP3

---

## Source files (upload to NotebookLM)

Upload from the ChamiNexT repo into one notebook:

| File | Why |
|------|-----|
| `content/coaching/notebooklm-sources/project-walkthrough-master-guide.md` | Canonical framework (this brief's companion) |
| `content/coaching/project-walkthrough-playlists.json` | Episode structure, sample Qs, rubrics |
| `content/ship-tests/challenges.json` | Work Ticket PR/test/deployment constraints |
| `PRODUCT.md` | ChamiNexT positioning: ship tests, reasoning, real output |
| `netlify.toml` + `vite.config.ts` | Deploy exemplar: Vite SPA + Netlify Functions |
| `tasks/learnings-interview-intel.md` | Field data: behavioral + full-loop prep |

Optional external (summarize in your own words; do not paste copyrighted threads):

- Elon Musk Starbase engineering algorithm (requirements → delete → simplify → accelerate → automate)
- Public writeups on project-defense interviews (Airbnb/BitGo-style decision logs)

---

## NotebookLM workflow

### 1. Create notebook

1. [notebooklm.google.com](https://notebooklm.google.com) → New notebook
2. Add sources above
3. Name: `ChamiNexT — Project Walkthrough`

**Pro tip:** Generate Study Guide + FAQ inside NotebookLM → **Convert all notes to source** →
one consolidated cheat sheet. Point Audio Overview customization at that source only.

### 2. Per-episode script prompt

For each episode in `project-walkthrough-playlists.json`, run:

```text
Using only the sources, create a 12-minute Coach script for "{episode title}".

Include:
1. What the interviewer is really testing (one paragraph)
2. Three exact questions they ask, with realistic follow-ups
3. Strong answer framework (bullet outline — NOT a fabricated personal story)
4. Three weak answer patterns and why they fail
5. One section on deployment OR tests OR PRs (per episode focus)
6. One Musk-algorithm or DTS (Decision / Tradeoff / Signal) lens
7. A 30-second closing: what to practice on ChamiNexT today (mock, Ship Test, or coaching episode)

Tone: direct, senior engineer coaching a friend. No fluff. No "according to the sources."
```

### 3. Audio Overview — Customize prompt

Paste into **Customize → What should the AI hosts focus on?**:

```text
Create a mock technical interview coaching session for ChamiNexT users preparing for
"walk me through a project you built."

Hosts: Host A (engineering manager, behavioral + scope), Host B (staff engineer who probes
deployment, unit tests, and pull requests).

Three acts:
Act 1 — Why this question is a decision-defense exercise, not a feature tour. Introduce
the 10-minute spine and STAR+R Reflection. Mention that ChamiNexT Ship Tests train the
same muscle: scoped ticket, tests, PR.

Act 2 — Walk beat-by-beat through the answer spine. For execution, ALWAYS cover:
(a) deployment platform choice and rollout/rollback,
(b) what unit vs integration tests protect,
(c) how PRs tell the story (never PR count as bragging).

Act 3 — Simulated deep-dive: "Pick a PR and walk me through it" and "How did you test
before prod?" Coach the ideal structure. End with one Reflection line that signals seniority.

Rules:
- Do not say "the source material" or "the documents."
- Include one rookie mistake vs strong answer contrast per act.
- Audience: junior–mid engineers, career switchers, AI/ML engineers.
- Length: default or longer.
```

### 4. Export into ChamiNexT

Save each script:

```
content/coaching/scripts/project-walkthrough-{episode-id}.md
```

Extend episode JSON:

```json
{
  "coachScriptPath": "content/coaching/scripts/project-walkthrough-deployment.md",
  "notebookLmGeneratedAt": "2026-07-14"
}
```

ElevenLabs batch: same pipeline as `tasks/brief-notebooklm-soft-skills.md`.

---

## What stays in the app vs NotebookLM

| In app (structured) | NotebookLM (generative) |
|---------------------|-------------------------|
| Sample questions + rubrics in JSON | Long-form Coach monologue |
| Mock interview via `practiceProblemId` | Podcast-style overview for listening |
| Ship Test tickets (PR + tests) | Draft scripts for ElevenLabs |
| Strong/weak signals for scoring | Brainstorm follow-up probes |

Never paste NotebookLM output into rubrics without human review.

---

## Success criteria

- `/coaching/project-walkthrough` live with 6 episodes
- Each card answers: **"What interview problem am I solving?"**
- At least 3 episodes link to a mock `practiceProblemId`
- Hiring journey `/journey` links project walkthrough from **Pairing & final loop** stage
- Users can practice the same skills they need for Ship Test PR submission
