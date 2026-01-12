ChamiNext CRM — Starter

Minimal white-label CRM tailored for tech companies and startups. Includes a small talent pipeline feature.

Quick start (repo root):

```bash
cd apps/chaminext-crm
npm install
npm run start-server   # starts API server on :3001
npm run dev            # starts Vite dev server on :5173 (proxy to server)
```

API endpoints (local):
- GET `/api/stats` — basic counts
- GET `/api/contacts` — list contacts
- POST `/api/contacts` — add contact
- GET `/api/candidates` — list candidates
- POST `/api/candidates` — add candidate
- GET `/api/pipeline` — talent pipeline overview

Notes:
- This is a starter with in-memory data; replace with a DB for persistence.
- For production, consider deploying the frontend to Netlify/Vercel and the server as a serverless function or container.
