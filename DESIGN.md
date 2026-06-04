# ChamiNext — Design System

Aligned with Impeccable product register. Maps to `src/styles/design-system.css`.

## Color strategy

**Committed:** Electric blue accent on deep neutral base (~30% accent on CTAs, active nav, scores). Not full gradient-drenched surfaces.

- **Background primary:** `#0a0a0a` (tinted neutral, not pure black)
- **Background secondary:** `#1a1a1a`
- **Text primary:** `#f5f5f5`
- **Text secondary:** `#a0a0a0`
- **Accent:** `#3b82f6` (buttons, links, progress)
- **Success / evaluated:** green-400/500 for Ship Test completion only

Avoid `#000` / `#fff` literals in new components; use CSS variables.

## Typography

- **Font:** Inter (300, 400, 600, 700)
- **Hero:** 60px / tight leading (landing only)
- **Section:** 36px
- **Body:** 16px, line-height 1.6
- **Max line length:** 65–75ch for prose blocks

Hierarchy via scale + weight, not decoration.

## Spacing

8px grid: 8, 16, 24, 48, 96. Vary section padding for rhythm; avoid identical padding everywhere.

## Components

- **Cards:** `border` + `bg-secondary`, subtle hover border accent. No nested cards.
- **Buttons:** Primary (accent fill), secondary (outline), ghost (toolbars).
- **Tabs:** Premium tabs component; full-width scroll on mobile.
- **Tables:** Employers candidate ranking; horizontal scroll on small screens.

## Motion

- Transitions: 200–300ms ease-out (no bounce)
- Do not animate layout properties (width/height/top)
- Aurora / shader backgrounds: landing and section headers only; reduce opacity in dense tools

## Restricted patterns (use sparingly)

- `.glass` / glassmorphism: section backgrounds only, not every card
- `.text-gradient`: hero headline emphasis word only (one per view)
- AuroraBackground: not inside code editor or chat panels

## Mobile / PWA

- Bottom tab bar min height 56px; safe-area padding
- Touch targets ≥ 44px
- Daily flow: single column, progress ring at top

## Registers

- **Landing (brand):** More atmospheric background, stronger headline, fewer cards
- **Product (app):** Denser, utilitarian, clear step progress, monospace for code
