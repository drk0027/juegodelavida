/* const CACHE_NAME = 'offline';
const OFFLINE_URL = 'index.html'; */

const nombre_cache = "JdlV"
const archivos_en_cache = [
  'index.html',
  'index.js',
  'favicon.ico',
  'manifest.json'
]

/**
 * # Listener para el evento de instalacion
 * 
 * 
 */
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(nombre_cache);//revisa que archivos estan en el cache
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(archivos_en_cache);//agrega los archivos en linea al cache
  })());
});

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    const cache = await caches.open(nombre_cache);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});


/* https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers */