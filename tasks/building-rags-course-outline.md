# Building RAGs — Course Outline

## Course Title
Building RAGs: Retrieval-Augmented Generation for Practical Apps

## Overview
Hands-on course teaching how to build Retrieval-Augmented Generation (RAG) systems: document ingestion, embeddings, vector stores, retrieval strategies, prompt design, and safe generation. Learners will build a minimal RAG app and deploy a simple QA demo.

## Target Audience
- Engineers familiar with JavaScript/TypeScript and basic ML concepts
- Product builders wanting to add knowledge-grounded assistants to apps

## Prerequisites
- Node.js and npm/yarn
- Basic familiarity with HTTP APIs and React
- Optional: basic Python if using certain embedding tools

## Learning Outcomes
- Understand RAG architecture and tradeoffs
- Implement embeddings and use a vector store for retrieval
- Build a small QA UI that calls a language model with retrieved context
- Deploy a demo (Netlify/Functions or simple server) and evaluate behavior

## Course Structure (Modules)
1. Module 0 — Setup & Foundations (tools, API keys, starter repo)
2. Module 1 — Data ingestion & embeddings (file parsing, chunking, embedding models)
3. Module 2 — Vector stores & retrieval strategies (FAISS, Pinecone, Supabase, Weaviate)
4. Module 3 — Prompting & generation (context windows, prompt templates, chain-of-thought alternatives)
5. Module 4 — Serving & UI (serverless functions, client UI, safety checks)
6. Module 5 — Evaluation & scaling (metrics, caching, batching)
7. Project — Small RAG QA demo (deployable in 1–2 days)

## Deliverables
- `courses/building-rags-starter` with a minimal example
- Example ingestion scripts under `tasks/lessons/building-rags/`
- Course page `src/pages/BuildingRagsCoursePage.tsx`
- Lesson markdown files under `tasks/lessons/building-rags/`

## Quick Start
1. Clone the repo
2. Follow Module 0 to configure API keys and local environment
3. Run the starter app in `courses/building-rags-starter`

## Paid Option
Offer an optional paid deployment package for productionizing the RAG demo (vector DB provisioning, domain, SSL, monitoring).

---

*Next: create detailed syllabus or scaffold the starter. Tell me which to do first.*
