/* Training Hub service worker.
   Navigations are network-first, so uploading a new index.html rolls out by
   itself; everything else is cache-first, so the app opens offline. Old caches
   are dropped on activate rather than accumulating for ever. */
const CACHE = "training-hub-v13";

self.addEventListener("install", e => { self.skipWaiting(); });

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  /* Only same-origin traffic is cacheable. Caching the authenticated GETs to
     api.github.com handed a stale file sha back to the backup — every later
     push 409s — and could restore an out-of-date snapshot without saying so. */
  if (new URL(e.request.url).origin !== location.origin) return;

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    })));
});
