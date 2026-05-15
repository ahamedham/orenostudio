/* ════════════════════════════════════════════════════════════
   cs-apps.js — The Live Monitor
   ───────────────────────────────────────────────────────────
   Turns the static "Inside the System" stage on each case
   page into a live, runnable monitor the reader can actually
   click into.

   Phase C.0 — foundation + RMI Dashboard scene.
   Other scenes mount a "coming soon" placeholder until their
   phase lands.

   Dependencies: none. Vanilla DOM + Web Animations API.
   Respects prefers-reduced-motion and the mobile flag.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const doc       = document;
  const reduced   = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile  = () => window.innerWidth <= 768;

  /* ── small DOM helpers ── */
  const el = (tag, attrs, ...kids) => {
    const n = doc.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class')      n.className = attrs[k];
      else if (k === 'style') n.style.cssText = attrs[k];
      else if (k === 'html')  n.innerHTML = attrs[k];
      else if (k === 'text')  n.textContent = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else                    n.setAttribute(k, attrs[k]);
    }
    for (const kid of kids) {
      if (kid == null) continue;
      if (typeof kid === 'string') n.appendChild(doc.createTextNode(kid));
      else n.appendChild(kid);
    }
    return n;
  };
  const svg = (tag, attrs) => {
    const n = doc.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  /* ═══════════════════════════════════════════════════════════
     CsDemoBlob — editorial glow marker for scripted walkthroughs
     Not a cursor icon; a soft accent-colored blob that glides
     between targets to draw the reader's eye during auto-demos.
  ═══════════════════════════════════════════════════════════ */
  class CsDemoBlob {
    constructor(host) {
      this.host = host;
      this.node = el('span', { class: 'cs-demo-blob', 'aria-hidden': 'true' });
      host.appendChild(this.node);
      this.visible = false;
    }
    show() {
      if (this.visible) return;
      this.visible = true;
      this.node.classList.add('is-visible');
    }
    hide() {
      if (!this.visible) return;
      this.visible = false;
      this.node.classList.remove('is-visible');
    }
    /** Move to a target element (CSS coords relative to host). */
    moveTo(target, opts = {}) {
      if (!target || !this.host) return Promise.resolve();
      const hostRect = this.host.getBoundingClientRect();
      const tRect    = target.getBoundingClientRect();
      const x = (tRect.left + tRect.width  / 2) - hostRect.left;
      const y = (tRect.top  + tRect.height / 2) - hostRect.top;
      this.show();
      const duration = reduced ? 0 : (opts.duration ?? 650);
      return this.node.animate(
        [{ transform: `translate(${this.lastX || x}px, ${this.lastY || y}px)` },
         { transform: `translate(${x}px, ${y}px)` }],
        { duration, easing: 'cubic-bezier(.6,.05,.25,1)', fill: 'forwards' }
      ).finished.then(() => { this.lastX = x; this.lastY = y; });
    }
    destroy() {
      this.node.remove();
    }
  }

  /* ═══════════════════════════════════════════════════════════
     CsScene — base class every scene extends
     Lifecycle: new → mount(host, ctx) → play() → pause/takeover → destroy()
  ═══════════════════════════════════════════════════════════ */
  class CsScene {
    constructor(opts = {}) {
      this.opts       = opts;
      this.host       = null;
      this.ctx        = null;
      this.timer      = null;
      this.takenOver  = false;
      this._onUserAct = null;
    }
    /** Override. Build DOM inside host. Return nothing. */
    mount(host, ctx) {
      this.host = host;
      this.ctx  = ctx;
    }
    /** Override. Run the scripted auto-demo timeline. */
    play() {}
    /** Called when the reader takes over. Stop auto-demo. */
    takeover() {
      if (this.takenOver) return;
      this.takenOver = true;
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      if (this.ctx && this.ctx.blob) this.ctx.blob.hide();
      if (this.ctx && this.ctx.markLive) this.ctx.markLive();
    }
    /** Clean up DOM + listeners when the director swaps scenes. */
    destroy() {
      if (this.timer) { clearTimeout(this.timer); this.timer = null; }
      if (this.host) this.host.innerHTML = '';
      this.host = null;
      this.ctx  = null;
      this.takenOver = false;
    }
    /** Schedule a step in the auto-demo. Bails out if taken over. */
    step(ms, fn) {
      if (this.takenOver || reduced) return;
      this.timer = setTimeout(() => {
        if (this.takenOver) return;
        fn();
      }, ms);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     Scene registry — each case page gets a map of tab-index → factory
  ═══════════════════════════════════════════════════════════ */
  const SCENES = {};       // key "<case>:<index>" → factory
  const register = (key, factory) => { SCENES[key] = factory; };

  /* ═══════════════════════════════════════════════════════════
     Placeholder scene — used for every slot not yet implemented
     in phase C.0. Gives a clean "coming in the next drop" card.
  ═══════════════════════════════════════════════════════════ */
  class ComingSoonScene extends CsScene {
    constructor(label) { super(); this.label = label || 'Scene'; }
    mount(host, ctx) {
      super.mount(host, ctx);
      host.appendChild(el('div', { class: 'cs-scene cs-scene--placeholder' },
        el('span', { class: 'cs-placeholder-tag', text: 'Next drop' }),
        el('p', { class: 'cs-placeholder-h', text: this.label }),
        el('p', { class: 'cs-placeholder-p', text: 'This scene goes live in the next phase. The Dashboard scene is the C.0 canary — click it to see where we are headed.' })
      ));
    }
  }

  /* ═══════════════════════════════════════════════════════════
     RMI Dashboard Scene — the C.0 canary
     ───────────────────────────────────────────────────────────
     A live dashboard for a garment-brand ERP:
       · 4 stat cards (Revenue, Orders, Brands, Dispatches)
         that count up on mount
       · Brand chip row (Étoile / INAF Junior / Drop / All)
       · Bar chart "Orders by brand" — re-renders on chip change
       · Orders list — re-renders on chip change; click opens drawer
       · Side drawer shows the order detail + status timeline
     Auto-demo: selects Étoile → opens first filtered order → closes.
  ═══════════════════════════════════════════════════════════ */
  const BRANDS = [
    { id: 'all',    label: 'All brands' },
    { id: 'etoile', label: 'Étoile' },
    { id: 'inaf',   label: 'INAF Junior' },
    { id: 'drop',   label: 'Drop' },
  ];

  const ORDERS = [
    { no: '#ET-2041', brand: 'etoile', brandLabel: 'Étoile',      qty: 180, amount: 'LKR 214,200', status: 'Packing',    created: '09:02' },
    { no: '#IJ-1188', brand: 'inaf',   brandLabel: 'INAF Junior', qty: 240, amount: 'LKR  96,000', status: 'Confirmed',  created: '08:44' },
    { no: '#DR-0932', brand: 'drop',   brandLabel: 'Drop',        qty:  60, amount: 'LKR  43,500', status: 'Dispatched', created: '08:31' },
    { no: '#ET-2040', brand: 'etoile', brandLabel: 'Étoile',      qty: 120, amount: 'LKR 142,800', status: 'Delivered',  created: '07:58' },
    { no: '#IJ-1187', brand: 'inaf',   brandLabel: 'INAF Junior', qty: 300, amount: 'LKR 120,000', status: 'Packing',    created: '07:42' },
    { no: '#DR-0931', brand: 'drop',   brandLabel: 'Drop',        qty:  40, amount: 'LKR  29,000', status: 'Draft',      created: '07:24' },
    { no: '#ET-2039', brand: 'etoile', brandLabel: 'Étoile',      qty:  90, amount: 'LKR 107,100', status: 'Dispatched', created: '06:55' },
  ];

  /* Small formatter for LKR count-up. */
  function countUp(nodeText, target, duration = 1100) {
    if (reduced) { nodeText.textContent = target.toLocaleString('en-US'); return; }
    const start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      nodeText.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  class RmiDashboardScene extends CsScene {
    mount(host, ctx) {
      super.mount(host, ctx);
      this.state = { activeBrand: 'all', openOrder: null };

      /* ── Top stat strip ── */
      const stats = el('div', { class: 'cs-scene-stats' },
        this._stat('Revenue MTD', 'LKR ', '2384500', ' ▲ 12.4%'),
        this._stat('Orders',      '',     '127',    ' 42 in production'),
        this._stat('Brands',      '',     '3',      ' Étoile · INAF Jr · Drop'),
        this._stat('Dispatches',  '',     '38',     ' Last 24 hours')
      );

      /* ── Brand chip row ── */
      this.chipRow = el('div', { class: 'cs-scene-chips', role: 'tablist' });
      BRANDS.forEach(b => {
        const chip = el('button', {
          class: 'cs-scene-chip' + (b.id === 'all' ? ' is-active' : ''),
          type: 'button',
          role: 'tab',
          'data-brand': b.id,
          onclick: (e) => { this._selectBrand(b.id); ctx.userActed(); }
        }, b.label);
        this.chipRow.appendChild(chip);
      });

      /* ── Main split: chart + orders list ── */
      this.chartHost = el('div', { class: 'cs-scene-chart' });
      this.listHost  = el('ul', { class: 'cs-scene-list' });

      const body = el('div', { class: 'cs-scene-body' },
        el('div', { class: 'cs-scene-chart-wrap' },
          el('div', { class: 'cs-scene-section-label', text: 'Orders by brand · this week' }),
          this.chartHost
        ),
        el('div', { class: 'cs-scene-list-wrap' },
          el('div', { class: 'cs-scene-section-label', text: 'Latest orders' }),
          this.listHost
        )
      );

      /* ── Side drawer (hidden until an order is clicked) ── */
      this.drawer = el('aside', { class: 'cs-scene-drawer', 'aria-hidden': 'true' });
      this.drawerBackdrop = el('span', {
        class: 'cs-scene-drawer-backdrop',
        onclick: () => { this._closeDrawer(); ctx.userActed(); }
      });

      const wrap = el('div', { class: 'cs-scene cs-scene--rmi-dashboard' },
        stats,
        this.chipRow,
        body,
        this.drawerBackdrop,
        this.drawer
      );
      host.appendChild(wrap);

      /* Initial render + count-up */
      this._renderChart();
      this._renderList();

      const figs = host.querySelectorAll('[data-count]');
      figs.forEach((f, i) => {
        const target = parseFloat(f.dataset.count);
        setTimeout(() => countUp(f, target, 1100), 150 + i * 90);
      });
    }

    _stat(label, prefix, count, foot) {
      return el('div', { class: 'cs-scene-stat' },
        el('p', { class: 'cs-scene-stat-label', text: label }),
        el('p', { class: 'cs-scene-stat-value' },
          prefix ? doc.createTextNode(prefix) : null,
          el('span', { 'data-count': count, text: '0' })
        ),
        el('p', { class: 'cs-scene-stat-foot', text: foot })
      );
    }

    _selectBrand(id) {
      this.state.activeBrand = id;
      this.chipRow.querySelectorAll('.cs-scene-chip').forEach(c =>
        c.classList.toggle('is-active', c.dataset.brand === id));
      this._renderChart();
      this._renderList();
    }

    _filteredOrders() {
      const b = this.state.activeBrand;
      return b === 'all' ? ORDERS : ORDERS.filter(o => o.brand === b);
    }

    _renderChart() {
      const rows = this._filteredOrders();
      // bars: per-order qty, max normalized to chart height
      const max = Math.max(...rows.map(r => r.qty), 300);
      this.chartHost.innerHTML = '';
      const chart = svg('svg', { viewBox: '0 0 280 120', class: 'cs-scene-chart-svg' });
      // baseline
      const base = svg('line', { x1: 8, y1: 104, x2: 272, y2: 104, class: 'cs-chart-base' });
      chart.appendChild(base);
      const step = rows.length ? (264 / rows.length) : 0;
      rows.forEach((r, i) => {
        const h = (r.qty / max) * 88;
        const x = 12 + i * step;
        const y = 104 - h;
        const rect = svg('rect', {
          x, y, width: Math.max(step - 6, 8), height: h, rx: 1,
          class: 'cs-chart-bar',
        });
        rect.style.transformOrigin = `${x + step/2}px 104px`;
        rect.animate(
          [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
          { duration: reduced ? 0 : 520, delay: reduced ? 0 : i * 60, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }
        );
        chart.appendChild(rect);
      });
      // axis tick label
      const lbl = svg('text', { x: 8, y: 118, class: 'cs-chart-label' });
      lbl.textContent = rows.length + ' orders · max ' + max + ' pcs';
      chart.appendChild(lbl);
      this.chartHost.appendChild(chart);
    }

    _renderList() {
      const rows = this._filteredOrders();
      this.listHost.innerHTML = '';
      rows.forEach((o, i) => {
        const status = el('span', {
          class: 'cs-scene-pill cs-status--' + o.status.toLowerCase(),
          text: o.status
        });
        const li = el('li', {
          class: 'cs-scene-list-item',
          'data-order': o.no,
          tabindex: '0',
          onclick: () => { this._openDrawer(o); this.ctx.userActed(); },
          onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._openDrawer(o); this.ctx.userActed(); } }
        },
          el('span', { class: 'cs-scene-list-no', text: o.no }),
          el('span', { class: 'cs-scene-list-brand', text: o.brandLabel }),
          el('span', { class: 'cs-scene-list-qty', text: o.qty + ' pcs' }),
          el('span', { class: 'cs-scene-list-amt', text: o.amount }),
          status
        );
        li.style.opacity = '0';
        li.style.transform = 'translateY(8px)';
        li.animate(
          [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: reduced ? 0 : 380, delay: reduced ? 0 : 80 + i * 45, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
        );
        this.listHost.appendChild(li);
      });
    }

    _openDrawer(order) {
      this.state.openOrder = order;
      this.drawer.innerHTML = '';
      this.drawer.appendChild(
        el('div', { class: 'cs-drawer-inner' },
          el('button', {
            class: 'cs-drawer-close',
            type: 'button',
            'aria-label': 'Close order detail',
            onclick: () => { this._closeDrawer(); this.ctx.userActed(); }
          }, '×'),
          el('p', { class: 'cs-drawer-label', text: 'Order detail' }),
          el('h4', { class: 'cs-drawer-h', text: order.no }),
          el('p', { class: 'cs-drawer-sub', text: order.brandLabel + ' · ' + order.qty + ' pcs · ' + order.amount }),
          el('div', { class: 'cs-drawer-timeline' },
            this._tlStep('Draft',      true,  '07:12'),
            this._tlStep('Confirmed',  true,  '07:48'),
            this._tlStep('Packing',    order.status !== 'Draft' && order.status !== 'Confirmed', '08:20'),
            this._tlStep('Dispatched', ['Dispatched', 'Delivered'].includes(order.status), '08:55'),
            this._tlStep('Delivered',  order.status === 'Delivered', '09:34')
          ),
          el('div', { class: 'cs-drawer-foot' },
            el('span', { text: 'Logged by · R. Fernando' }),
            el('span', { text: 'Brand · ' + order.brandLabel })
          )
        )
      );
      this.drawer.setAttribute('aria-hidden', 'false');
      this.drawerBackdrop.classList.add('is-open');
      this.drawer.classList.add('is-open');
    }

    _tlStep(label, done, time) {
      return el('div', { class: 'cs-drawer-step' + (done ? ' is-done' : '') },
        el('span', { class: 'cs-drawer-dot' }),
        el('span', { class: 'cs-drawer-step-l', text: label }),
        el('span', { class: 'cs-drawer-step-t', text: done ? time : '—' })
      );
    }

    _closeDrawer() {
      this.state.openOrder = null;
      this.drawer.setAttribute('aria-hidden', 'true');
      this.drawer.classList.remove('is-open');
      this.drawerBackdrop.classList.remove('is-open');
    }

    /* Scripted walkthrough — ~8 seconds, loops until takeover. */
    play() {
      if (reduced) return;
      const blob = this.ctx && this.ctx.blob;
      const run = () => {
        if (this.takenOver) return;
        const chipEtoile = this.chipRow.querySelector('[data-brand="etoile"]');
        this.step(1100, async () => {
          if (blob) await blob.moveTo(chipEtoile, { duration: 800 });
          if (this.takenOver) return;
          this._selectBrand('etoile');
          this.step(1200, async () => {
            if (this.takenOver) return;
            const firstRow = this.listHost.querySelector('.cs-scene-list-item');
            if (blob && firstRow) await blob.moveTo(firstRow, { duration: 700 });
            if (this.takenOver) return;
            const order = ORDERS.find(o => o.brand === 'etoile');
            if (order) this._openDrawer(order);
            this.step(2400, () => {
              if (this.takenOver) return;
              this._closeDrawer();
              this.step(900, () => {
                if (this.takenOver) return;
                this._selectBrand('all');
                if (blob) blob.hide();
                this.step(1800, run);  // loop
              });
            });
          });
        });
      };
      run();
    }
  }

  register('rmi:0', () => new RmiDashboardScene());
  // Phase C.1 targets — placeholders for now:
  register('rmi:1', () => new ComingSoonScene('Orders · live status advance'));
  register('rmi:2', () => new ComingSoonScene('Warehouse · rack grid + tooltips'));
  register('rmi:3', () => new ComingSoonScene('Accounts · scrubbable chart'));
  register('rmi:4', () => new ComingSoonScene('Delivery · live van routes'));
  register('rmi:5', () => new ComingSoonScene('Factory · station queues'));
  // Phase C.2 — DMC placeholders
  register('dmc:0', () => new ComingSoonScene('Login · form you can type into'));
  register('dmc:1', () => new ComingSoonScene('Create · live invoice preview'));
  register('dmc:2', () => new ComingSoonScene('PDF · real download'));
  register('dmc:3', () => new ComingSoonScene('Send · compose + attach'));
  register('dmc:4', () => new ComingSoonScene('Archive · searchable history'));
  register('dmc:5', () => new ComingSoonScene('Settings · drop a seal to replace'));

  /* ═══════════════════════════════════════════════════════════
     CsMonitor — boot animation + scene mount target
     Reuses the existing markup:
       section[data-stage]
         .cs-stage-frame
           .cs-stage-chrome
             [data-stage-url]
           .cs-stage-view            ← scene mount host
         .cs-stage-tabs [data-stage-tab]
         .cs-stage-copy [data-stage-copy]
     data-stage="rmi"  (or dmc)     ← case id
     data-stage-urls='["rmi.oreno.lk / dashboard", ...]'
  ═══════════════════════════════════════════════════════════ */
  class CsMonitor {
    constructor(section) {
      this.section = section;
      this.caseId  = section.dataset.stage;
      this.frame   = section.querySelector('.cs-stage-frame');
      this.chrome  = section.querySelector('.cs-stage-chrome');
      this.view    = section.querySelector('.cs-stage-view');
      this.urlEl   = section.querySelector('[data-stage-url]');
      this.tabs    = [...section.querySelectorAll('[data-stage-tab]')];
      this.copies  = [...section.querySelectorAll('[data-stage-copy]')];
      try {
        this.urls = JSON.parse(section.dataset.stageUrls || '[]');
      } catch (_e) { this.urls = []; }

      this.active     = 0;
      this.booted     = false;
      this.scene      = null;
      this.blob       = null;
      this.liveChip   = null;

      this._bindTabs();
      this._observe();
    }

    _bindTabs() {
      this.tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
          if (i === this.active) return;
          this._setActive(i, { userAction: true });
          // Tab click is itself a takeover of the current scene's demo
          if (this.scene) this.scene.takenOver = true;
        });
      });
    }

    _observe() {
      if (isMobile()) {
        // Mobile fallback: static first scene, no boot, no blob.
        this._setActive(0, { skipBoot: true, skipPlay: true });
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          if (reduced) {
            this._setActive(0, { skipBoot: true });
          } else {
            this._boot().then(() => this._setActive(0));
          }
        });
      }, { threshold: 0.35 });
      io.observe(this.frame);
    }

    _boot() {
      if (this.booted) return Promise.resolve();
      this.booted = true;
      this.frame.classList.add('is-booting');
      // 1. chrome strokes in (CSS handles the transition)
      // 2. url typewrites
      const targetUrl = this.urls[0] || '';
      return this._typeUrl(targetUrl).then(() => {
        return delay(180);
      }).then(() => {
        this.frame.classList.remove('is-booting');
        this.frame.classList.add('is-booted');
      });
    }

    _typeUrl(text) {
      if (!this.urlEl || reduced) {
        if (this.urlEl) this.urlEl.textContent = text;
        return Promise.resolve();
      }
      return new Promise(resolve => {
        let i = 0;
        this.urlEl.textContent = '';
        const total = text.length;
        const stepMs = Math.max(14, 380 / Math.max(total, 1));
        const tick = () => {
          if (i > total) return resolve();
          this.urlEl.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, stepMs);
        };
        tick();
      });
    }

    _setActive(i, opts = {}) {
      this.active = i;
      this.tabs.forEach((t, j)   => t.classList.toggle('is-active', j === i));
      this.copies.forEach((c, j) => c.classList.toggle('is-active', j === i));
      if (this.urls[i] && !opts.skipBoot) this._typeUrl(this.urls[i]);
      else if (this.urls[i] && this.urlEl) this.urlEl.textContent = this.urls[i];

      // clear live chip on scene swap
      if (this.liveChip) { this.liveChip.remove(); this.liveChip = null; }

      // destroy previous scene, mount new one
      if (this.scene) { this.scene.destroy(); this.scene = null; }
      const key = this.caseId + ':' + i;
      const factory = SCENES[key];
      if (!factory) return;
      const scene = factory();
      const ctx = {
        blob: this.blob || (this.blob = new CsDemoBlob(this.view)),
        userActed: () => { if (scene) scene.takeover(); },
        markLive: () => this._markLive(),
      };
      // Fresh scene — start not-taken-over
      scene.takenOver = false;
      scene.mount(this.view, ctx);

      // Add user-intent listeners (first real action → takeover)
      const handler = (e) => {
        if (!scene) return;
        scene.takeover();
        this.view.removeEventListener('pointerdown', handler);
        this.view.removeEventListener('keydown', handler);
        this.view.removeEventListener('input', handler, true);
      };
      this.view.addEventListener('pointerdown', handler);
      this.view.addEventListener('keydown', handler);
      this.view.addEventListener('input', handler, true);

      this.scene = scene;
      if (!opts.skipPlay && !reduced) {
        // Let mount's count-up animations run for a beat before the blob arrives
        setTimeout(() => { if (this.scene === scene && !scene.takenOver) scene.play(); }, 700);
      }
    }

    _markLive() {
      if (this.liveChip || !this.chrome) return;
      this.liveChip = el('span', { class: 'cs-chrome-live', text: 'Live' });
      this.chrome.appendChild(this.liveChip);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     Boot on DOMContentLoaded — one monitor per [data-stage] section
  ═══════════════════════════════════════════════════════════ */
  function init() {
    const sections = doc.querySelectorAll('section[data-stage]');
    sections.forEach(s => new CsMonitor(s));
  }
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
