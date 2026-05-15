# SPEC — PANELS (index.html)
> 11 horizontal panels inside `#h-scroll-wrapper > #h-track`

## Horizontal track structure

```html
<div id="h-scroll-wrapper">   <!-- fixed viewport container -->
  <div id="h-track">          <!-- translateX'd by JS on scroll -->
    <!-- panels here -->
  </div>
</div>
```

Body height is set by JS (`setBodyHeight()`) to equal the horizontal
scroll width, so native vertical scroll drives horizontal movement.

## Panel width classes

| Class | Width |
|-------|-------|
| (none) | `100vw` default |
| `.panel--wide-sm` | `72vw` |
| `.panel--wide-md` | `120vw` |
| `.panel--wide-lg` | `130vw` |
| `.panel--marquee` | `52vw` |

---

## Panel 01 — HERO `.panel.hero`

**Key elements:**
- `.hero-grid` — SVG grid background, fades in on load
- `.hero-o-bg` — large `black_o.svg`, mouse-parallax + SVG distortion filter
- `.hero-eyebrow` — "Brand architecture." (char-revealed)
- `.hero-main` — "ØRENO STUDIO" h1 (scramble animation on loader exit)
- `.hero-subline` — "Systems built for brands that operate with precision."
- `.hero-ticker` — infinite marquee strip: Brand Identity · Visual Systems · Motion Design · Naming · Brand Architecture
- `.hero-cta` — "Start a project →" → `inquiry.html`
- `.hero-right` — swipe hint (mobile only): `←` + "Swipe to explore"
- `.panel-index` — "01 / 11"

**SVG distortion:** `#hero-o-distort` filter on `.hero-o-bg`. Mouse moves
change `feTurbulence` baseFrequency and `feDisplacementMap` scale via GSAP.

---

## Panel 02 — MANIFESTO `.panel.section-manifesto`

Two full-width h2 lines, char-by-char reveal:
- "Structure outlasts style."
- "Silence outlasts noise."

Panel index: `02 / 11` with `.panel-index--light` (white text).

---

## Panel 03 — STUDIO `.panel.section.section-studio` `#studio`

**Left column:**
- `.section-tag` — "ØRENO / Brand Architecture"
- `.section-h` — "We design quiet, cinematic identities that feel inevitable."
- `.section-p` — "Every interaction is mapped, measured, and aligned to a system built to scale. Not decoration — architecture."

**Right column:**
- `.studio-o-bg` — `black_o.svg` decorative (aria-hidden)

Panel index: `03 / 11`

---

## Panel 04 — SERVICES `.panel.section-system` `#work`

Header: tag "Services" + h2 "What we do."

Three accordion rows (`.system-row`), each with:
- `.srow-trigger` button (aria-expanded)
- `.srow-num` — 01 / 02 / 03
- `.srow-cat` — category label
- `.srow-title` — service name
- `.srow-body-wrap` → `.srow-body-inner` → `.srow-body` (toggles `is-open`)

| # | Category | Title | Body copy |
|---|---------|-------|-----------|
| 01 | Foundation | Visual Architecture | Grayscale frameworks, hierarchy rules, motion systems. |
| 02 | Application | Interface & Narrative | Product, decks, environments. Controlled tension. |
| 03 | Continuity | Ongoing Direction | Long-term guidance for internal teams. |

Panel index: `04 / 11`

---

## Panel 05 — CASE STUDIES `.panel.panel--wide-md.section-case-studies` `#case-studies`

Three placeholder cards (`.cs-card`) — projects not yet live:
- PROJECT 01 — "Brand Architecture & Identity" — 62% progress
- PROJECT 02 — "Visual System & Motion" — 47% progress
- PROJECT 03 — "Interface & Art Direction" — 38% progress

Each card has: scan line animation, skeleton bars, progress fill bar, "Processing..." dots animation.

**TODO:** Replace with real case studies when ready.

Panel index: `05 / 11`

---

## Panel 06 — MARQUEE `.panel.panel--marquee.section-marquee`

Continuous scrolling text strip (`.marquee-track`):
Brand Architecture · Visual Identity · Motion Systems · Interface Design · Art Direction · Precision

Two `.marquee-item` divs for seamless loop. aria-hidden.

Panel index: `06 / 11` (light)

---

## Panel 07 — BRAND DISSECTION `.panel.section-dissection` `#system`

**Header:** "The anatomy of a system built to last."
**Desc:** "Every element is a deliberate decision. Hover the wordmark to inspect the logic beneath the surface."

**Specimen stage** (`.dissection-stage`):
- Scan line animation
- Corner brackets (TL, TR, BL, BR)
- Meta label: "ØRENO / IDENTITY SYS. v1.0"
- `.specimen-word` — each letter is `.ltr` with tooltip `.ltr-tip`:
  - Ø → "Crossed O — ambiguity by design"
  - R → "Weight: 700 / Montserrat"
  - E → "Tracking: −40 / tight"
  - N → "Diagonal tension"
  - O → "Closure — the full system"

Panel index: `07 / 11`

---

## Panel 08 — PROCESS `.panel.section-process`

**Header:** "A system for building systems."

Four process cells (`.process-cell`) in a 2×2 grid:

| # | Title | Week |
|---|-------|------|
| 01 | Audit & Diagnosis | Wk 1–2 |
| 02 | System Architecture | Wk 3–5 |
| 03 | Application & Proof | Wk 6–8 |
| 04 | Handoff & Direction | Ongoing |

Each cell has a ghost number (`.process-ghost`) behind the visible text.

Panel index: `08 / 11`

---

## Panel 09 — CTA `.panel.panel--wide-sm.section-cta`

Eyebrow: "For founders & teams"
Heading: "When the work is sharp, the brand should be sharper."
CTA button → `inquiry.html`

Panel index: `09 / 11` (light)

---

## Panel 10 — CONTACT `.panel.section-contact` `#contact`

Quick contact form (`.contact-form`, Formspree):
- Name (text, required)
- Email (email, required)
- Message (textarea, required)
- Submit: "Send inquiry" → `https://formspree.io/f/YOUR_FORM_ID` ⚠️ NEEDS UPDATING

Panel index: `10 / 11`

---

## Panel 11 — FOOTER `.panel.site-footer`

- `.footer-wordmark` — large "ØRENO" text (decorative)
- Copyright: "© 2025 ØRENO / Brand Architecture"
- Footer nav: Studio, Work, Case Studies, Inquiry
- Social links: Instagram (`orenostudio`) + TikTok (`orenostudio`)
- "← Back to start" link

Panel index: `11 / 11`

---

## Fixed UI elements (outside #h-track)

| Element | Purpose |
|---------|---------|
| `.global-loader` | Fullscreen split-panel loader, exits after assets ready |
| `.site-header` | Fixed header: logo + nav (Work, Studio) + "Start a project" CTA |
| `.cursor` | Custom cursor (desktop only, hidden on touch) |
| `.grain` | Fixed SVG noise overlay |
| `.page-overlay` | Page transition overlay |
| `.h-progress` | Horizontal scroll progress bar (top of page) |
| `.scroll-top ←` | Back-to-start button (appears after scrolling) |
| `.m-progress` | Mobile vertical scroll progress bar |
| `.m-section-label` | Mobile: current section label overlay |
| `.mobile-nav` | Mobile bottom nav bar (5 items) |
| `.whatsapp-btn` | WhatsApp floating button → `wa.me/94729537427` |
