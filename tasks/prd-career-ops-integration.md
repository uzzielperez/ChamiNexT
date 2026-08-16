# PRD: career-ops integration (optional power-user bridge)

> **Status:** Draft — scoped as **optional**, not core product dependency  
> **Author:** Product — July 2026  
> **IP note:** [career-ops](https://github.com/santifer/career-ops) is MIT-licensed OSS by Santiago Fernández de Valderrama Aparicio (`santifer`). The **career-ops** name is [trademark-governed](https://github.com/santifer/career-ops/blob/main/TRADEMARK.md). ChamiNexT may use **patterns and MIT code** with attribution; do not brand ChamiNexT features as “career-ops” or imply official endorsement.

---

## 1. Problem

Power users (founder, early adopters) may run **two loops**:

| Tool | Strength |
|------|----------|
| **ChamiNexT** | Interview readiness, Ship Tests, mocks, talent profile, employer-facing signal |
| **career-ops** (local CLI) | JD evaluation (A–F), CV tailoring, application tracking, portal scan, STAR+R story bank |

Today these are **disconnected**. Users duplicate effort: evaluate a role in career-ops, then manually find prep in ChamiNexT.

**Non-problem:** Replacing ChamiNexT Jobs board with career-ops scanner — different architecture (local-first CLI vs static SPA + GitHub Action refresh).

---

## 2. ChamiNexT-original vs borrowed (IP clarity)

### ChamiNexT owns (do not attribute to career-ops)

- Ship Tests, AI interview rubric, Interview Loop, Drill, Interview Intel scrape
- Coach onboarding, “For you” matching **for practice** (not application automation)
- Soft-skills coaching, quant HM playlists, project walkthrough coaching
- Netlify-hosted product, PWA, Interview Studio employer demo

### career-ops owns (respect MIT + trademark)

- A–G evaluation blocks, archetype detection, `modes/oferta.md` scoring
- CV PDF/LaTeX pipeline, `data/applications.md` tracker
- Portal scanner (`scan.mjs`), batch eval workers
- STAR+R in Block F, `interview-prep/story-bank.md` convention
- Local-first, human-in-the-loop, no auto-submit doctrine

### Shared patterns (industry-common — integrate as conventions, not clones)

- STAR / STAR+R behavioral stories
- JD → prep mapping
- “Interview Pack” (one-pager + demo + postmortem) — career-ops `modes/project.md`; ChamiNexT project walkthrough playlist

**Uzziel’s fork** (`github.com/uzzielperez/career-ops`) is a **personal/dev fork** for job search automation — not a ChamiNexT submodule. Any integration is **export/import or deep-link**, not merging codebases.

---

## 3. Goals

| # | Goal | Measure |
|---|------|---------|
| G1 | User can go from evaluated JD → ChamiNexT prep in one click | Bridge UX exists |
| G2 | STAR+R stories sync once (single story bank) | No duplicate story entry |
| G3 | No violation of career-ops trademark or ToS | Legal review of copy |
| G4 | ChamiNexT works fully without career-ops installed | Zero hard dependency |

---

## 4. Non-goals

- Embedding career-ops CLI inside ChamiNexT web app
- Replicating career-ops CV PDF pipeline in Netlify functions (scope explosion)
- Auto-submitting applications from ChamiNexT
- Using career-ops brand on marketing pages (“Powered by career-ops” only if santifer approves)
- Scraping LinkedIn/Glassdoor via career-ops plugins in core product

---

## 5. Integration options (phased)

### Phase A — Pattern alignment only (shipped July 2026)

**No code coupling.** Document shared conventions.

| career-ops artifact | ChamiNexT artifact |
|---------------------|-------------------|
| Block F STAR+R | Project walkthrough coaching + mock problems |
| `modes/project.md` Interview Pack | `project-walkthrough-master-guide.md` checklist |
| Block G posting legitimacy | Future: flag stale jobs in `/jobs` (not started) |

**Status:** Done via content in `content/coaching/` and `tasks/brief-notebooklm-project-walkthrough.md`.

### Phase B — Export / import bridge (recommended next)

**User-initiated file exchange** — local-first on both sides.

1. **Export from career-ops:** `reports/NNN-*.md` → JSON bundle `{ company, role, score, gaps, starStories[], interviewQuestions[] }`
2. **Import to ChamiNexT:** Upload JSON or paste → creates:
   - Saved job card with match context
   - Suggested mock `problemId`s from gaps
   - Coach profile patch (`weakAreas`, `targetTrack`)
3. **Export from ChamiNexT:** Talent profile slug + thinking/ship scores → markdown snippet user pastes into career-ops cover letter mode

**UI surface:** `/settings` → “Import career-ops report” or Coach chat tool call “I evaluated this role locally…”

**Effort:** ~1 week. No career-ops repo dependency in build.

### Phase C — Deep link (optional)

- ChamiNexT job card: “Open in career-ops” → `career-ops://evaluate?url=…` (custom URL scheme) or docs link for `npx @santifer/career-ops init`
- career-ops plugin doc: “Prep on ChamiNexT” → `https://chaminext.netlify.app/practice?track=…`

**Requires:** coordination with upstream or fork-only plugin in `uzzielperez/career-ops` — not in santifer core without issue-first contribution.

### Phase D — Not recommended

- Bundling career-ops `modes/` inside ChamiNexT (dual maintenance, trademark blur)
- Server-hosted career-ops evaluation (violates career-ops local-first doctrine)

---

## 6. Data contract (Phase B sketch)

```json
{
  "version": 1,
  "source": "career-ops",
  "reportId": "042-acme-2026-07-12",
  "company": "Acme AI",
  "role": "ML Engineer",
  "overallScore": 4.2,
  "track": "ai-engineer",
  "gaps": ["system design", "production ML"],
  "starStories": [
    {
      "jdRequirement": "ownership",
      "title": "HCAL LUT",
      "reflection": "Would invest week 1 in observability"
    }
  ],
  "recommendedMocks": ["project-walkthrough-core", "ai-system-design-01"],
  "postingUrl": "https://…"
}
```

ChamiNexT validates schema; unknown fields ignored. **No auto-execution** of career-ops prompts inside browser.

---

## 7. User stories

- **US-1:** As a user who evaluated a JD in career-ops, I want to import the report so ChamiNexT suggests mocks and coaching episodes.
- **US-2:** As a user prepping a project walkthrough, I want one story bank that feeds both career-ops Block F and ChamiNexT mocks.
- **US-3:** As a user, I want my ChamiNexT talent profile link embedded in career-ops-generated cover letters without manual copy-paste.
- **US-4:** As a product owner, I want ChamiNexT to remain usable for users who never heard of career-ops.

---

## 8. Success metrics

| Metric | Target |
|--------|--------|
| Import bridge used | ≥10% of power users in beta |
| Duplicate story entry | ↓ 50% among bridge users |
| Support tickets re trademark | 0 |
| Build depends on career-ops npm package | 0 |

---

## 9. Legal & attribution checklist

- [ ] MIT license preserved if any career-ops code copied (prefer **zero** code copy; schema only)
- [ ] No “career-ops” in ChamiNexT product name or paid tier names
- [ ] Docs say “compatible with career-ops” not “built by career-ops”
- [ ] If promoting integration publicly, credit santifer/career-ops as upstream OSS
- [ ] User data: career-ops stays local; ChamiNexT import is explicit upload — no silent sync

---

## 10. Open questions

1. Publish bridge as ChamiNexT feature or as `uzzielperez/career-ops` plugin only?
2. Should Coach agent accept pasted career-ops report markdown natively (LLM parse) vs strict JSON?
3. Posting legitimacy (Block G): share heuristic with jobs refresh bot?

---

## 11. Implementation tasks (when approved)

See `tasks/tasks-career-ops-bridge.md` (create on “Go”) — estimated 5–8 subtasks for Phase B only.

---

*Related: `tasks/learnings-jack-and-jill.md`, `content/coaching/project-walkthrough-playlists.json`, personal fork notes in operator docs (not shipped to end users).*
