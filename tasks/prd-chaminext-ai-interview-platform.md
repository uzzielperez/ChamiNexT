# PRD — ChamiNext (AI-Native Interview, Hiring & Ship Simulation Platform)

## 1. Product Overview

**Name:** ChamiNext  
**Tagline:** *Interview prep and ship tests for the AI era.*

ChamiNext is an AI-native platform that replaces traditional coding interview prep with:
- reasoning-based interviews
- real-world simulation tests
- product shipping challenges

It serves both:
- **engineers preparing for modern technical roles**
- **companies hiring engineers based on real ability, not memorization**

---

## 2. Problem Statement

### For Engineers
- Traditional platforms (LeetCode-style) reward memorization over thinking
- Real engineering now involves AI-assisted development
- Interviews do not reflect real-world shipping ability
- Candidates cannot demonstrate product-building skills in interviews

### For Companies
- Algorithmic interviews poorly predict job performance
- Engineers are hired without evaluating real shipping capability
- Lack of standardized product-building assessment
- High mismatch between interview performance and job performance

---

## 3. Product Vision

> Become the evaluation layer for engineering in the AI era.

ChamiNext shifts assessment from:
- solving isolated problems  
to:
- thinking, building, and shipping real products

---

## 4. Core Principles

1. **Shipping > Solving**
2. **Reasoning > Memorization**
3. **Simulation > Questions**
4. **AI is part of the workflow, not cheating**
5. **Real output is the only signal that matters**

---

## 5. Target Users

### Primary (B2C)
- Junior software engineers
- Career switchers
- University students
- Engineers preparing for AI-era interviews

### Secondary (B2B)
- Startups hiring engineers
- Scale-ups with frequent hiring needs
- Tech companies improving hiring quality

---

## 6. Core Product Modules

---

## 6.1 AI Interview Simulator

A dynamic interview system where users:
- solve coding + reasoning problems
- explain decisions in real-time
- interact with an AI interviewer
- face adaptive follow-up questions

### Outputs:
- Thinking Score
- Problem Decomposition Score
- Communication Score
- Code Quality Score

---

## 6.2 Adaptive Practice Engine

- Personalized problem generation
- Weakness detection across domains
- Mistake replay system
- Skill progression tracking

---

## 6.3 System Design & Debugging Mode

- Realistic system design interviews
- Debugging broken architectures or codebases
- Tradeoff evaluation by AI interviewer

---

## 6.4 Ship Tests (CORE DIFFERENTIATOR)

### Overview

Ship Tests are time-boxed engineering challenges where users must design, build, and deploy a functional product within a fixed time window.

This replaces abstract interview questions with real-world execution tasks.

---

### Time Formats

- **24h Sprint:** rapid execution under pressure
- **72h Build Sprint:** structured product development
- **7-Day Startup Sprint:** full MVP + product thinking simulation

---

### Example Challenges

**24h Sprint**
- Build a habit tracker app
- Build a simple chatbot interface
- Build a personal finance tracker

**72h Sprint**
- Build a job board with authentication and filtering
- Build a RAG-based document chatbot
- Build a lightweight CRM system

**7-Day Sprint**
- Build a micro-SaaS with payments
- Build a niche productivity tool with user accounts
- Build a data dashboard for a real domain

---

### AI Roles in Ship Tests

The AI acts as:

- **Product Manager:** defines requirements and constraints
- **Tech Lead:** reviews architecture decisions
- **Code Reviewer:** evaluates implementation quality
- **User Simulator:** introduces edge cases and feedback

---

### Dynamic Simulation Behavior

During the test:
- requirements may evolve
- constraints may be introduced
- edge cases are revealed progressively
- AI simulates real-world ambiguity

---

### Evaluation Criteria

Each Ship Test produces a structured evaluation:

1. **Shipping Score**
   - Did the user deploy a working product?

2. **Product Thinking Score**
   - Did they understand user needs?

3. **Engineering Quality Score**
   - Code structure, maintainability, design

4. **Execution Speed Score**
   - Delivery within time constraints

5. **Tradeoff Awareness Score**
   - Ability to make MVP decisions under constraints

---

## 6.5 Company Interview Studio (B2B)

Companies can:
- define roles
- create Ship Tests or interview pipelines
- evaluate candidates based on real shipped outputs
- compare ranked candidate profiles

---

## 6.6 Talent Profiles

Each user has a dynamic engineering profile:
- Thinking Score progression
- Shipping history (Ship Tests)
- Skill breakdown
- Strength/weakness map
- AI-generated career summary

---

## 7. Key Differentiation

| Platform     | Focus                    | Limitation |
|--------------|--------------------------|------------|
| LeetCode     | Algorithm solving        | Memorization, no real-world context |
| HackerRank   | Structured assessments   | Static evaluation |
| ChamiNext    | Thinking + Shipping      | Real-world simulation of engineering |

---

## 8. Core Metrics

### User Metrics
- Thinking Score improvement rate
- Ship Test completion rate
- Time-to-skill improvement
- Retention (weekly active users)

### Company Metrics
- Candidate-job performance correlation
- Time-to-hire reduction
- Hiring accuracy improvement
- Funnel conversion rate

---

## 9. Monetization Strategy

---

### 9.1 B2C Subscription

- Free Tier:
  - limited interviews
  - limited Ship Test access

- Pro (€15–30/month):
  - full AI interviews
  - personalized roadmap
  - feedback reports

- Builder Tier (€30–80/month):
  - Ship Tests (core access)
  - portfolio generation
  - AI product reviewer

- Premium (€80+/month):
  - advanced system design simulations
  - elite mock interviews
  - deep coaching

---

### 9.2 B2B Hiring Platform

- Starter: €500–1,000/month
- Growth: €2,000–5,000/month
- Enterprise: €10,000+/month

Includes:
- Ship Test assignments for candidates
- AI evaluation dashboards
- structured hiring pipelines
- role-based assessment templates

---

### 9.3 Pay-per-Candidate Evaluation

- €300–2,000 per evaluated hire pipeline
- ideal for startups

---

### 9.4 Future Talent Marketplace

- ranked engineering profiles
- inbound hiring from companies
- 5–15% placement fee

---

## 10. MVP Scope

### Phase 1 (Core Validation)
- AI interview simulator
- basic scoring system
- 3–5 coding domains
- simple user profiles

### Phase 2
- Ship Test system (24h only)
- basic deployment tracking
- AI evaluator v1

### Phase 3
- 72h + 7-day Ship Tests
- B2B hiring dashboard
- talent profiles v2

---

## 11. Tech Stack (Suggested)

- Backend: Flask (Python)
- DB: Neon (PostgreSQL)
- Frontend: Next.js
- AI Layer: LLM-based interview agents
- Async jobs: Celery + Redis
- Hosting: Vercel + Railway/Fly.io

> **Note:** Current repo uses React (Vite) + Netlify Functions. Migrate or dual-run per implementation plan in `tasks-chaminext-mvp.md`.

---

## 12. Go-To-Market Strategy

### Phase 1 (Wedge)
> “AI-native interview simulator + ship tests for engineers”

- Reddit engineering communities
- LinkedIn technical content
- YouTube mock interview content

### Phase 2
- introduce B2B hiring tools
- partner with startups and bootcamps

### Phase 3
- build talent marketplace layer
- scale hiring network effects

---

## 13. Risks & Mitigations

### Risk: “Just another LeetCode clone”
- Mitigation: focus messaging on SHIPPING, not problems

### Risk: AI evaluation trust issues
- Mitigation: transparent scoring + replayable sessions

### Risk: cold start (B2C vs B2B imbalance)
- Mitigation: start B2C-first with Ship Tests as viral hook

---

## 14. Long-Term Vision

ChamiNext becomes:

> The infrastructure layer for evaluating engineers in the AI era.

Not a practice platform — but:
- a **shipping simulation system**
- a **thinking evaluation engine**
- a **hiring decision layer**
