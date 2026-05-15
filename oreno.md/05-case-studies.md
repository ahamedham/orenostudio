# 05 — Case Studies Panel
**File:** `index.html` lines 216–288
**CSS class:** `.section-case-studies`
**HTML id:** `#case-studies`
**Panel index:** 05 / 13

---

## Header

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag | `.section-tag` | 221 | `Selected Work` |
| Heading | `.section-h` | 222–224 | `The evidence is being compiled.` |
| Subtext | `.section-p` | 225 | `Three systems. Processing now.` |

---

## Case Study Cards
Currently 3 placeholder cards in "processing" state (no real projects yet).

### Card 01 (lines 230–246)
| Element | Line | Current Value |
|---|---|---|
| Tile label | `.cs-tile-label` | 235 | `Identity System` |
| Tile gradient | `--tile-grad` style | 233 | dark warm gradient |
| Project number | `.cs-project-num` | 239 | `PROJECT 01` |
| Progress bar target | `--cs-target` | 240 | `62%` |
| Status text | `.cs-status` | 242 | `Processing...` (animated dots) |
| Caption below card | `.cs-caption` | 245 | `Brand Architecture & Identity` |

### Card 02 (lines 248–263)
| Element | Line | Current Value |
|---|---|---|
| Tile label | `.cs-tile-label` | 253 | `Brand Architecture` |
| Tile gradient | `--tile-grad` style | 251 | dark cool/blue gradient |
| Project number | `.cs-project-num` | 257 | `PROJECT 02` |
| Progress bar target | `--cs-target` | 258 | `47%` |
| Caption | `.cs-caption` | 263 | `Visual System & Motion` |

### Card 03 (lines 265–282)
| Element | Line | Current Value |
|---|---|---|
| Tile label | `.cs-tile-label` | 270 | `Visual Language` |
| Tile gradient | `--tile-grad` style | 268 | dark green-tinted gradient |
| Project number | `.cs-project-num` | 274 | `PROJECT 03` |
| Progress bar target | `--cs-target` | 275 | `38%` |
| Caption | `.cs-caption` | 281 | `Interface & Art Direction` |

---

## Current State Notes
These are placeholder "processing" cards — no real project images yet. The design intentionally teases upcoming work.

## When You Have Real Projects
Each card's structure will need:
1. Replace `.cs-skeleton` (the gradient placeholder) with an actual image or real content div
2. Remove `.cs-scan-line`, `.cs-shimmer`, `.cs-overlay` (processing UI)
3. Add project name, real caption, and a link
Search `styles.css` for `.cs-card` to find all card styles.

## To Change a Progress Bar Value
Edit the `--cs-target` inline style (e.g., `style="--cs-target:75%"`). This is a CSS custom property read by the animation.

## To Change the Tile Gradient Color
Edit the `--tile-grad` inline style on the `.cs-skeleton` element. Use a `linear-gradient(138deg, ...)` value.
