/* Minimal Service Worker to enable PWA installability
   - No caching strategies to keep behavior simple and safe on GitHub Pages
*/
self.addEventListener('install', (event) => {
  // Activate immediately on first load
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control without reload
  event.waitUntil(self.clients.claim());
});

// Optional: pass-through fetch (no caching)
self.addEventListener('fetch', () => {});
