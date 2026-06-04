# ChamiNext Production Readiness

Path from demo to a product practitioners pay for, and to survive traffic spikes.

## What “payworthy” means here

Users pay when they get **outcome + proof**, not more questions:

1. **Complete one hiring loop** in under 2 hours: mock interview → score → Ship Test enroll → submit URL → profile visible.
2. **Trust the scores** (consistent rubric, replay, notes).
3. **Feel progress** (trial, streak, track filters, 57+ prompts across 3 tracks).
4. **Low friction to start** (30-day trial, then Interview Season or monthly).

## Free 30-day trial (shipped)

| Piece | Status |
|-------|--------|
| `startFreeTrial()` → Builder + `expiresAt` + `isTrial` | Client localStorage |
| One trial per browser (`chaminext_trial_used`) | Client only |
| Trial banner + `/pricing` CTA | Shipped |
| **Production gap** | Tie trial to Neon user id + Stripe subscription trial |

## Traffic / deluge (shipped + next)

### Shipped now

- Static SPA + JSON bundled at build → CDN scales reads.
- Netlify function **rate limits** (`netlify/functions/_shared/rateLimit.js`):
  - `interview-agent`: 30 req/min/IP (override `RATE_LIMIT_INTERVIEW`)
  - `code-run`: 40 req/min/IP
  - `ship-test-evaluator`: 20 req/min/IP
- Returns **429** + `Retry-After`.

### Before a big launch (do these)

| Priority | Action |
|----------|--------|
| P0 | **Neon (or Supabase) accounts** — subscriptions, trial flags, usage counters server-side |
| P0 | **Stripe live** — Interview Season one-time + monthly; optional card-required trial |
| P0 | **Distributed rate limit** — Upstash Redis keyed by user id or IP (per-instance limit is not enough at scale) |
| P1 | **Groq budget cap** + queue/backoff on 429 from provider |
| P1 | **Sentry** on functions + React error boundary |
| P1 | **Auth** (Clerk/Auth.js) — stop trial abuse, sync profile slug |
| P2 | **Code-split** routes — shrink PWA precache (1.5MB JS) |
| P2 | **Netlify function concurrency** — monitor; upgrade plan if needed |
| P2 | **CDN cache** for `assets/*` (Netlify default) |

### Env vars (Netlify)

```
GROQ_API_KEY=
STRIPE_SECRET_KEY=
RATE_LIMIT_INTERVIEW=30
RATE_LIMIT_CODERUN=40
RATE_LIMIT_SHIP=20
```

## Content tracks (practitioner value)

| Track | Prompts | Interviewer fork |
|-------|---------|------------------|
| Software | 30 | Yes |
| AI Engineer | 15 | Yes |
| Market Engineering | 12 | Yes |

Grow each track toward 50+; add **Research Scientist** when ready (same pattern).

## Monetization ladder

1. **Free** — 2 interviews/day, taste Ship Tests  
2. **30-day trial** — full Builder, convert to Interview Season  
3. **Interview Season €149** — 90 days, active job search  
4. **Monthly** — Pro / Builder / Premium  
5. **B2B** — Interview Studio (higher ACV)

## Launch checklist

- [ ] Dogfood: one 24h Ship Test + one mock per track  
- [ ] Record 2 min Loom for LinkedIn  
- [ ] Stripe test → live  
- [ ] Set Groq spend alert  
- [ ] Load test `interview-agent` (e.g. 50 concurrent) and watch 429s  
- [ ] Privacy policy + terms (trial, data in localStorage today)

## Metrics to watch week 1

- Trial starts → first interview &lt; 24h  
- Trial → paid (Interview Season or Builder) %  
- 429 rate on functions  
- P95 interview-agent latency  
- Ship Test submit rate  
