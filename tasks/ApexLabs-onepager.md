# ChamiNext × Apex Labs — POC One-Pager

**Joint POC Workshop** · Uzziel Perez & Rich Lanot, Founders · June 2026
**Ask:** Design partners + Bedrock pilot (credits, dedicated support, warm SMB intros)
**Demo:** [chaminext.netlify.app](https://chaminext.netlify.app/)

---

## The Idea

ChamiNext is the **evaluation layer for engineering in the AI era**: *practice like you work, ship real output, hire on signal — not puzzle count.* The bet: in 2026 the real differentiator is **how well someone reasons and ships alongside AI** — prompting judgment, verification discipline, recovery when AI output is wrong — not recall under a whiteboard.

This workshop pressure-tests that direction and explores **AWS Bedrock** as the infrastructure for an agentic evaluation layer — the engine behind ChamiNext's AI Mocks, Ship Tests, and the employer Interview Studio. Goal: leave with a scoped, shippable POC — not a slide deck.

---

## What We Evaluate

ChamiNext's three product lines (AI Mocks · Ship Tests · Interview Studio) all run on one shared grading engine. Four rubric dimensions:

| Dimension | What it tests | Product line | Scope |
|-----------|---------------|--------------|-------|
| **Reasoning (Adaptive AI)** | Socratic reasoning, decomposition, AI-assisted problem solving — not recall | AI Mocks | **MVP** |
| **Ship test** | Build + deploy a real feature in a 24–72h window; code quality + delivery judgment | Ship Tests | **MVP** |
| System design | Architecture trade-off reasoning under ambiguity | Studio | Phase 2 |
| AI collaboration vibe check | Live prompt specificity, trust calibration, recovery | All | Phase 2 |

**POC = the shared grading engine**, validated first on the two most ground-truth-able tasks (reasoning-graded coding task + ship test) as an **LLM-as-judge over a static submission**. Phases 3–4 add live-session capture.

---

## POC Architecture

```
Submission ingest → Rubric structuring → LLM-as-judge eval → Score + cited rationale
```

- **S3** — submission store (repo / zip / PR link)
- **Bedrock (Claude 3.5 Sonnet)** — fixed rubric per task type; one batched judge call per submission
- **Bedrock Guardrails** — bound outputs, catch hallucinated code claims
- **Cognito + RDS** — identity and structured score/telemetry storage (per deck pilot architecture)
- **Cost target** — €0.05–€0.30 per eval; single judge call, rationale capped ~300 tokens (no iterative loop in POC)

---

## Scope

**In:** one reasoning-graded coding task + one ship-test task · fixed rubrics · score + per-dimension breakdown + cited rationale · reviewer validation view · validation against labeled human-grader set

**Out:** candidate-facing UI · scheduling · multi-language generalization · cheating detection · live-session capture · system design / vibe-check pillars

---

## Timeline — 6 weeks + 3 week buffer

This is the engineering core of the deck's **90-day collaborative Bedrock pilot** (build in weeks 1–9; remaining time for design-partner validation and GTM co-sell).

| Sprint | Week | Goal |
|--------|------|------|
| **0 — Workshop & Scope** | 0 | Align architecture, model, scope, credits path |
| **1 — Foundation** | 1 | AWS + Bedrock access, S3 ingest, skeleton pipeline |
| **2 — Reasoning judge** | 2 | First working eval, rubric v1, score + rationale |
| **3 — Ship-test judge** | 3 | Extend pipeline, code-line citations |
| **4 — Validation** | 4 | Agent vs. human grader, variance check, Guardrails |
| **5 — Reviewer view** | 5 | Auditable rationale, outlier flagging |
| **6 — Harden & cost** | 6 | Cost/latency report, demo-ready POC |
| **Buffer** | 7–9 | Absorb slippage, iterate on model/rubric |
| **Stretch (if ahead)** | 7–9 | Conversational AI Mock prototype — proves the engine generalizes to the deck's flagship experience |

**Milestones:** M1 (Wk1) ingest end-to-end · M2 (Wk3) both pillars scored + cited · M3 (Wk4) scores correlate with human set · M4 (Wk6) demo-ready with cost/latency numbers.

---

## Why This Matters to Hiring Teams

The deck's own pain metrics are the bar this POC must clear:

- **Cuts false positives/negatives** — whiteboard loops yield high error rates; the POC must show its scores correlate with human graders.
- **Portable, verifiable proof** — a deployed build + cited rationale a recruiter trusts without re-reading the submission.
- **AI-cheating clarity** — distinguishes genuine AI-assisted development from copy-paste, by grading reasoning and process, not just output.
- **Frees senior engineer time** — replaces hours of whiteboard theater per loop with auto-ranked, auditable signal.

---

## Open Questions for Apex Labs

1. **Model selection** — most consistent, auditable Bedrock model at this complexity? Variance across repeated runs?
2. **Guardrails vs. custom harness** — best fit for bounding scores and catching hallucinated code claims?
3. **Rationale traceability** — tool use, structured output, or post-processing for code-line citations?
4. **Human-in-the-loop** — existing AWS patterns for the reviewer handoff?
5. **Cost per eval** — Bedrock cost at this token budget, scaled to hundreds of submissions per hiring cycle?

---

## Success Criteria

**Workshop:** concrete Bedrock model + architecture direction · agreed POC scope and next steps · clarity on credits, dedicated support, and warm SMB intros (co-sell path).

**POC:** agent scores correlate strongly with human graders · rationale specific enough to trust without re-reading the submission · runs end-to-end on Bedrock at acceptable latency and €0.05–€0.30 per eval.
