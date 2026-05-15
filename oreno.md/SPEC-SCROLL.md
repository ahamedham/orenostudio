# SPEC — SCROLL & ANIMATION SYSTEM

## How horizontal scroll works

1. `setBodyHeight()` sets `document.body.style.height` = total track width
2. On `scroll` event, `handleScroll()` fires:
   - `clamped` = current scrollY, capped to `getMaxScroll()`
   - `track.style.transform = translateX(-clamped px)`
   - Progress bar fill = `clamped / maxScroll * 100%`
   - Hero parallax: `heroInner.style.transform = translateX(clamped * 0.3 px)`
3. Scroll-to-top button shown when scrollY > 200
4. On resize: recalculate body height; reset transform on mobile

**No GSAP ScrollTrigger** — pure JS scroll handler for performance.

---

## Loader sequence

```
page load
  → assets fetch (minimum 1800ms show time enforced)
  → counter ticks 00→100
  → panels split-slide out (left panel ← , right panel →)
  → loader-center fades
  → hero scramble starts ("ØRENO STUDIO" random chars → final)
  → hero eyebrow char reveal
  → Ø mark breathing float begins
  → hero subline + CTA fade up
```

Key vars: `MIN_SHOW = 1800ms`, `RAF_INTERVAL` for counter tick.

---

## Char reveal system

All headings use `.ch` spans (split by `splitChars()`):

```js
splitChars(el)   // wraps each char in .ch inner span with clip mask
revealChars(el, opts)  // GSAP fromTo: yPercent 105→0, stagger
```

`gsap.set(".ch", { yPercent: 105 })` runs immediately to pre-hide all chars.

**Reveal classes:**
- `.reveal` — triggered by section enter (bidirectional: fades out when leaving backward)
- `.reveal-up` — simple fade-up (used on hero CTA)

---

## Section triggers

Sections fire on scroll threshold. Logic in `handleScroll()`:

```js
const pct = clamped / maxScroll;  // 0→1 across full track
```

Each section has a threshold value (e.g., 0.09 for manifesto). When
`pct` crosses threshold and section hasn't fired yet, animation runs.

**Bidirectional:** sections also un-reveal when scrolling backward past
their threshold. Flag: `sectionsFired = {}` object, reset when going back.

---

## Per-section animations

| Panel | Animation |
|-------|-----------|
| 01 Hero | scramble + char reveal (loader exit) |
| 02 Manifesto | char reveal, line 1 then line 2, stagger |
| 03 Studio | tag → h2 char reveal → body fade |
| 04 Services | tag → h2 → rows cascade (stagger 0.08s) |
| 05 Case Studies | tag → h2 |
| 06 Marquee | — (always running) |
| 07 Dissection | heading + desc |
| 08 Process | tag → h2 → steps cascade |
| 09 CTA | eyebrow → big heading char reveal |
| 10 Contact | tag → heading → form fields stagger |
| 11 Footer | footer wordmark rises |

---

## Marquee (Panel 06)

CSS animation via `@keyframes marquee-scroll` — pure CSS, no JS.
On cursor hover: `cs.expand("PAUSE")` expands custom cursor.

---

## GSAP usage

**GSAP version:** 3.12.2 (CDN, no ScrollTrigger plugin loaded)

Used for:
- Hero entrance animations (fade/translate)
- Char reveals (`fromTo` with stagger)
- Custom cursor size transitions
- Ø mark mouse distortion (`feTurbulence` baseFrequency)
- Ø mark breathing float (`yo-yo` tween)
- Loader panel slides
- Scramble ticks (requestAnimationFrame, not GSAP)

**Not used:** ScrollTrigger, Flip, Draggable.

---

## Mobile scroll (≤768px)

On mobile the horizontal track is disabled:
- `track.style.transform = "translateX(0px)"`
- Native vertical scroll takes over
- Sections revealed via `IntersectionObserver`
- Manifesto revealed by `scroll` event with `scrollY` threshold
- Hero collapse: `gsap.set(".hero-main", { scale, opacity, y })` on scroll progress
- Mobile progress bar (`.m-progress-fill`) updated on `scroll`
- Section label (`.m-section-label`) updated by IntersectionObserver

---

## Page transitions

`.page-overlay` fades in before navigating away (nav links + logo click).
On new page load, overlay fades out.

```js
// outbound link interceptor
document.querySelectorAll("a[href]").forEach(a => {
  // skip anchors, mailto, external, #
  // on click: show overlay → setTimeout 380ms → navigate
});
```

---

## data-goto system

Clicking `[data-goto]` links scrolls to a target section:

```js
// desktop: calculates target panel's offsetLeft → scrolls body to that Y position
// works for: data-goto=".hero", data-goto="#work", data-goto="#studio", etc.
```

Mobile equivalent: `[data-goto-m]` handled separately by mobile nav logic.

---

## Known issues / TODOs

- Mobile content: some panels have missing/incomplete content on mobile.
  Structural fix needed (see SPEC-MOBILE.md).
- Case studies: placeholder cards — need replacing with real work.
- Contact form: `YOUR_FORM_ID` in Formspree URL not set.
