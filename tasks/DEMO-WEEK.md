# ChamiNext — Demo Week Guide (~10 min)

## Before the presentation

1. Deploy to Netlify (push `main`).
2. In Netlify env vars, set `GROQ_API_KEY` for live AI interviews and Ship Test scoring.
3. Optional: `STRIPE_SECRET_KEY` + `VITE_STRIPE_PUBLISHABLE_KEY` for real checkout; without them, pricing activates plans locally.
4. On site: click **Demo script** (bottom-right) → **Load demo data & go to Practice**.

## Demo flow

| Step | Where | What to say |
|------|--------|-------------|
| 1 | `/` | "Not LeetCode—we measure readiness: think, ship, prove." |
| 2 | `/practice` | Run **AI interview** on Two Sum → chat → **Run** code → **End & score**. |
| 3 | **Ship Tests** | Enroll **24h Habit Tracker** (30 min timer in demo mode) → submit deploy URL → AI evaluation. |
| 4 | **Profile** | **Copy profile link** → open preview. |
| 5 | `/employers` | **Candidates** tab—ranked by shipping score; open profile; change status. |
| 6 | `/pricing` | Pro / Builder / Premium; Builder unlocks Ship Tests. |

## URLs to bookmark

- Home: `/`
- Practice: `/practice`
- Interview Studio: `/employers`
- Pricing: `/pricing`
- Sample profile: `/profile/{slug}` (after copy link from Profile tab)

## Invite link (employer)

1. Employers → Roles → **Copy invite link**
2. Open in new tab → **Submit application** (same browser = strongest demo)

## Troubleshooting

- **AI generic?** Add `GROQ_API_KEY` on Netlify and redeploy.
- **Code run fails?** Piston API may be rate-limited; continue with verbal explanation in chat.
- **Reset:** Clear site localStorage or use incognito.
