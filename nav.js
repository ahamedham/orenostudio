/* =====================================================
   ØRENO — nav.js  v1.0
   Glow Menu (desktop) + Bottom Tab (mobile)
   Active state · Scroll-spy · Hash-on-load
===================================================== */
(function () {
  'use strict';

  if (window.__orenoNavLoaded) return;
  window.__orenoNavLoaded = true;

  /* ── Section-index → nav-key
     Mirrors NAV_SECTIONS order in script.js:
     0:hero 1:manifesto 2:studio 3:services 4:case-studies
     5:dissection 6:process 7:testimonials 8:cta 9:contact
     10:connect 11:footer
  ── */
  const IDX_MAP = {
    0: 'home',   1: 'home',
    2: 'studio', 3: 'studio',
    4: 'work',   5: 'work',
    6: 'studio', 7: 'voices',
    8: 'home',   9: 'home',
    10: 'home',  11: 'home',
  };

  const path   = location.pathname.replace(/\/+$/, '').toLowerCase();
  const isHome = path === '' || path === '/index.html';

  /* ── Active state ────────────────────────────────── */
  function setActive(key) {
    document.querySelectorAll('.snav-item').forEach(el =>
      el.classList.toggle('is-active', el.dataset.nav === key));
    document.querySelectorAll('.snm-tab').forEach(el =>
      el.classList.toggle('is-active', el.dataset.tab === key));
  }

  /* Page-level default */
  let pageKey = 'home';
  if (path.includes('testimonials')) pageKey = 'voices';
  else if (path.includes('inquiry'))  pageKey = 'start';
  else if (path.includes('case-'))    pageKey = 'work';
  setActive(pageKey);

  /* ── Scroll-spy (homepage horizontal scroll) ─────── */
  if (isHome) {
    let lastIdx = -1;
    const spy = () => {
      const idx = window.__oreno_sectionIdx ?? 0;
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(IDX_MAP[idx] ?? 'home');
      }
    };
    window.addEventListener('scroll', spy, { passive: true });
    /* Give script.js time to expose __oreno_sectionIdx */
    requestAnimationFrame(() => requestAnimationFrame(spy));
  }

  /* ── Hash-on-load ────────────────────────────────────
     When landing on /#work or /#studio from a sub-page,
     wait for script.js to boot then call scrollToSection.
  ─────────────────────────────────────────────────── */
  if (isHome && location.hash) {
    const HASH_MAP = {
      '#work':       '.section-case-studies',
      '#studio':     '.section-studio',
      '#process':    '.section-process',
      '#contact':    '.section-contact',
    };
    const sel = HASH_MAP[location.hash.toLowerCase()];
    if (sel) {
      window.addEventListener('load', () => {
        /* Retry up to 20 times (~1 s) waiting for scrollToSection */
        let attempts = 0;
        const tryScroll = setInterval(() => {
          attempts++;
          const fn  = window.scrollToSection;
          const els = window.__oreno_navSectionEls
                      || document.querySelectorAll(
                           ['.hero','.section-manifesto','.section-studio',
                            '.section-system','.section-case-studies',
                            '.section-dissection','.section-process',
                            '.section-testimonials','.section-cta',
                            '.section-contact','.section-connect',
                            '.site-footer'].join(','));
          if (fn) {
            const arr   = Array.from(els);
            const match = arr.findIndex(el => el.matches && el.matches(sel));
            if (match !== -1) { fn(match); history.replaceState(null,'','/'); }
            clearInterval(tryScroll);
          }
          if (attempts >= 20) clearInterval(tryScroll);
        }, 50);
      });
    }
  }

})();
