# ØRENO Prompt Guide — Complete Element Dictionary
> Every editable element on the site. Text, visuals, animations, interactions, backgrounds — all of it.
>
> **Usage:** Start your message with the keyword, then say what to change.
> `[KEYWORD] — [what to change]`

---

## Quick Examples
```
CURSOR BLOB SIZE — make the default size larger
HERO GRID BACKGROUND — change line color to warm amber
THERMO TRAIL DECAY — make the trail fade faster
MANIFESTO LINE 1 — change to "Systems outlast trends."
SERVICE 01 BODY — rewrite to focus on web design
TESTIMONIAL ADD — "Brilliant work." — Reza Malik
```

---

## SITE-WIDE VISUAL EFFECTS

### Cursor
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `CURSOR BLOB` | The mix-blend-mode invert blob that follows the mouse | `styles.css` | `.cursor-blob` block |
| `CURSOR BLOB SIZE` | Default size (22×22px), expand on link (42px), expand on heading (68px) | `styles.css` | `.cursor-blob`, `.cursor-blob.is-link`, `.cursor-blob.is-heading` |
| `CURSOR BLOB SPEED` | How fast the blob follows the mouse (LERP value) | `script.js` | line ~121 `const LERP = 0.16` |
| `CURSOR CLICK PULSE` | Scale amount on click (1.6×) | `script.js` | line ~158 `scale(1.6)` |
| `CURSOR BLEND MODE` | mix-blend-mode (currently `difference`) | `styles.css` | `.cursor-blob { mix-blend-mode }` |
| `CURSOR DISABLED` | Cursor is hidden on touch/mobile | `styles.css` | `.cursor-blob { display:none }` media query |

---

### Grain / Film Noise
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `GRAIN OPACITY` | Intensity of the film grain texture overlay | `styles.css` | `.grain { opacity }` |
| `GRAIN` | The entire fixed grain overlay (on/off, opacity, size) | `styles.css` | `.grain` block (~line 47) |

---

### Page Transition Overlay
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `PAGE TRANSITION` | The full-page wipe animation when navigating between pages | `script.js` | `PAGE TRANSITION` block (~line 873) |
| `PAGE TRANSITION COLOR` | Background color of the wipe panel | `styles.css` | `.page-overlay { background }` |
| `PAGE TRANSITION SPEED` | Duration of the wipe (currently 0.55s) | `script.js` | `duration: 0.55` in the overlay tween |
| `PAGE TRANSITION EASE` | Easing curve of the wipe (`power3.inOut`) | `script.js` | `ease: "power3.inOut"` in overlay tween |

---

### Thermodynamic Mouse Trail (Global)
The heat-grid canvas that follows the cursor across all sections (except hero which has its own).
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `THERMO TRAIL` | Entire global thermo mouse trail system | `thermo-global.js` | whole file |
| `THERMO TRAIL GRID SIZE` | Cell size of the heat grid (currently 22px) | `thermo-global.js` | `const RES = 22` line ~19 |
| `THERMO TRAIL DECAY` | How fast the trail fades (0–1, higher = faster fade) | `thermo-global.js` | `const COOLING = 0.96` line ~20 |
| `THERMO TRAIL HEAT` | How much heat injected per mouse move (0.26 multiplier) | `thermo-global.js` | `0.26 * (1 - d/2)` line ~104 |
| `THERMO TRAIL COLOR LIGHT` | Trail color on light-bg sections | `thermo-global.js` | `PALETTES.light` block (~line 39) |
| `THERMO TRAIL COLOR DARK` | Trail color on dark-bg sections | `thermo-global.js` | `PALETTES.dark` block (~line 44) |
| `THERMO TRAIL OPACITY` | Max opacity of trail cells | `thermo-global.js` | `maxOpacity` values in `PALETTES` |
| `THERMO TRAIL DISABLE` | Turn off the trail entirely | `thermo-global.js` | delete the file or comment out `initGlobalThermoTrail()` |

---

### Progress Bar (Desktop)
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `PROGRESS BAR` | Thin top progress bar showing scroll position | `styles.css` + `script.js` | `.h-progress` / `.h-progress-fill` |
| `PROGRESS BAR COLOR` | Color of the fill (currently `var(--c-fg)`) | `styles.css` | `.h-progress-fill { background }` |
| `PROGRESS BAR HEIGHT` | Height of the bar (currently 2px) | `styles.css` | `.h-progress { height }` |

---

### Dot Navigation (Desktop Right)
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `DOT NAV` | Fixed right-side dot navigation system | `styles.css` + `script.js` | `.dot-nav` block / `buildDotNav()` |
| `DOT NAV DOT SIZE` | Size of each dot (currently 6×6px) | `styles.css` | `.dot-nav__btn { width, height }` |
| `DOT NAV ACTIVE COLOR` | Color of active dot | `styles.css` | `.dot-nav__item.is-active .dot-nav__btn { background }` |
| `DOT NAV LABELS` | Section label names shown on hover | `script.js` | `NAV_SECTIONS` array (~line 402), `label:` values |
| `DOT NAV POSITION` | Where it sits on screen (fixed right, 50% vertical) | `styles.css` | `.dot-nav { right, top, transform }` |

---

### Panel Arrows (Desktop Bottom)
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `PANEL ARROWS` | ← → navigation buttons at bottom of screen | `styles.css` + `script.js` | `.panel-arrows` block / `buildPanelArrows()` |
| `PANEL ARROWS SIZE` | Button size (currently 36×36px) | `styles.css` | `.panel-arrow { width, height }` |
| `PANEL ARROWS COLOR` | Border and icon color | `styles.css` | `.panel-arrow` border/color rules |

---

### Scroll Blur Effect
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `SCROLL BLUR` | Headings blur/smear while scrolling fast | `script.js` | `applyScrollBlur()` function (~line 359) |
| `SCROLL BLUR INTENSITY` | Max blur amount (currently 4.5px) | `script.js` | `Math.min(speed * 0.01, 4.5)` |
| `SCROLL BLUR DISABLE` | Turn off the blur effect entirely | `script.js` | remove `applyScrollBlur(clamped)` call |

---

### Parallax Depth Layers
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `PARALLAX` | Section tags, headings, body copy drift at different scroll speeds | `script.js` | `applyParallax()` function (~line 371) |
| `PARALLAX TAGS SPEED` | How much section tags shift (currently −20px relative) | `script.js` | `rel * -20` line ~377 |
| `PARALLAX HEADINGS SPEED` | How much headings shift (currently +12px) | `script.js` | `rel * 12` line ~383 |
| `PARALLAX BODY SPEED` | How much body text shifts (currently −8px) | `script.js` | `rel * -8` line ~389 |
| `PARALLAX QUOTE SPEED` | How much the testimonials decorative quote mark shifts (−40px) | `script.js` | `rel * -40` line ~396 |

---

### Section Reveal Animations
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `REVEAL ANIMATION` | The `.reveal` class fade+rise animation for non-heading elements | `script.js` | `revealObs` IntersectionObserver (~line 331) |
| `REVEAL SPEED` | Duration for reveal elements (currently 1.15s) | `script.js` | `duration: 1.15` in `revealObs` |
| `CHAR REVEAL` | Character-by-character clip-rise on headings | `script.js` | `revealChars()` function (~line 58) |
| `CHAR REVEAL SPEED` | Duration per heading char reveal (0.8s) | `script.js` | `opts.duration \|\| 0.8` in `revealChars()` |
| `CHAR REVEAL STAGGER` | Delay between each character (0.022s) | `script.js` | `opts.stagger !== undefined ? ... : 0.022` |

---

### CSS Design Tokens
| Keyword | What it changes | File | Location |
|---|---|---|---|
| `CSS TOKENS` | All root-level design variables | `styles.css` | `:root {}` block |
| `COLOR BACKGROUND` | Main background (`#050505` dark) | `styles.css` | `--c-bg` |
| `COLOR FOREGROUND` | Main text/fg color | `styles.css` | `--c-fg: rgba(245,243,238,0.92)` |
| `COLOR MUTED` | Secondary text | `styles.css` | `--c-muted` |
| `COLOR DIM` | Tertiary / label text | `styles.css` | `--c-dim` |
| `COLOR BORDER` | Subtle border color | `styles.css` | `--c-border` |
| `FONT SIZE HEADING` | H2 scale | `styles.css` | `--fs-h2` |
| `FONT SIZE BODY` | Body text scale | `styles.css` | `--fs-body` |
| `FONT SIZE LABEL` | Small caps label scale | `styles.css` | `--fs-label` |
| `PAGE PADDING` | Horizontal page padding | `styles.css` | `--pad-x` |
| `MAX WIDTH` | Max content width | `styles.css` | `--max-w` |

---

## 00 — LOADER

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `LOADER` | Entire intro loading screen | `index.html` lines 22–37, `script.js` ~line 946 |  |
| `LOADER NAME` | Studio name displayed during load | `index.html` | line 34: `.loader-name` |
| `LOADER COUNTER` | Animated 00→100 counter | `script.js` | counter `tick` interval ~line 966 |
| `LOADER MIN DURATION` | Minimum time loader shows (currently 2600ms) | `script.js` | `const MIN_SHOW = 2600` ~line 955 |
| `LOADER PANEL COLOR` | Background color of the two split panels | `styles.css` | `.loader-panel` |
| `LOADER Ø SVG` | The Ø circle+line SVG animation in the loader | `index.html` lines 27–33, `script.js` | `lo-circle` / `lo-line` tween |
| `LOADER SPLIT SPEED` | How fast the two panels split apart (currently 1.1s) | `script.js` | `duration: 1.1` in `splitReveal()` |

---

## 00 — HEADER

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `HEADER` | Fixed top bar | `index.html` lines 46–60 | `.site-header` |
| `HEADER LOGO` | Logo image + fallback text | `index.html` | lines 48–52 |
| `HEADER LOGO IMAGE` | SVG logo file path | `index.html` | line 49 `src="assets/SVG/black_logo.svg"` |
| `HEADER LOGO TEXT` | Fallback text if image fails | `index.html` | line 52 `ØRENO` |
| `HEADER DARK MODE` | Dark variant applied when on hero panel | `script.js` | `header--dark` class toggle ~line 1141 |
| `HEADER BLUR` | Backdrop blur on the header | `styles.css` | `.site-header { backdrop-filter }` |
| `HEADER HEIGHT` | Height of the header bar | `styles.css` | `.site-header { height }` |
| `HEADER NAV` | All nav links | `index.html` | lines 54–58 |
| `HEADER NAV LINK WORK` | "Work" nav link | `index.html` | line 55 |
| `HEADER NAV LINK STUDIO` | "Studio" nav link | `index.html` | line 56 |
| `HEADER NAV CTA` | "Start a project" button | `index.html` | line 57 |
| `HEADER NAV HOVER` | Underline animation on nav links (CSS `::after`) | `styles.css` | `.nav-link::after` |

---

## 00 — GLOBAL OVERLAYS & CHROME

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `SCROLL TO TOP BUTTON` | Fixed ← arrow to return to start | `index.html` line 621, `styles.css` `.scroll-top` | trigger: `clamped > 500` |
| `MOBILE PROGRESS BAR` | Vertical progress bar on mobile (left side) | `styles.css` `.m-progress` | `.m-progress-fill` height |
| `MOBILE SECTION LABEL` | `01 / INTRO` label shown on mobile while scrolling | `index.html` line 625, `script.js` `sectionLabels` array ~line 1294 | update labels in the `sectionLabels` array |
| `WHATSAPP BUTTON` | Floating WhatsApp button | `index.html` lines 677–682 | `.whatsapp-btn` |
| `WHATSAPP LINK` | Phone number in link | `index.html` | line 678 `href="https://wa.me/94729537427"` |

---

## 00 — MOBILE BOTTOM NAV

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `MOBILE NAV` | Entire bottom tab bar | `index.html` lines 628–675, `styles.css` `.mobile-nav` | |
| `MOBILE NAV HOME` | Home tab (icon + label) | `index.html` | line 630–638 |
| `MOBILE NAV SERVICES` | Services tab | `index.html` | lines 640–649 |
| `MOBILE NAV STUDIO` | Studio tab | `index.html` | lines 652–660 |
| `MOBILE NAV CONTACT` | Contact tab | `index.html` | lines 662–668 |
| `MOBILE NAV CTA` | "Start →" CTA tab | `index.html` | lines 671–673 |
| `MOBILE NAV BOUNCE` | Icon bounce animation on tap | `styles.css` | `@keyframes iconBounce` / `.mobile-nav__icon-wrap` |
| `MOBILE NAV ACTIVE LINE` | Underline under active tab label | `styles.css` | `.mobile-nav__item.is-active` |

---

## 01 — HERO PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `HERO EYEBROW` | Small label above title (`Brand architecture.`) | `index.html` | line 76 |
| `HERO HEADING` | Main H1 (`ØRENO STUDIO`) | `index.html` | lines 78–80 |
| `HERO HEADING SCRAMBLE` | Letter-scramble animation on load | `script.js` | `splitReveal()` ~line 988, `const SPEED`, `const CYCLES` |
| `HERO HEADING GLOW` | Breathing glow animation after scramble | `styles.css` + `script.js` | `hero-main--breathing` class / `@keyframes heroGlow` |
| `HERO TAGLINE` | Scrambled subheading sentence (in `data-text`) | `index.html` | line 83 |
| `HERO HIGHLIGHTS` | Words that get interactive scramble treatment (comma-separated in `data-highlights`) | `index.html` | line 84 |
| `HERO HIGHLIGHT SCRAMBLE SPEED` | Speed of the word-hover scramble (10ms/frame) | `script.js` | `const SPEED = 10` ~line 178 |
| `HERO HIGHLIGHT SCRAMBLE CHARS` | Character set used during scramble | `script.js` | `const CHARS = "ABCDEFG..."` ~line 177 |
| `HERO HIGHLIGHT AUTO CYCLE` | Auto-cycle that scrambles highlighted words every 3.5s | `script.js` | `setInterval(autoScrambleNext, 3500)` ~line 297 |
| `HERO CTA` | CTA button text + link | `index.html` | line 88 |
| `HERO CTA ARROW` | Arrow character after CTA label | `index.html` | line 89 |
| `HERO SCROLL CUE DESKTOP` | "Scroll to explore" label + line | `index.html` | lines 97–100 |
| `HERO SCROLL CUE MOBILE` | "Swipe to explore" label + hand icon | `index.html` | lines 101–106 |
| `HERO ENTRANCE SPEED` | How fast `.hero-inner` fades in after loader (1.3s) | `script.js` | line ~168 `duration: 1.3` |
| `HERO STATS` | `12+ Brands`, `3 Disciplines`, `Since 2022` strip | `script.js` | search `studioStats` or `countUp` |
| `HERO THERMO CANVAS` | Interactive heat-grid background in the hero | `index.html` line 70, `script.js` | `.hero-thermo-canvas` — separate instance from global thermo |
| `HERO GRID BACKGROUND` | CSS rule-grid lines behind the hero | `styles.css` | `.hero::before` `linear-gradient` pattern |
| `HERO VIGNETTE` | Radial gradient darkening the hero edges | `styles.css` | `.hero-vignette { background: radial-gradient }` |
| `HERO MOBILE PARALLAX` | Eyebrow, tagline, heading drift as mobile user scrolls down | `script.js` | `_heroScrub()` function ~line 755 |
| `HERO MOBILE EYEBROW PLANE` | How fast eyebrow exits on mobile scroll (fastest) | `script.js` | `ep = Math.min(p / 0.45, 1)` |
| `HERO MOBILE HEADING PLANE` | How fast main heading exits on mobile scroll (slowest) | `script.js` | `hp = Math.min(p / 0.70, 1)` |

---

## 02 — MANIFESTO PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `MANIFESTO LINE 1` | First statement | `index.html` | line 115 |
| `MANIFESTO LINE 2` | Second statement | `index.html` | line 116 |
| `MANIFESTO CHAR REVEAL` | Character-rise animation on manifesto lines | `script.js` | `case 1` in `fireSectionReveal()` ~line 436 |
| `MANIFESTO HIGHLIGHT BAR` | Gold bar that sweeps across each line after reveal | `script.js` + `styles.css` | `.manifesto-highlight-bar` / `case 1` sweep logic |
| `MANIFESTO HIGHLIGHT COLOR` | Color of the sweep bar (warm amber) | `styles.css` | `.manifesto-highlight-bar { background: rgba(200,160,80,0.10) }` |
| `MANIFESTO WORD GLOW` | Staggered glow on each word after bar sweep | `script.js` + `styles.css` | `@keyframes manifesto-word-glow` / `case 1` `setTimeout` |
| `MANIFESTO BACKGROUND` | Panel background color | `styles.css` | `.section-manifesto` background rules |
| `MANIFESTO FONT SIZE` | Size of the statement text | `styles.css` | `.manifesto-line` font-size |

---

## 03 — STUDIO PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `STUDIO TAG` | Section tag | `index.html` | line 126 |
| `STUDIO HEADING` | Main heading | `index.html` | lines 127–130 |
| `STUDIO BODY` | Body paragraph | `index.html` | lines 131–134 |
| `STUDIO Ø MARK` | Large background Ø SVG image on the right | `index.html` | line 137 `src="assets/SVG/black_o.svg"` |
| `STUDIO Ø OPACITY` | Opacity of the Ø mark (fades in to ~0.055) | `script.js` | `opacity: 0.055` in `case 2` of `fireSectionReveal()` |
| `STUDIO Ø SIZE` | CSS size of the Ø mark | `styles.css` | `.studio-o-bg` |
| `HEADING SWEEP LINE` | Animated underline that draws under heading | `styles.css` + `script.js` | `.heading-sweep-line` / sweep tween in each `fireSectionReveal` case |

---

## 04 — SERVICES PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `SERVICES HEADING` | Section heading | `index.html` | line 150 |
| `SERVICE 01 TITLE` | Row 1 title (`Visual Architecture`) | `index.html` | line 161 |
| `SERVICE 01 CAT` | Row 1 category tag (`Foundation`) | `index.html` | line 160 |
| `SERVICE 01 BODY` | Row 1 expanded body copy | `index.html` | line 169 |
| `SERVICE 02 TITLE` | Row 2 title (`Interface & Narrative`) | `index.html` | line 179 |
| `SERVICE 02 CAT` | Row 2 category tag (`Application`) | `index.html` | line 178 |
| `SERVICE 02 BODY` | Row 2 expanded body copy | `index.html` | line 187 |
| `SERVICE 03 TITLE` | Row 3 title (`Ongoing Direction`) | `index.html` | line 197 |
| `SERVICE 03 CAT` | Row 3 category tag (`Continuity`) | `index.html` | line 196 |
| `SERVICE 03 BODY` | Row 3 expanded body copy | `index.html` | line 205 |
| `SERVICE ADD` | Add a new 4th service row | `index.html` | after line 208 |
| `SERVICES ACCORDION HOVER` | Desktop: hovering a row opens it, closes others | `script.js` | `rows.forEach` + `mouseenter` ~line 1268 |
| `SERVICES ACCORDION CLICK` | Mobile: tap to toggle row open/close | `script.js` | `trigger.addEventListener("click"` ~line 1272 |
| `SERVICES ACCORDION ICON` | The `+` SVG that rotates to show open state | `index.html` | `.srow-icon` SVG in each row, `styles.css` for rotation |

---

## 05 — CASE STUDIES PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `CASE STUDIES HEADING` | Section heading | `index.html` | lines 222–224 |
| `CASE STUDIES SUBTEXT` | Subtext below heading | `index.html` | line 225 |
| `PROJECT 01 LABEL` | Tile label on card 1 (`Identity System`) | `index.html` | line 235 |
| `PROJECT 01 GRADIENT` | Dark gradient color of card 1 tile | `index.html` | line 233 `--tile-grad` inline style |
| `PROJECT 01 CAPTION` | Caption below card 1 | `index.html` | line 245 |
| `PROJECT 01 PROGRESS` | Progress bar fill % on card 1 (62%) | `index.html` | line 240 `--cs-target:62%` |
| `PROJECT 02 LABEL` | Tile label on card 2 (`Brand Architecture`) | `index.html` | line 253 |
| `PROJECT 02 GRADIENT` | Gradient on card 2 tile | `index.html` | line 251 |
| `PROJECT 02 CAPTION` | Caption below card 2 | `index.html` | line 263 |
| `PROJECT 02 PROGRESS` | Progress bar % on card 2 (47%) | `index.html` | line 258 |
| `PROJECT 03 LABEL` | Tile label on card 3 (`Visual Language`) | `index.html` | line 270 |
| `PROJECT 03 GRADIENT` | Gradient on card 3 tile | `index.html` | line 268 |
| `PROJECT 03 CAPTION` | Caption below card 3 | `index.html` | line 281 |
| `PROJECT 03 PROGRESS` | Progress bar % on card 3 (38%) | `index.html` | line 275 |
| `CASE STUDY SCAN LINE` | Animated scan line sweeping each card | `styles.css` | `.cs-scan-line` |
| `CASE STUDY SHIMMER` | Shimmer effect on the placeholder tile | `styles.css` | `.cs-shimmer` |
| `CASE STUDY STATUS TEXT` | "Processing..." animated dots text | `index.html` | `.cs-status` each card |

---

## 06 — MARQUEE PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `MARQUEE ITEMS` | All ticker words (edit first block only) | `index.html` | lines 294–299 |
| `MARQUEE ADD` | Add a word to the ticker | `index.html` | both `.marquee-item` blocks |
| `MARQUEE SPEED` | Animation duration/speed of the loop | `styles.css` | `.marquee-track { animation-duration }` |
| `MARQUEE DIRECTION` | Scroll direction (normal vs reverse) | `styles.css` | `.marquee-track { animation-direction }` |
| `MARQUEE SEPARATOR` | The `·` dot between items | `index.html` | `<span class="dot"></span>` |
| `MARQUEE FONT SIZE` | Text size in the marquee | `styles.css` | `.marquee-item span` or `.marquee-item` font-size |

---

## 07 — BRAND DISSECTION PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `DISSECTION TAG` | Section tag (`Identity Specimen`) | `index.html` | line 319 |
| `DISSECTION HEADING` | Section heading | `index.html` | lines 320–322 |
| `DISSECTION DESC` | Description paragraph | `index.html` | lines 325–327 |
| `DISSECTION META` | Stage meta label (`ØRENO / IDENTITY SYS. v1.0`) | `index.html` | line 337 |
| `LETTER TIP Ø` | Tooltip for Ø letter | `index.html` | line 339 first `.ltr-tip` |
| `LETTER TIP R` | Tooltip for R letter | `index.html` | line 339 second `.ltr-tip` |
| `LETTER TIP E` | Tooltip for E letter | `index.html` | line 339 third `.ltr-tip` |
| `LETTER TIP N` | Tooltip for N letter | `index.html` | line 339 fourth `.ltr-tip` |
| `LETTER TIP O` | Tooltip for O letter | `index.html` | line 339 fifth `.ltr-tip` |
| `DISSECTION PARALLAX` | Letters spread/float on mouse move | `script.js` | `dissectionStage mousemove` ~line 848 |
| `DISSECTION PARALLAX DEPTH` | How far letters spread (factor × 8 horizontal, 4 vertical) | `script.js` | `dx * factor * 8` and `dy * 4` ~line 854 |
| `DISSECTION AUTO HINT` | On-scroll: letters spread automatically once to hint interaction | `script.js` | `dissectionHinted` block ~line 711 |
| `DISSECTION SCAN LINE` | Animated horizontal scan sweep across wordmark | `styles.css` | `.specimen-scan` |
| `DISSECTION BRACKETS` | Corner bracket decorations around the stage | `index.html` lines 333–336, `styles.css` | `.stage-bracket--tl/tr/bl/br` |
| `DISSECTION STAGE BACKGROUND` | Background of the specimen stage box | `styles.css` | `.dissection-stage` |

---

## 08 — PROCESS PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `PROCESS HEADING` | Section heading | `index.html` | lines 355–357 |
| `PROCESS 01 TITLE` | Step 1 title (`Audit & Diagnosis`) | `index.html` | line 367 |
| `PROCESS 01 WEEK` | Step 1 timeline (`Wk 1–2`) | `index.html` | line 368 |
| `PROCESS 02 TITLE` | Step 2 title (`System Architecture`) | `index.html` | line 375 |
| `PROCESS 02 WEEK` | Step 2 timeline (`Wk 3–5`) | `index.html` | line 376 |
| `PROCESS 03 TITLE` | Step 3 title (`Application & Proof`) | `index.html` | line 384 |
| `PROCESS 03 WEEK` | Step 3 timeline (`Wk 6–8`) | `index.html` | line 385 |
| `PROCESS 04 TITLE` | Step 4 title (`Handoff & Direction`) | `index.html` | line 393 |
| `PROCESS 04 WEEK` | Step 4 timeline (`Ongoing`) | `index.html` | line 394 |
| `PROCESS NUMBER COUNTER` | Animated count-up on step numbers when panel enters view | `script.js` | `case 6` `.process-num` counter ~line 561 |
| `PROCESS NUMBER SPEED` | Speed of the count-up (80ms per increment) | `script.js` | `setInterval(... 80)` ~line 566 |
| `PROCESS GHOST NUMBERS` | Large background watermark numbers per step | `index.html` `.process-ghost` | `styles.css` `.process-ghost` |
| `PROCESS GRID LAYOUT` | 2×2 grid layout of the steps | `styles.css` | `.process-grid { grid-template-columns }` |

---

## 09 — TESTIMONIALS PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `TESTIMONIALS HEADING` | Section heading (`Words from the work.`) | `index.html` | lines 412–414 |
| `TESTIMONIAL 01 QUOTE` | Card 1 quote (always in `data-text`, not innerHTML) | `index.html` | line 422 |
| `TESTIMONIAL 01 AUTHOR` | Card 1 author | `index.html` | line 424 |
| `TESTIMONIAL 02 QUOTE` | Card 2 quote | `index.html` | line 429 |
| `TESTIMONIAL 02 AUTHOR` | Card 2 author | `index.html` | line 431 |
| `TESTIMONIAL 03 QUOTE` | Card 3 quote | `index.html` | line 436 |
| `TESTIMONIAL 03 AUTHOR` | Card 3 author | `index.html` | line 438 |
| `TESTIMONIAL ADD` | Add a new testimonial card | `index.html` | after line 439 |
| `TESTIMONIALS VIEW ALL` | "View all testimonials →" link | `index.html` | line 443 |
| `MAGIC TEXT ANIMATION` | Word-by-word scroll-reveal on testimonial quotes | `script.js` | `MAGIC TEXT` block ~line 1481 |
| `MAGIC TEXT SPEED` | How fast words fade in (GSAP stagger) | `script.js` | stagger values in `MAGIC TEXT` block |
| `TESTIMONIALS DECO QUOTE` | Large background `"` decorative mark | `index.html` | line 408 `.testi-deco-quote` |
| `TESTIMONIALS DECO QUOTE PARALLAX` | The `"` drifts on horizontal scroll (−40px) | `script.js` | `rel * -40` ~line 396 |

---

## 10 — CTA PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `CTA EYEBROW` | Label above heading (`For founders & teams`) | `index.html` | line 452 |
| `CTA HEADING` | Main CTA heading | `index.html` | lines 453–455 |
| `CTA BUTTON` | Button text + link destination | `index.html` | line 457 |
| `CTA BUTTON ARROW` | Arrow icon on button (CSS `::after`) | `styles.css` | `.btn-arrow::after` or `.btn::after` |
| `CTA BACKGROUND` | Panel background | `styles.css` | `.section-cta` background |

---

## 11 — CONTACT PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `CONTACT HEADING` | Section heading (`What are you building?`) | `index.html` | line 469 |
| `CONTACT FIELD NAME` | Name input placeholder | `index.html` | line 483 |
| `CONTACT FIELD EMAIL` | Email input placeholder | `index.html` | line 486 |
| `CONTACT FIELD MESSAGE` | Message textarea placeholder | `index.html` | line 492 |
| `CONTACT SUBMIT` | Submit button label (`Send inquiry`) | `index.html` | line 495 |
| `CONTACT FORM SUBMIT HANDLER` | Where form data is sent (Formspree endpoint) | `script.js` | line ~927 `fetch("https://formspree.io/f/YOUR_FORM_ID"` |
| `CONTACT FORM SENT TEXT` | "Sent ✓" confirmation text on button | `script.js` | line ~933 `btn.innerHTML = "Sent ✓"` |
| `CONTACT FORM ERROR TEXT` | "Failed — try WhatsApp" error on button | `script.js` | line ~937 |
| `WAVE PATH` | Elastic SVG line above the form that bends with mouse | `index.html` lines 472–478, `script.js` | `WAVEPATH` block ~line 1375 |
| `WAVE PATH COLOR` | Line stroke color (uses `currentColor`) | `index.html` | line 476 `stroke="currentColor"` |
| `WAVE PATH STROKE WIDTH` | Line thickness (currently 1.5) | `index.html` | line 476 `stroke-width="1.5"` |
| `WAVE PATH ELASTICITY` | How far the line bends (0.6 multiplier) | `script.js` | `p * 0.6` in `setPath()` ~line 1391 |
| `WAVE PATH RETURN SPEED` | How fast the line snaps back (0.025 lerp) | `script.js` | `lerp(progress, 0, 0.025)` ~line 1399 |
| `CONTACT FORM FIELD FOCUS LINE` | Bottom border that sweeps across on field focus | `styles.css` | `.form-field::after` or `.form-field:focus-within::after` |

---

## 12 — CONNECT / REACH US PANEL

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `CONNECT HEADING` | Section heading (`Every way to find us.`) | `index.html` | line 510 |
| `CONNECT EMAIL` | Email tile — link + hover reveal text | `index.html` | lines 517–524 |
| `CONNECT WHATSAPP` | WhatsApp tile — link + hover phone number | `index.html` | lines 525–532 |
| `CONNECT INSTAGRAM` | Instagram tile — link + hover handle | `index.html` | lines 536–543 |
| `CONNECT FACEBOOK` | Facebook tile — link + hover handle | `index.html` | lines 544–551 |
| `CONNECT TIKTOK` | TikTok tile — link + hover handle | `index.html` | lines 552–559 |
| `CONNECT LINKEDIN` | LinkedIn tile — link + hover handle | `index.html` | lines 560–567 |
| `CLIP BOX ANIMATION` | The clip-path reveal animation on tile hover | `script.js` | `CLIP-PATH LINKS` block ~line 1431 |
| `CLIP BOX ENTER SPEED` | Speed of hover reveal (currently 0.35s) | `script.js` | `duration: 0.35` in mouseenter tween |
| `CLIP BOX EXIT SPEED` | Speed of hover exit (currently 0.28s) | `script.js` | `duration: 0.28` in mouseleave tween |
| `CLIP BOX ENTER EASE` | Easing on reveal (`power2.out`) | `script.js` | `ease: "power2.out"` |
| `CONNECT ADD PLATFORM` | Add a new social/contact tile | `index.html` | copy a `.clip-box` block inside `.connect-row` |

---

## 13 — FOOTER

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `FOOTER WORDMARK` | Large background `ØRENO` text | `index.html` | line 578 |
| `FOOTER WORDMARK SIZE` | CSS font-size of the large background text | `styles.css` | `.footer-wordmark { font-size }` |
| `FOOTER COPYRIGHT` | `© 2025 ØRENO Brand Architecture` | `index.html` | line 580 |
| `FOOTER NAV` | All footer nav links | `index.html` | lines 581–588 |
| `FOOTER CONNECT BUTTON` | "Connect" hover-reveal social icon button | `index.html` | line 593 |
| `FOOTER CONNECT INSTAGRAM` | Footer IG link | `index.html` | line 595 |
| `FOOTER CONNECT FACEBOOK` | Footer FB link | `index.html` | line 598 |
| `FOOTER CONNECT TIKTOK` | Footer TT link | `index.html` | line 601 |
| `FOOTER CONNECT LINKEDIN` | Footer LI link | `index.html` | line 604 |
| `FOOTER CONNECT MOBILE TOGGLE` | Tap-to-toggle the connect icons on touch devices | `script.js` | `FOOTER CONNECT` block ~line 1350 |
| `FOOTER BACK` | "← Back to start" link text | `index.html` | line 611 |
| `FOOTER WORDMARK ENTRANCE` | Footer wordmark rises from below on scroll in | `script.js` | `case 11` in `fireSectionReveal()` |

---

## PAGE — inquiry.html

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `INQUIRY HEADING` | H1 (`Start a project.`) | `inquiry.html` | line 294 |
| `INQUIRY SUBLINE` | Subtext below heading | `inquiry.html` | lines 295–298 |
| `INQUIRY FIELD VISION` | "What are you building?" field | `inquiry.html` | lines 303–309 |
| `INQUIRY FIELD TIMELINE` | "When do you need to move?" field | `inquiry.html` | lines 311–317 |
| `INQUIRY FIELD BUDGET` | "Budget range?" field | `inquiry.html` | lines 319–327 |
| `INQUIRY FIELD NAME` | Name field | `inquiry.html` | lines 330–336 |
| `INQUIRY FIELD EMAIL` | Email field | `inquiry.html` | lines 338–344 |
| `INQUIRY SUBMIT` | "Send inquiry" button | `inquiry.html` | line 348 |
| `INQUIRY SUCCESS HEADING` | Success heading (`We'll be in touch.`) | `inquiry.html` | line 359 |
| `INQUIRY SUCCESS BODY` | Success body copy (48 hours promise) | `inquiry.html` | lines 360–362 |
| `INQUIRY SUCCESS ICON` | Success icon character (✦) | `inquiry.html` | line 358 |
| `INQUIRY BACKGROUND CANVAS` | Thermodynamic canvas background on inquiry page | `inquiry.html` | `#inq-canvas` + inline `<script>` block |
| `INQUIRY CURSOR` | Custom cursor on inquiry page | `inquiry.html` | `.cursor` + inline JS |

---

## PAGE — testimonials.html

| Keyword | What it changes | File | Location |
|---|---|---|---|
| `TESTI PAGE HEADING` | H1 (`What clients say.`) | `testimonials.html` | line 150 |
| `TESTI PAGE SUB` | Subtext below heading | `testimonials.html` | line 151 |
| `TESTI PAGE HERO CANVAS` | Interactive thermo background in page hero | `testimonials.html` | `.testi-hero-canvas` + inline JS |
| `TESTI PAGE CARD 01` | Full quote + author for card 1 | `testimonials.html` | lines 158–163 |
| `TESTI PAGE CARD 02` | Full quote + author for card 2 | `testimonials.html` | lines 165–170 |
| `TESTI PAGE CARD 03` | Full quote + author for card 3 | `testimonials.html` | lines 172–177 |
| `TESTI PAGE ADD` | Add a new full testimonial card | `testimonials.html` | after line 177 |
| `TESTI PAGE BACK LINK` | "← Back to ØRENO" link | `testimonials.html` | line 183 |
| `TESTI PAGE CARD BORDER` | Border style on each card | `testimonials.html` | `.testi-full-card { border }` in `<style>` block |
| `TESTI PAGE HOVER BORDER` | Border brightens on card hover | `testimonials.html` | `.testi-full-card:hover { border-color }` |

---

## Common Multi-Location Updates

### Change all CTAs to a new page
```
HERO CTA, CTA BUTTON, HEADER NAV CTA, MOBILE NAV CTA — change href to [URL]
Also update INQUIRY page links from index.html back to [URL]
```

### Change contact details everywhere
```
CONNECT WHATSAPP + WHATSAPP BUTTON — change number to [number]
CONNECT EMAIL — change to [email]
Also update FOOTER CONNECT if there's a whatsapp link there
```

### Add testimonial to both the panel and the full page
```
TESTIMONIAL ADD — "[quote]" — [Author Name]
TESTI PAGE ADD — same quote + author
```

### Tune animation timing site-wide
```
CHAR REVEAL SPEED — change to 0.6s
CHAR REVEAL STAGGER — change to 0.018
SCROLL BLUR INTENSITY — reduce to 2.5px max
```

### Update all social links at once
```
CONNECT INSTAGRAM + FOOTER CONNECT INSTAGRAM — change to [URL]
CONNECT FACEBOOK + FOOTER CONNECT FACEBOOK — change to [URL]
CONNECT TIKTOK + FOOTER CONNECT TIKTOK — change to [URL]
CONNECT LINKEDIN + FOOTER CONNECT LINKEDIN — change to [URL]
```

---

## Section Guide Index

| # | Keyword Prefix | Deep Dive File |
|---|---|---|
| — | `CURSOR`, `GRAIN`, `PAGE TRANSITION`, `THERMO TRAIL`, `PROGRESS BAR`, `DOT NAV`, `PANEL ARROWS`, `SCROLL BLUR`, `PARALLAX`, `REVEAL ANIMATION`, `CSS TOKENS` | `00-global.md` |
| 01 | `HERO` | `01-hero.md` |
| 02 | `MANIFESTO` | `02-manifesto.md` |
| 03 | `STUDIO` | `03-studio.md` |
| 04 | `SERVICE` / `SERVICES` | `04-services.md` |
| 05 | `PROJECT` / `CASE STUDIES` | `05-case-studies.md` |
| 06 | `MARQUEE` | `06-marquee.md` |
| 07 | `DISSECTION` / `LETTER TIP` | `07-dissection.md` |
| 08 | `PROCESS` | `08-process.md` |
| 09 | `TESTIMONIAL` / `TESTIMONIALS` | `09-testimonials.md` |
| 10 | `CTA` | `10-cta.md` |
| 11 | `CONTACT` / `WAVE PATH` | `11-contact.md` |
| 12 | `CONNECT` / `CLIP BOX` | `12-connect.md` |
| 13 | `FOOTER` | `13-footer.md` |
| — | `INQUIRY` | `page-inquiry.md` |
| — | `TESTI PAGE` | `page-testimonials.md` |
