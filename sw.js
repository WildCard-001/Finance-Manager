/* Finance Manager service worker: keeps the app available offline.
   Bump VERSION whenever you upload changed files. */
var VERSION = 'fm-v1';
var FILES = ['./', 'index.html', 'manifest.json', 'xlsx.full.min.js', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Same-origin files: answer from the cache at once, refresh the cache in the background.
   Sync requests to Google/Firebase are never cached. */
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  var key = req.mode === 'navigate' ? 'index.html' : req;
  e.respondWith(caches.open(VERSION).then(function (c) {
    return c.match(key, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.ok) c.put(key, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
