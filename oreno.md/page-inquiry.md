# Page — inquiry.html
**File:** `inquiry.html`
**Type:** Standalone page (dark theme, full viewport form)

---

## Page Header

| Element | Class | Line | Current Value |
|---|---|---|---|
| Logo image | `img` | 276 | `assets/logodark.png` (inverted with CSS filter) |
| Nav link 1 | `.nav-link` | 281 | `Work` → `index.html#work` |
| Nav link 2 | `.nav-link` | 282 | `Studio` → `index.html#studio` |

---

## Form Introduction (lines 292–298)

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag | `.section-tag` | 293 | `New Project` |
| H1 heading | `.page-heading` | 294 | `Start a project.` |
| Subline | `.page-subline` | 295–298 | `Tell us what you're building. We'll take it from there.` |

---

## Form Fields (lines 300–353)

| Label | Field ID | Type | Placeholder | Line |
|---|---|---|---|---|
| `What are you building?` | `f-vision` | textarea | `Describe your vision, brand, or project…` | 303–309 |
| `When do you need to move?` | `f-timeline` | text | `e.g. Q3 2025, ASAP, flexible…` | 311–317 |
| `Budget range?` | `f-budget` | text | `e.g. $5k – $15k` | 319–327 |
| `Your name` | `f-name` | text | `Full name` | 330–336 |
| `Your email` | `f-email` | email | `you@company.com` | 338–344 |

Submit button (line 348): `Send inquiry →`

---

## Success State (lines 356–365)
Shown after successful form submission (JS-triggered, replaces form).

| Element | Line | Current Value |
|---|---|---|
| Icon | `.success-icon` | 358 | `✦` |
| Heading | `.success-heading` | 359 | `We'll be in touch.` |
| Body text | `.success-body` | 360–362 | `Your inquiry has been received. Expect to hear from us within 48 hours.` |
| Back link | `.success-back` | 363 | `← Back to site` → `index.html` |

---

## Notes
- All CSS is inline in `<style>` tag in `<head>` — no external stylesheet (uses its own `:root` variables)
- Has its own custom cursor (`.cursor`) and thermodynamic canvas (`#inq-canvas`) 
- Form submission logic is inline in the `<script>` block — search for `inquiry-form` or `addEventListener('submit'`
- No GSAP ScrollTrigger used — only basic GSAP for page enter animation
- To change the 48-hour response promise: edit `.success-body` text
