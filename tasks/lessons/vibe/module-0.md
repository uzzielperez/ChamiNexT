# Module 0 — Setup & Foundations

Duration: 30–45 minutes

## Objective
Get the environment ready, learn the starter repo layout, and ship the first static visual so learners can iterate quickly.

## Learning outcomes
- Install dependencies and run the dev server
- Understand project structure and where to add components
- Create a simple, responsive hero section as the first visual

## Prerequisites
- Node.js (16+) and npm or yarn
- Basic familiarity with React

## Starter options
- Option A: Use the course starter in `courses/vibe-starter` (recommended for quick start)
- Option B: Use the main repo (ChamiNexT) and add a lesson page under `src/pages/`

## Setup (using the starter)

```bash
cd courses/vibe-starter
npm install
npm run dev
```

Open `http://localhost:5173` (default Vite port).

## Starter repo layout (what to look for)
- `index.html` — app entry
- `src/main.jsx` — client bootstrap
- `src/App.jsx` — top-level demo component
- `src/styles.css` — simple styles

## Exercise 0.1 — Create the static hero
1. Open `src/App.jsx` and replace placeholder text with a full-bleed hero.
2. Add a centered title, short subtitle, and a CTA button.
3. Make it responsive using simple CSS (flexbox + min-height: 100vh).

Deliverable: a static hero that renders in the browser and commits to Git.

## Exercise 0.2 — Commit & prepare for Day 1
- Create a short README entry describing the chosen project scope (Interactive Hero / Particle Playground / Shader Banner).
- Push commits and open a PR if using GitHub.

## Troubleshooting
- If port conflicts occur, change the `vite` port by setting `PORT` or using `npm run dev -- --port 5174`.
- If using the main repo, run `npm install` in the workspace root.

## Next
Proceed to Module 1 to add motion, easing, and accessible animation patterns.
