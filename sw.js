/**
 * Service worker for the Student Daily Payment PWA.
 *
 * Minimal, safe design:
 *   - Caches the app shell (HTML, icons, manifest) for offline availability
 *     of the wrapper itself.
 *   - NEVER caches Apps Script responses — the real app always talks to the
 *     live server.
 *   - Required for Chrome to consider the app installable.
 */

const SHELL_CACHE = 'sdps-shell-v1';
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Install — cache the shell
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(function (cache) { return cache.addAll(SHELL_ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

// Activate — clean old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== SHELL_CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// Fetch — serve shell from cache, everything else from network
self.addEventListener('fetch', function (event) {
  const req = event.request;

  // Only handle same-origin GET requests
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Cache-first for shell assets
  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        // Cache newly fetched same-origin shell assets
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // Offline fallback — serve cached index if the request is a navigation
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});