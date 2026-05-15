# 07 — Brand Dissection Panel
**File:** `index.html` lines 313–347
**CSS class:** `.section-dissection`
**HTML id:** `#system`
**Panel index:** 07 / 13

---

## Header

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag | `.section-tag` | 319 | `Identity Specimen` |
| Heading | `.section-h` | 320–322 | `The anatomy of a system built to last.` |
| Description | `.dissection-desc` | 325–327 | `Every element is a deliberate decision. Hover the wordmark to inspect the logic beneath the surface.` |

---

## Specimen Stage (Interactive Wordmark)
Lines 331–343. The large ØRENO wordmark that users hover to see tooltips.

| Element | Line | Current Value |
|---|---|---|
| Stage meta label | `.stage-meta` | 337 | `ØRENO / IDENTITY SYS. v1.0` |

### Letter Tooltips (`.ltr-tip` inside each `.ltr`)
Line 339 — all in one line. Each letter `<span class="ltr">` contains a child `<span class="ltr-tip">` with hover tooltip text.

| Letter | Tooltip text |
|---|---|
| Ø | `Crossed O — ambiguity by design` |
| R | `Weight: 700 / Montserrat` |
| E | `Tracking: −40 / tight` |
| N | `Diagonal tension` |
| O | `Closure — the full system` |

**To change a tooltip:** Edit the text inside `<span class="ltr-tip">` for the corresponding letter.

---

## Visual / Animation Elements
- **Scan line** (`.specimen-scan`) — animated horizontal line that sweeps across the wordmark
- **Corner brackets** (`.stage-bracket--tl/tr/bl/br`) — decorative corner brackets framing the stage
- All purely CSS/JS decorative

## How Hover Interaction Works
JS in `script.js` adds an active class on `.ltr:hover` to reveal `.ltr-tip`. The tooltip fades/slides in. To disable tooltips on a letter, remove its `.ltr-tip` span.
