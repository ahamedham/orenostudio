# 06 — Marquee Separator Panel
**File:** `index.html` lines 290–311
**CSS class:** `.section-marquee`
**Panel index:** 06 / 13

---

## All Editable Text
The marquee repeats its items twice (two `.marquee-item` divs) for seamless looping. **Only edit the first block** (lines 293–308) — the second block (with `aria-hidden="true"`) is a duplicate for the loop animation.

| # | Current Text | Line |
|---|---|---|
| 1 | `Brand Architecture` | 294 |
| 2 | `Visual Identity` | 295 |
| 3 | `Motion Systems` | 296 |
| 4 | `Interface Design` | 297 |
| 5 | `Art Direction` | 298 |
| 6 | `Precision` | 299 |

Separator between items: `<span class="dot"></span>` (renders as `·`)

---

## Notes
- The marquee scrolls continuously via CSS animation (`styles.css` → `.marquee-track`)
- Speed is controlled by `animation-duration` on `.marquee-track` in `styles.css`
- To add a new item: add `<span>New Item</span><span class="dot"></span>` to **both** `.marquee-item` blocks
- To remove an item: remove the `<span>` pair from both blocks
- `aria-hidden="true"` on this entire panel — it's decorative
