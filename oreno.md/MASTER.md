# ØRENO WEBSITE — MASTER CONTEXT
> Load this file first in every Claude Code session.
> Then load whichever SPEC file matches the task.

## Quick orientation

| Item | Detail |
|------|--------|
| Project | oreno.lk — ØRENO Studio public website |
| Stack | Vanilla HTML / CSS / JS · GSAP 3.12.2 · Cloudflare Worker (AI proxy) |
| Hosting | cPanel shared host (PHP 8.2 available, but site is fully static) |
| Font | Montserrat 400 + 700 only — no other typefaces |
| Version | v8.4 (script.js v8.4, styles.css v8.0) |
| Live domain | oreno.lk |

## File map

```
oreno.website/
├── index.html          — main single-page site (11 horizontal panels)
├── inquiry.html        — standalone project inquiry form
├── script.js           — all JS (1088 lines): GSAP, scroll, mobile, forms
├── styles.css          — all CSS (1443 lines): tokens, layout, components
├── worker.js           — Cloudflare Worker: Claude API proxy + system prompt
├── .htaccess           — cPanel PHP config (not relevant to JS/CSS work)
├── launch.json         — VS Code launch config
├── assets/
│   ├── logo.png / logodark.png
│   └── SVG/
│       ├── black_logo.svg / white_logo.svg   — full wordmark
│       └── black_o.svg / white_O.svg         — Ø mark only
└── v4-oreno-website(9).zip  — old backup (ignore)
```

## Design tokens (CSS :root)

```css
--c-bg:       #F5F3EE   /* warm off-white — dominant */
--c-fg:       #0A0A0A   /* near-black */
--c-muted:    rgba(10,10,10,0.50)
--c-dim:      rgba(10,10,10,0.32)
--c-faint:    rgba(10,10,10,0.06)
--c-border:   rgba(10,10,10,0.08)
--c-border-h: rgba(10,10,10,0.20)

--pad-x:   clamp(1.6rem, 7vw, 6rem)
--max-w:   1140px

--fs-hero:  clamp(3.2rem, 10vw, 9.5rem)
--fs-h2:    clamp(1.8rem, 4.5vw, 3.2rem)
--fs-body:  clamp(0.78rem, 1.4vw, 0.88rem)
--fs-label: clamp(0.58rem, 0.9vw, 0.65rem)
--fs-cta:   clamp(2.4rem, 6.5vw, 5.5rem)

--ease-expo:   cubic-bezier(0.16, 1, 0.3, 1)
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
```

## Mobile breakpoint

`@media (max-width: 768px)` — switches from horizontal GSAP scroll to
native vertical scroll. Mobile nav bar appears (`.mobile-nav`).
Cursor hidden on touch devices.

## Spec files

| File | Covers |
|------|--------|
| `SPEC-PANELS.md` | All 11 horizontal panels: markup, classes, copy |
| `SPEC-SCROLL.md` | Horizontal scroll system, reveals, GSAP logic |
| `SPEC-MOBILE.md` | Mobile layout, nav bar, vertical scroll, known issues |
| `SPEC-FORMS.md` | Contact form (index) + inquiry form (inquiry.html) |
| `SPEC-AI.md` | Cloudflare Worker, AI chat widget (planned), system prompt |
| `SPEC-NEXT.md` | Planned next phase: client dashboard, case studies |

## Session start instructions for Claude Code

```
1. Read MASTER.md (this file)
2. Read the SPEC file for your task area
3. Never change design tokens without explicit instruction
4. Keep Montserrat-only — no new fonts
5. All new JS: try/catch, explicit error handling, no advanced abstractions
6. Test mobile (≤768px) after every layout change
```
