/* =====================================================
   ØRENO — script.js  v4.9
   Horizontal scroll · char-reveal · Ø distortion
===================================================== */

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
  const text = el.textContent.trim();
  el.setAttribute("aria-label", text);
  el.innerHTML = "";

  /*
   * Split by WORDS first so inline-block chars never break mid-word.
   * Each word sits inside a white-space:nowrap inline-block container,
   * and word boundaries are represented by a normal space span so CSS
   * word-wrap can break there — exactly how kobykooba handles it.
   */
  const words = text.split(" ");
  words.forEach((word, wi) => {
    /* word container — keeps letters together on the same line */
    const wdWrap = document.createElement("span");
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
    /* space between words — plain text node so the browser renders it correctly */
    if (wi < words.length - 1) {
      el.appendChild(document.createTextNode("\u00a0"));
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

/* =====================================================
   WORD-SPLIT REVEAL — 4P-style progressive opacity
   Body paragraphs are split into <span.word> elements.
   Each word starts near-invisible and lights up with a
   stagger when its section enters view.
===================================================== */
function splitWords(el) {
  const tmp = document.createElement("div");
  tmp.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, " ");
  const text = tmp.textContent.trim().replace(/\s+/g, " ");
  el.setAttribute("aria-label", text);
  el.innerHTML = "";
  text.split(" ").forEach((word, i, arr) => {
    const span = document.createElement("span");
    span.className = "word";
    span.setAttribute("aria-hidden", "true");
    span.textContent = word;
    el.appendChild(span);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
  });
}

function revealWords(el, delay = 0) {
  const words = el.querySelectorAll(".word");
  if (!words.length) return;
  gsap.fromTo(words,
    { opacity: 0.08, y: 5 },
    { opacity: 1, y: 0, duration: 0.65, ease: "power2.out",
      stagger: 0.045, delay, overwrite: true }
  );
}

/* ── SCROLL-SCRUBBED WORD REVEAL — registry ── */
const wordRevealTargets = [];
document.querySelectorAll(".manifesto-line, .section-p, .cta-heading").forEach(el => {
  splitWords(el);
  const words = [...el.querySelectorAll(".word")];
  gsap.set(words, { opacity: 0.08 });
  const panel = el.closest(".panel");
  if (panel) wordRevealTargets.push({ panel, words });
});

/* Accordion bodies split separately — revealed on row open, not scroll */
document.querySelectorAll(".srow-body").forEach(el => {
  splitWords(el);
  gsap.set(el.querySelectorAll(".word"), { opacity: 0.08 });
});

/* Set all chars to hidden-below-clip immediately (before paint) */
gsap.set(".ch", { yPercent: 105 });

/* Also split the hero eyebrow for its entrance */
const heroEyebrowEl = document.querySelector(".hero-eyebrow");
if (heroEyebrowEl) splitChars(heroEyebrowEl);

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
   CURSOR
===================================================== */
const cursor     = document.querySelector(".cursor");
const cursorText = document.querySelector(".cursor-text");
const isFine     = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
let   cursorVisible = false;

if (isFine && cursor) {

  /* zero delay — instant position */
  window.addEventListener("mousemove", e => {
    gsap.set(cursor, { x: e.clientX, y: e.clientY });
    cursorVisible = true;
  });

  window.addEventListener("mouseleave", () => cursor.classList.add("cursor--hidden"));
  window.addEventListener("mouseenter", () => cursor.classList.remove("cursor--hidden"));

  const cs = {
    dot() {
      cursor.style.width       = "10px";
      cursor.style.height      = "10px";
      cursor.style.background  = "white";
      cursor.style.borderColor = "transparent";
      if (cursorText) cursorText.style.opacity = "0";
    },
    expand(label = "") {
      cursor.style.width       = "88px";
      cursor.style.height      = "88px";
      cursor.style.background  = "transparent";
      cursor.style.borderColor = "white";
      if (cursorText) {
        cursorText.textContent   = label;
        cursorText.style.opacity = label ? "1" : "0";
      }
    },
    reset() {
      cursor.style.width       = "36px";
      cursor.style.height      = "36px";
      cursor.style.background  = "transparent";
      cursor.style.borderColor = "white";
      if (cursorText) cursorText.style.opacity = "0";
    },
  };

  document.querySelectorAll(".btn, .nav-cta").forEach(el => {
    el.addEventListener("mouseenter", cs.dot);
    el.addEventListener("mouseleave", cs.reset);
  });
  document.querySelectorAll(".nav-link, .header-logo, .footer-links a, .footer-logo").forEach(el => {
    el.addEventListener("mouseenter", cs.dot);
    el.addEventListener("mouseleave", cs.reset);
  });
  document.querySelectorAll(".scroll-top, .whatsapp-btn").forEach(el => {
    el.addEventListener("mouseenter", cs.dot);
    el.addEventListener("mouseleave", cs.reset);
  });

  const stage = document.querySelector(".dissection-stage");
  if (stage) {
    stage.addEventListener("mouseenter", () => cs.expand("HOVER"));
    stage.addEventListener("mouseleave", cs.reset);
  }

  const marqueeEl = document.querySelector(".marquee-track");
  if (marqueeEl) {
    marqueeEl.addEventListener("mouseenter", () => cs.expand("PAUSE"));
    marqueeEl.addEventListener("mouseleave", cs.reset);
  }

  window.addEventListener("click", () => {
    gsap.fromTo(cursor,
      { scale: 1 },
      { scale: 1.5, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  });
}

/* =====================================================
   Ø BACKGROUND DISTORTION — replaces the old parallax.
   Mouse movement over the hero section drives an SVG
   feTurbulence + feDisplacementMap filter for a
   premium liquid-distort effect.
===================================================== */
(function () {
  const heroEl = document.querySelector(".hero");
  const heroOBg = document.querySelector(".hero-o-bg");
  const oTurb = document.getElementById("oTurb");
  const oDisp = document.getElementById("oDisp");
  if (!heroEl || !heroOBg || !oTurb || !oDisp || !isFine) return;

  /* Owned by GSAP so breathing tween doesn't fight CSS translate */
  gsap.set(heroOBg, { xPercent: -50, yPercent: -50 });

  const state = { bf: 0, scale: 0 };

  function applyFilter() {
    oTurb.setAttribute("baseFrequency",
      state.bf.toFixed(5) + " " + (state.bf * 0.55).toFixed(5));
    oDisp.setAttribute("scale", state.scale.toFixed(2));
  }

  heroEl.addEventListener("mousemove", e => {
    const r    = heroEl.getBoundingClientRect();
    const dx   = (e.clientX - r.left - r.width  / 2) / r.width;
    const dy   = (e.clientY - r.top  - r.height / 2) / r.height;
    const dist = Math.sqrt(dx * dx + dy * dy);  /* 0 → ~0.7 */

    gsap.to(state, {
      bf: dist * 0.024,
      scale: dist * 100,
      duration: 1.1,
      ease: "power2.out",
      overwrite: true,
      onUpdate: applyFilter,
    });
  });

  heroEl.addEventListener("mouseleave", () => {
    gsap.to(state, {
      bf: 0, scale: 0,
      duration: 2.0,
      ease: "power3.out",
      overwrite: true,
      onUpdate: applyFilter,
    });
  });
}());

/* =====================================================
   HERO ENTRANCE — fires after loader reveals
===================================================== */
if (window.innerWidth > 768) {
  gsap.to(".hero-grid", { opacity: 0.7, duration: 2, ease: "power2.out", delay: 0.8 });
}
gsap.to(".hero-subline", { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.75 });
gsap.to(".hero-cta",     { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.95 });

/* =====================================================
   HORIZONTAL SCROLL ENGINE — desktop only
===================================================== */
const isMobile = () => window.innerWidth <= 768;
const track    = document.querySelector("#h-track");

function getMaxScroll() {
  return track.scrollWidth - window.innerWidth;
}
function setBodyHeight() {
  if (isMobile()) { document.body.style.height = ""; return; }
  document.body.style.height = (getMaxScroll() + window.innerHeight) + "px";
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

/* ── NAV SECTIONS ── */
const NAV_SECTIONS = [
  { sel: ".hero",                  label: "Hero"      },
  { sel: ".section-manifesto",     label: "Manifesto" },
  { sel: ".section-studio",        label: "Studio"    },
  { sel: ".section-system",        label: "Services"  },
  { sel: ".section-case-studies",  label: "Work"      },
  { sel: ".section-dissection",    label: "System"    },
  { sel: ".section-process",       label: "Process"   },
  { sel: ".section-cta",           label: "CTA"       },
  { sel: ".section-contact",       label: "Contact"   },
  { sel: ".site-footer",           label: "Footer"    },
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

    /* ── 02 MANIFESTO ── word reveal (mobile: GSAP stagger; desktop: scroll-scrubbed) */
    case 1: {
      if (isMobile()) {
        document.querySelectorAll(".manifesto-line").forEach((el, i) => {
          gsap.to(el.querySelectorAll(".word"), {
            opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.12, delay: i * 0.8
          });
        });
      }
      break;
    }

    /* ── 03 STUDIO ── tag → heading → body → stat ── */
    case 2: {
      const tag = document.querySelector(".section-studio .section-tag");
      const h   = document.querySelector(".section-studio .section-h");
      const p   = document.querySelector(".section-studio .section-p");
      const creds = document.querySelectorAll(".studio-cred, .studio-stat");
      if (tag) gsap.fromTo(tag,  { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h)   gsap.fromTo(h,   { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", delay: 0.18, overwrite: true });
      if (p && isMobile()) revealWords(p, 0.55); /* desktop: scroll-scrubbed */
      creds.forEach((el, i) => gsap.fromTo(el, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.75 + i * 0.1 }));
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
      if (h)   gsap.fromTo(h,  { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", delay: 0.15, overwrite: true });
      rows.forEach((row, i) => {
        gsap.fromTo(row, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.35 + i * 0.08 });
      });
      break;
    }

    /* ── 05 CASE STUDIES ── tag → heading ── */
    case 4: {
      const tag = document.querySelector(".section-case-studies .section-tag");
      const h   = document.querySelector(".section-case-studies .section-h");
      const cards = document.querySelectorAll(".case-card, .work-item");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h)   gsap.fromTo(h,  { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", delay: 0.15, overwrite: true });
      cards.forEach((c, i) => gsap.fromTo(c, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", delay: 0.4 + i * 0.12 }));
      break;
    }

    /* ── 06 DISSECTION ── heading + hint already handled ── */
    case 5: {
      const tag = document.querySelector(".section-dissection .section-tag");
      const h   = document.querySelector(".section-dissection .section-h");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h)   gsap.fromTo(h,  { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", delay: 0.12, overwrite: true });
      /* dissection hint fires via existing code */
      break;
    }

    /* ── 07 PROCESS ── tag → heading → steps cascade ── */
    case 6: {
      const tag   = document.querySelector(".section-process .section-tag");
      const h     = document.querySelector(".section-process .section-h");
      const steps = document.querySelectorAll(".process-step, .proc-step");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h)   gsap.fromTo(h,  { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", delay: 0.12, overwrite: true });
      steps.forEach((s, i) => gsap.fromTo(s, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.35 + i * 0.09 }));
      break;
    }

    /* ── 08 CTA ── eyebrow + word-reveal heading + button ── */
    case 7: {
      const tag = document.querySelector(".section-cta .section-tag, .cta-eyebrow");
      const ctaH = document.querySelector(".cta-heading");
      const btn = document.querySelector(".section-cta .btn");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0 });
      if (ctaH && isMobile()) {
        gsap.to(ctaH.querySelectorAll(".word"), { opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.07, delay: 0.15 });
      }
      if (btn) gsap.fromTo(btn, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.7 });
      break;
    }

    /* ── 09 CONTACT ── tag → heading → form ── */
    case 8: {
      const tag    = document.querySelector(".section-contact .section-tag");
      const h      = document.querySelector(".section-contact .section-h");
      const fields = document.querySelectorAll(".form-field, .contact-field");
      if (tag) gsap.fromTo(tag, { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0 });
      if (h)   gsap.fromTo(h,  { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out", delay: 0.14, overwrite: true });
      fields.forEach((f, i) => gsap.fromTo(f, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.4 + i * 0.07 }));
      break;
    }

    /* ── 10 FOOTER ── wordmark rises ── */
    case 9: {
      const wm = document.querySelector(".footer-wordmark");
      const fi = document.querySelector(".footer-inner");
      if (wm) gsap.fromTo(wm, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0 });
      if (fi) gsap.fromTo(fi, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      break;
    }
  }
}

/* ── MAIN SCROLL HANDLER ── */
window.addEventListener("scroll", () => {
  if (isMobile()) return;
  const scroll  = window.scrollY;
  currentScroll = scroll;
  const max     = getMaxScroll();
  const clamped = Math.min(Math.max(scroll, 0), max);

  /* translate track */
  track.style.transform = `translateX(${-clamped}px)`;

  /* progress bar */
  if (progFill) progFill.style.width = ((clamped / max) * 100) + "%";

  /* header scrolled state */
  if (header) header.classList.toggle("scrolled", clamped > 60);

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

  /* ── SCROLL-SCRUBBED WORD REVEAL ── */
  wordRevealTargets.forEach(({ panel, words }) => {
    const panelLeft = panel.offsetLeft;
    const start     = panelLeft - vw * 0.55;  /* begin as panel enters at 55% */
    const range     = vw * 0.7;               /* reveal window = 70% of vw */
    words.forEach((word, i) => {
      const wordStart = start + (i / words.length) * range * 0.78;
      const p = Math.min(Math.max((clamped - wordStart) / (vw * 0.15), 0), 1);
      word.style.opacity = (0.08 + p * 0.92).toFixed(3);
    });
  });

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
  }, { threshold: 0.2 });
  obs.observe(el);
});

/* ── MOBILE: scrubbed hero collapse ── */
if (isMobile()) {
  const _heroScrub = () => {
    const sy   = window.scrollY;
    const pinH = window.innerHeight;
    const p    = Math.min(Math.max(sy / pinH, 0), 1);
    const dp   = Math.min(p / 0.55, 1);
    gsap.set([".hero-eyebrow", ".hero-subline", ".hero-cta"], {
      opacity: 1 - dp, y: -32 * dp,
    });
    const mp = Math.min(Math.max((p - 0.15) / 0.85, 0), 1);
    gsap.set(".hero-main", { scale: 1 + 0.55 * mp, opacity: 1 - 0.96 * mp, y: -24 * mp });
    gsap.set(".hero-grid", { opacity: 0.1 + 0.2 * mp, y: -(sy * 0.12) });
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
    if (isMobile()) { target.scrollIntoView({ behavior: "smooth" }); return; }
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

/* Reset overlay on bfcache restore (browser back/forward) — prevents blank page */
window.addEventListener("pageshow", e => {
  if (overlay) gsap.set(overlay, { y: "100%" });
});

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
    btn.innerHTML = "Sending…"; btn.style.pointerEvents = "none";

    try {
      const res  = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST", headers: { "Accept": "application/json" },
        body: new FormData(contactForm),
      });
      const data = await res.json();
      if (data.ok) {
        btn.innerHTML = "Sent ✓"; btn.style.borderColor = "rgba(10,10,10,0.35)";
        setTimeout(() => { btn.innerHTML = orig; btn.style.borderColor = ""; btn.style.pointerEvents = ""; contactForm.reset(); }, 3000);
      } else { throw new Error(); }
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
        const frames = Math.round(900 / 16);
        let   f = 0;
        const run = () => {
          const p = f / frames;
          heroMain.textContent = [...final].map((ch, i) => {
            if (ch === " ") return " ";
            const ci = [...final.slice(0, i)].filter(c => c !== " ").length;
            return p > ci / clean.length ? ch : abc[Math.floor(Math.random() * 26)];
          }).join("");
          if (++f <= frames) requestAnimationFrame(run);
          else heroMain.textContent = final;
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

    /* ── Ø mark: init breathing float ── */
    const heroOBg = document.querySelector(".hero-o-bg");
    if (heroOBg) {
      /* keep GSAP owning the transform so it matches distortion IIFE */
      setTimeout(() => {
        gsap.to(heroOBg, {
          scale: 1.06, rotation: 1.2,
          duration: 10, ease: "sine.inOut",
          repeat: -1, yoyo: true,
        });
      }, 1800);
    }
  }
});

/* =====================================================
   CURSOR LOADING SPIN
===================================================== */
function cursorLoading(state) {
  if (!cursor) return;
  if (state) {
    cursor.style.border    = "2px solid rgba(255,255,255,0.2)";
    cursor.style.borderTop = "2px solid white";
    cursor.style.animation = "spin 1s linear infinite";
  } else {
    cursor.style.animation = "";
    cursor.style.border    = "2px solid white";
    cursor.style.borderTop = "";
  }
}
cursorLoading(true);
setTimeout(() => cursorLoading(false), 2000);

/* =====================================================
   SECTION NAVIGATION — dot nav + panel arrows
===================================================== */

/*
 * scrollToSection — uses a GSAP proxy to tween window.scrollY
 * directly, giving precisely-eased transitions and an exact
 * onComplete hook so wheel-busy unlocks the instant motion stops.
 */
const _scrollProxy = { y: window.scrollY };

function scrollToSection(idx) {
  const i  = Math.max(0, Math.min(idx, NAV_SECTIONS.length - 1));
  const el = navSectionEls[i];
  if (!el) return;

  if (isMobile()) {
    el.scrollIntoView({ behavior: "smooth" });
    return;
  }

  /* Cap target to max scroll — fixes footer unreachable */
  const target = Math.min(el.offsetLeft, getMaxScroll());
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
  const target = Math.min(px, getMaxScroll());
  _scrollProxy.y = window.scrollY;
  gsap.to(_scrollProxy, {
    y: target, duration: 0.88, ease: "power3.inOut", overwrite: true,
    onUpdate() { window.scrollTo(0, Math.round(_scrollProxy.y)); },
    onComplete() { _wheelBusy = false; },
  });
}

function addCursorDot(el) {
  if (!isFine || !cursor) return;
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "10px"; cursor.style.height = "10px";
    cursor.style.background = "white"; cursor.style.borderColor = "transparent";
    if (cursorText) cursorText.style.opacity = "0";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.width = "36px"; cursor.style.height = "36px";
    cursor.style.background = "transparent"; cursor.style.borderColor = "white";
    if (cursorText) cursorText.style.opacity = "0";
  });
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
  const chevL = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const chevR = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M5 2l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const wrap = document.createElement("div");
  wrap.className = "panel-arrows";

  const prev = document.createElement("button");
  prev.className = "panel-arrow panel-arrow--prev is-disabled";
  prev.setAttribute("aria-label", "Previous section");
  prev.innerHTML = `${chevL}<span class="arrow-label">Prev</span>`;
  prev.addEventListener("click", () => scrollToSection(currentSectionIdx - 1));
  addCursorDot(prev);

  const next = document.createElement("button");
  next.className = "panel-arrow panel-arrow--next";
  next.setAttribute("aria-label", "Next section");
  next.innerHTML = `<span class="arrow-label">Next</span>${chevR}`;
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
}

function updateDotActiveState(nav) {
  nav.querySelectorAll(".dot-nav__item").forEach((el, i) => {
    el.classList.toggle("is-active", i === currentSectionIdx);
  });
}

function updateArrowStates(wrap) {
  const prevBtn = wrap.querySelector(".panel-arrow--prev");
  const nextBtn = wrap.querySelector(".panel-arrow--next");
  prevBtn.classList.toggle("is-disabled", currentSectionIdx === 0);
  nextBtn.classList.toggle("is-disabled", currentSectionIdx === NAV_SECTIONS.length - 1);
  const prevLabel = prevBtn.querySelector(".arrow-label");
  const nextLabel = nextBtn.querySelector(".arrow-label");
  if (prevLabel) prevLabel.textContent = currentSectionIdx > 0 ? NAV_SECTIONS[currentSectionIdx - 1].label : "Prev";
  if (nextLabel) nextLabel.textContent = currentSectionIdx < NAV_SECTIONS.length - 1 ? NAV_SECTIONS[currentSectionIdx + 1].label : "Next";
}

/* Build UI */
dotNav    = buildDotNav();
arrowWrap = buildPanelArrows();

/* Arrow key navigation */
window.addEventListener("keydown", e => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key === "ArrowRight") { e.preventDefault(); scrollToSection(currentSectionIdx + 1); }
  if (e.key === "ArrowLeft")  { e.preventDefault(); scrollToSection(currentSectionIdx - 1); }
});

/* =====================================================
   MOBILE BOTTOM NAV
===================================================== */
(function () {
  if (!window.matchMedia("(max-width:768px)").matches) return;
  const navItems = Array.from(document.querySelectorAll(".mobile-nav__item[data-goto-m]"));

  navItems.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      if (item.dataset.gotoM === ".hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const target = document.querySelector(item.dataset.gotoM);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setActive(item);
    });
  });

  function setActive(activeEl) {
    navItems.forEach(i => i.classList.remove("is-active"));
    activeEl.classList.add("is-active");
  }

  const sectionMap = [
    { selector: ".hero",    gotoM: ".hero"    },
    { selector: "#work",    gotoM: "#work"    },
    { selector: "#studio",  gotoM: "#studio"  },
    { selector: "#contact", gotoM: "#contact" },
  ];

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const match = sectionMap.find(m => entry.target.matches(m.selector));
      if (!match) return;
      const link = navItems.find(i => i.dataset.gotoM === match.gotoM);
      if (link) setActive(link);
    });
  }, { threshold: 0.5, rootMargin: "0px 0px -20% 0px" });

  sectionMap.forEach(m => {
    const el = document.querySelector(m.selector);
    if (el) obs.observe(el);
  });
})();

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
    const body = row.querySelector(".srow-body");
    if (body) revealWords(body, 0.2);
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

  const header       = document.querySelector(".site-header");
  const hero         = document.querySelector(".hero");
  const progressFill = document.querySelector(".m-progress-fill");
  const labelEl      = document.getElementById("m-section-label");

  const sectionLabels = [
    { el: document.querySelector(".hero"),               label: "01 / INTRO"    },
    { el: document.querySelector(".section-manifesto"),  label: "02 / VISION"   },
    { el: document.querySelector("#studio"),             label: "03 / STUDIO"   },
    { el: document.querySelector("#work"),               label: "04 / SERVICES" },
    { el: document.querySelector("#case-studies"),       label: "05 / WORK"     },
    { el: document.querySelector("#system"),             label: "06 / IDENTITY" },
    { el: document.querySelector(".section-process"),    label: "07 / PROCESS"  },
    { el: document.querySelector(".section-cta"),        label: "08 / START"    },
    { el: document.querySelector("#contact"),            label: "09 / CONTACT"  },
  ].filter(s => s.el);

  if (header && hero) {
    const heroObs = new IntersectionObserver(entries => {
      const heroVisible = entries[0].isIntersecting;
      header.classList.toggle("m-header-hidden", !heroVisible);
      if (labelEl) labelEl.classList.toggle("is-hidden", heroVisible);
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
