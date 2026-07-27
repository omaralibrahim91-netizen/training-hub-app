/* Training Hub — service worker.
   Network-first with cache fallback: online you always get the newest
   version (uploads to the repo roll out by themselves), offline the app
   still opens from cache. */
const CACHE = "training-hub-v1";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(["./"])).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  /* only same-origin requests are cached; API calls (GitHub backup) pass through */
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match("./"))
    )
  );
});
