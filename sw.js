/* Mundo Curioso — service worker.

   Estrategia: network-first com recurso a cache.
   Quando ha rede, ganha sempre a versao do servidor (assim, ao editares um
   ficheiro, a alteracao aparece no recarregamento seguinte sem truques).
   Quando nao ha rede, serve o que esta em cache, por isso a app continua
   a funcionar offline depois da primeira visita. */
var VERSION = 'mundo-curioso-v4';

var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/app.css',
  './assets/js/core/util.js',
  './assets/js/core/i18n.js',
  './assets/js/core/store.js',
  './assets/js/core/audio.js',
  './assets/js/core/art.js',
  './assets/js/core/islands.js',
  './assets/js/core/data.js',
  './assets/js/core/ui.js',
  './assets/js/core/drag.js',
  './assets/js/core/router.js',
  './assets/js/games/letras.js',
  './assets/js/games/cores.js',
  './assets/js/games/animais.js',
  './assets/js/games/logica.js',
  './assets/js/games/vocabulario.js',
  './assets/js/games/matematica.js',
  './assets/js/games/motricidade.js',
  './assets/js/games/rotinas.js',
  './assets/js/games/musica.js',
  './assets/js/app.js',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', function (ev) {
  ev.waitUntil(
    caches.open(VERSION).then(function (c) {
      return c.addAll(ASSETS);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (ev) {
  ev.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== VERSION) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (ev) {
  var req = ev.request;
  if (req.method !== 'GET') return;

  ev.respondWith(
    fetch(req).then(function (res) {
      // guarda uma copia dos recursos proprios para a proxima vez sem rede
      if (res && res.ok && req.url.indexOf(self.location.origin) === 0) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'offline' });
      });
    })
  );
});
