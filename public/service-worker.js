
const FILES_TO_CACHE = [
    '/',
    '/index.js',
    '/styles.css',
    '/db.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

const PRECACHE = 'precache-v2';
const RUNTIME = 'runtime';

// Install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE).then((cache) => cache.addAll(FILES_TO_CACHE)).then(self.skipWaiting()));
});

// Activate to clear old cache
self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        }).then((cachesToDelete) => {
            return Promise.all(
                cachesToDelete.map((cacheToDelete) => {
                    return caches.delete(cacheToDelete);
                }));
        }).then(() => self.clients.claim()));
});

// Fetch
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            caches.open(RUNTIME).then((cache) => {
                return fetch(event.request).then(response => {
                    // Stores cache
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone())
                    }
                    return response;
                }).catch(err => {
                    // If request fails, pulls from cache
                    return cache.match(event.request);
                });
            }).catch(err => console.log(err))
        ); return;
    }
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request).then(function (response) {
                if (response) {
                    return response;
                } else if (event.request.headers.get('accept').includes('text/html')) {
                    // Returns cached homepage
                    return caches.match('/');
                }
            })
        })
    )
});


