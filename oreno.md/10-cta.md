# 10 — CTA Panel
**File:** `index.html` lines 449–463
**CSS class:** `.section-cta`
**Panel index:** 10 / 13

---

## All Editable Text

| Element | Class | Line | Current Value |
|---|---|---|---|
| Eyebrow / subtext | `.cta-eyebrow` | 452 | `For founders & teams` |
| Heading line 1 | `.cta-heading` | 453 | `When the work` |
| Heading line 2 | — | 454 | `is sharp, the brand` |
| Heading line 3 | — | 455 | `should be sharper.` |
| CTA button label | `.btn` | 457 | `Start the conversation` |
| CTA link | `href` | 457 | `inquiry.html` |

---

## Notes
- This is the primary mid-funnel CTA — designed to push visitors to the inquiry page
- The heading uses `<br>` for manual line breaks — adjust for different copy
- `.btn` is the shared light-background pill button style
- `.btn-arrow` inside the button is a CSS-animated arrow (no text content, purely decorative via CSS `::after`)
- Panel uses `.panel-index--light` (light panel counter) because background is dark

## To Change the CTA Destination
Edit `href="inquiry.html"` on the `.btn` anchor tag (line 457).
