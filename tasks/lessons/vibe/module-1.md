# Module 1 — Visuals & Motion Basics

Duration: 1.5–2 hours

## Objective
Introduce motion techniques to give UI a clear "vibe": CSS transforms, transitions, keyframe animations, easing, and accessible motion.

## Learning outcomes
- Use transforms and transitions for smooth state changes
- Build keyframe animations and control timing functions
- Respect `prefers-reduced-motion` and optimize for performance
- Integrate simple motion into React components

## Concepts
- Transform vs. layout: use `transform` (translate/scale/rotate) for performant motion
- Transition properties: `transition-property`, `duration`, `timing-function`, `delay`
- Easing: `ease`, `ease-in-out`, cubic-bezier, and custom curves
- Keyframes for sequenced animations
- Motion preferences: `@media (prefers-reduced-motion: reduce)`

## Quick examples

### CSS transition (hover scale)

```css
.card {
  transition: transform 240ms cubic-bezier(.22,.9,.29,1), box-shadow 240ms;
}
.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(2,6,23,0.6);
}
```

### Keyframe pulse

```css
@keyframes pulse { to { transform: scale(1.05); opacity: .95 } }
.pulse { animation: pulse 950ms ease-in-out infinite alternate; }
```

### Prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  .pulse, .animated { animation: none !important; transition: none !important; }
}
```

### React example — subtle button press

```jsx
import React from 'react'
import './motion.css'

export default function PressableButton({ children }) {
  return (
    <button className="pressable" onMouseDown={() => {}}>{children}</button>
  )
}
```

motion.css

```css
.pressable { transition: transform 160ms cubic-bezier(.2,.8,.2,1); }
.pressable:active { transform: translateY(2px) scale(.995); }
```

## Exercise 1.1 — Convert a static hero to animated
- Add a subtle entrance animation to the hero title: fade in + slide up using keyframes or CSS transition triggered by a `mounted` class.
- Respect `prefers-reduced-motion`.

Hints:
- Use `opacity` + `transform: translateY(18px)` to avoid layout thrashing.
- Toggle a `mounted` class from a small `useEffect` in React.

## Exercise 1.2 — Build a motion utility
- Create a small utility CSS file (`src/courses/vibe/examples/motion-utils.css`) with a set of reusable classes: `.fade-up`, `.stagger-child`, `.scale-on-hover`, and `.reduced-motion-safe`.
- Apply them to components in `courses/vibe-starter/src/App.jsx` and commit.

## Mini-challenge (30–45 min)
- Implement a small animated card grid: cards lift on hover, have subtle entrance staggering, and pause animations when `prefers-reduced-motion` is set.

## Deliverables
- Updated `courses/vibe-starter` with motion utilities
- A short notes file in `tasks/lessons/vibe/notes-module-1.md` describing choices and accessibility considerations

## Next
We'll cover Canvas basics and a simple particle system in Module 2. If you'd like, I can implement the motion utilities in the starter now and update `courses/vibe-starter/src/App.jsx` with examples.
