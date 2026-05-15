# 00 — Global Elements
**Files:** `index.html`, `styles.css`

---

## Loader (`index.html` lines 22–37)
The full-screen intro animation that plays on page load.

| Element | Current Value | How to change |
|---|---|---|
| Studio name in loader | `ØRENO STUDIO` | Edit line 34: `.loader-name` text |
| Loading counter | `00` → counts to 100 | Driven by JS in `script.js` |
| Loader circle SVG | Lines 27–33 | Stroke color: `rgba(245,243,238,0.75)` |

---

## Header / Top Nav (`index.html` lines 46–60)
Fixed header, always visible. Logo left, nav links + CTA right.

| Element | Line | Current Value |
|---|---|---|
| Logo image | 49 | `assets/SVG/black_logo.svg` |
| Logo fallback text | 52 | `ØRENO` |
| Nav link 1 | 55 | `Work` → scrolls to `#work` |
| Nav link 2 | 56 | `Studio` → scrolls to `#studio` |
| Nav CTA button | 57 | `Start a project` → `inquiry.html` |

**To change a nav link label:** Edit the text between `<a … class="nav-link">` tags.
**To change the CTA destination:** Edit `href="inquiry.html"` on `.nav-cta`.

---

## Mobile Bottom Nav (`index.html` lines 628–675)
4-tab bottom nav bar + CTA tab. Visible on touch/mobile only.

| Tab | Line | Label | Goes to |
|---|---|---|---|
| Home | 630 | `Home` | `.hero` |
| Services | 640 | `Services` | `#work` |
| Studio | 652 | `Studio` | `#studio` |
| Contact | 662 | `Contact` | `#contact` |
| CTA | 671 | `Start →` | `inquiry.html` |

---

## WhatsApp Floating Button (`index.html` lines 677–682)
Fixed bottom-right floating button.

| Element | Line | Current Value |
|---|---|---|
| WhatsApp link | 678 | `https://wa.me/94729537427` |
| Phone number | 678 | `94729537427` |

---

## Grain / Texture Overlay
`<div class="grain">` — CSS SVG noise filter. Opacity controlled in `styles.css` via `.grain { opacity }`.

---

## Panel Counter Labels
Each panel has `<span class="panel-index">XX / 13</span>` at its bottom-right. These are decorative and driven by the HTML directly. Update the number if you add/remove panels.

---

## CSS Variables (root tokens in `styles.css`)
Search `styles.css` for `:root {` to find all design tokens:
- `--c-bg` — background color (`#050505` dark / `#F5F3EE` light)
- `--c-fg` — foreground / text
- `--c-muted` — secondary text
- `--c-dim` — tertiary / labels
- `--c-border` — subtle borders
- `--pad-x` — horizontal page padding
- `--max-w` — max content width
- `--fs-h2`, `--fs-body`, `--fs-label` — font size scales
