# 02 — Manifesto Panel
**File:** `index.html` lines 112–119
**CSS class:** `.section-manifesto`
**Panel index:** 02 / 13

---

## All Editable Text

| Element | Class | Line | Current Value |
|---|---|---|---|
| Line 1 | `.manifesto-line` | 115 | `Structure outlasts style.` |
| Line 2 | `.manifesto-line` | 116 | `Silence outlasts noise.` |

---

## Notes
- This panel is purely typographic — two large H2 lines centered on a dark background
- Both lines use the same `.manifesto-line` class
- Each line animates in independently (scroll-triggered reveal via JS)
- The panel uses `.panel-index--light` (white panel counter) because the background is dark

## To Add a Third Line
Duplicate the `<h2 class="manifesto-line">` element and add your text. The JS reveal will pick it up automatically.

## To Change the Background
The dark background comes from the global `.panel` styling. The manifesto panel overrides it — search `styles.css` for `.section-manifesto` to find background and typography rules.
