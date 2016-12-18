/*
  2016-12-16 update:
  After realizing that the cache first, then update
  through network methods of service workers always 
  get the same file from the network (if available),
  I have decided to use the static method, in the hope
  that the service worker will ONLY check for an updated 
  version of itself over the network.

  The bugger for this is that without loads of individual
  caches for differnt files, say frequently updated in one
  and rarely updated in another, or a cache for each file, 
  the entire app's code will have to be re-downloaded on
  every update.

  However, for these tiny little games which will be
  infrequently updated, I imagine total network use would
  be less for a regular user.

  Bigger things like my webtop will have the multi-cache
  method, though even my webtop (when compressed) is only
  about 600KB!

  but yeah, it is the difference of 600KB each page reload
  and 600KB once, and maybe 64KB without a version change

*/
//This version DOES require a version number, so I'll do date.
var CACHE = 'MemGuess-2016-12-18';
//https://serviceworke.rs/strategy-cache-only_service-worker_doc.html
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE).then(function(cache) {
    return cache.addAll(['./', './appmanifest', './index.html', './initialize.js', './inputs.js', './loader.js', './main.css', './main.js', './storage.js'//do I not need the favicons?!?
    ]).then(function() {
      console.log('app updated. waiting to activate');
      /*
          This would be the ideal place to let the user
          know that the app has an update, but I cannot
          see how to do that, because this new version of
          the service worker is not active, and has no clients.
        */
    });
  }));
});
this.addEventListener('fetch', function(event) {
  //never bother checking online
  event.respondWith(caches.match(event.request));
});
/*
self.addEventListener('fetch', function(evt) {
  evt.respondWith(function(request) {
    return caches.open(CACHE).then(function (cache) {
      return cache.match(request).then(function (matching) {
        return matching || Promise.reject('no-match');
      });
    });
  });
});
*/
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (cacheName !== CACHE) {
        return caches.delete(cacheName);
      }
    })).then(function() {
      console.log('new version active.');
      setTimeout(function() {
        sendMessage(self);
      }, 3000);
    });
  }));
})
function sendMessage(me) {
  me.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      client.postMessage('updated');
    });
  });
}
