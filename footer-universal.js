/* =====================================================
   ØRENO — footer-universal.js  v1.0
   Injects the Reach Us (connect) section + full footer
   into sub-pages (inquiry.html, testimonials.html).
   Guard: skips index.html which has them inline.
===================================================== */
(function () {
  /* Skip index.html — it has its own footer in the horizontal track */
  if (document.querySelector(".site-footer")) return;

  const isDarkPage = document.body.id === "page-inquiry";

  /* ── INJECT CSS OVERRIDES ── */
  const style = document.createElement("style");
  style.textContent = `
    /* Universal connect + footer layout overrides (vertical scroll pages) */
    .universal-connect {
      display: block;
      padding: clamp(4rem,8vh,7rem) clamp(1.6rem,7vw,6rem);
      width: 100%;
      box-sizing: border-box;
    }
    .universal-connect .connect-inner {
      max-width: 900px;
      margin: 0 auto;
    }
    .universal-connect .section-tag {
      margin-bottom: 1.2rem;
    }
    .universal-connect .section-h {
      margin-bottom: clamp(1.4rem,3vh,2.2rem);
    }
    .universal-footer {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }
    .universal-footer .footer-inner {
      max-width: 900px;
      margin: 0 auto;
    }
    /* On mobile: 2-column connect grid */
    @media (max-width: 768px) {
      .universal-connect .connect-row--4 {
        grid-template-columns: repeat(2,1fr);
      }
      .universal-connect .connect-row--4 .clip-box:nth-child(2) {
        border-right: 1px solid rgba(245,243,238,0.1);
      }
      .universal-connect .clip-overlay { display: none; }
      .universal-connect .clip-box { height: clamp(70px,22vw,110px); }
    }
    ${isDarkPage ? `
    /* inquiry.html (dark page) needs no overrides — var(--c-fg) is light cream there.
       Force the connect/footer to use correct dark bg colors. */
    .universal-connect { background: #0A0A0A !important; }
    .universal-footer  { background: #0A0A0A !important; }
    ` : ""}
  `;
  document.head.appendChild(style);

  /* ── BUILD HTML ── */
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <!-- ── REACH US ── -->
    <section class="section-connect universal-connect" aria-labelledby="u-connect-heading">
      <div class="connect-inner">

        <div class="connect-header">
          <p class="section-tag">Reach Us</p>
          <h2 class="section-h" id="u-connect-heading">Every way<br>to find us.</h2>
        </div>

        <div class="connect-grid">

          <div class="connect-row connect-row--2">
            <a href="mailto:contact@oreno.lk" class="clip-box" aria-label="Email">
              <svg class="clip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span class="clip-label">Email</span>
              <div class="clip-overlay" aria-hidden="true">
                <svg class="clip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span class="clip-label">contact@oreno.lk</span>
              </div>
            </a>
            <a href="https://wa.me/94729537427" class="clip-box" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
              <svg class="clip-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span class="clip-label">WhatsApp</span>
              <div class="clip-overlay" aria-hidden="true">
                <svg class="clip-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span class="clip-label">+94 72 953 7427</span>
              </div>
            </a>
          </div>

          <div class="connect-row connect-row--4">
            <a href="https://www.instagram.com/orenostudio/" class="clip-box" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg class="clip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
              <span class="clip-label">Instagram</span>
              <div class="clip-overlay" aria-hidden="true">
                <svg class="clip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
                <span class="clip-label">@orenostudio</span>
              </div>
            </a>
            <a href="https://www.facebook.com/orenostudio" class="clip-box" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg class="clip-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span class="clip-label">Facebook</span>
              <div class="clip-overlay" aria-hidden="true">
                <svg class="clip-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span class="clip-label">/orenostudio</span>
              </div>
            </a>
            <a href="https://www.tiktok.com/@orenostudio" class="clip-box" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <svg class="clip-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.16 8.16 0 0 0 4.77 1.52V7.13a4.85 4.85 0 0 1-1-.44z"/></svg>
              <span class="clip-label">TikTok</span>
              <div class="clip-overlay" aria-hidden="true">
                <svg class="clip-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.16 8.16 0 0 0 4.77 1.52V7.13a4.85 4.85 0 0 1-1-.44z"/></svg>
                <span class="clip-label">@orenostudio</span>
              </div>
            </a>
            <a href="https://www.linkedin.com/company/orenostudio" class="clip-box" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg class="clip-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <span class="clip-label">LinkedIn</span>
              <div class="clip-overlay" aria-hidden="true">
                <svg class="clip-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span class="clip-label">/orenostudio</span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="site-footer universal-footer" role="contentinfo">
      <div class="footer-wordmark" aria-hidden="true">ØRENO</div>
      <div class="footer-inner">
        <span class="footer-mark">© 2026 ØRENO<br>Brand Architecture</span>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="/#studio">Studio</a>
          <a href="/#work">Work</a>
          <a href="/#testimonials">Testimonials</a>
          <a href="/portfolio.html">Portfolio</a>
          <a href="/inquiry">Inquiry</a>
        </nav>

        <!-- Connect hover-reveal button -->
        <div class="footer-connect">
          <div class="footer-connect__wrap" id="u-footer-connect-wrap">
            <button class="footer-connect__label" aria-label="Show social links" aria-expanded="false">Connect</button>
            <div class="footer-connect__icons" aria-hidden="true">
              <a href="https://www.instagram.com/orenostudio/" target="_blank" rel="noopener noreferrer" class="footer-connect__icon" aria-label="Instagram" style="--i:0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://www.facebook.com/orenostudio" target="_blank" rel="noopener noreferrer" class="footer-connect__icon" aria-label="Facebook" style="--i:1">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@orenostudio" target="_blank" rel="noopener noreferrer" class="footer-connect__icon" aria-label="TikTok" style="--i:2">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.16 8.16 0 0 0 4.77 1.52V7.13a4.85 4.85 0 0 1-1-.44z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/orenostudio" target="_blank" rel="noopener noreferrer" class="footer-connect__icon" aria-label="LinkedIn" style="--i:3">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <a href="/" class="footer-back" aria-label="Back to ØRENO">
          ← Back to ØRENO
        </a>
      </div>
    </footer>
  `;

  document.body.appendChild(wrapper);

  /* ── INITIALIZE CLIP-BOX HOVER ANIMATIONS ── */
  if (window.matchMedia("(hover:hover) and (pointer:fine)").matches && typeof gsap !== "undefined") {
    const NO_CLIP      = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
    const BOTTOM_RIGHT = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
    const TOP_LEFT     = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";
    const TOP_RIGHT    = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
    const BOTTOM_LEFT  = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";

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

    wrapper.querySelectorAll(".clip-box").forEach(box => {
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
  }

  /* ── INITIALIZE FOOTER CONNECT TOGGLE (touch) ── */
  (function () {
    const wrap = document.getElementById("u-footer-connect-wrap");
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

    document.addEventListener("click", e => {
      if (!isTouchDevice()) return;
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  })();

  /* ── INITIALIZE FLIPLINK on footer nav ── */
  if (typeof gsap !== "undefined") {
    const DURATION = 0.22, STAGGER = 0.018;
    wrapper.querySelectorAll(".footer-links a").forEach(link => {
      const text = link.textContent.trim();
      if (!text) return;
      link.setAttribute("aria-label", text);

      const w   = document.createElement("span");
      w.style.cssText = "display:inline-block; position:relative;";
      const top = document.createElement("span");
      top.style.cssText = "display:inline-block;";
      const bot = document.createElement("span");
      bot.className = "flip-bot-row";
      bot.setAttribute("aria-hidden", "true");

      [...text].forEach(ch => {
        const c = ch === " " ? "\u00a0" : ch;
        const t = document.createElement("span"); t.className = "flip-ch"; t.textContent = c;
        const b = document.createElement("span"); b.className = "flip-ch"; b.textContent = c;
        top.appendChild(t); bot.appendChild(b);
      });

      w.appendChild(top); w.appendChild(bot);
      link.textContent = "";
      link.appendChild(w);

      const topChars = [...top.querySelectorAll(".flip-ch")];
      const botChars = [...bot.querySelectorAll(".flip-ch")];

      link.addEventListener("mouseenter", () => {
        gsap.to(topChars, { yPercent: -100, duration: DURATION, ease: "power2.inOut", stagger: STAGGER });
        gsap.fromTo(botChars, { yPercent: 0 }, { yPercent: -100, duration: DURATION, ease: "power2.inOut", stagger: STAGGER });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to(topChars, { yPercent: 0, duration: DURATION, ease: "power2.inOut", stagger: STAGGER });
        gsap.to(botChars, { yPercent: 0, duration: DURATION, ease: "power2.inOut", stagger: STAGGER });
      });
    });
  }

  /* ── ANIMATE IN ON SCROLL (IntersectionObserver) ── */
  if (typeof gsap !== "undefined") {
    const connectSection = wrapper.querySelector(".universal-connect");
    const footerSection  = wrapper.querySelector(".universal-footer");

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el === connectSection) {
          const tag  = el.querySelector(".section-tag");
          const h    = el.querySelector(".section-h");
          const grid = el.querySelector(".connect-grid");
          if (tag)  gsap.fromTo(tag,  { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
          if (h)    gsap.fromTo(h,    { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", delay: 0.12 });
          if (grid) gsap.fromTo(grid, { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.9,  ease: "power3.out", delay: 0.32 });
        } else if (el === footerSection) {
          const wm = el.querySelector(".footer-wordmark");
          const fi = el.querySelector(".footer-inner");
          if (wm) gsap.fromTo(wm, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" });
          if (fi) gsap.fromTo(fi, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.18 });
        }
        io.unobserve(el);
      });
    }, { threshold: 0.15 });

    if (connectSection) io.observe(connectSection);
    if (footerSection)  io.observe(footerSection);
  }

})();
