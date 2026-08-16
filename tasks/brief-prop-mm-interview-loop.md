# Options Market-Maker Interview Loop — Field Notes → Prep Plan

> **Source:** Candidate / recruiter field notes (Aug 2026). Firm stays anonymous everywhere — including this brief. Product intel: `content/interview-intel/curated.json`.  
> **Platform:** `/intel` · `/practice` → Quant · `/coaching/quant-hm-prep` · `/loop` (quant track)

---

## 0. Probability & statistics notes (where they live)

| Location | What |
|----------|------|
| Skill tree leaf | `content/fundamentals/skill-tree.json` → **quant → math → probability-stats** |
| Practice bank | `content/question-bank/quant.json` — dice, Monty Hall, birthday, fair price, conditional expectation, etc. |
| Coaching episode | `/coaching/quant-hm-prep` → **Probability from first principles** |
| This loop | New problems: `quant-mm-math-oa`, `quant-mm-stuck-narration`, `quant-mm-onsite-game`, `quant-mm-data-report` |

---

## 1. Full loop (order of operations)

| # | Stage | What they test | Prep artifact |
|---|--------|----------------|---------------|
| 1 | **CV screen** | Hard filter if not “top 20” pedigree — CV must scream math + research judgment | One-page CV; lead with rigorous evidence, not buzzwords |
| 2 | **Online math OA** | Quant recruiting bar: expectation / distributions; **10–20 MCQs** — prob/stats (dice, balls, cards), calculus, linear algebra | `quant-mm-math-oa` + existing dice/Monty Hall set |
| 3 | **Recruiter phone** | Fit: where do you work / live? Philly, NY, vaguely East Coast. Good answers = credible + flexible | `quant-mm-recruiter-fit` |
| 4 | **Quant phone** | Concept depth — explain yourself; when stuck, narrate how you get unstuck (“you’ve just read it…”) | `quant-mm-stuck-narration` |
| 5 | **Onsite: open-ended P&S** | Think on the fly; break down hard questions; game theory / “winning theory” | `quant-mm-onsite-game` |
| 6 | **Senior quant: data exercise** | Pretend trading dataset + prompt → **report**. Not 200 graphs. Careful thinking; brevity; results + method | `quant-mm-data-report` |
| 7 | **Fly-out / present** | How you present; can you show something *new* and explain it to a math PhD | Same report + 5-slide narrative |
| 8 | **Tech interview** | Still basic programming (even post–Claude era) | `quant-mm-tech-basics` + `quant-python-vectorization` |

**Internships tip (non-public):** an intern loop is often an **8-week version** of the same interview — work hard; the bar is the loop, not a separate “easy” track.

---

## 2. Stage-by-stage coaching notes

### CV screen
- Assume screening is **harsh** without elite pedigree. Front-load: probability depth, research hygiene, shipped analysis, clear writing.
- Skip soft padding. One sharp project beats a laundry list.

### Online math OA
- Expectation and distributions are the recruiting signal.
- Classic toys: dice, urns/balls, cards — plus calc + lin alg MCQ.
- Practice: derive → sanity-check → pick the choice. Don’t memorize answer keys alone.

### Recruiter phone (fit)
- They ask where you live / work. East Coast (Philly / NY corridor) is the natural fit story.
- Good answers: concrete location + willingness to be on-site for collaboration; don’t oversell or invent logistics.

### Quant phone (concepts)
- Not “got the formula” — **understanding**. Explain in depth.
- When stuck: structure the problem, state what you know, try a smaller case, ask a precise clarifying question. Talking through “I’m trying X; here’s why I’m stuck” is the skill.

### Onsite P&S / game theory
- Open-ended. Win by decomposition: define payoff, information, strategies, then compute or bound.
- Show you can invent a workable theory under time pressure — not that you recall a textbook theorem name.

### Data exercise → report
- Dataset + prompt (pretend trading data). Deliverable is a **report**, not a notebook dump.
- **Anti-pattern:** 200 graphs = you don’t know what matters.
- **Pattern:** pick 3–5 decisive views; state hypothesis → evidence → conclusion; explain method briefly; anticipate “why doesn’t your analysis see X?”
- Brevity is highly valued. Results first; method second.

### Fly-out presentation
- Same story as the report, spoken. Prefer one novel insight you can defend to a math PhD over a tour of every chart.

### Tech interview
- Basic programming problems still appear. Clean code + edge cases + complexity. AI tools don’t replace this round.

---

## 3. Day-to-day role (so fit answers aren’t hollow)

From public / Forbes-style descriptions of the work:

- Teams shift projects constantly: how systems work, how markets work, retuning parameters, new strategies, modelling, valuations.
- **Quoting:** broadcasting what you want to trade into the market.
- ~2M options in the market — find good vs bad trades; improve how things are valued; ship new systems with software developers.
- Fast, urgent, trading every day — estimate futures/options values; humans still needed under changing conditions (even with strong AI).
- Generate / stress pretend data in research; iterate quickly.

Use this vocabulary in HM/recruiter rounds without sounding like a brochure.

---

## 4. Compensation / career framing (candidate mindset)

Keep perspective when comparing paths:

| Path | Rough signal from notes |
|------|-------------------------|
| Top options / trading talent | Very high upside (anecdotes cite ~$600k+ for rare profiles; “Terrence Tao of options”-style outliers) |
| 1000th-best math lecturer | Rarely over ~$100k |
| Jim Simons–class outcomes | Extreme outlier (fund-scale wealth) — not a planning assumption |
| Jane Street / peer shops | Very high cash comp for strong performers |

**Use:** motivation and trade-offs — not salary negotiation scripts in early screens.

---

## 5. This-week ChamiNexT path (~4 hours)

| Block | Route / problem | Time |
|-------|-----------------|------|
| Math OA warm-up | `quant-mm-math-oa` + Monty Hall / dice set | 45 min |
| Recruiter fit | `quant-mm-recruiter-fit` | 15 min |
| Concept + stuck | `quant-mm-stuck-narration` | 25 min |
| Onsite game theory | `quant-mm-onsite-game` | 25 min |
| Data report craft | `quant-mm-data-report` | 40 min |
| Tech basics | `quant-mm-tech-basics` | 20 min |
| Full loop | `/loop` → Quant | 45 min |
| Coaching | `/coaching/quant-hm-prep` (full playlist) | 40 min |

---

## 6. Rubric (what “good” looks like)

| Dimension | Strong | Weak |
|-----------|--------|------|
| Math OA | Clean derivation, distribution intuition | Guessing MCQ without model |
| Fit | Honest location + East Coast collaboration story | Vague or overcommitted logistics |
| Quant phone | Depth + stuck protocol | Silent freeze or formula dump |
| Onsite | Decompose → partial progress → check | Jump to answer or give up |
| Data report | 3 sharp findings, method named, anticipates holes | Chart spam, no claim |
| Tech | Correct + complexity + edges | “Works on happy path” only |

---

*Related: `tasks/brief-quant-hm-conversations-july2026.md`, `content/interview-intel/curated.json`, `content/coaching/quant-hm-playlists.json`.*
