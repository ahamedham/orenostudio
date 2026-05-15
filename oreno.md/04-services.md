# 04 — Services Panel
**File:** `index.html` lines 144–214
**CSS class:** `.section-system`
**HTML id:** `#work` (nav scroll target)
**Panel index:** 04 / 13

---

## Header

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag | `.section-tag` | 149 | `Services` |
| Heading | `.section-h` | 150 | `What we do.` |

---

## Service Rows (Accordion)
Each row is an expandable accordion item triggered by a `<button class="srow-trigger">`.

### Service 01 — Visual Architecture (lines 156–172)
| Element | Line | Current Value |
|---|---|---|
| Number | 159 | `01` |
| Category / tag | `.srow-cat` | 160 | `Foundation` |
| Title | `.srow-title` | 161 | `Visual Architecture` |
| Body copy | `.srow-body` | 169 | `Grayscale frameworks, hierarchy rules, and motion systems that lock brand presence into a single coherent language. Built to be adopted, not interpreted.` |
| Accordion ID | `srow-body-1` | 167 | — |

### Service 02 — Interface & Narrative (lines 174–190)
| Element | Line | Current Value |
|---|---|---|
| Number | 177 | `02` |
| Category / tag | `.srow-cat` | 178 | `Application` |
| Title | `.srow-title` | 179 | `Interface & Narrative` |
| Body copy | `.srow-body` | 187 | `Product, decks, and environments that carry the same controlled tension from first impression to final detail.` |
| Accordion ID | `srow-body-2` | 185 | — |

### Service 03 — Ongoing Direction (lines 192–208)
| Element | Line | Current Value |
|---|---|---|
| Number | 195 | `03` |
| Category / tag | `.srow-cat` | 196 | `Continuity` |
| Title | `.srow-title` | 197 | `Ongoing Direction` |
| Body copy | `.srow-body` | 205 | `Long-term guidance so internal teams move fast without eroding the system that makes the brand feel precise and deliberate.` |
| Accordion ID | `srow-body-3` | 203 | — |

---

## How to Add a 4th Service Row
1. Copy the entire `<div class="system-row reveal" role="listitem">` block (lines 156–172 as template)
2. Change the number to `04`
3. Set `aria-controls="srow-body-4"` on the button and `id="srow-body-4"` on the body wrap
4. Update category, title, and body copy

## How the Accordion Works
- JS in `script.js` listens for `.srow-trigger` click events
- Toggles `aria-expanded` on the button and a CSS class on `.srow-body-wrap` to show/hide content
- The `+` SVG icon rotates to `×` when open

## How to Reorder Services
Rearrange the three `<div class="system-row">` blocks in HTML. Update the `01`/`02`/`03` numbers accordingly.
