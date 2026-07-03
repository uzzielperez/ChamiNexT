# ChamiNext — Market Briefing (Interview Prep)

**Purpose:** walk into discovery interviews fluent in the market, the players, the numbers, and the pain — so you ask sharp questions and aren't pitched *to*.
**Date:** June 2026 · *Sources are mostly industry/vendor reports — treat figures as directional, not gospel. Use ranges, attribute when asked.*

---

## 0 — The one-sentence read

**The technical interview just lost its signal to AI, the incumbents' core product (LeetCode-style screens + take-homes) is now broken, and the industry's prescribed fix — "measure reasoning, judgment, and AI fluency, not recall" — is exactly ChamiNext's founding thesis.** You are early to a market that is actively scrambling for what you're building.

---

## 1 — The AI-Cheating Crisis (your wedge)

The numbers (2025→2026):
- **~88%** of online assessments now face active AI-cheating risk (Talview AI Threat Index).
- Estimated fraud rates by format:
  - Async/unproctored take-home: **60–80%**
  - Live proctored coding: **35–40%**
  - Live AI-conducted interview: **~38.5%**
  - Live human interview (no behavioral detection): **48%+** for technical roles
- **61%** of detected cheaters scored *above* the passing bar (i.e., they'd have advanced).
- **59%** of hiring managers suspect candidates of AI misrepresentation.
- Juniors cheat at ~**2x** the rate of seniors.

How (so you sound informed): consumer tools like **Cluely, Interview Coder, LeetCode Wizard** use GPU/graphics-layer overlays invisible to screen-share and proctoring. **Detection is an arms race you lose.**

The kicker — **the model-makers can't fix it either:** Anthropic publicly documented their take-home working in early 2024, then Claude Opus 4 matched most applicants, Opus 4.5 matched the top ones. *"The company that builds the model cannot build an assessment the model cannot pass."*

> **Why this is your wedge:** every company still running a LeetCode screen is "paying to sort candidates on a test the test-taker can trivially outsource." The fix isn't surveillance — it's redesigning the gate. That's you.

---

## 2 — What the market is shifting toward (validates your thesis)

The emerging "cheat-resistant" assessment patterns (all of which ChamiNext is positioned for):
- **Assume AI is present; measure how well they wield it** — AI fluency as a core competency, not cheating.
- **Live agent-orchestration** — candidate uses AI (Cursor/Claude) on a real mid-size codebase; score how they curate context, fan out subtasks, and catch AI's hallucinated PRs.
- **Eval-design** — ask them to design the evaluation/success criteria for a feature *before* coding. AI can't fake this.
- **Trade-off & debugging replay** — give flawed/production-like code; score root-cause reasoning.
- **Mandatory walkthroughs** — replace the auto-score with a live "defend your decisions" session; AI-reliant candidates can't.
- **Custom/novel problems** cut the cheating advantage by **~2/3**; **structured scoring roughly doubles predictive validity.**

This is almost a verbatim description of ChamiNext's pillars (reasoning, ship test, AI-collaboration vibe check). **Lead with this in conversations** — it shows you understand where hiring is going.

---

## 3 — Competitive Landscape (know the room)

### Incumbent assessment tools (the status quo you displace)
| Tool | What it is | Pricing | Weakness now |
|------|-----------|---------|--------------|
| **HackerRank** | High-volume async screening, 7,500+ challenges, AI Interviewer/Proctor | ~$100–375/mo, enterprise custom | Recall-first; broken by AI cheating |
| **CodeSignal** | Standardized GCA score (200–600), proctoring | ~$79–479/mo, enterprise custom | Same signal-loss problem |
| **CoderPad** | Live collaborative IDE (human-scored) | from ~$50/mo | Just an editor; no eval/signal |
| **Karat** | Outsourced human interviewers | ~$250–400/interview | Doesn't scale; expensive |
| **Codility / iMocha / TestDome / interviewing.io** | Various screening/assessment | $42/mo → custom | Same era, same problem |

### AI-native players (your real peers)
| Player | Model | Traction | Gap they leave |
|--------|-------|----------|----------------|
| **Dex** | AI talent agent; **success fee 20–30%**; focus = AI/ML/quant engineers | $8.4M raised, ~$1.8M ARR, 15k engineers | *Matching* agent, not an evaluation layer; no two-sided data moat |
| **Mercor** | Pivoted to **Expert-as-a-Service / RLHF data labeling** for AI labs | ~$10B valuation, ~$450M run rate, $1.5M/day to contractors | **Largely abandoned product-engineer hiring** — leaves that segment open |
| **Humanly** | "Service-as-software" staffing replacement | $52M raised, ~9k interviews/day | High-volume, not deep technical signal |
| **Fika Jobs** | Video-first candidate profiles + AI interview | $4M pre-seed | Personality/comms, not deep technical eval |

> **The opening:** incumbents have the wrong product (recall). Dex does matching (no eval moat). Mercor left product-hiring for data-labeling. **Nobody owns the "trustworthy, self-improving evaluation layer for technical hiring."** That's the gap.

---

## 4 — How Your Target Segments Actually Hire (talking points)

### Quant funds / prop shops
- Funnel: online assessment (probability/stats/mental math + Python/C++) → technical screens → **4–6 onsite** rounds.
- They evaluate **"research hygiene"** — going from hypothesis to a *validated, production-ready* signal **without** introducing data leakage, look-ahead bias, or overfitting.
- Interviewers are **adversarial about statistical claims** (sample size, transaction-cost adjustment, multiple-hypothesis testing). Use these terms.
- 2026 shift: less trivia, more "how they think and build under pressure," deep-dives into the candidate's *own* past research/code.

### AI labs (OpenAI / Anthropic / DeepMind)
- PhD **not** required for Research Engineer; bar is "publication-equivalent depth" (OSS, paper reproductions, alignment-forum engagement).
- Baseline technical: **implement Multi-Head Attention from scratch in PyTorch**; ML-systems design (feature stores, training pipelines, serving at scale).
- Distinctive: Anthropic = progressive CodeSignal (100% to advance) + 100B-model loss-spike debugging + a **heavily weighted values round**. OpenAI = paid **1–4 week work-trial** embedded with a team.
- Acceptance: OpenAI <2%, Anthropic ~5–10%. **Work samples/trials are the trusted signal**, not puzzles.

### AI startups (Series A–C)
- "Too small for enterprise assessment suites, too serious for raw resume reviews." (Your deck's focus group — confirmed by the market.)
- Need fast signal, can't afford senior-eng interview drag.

---

## 5 — Money Anchors (for "what does this cost you?" questions)

Use these to quantify pain and triangulate willingness-to-pay:
- **Bad engineering hire = 1.5–2x annual salary.** Senior eng total loss commonly **$150k–300k+** (some models £240k–400k).
- **Time-to-fill (eng): 50–62 days.** Vacancy = ongoing opportunity cost.
- **Cost-per-hire (tech): ~$8,400–$14,000.**
- **~35 interviews per engineering hire**; senior-eng interview time **8–15 hrs cumulative/hire** at **$75–150/hr** blended.
- **Agency / success fees: 20–30% of first-year salary** (Dex, Mercor, traditional search).
- **AI recruiting market: ~$660M (2025) → ~$800M+ (2026)**; 43% of companies now use AI in hiring; **3–8x first-year ROI** for orgs hiring 10+ eng/yr.

> WTP rule of thumb: B2B SaaS at €200–500/mo tends to surface from problems costing **€15–50k/yr**. With bad-hire costs in six figures, the math supports real pricing — *if* you can prove signal.

---

## 6 — Credibility Cheat-Sheet

**Terms to use naturally:** predictive validity, data leakage, look-ahead bias, overfitting, structured scoring, research hygiene, AI fluency, work-sample test, ground truth, calibration, false positive/negative rate, time-to-fill, cost-per-hire.

**Things NOT to say (signal naïveté):**
- "We'll detect the cheating." (You can't — the room knows this.)
- "LeetCode but better." (The whole point is LeetCode is dead.)
- "Our AI is more accurate" without saying *validated against what*.
- Pitching your solution before you've understood their funnel (breaks the Mom Test).

**Smart things to say:**
- "Detection is a losing arms race — the fix is assessment redesign." (Shows you're current.)
- "Even Anthropic can't build a take-home their own model won't pass." (Memorable, true.)
- "We measure how someone wields AI, not whether they used it."

---

## 7 — How to Use This in Interviews

1. **Open with their world** (Mom Test): "Walk me through how you hired your last engineer." Map their funnel against §4.
2. **Probe the pain you now understand:** "How are you handling AI-assisted candidates in screens right now?" (You know 59% suspect it — let them tell you their version.)
3. **Quantify** with §5 anchors: "What did that bad hire / slow loop actually cost you?"
4. **Listen for the wedge:** do they already distrust their current tool's signal? That's the opening — but **don't pitch**, just note it.
5. **Capture the rubric gold:** "When someone turned out to be a great hire, what specifically did they *do* that the interview should've caught?" → feeds your eval engine.

---

## 8 — Open Threads to Resolve Through Interviews

- Which segment feels the cheating-crisis pain most *acutely* and *urgently* — quant, AI lab, or AI startup?
- Is the buyer willing to **self-serve** (solo-unicorn test), or do they expect a sales/services relationship?
- Compete with Dex (matching) or sit underneath as the **evaluation layer**?
- What's the fastest **trustworthy proxy** for "good hire" before real performance data exists?
