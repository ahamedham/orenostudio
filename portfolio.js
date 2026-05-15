/* =====================================================
   ORENO -- portfolio.js  v2.0
   Fan teaser + lightbox + text-free grid
===================================================== */
(function () {
  'use strict';

  /* ── CLIENT DATA ─────────────────────────────────── */
  var CLIENTS = [
    {
      group: 'CSI Media Unit',
      cat:   'Social Media & Design',
      works: [
        { f: '2 MEDIA UNIT ANSAF.png',            t: 'Vice President Announcement' },
        { f: 'KHADHIEJA.png',                     t: 'Head Prefect Announcement'   },
        { f: 'CAROLS 2023 24 ALBUM OUT POST.png',  t: 'Carol Service 2023-24'      },
        { f: 'CSI open for admission post 2.png',  t: 'Open for Admissions'        },
        { f: 'Leadership Camp lecturer post.png',  t: 'Leadership Camp'            },
        { f: 'MEDIA UNIT TSHIRT.png',              t: 'Media Unit Apparel'         },
        { f: 'MU 2023 AL BATCH GOOD LUCK v2.png',  t: 'AL Batch Good Luck'        },
        { f: "MU teachers' day post 2023.png",     t: "Teachers Day 2023"          },
        { f: 'AS exam Good luck post.png',         t: 'AS Exams Good Luck'         },
        { f: 'Triple Threat.png',                  t: 'Triple Threat'              },
      ],
    },
    {
      group: 'Iftar Campaign',
      cat:   'Event Design',
      works: [
        { f: 'IFTAR POST (1).png', t: 'Campaign Post' },
      ],
    },
    {
      group: 'Ramadan Campaign',
      cat:   'Social Media',
      works: [
        { f: 'Ramadan kareem 2023.png', t: 'Ramadan Kareem 2023' },
        { f: 'v3-RamadanKareem.png',    t: 'Ramadan Kareem v3'   },
      ],
    },
    {
      group: 'Brand Design',
      cat:   'Brand Design',
      works: [
        { f: 'austasia&dailyneeds.png', t: 'Retail Brand System' },
      ],
    },
    {
      group: 'Corporate',
      cat:   'Corporate Design',
      works: [
        { f: 'techpartner_hpe243i.jpg', t: 'Corporate Identity' },
      ],
    },
    {
      group: 'Event Design',
      cat:   'Event Design',
      works: [
        { f: '77thindp_etoil.png', t: 'National Day Design' },
      ],
    },
    {
      group: 'Advocacy',
      cat:   'Advocacy Design',
      works: [
        { f: 'a peaceful protest palastine.png', t: 'A Peaceful Protest' },
      ],
    },
    {
      group: null,
      cat:   'Design',
      works: [
        { f: 'Rectangle_Label_Mockup_3.png',                       t: 'Label Design'      },
        { f: 'comingsoon-4.3.png',                                 t: 'Coming Soon'        },
        { f: 'v3 verticle.png',                                    t: 'Vertical Study'     },
        { f: '2.png',                                              t: 'Composition'        },
        { f: 'Artboard 1@2x.png',                                  t: 'Artboard Study'     },
        { f: 'post 2.png',                                         t: 'Post Study'         },
        { f: 'WhatsApp Image 2023-03-04 at 16.22.57 (1).jpg',      t: 'Brand Photography'  },
      ],
    },
  ];

  var BASE = 'assets/PORTFOLIO%20ASSETS/design%20portfolio/';

  function encode(filename) {
    return BASE + encodeURIComponent(filename);
  }

  /* ── GRID RENDER (text-free flat cards) ──────────── */
  function renderGrid() {
    var grid = document.getElementById('pf-grid');
    if (!grid) return [];
    var all = [];
    CLIENTS.forEach(function (c) {
      c.works.forEach(function (w) { all.push(w); });
    });
    all.forEach(function (w, i) {
      var card = document.createElement('article');
      card.className = 'pf-card';
      card.setAttribute('role', 'listitem');
      card.dataset.index = String(i);
      var img = document.createElement('img');
      img.src = encode(w.f);
      img.alt = w.t || '';
      img.loading = 'lazy';
      card.appendChild(img);
      grid.appendChild(card);
    });
    return all;
  }

  /* ── FAN TEASER ──────────────────────────────────── */
  function initFanTeaser(all) {
    var teaser  = document.getElementById('pf-teaser');
    var fan     = document.getElementById('pf-fan');
    var full    = document.getElementById('pf-gallery-full');
    var expBtn  = document.getElementById('pf-expand-btn');
    var backBtn = document.getElementById('pf-back-btn');
    var countEl = document.getElementById('pf-expand-count');
    if (!teaser || !fan || !full || !expBtn) return;

    if (countEl) countEl.textContent = all.length;

    /* Pick 3 visually spread images for the fan */
    var picks     = [all[0], all[5] || all[1], all[11] || all[2]];
    var rotations = [-12, -2, 10];
    var xOffsets  = [-55, -5, 50];

    picks.forEach(function (w, i) {
      var card = document.createElement('div');
      card.className = 'pf-fan-card';
      card.style.setProperty('--rot', rotations[i] + 'deg');
      card.style.setProperty('--tx',  xOffsets[i]  + 'px');
      var img = document.createElement('img');
      img.src = encode(w.f);
      img.alt = '';
      img.draggable = false;
      card.appendChild(img);
      fan.appendChild(card);
    });

    function expand() {
      expBtn.setAttribute('aria-expanded', 'true');
      if (typeof gsap !== 'undefined') {
        gsap.to(fan.children, {
          scale: 0, opacity: 0, duration: 0.28, stagger: 0.05, ease: 'power2.in',
          onComplete: function () {
            teaser.style.display = 'none';
            full.removeAttribute('hidden');
            full.removeAttribute('aria-hidden');
            gsap.from('#pf-grid article', {
              y: 18, opacity: 0, duration: 0.42, stagger: 0.018, ease: 'power2.out',
            });
          },
        });
      } else {
        teaser.style.display = 'none';
        full.removeAttribute('hidden');
        full.removeAttribute('aria-hidden');
      }
    }

    function collapse() {
      full.setAttribute('hidden', '');
      full.setAttribute('aria-hidden', 'true');
      teaser.style.display = '';
      expBtn.setAttribute('aria-expanded', 'false');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(fan.children,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'back.out(1.4)' }
        );
      }
    }

    expBtn.addEventListener('click', expand);
    fan.addEventListener('click', expand);
    if (backBtn) backBtn.addEventListener('click', collapse);
  }

  /* ── LIGHTBOX ────────────────────────────────────── */
  function initLightbox(all) {
    /* Build overlay */
    var lb = document.createElement('div');
    lb.id = 'pf-lb';
    lb.className = 'pf-lb';
    lb.setAttribute('hidden', '');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<div class="pf-lb-bd"></div>' +
      '<img class="pf-lb-img" alt="">' +
      '<button class="pf-lb-close" aria-label="Close">&#x2715;</button>' +
      '<button class="pf-lb-prev" aria-label="Previous">&#8249;</button>' +
      '<button class="pf-lb-next" aria-label="Next">&#8250;</button>' +
      '<span class="pf-lb-count"></span>';
    document.body.appendChild(lb);

    var cur   = 0;
    var lbImg = lb.querySelector('.pf-lb-img');
    var lbCnt = lb.querySelector('.pf-lb-count');

    function show(i) {
      cur = ((i % all.length) + all.length) % all.length;
      lbImg.src = encode(all[cur].f);
      lbImg.alt = all[cur].t || '';
      lbCnt.textContent = (cur + 1) + ' / ' + all.length;
      lb.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lb.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }

    lb.querySelector('.pf-lb-bd').addEventListener('click', close);
    lb.querySelector('.pf-lb-close').addEventListener('click', close);
    lb.querySelector('.pf-lb-prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.pf-lb-next').addEventListener('click', function () { show(cur + 1); });

    document.addEventListener('keydown', function (e) {
      if (lb.hasAttribute('hidden')) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   show(cur - 1);
      if (e.key === 'ArrowRight')  show(cur + 1);
    });

    /* Touch swipe */
    var swipeX = 0;
    lb.addEventListener('touchstart', function (e) {
      swipeX = e.touches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeX;
      if (Math.abs(dx) > 40) show(dx < 0 ? cur + 1 : cur - 1);
    });

    /* Grid delegation */
    var grid = document.getElementById('pf-grid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var card = e.target.closest('.pf-card');
        if (card) show(parseInt(card.dataset.index, 10));
      });
    }
  }

  /* ── CHAR REVEAL ─────────────────────────────────── */
  function splitChars(el) {
    var label = el.textContent.trim();
    el.innerHTML = '';
    el.setAttribute('aria-label', label);
    var charEls = [];
    Array.from(label).forEach(function (ch) {
      var wrap  = document.createElement('span');
      wrap.className = 'ch-wrap';
      var inner = document.createElement('span');
      inner.className = 'ch';
      inner.setAttribute('aria-hidden', 'true');
      inner.textContent = ch === ' ' ? ' ' : ch;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (ch !== ' ') charEls.push(inner);
    });
    return charEls;
  }

  /* ── HERO ANIMATION ──────────────────────────────── */
  function initHero() {
    if (typeof gsap === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var rows  = document.querySelectorAll('.pf-title-row .pf-title-text');
    var chars = [];
    rows.forEach(function (row) { chars = chars.concat(splitChars(row)); });

    var label = document.querySelector('.pf-hero-label');
    var sub   = document.querySelector('.pf-hero-sub');
    var hint  = document.querySelector('.pf-scroll-hint');
    var tl    = gsap.timeline({ delay: 0.15 });

    if (label) {
      gsap.set(label, { opacity: 0, y: 8 });
      tl.to(label, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0);
    }
    if (chars.length) {
      gsap.set(chars, { yPercent: 108 });
      tl.to(chars, { yPercent: 0, duration: 0.85, ease: 'power3.out', stagger: 0.022 }, 0.1);
    }
    if (sub) {
      gsap.set(sub, { opacity: 0, y: 14 });
      tl.to(sub, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.52);
    }
    if (hint) {
      gsap.set(hint, { opacity: 0 });
      tl.to(hint, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.85);
    }
  }

  /* ── STORY SCROLL ────────────────────────────────── */
  function initStoryScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sections = Array.from(document.querySelectorAll('.pf-story'));
    if (!sections.length) return;

    sections.forEach(function (section, i) {
      gsap.set(section, { zIndex: i + 1 });
      var inner = section.querySelector('.pf-story-inner');
      if (!inner) return;

      if (i > 0 && !reduced) {
        gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
        gsap.to(inner, {
          rotation: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 25%',
            scrub: true,
          },
        });
      }

      if (i < sections.length - 1) {
        ScrollTrigger.create({
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
        });
      }
    });

    ScrollTrigger.refresh();
  }

  /* ── CTA REVEAL ──────────────────────────────────── */
  function initCtaReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var heading = document.querySelector('.pf-cta-heading');
    var link    = document.querySelector('.pf-cta-link');
    if (heading) {
      gsap.from(heading, {
        y: 32, opacity: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.pf-cta', start: 'top 80%' },
      });
    }
    if (link) {
      gsap.from(link, {
        y: 16, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.18,
        scrollTrigger: { trigger: '.pf-cta', start: 'top 75%' },
      });
    }
  }

  /* ── PAGE TRANSITIONS ────────────────────────────── */
  function initPageTransitions() {
    var overlay = document.querySelector('.page-overlay');
    if (!overlay) return;
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || link.target === '_blank') return;
      e.preventDefault();
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(overlay, { y: '100%' }, {
          y: '0%', duration: 0.55, ease: 'power3.inOut',
          onComplete: function () { window.location.href = href; },
        });
      } else {
        window.location.href = href;
      }
    });
  }

  /* ── CURSOR ──────────────────────────────────────── */
  function initCursor() {
    var blob = document.getElementById('cursor-blob');
    if (!blob || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      blob.style.left = cx + 'px';
      blob.style.top  = cy + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .pf-card, .pf-fan-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { blob.classList.add('is-link'); });
      el.addEventListener('mouseleave', function () { blob.classList.remove('is-link'); });
    });
    document.querySelectorAll('.pf-story-title').forEach(function (el) {
      el.addEventListener('mouseenter', function () { blob.classList.add('is-heading'); });
      el.addEventListener('mouseleave', function () { blob.classList.remove('is-heading'); });
    });
  }

  /* ── RESIZE ──────────────────────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 250);
  });

  /* ── INIT ────────────────────────────────────────── */
  function init() {
    var all = renderGrid();
    initFanTeaser(all);
    initLightbox(all);
    initHero();
    initStoryScroll();
    initCtaReveal();
    initPageTransitions();
    initCursor();
    /* Pre-warm browser cache for all grid images after page load */
    window.addEventListener('load', function () {
      document.querySelectorAll('#pf-grid img').forEach(function (img) {
        (new Image()).src = img.src;
      });
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

})();
