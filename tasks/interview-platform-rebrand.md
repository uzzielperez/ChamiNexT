# ChamiNext Rebrand (legacy notes)

> **Canonical spec:** `tasks/prd-chaminext-ai-interview-platform.md`  
> **Implementation tasks:** `tasks/tasks-chaminext-mvp.md`

# ChamiNext Rebrand: AI-Era Interview Platform

## Positioning (one sentence)

**ChamiNexT is interview prep for the post-AI hiring loop**—practice, pair with AI like on the job, and give employers proof beyond LeetCode green checks.

## Thesis vs LeetCode / HackerRank

| Them | ChamiNexT |
|------|-----------|
| Optimize for puzzle throughput | Optimize for **readiness** (DSA + system design + AI-era judgment) |
| Binary pass/fail on tests | **Signals**: reasoning, communication, AI collaboration |
| Hiring is a separate product | **Practice → profile → hire** on one platform |
| AI = cheating risk | AI = **co-pilot** with guardrails (hints, mocks, no dump-solutions) |

## Landing page copy (locked)

- **Badge:** Not LeetCode. Built for interviews after AI.
- **Headline:** Practice like a pro. Think like one.
- **Sub:** Algorithms, system design, and AI-era skills—with an AI co-pilot, not a cheat sheet. Companies hire from proof, not puzzle counts.
- **Thesis line:** LeetCode measures recall. We measure readiness.

---

## Monetization strategy

### Principle

Two sides of the market: **candidates** (volume, low ARPU, viral) and **companies** (low volume, high ARPU). Free tier must be good enough for personal daily use; revenue comes from depth, speed, and hiring tools.

### Tier 1 — Candidates (B2C)

| Plan | Price | What you get |
|------|-------|----------------|
| **Free** | $0 | Limited problems/day, basic AI hints, public profile stub, 1 mock interview/month |
| **Pro** | $19–29/mo | Unlimited practice, full AI co-pilot, system design library, unlimited mocks, streak analytics, exportable prep report |
| **Pro Annual** | $149–199/yr | ~2 months free; priority new content (company-tagged question sets) |

**Add-ons (à la carte):**
- Company-specific packs (FAANG-style, startup, fintech): $29–49 one-time
- “Interview week” intensive: $79 (7-day structured plan + 3 live-style mocks)
- CV + outreach polish (existing CV iterator): $9–19 per run or bundled in Pro

**Why people pay:** Speed to offer, better mocks than ChatGPT alone, structured loop, proof artifact for recruiters.

### Tier 2 — Companies (B2B) — primary revenue

| Plan | Price | What you get |
|------|-------|----------------|
| **Starter** | $299/mo | 3 active roles, 50 assessed candidates/mo, standard question bank |
| **Growth** | $799/mo | 10 roles, 250 assessments, custom assessments, pipeline CRM-lite, team seats (3) |
| **Enterprise** | Custom ($2k–10k+/mo) | SSO, API, white-label assessments, on-prem option, dedicated support, unlimited seats |

**Per-unit upsells:**
- **Per assessed candidate:** $8–15 (after plan cap)—aligns with HackerRank-style usage
- **Per hire placement fee (optional):** 8–12% first-year salary for roles filled via platform (only if you run full recruiting; otherwise skip)
- **Sponsored challenges:** Brands pay $5k–25k for branded tracks + leaderboard (devrel / university)

### Tier 3 — Education & certs (later)

- University / bootcamp site licenses: $3–8 per seat/month (min 50 seats)
- Verified skill badge (proctored assessment): $99–199 per attempt
- Course bundles (existing marketplace courses) cross-sold to Pro at 20% discount

### Revenue mix (target at scale)

- **Year 1:** 70% B2B (assessments + subscriptions), 25% B2C Pro, 5% add-ons/courses  
- **Year 2+:** B2B 60%, B2C 30%, sponsored + education 10%

### Metrics that matter

- **Candidate:** DAU practicing, problems/week, mock completion rate, free → Pro conversion (target 3–5%)
- **Company:** Active roles, assessments/month, time-to-hire, candidate quality score vs baseline
- **North star:** Verified interviews booked from platform profiles

### Go-to-market (low burn)

1. **Dogfood:** You + small peer group practice daily; content = real interview loops you run.
2. **Content SEO:** “System design with AI”, “mock interview AI co-pilot”, company-specific prep guides.
3. **Community:** Weekly public mock, Discord, shareable prep reports.
4. **B2B wedge:** Startups hiring 1–5 eng/quarter—cheaper than HackerRank Enterprise, AI-native rubrics as differentiator.
5. **Integrations:** Greenhouse/Lever export, LinkedIn “ChamiNexT verified” badge (later).

### What to deprioritize (simplify)

- Large marketplace of unrelated digital products (keep courses as “Learn”, demote in nav)
- Heavy CRM/travel/event products unless they fund the core loop
- Premium design for its own sake—keep premium UI, fewer surface areas

---

## Product roadmap (aligned with monetization)

### Phase A — Personal use (now)
- [ ] Problem workspace (code + tests + AI hint panel)
- [ ] Progress dashboard (streak, topics weak/strong)
- [ ] Mock interview mode (timed, rubric feedback)

### Phase B — Proof & hire
- [ ] Public candidate profile (attempts, mocks, badges)
- [ ] Employer job posts + applicant inbox
- [ ] Custom assessments per role

### Phase C — Monetize
- [ ] Stripe Pro subscription
- [ ] Company Starter plan + assessment credits
- [ ] Usage billing over caps

---

## Open decisions

1. **Brand name:** Keep ChamiNexT or rename (e.g. shorter, interview-specific)?
2. **AI policy:** Show “AI-assisted attempt” flag to employers—transparent vs hidden?
3. **Free tier limits:** Daily cap vs weekly cap for sustainable COGS on AI calls?
