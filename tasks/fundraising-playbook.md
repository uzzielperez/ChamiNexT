# Fundraising playbook — ChamiNexT

> **Purpose:** Prepare pitches for friends & family ($5–25k), angels ($~100k),
> and seed rounds — with realistic terms, documents, and scripts.
> **Not legal advice.** Incorporate and paper investments with a startup lawyer
> (Switzerland/EU counsel if the company is CH/EU-based).
> **Live demo:** [chaminext.netlify.app](https://chaminext.netlify.app)
> **Deck:** `tasks/pitch-deck-chaminext.md` v1.1

---

## 0. The round ladder (where you are)

```
YOU ARE HERE ──►
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ Friends &       │   │ Pre-seed /      │   │ Seed            │
│ Family          │   │ Angel round     │   │ (institutional) │
│ $5k–$25k/check  │   │ $25k–$150k      │   │ $1M–$3M+        │
│ $25k–$100k total│   │ $100k–$500k tot │   │ $8M–$20M post   │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
    Trust + story        Traction + team         Metrics + market
    SAFE, high cap       SAFE or note            Priced round / SAFE
    No board             Maybe observer          Lead investor + board
```

**Do not skip steps.** F&F money before you can explain the product in one
sentence breeds awkward Thanksgiving dinners. $100k angels before server-side
auth breeds diligence embarrassment.

---

## 1. Before you ask anyone for money

### Must-haves (any check size)

| Item | Status / action |
|------|-----------------|
| Legal entity | GmbH / SA / Ltd — **not** raising into a personal bank account |
| Cap table clean | You ≥85% before first external money; no verbal promises |
| Demo works | [chaminext.netlify.app](https://chaminext.netlify.app) — practice, loop, drill, jobs, pricing |
| One-pager PDF | Problem, solution, ask, use of funds, link (2 pages max) |
| Data room (light) | Deck, this doc, cap table spreadsheet, incorporation docs |

### Nice-to-haves before $100k+

- 1 design-partner conversation (Apex / frontier-science hiring)
- Stripe live or explicit “demo billing → live Q2” timeline
- 10+ real users who completed an interview loop (even friends)
- Monthly investor update template (see §8)

---

## 2. Friends & family — $5k–$25k per person

### Who this is for

People who trust **you**, not the category. Former colleagues, physicist
friends, family who understand this is high-risk. **Not** people you have
relational friction with — if the investment goes to zero, you still need the
relationship.

### The ask (typical round)

| Parameter | Suggested range |
|-----------|-----------------|
| **Total raise** | $50k–$100k (5–10 checks of $5k–$15k) |
| **Instrument** | **SAFE** (YC post-money template) — simplest for everyone |
| **Valuation cap** | **$2M–$4M** (pre-revenue, live product, no revenue yet) |
| **Discount** | 15–20% (optional; cap alone is often enough for F&F) |
| **Board / control** | None. No voting rights beyond standard SAFE conversion. |
| **Minimum check** | $5k (below that, gift or wait until priced round) |

### What they’re buying (say this plainly)

> “You’re betting on me building the evaluation layer that gets brilliant
> people out of puzzle-theater hiring and into roles where reasoning matters —
> starting with researchers and frontier-science ML teams. The product is live.
> This money buys 12–18 months of runway to get paying users and one employer
> pilot, not salaries for a big team.”

### 2-minute script (friends)

1. **Hook (15s):** “LeetCode measures memory. Real jobs need reasoning under
   pressure and proof you can ship. I built ChamiNexT — live at chaminext.netlify.app.”
2. **Proof (30s):** Demo on your phone: one AI interview → score → drill → jobs
   board. “This isn’t slides. I use it myself.”
3. **Mission (20s):** “I’m a physicist who went ML → agentic systems at CERN.
   The same filter that blocked great researchers from industry is what I’m
   fixing.”
4. **Ask (20s):** “I’m raising $75k from people who know me. $10k on a SAFE
   at a $3M cap. Money goes to auth, payments, and landing the first paying
   employer pilot.”
5. **Risk (15s):** “Most startups fail. Only invest what you can lose entirely.
   I’ll send a short update every month.”

### What to send after “yes”

1. One-pager + link to deck
2. **SAFE** (signed via DocuSign / Clerky / Carta)
3. Wire instructions to **company** account
4. Signed copy for their records + your cap table log

### F&F pitfalls

- ❌ Verbal “you’ll get 5%” — always SAFE with cap
- ❌ 15 different valuation caps — use **one cap** for the whole F&F round
- ❌ Mixing personal expenses with company account
- ❌ Promising returns or timelines (“you’ll 10x in 2 years”)

---

## 3. Serious angels — ~$100k (and up to $300k pre-seed)

### Who this is for

Angels who’ve backed SaaS, edtech, or hiring tools; ex-founders; frontier-science
angels; diaspora network; **not** generic “I invest in AI” without domain fit.

### The ask (typical)

| Parameter | Suggested range |
|-----------|-----------------|
| **Check** | $50k–$150k (one lead angel or 2–3 co-investors) |
| **Total round** | $150k–$400k pre-seed |
| **Instrument** | SAFE (post-money) or **convertible note** if EU investors prefer |
| **Valuation cap** | **$4M–$8M** (live product + mission wedge + design-partner pipeline) |
| **Pro rata** | Offer lead angel pro rata for seed (signals seriousness) |
| **Board** | No board seat at $100k; **quarterly update + 30 min call** |

### 10-minute pitch structure

| Min | Slide / topic |
|-----|----------------|
| 0–1 | Title + evolved tagline + your founder proof (physics → CERN → product) |
| 1–3 | Problem: engineers + employers (deck slides 2–3) |
| 3–5 | Demo: interview → loop → employer studio ranking (live, not video) |
| 5–6 | Signal: research hygiene rubric — why incumbents can’t copy quickly |
| 6–7 | Market: wedge = researchers + SMB hiring; not “all engineers” |
| 7–8 | Business: B2C Interview Season + B2B €250–900/mo; Y1 ~€230k base case |
| 8–9 | Moat: field reports → intel flywheel → outcome-calibrated scoring (Path B) |
| 9–10 | Ask: $250k on SAFE at $6M cap; use of funds; 90-day milestones |

### Investor line (use v1.1)

> “Portable proof of research hygiene + ship readiness — the layer between
> LeetCode and the offer letter, starting with frontier-science hiring.”

### Use of funds ($250k example — from deck, scaled)

| % | € | Purpose |
|---|-----|---------|
| 40% | €100k | Engineering: Neon auth, Stripe live, Redis rate limits, Bedrock migration |
| 30% | €75k | Content + Ship Test catalog + autoresearch rubric loops |
| 20% | €50k | B2B design-partner sales (Apex-style pilots) |
| 10% | €25k | LLM / infra runway |

### 90-day milestones (commit to these)

- [ ] Server-side auth + sessions (off localStorage)
- [ ] Stripe live: Interview Season + one B2B pilot invoice
- [ ] 3 employer pilots → **1 paid** Small Business (€250/mo)
- [ ] 400+ Interview Season or Builder purchases (or honest revision if organic slower)
- [ ] Apex (or equivalent) workshop → documented hiring workflow + test bank alignment

### Diligence they will ask

| Question | Your answer |
|----------|-------------|
| Why you? | Physicist → ML → built the product solo; lived the academia→industry gap |
| Why now? | AI changed the job; interviews didn’t; LLM economics work at €19–49/mo margin |
| Competition? | LeetCode = recall; Dex = matching without eval moat; we = signal layer (deck 9b) |
| Defensibility? | Field-report data flywheel + outcome-calibrated rubrics (`tasks/brief-copy-resistance.md` when written) |
| Revenue today? | Demo billing; Stripe live is explicit use of funds |
| Cap table? | Clean; F&F on one SAFE; founder ≥80% pre-angel |

### Objection handling

**“This is crowded.”**  
→ “Crowded on **practice**. Empty on **portable readiness credential** employers trust. We’re not another question bank — we’re the defense interview + ship proof layer.”

**“Can’t OpenAI just do this?”**  
→ “They won’t build employer-ranked talent graphs with hire-outcome calibration. That’s a vertical product, not a model feature.”

**“You need traction.”**  
→ “Agreed. This round buys the infrastructure for real traction in 90 days. Here’s the milestone sheet.”

---

## 4. Seed round (institutional) — later, $1M+

You are **not** ready for a classic seed until:

- $10k+ MRR **or** 3+ paying B2B accounts **or** exceptional growth (5k+ MAU with conversion data)
- Lead investor can point to **retention + unit economics**
- Cap table still has room (15–20% for seed pool)

| Parameter | Typical seed (when ready) |
|-----------|---------------------------|
| Raise | $1.5M–$3M |
| Post-money | $10M–$20M |
| Instrument | Priced round (Series Seed preferred) or large SAFE stack |
| Board | 1 investor seat + 1 independent |
| Option pool | 10–15% refresh at seed |

**Bridge:** If angels put in $300k now, seed in 12–18 months can be **$2M at $15M post** with angels getting pro rata.

---

## 5. Equity instruments — what to use when

### SAFE (Simple Agreement for Future Equity) — **default for F&F and angels**

- **Not equity today** — converts at next priced round
- **Post-money SAFE** (YC standard): everyone knows dilution math
- Key terms: **valuation cap**, optional **discount**, **MFN** (most favored nation)
- Templates: [ycombinator.com/documents](https://www.ycombinator.com/documents) — SAFE User Guide + Post-Money SAFE

**Example (illustrative):** $10k SAFE, $4M cap. Seed round at $12M post-money → investor gets ~0.83% ($10k / $12M). Cap protects them if seed is at $20M.

### Convertible note

- Debt that converts; common in EU when investors want interest + maturity
- Use if Swiss/German angels ask for “loan” familiarity
- Lawyer should set interest (2–8%), maturity (18–24mo), conversion discount

### Priced equity round

- Reserve for **seed+** when you have a lead and need a board
- Requires valuation negotiation, articles amendment, shareholder agreement

### EU / Switzerland note

- US SAFEs are widely used even for EU companies **if** counsel reviews
- Swiss startups often use **convertible loan (Wandeldarlehen)** or SAFT for tokens (not you)
- **Get one lawyer** who has done 10+ startup SAFEs in your jurisdiction

---

## 6. Cap table hygiene (example)

**Before any raise (founder only):**

| Holder | Shares | % |
|--------|--------|---|
| Uzziel Perez | 1,000,000 | 100% |

**After F&F: $75k on SAFE @ $3M post-money cap** (no dilution until conversion)

| Holder | Type | $ invested | Cap |
|--------|------|------------|-----|
| Founder | Common | — | — |
| Friend A | SAFE | $15k | $3M |
| Friend B | SAFE | $10k | $3M |
| … | SAFE | … | $3M |

**At seed ($2M @ $12M post, all SAFEs convert):**

Rough dilution: new investors ~16.7%; SAFE holders ~6–8% combined; founder ~70% after 10% option pool refresh. *Model this in a spreadsheet before signing any cap.*

Tools: **Carta** (free for early stage), **Pulley**, or a Google Sheet with lawyer review.

---

## 7. NDAs — when to use (and when not to)

### Do **not** ask for NDA

- First coffee with friends / angels (kills trust)
- General networking, conferences
- Anyone before they’ve seen the pitch

### Do use NDA (mutual)

- Design partner sharing **their** hiring rubrics / candidate data (Apex workshop)
- B2B pilot with proprietary assessment content
- Potential acquirer or strategic with access to data room
- Contractor accessing field-report or user data

### Standard approach

1. **Pitch deck** — no NDA (mark “Confidential” footer, don’t send raw prompts)
2. **Data room** — NDA gate for deep diligence post-term-sheet
3. **Mutual NDA** template from lawyer (~2 pages)

**Never share:** full `interview-agent.js` prompts, Groq keys, or user data without NDA + DPA.

---

## 8. Investor updates (build trust = easier next round)

Send **monthly** to anyone who gave you money; **quarterly** to serious prospects.

Template:

```
Subject: ChamiNexT — [Month] update

Highlights (3 bullets)
- 
Metrics: MAU / paying / pilots / MRR
- 
Ask: intros to [specific persona]
- 
Lowlights / learned
- 
Runway: X months at current burn
```

One honest lowlight per email builds more credibility than hype.

---

## 9. Documents checklist

### F&F round

- [ ] Certificate of incorporation
- [ ] Company bank account
- [ ] Cap table (Carta or sheet)
- [ ] One-pager PDF
- [ ] Pitch deck (v1.1 — lead with evolved mission for F&F)
- [ ] Post-money SAFE (one cap for whole round)
- [ ] Wire / payment instructions
- [ ] Risk disclaimer email (“only invest what you can lose”)

### Angel / $100k round

- [ ] All F&F items
- [ ] 90-day milestone doc (§3 above)
- [ ] Financial model (simple: Y1 base case from deck slide 12)
- [ ] Mutual NDA (for diligence only)
- [ ] Data room folder (Google Drive / Notion)
- [ ] Pro rata side letter for lead angel (lawyer)

### Seed (later)

- [ ] Audited or lawyer-reviewed cap table
- [ ] Employment agreements / IP assignment (all code → company)
- [ ] Privacy policy + terms (GDPR if EU users)
- [ ] Stock option plan
- [ ] Series Seed stock purchase agreement (lawyer)

---

## 10. Who to approach (tiers)

### Tier 1 — F&F ($5–25k)

- Physicist / CERN network who’ve seen your work ethic
- Engineers who’ve complained about LeetCode out loud
- Family who understand venture risk **and** you want at Thanksgiving if it fails

### Tier 2 — Angels ($25–100k)

- Ex-founders in hiring / edtech / dev tools
- Angels who backed **Dex, Karat, interviewing.io, Pramp** (know the space)
- Frontier-science angels (drug discovery, climate tech syndicates)
- Swiss/EU angel syndicates (see local networks)

### Tier 3 — Seed funds (later)

- Pre-seed: **Precursor, Hustle Fund, Tiny VC** (if US); EU: **Speedinvest, b2venture** (domain fit)
- Only when metrics justify — cold outreach wastes reputation

**Explicit boundary:** Only approach people you’re comfortable working with if the relationship sours. No guilt-driven checks.

---

## 11. Pitch variants by audience

| Audience | Lead with | Ask | Deck |
|----------|-----------|-----|------|
| Friends & family | Mission + founder story + live demo | $5–25k SAFE @ $3M cap | Slides 1–4, 4c, demo |
| Mission-aligned angel | Misallocated talent + frontier science wedge | $50–100k SAFE @ $5–8M cap | v1.1 full + moat |
| SaaS angel | Category + unit economics + B2B wedge | $100k+ SAFE | v1 + slide 12 financials |
| Employer (not equity) | Interview Studio pilot | 60-day free pilot → €250/mo | Employers page, not deck |
| AWS / Bedrock | Infrastructure + case study | Credits + intros | Slide 17 |

---

## 12. Legal disclaimer

This playbook is operational guidance, not legal, tax, or investment advice.
Laws differ by country (Switzerland, EU, US investors in EU company, etc.).
Before accepting money:

1. Incorporate properly
2. Use lawyer-reviewed SAFEs or convertible notes
3. Confirm securities law (friends may need “sophisticated investor” classification in some jurisdictions)
4. Assign all IP to the company

**Recommended:** one startup lawyer for incorporation + first SAFE batch (~CHF 2–5k / €2–4k well spent).

---

## 13. Next actions (this week)

1. [ ] Incorporate if not done
2. [ ] Export deck v1.1 to PDF (Gamma / Slides)
3. [ ] Write one-pager (2 pages) from §2 script
4. [ ] List 10 F&F names; rank by relationship quality
5. [ ] Set **one** F&F cap ($3M) and target raise ($75k)
6. [ ] Book lawyer for SAFE template review
7. [ ] Send Tom/Apex workshop follow-up — design partner ≠ investor, but diligence proof

---

*Related: `tasks/pitch-deck-chaminext.md`, `tasks/business-plan-chaminext.md`, `tasks/production-readiness.md`, `tasks/brief-autoresearch-loops.md`*
