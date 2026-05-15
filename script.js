/* =====================================================
   ØRENO — script.js  v4.9
   Horizontal scroll · char-reveal · Ø distortion
===================================================== */

/* ── BFCACHE RESTORE ──
   The loader, hero entrance tweens, and horizontal-scroll
   engine all bootstrap inside window.load — which does NOT
   fire when the browser restores this page from its
   back/forward cache. Force a reload in that case so the
   intro sequence re-runs cleanly. */
window.addEventListener("pageshow", (e) => {
  if (e.persisted) window.location.reload();
});

/* ── LOGO FALLBACK ── */
document.querySelectorAll(".header-logo img, .hero-reveal-logo img").forEach(img => {
  img.addEventListener("error", () => {
    const fb = img.nextElementSibling;
    if (fb) { img.style.display = "none"; fb.style.display = "block"; }
    else    { img.parentElement.style.display = "none"; }
  });
});

/* =====================================================
   CHAR-SPLIT REVEAL — kobykooba-style clip rise
   Every heading is split into individual <span.ch>
   elements inside an overflow:hidden <span.ch-wrap>.
   Characters start below the clip (yPercent 105) and
   rise into view when their panel becomes active.
===================================================== */
function splitChars(el) {
  /* Handles both plain text and innerHTML with <br> tags */
  const segments = el.innerHTML.split(/<br\s*\/?>/i);
  const plainText = segments.map(s => s.replace(/<[^>]+>/g, "").trim()).join(" ");
  el.setAttribute("aria-label", plainText);
  el.innerHTML = "";

  segments.forEach((seg, si) => {
    const words = seg.replace(/<[^>]+>/g, "").trim().split(" ").filter(Boolean);
    words.forEach((word, wi) => {
      /* word container — keeps letters together on the same line */
      const wdWrap = document.createElement("span");
      wdWrap.className = "ch-word-group";
      wdWrap.style.cssText = "display:inline-block;white-space:nowrap;";
      [...word].forEach(ch => {
        const outer = document.createElement("span");
        outer.className = "ch-wrap";
        const inner = document.createElement("span");
        inner.className = "ch";
        inner.setAttribute("aria-hidden", "true");
        inner.textContent = ch;
        outer.appendChild(inner);
        wdWrap.appendChild(outer);
      });
      el.appendChild(wdWrap);
      if (wi < words.length - 1) {
        el.appendChild(document.createTextNode("\u00a0"));
      }
    });
    /* re-insert <br> between segments */
    if (si < segments.length - 1) {
      el.appendChild(document.createElement("br"));
    }
  });
}

function revealChars(el, opts = {}) {
  const chars = el.querySelectorAll(".ch");
  if (!chars.length) return;
  gsap.fromTo(chars,
    { yPercent: 105 },
    {
      yPercent:  0,
      duration:  opts.duration || 0.8,
      ease:      opts.ease     || "power3.out",
      stagger:   { each: opts.stagger !== undefined ? opts.stagger : 0.022, from: opts.from || "start" },
      delay:     opts.delay    || 0,
      overwrite: true,
    }
  );
}

/* Split the hero eyebrow for its entrance (char-rise stays) */
const heroEyebrowEl = document.querySelector(".hero-eyebrow");
if (heroEyebrowEl) splitChars(heroEyebrowEl);

/* =====================================================
   GOOEY MORPH — typographic word-cycling for manifesto
   Port of the React GooeyText component into vanilla JS.
   Two overlapping spans crossfade/blur under an SVG
   threshold filter, producing a liquid-metal transition.
===================================================== */
(function () {
  const reducedMotion = (typeof matchMedia === "function")
    ? matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  window.initGooeyMorph = function initGooeyMorph(root, opts) {
    if (!root || root.__gooeyReady) return;
    root.__gooeyReady = true;

    const a = root.querySelector("[data-gooey-a]");
    const b = root.querySelector("[data-gooey-b]");
    if (!a || !b) return;

    const texts       = (opts && opts.texts) || [];
    const morphTime   = (opts && opts.morphTime)    != null ? opts.morphTime    : 1.0;
    const cooldownT   = (opts && opts.cooldownTime) != null ? opts.cooldownTime : 0.45;
    if (texts.length < 2) { a.textContent = texts[0] || ""; return; }

    if (reducedMotion) { a.textContent = texts[0]; b.textContent = ""; return; }

    let textIndex = texts.length - 1;
    a.textContent = texts[textIndex % texts.length];
    b.textContent = texts[(textIndex + 1) % texts.length];

    let time = performance.now();
    let morph = 0;
    let cooldown = cooldownT;

    function setMorph(fraction) {
      b.style.filter  = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      b.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      const inv = 1 - fraction;
      a.style.filter  = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      a.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    }

    function doCooldown() {
      morph = 0;
      b.style.filter  = "";
      b.style.opacity = "100%";
      a.style.filter  = "";
      a.style.opacity = "0%";
    }

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) { cooldown = cooldownT; fraction = 1; }
      setMorph(fraction);
    }

    function tick(now) {
      requestAnimationFrame(tick);
      const shouldIncrement = cooldown > 0;
      const dt = (now - time) / 1000;
      time = now;
      cooldown -= dt;
      if (cooldown <= 0) {
        if (shouldIncrement) {
          textIndex = (textIndex + 1) % texts.length;
          a.textContent = texts[textIndex % texts.length];
          b.textContent = texts[(textIndex + 1) % texts.length];
        }
        morph += dt;
        doMorph();
      } else {
        doCooldown();
      }
    }
    requestAnimationFrame(tick);
  };
})();

/* Split section headings — char-rise reveal */
document.querySelectorAll(
  ".section-studio .section-h, .section-case-studies .section-h, .section-cta .cta-heading, " +
  ".section-system .section-h, .section-dissection .section-h, .section-process .section-h, " +
  ".section-testimonials .section-h, .section-contact .section-h, .section-connect .section-h"
).forEach(el => splitChars(el));

/* Set all chars to hidden-below-clip (before paint) */
gsap.set(".ch", { yPercent: 105 });

/* ── SPLIT HERO MAIN (legacy .split class) ── */
document.querySelectorAll(".split").forEach(el => {
  const text = el.textContent.trim();
  el.textContent = "";
  [...text].forEach(ch => {
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
  });
});

/* =====================================================
   CURSOR — blend-mode invert white blob
===================================================== */
const isFine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/* legacy aliases used by older code paths */
const cursor     = null;
const cursorText = null;

(function initCursor() {
  if (!isFine) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const blob = document.createElement("div");
  blob.className = "cursor-blob is-hidden";
  document.body.appendChild(blob);

  let mx = -200, my = -200;
  let bx = -200, by = -200;
  const LERP = 0.45;

  function loop() {
    if (!document.hidden) {
      bx += (mx - bx) * LERP;
      by += (my - by) * LERP;
      blob.style.left = bx + "px";
      blob.style.top  = by + "px";
    }
    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    blob.classList.remove("is-hidden");
  });
  document.addEventListener("mouseleave", () => blob.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => blob.classList.remove("is-hidden"));

  const LINK_SEL    = "a, button, .hero-cta, .nav-link, .nav-cta, .footer-links a, .nav-mobile__tab, .dot-nav__btn, .panel-arrow, .scroll-top, .clip-box, .srow-trigger";
  const HEADING_SEL = ".hero-main, .section-h, .cta-heading, .manifesto-line, .footer-wordmark";

  document.addEventListener("mouseover", e => {
    if (e.target.closest(HEADING_SEL)) {
      blob.classList.add("is-heading");
      blob.classList.remove("is-link");
    } else if (e.target.closest(LINK_SEL)) {
      blob.classList.add("is-link");
      blob.classList.remove("is-heading");
    } else {
      blob.classList.remove("is-link", "is-heading");
    }
  });

  /* click pulse */
  document.addEventListener("click", () => {
    blob.style.transform = "translate(-50%,-50%) scale(1.6)";
    setTimeout(() => { blob.style.transform = "translate(-50%,-50%) scale(1)"; }, 150);
  });
})();

/* (Ø distortion filter removed — hero now uses CSS rule grid) */

/* =====================================================
   HERO ENTRANCE — fires after loader reveals (cinematic)
===================================================== */
gsap.fromTo(".hero-inner",  { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", delay: 0.35 });
gsap.to(".hero-hyper-text", { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 1.15 });
gsap.to(".hero-cta",        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 1.55 });
gsap.to(".hero-scroll-cue", { opacity: 1,        duration: 1.2, ease: "power3.out", delay: 2.0  });

/* =====================================================
   HYPERTEXT SCRAMBLE — hero descriptor paragraph
===================================================== */
(function () {
  const CHARS  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
  const SPEED  = 10;   /* ms per frame */
  const CYCLES = 3;    /* scramble passes per letter */

  const container = document.querySelector(".hero-hyper-text");
  if (!container) return;

  const text    = container.dataset.text     || "";
  const hilite  = (container.dataset.highlights || "").split(",").map(s => s.trim());
  const clean   = w => w.toLowerCase().replace(/[^a-z0-9]/g, "");
  const words   = text.split(" ");

  words.forEach((word, i) => {
    const isKey = hilite.some(hw => clean(hw) === clean(word));

    const span = document.createElement("span");
    span.className = "h-word" + (isKey ? " h-word--interactive" : "");

    /* pill background */
    const bg = document.createElement("span");
    bg.className = "h-word__bg";
    span.appendChild(bg);

    /* accent dots (interactive only) */
    if (isKey) {
      ["h-word__dot--tr", "h-word__dot--bl"].forEach(cls => {
        const dot = document.createElement("span");
        dot.className = "h-word__dot " + cls;
        span.appendChild(dot);
      });
    }

    /* text layer */
    const txt = document.createElement("span");
    txt.className = "h-word__text";
    txt.textContent = word;
    span.appendChild(txt);

    /* scramble interaction */
    if (isKey) {
      let iv = null;

      span.addEventListener("mouseenter", () => {
        span.classList.add("h-word--hovered");

        /* shrink cursor to dot */
        if (isFine && cursor) {
          cursor.style.width       = "10px";
          cursor.style.height      = "10px";
          cursor.style.background  = "white";
          cursor.style.borderColor = "transparent";
          if (cursorText) cursorText.style.opacity = "0";
        }

        /* scramble animation */
        let pos = 0;
        if (iv) clearInterval(iv);
        iv = setInterval(() => {
          txt.textContent = word.split("").map((ch, idx) => {
            if (pos / CYCLES > idx) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("");
          if (++pos > word.length * CYCLES) {
            clearInterval(iv);
            txt.textContent = word;
          }
        }, SPEED);

        /* dim siblings */
        container.querySelectorAll(".h-word--interactive").forEach(el => {
          if (el !== span) el.classList.add("h-word--dimmed");
        });
      });

      span.addEventListener("mouseleave", () => {
        span.classList.remove("h-word--hovered");

        /* reset cursor */
        if (isFine && cursor) {
          cursor.style.width       = "36px";
          cursor.style.height      = "36px";
          cursor.style.background  = "transparent";
          cursor.style.borderColor = "white";
        }

        /* stop scramble */
        if (iv) clearInterval(iv);
        txt.textContent = word;

        /* undim siblings */
        container.querySelectorAll(".h-word--interactive").forEach(el => {
          el.classList.remove("h-word--dimmed");
        });
      });
    }

    container.appendChild(span);
    if (i < words.length - 1) container.appendChild(document.createTextNode(" "));
  });

  /* Idle pulse + auto-cycle (makes interactive words discoverable) */
  const interactiveSpans = [...container.querySelectorAll(".h-word--interactive")];
  interactiveSpans.forEach(s => s.classList.add("ht-idle"));

  let autoCycleIdx = 0;
  function autoScrambleNext() {
    const span = interactiveSpans[autoCycleIdx++ % interactiveSpans.length];
    if (!span) return;
    /* Remove idle pulse during scramble to avoid conflict */
    span.classList.remove("ht-idle");
    span.dispatchEvent(new MouseEvent("mouseenter"));
    setTimeout(() => {
      span.dispatchEvent(new MouseEvent("mouseleave"));
      setTimeout(() => span.classList.add("ht-idle"), 400);
    }, 900);
  }

  /* Start cycling after hero entrance completes (~2.8s) */
  gsap.delayedCall(2.8, () => {
    autoScrambleNext();
    setInterval(autoScrambleNext, 3500);
  });
}());

/* (hero wave canvas removed — hero uses CSS rule grid background) */

/* =====================================================
   HORIZONTAL SCROLL ENGINE — desktop only
   Panel 05 (case-studies) pins horizontally and exposes
   its interior as a vertical-flow zone. The "csBudget"
   below is the extra vertical scroll (in px) added to
   body height so window.scrollY can drive an interior
   translateY on .cs-vflow while the horizontal track
   stays clamped at panel 05's offsetLeft.
===================================================== */
const isMobile = () => window.innerWidth <= 768;
const track    = document.querySelector("#h-track");

/* ── CASE-STUDIES axis-swap geometry ── */
const csPanelEl = document.querySelector(".section-case-studies");
const csVflow   = document.querySelector(".cs-vflow");
let csStart  = 0;                 // panel 05 offsetLeft in horizontal track (pre-budget)
let csBudget = 0;                 // extra vertical scroll px redirected into cs-vflow translateY
const CS_SLIDES = 3;              // header + 2 cases
function computeCsGeometry() {
  if (!csPanelEl || isMobile()) { csStart = 0; csBudget = 0; return; }
  csStart  = csPanelEl.offsetLeft;
  csBudget = window.innerHeight * (CS_SLIDES - 1);   // (3 slides × 100vh) - 1vh viewport = 2vh
}

function getMaxScroll() {
  /* horizontal track max pan distance (unchanged by cs budget) */
  return track.scrollWidth - window.innerWidth;
}

/**
 * Map raw window.scrollY into:
 *   - trackX    : the horizontal track translate value
 *   - csInterior: the vertical translate applied to .cs-vflow (0 when outside cs zone)
 */
function computeHScroll(y) {
  if (csBudget <= 0 || y <= csStart) return { trackX: y, csInterior: 0 };
  if (y <= csStart + csBudget)       return { trackX: csStart, csInterior: y - csStart };
  return { trackX: y - csBudget, csInterior: csBudget };
}

function setBodyHeight() {
  if (isMobile()) { document.body.style.height = ""; return; }
  computeCsGeometry();
  document.body.style.height = (getMaxScroll() + window.innerHeight + csBudget) + "px";
}

setBodyHeight();

/* ── CACHED DOM REFS ── */
const progFill    = document.querySelector(".h-progress-fill");
const header      = document.querySelector(".site-header");
const scrollTopEl = document.querySelector(".scroll-top");
const heroInner   = document.querySelector(".hero-inner");
const heroMainEl  = document.querySelector(".hero-main");
const mPanel      = document.querySelector(".section-manifesto");
const statEl      = document.querySelector(".studio-stat-num");
const sPanel      = document.querySelector(".section-studio");
const dPanel      = document.querySelector(".section-dissection");

/* ── BIDIRECTIONAL REVEAL (non-heading elements) ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el   = entry.target;
    /* section headings + cta-heading are animated by fireSectionReveal — skip here */
    if (el.classList.contains("section-h") || el.classList.contains("cta-heading")) return;
    const isUp = el.classList.contains("reveal-up");
    if (entry.isIntersecting) {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.15, ease: "power3.out", overwrite: true });
    } else {
      gsap.to(el, { opacity: 0, y: isUp ? 16 : 20, duration: 0.55, ease: "power2.in", overwrite: true });
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal, .reveal-up").forEach(el => {
  if (!el.closest(".hero")) revealObs.observe(el);
});

/* ── STATE FLAGS ── */
let headerRevealed    = false;
let studioCountDone   = false;
let dissectionHinted  = false;
let currentScroll     = 0;
const sectionRevealed = new Set(); /* tracks which section timelines have fired */

/* ── SCROLL BLUR — headings smear when scrolling fast ── */
let _lastScrollX = 0;
const _blurTargets = ".section-h, .cta-heading, .manifesto-line";
function applyScrollBlur(x) {
  const speed  = Math.abs(x - _lastScrollX);
  _lastScrollX = x;
  const blurPx = Math.min(speed * 0.01, 4.5);
  if (blurPx > 0.5) {
    gsap.to(_blurTargets, { filter: `blur(${blurPx.toFixed(1)}px)`, duration: 0.05, overwrite: "auto" });
  } else {
    gsap.to(_blurTargets, { filter: "blur(0px)", duration: 0.4, overwrite: "auto" });
  }
}

/* ── PARALLAX LAYERS — section elements drift at different speeds ── */
function applyParallax(scrollX) {
  const vw = window.innerWidth;
  document.querySelectorAll(".section-tag").forEach(el => {
    const panel = el.closest(".panel");
    if (!panel) return;
    const rel = (scrollX - panel.offsetLeft) / vw;
    gsap.set(el, { x: rel * -20, overwrite: "auto" });
  });
  document.querySelectorAll(".section-h, .cta-heading").forEach(el => {
    const panel = el.closest(".panel");
    if (!panel) return;
    const rel = (scrollX - panel.offsetLeft) / vw;
    gsap.set(el, { x: rel * 12, overwrite: "auto" });
  });
  document.querySelectorAll(".section-p").forEach(el => {
    const panel = el.closest(".panel");
    if (!panel) return;
    const rel = (scrollX - panel.offsetLeft) / vw;
    gsap.set(el, { x: rel * -8, overwrite: "auto" });
  });
  const decoQ = document.querySelector(".testi-deco-quote");
  if (decoQ) {
    const panel = document.querySelector(".section-testimonials");
    if (panel) {
      const rel = (scrollX - panel.offsetLeft) / vw;
      gsap.set(decoQ, { x: rel * -40, overwrite: "auto" });
    }
  }
}

/* ── NAV SECTIONS ── */
const NAV_SECTIONS = [
  { sel: ".hero",                  label: "Hero"         },  /* 0  */
  { sel: ".section-manifesto",     label: "Manifesto"    },  /* 1  */
  { sel: ".section-studio",        label: "Studio"       },  /* 2  */
  { sel: ".section-system",        label: "Services"     },  /* 3  */
  { sel: ".section-case-studies",  label: "Work"         },  /* 4  */
  { sel: ".section-dissection",    label: "System"       },  /* 5  */
  { sel: ".section-process",       label: "Process"      },  /* 6  */
  { sel: ".section-testimonials",  label: "Testimonials" },  /* 7  NEW */
  { sel: ".section-cta",           label: "CTA"          },  /* 8  */
  { sel: ".section-contact",       label: "Contact"      },  /* 9  */
  { sel: ".section-connect",       label: "Connect"      },  /* 10 NEW */
  { sel: ".site-footer",           label: "Footer"       },  /* 11 */
];
const navSectionEls   = NAV_SECTIONS.map(s => document.querySelector(s.sel));
let currentSectionIdx = 0;
let dotNav    = null;
let arrowWrap = null;

/* =====================================================
   SECTION REVEAL TIMELINES
   Each section fires once when it scrolls into view.
   Chars rise up, tags slide in, rows cascade — the
   same choreography as kobykooba.com.
===================================================== */
function fireSectionReveal(idx) {
  if (sectionRevealed.has(idx)) return;
  sectionRevealed.add(idx);

  switch (idx) {

    /* ── 01 HERO ── handled by loader + scramble */

    /* ── 02 MANIFESTO ── tag → gooey morph fades in → sub */
    case 1: {
      const tag   = document.querySelector(".section-manifesto .manifesto-tag");
      const morph = document.querySelector(".section-manifesto .gooey-morph");
      const sub   = document.querySelector(".section-manifesto .manifesto-sub");

      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" });

      if (morph) {
        gsap.fromTo(morph,
          { opacity: 0 },
          {
            opacity: 1, duration: 1.1, ease: "power2.out", delay: 0.35,
            onComplete: () => {
              window.initGooeyMorph && window.initGooeyMorph(morph, {
                texts: ["Structure.", "Silence.", "Restraint.", "Discipline."],
                morphTime: 1.1,
                cooldownTime: 0.9
              });
            }
          });
      }

      if (sub) gsap.fromTo(sub, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 1.1 });
      break;
    }

    /* ── 03 STUDIO ── tag → heading (char-rise) → body ── */
    case 2: {
      const tag = document.querySelector(".section-studio .section-tag");
      const h   = document.querySelector(".section-studio .section-h");
      const p   = document.querySelector(".section-studio .section-p");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h) {
        gsap.set(h, { opacity: 1, y: 0, overwrite: true });
        revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.18 });
        const sweepLine = h.nextElementSibling;
        if (sweepLine && sweepLine.classList.contains("heading-sweep-line")) {
          const d = 0.18 + 0.8 + h.querySelectorAll(".ch").length * 0.02;
          gsap.to(sweepLine, { width: "100%", opacity: 0.18, duration: 0.6, ease: "power2.out", delay: d });
        }
      }
      if (p)   gsap.fromTo(p, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.55 });
      /* studio mark fades in */
      const oMark = document.querySelector(".studio-o-bg");
      if (oMark) gsap.fromTo(oMark, { opacity: 0, scale: 0.94 }, { opacity: 0.055, scale: 1, duration: 1.4, ease: "power2.out", delay: 0.3 });
      break;
    }

    /* ── 04 SERVICES ── tag → heading → rows cascade ── */
    case 3: {
      const tag  = document.querySelector(".section-system .section-tag");
      const h    = document.querySelector(".section-system .section-h");
      const rows = document.querySelectorAll(".section-system .system-row");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h) {
        gsap.set(h, { opacity: 1, y: 0, overwrite: true });
        revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.15 });
        const sweepLine = h.nextElementSibling;
        if (sweepLine && sweepLine.classList.contains("heading-sweep-line")) {
          const d = 0.15 + 0.8 + h.querySelectorAll(".ch").length * 0.02;
          gsap.to(sweepLine, { width: "100%", opacity: 0.18, duration: 0.6, ease: "power2.out", delay: d });
        }
      }
      rows.forEach((row, i) => {
        gsap.fromTo(row, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.35 + i * 0.08 });
      });
      break;
    }

    /* ── 05 CASE STUDIES ── header slide only; case slides animate on scroll via revealCsCase ── */
    case 4: {
      const tag = document.querySelector(".section-case-studies .section-tag");
      const h   = document.querySelector(".section-case-studies .section-h");
      const sub = document.querySelector(".section-case-studies .cs-stage-sub");
      const cue = document.querySelector(".section-case-studies .cs-scroll-cue");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h)   { gsap.set(h, { opacity: 1, y: 0, overwrite: true }); revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.15 }); }
      if (sub) gsap.fromTo(sub, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.5 });
      if (cue) gsap.fromTo(cue, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.85 });
      break;
    }

    /* ── 06 DISSECTION ── heading + hint already handled ── */
    case 5: {
      const tag = document.querySelector(".section-dissection .section-tag");
      const h   = document.querySelector(".section-dissection .section-h");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h) {
        gsap.set(h, { opacity: 1, y: 0, overwrite: true });
        revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.12 });
        const sweepLine = h.nextElementSibling;
        if (sweepLine && sweepLine.classList.contains("heading-sweep-line")) {
          const d = 0.12 + 0.8 + h.querySelectorAll(".ch").length * 0.02;
          gsap.to(sweepLine, { width: "100%", opacity: 0.18, duration: 0.6, ease: "power2.out", delay: d });
        }
      }
      /* dissection hint fires via existing code */
      break;
    }

    /* ── 07 PROCESS ── tag → heading → steps cascade + counters ── */
    case 6: {
      const tag   = document.querySelector(".section-process .section-tag");
      const h     = document.querySelector(".section-process .section-h");
      const steps = document.querySelectorAll(".process-cell");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h) {
        gsap.set(h, { opacity: 1, y: 0, overwrite: true });
        revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.12 });
        const sweepLine = h.nextElementSibling;
        if (sweepLine && sweepLine.classList.contains("heading-sweep-line")) {
          const d = 0.12 + 0.8 + h.querySelectorAll(".ch").length * 0.02;
          gsap.to(sweepLine, { width: "100%", opacity: 0.18, duration: 0.6, ease: "power2.out", delay: d });
        }
      }
      steps.forEach((s, i) => gsap.fromTo(s, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.35 + i * 0.09 }));
      /* Animated number counters */
      document.querySelectorAll(".process-num").forEach((el, i) => {
        const target = parseInt(el.textContent, 10) || (i + 1);
        gsap.delayedCall(0.4 + i * 0.1, () => {
          let n = 0;
          const iv = setInterval(() => {
            el.textContent = String(++n).padStart(2, "0");
            if (n >= target) clearInterval(iv);
          }, 80);
        });
      });
      break;
    }

    /* ── 07 TESTIMONIALS ── tag → heading → cards stagger ── */
    case 7: {
      const tag   = document.querySelector(".section-testimonials .section-tag");
      const h     = document.querySelector(".section-testimonials .section-h");
      const cards = document.querySelectorAll(".testi-stack__card");
      const more  = document.querySelector(".testi-more");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h) {
        gsap.set(h, { opacity: 1, y: 0, overwrite: true });
        revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.15 });
        const sweepLine = h.nextElementSibling;
        if (sweepLine && sweepLine.classList.contains("heading-sweep-line")) {
          const d = 0.15 + 0.8 + h.querySelectorAll(".ch").length * 0.02;
          gsap.to(sweepLine, { width: "100%", opacity: 0.18, duration: 0.6, ease: "power2.out", delay: d });
        }
      }
      // Back card (2) enters first, front card (0) last — so the stack builds toward the viewer.
      Array.from(cards).reverse().forEach((c, i) => {
        gsap.fromTo(c,
          { opacity: 0 },
          { opacity: 1, duration: 0.75, ease: "power3.out", delay: 0.35 + i * 0.14 }
        );
      });
      if (more) gsap.fromTo(more, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.85 });
      break;
    }

    /* ── 08 CTA ── heading char-rise, then button ── */
    case 8: {
      const tag = document.querySelector(".section-cta .section-tag");
      const h   = document.querySelector(".section-cta .section-h, .cta-heading");
      const btn = document.querySelector(".section-cta .btn");
      const ctaEl = document.querySelector(".section-cta");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0 });
      if (h) {
        gsap.set(h, { opacity: 1, y: 0, overwrite: true });
        revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.12 });
        const sweepLine = h.nextElementSibling;
        if (sweepLine && sweepLine.classList.contains("heading-sweep-line")) {
          const d = 0.12 + 0.8 + h.querySelectorAll(".ch").length * 0.02;
          gsap.to(sweepLine, { width: "100%", opacity: 0.18, duration: 0.6, ease: "power2.out", delay: d });
        }
      }
      if (btn) gsap.fromTo(btn, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.7 });
      if (ctaEl) ctaEl.classList.add("is-active");
      break;
    }

    /* ── 09 CONTACT ── tag → heading → wave-path → chips → fields → send-row ── */
    case 9: {
      const tag     = document.querySelector(".section-contact .section-tag");
      const h       = document.querySelector(".section-contact .section-h");
      const chips   = document.querySelectorAll(".section-contact .brief-chip");
      const fields  = document.querySelectorAll(".section-contact .form-field");
      const sendRow = document.querySelector(".contact-send-row");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h) {
        gsap.set(h, { opacity: 1, y: 0, overwrite: true });
        revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.14 });
        const sweepLine = h.nextElementSibling;
        if (sweepLine && sweepLine.classList.contains("heading-sweep-line")) {
          const d = 0.14 + 0.8 + h.querySelectorAll(".ch").length * 0.02;
          gsap.to(sweepLine, { width: "100%", opacity: 0.18, duration: 0.6, ease: "power2.out", delay: d });
        }
      }
      chips.forEach((c, i) => gsap.fromTo(c, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.35 + i * 0.06 }));
      fields.forEach((f, i) => gsap.fromTo(f, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.6 + i * 0.07 }));
      if (sendRow) gsap.fromTo(sendRow, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.9 });
      break;
    }

    /* ── 10 CONNECT ── tag → heading → grid ── */
    case 10: {
      const tag  = document.querySelector(".section-connect .section-tag");
      const h    = document.querySelector(".section-connect .section-h");
      const grid = document.querySelector(".connect-grid");
      if (tag)  gsap.fromTo(tag,  { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h) {
        gsap.set(h, { opacity: 1, y: 0, overwrite: true });
        revealChars(h, { duration: 0.8, stagger: 0.02, delay: 0.12 });
        const sweepLine = h.nextElementSibling;
        if (sweepLine && sweepLine.classList.contains("heading-sweep-line")) {
          const d = 0.12 + 0.8 + h.querySelectorAll(".ch").length * 0.02;
          gsap.to(sweepLine, { width: "100%", opacity: 0.18, duration: 0.6, ease: "power2.out", delay: d });
        }
      }
      if (grid) gsap.fromTo(grid, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.35 });
      break;
    }

    /* ── 11 FOOTER ── wordmark rises ── */
    case 11: {
      const wm = document.querySelector(".footer-wordmark");
      const fi = document.querySelector(".footer-inner");
      if (wm) gsap.fromTo(wm, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0 });
      if (fi) gsap.fromTo(fi, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      break;
    }
  }
}

/* ── CASE STUDIES · vertical rail + per-slide reveal ── */
const csRailFill   = document.querySelector(".cs-vrail-fill");
const csRailDots   = [...document.querySelectorAll(".cs-vrail-dot")];
const csCaseSlides = [...document.querySelectorAll(".cs-vslide--case")];
const csRevealed   = new Set();
const CS_REVEAL_THRESHOLD = 0.35;   // fraction of slide passed before reveal fires

function revealCsCase(slide) {
  if (!slide || csRevealed.has(slide)) return;
  csRevealed.add(slide);
  const monitor = slide.querySelector(".cs-monitor");
  const cap     = slide.querySelector(".cs-vcap");
  const stats   = slide.querySelectorAll(".cs-vcap-stats li");
  const tags    = slide.querySelectorAll(".cs-vcap-tags li");
  const cta     = slide.querySelector(".cs-vcap-cta");
  if (monitor) gsap.fromTo(monitor,
    { y: 40, opacity: 0, rotationX: 18 },
    {
      y: 0, opacity: 1, rotationX: 8,
      duration: 1.2, ease: "power3.out",
      onComplete: () => gsap.set(monitor, { clearProps: "transform,rotationX,y,opacity" })
    }
  );
  if (cap) gsap.fromTo(cap, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
  if (stats.length) gsap.fromTo(stats, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: 0.45 });
  if (tags.length)  gsap.fromTo(tags,  { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.6 });
  if (cta) gsap.fromTo(cta, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.75 });
}

function updateCsRail(csInterior) {
  if (csBudget <= 0 || !csRailDots.length) return;
  const vh       = window.innerHeight;
  const progress = csInterior / csBudget;                           // 0..1
  const slideIdx = Math.min(CS_SLIDES - 1, Math.round(csInterior / vh));
  csRailDots.forEach((d, i) => d.classList.toggle("is-active", i === slideIdx));
  if (csRailFill) csRailFill.style.height = (progress * 100) + "%";
  /* Per-slide reveal fires when the slide is mostly in view */
  csCaseSlides.forEach((slide, i) => {
    const slideStart = (i + 1) * vh;                                // slide 1 starts at 1vh interior, slide 2 at 2vh
    if (csInterior >= slideStart - vh * (1 - CS_REVEAL_THRESHOLD)) {
      revealCsCase(slide);
    }
  });
}

/* ── MAIN SCROLL HANDLER ── */
window.addEventListener("scroll", () => {
  if (isMobile()) return;
  const scroll  = window.scrollY;
  currentScroll = scroll;
  const max     = getMaxScroll();                           // horizontal track max
  const maxBody = max + csBudget;                           // total body scroll range

  /* Axis-swap remap: while inside the case-studies zone,
     horizontal track pins at csStart and the extra scroll
     pushes cs-vflow upward via translateY. */
  const { trackX, csInterior } = computeHScroll(
    Math.min(Math.max(scroll, 0), maxBody)
  );
  const clamped = trackX;                                   // everything below uses trackX

  /* translate track */
  track.style.transform = `translateX(${-clamped}px)`;

  /* translate vertical flow inside panel 05 */
  if (csVflow) csVflow.style.transform = `translateY(${-csInterior}px)`;

  /* scroll blur — headings smear when scrolling fast */
  applyScrollBlur(clamped);

  /* parallax depth layers */
  applyParallax(clamped);

  /* progress bar — track full body scroll so it advances through the pinned zone */
  if (progFill) progFill.style.width = ((Math.min(scroll, maxBody) / maxBody) * 100) + "%";

  /* case-studies vertical progress rail */
  updateCsRail(csInterior);

  /* header scrolled state */
  if (header) header.classList.toggle("site-header--scrolled", clamped > 60);

  /* reveal header on first scroll */
  if (!headerRevealed && clamped > 35) {
    headerRevealed = true;
    gsap.to(".header-logo", { opacity: 1, duration: 0.7, ease: "power2.out" });
    gsap.to(".header-nav",  { opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.05 });
  }

  /* hero inner parallax */
  if (heroInner) heroInner.style.transform = `translateX(${clamped * 0.3}px)`;

  /* scroll-to-top button */
  if (scrollTopEl) scrollTopEl.classList.toggle("visible", clamped > 500);

  /* ── per-section reveal triggers ── */
  const vw = window.innerWidth;
  for (let i = 1; i < navSectionEls.length; i++) {
    if (navSectionEls[i] && !sectionRevealed.has(i) &&
        clamped > navSectionEls[i].offsetLeft - vw * 0.62) {
      fireSectionReveal(i);
    }
  }

  /* dissection auto-explore hint (once) */
  if (dPanel && !dissectionHinted && clamped > dPanel.offsetLeft - vw * 0.5) {
    dissectionHinted = true;
    specimenLetters.forEach((ltr, i) => {
      const factor = (i - specimenLetters.length / 2) * 0.5;
      gsap.timeline({ delay: 0.3 + i * 0.05 })
        .to(ltr, { x: factor * 20, y: -8, duration: 0.5, ease: "power2.out" })
        .to(ltr, { x: 0, y: 0,         duration: 0.8, ease: "power3.out" });
    });
  }

  /* navigation state */
  if (arrowWrap) arrowWrap.classList.toggle("visible", clamped > 35);
  updateActiveSection(clamped);
  if (dotNav)    updateDotActiveState(dotNav);
  if (arrowWrap) updateArrowStates(arrowWrap);
}, { passive: true });


/* ── MOBILE: manifesto reveal on scroll ── */
if (mPanel) {
  const ioM = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !sectionRevealed.has(1)) {
      fireSectionReveal(1);
      ioM.disconnect();
    }
  }, { threshold: 0.25 });
  ioM.observe(mPanel);
}

/* ── MOBILE: reveal other sections via IntersectionObserver ── */
navSectionEls.forEach((el, i) => {
  if (!el || i === 0 || i === 1) return; /* hero + manifesto handled separately */
  if (!window.matchMedia("(max-width:768px)").matches) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !sectionRevealed.has(i)) {
      fireSectionReveal(i);
      obs.disconnect();
    }
  }, { threshold: 0.18 });
  obs.observe(el);
});

/* ── MOBILE: scrubbed hero collapse ── */
if (isMobile()) {
  const _heroScrub = () => {
    const sy   = window.scrollY;
    const pinH = window.innerHeight;
    const p  = Math.min(Math.max(sy / pinH, 0), 1);
    const ep = Math.min(p / 0.45, 1);   /* eyebrow: fastest plane  */
    const mp = Math.min(p / 0.55, 1);   /* body + cta: mid plane   */
    const hp = Math.min(p / 0.70, 1);   /* wordmark: heaviest, last */
    gsap.set(".hero-eyebrow",                    { opacity: 1 - ep, y: -60 * ep });
    gsap.set([".hero-hyper-text", ".hero-cta"],  { opacity: 1 - mp, y: -40 * mp });
    gsap.set(".hero-main",                       { opacity: 1 - hp, y: -15 * hp });
    gsap.set(".hero-scroll-cue",                 { opacity: Math.max(1 - p / 0.30, 0) });
  };

  let _scrubReady = false;
  setTimeout(() => { _scrubReady = true; _heroScrub(); }, 1600);
  window.addEventListener("scroll", () => { if (_scrubReady) _heroScrub(); }, { passive: true });
}

/* ── RESIZE ── */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    setBodyHeight();
    if (isMobile()) track.style.transform = "translateX(0px)";
  }, 150);
});

/* =====================================================
   NAV LINK CLICKS → horizontal pan
===================================================== */
document.querySelectorAll("[data-goto]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.dataset.goto);
    if (!target) return;
    if (isMobile()) { target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" }); return; }
    const idx = navSectionEls.findIndex(el => el === target);
    if (idx !== -1) scrollToSection(idx);
    else            scrollToSection_raw(target.offsetLeft);
  });
});

/* =====================================================
   TRACKPAD + TOUCH HORIZONTAL SCROLL
===================================================== */
let _wheelBusy = false;

/* Wheel is fully passive — native trackpad momentum is preserved. */
window.addEventListener("wheel", e => {
  if (isMobile()) return;
  if (_wheelBusy) { gsap.killTweensOf(_scrollProxy); _wheelBusy = false; }
}, { passive: true });


/* Touch swipe → snap */
let _tx = 0, _ty = 0, _tTime = 0, _tLocked = null;

window.addEventListener("touchstart", e => {
  if (isMobile()) return;
  _tx = e.touches[0].clientX; _ty = e.touches[0].clientY;
  _tTime = Date.now(); _tLocked = null;
}, { passive: false });

window.addEventListener("touchmove", e => {
  if (isMobile()) return;
  const dx = _tx - e.touches[0].clientX;
  const dy = _ty - e.touches[0].clientY;
  if (_tLocked === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
    _tLocked = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
  }
  if (_tLocked === "h") e.preventDefault();
}, { passive: false });

window.addEventListener("touchend", e => {
  if (isMobile() || _tLocked !== "h") return;
  const dx       = _tx - e.changedTouches[0].clientX;
  const velocity = Math.abs(dx) / Math.max(Date.now() - _tTime, 1);
  if (Math.abs(dx) > 35 || velocity > 0.25) {
    dx > 0
      ? scrollToSection(currentSectionIdx + 1)
      : scrollToSection(currentSectionIdx - 1);
  }
}, { passive: true });

/* =====================================================
   BRAND DISSECTION — specimen interactions
===================================================== */
const specimenLetters = document.querySelectorAll(".specimen-word .ltr");

if (isFine && specimenLetters.length) {
  const dissectionStage = document.querySelector(".dissection-stage");
  if (dissectionStage) {
    dissectionStage.addEventListener("mousemove", e => {
      const rect = dissectionStage.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
      const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
      specimenLetters.forEach((ltr, i) => {
        const factor = (i - specimenLetters.length / 2) * 0.5;
        gsap.to(ltr, { x: dx * factor * 8, y: dy * 4, duration: 0.6, ease: "power2.out", overwrite: true });
      });
    });
    dissectionStage.addEventListener("mouseleave", () => {
      specimenLetters.forEach(ltr => gsap.to(ltr, { x: 0, y: 0, duration: 0.8, ease: "power3.out" }));
    });
  }
}

/* =====================================================
   SCROLL-TO-START BUTTON
===================================================== */
if (scrollTopEl) {
  scrollTopEl.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* =====================================================
   PAGE TRANSITION
===================================================== */
const overlay = document.querySelector(".page-overlay");
document.addEventListener("click", e => {
  const link = e.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href || href === "#" || href.startsWith("mailto") ||
      href.startsWith("tel") || link.target === "_blank" ||
      link.hasAttribute("data-goto")) return;
  e.preventDefault();
  if (overlay) {
    gsap.fromTo(overlay,
      { y: "100%", opacity: 1 },
      { y: "0%", duration: 0.55, ease: "power3.inOut",
        onComplete: () => { window.location.href = href; } }
    );
  } else {
    window.location.href = href;
  }
});

/* =====================================================
   CONTACT FORM
===================================================== */
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.querySelectorAll("[required]").forEach(field => {
    field.addEventListener("input", () => {
      field.classList.remove("invalid");
      const wrap = field.closest(".form-field");
      if (wrap) wrap.classList.remove("show-error");
    });
  });

  /* Brief chips — project-type radio group */
  const chipRow = contactForm.querySelector(".brief-chip-row");
  const briefHidden = contactForm.querySelector("#contact-brief");
  if (chipRow && briefHidden) {
    chipRow.addEventListener("click", e => {
      const chip = e.target.closest(".brief-chip");
      if (!chip) return;
      chipRow.querySelectorAll(".brief-chip").forEach(c => c.setAttribute("aria-checked", "false"));
      chip.setAttribute("aria-checked", "true");
      briefHidden.value = chip.dataset.value || "";
    });
  }

  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll("[required]").forEach(field => {
      const wrap = field.closest(".form-field");
      if (!field.value.trim()) {
        valid = false;
        field.classList.add("invalid");
        if (wrap) wrap.classList.add("show-error");
      } else {
        field.classList.remove("invalid");
        if (wrap) wrap.classList.remove("show-error");
      }
    });
    if (!valid) return;

    const btn  = contactForm.querySelector(".btn");
    const orig = btn.innerHTML;

    /* Email verification gate */
    const emailField = contactForm.querySelector('input[name="email"]');
    const emailVal   = emailField ? emailField.value.trim() : "";
    let verifyToken = "";
    if (window.OrenoVerify && emailVal) {
      btn.innerHTML = "Verify email…"; btn.style.pointerEvents = "none";
      try {
        verifyToken = await window.OrenoVerify.verify(emailVal);
      } catch {
        btn.innerHTML = orig; btn.style.pointerEvents = "";
        return;
      }
    }

    btn.innerHTML = "Sending…"; btn.style.pointerEvents = "none";

    try {
      const fd = new FormData(contactForm);
      fd.append("type", "contact");
      if (verifyToken) fd.append("verify_token", verifyToken);
      // Prepend project-type chip value to the message so the existing PHP contact template captures it.
      const brief = fd.get("brief");
      if (brief) {
        const msg = fd.get("message") || "";
        fd.set("message", `Project type: ${brief}\n\n${msg}`);
      }
      fd.delete("brief");
      const res  = await fetch("/send-mail.php", {
        method: "POST", headers: { "Accept": "application/json" },
        body: fd,
      });
      const data = await res.json();
      if (data.ok) {
        btn.innerHTML = "Sent ✓"; btn.style.borderColor = "rgba(10,10,10,0.35)";
        setTimeout(() => { btn.innerHTML = orig; btn.style.borderColor = ""; btn.style.pointerEvents = ""; contactForm.reset(); }, 3000);
      } else { throw new Error(data.error || ""); }
    } catch {
      btn.innerHTML = "Failed — try WhatsApp"; btn.style.color = "rgba(10,10,10,0.55)"; btn.style.pointerEvents = "";
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ""; }, 3500);
    }
  });
}

/* =====================================================
   GLOBAL LOADER — architectural reveal
===================================================== */
window.addEventListener("load", () => {
  /* Recalculate body height now that all resources are loaded */
  setBodyHeight();

  const loCircle  = document.querySelector(".lo-circle");
  const loLine    = document.querySelector(".lo-line");
  const loName    = document.querySelector(".loader-name");
  const loCounter = document.querySelector(".loader-counter");
  const startTime = performance.now();
  const MIN_SHOW  = 2600;

  /* Draw Ø mark */
  if (loCircle) gsap.to(loCircle, { strokeDashoffset: 0, duration: 1.8, delay: 0.2, ease: "power3.out" });
  if (loLine)   gsap.to(loLine,   { strokeDashoffset: 0, duration: 0.9, delay: 1.2, ease: "power2.out" });

  /* Fade in studio name */
  if (loName) gsap.to(loName, { opacity: 1, y: 0, duration: 0.7, delay: 1.5, ease: "power3.out" });

  /* Counter ticks to 100 */
  let count = 0;
  const tick = setInterval(() => {
    count = Math.min(count + Math.ceil(Math.random() * 3), 100);
    if (loCounter) loCounter.textContent = String(count).padStart(2, "0");
    if (count >= 100) {
      clearInterval(tick);
      const elapsed  = performance.now() - startTime;
      const waitMore = Math.max(0, MIN_SHOW - elapsed);
      setTimeout(splitReveal, waitMore + 350);
    }
  }, 30);

  /* Split-panel reveal */
  function splitReveal() {
    gsap.to(".loader-center",       { opacity: 0, duration: 0.4, ease: "power2.in" });
    gsap.to(".loader-counter",      { opacity: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(".loader-panel--left",  { x: "-101%", duration: 1.1, ease: "power4.inOut" });
    gsap.to(".loader-panel--right", { x:  "101%", duration: 1.1, ease: "power4.inOut" });
    setTimeout(() => {
      const loader = document.querySelector(".global-loader");
      if (loader) loader.style.display = "none";
    }, 1200);

    /* ── Hero heading scramble ── */
    const heroMain = document.querySelector(".hero-main");
    if (heroMain) {
      setTimeout(() => {
        const final  = "ØRENO STUDIO";
        const abc    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const clean  = final.replace(/\s/g, "");
        const frames = Math.round(1400 / 16); /* slower, more dramatic scramble */
        let   f = 0;
        const run = () => {
          const p = f / frames;
          heroMain.textContent = [...final].map((ch, i) => {
            if (ch === " ") return " ";
            const ci = [...final.slice(0, i)].filter(c => c !== " ").length;
            return p > ci / clean.length ? ch : abc[Math.floor(Math.random() * 26)];
          }).join("");
          if (++f <= frames) requestAnimationFrame(run);
          else {
            heroMain.textContent = final;
            /* start breathing glow 1.2s after scramble lands */
            gsap.delayedCall(1.2, () => heroMain.classList.add("hero-main--breathing"));
          }
        };
        requestAnimationFrame(run);
      }, 620);
    }

    /* ── Hero eyebrow char reveal ── */
    if (heroEyebrowEl) {
      /* Reset chars hidden (in case gsap.set happened before loader reveal) */
      gsap.set(heroEyebrowEl.querySelectorAll(".ch"), { yPercent: 105 });
      revealChars(heroEyebrowEl, { duration: 0.65, stagger: 0.03, delay: 0.4 });
    }

  }
});

/* =====================================================
   CURSOR LOADING SPIN — no-op for blend-mode cursor
===================================================== */
function cursorLoading() { /* blend-mode cursor needs no spinner */ }

/* =====================================================
   SECTION NAVIGATION — dot nav + panel arrows
===================================================== */

/*
 * scrollToSection — uses a GSAP proxy to tween window.scrollY
 * directly, giving precisely-eased transitions and an exact
 * onComplete hook so wheel-busy unlocks the instant motion stops.
 */
const _scrollProxy = { y: window.scrollY };

/**
 * Convert a panel's horizontal offsetLeft into a body scrollY target,
 * accounting for the case-studies pin budget.
 *   - Panels before cs: target = offsetLeft (unchanged)
 *   - Panel 05 itself : target = csStart     (lands at top of cs zone)
 *   - Panels after cs : target = offsetLeft + csBudget
 */
function csRemapTarget(offsetLeft) {
  if (csBudget <= 0) return offsetLeft;
  if (offsetLeft <  csStart) return offsetLeft;
  if (offsetLeft === csStart) return csStart;          // panel 05 itself — land at top of cs zone
  return offsetLeft + csBudget;                         // any panel after cs
}

function scrollToSection(idx) {
  const i  = Math.max(0, Math.min(idx, NAV_SECTIONS.length - 1));
  const el = navSectionEls[i];
  if (!el) return;

  if (isMobile()) {
    el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    return;
  }

  /* Cap target to max scroll (horizontal max + cs budget). */
  const remapped = csRemapTarget(el.offsetLeft);
  const target   = Math.min(remapped, getMaxScroll() + csBudget);
  currentSectionIdx = i;

  _scrollProxy.y = window.scrollY;
  gsap.to(_scrollProxy, {
    y: target,
    duration: 0.88,
    ease: "power3.inOut",
    overwrite: true,
    onUpdate() {
      window.scrollTo(0, Math.round(_scrollProxy.y));
    },
    onComplete() {
      _wheelBusy = false;
    },
  });
}

/* Raw scroll to a pixel position (used by nav link clicks) */
function scrollToSection_raw(px) {
  const remapped = csRemapTarget(px);
  const target   = Math.min(remapped, getMaxScroll() + csBudget);
  _scrollProxy.y = window.scrollY;
  gsap.to(_scrollProxy, {
    y: target, duration: 0.88, ease: "power3.inOut", overwrite: true,
    onUpdate() { window.scrollTo(0, Math.round(_scrollProxy.y)); },
    onComplete() { _wheelBusy = false; },
  });
}

function addCursorDot(el) {
  /* no-op: cursor is now a pure CSS blend-mode blob managed by initCursor */
}

function buildDotNav() {
  const nav = document.createElement("nav");
  nav.className = "dot-nav";
  nav.setAttribute("aria-label", "Section navigation");
  NAV_SECTIONS.forEach((s, i) => {
    const li  = document.createElement("li");
    li.className = "dot-nav__item" + (i === 0 ? " is-active" : "");
    const lbl = document.createElement("span");
    lbl.className = "dot-nav__label"; lbl.textContent = s.label;
    const btn = document.createElement("button");
    btn.className = "dot-nav__btn";
    btn.setAttribute("aria-label", "Go to " + s.label);
    btn.addEventListener("click", () => scrollToSection(i));
    addCursorDot(btn);
    li.appendChild(lbl); li.appendChild(btn);
    nav.appendChild(li);
  });
  document.body.appendChild(nav);
  return nav;
}

function buildPanelArrows() {
  const wrap = document.createElement("div");
  wrap.className = "panel-arrows";

  const prev = document.createElement("button");
  prev.className = "panel-arrow panel-arrow--prev is-disabled";
  prev.setAttribute("aria-label", "Previous section");
  prev.textContent = "←";
  prev.addEventListener("click", () => scrollToSection(currentSectionIdx - 1));
  addCursorDot(prev);

  const next = document.createElement("button");
  next.className = "panel-arrow panel-arrow--next";
  next.setAttribute("aria-label", "Next section");
  next.textContent = "→";
  next.addEventListener("click", () => scrollToSection(currentSectionIdx + 1));
  addCursorDot(next);

  wrap.appendChild(prev); wrap.appendChild(next);
  document.body.appendChild(wrap);
  return wrap;
}

function updateActiveSection(scrollX) {
  const vw = window.innerWidth;
  let idx = 0;
  for (let i = navSectionEls.length - 1; i >= 0; i--) {
    if (navSectionEls[i] && navSectionEls[i].offsetLeft <= scrollX + vw * 0.5) {
      idx = i; break;
    }
  }
  currentSectionIdx = idx;
  window.__oreno_sectionIdx = idx;
  /* hero is now light — no dark header toggle needed */
}

function updateDotActiveState(nav) {
  nav.querySelectorAll(".dot-nav__item").forEach((el, i) => {
    el.classList.toggle("is-active", i === currentSectionIdx);
  });
}

function updateArrowStates(wrap) {
  wrap.querySelector(".panel-arrow--prev").classList.toggle("is-disabled", currentSectionIdx === 0);
  wrap.querySelector(".panel-arrow--next").classList.toggle("is-disabled", currentSectionIdx === NAV_SECTIONS.length - 1);
}

/* Build UI */
dotNav    = buildDotNav();
arrowWrap = buildPanelArrows();

/* Hero is now light — no dark header on page load */

/* Arrow key navigation */
window.addEventListener("keydown", e => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key === "ArrowRight") { e.preventDefault(); scrollToSection(currentSectionIdx + 1); }
  if (e.key === "ArrowLeft")  { e.preventDefault(); scrollToSection(currentSectionIdx - 1); }
});

/* Mobile bottom tab bar is handled in nav-universal.js */

/* =====================================================
   SERVICES ACCORDION
===================================================== */
(function () {
  const rows = Array.from(document.querySelectorAll(".system-row"));
  if (!rows.length) return;

  function openRow(row) {
    row.classList.add("is-open");
    row.querySelector(".srow-body-wrap")?.classList.add("is-open");
    row.querySelector(".srow-trigger")?.setAttribute("aria-expanded", "true");
  }
  function closeRow(row) {
    row.classList.remove("is-open");
    row.querySelector(".srow-body-wrap")?.classList.remove("is-open");
    row.querySelector(".srow-trigger")?.setAttribute("aria-expanded", "false");
  }

  const isTouch = () => window.matchMedia("(hover:none)").matches;

  rows.forEach(row => {
    const trigger = row.querySelector(".srow-trigger");
    if (!trigger) return;
    row.addEventListener("mouseenter", () => {
      if (isTouch()) return;
      rows.forEach(closeRow); openRow(row);
    });
    trigger.addEventListener("click", () => {
      if (!isTouch()) return;
      const wasOpen = row.classList.contains("is-open");
      rows.forEach(closeRow);
      if (!wasOpen) openRow(row);
    });
  });

  openRow(rows[0]);
})();

/* =====================================================
   MOBILE ENHANCEMENTS
===================================================== */
(function () {
  if (!window.matchMedia("(max-width:768px)").matches) return;

  const hero         = document.querySelector(".hero");
  const progressFill = document.querySelector(".m-progress-fill");
  const labelEl      = document.getElementById("m-section-label");

  const sectionLabels = [
    { el: document.querySelector(".hero"),                label: "01 / INTRO"        },
    { el: document.querySelector(".section-manifesto"),   label: "02 / VISION"       },
    { el: document.querySelector("#studio"),              label: "03 / STUDIO"       },
    { el: document.querySelector("#work"),                label: "04 / SERVICES"     },
    { el: document.querySelector("#case-studies"),        label: "05 / WORK"         },
    { el: document.querySelector("#system"),              label: "06 / IDENTITY"     },
    { el: document.querySelector(".section-process"),     label: "07 / PROCESS"      },
    { el: document.querySelector(".section-testimonials"),label: "08 / TESTIMONIALS" },
    { el: document.querySelector(".section-cta"),         label: "09 / START"        },
    { el: document.querySelector("#contact"),             label: "10 / CONTACT"      },
    { el: document.querySelector(".section-connect"),     label: "11 / CONNECT"      },
  ].filter(s => s.el);

  if (hero && labelEl) {
    const heroObs = new IntersectionObserver(entries => {
      labelEl.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.15 });
    heroObs.observe(hero);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (progressFill) {
        const totalH = document.body.scrollHeight - window.innerHeight;
        if (totalH > 0) progressFill.style.height = ((window.scrollY / totalH) * 100).toFixed(1) + "%";
      }
      if (labelEl) {
        const mid = window.innerHeight * 0.45;
        let best = null, bestDist = Infinity;
        sectionLabels.forEach(({ el, label }) => {
          const r    = el.getBoundingClientRect();
          const dist = Math.abs(r.top + r.height / 2 - mid);
          if (dist < bestDist && r.top < window.innerHeight && r.bottom > 0) {
            bestDist = dist; best = label;
          }
        });
        if (best && labelEl.textContent !== best) labelEl.textContent = best;
      }
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* =====================================================
   FOOTER CONNECT — touch tap toggle
===================================================== */
(function () {
  const wrap = document.getElementById("footer-connect-wrap");
  if (!wrap) return;
  const btn = wrap.querySelector(".footer-connect__label");
  if (!btn) return;
  const isTouchDevice = () => window.matchMedia("(hover:none)").matches;
  btn.addEventListener("click", (e) => {
    if (!isTouchDevice()) return;
    e.stopPropagation();
    const open = wrap.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });
  /* close on outside tap */
  document.addEventListener("click", e => {
    if (!isTouchDevice()) return;
    if (!wrap.contains(e.target)) {
      wrap.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
})();

/* =====================================================
   WAVEPATH — elastic hover line in Contact section
===================================================== */
(function () {
  const wrap    = document.querySelector(".wave-path-wrap");
  if (!wrap || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;

  const pathEl  = wrap.querySelector(".wave-path-line");
  const hoverZn = wrap.querySelector(".wave-path-hover-zone");
  if (!pathEl || !hoverZn) return;

  let progress = 0;
  let x        = 0.5;
  let time     = Math.PI / 2;
  let rafId    = null;

  function setPath(p) {
    const width = wrap.offsetWidth;
    pathEl.setAttribute("d",
      `M0 100 Q${width * x} ${100 + p * 0.6},${width} 100`
    );
  }

  function lerp(a, b, t) { return a * (1 - t) + b * t; }

  function animateOut() {
    const newP = progress * Math.sin(time);
    progress   = lerp(progress, 0, 0.025);
    time      += 0.2;
    setPath(newP);
    if (Math.abs(progress) > 0.75) {
      rafId = requestAnimationFrame(animateOut);
    } else {
      time = Math.PI / 2;
      progress = 0;
    }
  }

  setPath(0);

  hoverZn.addEventListener("mouseenter", () => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; time = Math.PI / 2; progress = 0; }
  });

  hoverZn.addEventListener("mousemove", e => {
    const r  = hoverZn.getBoundingClientRect();
    x        = (e.clientX - r.left) / r.width;
    progress += e.movementY;
    setPath(progress);
  });

  hoverZn.addEventListener("mouseleave", () => {
    animateOut();
  });
})();

/* =====================================================
   CLIP-PATH LINKS — Reach Us panel hover animation
===================================================== */
(function () {
  if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;

  const NO_CLIP        = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
  const BOTTOM_RIGHT   = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
  const TOP_LEFT       = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";
  const TOP_RIGHT      = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
  const BOTTOM_LEFT    = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";

  const ENTER = { left: [BOTTOM_RIGHT, NO_CLIP], bottom: [BOTTOM_RIGHT, NO_CLIP],
                  top:  [BOTTOM_RIGHT, NO_CLIP], right:  [TOP_LEFT,    NO_CLIP] };
  const EXIT  = { left: [NO_CLIP, TOP_RIGHT],   bottom: [NO_CLIP, TOP_RIGHT],
                  top:  [NO_CLIP, TOP_RIGHT],   right:  [NO_CLIP, BOTTOM_LEFT] };

  function nearestSide(e, box) {
    const r  = box.getBoundingClientRect();
    const dL = Math.abs(r.left   - e.clientX);
    const dR = Math.abs(r.right  - e.clientX);
    const dT = Math.abs(r.top    - e.clientY);
    const dB = Math.abs(r.bottom - e.clientY);
    const m  = Math.min(dL, dR, dT, dB);
    if (m === dL) return "left";
    if (m === dR) return "right";
    if (m === dT) return "top";
    return "bottom";
  }

  document.querySelectorAll(".clip-box").forEach(box => {
    const overlay = box.querySelector(".clip-overlay");
    if (!overlay) return;
    box.addEventListener("mouseenter", e => {
      const side = nearestSide(e, box);
      gsap.fromTo(overlay,
        { clipPath: ENTER[side][0] },
        { clipPath: ENTER[side][1], duration: 0.35, ease: "power2.out", overwrite: true }
      );
    });
    box.addEventListener("mouseleave", e => {
      const side = nearestSide(e, box);
      gsap.fromTo(overlay,
        { clipPath: EXIT[side][0] },
        { clipPath: EXIT[side][1], duration: 0.28, ease: "power2.in", overwrite: true }
      );
    });
  });
})();

/* =====================================================
   MAGIC TEXT — word-by-word scroll reveal (testimonials)
===================================================== */
(function () {
  const containers = document.querySelectorAll(".magic-text-el");
  if (!containers.length) return;

  containers.forEach(container => {
    const text  = container.dataset.text || container.textContent.trim();
    const words = text.split(" ");
    container.innerHTML = "";
    const wordEls = words.map((w, i) => {
      /* ghost span — always visible at low opacity */
      const ghost = document.createElement("span");
      ghost.className = "magic-word";
      ghost.textContent = w;
      container.appendChild(ghost);
      if (i < words.length - 1) container.appendChild(document.createTextNode(" "));
      return ghost;
    });

    /* IntersectionObserver that fires per-element lit transitions */
    const totalWords = wordEls.length;
    let   litCount   = 0;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const idx = wordEls.indexOf(entry.target);
        if (idx === -1) return;
        if (entry.isIntersecting) {
          /* stagger delay based on word index within this card */
          setTimeout(() => {
            entry.target.classList.add("is-lit");
          }, idx * 42);
          litCount++;
          if (litCount >= totalWords) io.disconnect();
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });

    wordEls.forEach(el => io.observe(el));
  });
})();

/* =====================================================
   TESTIMONIAL STACK — hover/tap cascade
===================================================== */
(function () {
  const stack = document.querySelector(".testi-stack");
  if (!stack) return;
  const cards = stack.querySelectorAll(".testi-stack__card");
  if (!cards.length) return;

  const isTouch = window.matchMedia("(hover:none) and (pointer:coarse)").matches;

  if (!isTouch) {
    cards.forEach(card => {
      card.addEventListener("mouseenter", () => { stack.dataset.focused = card.dataset.card; });
      card.addEventListener("mouseleave", () => { stack.dataset.focused = ""; });
      card.addEventListener("focus", () => { stack.dataset.focused = card.dataset.card; });
      card.addEventListener("blur",  () => { stack.dataset.focused = ""; });
    });
  } else {
    cards.forEach(card => {
      card.addEventListener("click", e => {
        // First tap focuses the card; second tap follows the link.
        if (stack.dataset.focused !== card.dataset.card) {
          e.preventDefault();
          stack.dataset.focused = card.dataset.card;
        }
      });
    });
    document.addEventListener("click", e => {
      if (!stack.contains(e.target)) stack.dataset.focused = "";
    });
  }
})();

/* =====================================================
   THERMODYNAMIC GRID — grayscale interactive canvas
   Covers the hero section background.
===================================================== */
(function initThermoGrid() {
  const container = document.querySelector(".hero");
  const canvas    = document.querySelector(".hero-thermo-canvas");
  if (!container || !canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const RES     = 14;
  const COOLING = 0.968;
  let grid, cols, rows, W, H;
  const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, active: false };

  function resize() {
    W = container.offsetWidth; H = container.offsetHeight;
    canvas.width = W; canvas.height = H;
    cols = Math.ceil(W / RES); rows = Math.ceil(H / RES);
    grid = new Float32Array(cols * rows);
  }

  function grayColor(t) {
    /* on cream bg: interpolate from bg (#F5F3EE) toward dark ash (#3C3934) */
    const r = Math.min(245, Math.max(0, Math.round(245 - t * 185)));
    const g = Math.min(243, Math.max(0, Math.round(243 - t * 186)));
    const b = Math.min(238, Math.max(0, Math.round(238 - t * 186)));
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function tick() {
    if (mouse.active) {
      const dx    = mouse.x - mouse.px, dy = mouse.y - mouse.py;
      const dist  = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(dist / (RES / 2)));
      for (let s = 0; s <= steps; s++) {
        const f  = steps > 0 ? s / steps : 0;
        const cx = Math.floor((mouse.px + dx * f) / RES);
        const cy = Math.floor((mouse.py + dy * f) / RES);
        for (let di = -2; di <= 2; di++) {
          for (let dj = -2; dj <= 2; dj++) {
            const c = cx + di, r = cy + dj;
            if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
            const d = Math.sqrt(di * di + dj * dj);
            if (d <= 2) grid[c + r * cols] = Math.min(1, grid[c + r * cols] + 0.3 * (1 - d / 2));
          }
        }
      }
    }
    mouse.px = mouse.x; mouse.py = mouse.y;

    /* ambient glow — random cells pulse softly even without mouse */
    if (Math.random() < 0.04) {
      const rc = Math.floor(Math.random() * cols);
      const rr = Math.floor(Math.random() * rows);
      grid[rc + rr * cols] = Math.min(1, grid[rc + rr * cols] + 0.14);
    }

    ctx.fillStyle = "#F5F3EE";
    ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = c + r * cols;
        const t   = grid[idx];
        grid[idx] *= COOLING;
        if (t > 0.05) {
          const fontSize = Math.round(RES * (0.75 + t * 0.55));
          ctx.fillStyle    = grayColor(t);
          ctx.font         = fontSize + "px Montserrat, sans-serif";
          ctx.textAlign    = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("Ø", c * RES + RES / 2, r * RES + RES / 2);
        } else if ((c + r) % 2 === 0) {
          ctx.fillStyle = "rgba(10,10,10,0.04)";
          ctx.fillRect(c * RES + RES / 2 - 1, r * RES + RES / 2 - 1, 2, 2);
        }
      }
    }
    requestAnimationFrame(tick);
  }

  canvas.addEventListener("mousemove", e => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  canvas.addEventListener("mouseleave", () => { mouse.active = false; });
  window.addEventListener("resize", resize);
  resize();
  tick();
})();

/* =====================================================
   FLIPLINK — footer nav letter-flip hover animation
   Port of the React FlipLink component.
===================================================== */
(function initFlipLinks() {
  const DURATION = 0.22, STAGGER = 0.018;

  document.querySelectorAll(".footer-links a").forEach(link => {
    const text = link.textContent.trim();
    if (!text) return;
    link.setAttribute("aria-label", text);

    const wrapper = document.createElement("span");
    wrapper.style.cssText = "display:inline-block; position:relative;";

    const topRow = document.createElement("span");
    topRow.style.cssText = "display:inline-block;";

    const botRow = document.createElement("span");
    botRow.className = "flip-bot-row";
    botRow.setAttribute("aria-hidden", "true");

    [...text].forEach(ch => {
      const c = ch === " " ? "\u00a0" : ch;
      const tSpan = document.createElement("span");
      tSpan.className = "flip-ch"; tSpan.textContent = c;
      topRow.appendChild(tSpan);

      const bSpan = document.createElement("span");
      bSpan.className = "flip-ch"; bSpan.textContent = c;
      botRow.appendChild(bSpan);
    });

    wrapper.appendChild(topRow);
    wrapper.appendChild(botRow);
    link.textContent = "";
    link.appendChild(wrapper);

    const topChars = [...topRow.querySelectorAll(".flip-ch")];
    const botChars = [...botRow.querySelectorAll(".flip-ch")];

    link.addEventListener("mouseenter", () => {
      gsap.to(topChars, { yPercent: -100, duration: DURATION, ease: "power2.inOut", stagger: STAGGER });
      gsap.fromTo(botChars, { yPercent: 0 }, { yPercent: -100, duration: DURATION, ease: "power2.inOut", stagger: STAGGER });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(topChars, { yPercent: 0, duration: DURATION, ease: "power2.inOut", stagger: STAGGER });
      gsap.to(botChars, { yPercent: 0, duration: DURATION, ease: "power2.inOut", stagger: STAGGER });
    });
  });
})();

