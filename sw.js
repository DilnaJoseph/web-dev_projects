const CACHE_NAME = 'kanban-shell-v1';
const ASSETS_TO_CACHE = [
  '/',               // index.html (ensure server serves index for /)
  '/index.html',
  '/style.css',
  '/script.js',
  '/plus-icon.png',
  '/trash-bin.png',
  '/background.png',
  '/dropdown-arrow.png',
  '/sw.js',
  '/manifest.json',
  '/logo.png'
];

// Install cache app shell
self.addEventListener('install', (event) => { // run once when SW is installed
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => { // download and cache all assets
        // If some assets fail to cache, still allow install
        console.warn('[SW] some assets failed to cache', err);
      });
    })
  );
});

// cleanup of old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)) //filter old caches and delete them
    ))
  );
  self.clients.claim();
});

// offline-first otherwise network fallback
self.addEventListener('fetch', (event) => { // whenever a fetch request is made
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);// string to URL object

  // trying cache first if same origin
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cacheRes => { // check if request is in cache
        if (cacheRes) {
          return cacheRes;
        }
        // if not cached try network and put a copy in cache 
        return fetch(event.request)
          .then(networkRes => {
            // Put a copy in cache for later
            return caches.open(CACHE_NAME).then(cache => {
              // clone stream before caching
              cache.put(event.request, networkRes.clone()).catch(() => {});
              return networkRes;
            });
          })
          .catch(() => {
            // fallback to serve root (index.html) from cache if available
            return caches.match('/index.html');
          });
      })
    );
    return;
  }

  // For cross-origin requests use network-first then fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
