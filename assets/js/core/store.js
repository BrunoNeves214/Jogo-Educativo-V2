/* Mundo Curioso — definicoes e progresso, guardados apenas neste aparelho.
   Nada sai do dispositivo: sem contas, sem servidores, sem analytics. */
(function (MC) {
  'use strict';

  var KEY = 'mundo-curioso.v1';

  var DEFAULTS = {
    name: '',
    voice: true,
    voiceName: '',   // voz escolhida na area dos pais ('' = escolha automatica)
    repeat: true,    // repete a instrucao se a crianca ficar parada
    sfx: true,
    music: false,
    breaks: true,
    breakMinutes: 15,
    allLevels: false, // os pais podem abrir todas as fases de uma vez
    levels: {},      // { idDoJogo: { u: faseDesbloqueada, c: faseActual, d: [fases concluidas] } }
    stickers: [],    // ids de autocolantes ganhos
    plays: {}        // { idDoJogo: vezesTerminado }
  };

  var state = null;

  function load() {
    var raw = null;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { raw = null; }
    var parsed = {};
    if (raw) { try { parsed = JSON.parse(raw) || {}; } catch (e) { parsed = {}; } }
    state = {};
    Object.keys(DEFAULTS).forEach(function (k) {
      state[k] = parsed[k] === undefined ? DEFAULTS[k] : parsed[k];
    });
    // objectos aninhados podem vir corrompidos de uma versao antiga
    if (typeof state.levels !== 'object' || !state.levels) state.levels = {};
    if (typeof state.plays !== 'object' || !state.plays) state.plays = {};
    if (!Array.isArray(state.stickers)) state.stickers = [];
    return state;
  }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* modo privado */ }
  }

  function rec(gameId) {
    if (!state) load();
    var r = state.levels[gameId];
    if (!r || typeof r !== 'object') r = state.levels[gameId] = { u: 1, c: 1, d: [] };
    if (!Array.isArray(r.d)) r.d = [];
    return r;
  }

  var Store = {
    get: function (k) {
      if (!state) load();
      return state[k];
    },
    set: function (k, v) {
      if (!state) load();
      state[k] = v;
      save();
      return v;
    },
    all: function () { if (!state) load(); return state; },

    /* ---- fases ---- */
    unlockedLevel: function (gameId, total) {
      if (Store.get('allLevels')) return total;
      return Math.min(total, rec(gameId).u);
    },
    currentLevel: function (gameId, total) {
      var r = rec(gameId);
      var max = Store.unlockedLevel(gameId, total);
      return Math.max(1, Math.min(r.c || 1, max));
    },
    setLevel: function (gameId, n) {
      rec(gameId).c = n;
      save();
    },
    isDone: function (gameId, n) { return rec(gameId).d.indexOf(n) !== -1; },
    doneCount: function (gameId) { return rec(gameId).d.length; },
    // regista a fase n como feita e abre a seguinte
    completeLevel: function (gameId, n, total) {
      var r = rec(gameId);
      if (r.d.indexOf(n) === -1) r.d.push(n);
      if (n < total && r.u < n + 1) r.u = n + 1;
      state.plays[gameId] = (state.plays[gameId] || 0) + 1;
      save();
    },

    /* ---- estrelas: derivadas das fases concluidas (0 a 3) ---- */
    starsOf: function (gameId) {
      var g = MC.games && MC.games[gameId];
      var total = g && g.levels ? g.levels.length : 1;
      var done = rec(gameId).d.length;
      if (!done) return 0;
      return Math.max(1, Math.round(done / total * 3));
    },
    totalStars: function () {
      if (!state) load();
      return Object.keys(state.levels).reduce(function (n, k) { return n + Store.starsOf(k); }, 0);
    },

    /* ---- autocolantes ---- */
    hasSticker: function (id) {
      if (!state) load();
      return state.stickers.indexOf(id) !== -1;
    },
    addSticker: function (id) {
      if (!state) load();
      if (state.stickers.indexOf(id) === -1) {
        state.stickers.push(id);
        save();
        return true; // novo
      }
      return false;
    },

    reset: function () {
      if (!state) load();
      state.levels = {}; state.stickers = []; state.plays = {};
      save();
    }
  };

  load();
  MC.store = Store;

  /* ---- cronometro de sessao para a sugestao de pausa ---- */
  var sessionStart = Date.now();
  MC.session = {
    minutes: function () { return Math.floor((Date.now() - sessionStart) / 60000); },
    restart: function () { sessionStart = Date.now(); }
  };

})(window.MC);
