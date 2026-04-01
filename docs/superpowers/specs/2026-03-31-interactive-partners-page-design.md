# Interactive Partners Page — Design Spec

**Date:** 2026-03-31
**Status:** Approved

## Goal

Replace the static partners list with a visually rich, scroll-animated bubble canvas where each partner is a clickable circle that expands into a full-screen detail panel.

## Architecture

Four files:
- `src/data/partners.ts` — single source of truth for partner data (replaces inline array in partners.astro)
- `src/pages/partners.astro` — full rewrite: header + bubble canvas + partner guidelines
- `src/components/PartnerBubble.astro` — individual bubble (circle with logo + name)
- `src/components/PartnerPanel.astro` — full-screen expanded panel shown on bubble click

GSAP (with ScrollTrigger plugin) loaded via CDN in partners.astro for scroll animations.

## Data Shape

```ts
interface Partner {
  name: string;
  href: string;
  logoDomain?: string;         // override for partners whose href is a subpath of a shared domain (e.g. meetup.com)
  description?: string;
  stats?: { label: string; value: string }[];
  size: 'sm' | 'md' | 'lg';   // sm=80px, md=130px, lg=180px diameter
}
```

Logo resolution — 3-tier automatic fallback, no manual uploads required:
1. Clearbit: `https://logo.clearbit.com/{domain}`
2. Google favicon: `https://www.google.com/s2/favicons?domain={domain}&sz=128`
3. Styled initial-letter circle (CSS, using CGCS brand colors)

Domain extracted from `logoDomain` if provided, otherwise parsed from `href` at runtime. Partners whose `href` points to a subdirectory of a shared platform (Meetup, Eventbrite) must provide `logoDomain` explicitly (e.g. `logoDomain: 'acm.org'`).

## Visual Layout

**Page structure (top to bottom):**
1. White header section — "Our Partners" heading + description paragraph (existing copy, unchanged)
2. Dark navy bubble canvas — full-width, tall section (~100vh min-height); bubbles scattered organically via absolute positioning with predefined coordinates
3. Partner Guidelines section — existing content, unchanged

**Bubble sizing:**
- `lg` (180px) — most prominent/recognizable partners
- `md` (130px) — mid-tier partners
- `sm` (80px) — smaller or newer partners

**Bubble appearance:**
- White circle, subtle drop shadow
- Logo centered inside (via `<img>` with `object-fit: contain`)
- Partner name below logo, small text, centered
- Hover: slight scale-up (1.05) + cursor pointer
- Cursor always pointer (entire bubble is a button)

## Scroll Animation (GSAP ScrollTrigger)

Each bubble starts invisible (opacity 0) offset ~60px in a random direction (left / right / bottom). When the bubble enters the viewport, ScrollTrigger fires a GSAP tween:
- `opacity: 0 → 1`
- `x/y offset → 0`
- Duration: 0.6s, ease: `power2.out`
- Stagger: bubbles near each other animate slightly offset in time so they don't all pop simultaneously

Scroll animation is cosmetic only — all bubbles are always in the DOM and clickable even before animation fires (for accessibility/SEO).

## Click → Panel Expansion

**Wiring pattern:** A single shared `PartnerPanel` `<dialog>` element is rendered once in `partners.astro`. On bubble click, a JS handler populates the panel's content slots (logo, name, description, stats, href) from the bubble's `data-*` attributes, then calls `dialog.showModal()`. This matches the existing `Modal.astro` pattern in the codebase. Close calls `dialog.close()`.

The `<dialog>` element inherits the site's existing scroll-lock CSS (`html:has(dialog[open]) { overflow: hidden }`). No custom scroll-lock logic needed.

Clicking any bubble opens `PartnerPanel` as a full-screen overlay:

**Animation:** panel scales from 0.85 → 1 and fades in (opacity 0 → 1), duration 0.3s, centered on screen.

**Panel content:**
- X close button (top-right corner)
- Partner logo (large, ~120px, centered)
- Partner name (large heading)
- Description (if available) — 1-2 sentences
- Impact stats (if available) — displayed as a row of `value / label` pairs in CGCS teal
- "Visit Website →" button (CGCS green, opens in new tab)

**Close triggers:** X button click, Escape key, or clicking the dark backdrop behind the panel.

**Accessibility:** Panel traps focus while open; Escape closes; `aria-modal`, `role="dialog"` on the panel element.

## Logo Fallback Logic (client-side JS)

```js
// On each bubble's <img> error event:
// 1. Try Google favicon URL
// 2. On second error: replace <img> with a <div> showing the first letter of partner name
//    styled as a colored circle using CGCS primary blue (#1e3a5f)
```

## Partner Guidelines

Existing section kept below the bubble canvas, no changes to content or layout.

## Files Changed

| Action | Path |
|--------|------|
| New | `src/data/partners.ts` |
| Rewrite | `src/pages/partners.astro` |
| New | `src/components/PartnerBubble.astro` |
| New | `src/components/PartnerPanel.astro` |

## Mobile Layout

On viewports below 768px, the absolute-positioned bubble canvas switches to a CSS grid (3 columns) so bubbles don't overflow. Bubble coordinates (used for desktop) are percentage-based so they scale with the container. Size classes reduce proportionally on mobile (lg→md, md→sm equivalent).

## Out of Scope

- Three.js (GSAP is the right tool for 2D scroll animations)
- Stat bubbles (impact numbers floating independently in the canvas)
- Filter/search functionality
