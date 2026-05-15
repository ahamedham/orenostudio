# 01 — Hero Panel
**File:** `index.html` lines 68–110
**CSS class:** `.hero` / `.panel.hero`
**Panel index:** 01 / 13

---

## All Editable Text

| Element | Class | Line | Current Value |
|---|---|---|---|
| Eyebrow label | `.hero-eyebrow` | 76 | `Brand architecture.` |
| Main heading (H1) | `.hero-main` | 78–80 | `ØRENO STUDIO` |
| Subheading / tagline | `.hero-hyper-text` `data-text` | 83 | `Structured systems for brands that move in silence.` |
| Highlighted words | `data-highlights` | 84 | `systems,brands,silence` |
| CTA button label | `.hero-cta` | 88 | `Start a project` |
| CTA arrow | `.hero-cta-arrow` | 89 | `→` |
| CTA link destination | `href` | 88 | `inquiry.html` |
| Desktop scroll cue | `.scroll-desk-label` | 99 | `Scroll to explore` |
| Mobile swipe cue | `.swipe-label` | 105 | `Swipe to explore` |

---

## How the HyperText Works
The tagline uses a character-scramble effect. The displayed sentence is in `data-text`. The words in `data-highlights` get a visual emphasis treatment (color/glow). Comma-separate any words you want highlighted.

**Example prompt:** "Change the hero tagline to `[new text]` and highlight the words `[word1],[word2]`."

---

## Visual / Animation Elements
- **Thermo canvas** (`.hero-thermo-canvas`) — interactive heat-map grid background, JS-driven
- **Vignette** (`.hero-vignette`) — CSS radial gradient darkening edges
- **CSS grid background** — `::before` pseudo on `.hero` with `linear-gradient` rule grid lines (edit in `styles.css`)
- **Studio stats strip** — `12+ Brands`, `3 Disciplines`, `Since 2022` — see `script.js`, search for `hero-stats` or `count-up`

---

## Studio Stats Strip
Driven by JS (GSAP count-up). To find and edit the numbers/labels, search `script.js` for `studioStats` or `countUp`.

---

## Layout Notes
- `.hero-left` holds all copy — floated left on desktop
- Desktop: full-viewport panel in horizontal scroll track
- Mobile: position fixed, sections slide over it
