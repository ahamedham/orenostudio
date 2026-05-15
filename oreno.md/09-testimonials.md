# 09 — Testimonials Panel
**File:** `index.html` lines 405–447
**CSS class:** `.section-testimonials`
**HTML id:** `#testimonials`
**Panel index:** 09 / 13

---

## Header

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag | `.section-tag` | 411 | `Client Voices` |
| Heading | `.section-h` | 412–414 | `Words from the work.` |

---

## Testimonial Cards
Each card has a quote (magic-text animated) and an author citation.

### Card 01 (lines 420–425)
| Element | Line | Current Value |
|---|---|---|
| Quote text | `data-text` attr | 422 | `The seller was very responsive and communicated well — even prior to purchasing one of the website packages. This made me feel really comfortable about working with him.` |
| Author | `.testi-author` | 424 | `— Damith Sankha` |

### Card 02 (lines 427–432)
| Element | Line | Current Value |
|---|---|---|
| Quote text | `data-text` attr | 429 | `The process was smooth, and the final result exceeded my expectations. Thank you for bringing my vision to life with such creativity and professionalism!` |
| Author | `.testi-author` | 431 | `— Munazir Cassim` |

### Card 03 (lines 434–439)
| Element | Line | Current Value |
|---|---|---|
| Quote text | `data-text` attr | 436 | `A highly qualified designer with amazing communication skills. I highly recommend ØRENO for creative design services. Looking forward to working with you again.` |
| Author | `.testi-author` | 438 | `— Tharindu Sankalpa` |

---

## "View all" Link (line 443)
| Element | Line | Current Value |
|---|---|---|
| Link text | `.testi-more` | 443 | `View all testimonials →` |
| Link destination | `href` | 443 | `testimonials.html` |

---

## How the Magic-Text Animation Works
Quote text lives in the `data-text` attribute (NOT as direct innerHTML). JS in `script.js` splits it word-by-word and animates each word in sequence when the card scrolls into view. **Always put the quote in `data-text`, not as plain text inside the div.**

## To Add a New Testimonial
Copy the entire `<div class="testi-card reveal">` block, update `data-text` and `.testi-author`. The JS will automatically handle the animation.

## To Remove a Testimonial
Delete the entire `<div class="testi-card reveal" role="listitem">` block.

## Decorative Quote Mark
Line 408: `<div class="testi-deco-quote">"</div>` — large decorative `"` in the background. Edit the character directly if needed.
