importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js');

const bibleChapterHandler = workbox.strategies.networkFirst({
  cacheName: 'bible-html',
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 50
    })
  ]
});

if (workbox) {
  /* Offline Google Analytics */
  workbox.googleAnalytics.initialize();

  workbox.precaching.precacheAndRoute([
    { url: '/bible/111/JHN.3', revision: '1' },
    { url: '/bible-offline', revision: '1' }
  ]);

  /* Bible Routes HTML */
  workbox.routing.registerRoute(
    /\/bible\/.+/,
    args => {
      return bibleChapterHandler.handle(args).then(response => {
        if (!response) {
          return caches.match('/bible-offline');
        }
        return response;
      })
    }
  )

  /* AMP Javascripts */
  workbox.routing.registerRoute(
    new RegExp('^https\:\/\/cdn\.ampproject\.org\/.*\.js$'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'amp-js'
    })
  )

  /* JSON API */
  workbox.routing.registerRoute(
    /\/json\/.+/,
    workbox.strategies.cacheFirst({
      cacheName: 'json-api',
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 Days
        })
      ]
    })
  );

  /* Images */
  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );
}
