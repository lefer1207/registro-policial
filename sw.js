const CACHE_NAME = 'registro-policial-v4';
const ASSETS = ['./index.html', './offline_test.html', './'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); });
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('supabase.co')) {
    e.respondWith(fetch(e.request).then((r) => { if (r.status === 200) { const cp = r.clone(); caches.open(CACHE_NAME).then((c) => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { if (res.status === 200) { const cp = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(e.request, cp)); } return res; })));
});