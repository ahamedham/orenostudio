/* ------------------------------------------------------------------
   ØRENO Studio — Service Worker
   NOTE: This is the BROWSER service worker for offline caching.
   It is NOT the Cloudflare Worker in /worker.js (that proxies the
   Claude API for the studio chatbot). Do not conflate the two.
------------------------------------------------------------------ */

const VERSION = 'oreno-v12.2';
const PRECACHE = `${VERSION}-precache`;
const RUNTIME  = `${VERSION}-runtime`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css?v=12.1',
  '/script.js',
  '/nav-universal.js',
  '/inquiry.html',
  '/testimonials.html',
  '/packages.html',
  '/assets/SVG/white_logo.svg',
  '/assets/SVG/black_logo.svg',
  '/site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== PRECACHE && k !== RUNTIME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache cross-origin (fonts.googleapis, cdn.jsdelivr, claude api, etc)
  if (url.origin !== location.origin) return;

  // Never cache the PHP mailer
  if (url.pathname.endsWith('/send-mail.php')) return;

  // HTML: network-first (so content updates immediately)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/index.html')))
    );
    return;
  }

  // Static assets: cache-first, runtime-cache on miss
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
