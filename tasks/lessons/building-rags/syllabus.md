# Building RAGs — Detailed Syllabus

Module 0 — Setup & Foundations (30–45 min)
- Tools: Node, npm/yarn, basic Python optional
- Starter repo walkthrough: `courses/building-rags-starter`
- Configure API keys (optional) and run the local ingest demo

Module 1 — Data Ingestion & Chunking (1–1.5 hrs)
- Document parsing (PDF, Markdown, HTML, text)
- Chunking strategies (sliding windows, overlap, token-aware chunking)
- Text cleaning and metadata extraction
- Exercise: ingest a small docset and write chunks to a vector store

Module 2 — Embeddings (1–1.5 hrs)
- Overview of embedding models (OpenAI, Cohere, Hugging Face)
- Dimensionality, cost, and latency tradeoffs
- Implement embedding generation and caching
- Exercise: swap deterministic local embeddings with a real embedding provider

Module 3 — Vector Stores & Retrieval (1.5–2 hrs)
- Local vs managed vector stores (FAISS, Pinecone, Supabase, Weaviate)
- Similarity metrics and approximate nearest neighbors
- Retrieval strategies: top-k, hybrid reranking, filtering by metadata
- Exercise: run retrieval on the starter and test different k/top strategies

Module 4 — Prompting & Generation (1.5–2 hrs)
- Prompt templates and retrieval-augmented pipelines
- Safety, hallucination mitigation, and source attribution
- Chain-of-thought and grounding techniques
- Exercise: build a prompt that combines top-k results and calls a model (mock or real)

Module 5 — Serving & UI (1–2 hrs)
- Serverless functions for embedding and QA (Netlify Functions, Vercel)
- Client UI patterns for streaming or synchronous responses
- Exercise: deploy a small QA endpoint and connect a simple UI

Module 6 — Evaluation & Scaling (1–1.5 hrs)
- Evaluation metrics (EM, F1, retrieval precision, ROUGE-like metrics)
- Caching, batching, and cost optimization
- Operational considerations: monitoring, retraining, data freshness

Final Project (1–2 days)
- Build and deploy a small RAG demo: ingest a knowledge base, serve retrieval, and build a QA UI. Optionally purchase the paid deploy package to productionize.

Deliverables
- Starter repo `courses/building-rags-starter`
- Lesson markdown and exercises under `tasks/lessons/building-rags/`
- Course page `src/pages/BuildingRagsCoursePage.tsx`
