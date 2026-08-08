const CACHE_NAME = 'reezma-logo-creator-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Install Event: cache static shell assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: clear old cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: cache-first for static resources, network-first fallbacks
self.addEventListener('fetch', (e) => {
  // Avoid interception of browser extensions or non-HTTP calls
  if (!e.request.url.startsWith(self.location.origin) && !e.request.url.startsWith('https://fonts.')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(e.request).then((response) => {
        // Cache dynamic bundles and web fonts
        if (
          response.status === 200 && 
          (e.request.url.includes('/assets/') || 
           e.request.url.includes('fonts.googleapis.com') ||
           e.request.url.includes('fonts.gstatic.com'))
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback for html requests
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
