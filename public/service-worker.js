
const FILES_TO_CACHE = [
    '/',
    '/index.js',
    '/styles.css',
    '/db.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

const PRECACHE = 'precache-test-v1';
const RUNTIME = 'runtime';

// Install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE).then((cache) => cache.addAll(FILES_TO_CACHE)).then(self.skipWaiting()));
});

// Activate to clear old cache
self.addEventListener('activate', (event) => {
    const current_cache = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then((cacheName) => {
            return cacheName.filter((cache_name) => !current_cache.includes(cache_name));
        }).then((cacheDelete) => {
            return Promise.all(
                cacheDelete.map((cache_delete) => {
                    return caches.delete(cache_delete);
                }));
        }).then(() => self.clients.claim()));
});


