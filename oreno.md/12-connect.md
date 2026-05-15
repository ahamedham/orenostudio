# 12 — Connect / Reach Us Panel
**File:** `index.html` lines 504–574
**CSS class:** `.section-connect`
**Panel index:** 12 / 13

---

## Header

| Element | Class | Line | Current Value |
|---|---|---|---|
| Section tag | `.section-tag` | 509 | `Reach Us` |
| Heading | `.section-h` | 510 | `Every way to find us.` |

---

## Contact Tiles (`.clip-box`)
These are hover-reveal tiles — default state shows icon + label, hover state reveals the actual contact detail via a clip-path animation.

### Row 1 — 2 tiles (lines 516–533)

**Email tile (line 517)**
| Element | Current Value |
|---|---|
| `href` | `mailto:hello@orenostudio.com` |
| Default label | `Email` |
| Hover reveal text | `hello@orenostudio.com` |

**WhatsApp tile (line 525)**
| Element | Current Value |
|---|---|
| `href` | `https://wa.me/94729537427` |
| Default label | `WhatsApp` |
| Hover reveal text | `+94 72 953 7427` |

### Row 2 — 4 tiles (lines 535–568)

**Instagram (line 536)**
| Element | Current Value |
|---|---|
| `href` | `https://www.instagram.com/orenostudio/` |
| Default label | `Instagram` |
| Hover reveal text | `@orenostudio` |

**Facebook (line 544)**
| Element | Current Value |
|---|---|
| `href` | `https://www.facebook.com/orenostudio` |
| Default label | `Facebook` |
| Hover reveal text | `/orenostudio` |

**TikTok (line 552)**
| Element | Current Value |
|---|---|
| `href` | `https://www.tiktok.com/@orenostudio` |
| Default label | `TikTok` |
| Hover reveal text | `@orenostudio` |

**LinkedIn (line 560)**
| Element | Current Value |
|---|---|
| `href` | `https://www.linkedin.com/company/orenostudio` |
| Default label | `LinkedIn` |
| Hover reveal text | `/orenostudio` |

---

## How the Clip-Path Hover Works
Each `.clip-box` contains two states:
1. Default: icon + `.clip-label` (the platform name)
2. `.clip-overlay`: same icon + `.clip-label` (actual handle/address), revealed via CSS `clip-path` on hover (GSAP-driven in `script.js`)

**To change a social handle/username:** Edit the `.clip-label` text inside the `.clip-overlay` div.
**To change a link:** Edit the `href` on the `<a class="clip-box">` element.
**To change the default label:** Edit the `.clip-label` text OUTSIDE the `.clip-overlay` div.

## To Add a New Platform
Copy the `<a class="clip-box">` block structure. Add a new icon SVG and set both labels. Place inside either `.connect-row--2` (for 2-column row) or `.connect-row--4` (for 4-column row).
