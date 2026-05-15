# SPEC — MOBILE LAYOUT

## Breakpoint

`max-width: 768px` — all mobile overrides live under this media query.

---

## Mobile bottom nav (`.mobile-nav`)

5 items, fixed to bottom:

| Item | Icon | data-goto-m | Notes |
|------|------|-------------|-------|
| Home | house | `.hero` | `is-active` on hero |
| Services | grid | `#work` | |
| Studio | person | `#studio` | |
| Contact | envelope | `#contact` | |
| Start → | — | — | links to `inquiry.html`, `.mobile-nav__item--cta` |

Active state: `is-active` class on `.mobile-nav__item` updates as user scrolls.

IntersectionObserver watches: `.hero`, `#work`, `#studio`, `#contact`.
Threshold: 0.4.

---

## Mobile progress bar

`.m-progress` — thin line at top of viewport.
`.m-progress-fill` — width updates on `scroll` event as `scrollY / maxDocScroll * 100%`.

---

## Section label

`.m-section-label` — shows current section name.
Updated by IntersectionObserver. Labels defined in script.js:

```js
[
  { selector: ".hero",             label: "01 / INTRO",    gotoM: ".hero"    },
  { selector: ".section-manifesto",label: "02 / MANIFESTO" },
  { selector: "#studio",           label: "03 / STUDIO"   },
  { selector: "#work",             label: "04 / SERVICES" },
  { selector: "#case-studies",     label: "05 / WORK"     },
  { selector: ".section-dissection",label:"07 / SYSTEM"   },
  { selector: ".section-process",  label: "07 / PROCESS"  },
  { selector: "#contact",          label: "09 / CONTACT"  },
]
```

---

## Hero mobile behaviour

On mobile, as user scrolls down, the hero heading collapses:
```js
gsap.set(".hero-main", {
  scale:   1 + 0.55 * mp,
  opacity: 1 - 0.96 * mp,
  y:       -24 * mp
});
```
`mp` = scroll progress within hero section (0→1).

---

## Manifesto — mobile reveal

Triggered by `scrollY` passing a threshold (not IntersectionObserver).
Lines reveal via `revealChars()` same as desktop.

---

## IntersectionObserver sections

`.reveal` elements outside the hero fire via IO on mobile.
Threshold: `0.15`. Once revealed, not un-revealed.

---

## Known mobile issues

1. **Missing content on some panels** — mobile layout shows some panels
   with incomplete or absent content. Needs a structural pass to ensure
   all 11 panels have proper mobile-specific content/layout.

2. **Panel 06 Marquee** — width may need adjustment on very small screens.

3. **Dissection wordmark hover** — `.ltr-tip` tooltips are hover-only;
   on mobile they may not be visible. Consider tap-to-show alternative.

4. **Mobile nav active state** — `#system` panel (dissection, 07) not in
   nav, so no nav item highlights for it. Acceptable UX gap.

---

## Cursor

Hidden completely on mobile/touch:
```css
@media (hover:none),(max-width:768px){ .cursor{display:none;} body{cursor:auto;} }
```

---

## WhatsApp button positioning

Fixed position, bottom-right. On mobile sits above the mobile nav bar
(needs enough `bottom` value to clear the nav height ~60px).
Class: `.whatsapp-btn`.

---

## Typography mobile overrides

`--fs-hero`, `--fs-h2`, `--fs-cta` all use `clamp()` so they scale
automatically. No separate mobile type overrides needed for most cases.

`--pad-x: clamp(1.6rem, 7vw, 6rem)` — tighter on mobile naturally.
