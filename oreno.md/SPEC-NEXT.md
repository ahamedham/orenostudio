# SPEC — NEXT PHASE (planned)

Track planned work here. Move items to their own SPEC files when
development starts on them.

---

## 1. AI chat widget

**Status:** Worker deployed, UI not built.
**Spec:** See SPEC-AI.md → "Chat widget (PLANNED)" section.

**Priority:** High — the worker is already deployed and ready.

---

## 2. Case studies — replace placeholders

**Status:** Panel 05 has 3 placeholder "Processing..." cards.
**Work:** Replace with real case study cards when projects are ready to publish.

Each card should have:
- Project name / client (if public)
- Service category
- Hero image or visual
- Link to case study page

**Case study page system:** A `case-study.html` template already exists
from a prior build iteration with:
- Chapter navigation
- Sub-scroll zones
- Data-driven content injection (via JS object, not CMS)

Retrieve old case-study.html/js/css from previous version if needed.

---

## 3. Formspree setup

**Status:** Both forms have `YOUR_FORM_ID` placeholder.
**Work:** Create Formspree account, get real IDs, update both files.
Files to update:
- `script.js` line ~676 (contact form in Panel 10)
- `inquiry.html` JS submit handler

---

## 4. Mobile content fix

**Status:** Some panels have missing/incomplete content on mobile.
**Work:** Audit each panel at 375px width. Add mobile-specific layouts
where the horizontal-scroll content doesn't translate well to vertical.

Panels most likely needing attention:
- Panel 05 (case studies grid — may be too wide)
- Panel 07 (dissection stage — tooltip interaction)
- Panel 06 (marquee — width tweak)

---

## 5. Client dashboard (Laravel-based)

**Status:** Planned, not started.
**Scope:** Separate Laravel application, likely at `clients.oreno.lk` or
a subdirectory.

**Features planned:**
- Google Drive integration (share files with clients)
- Project-based messaging (per-project thread)
- Project status tracking
- Invoice/payment status

**Notes:**
- Keep design consistent with main site (Montserrat, same token system)
- Auth: email + password, no SSO initially
- This is a separate Laravel app — not part of this static site codebase

---

## 6. Footer copyright year

**Status:** Hard-coded as "2025". Should auto-update to current year.
**Fix:** One-liner in script.js:
```js
document.querySelector(".footer-mark").innerHTML =
  `© ${new Date().getFullYear()} ØRENO<br>Brand Architecture`;
```

---

## 7. SEO / meta

**Status:** Basic meta only.
**Add:**
- Open Graph tags (og:title, og:description, og:image)
- Twitter card
- Structured data (LocalBusiness schema)
- Sitemap.xml

---

## 8. Performance

- Images: logo.png / logodark.png are PNG (~45KB each). Consider WebP.
- SVGs load fine — no change needed.
- Consider preloading `black_o.svg` (used in hero above the fold).

---

## Versioning convention

`script.js?v=X.X` and `styles.css?v=X.X` — increment minor on any change,
major on architecture changes. Current: script v8.4, styles v8.0.
