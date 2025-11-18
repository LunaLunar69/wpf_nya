const CACHE_NAME = 'v1_cache_IrvingLuna_PWA';

var urlsToCache = [
    '/',
    'css/styles.css',
    'img/1.jpg',
    'img/az.jpg',
    'img/bl.jpg',
    'img/emerald.webp',
    'fuzesito.jpeg',
    'iconos/1.png',
    'iconos/2.png',
    'iconos/3.png',
    'iconos/4.png',
    'iconos/5.png',
    'iconos/6.png',
    'iconos/facebook.png',
    'iconos/instagram.png',
    'iconos/twitter.png',
    'img/lol/16.png',
    'img/lol/24.png',
    'img/lol/32.png',
    'img/lol/64.png',
    'img/lol/128.png',
    'img/lol/256.png',
    'img/lol/384.png',
    'img/lol/512.png',
    'img/lol/1024.png'
]

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting());
            })
            .catch((err) => console.log('Falló el registro de cache', err))
    );
});

self.addEventListener('activate', (e) => {
    const cacheWhitelist = [CACHE_NAME];

    e.waitUntil(
        caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then((res) => {
                if (res) {
                    return res;
                }
                return fetch(e.request);
            })
    );
})