
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
            .open(PRECACHE).then((cache) => cache.addAll(FILES_TO_CACHE)).then(self.skipWaiting())
    );
});

