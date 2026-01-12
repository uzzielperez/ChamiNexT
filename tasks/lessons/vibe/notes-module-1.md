# Module 1 — Motion notes

Short notes about the motion utilities and accessibility decisions used in the starter.

- Use `transform` and `opacity` for performant motion; avoid animating layout properties.
- Entrance animations use a small mount delay and class toggle to avoid layout thrashing.
- Stagger is implemented with a per-card `--i` CSS variable and `transition-delay`.
- `prefers-reduced-motion` disables transitions to respect user preference.
- Cards use subtle lift on hover; keep effects lightweight to preserve performance on mobile.

Files updated:
- `courses/vibe-starter/src/motion-utils.css` — reusable motion classes
- `courses/vibe-starter/src/App.jsx` — example usage and staggered card grid

Next: add a small exercise and test to verify reduced-motion behavior, or implement more motion utilities (spring-based JS motion) if desired.
