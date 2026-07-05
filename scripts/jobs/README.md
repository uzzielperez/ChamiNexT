# Jobs pipeline

Scrapes live engineering roles into `content/jobs/jobs.json`, rendered at `/jobs`.
No partnerships required — public APIs and best-effort endpoints only.

```bash
npm run jobs:scrape
```

## Sources (config: `sources.json`)

| Source | Method | Reliability |
|--------|--------|-------------|
| Greenhouse boards | `boards-api.greenhouse.io/v1/boards/{token}/jobs` (public JSON) | High; unknown tokens 404 and are skipped |
| Lever boards | `api.lever.co/v0/postings/{company}` (public JSON) | High; same skip behavior |
| Remotive | `remotive.com/api/remote-jobs` | High |
| RemoteOK | `remoteok.com/api` | High |
| HN "Who is hiring?" | Algolia API, latest monthly thread, top-level comments parsed as `Company \| Role \| Location` | High |
| LinkedIn | Guest search endpoint, HTML-parsed | **Best effort** — expect 403/999 blocks; treat results as bonus |
| Glassdoor | — | Omitted: hard anti-bot + ToS. Revisit via partnership or a licensed aggregator (Adzuna, JSearch) |

## Guarantees on every job

- **Source URL** — always links to the original posting.
- **Track** — classified into software / ai-engineer / quant / cybersecurity /
  market-engineering (same taxonomy as skill trees, drill, and loop), so every
  job has a one-click prep path (`/drill?track=…`).
- **Mission flag** — frontier-science orgs (drug discovery, climate, health,
  conservation) flagged via company allowlist + keyword regex
  (`missionKeywords` in `sources.json`). Mission jobs are never crowded out of
  the 400-job cap by volume sources.

## The refresh loop

Incremental like the intel pipeline: merges with `.cache/jobs-cache.json` by id,
drops jobs older than 45 days, caps at 400.

Automated via `.github/workflows/refresh-jobs.yml` — Mondays and Thursdays it
re-scrapes and commits the updated board (also runnable manually from the
Actions tab). This is a **data refresh loop** (cron), not an autoresearch
metric loop — see `tasks/brief-autoresearch-loops.md` for the distinction and
for what a future Matchmaker metric loop would need.

## Adding companies

Add the board token to `greenhouseBoards` / `leverBoards` in `sources.json`.
Find a company's token by checking `boards.greenhouse.io/{token}` or
`jobs.lever.co/{token}`. Add frontier-science orgs to `MISSION_COMPANIES` in
`scrape-jobs.mjs` if their postings lack mission keywords.
