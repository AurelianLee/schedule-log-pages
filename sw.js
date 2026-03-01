// 轻量 service worker：缓存编辑页与总览，支持离线打开
const CACHE = 'schedule-log-v1';
const ASSETS = ['index.html', 'schedule_edit.html', 'schedule.html', 'manifest.json', 'icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (e) => {
  const u = e.request.url;
if (u.includes('schedule_edit') || u.includes('schedule.html') || u.includes('index.html') || u.includes('manifest') || u.includes('icon.svg')) {
    e.respondWith(
      caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      }))
    );
  }
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
