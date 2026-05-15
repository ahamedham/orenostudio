/* =====================================================
   ØRENO — thermo-global.js  v1.1
   Global thermodynamic mouse trail.
   Fixed canvas overlay, pointer-events:none.
   Desktop (hover:hover) only — skipped on touch devices.
===================================================== */
(function initGlobalThermoTrail() {
  /* Touch devices: skip entirely */
  if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;

  /* Reduced-motion: skip entirely */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("global-thermo");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const RES     = 18;    /* grid cell size in px */
  const COOLING = 0.96;  /* decay per frame — higher = faster fade */

  /* Low-end device detection: throttle to ~30fps to save CPU/GPU */
  const isLowEnd = (navigator.hardwareConcurrency <= 4) ||
    (navigator.connection && ["slow-2g", "2g"].includes(navigator.connection.effectiveType));
  const FRAME_SKIP = isLowEnd ? 2 : 1;
  let frameCount = 0;

  let grid, cols, rows, W, H;
  const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, active: false, lastMoved: 0 };

  /* Dark section indices on index.html (sections with dark #0A0A0A bg) */
  const DARK_SECTION_IDS = new Set([1, 3, 8, 10, 11]); /* hero (0) is now light */

  /* Color palettes
     light: used on light-bg sections (cream #F5F3EE)
     dark:  used on dark-bg sections (#0A0A0A / #050505) */
  const PALETTES = {
    light: {
      dot:        "rgba(10,10,10,0.04)",
      hotPrefix:  "rgba(60,57,52,",      /* append opacity + ")" */
      maxOpacity: 0.32,
    },
    dark: {
      dot:        "rgba(245,243,238,0.05)",
      hotPrefix:  "rgba(245,243,238,",
      maxOpacity: 0.11,
    }
  };

  function getPalette() {
    const bodyId = document.body.id;
    if (bodyId === "page-inquiry")      return PALETTES.dark;
    if (bodyId === "page-testimonials") return PALETTES.light;
    /* index.html: use the exposed section index */
    const idx = (typeof window.__oreno_sectionIdx === "number")
      ? window.__oreno_sectionIdx : 0;
    return DARK_SECTION_IDS.has(idx) ? PALETTES.dark : PALETTES.light;
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    cols = Math.ceil(W / RES);
    rows = Math.ceil(H / RES);
    grid = new Float32Array(cols * rows);
  }

  function tick() {
    /* Skip frames on low-end devices for ~30fps */
    frameCount++;
    if (frameCount % FRAME_SKIP !== 0) {
      requestAnimationFrame(tick);
      return;
    }

    /* Pause when tab is not visible */
    if (document.hidden) {
      requestAnimationFrame(tick);
      return;
    }

    /* Idle detection: mouse stationary for > 500ms */
    const now    = Date.now();
    const isIdle = (now - mouse.lastMoved) > 500;

    /* Heat injection along mouse path */
    if (mouse.active && !isIdle) {
      const dx    = mouse.x - mouse.px;
      const dy    = mouse.y - mouse.py;
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
            if (d <= 2) {
              grid[c + r * cols] = Math.min(1, grid[c + r * cols] + 0.26 * (1 - d / 2));
            }
          }
        }
      }
    }
    mouse.px = mouse.x;
    mouse.py = mouse.y;

    /* When idle, check if grid has fully cooled — if so, skip render entirely */
    if (isIdle) {
      let maxHeat = 0;
      for (let i = 0; i < grid.length; i++) {
        if (grid[i] > maxHeat) maxHeat = grid[i];
      }
      if (maxHeat < 0.005) {
        /* Grid is fully cool and mouse is idle — clear once and go dormant */
        ctx.clearRect(0, 0, W, H);
        requestAnimationFrame(tick);
        return;
      }
    }

    /* Render */
    const palette = getPalette();
    /* Skip rendering on hero (idx 0) — it has its own canvas */
    const curIdx = (typeof window.__oreno_sectionIdx === "number")
      ? window.__oreno_sectionIdx : -1;
    if (curIdx === 0) {
      ctx.clearRect(0, 0, W, H);
      requestAnimationFrame(tick);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = c + r * cols;
        const t   = grid[idx];
        grid[idx] *= COOLING;

        if (t > 0.05) {
          const fontSize = Math.round(RES * (0.72 + t * 0.45));
          const opacity  = (t * palette.maxOpacity).toFixed(3);
          ctx.fillStyle  = palette.hotPrefix + opacity + ")";
          ctx.font       = fontSize + "px Montserrat, sans-serif";
          ctx.textAlign  = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("Ø", c * RES + RES / 2, r * RES + RES / 2);
        } else if (!isIdle && (c + r) % 3 === 0) {
          /* Sparse cold-area dots — only shown when mouse is active */
          ctx.fillStyle = palette.dot;
          ctx.fillRect(c * RES + RES / 2 - 1, r * RES + RES / 2 - 1, 2, 2);
        }
      }
    }
    requestAnimationFrame(tick);
  }

  /* Mouse tracking on window (canvas has pointer-events:none) */
  window.addEventListener("mousemove", e => {
    mouse.x        = e.clientX;
    mouse.y        = e.clientY;
    mouse.active   = true;
    mouse.lastMoved = Date.now();
  });
  window.addEventListener("mouseleave", () => { mouse.active = false; });

  /* Debounced resize — prevents thrashing on rapid window resize */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  tick();
})();
