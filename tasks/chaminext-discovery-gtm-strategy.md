# ChamiNext — Discovery, GTM & Self-Learning PoC Strategy

**For:** quant / ML engineer / AI-company hiring
**Author:** Uzziel Perez · June 2026 · *Working strategy doc*

---

## 0 — TL;DR

Two viable paths, not mutually exclusive:

- **Path A (Relationship-led GTM):** Run disciplined customer-discovery interviews with hiring managers at quant funds, AI labs, and AI startups. Use the conversations themselves to build the relationships that become design partners and first paying customers. Monetize via a hybrid B2B (evaluation-as-a-service) + B2C (candidate prep/portfolio) wedge.
- **Path B (Self-learning core PoC):** Build the "evaluation layer that improves itself" — a closed-loop system where assessment scores are continuously calibrated against real hiring/performance outcomes. This is the long-term moat and the technically interesting bet.

**Recommendation:** Do A *to fund and direct* B. Discovery interviews are how you both (a) earn the relationships/revenue and (b) collect the ground-truth labels the self-learning system needs. They are the same motion.

---

## 1 — Market Reality (June 2026)

The AI-hiring space is hot and consolidating fast — this validates the problem and raises the bar:

| Player | Raised / Traction | Model | Relevance to you |
|--------|-------------------|-------|------------------|
| **Dex** | $5.3M seed ($8.4M total), ~$1.8M ARR, 15k engineers, 50+ companies | Agency **success fee 20–30%** of first-year salary; vertical focus on **AI researchers, ML & quant engineers** | **Closest comp.** Same segment. Proves willingness to pay — but they're a *matching agent*, not an *evaluation layer*. |
| **Humanly** | $25M Series B ($52M total), ~9k interviews/day | "Service-as-software" — delivers pre-vetted candidates | Shows the move from tools → outcomes/staffing-replacement. |
| **Fika Jobs** | $4M pre-seed | Video-first AI interviews, candidate-owned profiles | Candidate-side B2C profile play (like your Talent Profiles). |
| **CodeSignal / CoderPad** | Incumbents | Real-world coding assessment | The assessment status quo you're displacing. |

Market: AI recruiting ~$660M (2025) → ~$800M+ (2026); 43% of companies now use AI in hiring. For orgs hiring 10+ engineers/yr, AI tooling shows 3–8x first-year ROI.

**How your target segment actually hires today** (quant/ML/AI):
- Multi-stage, high-rejection funnel: online assessment → technical screen → 4–6 onsite interviews.
- The signal they care about is **"research hygiene"** — can someone go from hypothesis to a *validated, production-ready* result **without introducing downstream risk** (data leakage, look-ahead bias, overfitting).
- 2026 shift: **less trivia, more "how they think and build under pressure"**; adversarial deep-dives into the candidate's own past code/research.
- Senior-engineer time is the scarce, expensive resource being burned on this.

> **Strategic read:** Dex monetizes *matching*; the incumbents monetize *assessment tooling*. The open, defensible wedge is the **evaluation layer that produces trustworthy, validated signal** — and gets *better* the more hires it sees. That's your Path B.

---

## 2 — Who to Interview (segments)

Run discovery as **3 distinct segments** — different pains, different buyers:

1. **Quant funds / prop shops** (Citadel/Two Sigma-tier down to emerging managers)
   - Buyer: Head of QR, hiring PMs, recruiting leads.
   - Pain: false negatives are catastrophic (missed alpha-generator); research-hygiene hard to test at screen stage.
2. **AI labs / AI-first scaleups** (Series A–C, hiring ML/research engineers)
   - Buyer: founder/CTO, eng lead, first in-house recruiter.
   - Pain: too small for enterprise assessment suites, too serious for resume review; need signal *fast*, can't afford senior-eng interview drag.
3. **Candidates** (B2C side) — quants/ML engineers actively interviewing
   - Pain: opaque process, no portable proof, expensive/low-quality mock prep.

Target **20–30 conversations per segment** (Mom Test guidance) before drawing conclusions. Minimum to spot patterns: ~10–15.

---

## 3 — Interview Strategy (The Mom Test, applied)

**Three rules:** talk about *their life, not your idea*; ask about *specific past events, not hypotheticals*; *listen ~80%* of the time. The moment you're explaining ChamiNext, you've stopped learning.

**Hard bans** (these answers lie to you): "Would you use this?", "Would you pay X?", "How important is this?", "What features do you want?"

### 3a — Script for hiring-side (quant/ML/AI companies), 30–45 min

1. **Context** — "Walk me through the last engineer/researcher you hired. What did the process look like end to end?"
2. **Current behavior** — "Where in that funnel did you spend the most senior-engineer time?" · "Tell me about the last time a hire didn't work out — what did the interview miss?"
3. **Workarounds & spend** — "What tools do you pay for today (CodeSignal, HackerRank, agencies, Dex)? What do they cost you per year?" · "What have you tried and dropped?"
4. **Cost of the problem** — "What does a bad hire cost you?" · "What does a slow loop cost you in lost candidates?"
5. **Signal** (the core question for you) — "When you say someone has good judgment / research hygiene, what specifically did they *do* that told you that?"
6. **Trust** — "Last time a tool gave you a candidate score, did you trust it? Why / why not?"

### 3b — Script for candidates (B2C)

1. "Tell me about the last technical interview you prepped for. What did you actually do?"
2. "What did you pay for prep — courses, mocks, Leetcode, coaching? How much?"
3. "After an interview, what proof of your ability did you walk away with?" (probes the portfolio gap)
4. "Last time AI helped you in an interview prep / take-home — what happened?"

### 3c — Signals that a problem is real (not politeness)

- They already **spend money or significant senior-eng time** on a workaround.
- **Budget clusters:** B2B SaaS at €200–500/mo tends to come from problems costing €15–50k/yr. If the pain is a €2k/yr problem, the math won't work — that's a pivot signal.
- **Organic pull:** they ask "what happens next?" or want access before you pitch. Strongest signal in discovery.

> **Dual-purpose move:** every interview also asks Q5 ("what *specifically* did a great hire do?"). Those answers become your **rubric ground truth** for the self-learning system in Path B. Discovery = sales pipeline *and* training data.

---

## 4 — Monetization Path (B2B + B2C)

### Sequencing
Start **B2B design-partner-led** (faster to revenue, sharper signal), let B2C compound underneath as the candidate funnel + data flywheel.

### B2B options (pick based on what discovery reveals)
| Model | What it is | When it fits |
|-------|-----------|--------------|
| **Evaluation-as-a-service** | Per-assessment or seat/subscription (€500–2k/mo) for the grading + ranked shortlist | Companies running enough volume to value tooling |
| **Success fee** (Dex-style) | 20–30% of first-year salary, paid only on hire | Lower friction for small AI startups; aligns incentives; higher per-deal $ |
| **Hybrid** | Low subscription + reduced success fee | De-risks for you, lands the relationship |

The success-fee model is worth strong consideration early: zero adoption friction ("we only get paid if you hire"), and it's already proven in your exact segment by Dex.

### B2C (the relationship + data engine)
- **Free tier** (mocks/day, one ship test) → **Interview Season** (€149/90 days during active search) → **Builder** (€49/mo, portfolio export).
- B2C isn't just revenue — it's the **candidate supply** and the **labeled-outcome data** that makes B2B better. This two-sided loop is your structural advantage over a pure agency like Dex.

### Relationship-building motion (concrete)
1. Discovery interviews → 2. Offer to run **one free pilot assessment** on a role they're hiring for → 3. Compare your signal vs. their human screen → 4. Convert the pilot into paid (subscription or success fee) → 5. Capture the hire outcome → feeds Path B.

---

## 5 — The Self-Learning PoC ("builds itself")

The vision: **a hiring platform whose evaluation engine improves itself from signals.** This is a *closed-loop / predictive-validity* system — a real, established pattern, not magic.

### How the loop works
```
Assessment score → Hire decision → On-the-job outcome (perf review, retention, manager rating)
        ↑                                                   │
        └──────── recalibrate rubric & model ◄──────────────┘
```

1. **Predict** — candidate completes assessment; model outputs score + rationale.
2. **Capture ground truth** — hiring decision, and later: performance review, retention, manager rating.
3. **Calibrate** — compare predictions vs. outcomes; where they diverge, that's a labeled training point. Reweight rubric dimensions that correlate with success; downweight those that don't.
4. **Guardrails** — validation holdouts before any model update; monitor calibration (e.g. Brier score) for drift; small learning rates; **per-segment** calibration (quant ≠ ML eng ≠ AI startup); human-in-the-loop on every update for bias/fairness.

### Honest constraints (be the one who says this)
- **Predictive validity of human-performance prediction is genuinely hard** — even good behavioral assessments often land at r < 0.5. Set expectations: the goal is *better than the current human screen*, measurably, not perfection.
- **Outcome data is slow** — performance signal takes months. **Bootstrap** with faster proxies first: agreement with expert human graders (Pillar validation you already planned), then take-home/onsite pass-through, then on-the-job outcomes.
- **Cold start** — you need volume of (assessment → outcome) pairs. This is *why* you run B2C and many B2B pilots: to generate the pairs.

### Minimal "builds itself" PoC (what's actually buildable)
- v0: LLM-as-judge produces scores + rationale (your existing Bedrock PRD).
- v1: store every score + the eventual human-grader/hire decision as ground truth.
- v2: a calibration job that reports, per segment, *which rubric dimensions predict the outcome* and proposes reweighting — surfaced to a human to approve.
- That single feedback report **is** the self-learning loop's first heartbeat, and it's a killer demo: *"our rubric got smarter after 50 hires."*

---

## 6 — Recommended Next 30 / 60 / 90

**0–30 days — Learn & relate**
- 10–15 discovery interviews across the 3 segments (recycle warm contacts: the Tom/Apex network).
- Tag themes; quantify pain (time/€). Identify 3 design-partner candidates.

**30–60 days — Pilot & monetize**
- Run 2–3 free pilot assessments on real open roles. Decide pricing model from observed budgets/spend.
- Stand up the score+outcome data store (Path B v1).

**60–90 days — Prove the loop**
- Convert ≥1 pilot to paid (subscription, success fee, or hybrid).
- Ship the first calibration report (Path B v2) — "rubric vs. outcomes." Use it in the next sales conversation.

---

## 6b — The Single-Founder Unicorn Path

Goal: a **one-person (or ≤5) $1B company**. This is the most demanding constraint, and it *filters every decision below.* The only way one person reaches this scale is if **the product is the workforce** — which is precisely why your self-learning evaluation engine (Path B) is not a side bet, it's the whole company.

### The brutal math
- $1B valuation ≈ **~$100M ARR** at a 10x multiple (or ~$50M ARR if growth is exceptional).
- Solo, that means **revenue-per-employee in the tens of millions** — unprecedented historically, plausible only if AI does the work humans used to. This is a real frontier bet, not a sure thing. Treat ~$10M ARR near-solo as the proof point that the model works; the unicorn follows from compounding it.

### Design principles (non-negotiable for solo)
1. **Product-led, self-serve only.** No sales team = no enterprise sales motion. The buyer signs up, runs an assessment, sees value, pays — without talking to you. This **rules out the high-touch Dex-style agency model** as your core (it's human-labor-bound). Use success-fee only as an automated, self-serve billing event, not a recruiter relationship.
2. **The AI agents *are* the staff.** Interviewing, grading, rationale, candidate comms, even discovery synthesis — all agent-run. Every workflow you'd "hire for" must instead be a prompt + eval + guardrail.
3. **Usage-based pricing.** Revenue scales with assessments run, not with seats you have to sell. Per-eval pricing (deck: €0.05–0.30 cost → price €5–50/eval) compounds without headcount.
4. **The data flywheel is the moat.** Each assessment → outcome pair makes the engine better → better signal → more customers → more data. A solo founder can't out-hire competitors, but a compounding **data moat** scales without people. This is the one defensible thing Dex (no two-sided data) and incumbents (no outcome loop) don't have.
5. **Refuse everything that needs a human.** No custom enterprise contracts, no white-glove onboarding, no services revenue. If it doesn't self-serve, it's not in the solo company.

### What changes vs. the GTM above
| Earlier strategy | Solo-unicorn adjustment |
|------------------|--------------------------|
| Design-partner pilots (high touch) | Use **only** to learn + seed data, then **productize the pilot into self-serve**. Don't build a pilot-delivery habit. |
| Success-fee agency model | Keep only if **fully automated** billing on a tracked hire; otherwise default to **self-serve usage SaaS**. |
| B2B sales motion | Replace with **PLG + content/community** (your courses, dev audience = zero-CAC funnel). |
| "Hire to scale ops" | **Never.** Scale = better agents + more compute, not more people. |

### Where discovery still matters (even solo)
You still run the interviews from §3 — but the output isn't "a sales relationship," it's: (a) the **rubric ground truth** that trains the engine, and (b) proof of which segment will **self-serve and pay without a human in the loop.** That last point is the single most important thing to validate for a solo unicorn: *find the buyer who will swipe a card without a sales call.*

### The honest risk
A true *one-person* $1B is still essentially unproven. De-risk by: (1) targeting near-solo $10M ARR first as the validating milestone, (2) keeping optionality to add 2–4 people if a function genuinely can't be agent-run, (3) making the data moat real early so value compounds even if growth is slower than the dream.

---

## 6c — AWS / Bedrock Partnership: What to Take, What to Refuse

**Verdict:** You don't need the AWS PoC fund to *build*. You want it for **two things only — credits and warm intros**. Take those; refuse the architecture lock-in and the partnership overhead.

### What it gives — and whether it's worth it solo
| What you get | Worth it? | Why |
|--------------|-----------|-----|
| **Credits (free inference)** | **Yes** | The data flywheel is compute-hungry at cold start; free inference directly extends runway. |
| **Warm SMB intros** | **Yes — maybe the best part** | This is exactly the "buyer who swipes a card without a sales call" you need. A solo founder can't buy that cheaply. |
| Dedicated architecture support | Meh | Useful, but risks pulling you into enterprise plumbing before PMF. |
| **Bedrock as your inference layer** | **Probably not** | A soft trap (see below). |

### The trap
- You **already run `groq-sdk`.** Groq / direct Anthropic / OpenAI are typically **faster and cheaper to iterate** on than Bedrock, and keep you model-agnostic.
- Bedrock drags in enterprise plumbing (Cognito, RDS, Guardrails) a self-serve PLG product doesn't need at validation stage.
- For a solo founder, **time is the scarcest resource.** The danger isn't the credits — it's the gravitational pull into enterprise rabbit holes and partnership overhead that don't move the one real question: *will someone pay without a sales call?*

### The play
1. **Keep the relationship, reframe the ask** — take credits + warm SMB intros, don't commit architecture.
2. **Build the PoC on Groq / direct APIs** — cheaper, faster, portable. Keep a thin model abstraction so you *could* run on Bedrock if a customer demands it.
3. **Keep Tom's workshop regardless** — it's a free discovery interview with an experienced hiring person; worth more than the Bedrock spec.
4. **Decision rule:** if the partnership ever costs more *founder-hours* than the credits + intros are worth, walk.

> Bottom line: yes to credits and intros, no to lock-in — and don't let the PoC scope become the company.

---

## 7 — Open Questions

- Which segment shows the strongest **organic pull** first — quant funds, AI labs, or candidates?
- Success-fee vs. subscription vs. hybrid — what do discovery budgets actually support?
- What's the fastest **trustworthy proxy** for the outcome label before real performance data exists?
- Where does ChamiNext's wedge sit relative to Dex — compete (matching) or partner (be the evaluation layer underneath agents like Dex)?
- **Solo-unicorn test:** which segment will sign up and pay for an assessment **without a sales call**? That's the only segment that scales to a one-person $1B.
