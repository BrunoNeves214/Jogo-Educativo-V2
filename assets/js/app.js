/* Mundo Curioso — arranque, boas-vindas, mapa de ilhas e area dos pais. */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var art = MC.art;
  var D = MC.data;

  var WELCOME_FLAG = 'mundo-curioso.welcomed';

  function seenWelcome() {
    try { return window.sessionStorage.getItem(WELCOME_FLAG) === '1'; } catch (e) { return false; }
  }
  function markWelcome() {
    try { window.sessionStorage.setItem(WELCOME_FLAG, '1'); } catch (e) { /* modo privado */ }
  }
  function forgetWelcome() {
    try { window.sessionStorage.removeItem(WELCOME_FLAG); } catch (e) { /* modo privado */ }
  }

  function childName() { return (MC.store.get('name') || '').trim(); }

  /* ================= ecra de boas-vindas ================= */

  function welcome(params, app) {
    var name = childName();
    var hello = MC.i18n.hello();

    var root = MC.node(
      '<div class="screen welcome">' +
        '<div class="hill"></div>' +
        '<div class="cloud c1"></div><div class="cloud c2"></div>' +
        '<div class="welcome-box">' +
          '<div class="welcome-mascot">' + art.svg('mascot') + '</div>' +
          '<h1 class="welcome-hello">' + MC.esc(hello) + (name ? ', ' + MC.esc(name) + '!' : '!') + '</h1>' +
          '<p class="welcome-sub">' + MC.esc(name ? t('hello.back') : t('hello.first')) + '</p>' +
          '<div class="welcome-form">' +
            '<label class="sr-only" for="child-name">' + MC.esc(t('hello.who')) + '</label>' +
            '<input id="child-name" type="text" maxlength="14" autocomplete="off" ' +
              'placeholder="' + MC.esc(t('hello.namePlaceholder')) + '" value="' + MC.esc(name) + '">' +
            '<button class="btn primary big go">' + MC.esc(t('hello.start')) + '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    var input = root.querySelector('#child-name');
    var go = root.querySelector('.go');

    function start() {
      var v = input.value.trim();
      if (!v) {
        input.classList.add('shake');
        MC.audio.sfx.soft();
        MC.later(function () { input.classList.remove('shake'); }, 600);
        input.focus();
        return;
      }
      MC.store.set('name', v);
      markWelcome();
      MC.audio.sfx.sparkle();
      MC.go('#/');
    }

    MC.tap(go, start);
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') start(); });

    // A voz cumprimenta assim que o som fica disponivel (precisa de um toque
    // do utilizador na maioria dos browsers, por isso tambem tentamos depois).
    var greeted = false;
    function greet() {
      if (greeted) return;
      greeted = true;
      MC.audio.speak(hello + (name ? ', ' + name : '') + '!', { rate: 0.85 });
    }
    MC.later(greet, 700);
    window.addEventListener('pointerdown', greet, { once: true, passive: true });

    if (!name) MC.later(function () { try { input.focus(); } catch (e) {} }, 500);

    app.appendChild(root);
  }

  /* ================= ecra inicial (mapa de ilhas) ================= */

  function starsRow(n) {
    var h = '<span class="stars">';
    for (var i = 0; i < 3; i++) {
      h += art.svg('starShape', { color: i < n ? '#FFC145' : '#E7E4F0' });
    }
    return h + '</span>';
  }

  function phaseDots(g) {
    var total = g.levels ? g.levels.length : 1;
    if (total < 2) return '';
    var h = '<span class="phase" aria-label="' + MC.store.doneCount(g.id) + ' / ' + total + '">';
    for (var i = 1; i <= total; i++) h += '<i' + (MC.store.isDone(g.id, i) ? ' class="on"' : '') + '></i>';
    return h + '</span>';
  }

  function home(params, app) {
    var name = childName() || 'amigo';

    var root = MC.node(
      '<div class="screen home">' +
        '<div class="hill"></div>' +
        '<div class="cloud c1"></div><div class="cloud c2"></div>' +
        '<div class="topbar">' +
          '<div class="brand">' +
            '<span class="brand-mark">' + art.svg('mascot') + '</span>' +
            '<span class="brand-name display">' + MC.esc(t('app.name')) + '</span>' +
          '</div>' +
          '<button class="icon-btn stickers" aria-label="' + MC.esc(t('nav.stickers')) + '" style="color:#FFC145">' +
            art.svg('starShape') + '</button>' +
          '<button class="icon-btn settings" aria-label="' + MC.esc(t('nav.settings')) + '" style="color:var(--ink-soft)">' +
            art.svg('gear') + '</button>' +
        '</div>' +
        '<div class="home-scroll">' +
          '<div class="greet">' +
            '<h2>' + MC.esc(t('home.greet', { hello: MC.i18n.hello(), name: name })) + '</h2>' +
            '<p>' + MC.esc(t('home.pick')) + '</p>' +
          '</div>' +
          '<div class="islands"></div>' +
        '</div>' +
      '</div>'
    );

    var grid = root.querySelector('.islands');

    MC.ISLANDS.forEach(function (isl) {
      var games = MC.gamesOfIsland(isl.id);
      if (!games.length) return;
      var earned = games.reduce(function (n, g) { return n + MC.store.starsOf(g.id); }, 0);
      var pct = Math.round(earned / (games.length * 3) * 100);

      var card = MC.node(
        '<button class="island" style="--island:' + isl.color + ';--island-soft:' + isl.soft + '">' +
          '<span class="island-pic">' + MC.islandArt(isl, art.body(isl.art)) + '</span>' +
          '<span class="island-label">' +
            '<b>' + MC.esc(t('island.' + isl.id)) + '</b>' +
            '<small>' + MC.esc(t('home.games', { n: games.length })) + '</small>' +
            '<span class="bar"><span style="width:' + pct + '%"></span></span>' +
          '</span>' +
        '</button>'
      );
      MC.tap(card, function () {
        MC.audio.sfx.tap();
        MC.audio.speak(t('island.' + isl.id), { rate: 0.85 });
        MC.go('#/ilha/' + isl.id);
      });
      grid.appendChild(card);
    });

    MC.tap(root.querySelector('.stickers'), function () {
      MC.audio.sfx.tap();
      MC.go('#/autocolantes');
    });
    MC.tap(root.querySelector('.settings'), function () {
      MC.audio.sfx.tap();
      MC.ui.parentalGate(function () { MC.go('#/pais'); });
    });

    app.appendChild(root);
  }

  /* ================= ecra da ilha ================= */

  function island(params, app) {
    var isl = MC.islandById(params.id);
    var games = MC.gamesOfIsland(isl.id);

    var root = MC.node(
      '<div class="screen" style="--accent:' + isl.color + ';--accent-soft:' + isl.soft +
        ';background:' + isl.tint + '">' +
        '<div class="island-head">' +
          '<button class="icon-btn back" aria-label="' + MC.esc(t('nav.home')) + '">' + art.svg('back') + '</button>' +
          '<span class="head-badge">' + art.svg(isl.art, { color: isl.color }) + '</span>' +
          '<div class="head-tx">' +
            '<h1>' + MC.esc(t('island.' + isl.id)) + '</h1>' +
            '<p>' + MC.esc(t('island.' + isl.id + '.sub')) + '</p>' +
          '</div>' +
          '<span class="head-mascot">' + art.svg('mascot') + '</span>' +
        '</div>' +
        '<div class="game-list"></div>' +
      '</div>'
    );

    var list = root.querySelector('.game-list');

    games.forEach(function (g) {
      var card = MC.node(
        '<button class="game-card">' +
          '<span class="ico">' + art.svg(g.icon || 'star', { color: isl.color }) + '</span>' +
          '<span class="tx"><b>' + MC.esc(t(g.title)) + '</b><small>' + MC.esc(t(g.sub)) + '</small>' +
            phaseDots(g) + '</span>' +
          '<span class="go">' + starsRow(MC.store.starsOf(g.id)) +
            '<span class="pill accent play-pill">' + MC.esc(t('ui.play')) + '</span></span>' +
        '</button>'
      );
      MC.tap(card, function () {
        MC.audio.sfx.tap();
        MC.go('#/jogo/' + g.id);
      });
      list.appendChild(card);
    });

    MC.tap(root.querySelector('.back'), function () {
      MC.audio.sfx.tap();
      MC.go('#/');
    });

    app.appendChild(root);
  }

  /* ================= um jogo ================= */

  // Cada jogo recebe a configuracao da fase em curso (cfg) e o numero dela.
  function game(params, app) {
    var g = MC.games[params.id];
    if (!g) { MC.go('#/'); return; }
    var total = g.levels ? g.levels.length : 1;
    var level = MC.store.currentLevel(g.id, total);
    MC.levelCtx = { id: g.id, level: level, total: total };
    return g.mount(app, g.levels ? g.levels[level - 1] : {}, level);
  }

  /* ================= autocolantes ================= */

  function stickers(params, app) {
    var owned = MC.store.get('stickers') || [];
    var root = MC.node(
      '<div class="screen" style="--accent:#FFC145;--accent-soft:#FFF3D9;background:#FFFBEF">' +
        '<div class="topbar">' +
          '<button class="icon-btn back" aria-label="' + MC.esc(t('nav.home')) + '" style="color:#FFB627">' +
            art.svg('back') + '</button>' +
          '<div class="grow"><h1>' + MC.esc(t('stickers.title')) + '</h1></div>' +
          '<div class="icon-btn ghost"></div>' +
        '</div>' +
        '<div class="wrap-scroll">' +
          '<p class="hint center-block">' +
            MC.esc(owned.length ? t('stickers.sub') : t('stickers.empty')) + '</p>' +
          '<div class="sticker-grid"></div>' +
        '</div>' +
      '</div>'
    );

    var grid = root.querySelector('.sticker-grid');
    D.STICKERS.forEach(function (s) {
      var has = owned.indexOf(s.id) !== -1;
      var cell = MC.node(
        '<div class="sticker' + (has ? '' : ' locked') + '">' +
        art.svg(s.art, { color: s.color || '' }) + '</div>'
      );
      if (has) {
        MC.tap(cell, function () {
          MC.audio.sfx.sparkle();
          if (cell.animate) {
            cell.animate([
              { transform: 'scale(1) rotate(0deg)' },
              { transform: 'scale(1.18) rotate(-8deg)' },
              { transform: 'scale(1) rotate(0deg)' }
            ], { duration: 500 });
          }
        });
      }
      grid.appendChild(cell);
    });

    MC.tap(root.querySelector('.back'), function () { MC.audio.sfx.tap(); MC.go('#/'); });
    app.appendChild(root);
  }

  /* ================= area dos pais ================= */

  function switchRow(key, label, sub) {
    return '<div class="settings-row">' +
      '<span class="lb">' + MC.esc(label) + (sub ? '<small>' + MC.esc(sub) + '</small>' : '') + '</span>' +
      '<button class="switch" data-k="' + key + '" role="switch" aria-label="' + MC.esc(label) + '"></button>' +
      '</div>';
  }

  function parents(params, app) {
    var root = MC.node(
      '<div class="screen" style="--accent:#8E7DBE;--accent-soft:#EDE9F8;background:#F7F5FC">' +
        '<div class="topbar">' +
          '<button class="icon-btn back" aria-label="' + MC.esc(t('nav.home')) + '" style="color:#8E7DBE">' +
            art.svg('back') + '</button>' +
          '<div class="grow"><h1>' + MC.esc(t('parents.title')) + '</h1></div>' +
          '<div class="icon-btn ghost"></div>' +
        '</div>' +
        '<div class="wrap-scroll">' +
          '<div class="card settings-card">' +
            '<div class="settings-row">' +
              '<span class="lb">' + MC.esc(t('parents.child')) + '</span>' +
              '<input class="nm-in" type="text" maxlength="14" autocomplete="off">' +
            '</div>' +
            switchRow('voice', t('parents.voice'), t('parents.voice.sub')) +
            '<div class="settings-row voice-row">' +
              '<span class="lb">' + MC.esc(t('parents.voiceName')) + '<small>' + MC.esc(t('parents.voiceName.sub')) + '</small></span>' +
              '<span class="voice-pick"><select class="voice-sel"></select>' +
              '<button class="btn voice-test">' + art.svg('speaker', { color: 'var(--ink-soft)' }) +
              '<span>' + MC.esc(t('parents.voiceTest')) + '</span></button></span>' +
            '</div>' +
            '<div class="voice-hint" style="display:none">' + MC.esc(t('parents.voiceHint')) + '</div>' +
            switchRow('repeat', t('parents.repeat'), t('parents.repeat.sub')) +
            switchRow('sfx', t('parents.sfx'), t('parents.sfx.sub')) +
            switchRow('music', t('parents.music')) +
            switchRow('breaks', t('parents.break'), t('parents.break.sub')) +
            switchRow('allLevels', t('parents.allLevels'), t('parents.allLevels.sub')) +
            '<div class="settings-row">' +
              '<span class="lb">' + MC.esc(t('parents.progress')) + '<small class="prog"></small></span>' +
              '<button class="btn reset">' + MC.esc(t('parents.reset')) + '</button>' +
            '</div>' +
          '</div>' +
          '<p class="hint center-block mt">' + MC.esc(t('parents.noAds')) + '</p>' +
        '</div>' +
      '</div>'
    );

    var nmIn = root.querySelector('.nm-in');
    nmIn.value = childName();
    function saveName() {
      var v = nmIn.value.trim();
      if (v) MC.store.set('name', v);
    }
    nmIn.addEventListener('change', saveName);
    nmIn.addEventListener('blur', saveName);

    function goodVoice(v) { return MC.audio.isNatural(v) || /google/i.test(v.name || ''); }

    // lista de vozes portuguesas do aparelho; as "naturais" aparecem marcadas
    var sel = root.querySelector('.voice-sel');
    var hint = root.querySelector('.voice-hint');
    function fillVoices() {
      var list = MC.audio.voices();
      var chosen = MC.store.get('voiceName') || '';
      MC.clear(sel);
      sel.appendChild(MC.node('<option value="">' + MC.esc(t('parents.voiceAuto')) + '</option>'));
      list.forEach(function (v) {
        var label = v.name.replace(/^Microsoft\s+/, '').replace(/\s*-\s*Portuguese.*$/, '') +
          ' · ' + v.lang + (goodVoice(v) ? ' · ' + t('parents.voiceNatural') : '');
        var o = MC.node('<option>' + MC.esc(label) + '</option>');
        o.value = v.name;
        if (v.name === chosen) o.selected = true;
        sel.appendChild(o);
      });
      // o aviso so aparece quando a voz em uso soa robotica, e diz o que fazer
      var cur = MC.audio.currentVoice();
      var other = list.filter(function (v) { return goodVoice(v) && v !== cur; })[0];
      if (cur && goodVoice(cur)) {
        hint.style.display = 'none';
      } else {
        hint.style.display = '';
        hint.textContent = t(other ? 'parents.voiceHintOther' : 'parents.voiceHint');
      }
    }
    fillVoices();
    if (window.speechSynthesis && window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', fillVoices);
    }
    sel.addEventListener('change', function () {
      MC.store.set('voiceName', sel.value);
      fillVoices();
      MC.audio.speak(t('parents.voiceSample'), { force: true });
    });
    MC.tap(root.querySelector('.voice-test'), function () {
      MC.audio.speak(t('parents.voiceSample'), { force: true });
    });

    MC.qsa('.switch', root).forEach(function (sw) {
      var key = sw.dataset.k;
      var apply = function () {
        var on = !!MC.store.get(key);
        sw.classList.toggle('on', on);
        sw.setAttribute('aria-checked', on ? 'true' : 'false');
      };
      apply();
      MC.tap(sw, function () {
        var next = !MC.store.get(key);
        if (key === 'music') MC.audio.setMusic(next);
        else MC.store.set(key, next);
        apply();
        MC.audio.sfx.tap();
      });
    });

    var nStars = MC.store.totalStars(), nStick = (MC.store.get('stickers') || []).length;
    root.querySelector('.prog').textContent = t('parents.progress.sub', {
      stars: nStars + (nStars === 1 ? ' estrela' : ' estrelas'),
      stickers: nStick + (nStick === 1 ? ' autocolante' : ' autocolantes')
    });

    MC.tap(root.querySelector('.reset'), function () {
      var sheet = MC.ui.modal(
        '<h2>' + MC.esc(t('parents.reset')) + '</h2>' +
        '<p>' + MC.esc(t('parents.resetAsk')) + '</p>' +
        '<div class="actions">' +
        '<button class="btn" data-no>' + MC.esc(t('ui.close')) + '</button>' +
        '<button class="btn primary danger" data-yes>' + MC.esc(t('parents.reset')) + '</button>' +
        '</div>'
      );
      MC.tap(sheet.querySelector('[data-no]'), MC.ui.closeModal);
      MC.tap(sheet.querySelector('[data-yes]'), function () {
        MC.store.reset();
        MC.ui.closeModal();
        MC.go('#/pais');
      });
    });

    MC.tap(root.querySelector('.back'), function () {
      saveName();
      MC.audio.sfx.tap();
      MC.go('#/');
    });
    app.appendChild(root);
  }

  /* ================= arranque ================= */

  function boot() {
    MC.router.add('#/', home);
    MC.router.add('#/ola', welcome);
    MC.router.add('#/ilha/:id', island);
    MC.router.add('#/jogo/:id', game);
    MC.router.add('#/autocolantes', stickers);
    MC.router.add('#/pais', parents);

    // Em cada sessao nova comeca-se pelas boas-vindas; dentro da sessao,
    // recarregar a pagina volta ao sitio onde se estava.
    if (!seenWelcome()) {
      window.location.hash = '#/ola';
    }
    MC.router.start();

    // Service worker so faz sentido servido por http(s); a partir do disco
    // a app continua a funcionar, apenas sem instalacao/offline automatico.
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* sem offline, tudo bem */ });
      });
    }

    // evita o zoom por duplo toque, que atrapalha dedos pequenos
    var lastTouch = 0;
    document.addEventListener('touchend', function (ev) {
      var now = Date.now();
      if (now - lastTouch < 320) ev.preventDefault();
      lastTouch = now;
    }, { passive: false });
  }

  MC.forgetWelcome = forgetWelcome;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window.MC);
