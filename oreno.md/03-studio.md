# 03 — Studio Panel
**File:** `index.html` lines 121–142
**CSS class:** `.section-studio`
**HTML id:** `#studio` (nav scroll target)
**Panel index:** 03 / 13

---

## All Editable Text

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag / label | `.section-tag` | 126 | `ØRENO / Brand Architecture` |
| Heading | `.section-h` | 127–130 | `We design quiet, cinematic identities that feel inevitable.` |
| Body paragraph | `.section-p` | 131–134 | `Every interaction is mapped, measured, and aligned to a system built to scale. Not decoration — architecture.` |

---

## Visual Elements
- **Ø background image** (`.studio-right` / `.studio-o-bg`) — `assets/SVG/black_o.svg` displayed large as a decorative right-side element
  - To swap: change `src` on line 137
- **Heading sweep line** (`.heading-sweep-line`) — animated underline that draws in on scroll, decorative

---

## Layout
- Left column (`.studio-left`): all copy
- Right column (`.studio-right`): large Ø SVG, `aria-hidden`
- On mobile: right column collapses/hides

---

## Notes
- All three text elements have class `reveal` — they animate in when scrolled into view
- The `<br>` tags in the heading control line breaks — remove or adjust for different wrapping
