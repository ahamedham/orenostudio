# SPEC — FORMS

## 1. Contact form (index.html, Panel 10)

**Selector:** `.contact-form`
**Endpoint:** `https://formspree.io/f/YOUR_FORM_ID` — ⚠️ PLACEHOLDER, needs real ID

**Fields:**
- `name` (text, required)
- `email` (email, required)
- `message` (textarea, required)

**Submit flow:**
1. Validate all `[required]` fields — show `.form-error` on empty
2. Disable button, set text to "Sending..."
3. `fetch()` POST to Formspree with `FormData`
4. Success: button → "Sent ✓", reset form after 3s
5. Error: button → "Failed — try WhatsApp"

**WhatsApp fallback:** `wa.me/94729537427`

---

## 2. Inquiry form (inquiry.html)

**Selector:** `#inquiry-form`
**Endpoint:** Same Formspree placeholder — ⚠️ ALSO needs real ID

**Fields:**
- `vision` (textarea) — "What are you building?" (required)
- `timeline` (text) — "When do you need to move?" (required)
- `budget` (text) — "Budget range?" (required)
- `name` (text) — "Your name" (required)
- `email` (email) — "Your email" (required)

**Page layout:** standalone page, not inside horizontal scroll.
- `.page-main > .page-inner > #form-wrap` — form visible initially
- `#success-wrap` — shown after successful submit (hidden initially)

**Success state:**
```html
✦
We'll be in touch.
[body copy]
← Back to site → index.html
```

**Validation:** same pattern as contact form — per-field `.field-error` spans.

---

## 3. Setting up Formspree

1. Go to formspree.io → create account
2. New form → get form ID (looks like `xpzgkrqb`)
3. Replace `YOUR_FORM_ID` in **both** script.js (contact form) and inquiry.html

In `script.js` around line 676:
```js
const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
```

In `inquiry.html` around the form submit handler:
```js
// same pattern — find the fetch call and replace YOUR_FORM_ID
```

---

## 4. Email alternative

Studio email: `contact@oreno.lk`
WhatsApp: `+94729537427` / `wa.me/94729537427`

Both are referenced in the Cloudflare Worker system prompt and footer.

---

## 5. Form styling notes

Inputs/textareas use bottom-border only style (no box border):
```css
border: none;
border-bottom: 1px solid var(--c-border);
background: transparent;
```

Focus state: border-bottom upgrades to `--c-fg`.
Error state: `.field-error` shown, border → red-ish.

Submit button `.btn-submit`:
- Full-width on mobile
- Arrow `→` icon animates right on hover
- Disabled state during submission
