# ChamiNexT — Project Walkthrough Interview Master Guide

**For ChamiNexT users.** This is the canonical source for NotebookLM Audio Overviews and Coach scripts.

## Why this question exists

"Walk me through a project you built" is not a resume recap. Interviewers use it to test:

- **Ownership** — what did *you* decide, not what "the team" did?
- **Judgment under constraints** — deadline, scale, team size, legacy systems
- **Shipping evidence** — deployment, tests, PRs, metrics
- **Seniority** — do you extract lessons (Reflection), or only describe what happened?

ChamiNexT trains this through **Ship Tests** (scoped ticket → tests → PR) and **mock interviews**
that probe deployment and review artifacts.

---

## The 10-minute spine

| Beat | Time | Content |
|------|------|---------|
| Hook | 45s | User + metric + constraint in one sentence |
| Context | 75s | Baseline, stakeholders, **non-goals** |
| Decisions | 3m | 2–3 architectural choices (not 10 features) |
| Execution | 2m | Timeline, **your** scope, tests, deployment, PRs |
| Failure | 90s | One real bottleneck + debug path |
| Results | 60s | Before/after metrics vs baseline |
| Reflection | 30s | One **specific** redo (not "more testing") |

### Hook template

> For **[user]**, **[metric]** was **[bad state]** because **[constraint]**. I owned **[outcome]** by **[deadline/scale]**.

### Decision template (DTS: Decision, Tradeoff, Signal)

> We considered **A vs B**. Criteria: **latency / ops burden / team size / deadline**. We chose **B** because **[constraint]**. Downside we accepted: **X**. Mitigation: **Y**.

---

## Musk Engineering Algorithm (for "why" follow-ups)

Apply in order — interviewers love candidates who **delete before optimizing**:

1. **Make requirements less dumb** — who asked for this? Is it still valid?
2. **Delete** — what did you remove from v1? (If you never cut scope, say so honestly + what you'd cut now)
3. **Simplify** — only after deletion
4. **Accelerate** — iteration cadence, small PRs, canary rollout
5. **Automate** — CI, tests, deployment automation **last**

**Anti-pattern:** "We added Kubernetes immediately." Strong: "We shipped on Netlify/serverless first; orchestration came when traffic justified it."

---

## STAR+R (career-ops pattern)

Inside the walkthrough, behavioral moments use **STAR + Reflection**:

- **S**ituation — stakes, stakeholders
- **T**ask — your measurable goal
- **A**ction — *I* did X (not "we")
- **R**esult — quantified
- **+ Reflection** — one thing you'd do differently with hindsight

Reflection signals seniority. Juniors describe events; seniors describe learning.

---

## Deployment platform (always prepare this)

Interviewers probe **why this platform**, not just **what you used**.

### Cover these dimensions

| Topic | What to say |
|-------|-------------|
| **Where it runs** | Local / edge / serverless / containers / on-prem |
| **Why** | Latency, cost, compliance, team skill, time-to-ship |
| **Rollout** | Manual → scripted → CI/CD; canary %; feature flags |
| **Rollback** | Health checks, automated rollback, kill switch |
| **Observability** | p50/p95, error rate, logs/traces, dashboards, on-call |
| **Why NOT X** | "We didn't need K8s at 100 RPS" |

### ChamiNexT product exemplar (for learners without a job project)

ChamiNexT itself ships as a **Vite SPA + Netlify Functions + static content JSON**:

- **Deploy:** `netlify deploy` / git push → CDN + serverless functions
- **Why:** Fast iteration for a content-heavy product; no always-on server for Coach APIs
- **Tradeoff:** Cold starts on functions; mitigation: small handlers, edge caching for static
- **Rollback:** Redeploy previous build; feature flags in content JSON when needed

### Ship Test alignment

Work Tickets require **PR submission** and often **optional preview deploy URL**. Practice saying:

> "I chose [platform] because the ticket's SLO was [X]. I shipped a vertical slice in PR #1, hardening in PR #2, deploy link in the description."

---

## Unit tests & quality (always prepare this)

**Never** say only "we had good coverage." Say **what each layer protects**:

```
Test pyramid for this project:
├── Unit — pure functions, parsers, business rules, limiter logic
├── Integration — API contracts, DB migrations, provider modules
├── E2E / load — staging traffic, chaos (DB failover, cache storms)
└── Evals (ML/AI) — golden sets, regression thresholds, cost/latency
```

### Phrases that land

- "This unit test would have caught incident #2 — [specific bug class]."
- "Integration tests locked the contract between [service A] and [B]."
- "We load-tested at [N] TPS before canary; chaos test found [failure mode]."

### Ship Test alignment

Tickets like **Rate Limiter API** and **Point-in-Time Backtest Linter** explicitly require:

- pytest / unit tests for core logic
- README with run + test instructions
- CI-green PR before submit

**Weak:** "I tested manually." **Strong:** "Three unit tests: happy path, edge case zero-volume bar, crossed order book."

---

## PRs (always prepare this)

**PR count is not a metric.** PRs are **decision evidence**.

### Typical PR arc

1. **Design / RFC** — problem, SLOs, alternatives, failure modes
2. **Vertical slice** — smallest shippable increment
3. **Hardening** — idempotency, observability, error handling
4. **Rollout** — feature flag, canary config, docs

### Deep-dive prep (pick 3 anchor PRs)

For each:

- Title + problem it solved
- What review comment changed your approach
- How you split a large change into reviewable chunks
- Test evidence in the PR (screenshot, CI link, benchmark)

### Follow-up questions

- "Walk me through a PR you're proud of."
- "What feedback from review changed your design?"
- "How did you handle a disagreement on approach?"

---

## Common failures (coach these hard)

| Failure | Why it fails |
|---------|--------------|
| Feature list for 8 minutes | No decisions to defend |
| "We built…" without *I* | Ownership unclear |
| No numbers | Can't calibrate impact |
| No failure story | Sounds dishonest |
| "I'd add more tests" | Generic Reflection |
| "I opened 47 PRs" | Volume ≠ quality |
| Deployment as afterthought | Staff+ expects ops thinking |

---

## Interviewer follow-up bank

- Why that architecture?
- What would you cut with half the time?
- Why not [Kubernetes / serverless / monolith]?
- What broke after launch?
- How did you test before production?
- What requirement did you push back on?
- What would you do differently?

---

## Practice on ChamiNexT today

1. **Coaching playlist** — `/coaching/project-walkthrough` (framework + sample Qs)
2. **Mock interview** — `project-walkthrough-core` problem (10-min spine drill)
3. **Ship Test** — Work Ticket with PR + tests (rate limiter or quant linter)
4. **Full loop** — `/loop` includes behavioral; add project walkthrough as onsite prep

---

## Interview Pack checklist (career-ops pattern)

Before any onsite, users should prepare per project:

- [ ] One-pager: problem, architecture diagram, metrics, eval plan
- [ ] Demo: live URL or 2-min recorded walkthrough
- [ ] Postmortem: what worked, what didn't, mitigations
- [ ] 3 anchor PRs with talking points
- [ ] Test map: unit / integration / load / evals
- [ ] Deployment one-pager: platform, rollout, rollback, observability
- [ ] Reflection line (one specific redo)
