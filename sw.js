/**
 * Offline Service Worker for SNC Guided 2.0 PWA
 * Cache-busting v8 for Draft Resume & Holistic 6-Week Progress Tracker
 */

const CACHE_NAME = 'snc-workout-v8';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css?v=7',
  './js/app.js',
  './js/programData.js',
  './js/progressiveEngine.js',
  './js/excelExporter.js',
  './js/nutritionEngine.js',
  './js/aiVisionEstimator.js',
  './js/whoopTracker.js',
  './js/workoutEngine.js',
  './js/coachUpdater.js',
  './js/storage.js',
  './manifest.json',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell assets v8');
      return cache.addAll(ASSETS_TO_CACHE);
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
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
