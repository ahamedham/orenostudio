/* =====================================================
   ØRENO — nav-universal.js
   Single source of truth for both navs:
   - Desktop top bar: hide on scroll down (>80px), reveal on scroll up
   - Mobile bottom tab bar: active-state scroll-spy on homepage,
     current-page active on other pages
   - Intercepts homepage hash links → window.scrollToSection()
   - Handles /#hash on homepage load
   Works without JS: both navs render correctly from HTML alone.
===================================================== */
(function () {
  'use strict';

  if (window.__orenoNavLoaded) return;
  window.__orenoNavLoaded = true;

  const HASH_MAP = {
    '#home':    '.hero',
    '#work':    '.section-case-studies',
    '#studio':  '.section-studio',
    '#about':   '.section-studio',
    '#process': '.section-process',
    '#contact': '.section-contact',
  };

  /* NAV_SECTIONS indices in script.js — keep in sync */
  const HOME_INDEX_MAP = {
    '.hero':                 0,
    '.section-studio':       2,
    '.section-system':       3,
    '.section-case-studies': 4,
    '.section-process':      6,
    '.section-contact':      9,
  };

  const path = location.pathname.replace(/\/+$/, '').toLowerCase();
  const isHome = path === '' || path === '/index.html';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  function init() {
    const header    = document.querySelector('.site-header');
    const navMobile = document.querySelector('.nav-mobile');

    if (header) {
      markCurrent(header);
      wireScrollHide(header);
    }
    if (navMobile) {
      markCurrentMobile(navMobile);
      if (isHome) wireMobileScrollSpy(navMobile);
    }
    wireLinks();
    if (isHome) handleHashOnLoad();
  }

  /* ---------- Desktop header ---------- */

  function markCurrent(header) {
    const here = location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
    header.querySelectorAll('.nav-link').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (!href || href.startsWith('#') || href.startsWith('/#')) return;
      const hrefPath = href.replace(/\/+$/, '').toLowerCase() || '/';
      if (hrefPath === here) {
        a.classList.add('is-current');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* Hide on scroll down (>80px), show on scroll up. */
  function wireScrollHide(header) {
    let lastY = window.scrollY || 0;
    let ticking = false;
    const threshold = 8;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        header.classList.toggle('site-header--scrolled', y > 8);

        const delta = y - lastY;
        if (Math.abs(delta) > threshold) {
          if (delta > 0 && y > 80) header.classList.add('site-header--hidden');
          else                     header.classList.remove('site-header--hidden');
          lastY = y;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile bottom tab bar ---------- */

  /* Map pathname → tab key. */
  function tabKeyForPath() {
    const p = path || '/';
    if (p === '' || p === '/' || p === '/index.html') return 'home';
    if (p === '/portfolio' || p === '/portfolio.html') return 'portfolio';
    if (p === '/testimonials') return 'testimonials';
    if (p === '/inquiry')      return 'inquiry';
    if (p.startsWith('/case-') || p.includes('case-'))         return 'work';
    return null;
  }

  function markCurrentMobile(navMobile) {
    /* On homepage, scroll-spy handles active state — start with Home active. */
    const key = isHome ? 'home' : tabKeyForPath();
    if (!key) return;
    const tab = navMobile.querySelector('.nav-mobile__tab[data-tab="' + key + '"]');
    if (!tab) return;
    navMobile.querySelectorAll('.nav-mobile__tab').forEach(t => {
      t.classList.remove('is-active');
      t.removeAttribute('aria-current');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-current', 'page');
  }

  function wireMobileScrollSpy(navMobile) {
    const watch = [
      { sel: '.hero',                 key: 'home'   },
      { sel: '.section-case-studies', key: 'work'   },
      { sel: '.section-studio',       key: 'studio' },
    ];

    const targets = watch
      .map(w => ({ el: document.querySelector(w.sel), key: w.key }))
      .filter(w => w.el);
    if (!targets.length) return;

    const setActive = key => {
      const tab = navMobile.querySelector('.nav-mobile__tab[data-tab="' + key + '"]');
      if (!tab || tab.classList.contains('is-active')) return;
      navMobile.querySelectorAll('.nav-mobile__tab').forEach(t => {
        t.classList.remove('is-active');
        t.removeAttribute('aria-current');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-current', 'page');
    };

    const obs = new IntersectionObserver(entries => {
      /* Pick the entry with the largest intersection ratio that's currently visible. */
      let best = null;
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      });
      if (!best) return;
      const match = targets.find(t => t.el === best.target);
      if (match) setActive(match.key);
    }, { threshold: [0.4, 0.6, 0.8] });

    targets.forEach(t => obs.observe(t.el));
  }

  /* ---------- Same-page hash nav on homepage ---------- */

  function wireLinks() {
    const selector = '.site-header a[data-goto], .nav-mobile a[data-goto]';
    document.querySelectorAll(selector).forEach(link => {
      link.addEventListener('click', e => {
        const goto = link.dataset.goto;
        if (!goto) return;
        if (!isHome) return; /* off-homepage: browser follows /#hash */
        e.preventDefault();
        scrollToHomeSection(goto);
      });
    });
  }

  function scrollToHomeSection(token) {
    const key = token.toLowerCase();
    const sel = HASH_MAP[key] || key;
    const el  = document.querySelector(sel);
    if (!el) return;

    const scroller = /** @type {any} */ (window).scrollToSection;
    if (typeof scroller === 'function' && HOME_INDEX_MAP[sel] != null) {
      scroller(HOME_INDEX_MAP[sel]);
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

  function handleHashOnLoad() {
    const raw = (location.hash || '').toLowerCase();
    if (!raw) return;
    const run = () => setTimeout(() => scrollToHomeSection(raw), 650);
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });
  }
})();
