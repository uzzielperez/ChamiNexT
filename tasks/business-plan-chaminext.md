# ChamiNext Business Plan

> **Canonical strategy doc** (June 2026). Supersedes the “talent ecosystem” framing in `strategy-overview.md`.

## 1. Executive summary

**ChamiNext** is the daily practice and evaluation layer for engineering in the AI era: adaptive AI interviews, time-boxed **Ship Tests**, and employer **Interview Studio**—not a LeetCode clone or generic talent marketplace.

**Wedge:** Mobile-first **PWA daily loop** (10–20 min): lesson bite, one problem, optional ship micro-task.

**Thesis:** Shipping and reasoning beat memorization. Hiring signal comes from interviews + shipped URLs, not puzzle count.

---

## 2. Problem / solution

### Engineers
- Algorithmic grind does not match AI-assisted, product-shaped work.
- No portable signal for “can ship” in 24–72 hours.

### Companies
- Interviews poorly predict job performance.
- Need standardized product-building assessment.

### Solution
1. **AI Interview Simulator** — Socratic, rubric-scored sessions (software + AI-engineer tracks).
2. **Ship Tests** — 24h / 72h / 7d builds with PM briefs and AI review.
3. **Interview Studio (B2B)** — Role templates, candidate comparison, demo hiring profiles.

---

## 3. Product lines

| Line | Offering | Pricing (current UI) |
|------|----------|----------------------|
| **B2C Free** | 2 interviews/day, 1 Ship Test/mo, basic profile | €0 |
| **B2C Pro** | Unlimited interviews, roadmap, score replay | €19/mo |
| **B2C Builder** | All Ship formats, portfolio export, product reviewer | €49/mo |
| **B2C Premium** | System design sims, elite mocks, deep coaching | €89/mo |
| **B2B Interview Studio** | Employer dashboard, seeded candidates, role packs | €500–10k/mo (target ACV bands) |
| **Mobile Daily (PWA)** | Streaks, bites, daily problem, ship micro | Retention driver for Pro/Builder |

**Courses:** Premium IP (RAG, Agents, Vibe Coding, Fullstack AI) linked via `course-map.json` to practice prompts and Ship Tests—not a separate video platform in v1.

---

## 4. Revenue model & unit economics (targets)

| Metric | Target (Year 1) |
|--------|------------------|
| B2C conversion (free → paid) | 4–8% |
| B2C ARPU (paid blend) | ~€35/mo |
| CAC (organic-first) | &lt; €40 |
| LTV (12-mo paid retention) | &gt; €250 |
| B2B ACV | €6k–48k/yr |
| Gross margin | &gt; 80% (SaaS + API costs) |

**Optional Phase 3:** Placement fee on hires sourced through verified Ship Test + interview signal (not core in demo quarter).

---

## 5. Go-to-market

1. **Content-led:** Reddit / LinkedIn / YouTube — mock AI interviews, Ship Test teardowns, “daily 15 min” habit posts.
2. **Bootcamp partnerships:** White-label practice + Ship Test cohorts; rev-share on Builder tier.
3. **Employer wedge:** Interview Studio demo with seeded profiles; land 3–5 design partners pre-Stripe B2B billing.
4. **PWA install:** “Add to Home Screen” CTA on `/daily` for retention.

---

## 6. Roadmap

| Quarter | Focus |
|---------|--------|
| **Q1 (demo)** | 45-question bank, 8 Ship Tests, demo mode, Interview Studio preview, PWA daily |
| **Q2** | Scale content (150+ prompts), Neon auth, production Groq/Stripe |
| **Q3** | PWA retention features, offline queue, employer billing |
| **Q4** | B2B Stripe, team seats, API for ATS integrations |

---

## 7. Moat

- **Ship Tests** as standardized “ship URL” credential.
- **AI-native rubrics** (thinking, decomposition, communication, code/design quality).
- **Dual tracks** (classic CS + AI engineering) tied to course IP.
- **Hiring profile** combining sessions + ship outcomes—not commodity DSA volume.

---

## 8. Risks (from PRD)

| Risk | Mitigation |
|------|------------|
| Commodity interview prep | Ship Tests + AI track differentiation |
| API cost (LLM) | Rate limits, demo mode, tier gating |
| Content licensing | Original + attributed rewrites only; no LeetCode scrape |
| B2B sales cycle | Design partners + demo seed data |
| Mobile without native app | PWA first; native Phase 2 |

---

## 9. Success metrics (12 months)

- 10k MAU on practice/daily routes
- 500 paying B2C subscribers
- 10 B2B pilots → 3 paid Interview Studio accounts
- Median 4+ day streak among PWA installers
- NPS &gt; 40 on Ship Test completers

---

## 10. Open questions

- Stripe price localization (EUR vs USD landing)?
- First native app store timing vs PWA maturity?
- Which ATS integrations matter for B2B v1?

**Related docs:** `tasks/prd-chaminext-ai-interview-platform.md`, `PRODUCT.md`, `DESIGN.md`, `tasks/DEMO-WEEK.md`.
