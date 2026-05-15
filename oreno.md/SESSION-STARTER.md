# CLAUDE CODE — SESSION STARTER

Copy-paste this at the start of any Claude Code session on the ØRENO website.

---

## Prompt template

```
Read MASTER.md first, then read [SPEC FILE] before doing anything.

Task: [describe what you want to do]

Files involved: [list files, e.g. script.js, styles.css, index.html]
```

## Which SPEC to load

| Task | SPEC file |
|------|-----------|
| Adding/editing a panel or section copy | SPEC-PANELS.md |
| Scroll behaviour, reveals, GSAP animations | SPEC-SCROLL.md |
| Mobile layout, nav, breakpoint fixes | SPEC-MOBILE.md |
| Contact or inquiry forms | SPEC-FORMS.md |
| AI chat widget, Cloudflare Worker | SPEC-AI.md |
| Planning new features, case studies | SPEC-NEXT.md |

## Example sessions

**Fix mobile content on panels:**
```
Read MASTER.md, then SPEC-MOBILE.md, then SPEC-PANELS.md.
Task: Fix missing content on mobile for panels 05 and 07.
Files: index.html, styles.css
```

**Build the AI chat widget:**
```
Read MASTER.md, then SPEC-AI.md.
Task: Build the floating AI chat widget using the existing Cloudflare Worker.
The worker URL is: https://[your-worker].workers.dev
Files: index.html, script.js, styles.css
```

**Add a real case study to panel 05:**
```
Read MASTER.md, then SPEC-PANELS.md.
Task: Replace the PROJECT 01 placeholder card with real case study data.
Project: [name], Category: Brand Identity, Image: [path]
Files: index.html, styles.css
```

---

## Rules for every session

1. Read MASTER.md + relevant SPEC before writing any code
2. Never change CSS design tokens without explicit instruction
3. Montserrat only — no new font imports
4. All JS: try/catch, beginner-friendly, no advanced abstractions
5. After any layout change: check mobile (375px) before saying done
6. Increment `?v=` query string on script.js and styles.css after changes
