# 08 — Process Panel
**File:** `index.html` lines 349–403
**CSS class:** `.section-process`
**Panel index:** 08 / 13

---

## Header

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag | `.section-tag` | 354 | `How we work` |
| Heading | `.section-h` | 355–357 | `A system for building systems.` |

---

## Process Steps (2×2 Grid)
Four cells in `.process-grid`. Each cell has a ghost number (large background watermark), a display number, a title, and a week range.

### Step 01 (lines 363–369)
| Element | Line | Current Value |
|---|---|---|
| Ghost number | `.process-ghost` | 364 | `01` |
| Display number | `.process-num` | 366 | `01` |
| Title | `.process-title` | 367 | `Audit & Diagnosis` |
| Timeline | `.process-week` | 368 | `Wk 1–2` |

### Step 02 (lines 372–378)
| Element | Line | Current Value |
|---|---|---|
| Title | `.process-title` | 375 | `System Architecture` |
| Timeline | `.process-week` | 376 | `Wk 3–5` |

### Step 03 (lines 381–387)
| Element | Line | Current Value |
|---|---|---|
| Title | `.process-title` | 384 | `Application & Proof` |
| Timeline | `.process-week` | 385 | `Wk 6–8` |

### Step 04 (lines 390–397)
| Element | Line | Current Value |
|---|---|---|
| Title | `.process-title` | 393 | `Handoff & Direction` |
| Timeline | `.process-week` | 394 | `Ongoing` |

---

## Notes
- Grid is `2×2` — four cells in two columns, two rows
- Each `.process-cell` has class `reveal` for scroll animation
- Ghost numbers are `aria-hidden` large background numbers for visual depth
- To change the grid to `4×1` (single row): edit `styles.css` → search `.process-grid` → change `grid-template-columns`
- To add a Step 05: copy any `.process-cell` block and update number, title, and week
