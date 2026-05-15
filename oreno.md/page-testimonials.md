# Page — testimonials.html
**File:** `testimonials.html`
**Type:** Standalone page (vertical scroll, not horizontal)

---

## Page Hero Section (lines 146–153)

| Element | Class | Line | Current Value |
|---|---|---|---|
| Page tag | `.testi-page-tag` | 149 | `Client Voices` |
| H1 heading | `.testi-page-heading` | 150 | `What clients say.` |
| Subtext | `.testi-page-sub` | 151 | `Honest words from brands we've had the privilege of building with.` |

Background: dark (`#050505`) with interactive thermodynamic canvas (same as hero on index).

---

## Testimonial Cards (Full List)
Each card is an `<article class="testi-full-card">` with a `<blockquote>` and `<cite>`.

### Card 01 (lines 158–163)
| Element | Current Value |
|---|---|
| Quote | `The seller was very responsive and communicated well — even prior to purchasing one of the website packages. This made me feel really comfortable about working with him.` |
| Author | `Damith Sankha` |

### Card 02 (lines 165–170)
| Element | Current Value |
|---|---|
| Quote | `The process was smooth, and the final result exceeded my expectations. Thank you for bringing my vision to life with such creativity and professionalism!` |
| Author | `Munazir Cassim` |

### Card 03 (lines 172–177)
| Element | Current Value |
|---|---|
| Quote | `A highly qualified designer with amazing communication skills. I highly recommend ØRENO for creative design services. Looking forward to working with you again. Thank you for the amazing work.` |
| Author | `Tharindu Sankalpa` |

---

## Back Link (line 183)
| Element | Current Value |
|---|---|
| Text | `← Back to ØRENO` |
| Destination | `index.html` |

---

## How to Add a New Testimonial
Copy the entire `<article class="testi-full-card">` block, paste after the last one, update `<blockquote>` text and `<cite>` name.

## Note: Quote Text Differs From Panel 09
The quote in Card 03 here includes "Thank you for the amazing work." — the panel 09 version is shorter. Keep them in sync if needed.

## Page-Specific CSS
All page-specific styles are in a `<style>` block in the `<head>` (lines 15–114). No separate CSS file.
