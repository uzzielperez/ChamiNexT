# AI Agents — Detailed Syllabus

Module 0 — Setup & Foundations (30–45 min)
- Tools, API keys, starter repo overview
- Local mock model vs real model discussion

Module 1 — Agent Loop & Planner (1–1.5 hrs)
- Architectures: reflex, chain-of-thought, plan-and-execute
- Implement a simple planner that outputs steps
- Exercise: build a planning function that splits a request into steps

Module 2 — Tooling & Tool Interfaces (1–1.5 hrs)
- Design tool contracts (input/output, idempotency, auth)
- Implement mock tools (search, calculator, file reader)
- Exercise: add a new tool and write tests for its interface

Module 3 — Tool Use & Tool Selection (1.5–2 hrs)
- Prompting strategies for tool selection
- Safe tool invocation and error handling
- Exercise: write a tool-routing function that chooses which tool to call

Module 4 — Long-running Tasks & Memory (1–1.5 hrs)
- Task state, checkpoints, and persistence
- Short-term memory and retrieval for context
- Exercise: implement a simple in-memory task store

Module 5 — Safety, Evaluation & Observability (1–1.5 hrs)
- Input validation, rate-limits, and auditing
- Metrics: correctness, latency, resource use
- Exercise: add logging and a basic audit trail

Project (1–2 days)
- Build and deploy a small agent demo (e.g., a QA agent with tool calls or a planning assistant)

Deliverables
- Starter app `courses/ai-agents-starter`
- Exercises and lesson notes under `tasks/lessons/ai-agents/`
- Course page and route in the app
