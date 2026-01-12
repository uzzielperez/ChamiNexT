Fullstack AI Starter

This starter demonstrates a minimal fullstack AI app: a Vite React client that calls an Express server endpoint which returns mock model responses.

Quick start

```bash
cd courses/fullstack-ai-starter
npm install
npm run start-server   # starts Express server on :3000
npm run dev            # starts Vite client (defaults to :5173)
```

Files
- `server/` — minimal Express server with `/api/generate` endpoint
- `src/` — React client that calls `/api/generate` and shows responses

Notes
- This starter uses a mock model response. Swap in a real model call in `server/api.js` and configure env vars.
