/* =====================================================
   ØRENO — portfolio.js  v1.0
   Story-scroll stacking · grid render · hero reveal
===================================================== */
(function () {
  'use strict';
  /* ── CLIENT DATA (grouped by client) ────────────────── */
  var CLIENTS = [
    {
      group: 'CSI Media Unit',
      cat:   'Social Media & Design',
      works: [
        { f: '2 MEDIA UNIT ANSAF.png',           t: 'Vice President Announcement' },
        { f: 'KHADHIEJA.png',                    t: 'Head Prefect Announcement'   },
        { f: 'CAROLS 2023 24 ALBUM OUT POST.png', t: 'Carol Service 2023–24'      },
        { f: 'CSI open for admission post 2.png', t: 'Open for Admissions'        },
        { f: 'Leadership Camp lecturer post.png', t: 'Leadership Camp'            },
        { f: 'MEDIA UNIT TSHIRT.png',             t: 'Media Unit Apparel'         },
        { f: 'MU 2023 AL BATCH GOOD LUCK v2.png', t: 'AL Batch · Good Luck'      },
        { f: "MU teachers' day post 2023.png",    t: "Teachers' Day 2023"         },
        { f: 'AS exam Good luck post.png',        t: 'A/S Exams · Good Luck'      },
        { f: 'Triple Threat.png',                 t: 'Triple Threat'              },
      ],
    },
    {
      group: 'Iftar 26',
      cat:   'Event Identity',
      works: [
        { f: 'FInal_Logo_Iftar26.png', t: 'Brand Mark'     },
        { f: 'IFTAR POST (1).png',     t: 'Campaign Post'  },
      ],
    },
    {
      group: 'Ramadan Campaign',
      cat:   'Social Media',
      works: [
        { f: 'Ramadan kareem 2023.png', t: 'Ramadan Kareem 2023' },
        { f: 'v3-RamadanKareem.png',    t: 'Ramadan Kareem · v3' },
      ],
    },
    {
      group: 'Raaidh',
      cat:   'Brand Identity',
      works: [{ f: 'raaidh.png', t: 'Brand Identity' }],
    },
    {
      group: 'Austasia & Daily Needs',
      cat:   'Brand Design',
      works: [{ f: 'austasia&dailyneeds.png', t: 'Brand Design' }],
    },
    {
      group: 'HPE Tech Partner',
      cat:   'Corporate Design',
      works: [{ f: 'techpartner_hpe243i.jpg', t: 'Corporate Design' }],
    },
    {
      group: '77th Independence',
      cat:   'Event Design',
      works: [{ f: '77thindp_etoil.png', t: '77th Independence Day' }],
    },
    {
      group: 'Palestine Solidarity',
      cat:   'Advocacy Design',
      works: [{ f: 'a peaceful protest palastine.png', t: 'A Peaceful Protest' }],
    },
    {
      group: null,
      cat:   'Design',
      works: [
        { f: 'Rectangle_Label_Mockup_3.png',                        t: 'Label Design',      c: 'Packaging'      },
        { f: 'comingsoon-4.3.png',                                  t: 'Coming Soon',        c: 'Campaign'       },
        { f: 'v3 verticle.png',                                     t: 'Vertical Study',     c: 'Layout Design'  },
        { f: '2.png',                                               t: 'Composition',        c: 'Graphic Design' },
        { f: 'Artboard 1@2x.png',                                   t: 'Artboard Study',     c: 'Graphic Design' },
        { f: 'post 2.png',                                          t: 'Post Study',         c: 'Graphic Design' },
        { f: 'WhatsApp Image 2023-03-04 at 16.22.57 (1).jpg',       t: 'Brand Photography',  c: 'Photography'    },
      ],
    },
  ];

  var BASE = 'assets/PORTFOLIO%20ASSETS/design%20portfolio/';

  function encode(filename) {
    return BASE + encodeURIComponent(filename);
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── GRID RENDER (grouped) ───────────────────────── */
  function renderGrid() {
    var grid = document.getElementById('pf-grid');
    if (!grid) return;

    CLIENTS.forEach(function (client) {
      /* Group label for multi-work clients */
      if (client.group && client.works.length > 1) {
        var label = document.createElement('div');
        label.className = 'pf-group-label';
        label.textContent = client.group;
        grid.appendChild(label);
      }

      client.works.forEach(function (w) {
        var cat  = w.c || client.cat;
        var card = document.createElement('article');
        card.className = 'pf-card';
        card.setAttribute('role', 'listitem');
        card.innerHTML =
          '<div class="pf-card-img">' +
            '<img src="' + encode(w.f) + '" alt="' + escHtml(w.t) + '" loading="lazy">' +
          '</div>' +
          '<div class="pf-card-info">' +
            '<span class="pf-card-cat">' + escHtml(cat) + '</span>' +
            '<span class="pf-card-title">' + escHtml(w.t) + '</span>' +
          '</div>';
        grid.appendChild(card);
      });
    });
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
      inner.textContent = ch === ' ' ? ' ' : ch;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (ch !== ' ') charEls.push(inner);
    });
    return charEls;
  }

  /* ── HERO ANIMATION ──────────────────────────────── */
  function initHero() {
    if (typeof gsap === 'undefined') return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

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

  /* ── STORY SCROLL (FlowArt pattern, vanilla GSAP) ── */
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

      /* Pin all but the last section */
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

  /* ── GRID REVEAL ─────────────────────────────────── */
  function initGridReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var heading = document.querySelector('.pf-grid-title');
    if (heading) {
      gsap.from(heading, {
        y: 28, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.pf-grid-header', start: 'top 85%' },
      });
    }
    gsap.from('.pf-card', {
      y: 28, opacity: 0, duration: 0.55, ease: 'power2.out', stagger: 0.035,
      scrollTrigger: { trigger: '#pf-grid', start: 'top 82%' },
    });
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
        y: 16, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.pf-cta', start: 'top 75%' },
        delay: 0.18,
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
    document.querySelectorAll('a, button, .pf-card').forEach(function (el) {
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
    renderGrid();
    initHero();
    initStoryScroll();
    initGridReveal();
    initCtaReveal();
    initPageTransitions();
    initCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

})();
