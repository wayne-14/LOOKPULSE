/**
 * LOOKPULSE PWA Service Worker
 * Caches core app shell and offline assets
 */

const CACHE_NAME = 'lookpulse-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/app-icon.svg',
  '/scripts/main.js',
  '/scripts/community.js',
  '/scripts/search.js',
  '/scripts/image-search.js',
  '/data/outfits.json',
  '/data/creators.json',
  '/data/products.json',
  '/pages/explore.html',
  '/pages/search.html',
  '/pages/outfit-detail.html',
  '/pages/upload.html',
  '/pages/saved.html',
  '/pages/notifications.html',
  '/pages/user-profile.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Cache addAll error during sw install:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network First with Cache Fallback strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
