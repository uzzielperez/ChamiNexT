# Fullstack AI Development — Detailed Syllabus

Module 0 — Setup & Starter (30–45 min)
- Starter repo walkthrough (`courses/fullstack-ai-starter`)
- Project structure: client, server, env
- Run local dev and smoke test

Module 1 — Server & API Design (1.5–2 hrs)
- Design secure endpoints for model calls
- Batching, concurrency, retries
- Exercise: implement `/api/generate` with request validation

Module 2 — Model Integration (1.5–2 hrs)
- Embeddings vs completions, caching, rate limits
- Streaming responses and partial UI updates
- Exercise: implement embeddings endpoint and cache results

Module 3 — Frontend UX & Streaming (1.5–2 hrs)
- Progressive UI updates, loading states, fallbacks
- Managing context windows and token budgets
- Exercise: implement streaming chat UI with optimistic updates

Module 4 — Security & Cost Controls (1–1.5 hrs)
- Input sanitization, usage quotas, circuit breakers
- Billing-aware designs and telemetry
- Exercise: add rate limiting middleware and basic telemetry

Module 5 — Deploy & Operate (1.5–2 hrs)
- Serverless vs containers, CI pipelines, environment management
- Monitoring and alerting (logs, traces, cost dashboards)
- Exercise: add a simple deploy pipeline (Netlify/Vercel) and observability

Project (1–3 days)
- Build, test, and deploy a small AI demo (chat/QA/summarizer) with production notes

Deliverables
- Starter repo and code samples
- Lesson markdown and exercises under `tasks/lessons/fullstack-ai/`
