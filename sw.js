// The install handler takes care of precaching the resources we always need.

self.addEventListener('install', event => {
    console.log("instalando service worker...")
    event.waitUntil(
      caches.open("v1")
        .then(cache => cache.addAll(
            [
                './'
            ]
        ))
        .then(self.skipWaiting())
    );
  });

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = ["v1"];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
  });


  self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like those for Google Analytics.
    // console.log(event.request.url);
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open("v1").then(cache => {
            return fetch(event.request).then(response => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });