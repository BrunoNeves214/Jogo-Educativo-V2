/* Mundo Curioso — utilitarios base.
   Scripts classicos (sem modulos ES) para que o index.html tambem
   funcione quando aberto directamente do disco (file://). */
window.MC = window.MC || {};

(function (MC) {
  'use strict';

  /* --------- DOM --------- */

  // Constroi um elemento a partir de uma string de HTML.
  MC.node = function (html) {
    var t = document.createElement('template');
    t.innerHTML = String(html).trim();
    return t.content.firstElementChild;
  };

  // Constroi varios elementos irmaos a partir de uma string de HTML.
  MC.nodes = function (html) {
    var t = document.createElement('template');
    t.innerHTML = String(html).trim();
    return Array.prototype.slice.call(t.content.children);
  };

  MC.qs = function (sel, root) { return (root || document).querySelector(sel); };
  MC.qsa = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  MC.clear = function (el) { while (el && el.firstChild) el.removeChild(el.firstChild); return el; };

  // Escapa texto para interpolar com seguranca dentro de HTML.
  MC.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /* --------- eventos --------- */

  // Toque/clique com alvo generoso: dispara no pointerup se o dedo nao saiu do elemento.
  MC.tap = function (el, fn) {
    if (!el) return function () {};
    var handler = function (ev) {
      if (ev.type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
      if (ev.type === 'keydown') ev.preventDefault();
      fn(ev);
    };
    el.addEventListener('click', handler);
    if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
      el.setAttribute('tabindex', '0');
      if (!el.getAttribute('role')) el.setAttribute('role', 'button');
      el.addEventListener('keydown', handler);
    }
    return function () {
      el.removeEventListener('click', handler);
      el.removeEventListener('keydown', handler);
    };
  };

  /* --------- numeros e listas --------- */

  MC.rnd = function (n) { return Math.floor(Math.random() * n); };

  MC.pick = function (arr) { return arr[MC.rnd(arr.length)]; };

  MC.shuffle = function (arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = MC.rnd(i + 1); t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  // n elementos distintos, opcionalmente excluindo alguns.
  MC.sample = function (arr, n, exclude) {
    var pool = arr;
    if (exclude && exclude.length) {
      pool = arr.filter(function (x) { return exclude.indexOf(x) === -1; });
    }
    return MC.shuffle(pool).slice(0, n);
  };

  MC.range = function (a, b) {
    var out = [], i;
    if (b === undefined) { b = a; a = 0; }
    for (i = a; i < b; i++) out.push(i);
    return out;
  };

  MC.clamp = function (v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); };

  MC.dist = function (ax, ay, bx, by) {
    var dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /* --------- tempo --------- */

  var timers = [];

  // setTimeout que fica registado, para se poder cancelar tudo ao trocar de ecra.
  MC.later = function (fn, ms) {
    var id = setTimeout(function () {
      timers = timers.filter(function (t) { return t !== id; });
      fn();
    }, ms);
    timers.push(id);
    return id;
  };

  MC.wait = function (ms) {
    return new Promise(function (res) { MC.later(res, ms); });
  };

  MC.cancelTimers = function () {
    timers.forEach(clearTimeout);
    timers = [];
  };

  /* --------- geometria de ecra --------- */

  MC.center = function (el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r };
  };

  MC.pointOf = function (ev) {
    if (ev.touches && ev.touches[0]) return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    if (ev.changedTouches && ev.changedTouches[0]) {
      return { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY };
    }
    return { x: ev.clientX, y: ev.clientY };
  };

})(window.MC);
