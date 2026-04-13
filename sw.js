var CACHE_NAME = 'learning-world-v5';
var urlsToCache = [
    './',
    './index.html',
    './phonics.html',
    './matching.html',
    './sound-safari.html',
    './numbers.html',
    './vocabulary.html',
    './games.html',
    './odd-one-out.html',
    './css/style.css',
    './css/home.css',
    './css/phonics.css',
    './css/matching.css',
    './css/sound-safari.css',
    './css/numbers.css',
    './css/vocabulary.css',
    './css/odd-one-out.css',
    './js/app.js',
    './js/speech.js',
    './js/home.js',
    './js/phonics.js',
    './js/matching.js',
    './js/sound-safari.js',
    './js/numbers.js',
    './js/vocabulary.js',
    './js/odd-one-out.js',
    './audio/manifest.json',
    './manifest.json'
];

// Install
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Caching app files');
                return cache.addAll(urlsToCache);
            })
    );
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Fetch - Network first, fallback to cache
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
            .then(function(response) {
                // Cache the new response
                if (response.status === 200) {
                    var responseClone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(function() {
                // Network failed, try cache
                return caches.match(event.request);
            })
    );
});

// Activate - clean old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return key !== CACHE_NAME;
                }).map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});