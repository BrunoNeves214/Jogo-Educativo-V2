/* Mundo Curioso — encaminhador por hash.
   Usar hash (em vez da History API) mantem a app funcional mesmo
   quando aberta directamente do disco, sem servidor. */
(function (MC) {
  'use strict';

  var routes = [];
  var current = null;
  var teardown = null;

  // pattern: '#/ilha/:id'
  function add(pattern, handler) {
    var names = [];
    var rx = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/:(\w+)/g, function (m, n) { names.push(n); return '([^/]+)'; });
    routes.push({ rx: new RegExp('^' + rx + '$'), names: names, handler: handler });
  }

  function parse(hash) {
    for (var i = 0; i < routes.length; i++) {
      var m = hash.match(routes[i].rx);
      if (m) {
        var params = {};
        routes[i].names.forEach(function (n, j) { params[n] = decodeURIComponent(m[j + 1]); });
        return { route: routes[i], params: params };
      }
    }
    return null;
  }

  function render() {
    var hash = window.location.hash || '#/';
    var found = parse(hash);
    if (!found) { window.location.hash = '#/'; return; }

    // limpa o que o ecra anterior deixou a correr
    MC.cancelTimers();
    MC.ui.stopRepeat();
    MC.levelCtx = null;
    MC.audio.shutUp();
    if (typeof teardown === 'function') { try { teardown(); } catch (e) {} }
    teardown = null;
    MC.ui.closeModal();

    var app = document.getElementById('app');
    MC.clear(app);
    current = hash;

    var result = found.route.handler(found.params, app);
    if (typeof result === 'function') teardown = result;
  }

  MC.go = function (hash) {
    if (window.location.hash === hash) render();
    else window.location.hash = hash;
  };

  MC.router = {
    add: add,
    render: render,
    start: function () {
      window.addEventListener('hashchange', render);
      if (!window.location.hash) window.location.hash = '#/';
      else render();
    },
    current: function () { return current; }
  };

})(window.MC);
