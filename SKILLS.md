# ChamiNext Design Skills

Working notes for keeping the UI impeccable: minimalistic, functional, with deliberate moments of wow. Read alongside `PRODUCT.md` and `DESIGN.md`. For any UI work, run the Impeccable preflight (`.cursor/rules/impeccable-chaminext.mdc`).

## Registers

- **Brand** (Home, Pricing): editorial, atmospheric, strong type hierarchy, fewer cards.
- **Product** (Practice, Daily, Ship Tests, Profile, Interview Simulator, Employers): dense, utilitarian, clear step progress, monospace for code.

Pick the register from the surface in focus before designing.

## Absolute bans (match and refuse)

These are enforced in code. If you are about to write one, restructure instead.

1. **Gradient text** (`background-clip: text` + gradient). The `.text-gradient` class is now a single solid color (`--accent-bright`). Emphasize with weight, size, or one solid accent color.
2. **Identical card grids** (icon + heading + text repeated). Use numbered editorial rows, dividers, or varied layouts. See the features section in `src/pages/HomePage.tsx`.
3. **Side-stripe borders** (`border-left/right` > 1px as accent). Use full borders, background tints, or leading numerals.
4. **Em dashes** in copy. Use commas, colons, semicolons, periods, or parentheses. Also avoid `--`.
5. **Glassmorphism as default.** Reserve blur/glass for rare, purposeful section backgrounds, never per card.
6. **Hero-metric template** (big number + label + three stat cards + gradient).
7. **Modal as first thought.** Prefer inline and progressive disclosure.

## Color

- **Strategy:** Committed electric blue on tinted-neutral base. Accent carries CTAs, active nav, and scores.
- **No purple drift.** Gradients are blue only (`#3b82f6 → #2563eb`). No `#8b5cf6`.
- **No pure `#000` / `#fff`.** Neutrals are tinted toward blue (`--bg-primary: #0a0b0d`, etc.). Use CSS variables, not literals, in new components.
- Tokens live in `src/styles/design-system.css` (`--accent-primary`, `--accent-bright`, `--bg-*`, `--text-*`, `--border-color`).

## Typography

- Inter. Hero 60px (landing only), section 36px, body 16px / 1.6.
- Hierarchy through scale + weight contrast (≥1.25 between steps), not decoration.
- Cap prose line length at 65–75ch (`max-w-xl` / `max-w-2xl`).

## Layout and rhythm

- Vary section padding for rhythm (`py-20`, `py-24`); avoid identical spacing everywhere.
- Do not wrap everything in a card or container. Dividers and whitespace often read cleaner.
- Use asymmetric 12-column grids for brand sections instead of centering everything.

## Motion

- 200–300ms ease-out. No bounce, no elastic.
- Never animate layout properties (width/height/top). Animate `transform` / `opacity`.
- Buttons lift with `translateY` + brightness, not a scale jump.
- Atmospheric backgrounds (Aurora/shader) on landing and section headers only; never inside code editors or chat panels.

## Mobile / PWA

- Bottom tab bar ≥ 56px with safe-area padding. Touch targets ≥ 44px.
- Daily flow is single column with a progress ring at the top.

## Recent pass

- Retired gradient text app-wide (`.text-gradient` → solid `--accent-bright`).
- Removed purple from all gradients; committed to electric blue.
- Tinted neutral palette toward brand hue.
- Rebuilt `HomePage` features as numbered editorial rows (was an identical 3-card grid) and formats as a divided numeral row (was gradient-text cards).
- Removed em dashes from landing copy; softened button hover.
