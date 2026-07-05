# Interview intel pipeline

Scrapes public interview-experience content (Reddit, Hacker News, blogs, YouTube
transcripts) and distills it into `content/interview-intel/intel.json`, which the
app serves at `/intel`: real process stages and the exact questions asked,
including behavioral and recruiter-screen questions.

## Usage

```bash
# 1. Scrape all sources into scripts/interview-intel/.cache/raw-docs.json
node scripts/interview-intel/scrape.mjs

# Or one source at a time (runs merge incrementally into the same cache):
node scripts/interview-intel/scrape.mjs --source reddit
node scripts/interview-intel/scrape.mjs --source hn
node scripts/interview-intel/scrape.mjs --source rss
node scripts/interview-intel/scrape.mjs --source youtube

# Frontier / AI-for-science profile (DeepMind, Anthropic, ethics, mission orgs):
npm run intel:frontier
# equivalent to:
node scripts/interview-intel/scrape.mjs --profile frontier && node scripts/interview-intel/extract.mjs

# 2. Extract structured intel into content/interview-intel/intel.json
GROQ_API_KEY=... node scripts/interview-intel/extract.mjs        # best quality
node scripts/interview-intel/extract.mjs                          # heuristic fallback
```

Re-running is safe: the scrape cache merges by document id, and extraction
rebuilds `intel.json` from scratch each time.

## Sources

Configured in `sources.json`:

- **Reddit**: public JSON API, subreddit searches for interview-experience
  threads plus top comments. No auth; throttled; descriptive User-Agent.
- **Hacker News**: Algolia search API (stories + top comments).
- **Blogs**: RSS feeds (interviewing.io, dev.to tags, Pragmatic Engineer).
- **YouTube**: keyless search-page parsing + caption transcript fetch.
  Fragile by nature; failures are skipped, not fatal.

## Extraction

With `GROQ_API_KEY`, each relevant document is passed to Llama 3.3 70B with a
strict prompt: only questions the source says were actually asked, classified by
kind (`coding`, `system-design`, `behavioral`, `recruiter`, `take-home`,
`domain-knowledge`) and stage, with company/role/track and process notes when
stated. Without a key, a conservative heuristic extractor runs instead (high
precision, lower recall).

Questions are deduplicated globally; companies aggregate stages, notes,
questions, and source links. Questions with no named company land in
`generalQuestions` (most behavioral questions are company-agnostic anyway).

## Ethics / ToS notes

- Public, read-only endpoints only; no login-gated content (no Glassdoor/Blind).
- Sequential fetches with delays and an identifying User-Agent.
- Output stores links back to every source for attribution.
