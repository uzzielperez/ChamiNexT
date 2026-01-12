# Vibe Course — 1–3 Day Sprint Plan

## Purpose
A compact project plan a learner can complete in 1–3 days to build and deploy a small interactive web piece demonstrating the "vibe" techniques taught in the course.

## Project Choices (pick one)
- Interactive Hero (recommended): animated hero section with pointer-reactive effects and CTA
- Particle Playground: canvas-based particle system with controls (count, color, gravity)
- Shader Banner: single fragment shader integrated in a React component with fallback

## Day-by-day Milestones
- Day 1 — Setup & Core Visuals (3–5 hrs)
  - Clone starter repo and install dependencies
  - Scaffold page and layout
  - Implement base visuals (static hero, canvas, or shader integration)
  - Commit progress and open PR
- Day 2 — Interaction & Polish (3–6 hrs)
  - Add pointer/touch interactions and UI controls
  - Improve timing, easing, and accessibility (motion preference)
  - Add responsive styles and basic performance tuning
- Day 3 — Finalize & Deploy (2–4 hrs)
  - Prepare production build and README
  - Deploy to Netlify (or chosen host) and configure domain/SSL
  - Record a short demo (20–60s) or take screenshots

## Quick start (assumes repo uses npm)

```bash
npm install
npm run dev
```

- Build for production:

```bash
npm run build
```

- Deploy: connect repo to Netlify or run `netlify deploy` as preferred.

## Checklist
- [ ] Pick project scope and create issue
- [ ] Complete Day 1 tasks and push code
- [ ] Complete Day 2 tasks and add README usage instructions
- [ ] Deploy and capture demo
- [ ] Submit final repo + deployed URL

## Deliverables
- Git repo with commits and README
- Deployed URL
- Demo screenshot or short video

