/* Finance Manager Local service worker: keeps this version available offline and picks up new versions automatically.
   When you change the app: raise "version" in version.json AND APP_VERSION in index.html (same number),
   and raise VERSION below. */
var VERSION = 'fml-v1';
var FILES = ['./', 'index.html', 'manifest.json', '../xlsx.full.min.js', '../icon-192.png', '../icon-512.png', '../apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('fml-v') === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function timeout(ms) { return new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); }); }

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  var path = url.pathname;

  /* version.json: always ask the network, never cache (it's how the app learns about updates). */
  if (/version\.json$/.test(path)) { e.respondWith(fetch(req, { cache: 'no-store' })); return; }

  /* The app page and sw: network first when online (so you always get the newest version),
     the saved copy when offline or the network is too slow. */
  var isPage = req.mode === 'navigate' || /\/$|index\.html$/.test(path);
  if (isPage) {
    e.respondWith(caches.open(VERSION).then(function (c) {
      return Promise.race([fetch(req, { cache: 'no-cache' }), timeout(4000)]).then(function (res) {
        if (res && res.ok) c.put('index.html', res.clone());
        return res;
      }).catch(function () {
        return c.match('index.html').then(function (hit) { return hit || fetch(req); });
      });
    }));
    return;
  }

  /* Everything else (Excel library, icons): saved copy at once, refreshed in the background. */
  e.respondWith(caches.open(VERSION).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.ok) c.put(req, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
