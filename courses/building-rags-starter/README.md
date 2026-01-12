# Building RAGs — Starter

This starter demonstrates a tiny, local RAG workflow for learning purposes. It uses a simple local "vector store" saved to `vectorstore.json` and deterministic, local embeddings so you don't need API keys to run the demo.

Quick start

```bash
cd courses/building-rags-starter
npm install
npm run ingest   # builds a local vectorstore from docs/
npm run dev
```

Files
- `ingest.js` — simple ingestion script that chunks `docs/` and creates `vectorstore.json`
- `vectorstore.json` — generated vector store (created after `npm run ingest`)
- `src/` — small React app that loads `vectorstore.json` and runs a local nearest-neighbor QA demo

Notes
- This starter uses local deterministic embeddings for learning. For production, replace the embedding function with a real model (OpenAI, Hugging Face embeddings, etc.) and use a managed vector DB (Pinecone, Supabase, Weaviate, FAISS).
