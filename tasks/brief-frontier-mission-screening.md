# Frontier mission screening (brief)

## Vision

ChamiNexT should eventually **screen for people who think well** about hard
problems — climate, cancer research, poverty alleviation, conservation — not
just people who grind LeetCode. That means:

1. **Problem tests** — deep, mission-shaped scenarios with explicit ethics probes.
2. **AI for Science track** — research hygiene, dual-use, validation, alignment.
3. **Interview intel** — scraped from public threads about DeepMind, Anthropic,
   biotech ML, climate ML, and safety hiring (no Glassdoor/Blind).

Revenue still comes from general hiring prep; this layer is the **mission moat**
and routes talent toward frontier work.

## What shipped (v0)

| Surface | Path | Content |
|--------|------|---------|
| Frontier problem tests | `/frontier` | `content/frontier-problems/tests.json` — 6 deep tests |
| AI for Science practice | `/practice` filter | `content/question-bank/ai-for-science.json` — 10 problems |
| Skill tree | `/skills` tab | `ai-for-science` branch in `skill-tree.json` |
| Interviewer persona | Netlify `interview-agent` | `TRACK_FOCUS['ai-for-science']` + ethics protocol |
| Intel pipeline | `npm run intel:frontier` | `sources-frontier.json` merged into scrape |

## Ethics in every deep test

Each frontier test includes `ethicsPrompts`. The live interviewer is instructed to:

- Probe **who is harmed** if the candidate is wrong.
- Probe **what evidence** would change their mind.
- Reject performative safety — demand governance and escalation specifics.

## Intel scrape sources (`--profile frontier`)

- Reddit: ML, bioinformatics, EA, climate, grad-school interview threads
- HN: DeepMind, Anthropic, research scientist, AI for science
- RSS: Anthropic, DeepMind, OpenAI research blogs
- YouTube: interview experience queries (yt-dlp, best-effort)
- Mission company list for extraction tagging

Run periodically (weekly or after major hiring news):

```bash
npm run intel:frontier
# or with LLM extraction:
GROQ_API_KEY=... npm run intel:frontier
```

## Copy resistance

Curated problem tests and outcome-calibrated rubrics are harder to clone than UI.
Field reports from real mission-org interviews + autoresearch on scoring (see
`tasks/brief-autoresearch-loops.md`) compound over time.

## Next (not v0)

- Employer-facing **mission score** on company tiers
- Calibrate rubrics against hiring outcomes (with consent)
- Partner with one mission lab for design validation (Apex-style, not investor)
- Expand question bank from intel extraction with human review
