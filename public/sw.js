const CACHE = "duo-shell-v1";
const SHELL = ["/", "/manifest.webmanifest", "/duo-icon.svg"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => { const request = event.request; if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return; if (request.mode === "navigate") { event.respondWith(fetch(request).then(response => { const copy=response.clone(); caches.open(CACHE).then(cache => cache.put("/", copy)); return response; }).catch(() => caches.match("/") )); return; } if (SHELL.includes(new URL(request.url).pathname)) event.respondWith(caches.match(request).then(cached => cached || fetch(request))); });
