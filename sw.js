const CACHE_NAME = 'registro-policial-v1';
const ASSETS = [
  './offline_test.html',
  './'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si tenemos red, actualizamos la cache para la proxima vez
        if (response && response.status === 200) {
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // Si no hay red, servimos desde cache
        return caches.match(event.request);
      })
  );
});