# 13 — Footer Panel
**File:** `index.html` lines 576–616
**CSS class:** `.site-footer`
**Panel index:** 13 / 13

---

## All Editable Text

| Element | Class | Line | Current Value |
|---|---|---|---|
| Large background wordmark | `.footer-wordmark` | 578 | `ØRENO` |
| Copyright mark | `.footer-mark` | 580 | `© 2025 ØRENO Brand Architecture` |

---

## Footer Navigation Links (lines 581–588)

| Label | Line | Destination |
|---|---|---|
| `Studio` | 582 | scrolls to `#studio` |
| `Work` | 583 | scrolls to `#work` |
| `Case Studies` | 584 | scrolls to `#case-studies` |
| `Testimonials` | 585 | scrolls to `#testimonials` |
| `All Reviews` | 586 | `testimonials.html` |
| `Inquiry` | 587 | `inquiry.html` |

---

## Footer Connect Button (lines 591–608)
Hover-reveal social icons triggered by a "Connect" button.

| Element | Line | Current Value |
|---|---|---|
| Button label | 593 | `Connect` |
| Instagram link | 595 | `https://www.instagram.com/orenostudio/` |
| Facebook link | 598 | `https://www.facebook.com/orenostudio` |
| TikTok link | 601 | `https://www.tiktok.com/@orenostudio` |
| LinkedIn link | 604 | `https://www.linkedin.com/company/orenostudio` |

Each icon has `--i:0/1/2/3` inline style for staggered animation delay.

---

## Back to Start Link (line 611)
| Element | Line | Current Value |
|---|---|---|
| Link text | `.footer-back` | 611 | `← Back to start` |
| Destination | `data-goto` | 611 | `.hero` |

---

## Copyright Year
Update `© 2025` in the `.footer-mark` on line 580 when the year changes.

## To Add a Footer Nav Link
Duplicate one `<a>` inside `.footer-links` and set the `href` or `data-goto` attribute.
