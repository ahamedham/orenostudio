/* =====================================================
   ØRENO — verify.js
   Email-verification modal controller.
   Public API:  window.OrenoVerify.verify(email) → Promise<token>
   Resolves with an HMAC token to include as `verify_token` in form POST.
   Rejects (with undefined) if the user cancels.
===================================================== */
(function () {
  'use strict';

  const ENDPOINT = '/send-code.php';
  const RESEND_COOLDOWN = 45; // seconds

  let rootEl = null;
  let activePromise = null;

  /* ── Build DOM once, lazily ── */
  function ensureRoot() {
    if (rootEl) return rootEl;
    const r = document.createElement('div');
    r.className = 'ov-root';
    r.setAttribute('role', 'dialog');
    r.setAttribute('aria-modal', 'true');
    r.setAttribute('aria-labelledby', 'ov-title');
    r.innerHTML = `
      <div class="ov-backdrop" data-ov-close></div>
      <div class="ov-card">
        <button class="ov-close" type="button" aria-label="Close" data-ov-close>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <p class="ov-kicker">Verify email</p>
        <h3 class="ov-title" id="ov-title">Enter the 6-digit code</h3>
        <p class="ov-sub">We sent it to <strong class="ov-email"></strong>. It expires in 10 minutes.</p>

        <div class="ov-digits" role="group" aria-label="6-digit verification code">
          ${Array.from({length: 6}).map((_, i) =>
            `<input class="ov-digit" type="text" inputmode="numeric" maxlength="1" autocomplete="one-time-code" aria-label="Digit ${i+1}" data-ov-i="${i}">`
          ).join('')}
        </div>

        <p class="ov-status" role="status" aria-live="polite"></p>

        <div class="ov-actions">
          <button class="ov-btn ov-btn-primary" type="button" data-ov-submit disabled>Verify & continue</button>
          <button class="ov-btn ov-btn-ghost"   type="button" data-ov-resend>Resend code</button>
        </div>
      </div>
    `;
    document.body.appendChild(r);
    rootEl = r;

    /* Close handlers */
    r.addEventListener('click', e => {
      if (e.target.closest('[data-ov-close]')) cancel();
    });
    document.addEventListener('keydown', e => {
      if (!r.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    });

    /* Digit inputs: auto-advance + paste + backspace */
    const digits = r.querySelectorAll('.ov-digit');
    digits.forEach((input, i) => {
      input.addEventListener('input', e => {
        const v = input.value.replace(/\D/g, '');
        input.value = v.slice(-1);
        input.classList.toggle('is-filled', !!input.value);
        r.classList.remove('is-error');
        setStatus('', '');
        if (input.value && i < digits.length - 1) digits[i + 1].focus();
        updateSubmitState();
        if (getCode().length === 6) doVerify();
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !input.value && i > 0) {
          digits[i - 1].focus();
          digits[i - 1].value = '';
          digits[i - 1].classList.remove('is-filled');
          updateSubmitState();
          e.preventDefault();
        }
        if (e.key === 'ArrowLeft' && i > 0) digits[i - 1].focus();
        if (e.key === 'ArrowRight' && i < digits.length - 1) digits[i + 1].focus();
      });
      input.addEventListener('paste', e => {
        const txt = (e.clipboardData || window.clipboardData).getData('text') || '';
        const clean = txt.replace(/\D/g, '').slice(0, 6);
        if (!clean) return;
        e.preventDefault();
        digits.forEach((d, j) => {
          d.value = clean[j] || '';
          d.classList.toggle('is-filled', !!d.value);
        });
        const nextIdx = Math.min(clean.length, digits.length - 1);
        digits[nextIdx].focus();
        updateSubmitState();
        if (clean.length === 6) doVerify();
      });
    });

    r.querySelector('[data-ov-submit]').addEventListener('click', doVerify);
    r.querySelector('[data-ov-resend]').addEventListener('click', doResend);

    return r;
  }

  function getCode() {
    return Array.from(rootEl.querySelectorAll('.ov-digit')).map(i => i.value).join('');
  }
  function clearDigits() {
    rootEl.querySelectorAll('.ov-digit').forEach(d => {
      d.value = ''; d.classList.remove('is-filled');
    });
    updateSubmitState();
  }
  function updateSubmitState() {
    const btn = rootEl.querySelector('[data-ov-submit]');
    btn.disabled = getCode().length !== 6;
  }
  function setStatus(msg, kind) {
    const el = rootEl.querySelector('.ov-status');
    el.textContent = msg;
    el.classList.remove('is-error', 'is-ok');
    if (kind) el.classList.add('is-' + kind);
  }
  function setBusy(btnSel, busy, label) {
    const btn = rootEl.querySelector(btnSel);
    if (busy) {
      btn.dataset.origLabel = btn.dataset.origLabel || btn.innerHTML;
      btn.innerHTML = `<span class="ov-spinner"></span>${label || 'Working…'}`;
      btn.disabled = true;
    } else {
      if (btn.dataset.origLabel) btn.innerHTML = btn.dataset.origLabel;
      updateSubmitState();
    }
  }

  let currentEmail = '';
  let resendTimer = null;

  function startResendCooldown() {
    const btn = rootEl.querySelector('[data-ov-resend]');
    let t = RESEND_COOLDOWN;
    btn.disabled = true;
    btn.textContent = `Resend code (${t}s)`;
    clearInterval(resendTimer);
    resendTimer = setInterval(() => {
      t--;
      if (t <= 0) {
        clearInterval(resendTimer);
        btn.disabled = false;
        btn.textContent = 'Resend code';
      } else {
        btn.textContent = `Resend code (${t}s)`;
      }
    }, 1000);
  }

  async function doSendInitial(email) {
    setStatus('Sending code…', '');
    try {
      const fd = new FormData();
      fd.append('action', 'send');
      fd.append('email', email);
      const res = await fetch(ENDPOINT, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      if (!data.ok) {
        setStatus(data.error || 'Could not send code', 'error');
        return false;
      }
      setStatus('Code sent. Check your inbox (and spam).', 'ok');
      startResendCooldown();
      return true;
    } catch {
      setStatus('Network error — try again', 'error');
      return false;
    }
  }

  async function doResend() {
    if (!currentEmail) return;
    setBusy('[data-ov-resend]', true, 'Sending…');
    clearDigits();
    rootEl.classList.remove('is-error');
    const ok = await doSendInitial(currentEmail);
    setBusy('[data-ov-resend]', false);
    const btn = rootEl.querySelector('[data-ov-resend]');
    if (ok) {
      /* cooldown already started */
      rootEl.querySelector('.ov-digit').focus();
    } else {
      btn.disabled = false;
      btn.textContent = 'Resend code';
    }
  }

  async function doVerify() {
    const code = getCode();
    if (code.length !== 6) return;
    setBusy('[data-ov-submit]', true, 'Verifying…');
    setStatus('', '');
    try {
      const fd = new FormData();
      fd.append('action', 'verify');
      fd.append('email', currentEmail);
      fd.append('code', code);
      const res = await fetch(ENDPOINT, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
      const data = await res.json();
      if (!data.ok || !data.token) {
        rootEl.classList.add('is-error');
        setStatus(data.error || 'Incorrect code', 'error');
        setBusy('[data-ov-submit]', false);
        return;
      }
      setStatus('Verified — sending your message…', 'ok');
      rootEl.classList.add('is-done');
      setTimeout(() => resolveAndClose(data.token), 380);
    } catch {
      rootEl.classList.add('is-error');
      setStatus('Network error — try again', 'error');
      setBusy('[data-ov-submit]', false);
    }
  }

  function open() {
    rootEl.classList.add('is-open');
    document.body.classList.add('ov-modal-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    rootEl.classList.remove('is-open', 'is-error', 'is-done');
    document.body.classList.remove('ov-modal-open');
    document.body.style.overflow = '';
    clearInterval(resendTimer);
    clearDigits();
    setStatus('', '');
    setBusy('[data-ov-submit]', false);
    const rbtn = rootEl.querySelector('[data-ov-resend]');
    rbtn.disabled = false; rbtn.textContent = 'Resend code';
  }

  function cancel() {
    if (!activePromise) return;
    const { reject } = activePromise;
    activePromise = null;
    close();
    reject(undefined);
  }
  function resolveAndClose(token) {
    if (!activePromise) return;
    const { resolve } = activePromise;
    activePromise = null;
    close();
    resolve(token);
  }

  /* ── Public API ── */
  async function verify(email) {
    if (!email) throw new Error('email required');
    ensureRoot();
    if (activePromise) activePromise.reject(undefined);

    currentEmail = email;
    rootEl.querySelector('.ov-email').textContent = email;
    clearDigits();
    setStatus('', '');
    rootEl.classList.remove('is-error', 'is-done');
    open();

    /* Send initial code first, THEN focus */
    doSendInitial(email).then(ok => {
      if (ok) rootEl.querySelector('.ov-digit').focus();
    });

    return new Promise((resolve, reject) => {
      activePromise = { resolve, reject };
    });
  }

  window.OrenoVerify = { verify };
})();
