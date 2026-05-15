# 11 — Contact Panel
**File:** `index.html` lines 465–502
**CSS class:** `.section-contact`
**HTML id:** `#contact`
**Panel index:** 11 / 13

---

## All Editable Text

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag | `.section-tag` | 468 | `Get in touch` |
| Heading | `.section-h` | 469 | `What are you building?` |
| Name field placeholder | `placeholder` | 483 | `Name` |
| Email field placeholder | `placeholder` | 486 | `Email` |
| Message field placeholder | `placeholder` | 492 | `Tell us about your project` |
| Submit button label | `.btn.btn--dark` | 495 | `Send inquiry` |

---

## Form Fields

| Field | Type | Name attr | Line |
|---|---|---|---|
| Name | `text` | `name` | 483 |
| Email | `email` | `email` | 486 |
| Message | `textarea` | `message` | 491 |

The form currently has `novalidate` and shows inline `.form-error` spans on invalid submit. The form **does not have a backend submission handler** in the HTML — look in `script.js` for the submit event listener.

---

## WavePath (Decorative SVG Line)
Lines 472–478 — an elastic SVG line above the form that reacts to mouse movement on desktop only.
- The actual path drawing is done by JS in `script.js` — search for `wave-path` or `WavePath`
- The container is `.wave-path-wrap`, hover zone is `.wave-path-hover-zone`
- To hide the wave: add `display:none` to `.wave-path-wrap` in `styles.css`

---

## Notes
- The submit button uses `.btn--dark` variant (dark background, light text)
- Error messages are `<span class="form-error">Required</span>` — shown via JS on invalid submit
- Form submission logic is in `script.js` — search for `contact-form` or `addEventListener('submit'`
