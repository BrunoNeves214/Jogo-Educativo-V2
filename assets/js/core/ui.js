/* Mundo Curioso — casca visual partilhada por todos os jogos:
   barra de topo, mascote, confetti, modais, recompensas e portao parental. */
(function (MC) {
  'use strict';

  var art = MC.art;
  var t = function (k, v) { return MC.i18n.t(k, v); };

  /* ================= registo de jogos e ilhas ================= */

  MC.games = {};
  MC.gameList = [];

  MC.registerGame = function (def) {
    MC.games[def.id] = def;
    MC.gameList.push(def);
  };

  // tint: fundo do ecra de cada ilha, tal como nos mockups originais
  MC.ISLANDS = [
    { id: 'letras',       color: '#FF6F59', soft: '#FFE7E1', tint: '#FFF3EF', art: 'alphabet' },
    { id: 'cores',        color: '#2EC4B6', soft: '#DFF7F4', tint: '#EFFBFA', art: 'shapes' },
    { id: 'animais',      color: '#FFB627', soft: '#FFF3D9', tint: '#FFFBEF', art: 'paw' },
    { id: 'logica',       color: '#8E7DBE', soft: '#EDE9F8', tint: '#F7F5FC', art: 'puzzle' },
    { id: 'vocabulario',  color: '#4EA8DE', soft: '#E3F2FB', tint: '#F2FAFF', art: 'chat' },
    { id: 'matematica',   color: '#6BBF59', soft: '#E8F6E4', tint: '#F5FBF2', art: 'plus' },
    { id: 'motricidade',  color: '#FF8FB1', soft: '#FFEAF1', tint: '#FFF7FA', art: 'brush' },
    { id: 'rotinas',      color: '#F4A261', soft: '#FDEEDF', tint: '#FFF8F1', art: 'checklist' },
    { id: 'musica',       color: '#B892FF', soft: '#F1E9FF', tint: '#F9F5FF', art: 'note' }
  ];

  MC.islandById = function (id) {
    var f = MC.ISLANDS.filter(function (i) { return i.id === id; });
    return f[0] || MC.ISLANDS[0];
  };

  MC.gamesOfIsland = function (id) {
    return MC.gameList.filter(function (g) { return g.island === id; });
  };

  /* ================= camadas ================= */

  function appEl() { return document.getElementById('app'); }
  function fxEl() { return document.getElementById('layer-fx'); }
  function modalEl() { return document.getElementById('layer-modal'); }

  /* ================= confetti ================= */

  var CONFETTI_COLORS = ['#FF6F59', '#FFC145', '#4EA8DE', '#6BBF59', '#B892FF', '#FF8FB1', '#2EC4B6'];

  function confetti(count) {
    var layer = fxEl();
    if (!layer) return;
    var n = count || 26;
    var w = window.innerWidth;
    for (var i = 0; i < n; i++) {
      (function (i) {
        var p = document.createElement('div');
        p.className = 'confetti';
        p.style.background = MC.pick(CONFETTI_COLORS);
        p.style.left = (w * 0.5 + (Math.random() - 0.5) * w * 0.7) + 'px';
        p.style.top = (window.innerHeight * 0.32) + 'px';
        layer.appendChild(p);
        var dx = (Math.random() - 0.5) * 420;
        var dy = 240 + Math.random() * 380;
        var rot = (Math.random() - 0.5) * 900;
        var dur = 1100 + Math.random() * 900;
        if (p.animate) {
          var anim = p.animate([
            { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
            { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg)', opacity: 0 }
          ], { duration: dur, easing: 'cubic-bezier(.2,.6,.4,1)', delay: i * 14 });
          anim.onfinish = function () { if (p.parentNode) p.parentNode.removeChild(p); };
        } else {
          MC.later(function () { if (p.parentNode) p.parentNode.removeChild(p); }, dur);
        }
      })(i);
    }
  }

  /* ================= repeticao da instrucao ==================
     Se a crianca ficar parada, a voz repete a instrucao do jogo.
     8 segundos: tempo suficiente para pensar sem soar insistente
     (7s ficava em cima de qualquer hesitacao normal desta idade).
     O contador reinicia sempre que a app fala ou a crianca toca. */

  var REPEAT_MS = 8000;
  var repeatFn = null;
  var repeatTimer = null;

  function clearRepeatTimer() {
    if (repeatTimer) { clearTimeout(repeatTimer); repeatTimer = null; }
  }

  function scheduleRepeat() {
    clearRepeatTimer();
    if (!repeatFn) return;
    if (MC.store.get('repeat') === false) return;
    repeatTimer = setTimeout(function () {
      repeatTimer = null;
      if (!repeatFn) return;
      // nao fala por cima de um modal (vitoria, pausa, portao parental)
      if (document.getElementById('layer-modal').classList.contains('on')) {
        scheduleRepeat();
        return;
      }
      if (document.hidden) { scheduleRepeat(); return; }
      var text = null;
      try { text = repeatFn(); } catch (e) { text = null; }
      if (text) MC.audio.speak(text, { rate: 0.8 });
      scheduleRepeat();
    }, REPEAT_MS);
  }

  // fn devolve a frase a repetir, ou null para saltar esta volta
  function startRepeat(fn) {
    repeatFn = fn;
    scheduleRepeat();
  }

  function stopRepeat() {
    repeatFn = null;
    clearRepeatTimer();
  }

  // adia a proxima repeticao (chamado a cada fala e a cada toque)
  function bumpRepeat() {
    if (repeatFn) scheduleRepeat();
  }

  ['pointerdown', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, bumpRepeat, { passive: true });
  });

  /* ================= mascote ================= */

  var currentMascot = null;
  var bubbleTimer = null;

  function attachMascot(stage) {
    var m = MC.node('<div class="mascot">' + art.svg('mascot') + '</div>');
    stage.appendChild(m);
    currentMascot = m;
    return m;
  }

  // mood: 'cheer' | 'nudge'
  function mascotSay(text, mood) {
    if (!currentMascot) return;
    currentMascot.classList.remove('cheer', 'nudge');
    // reinicia a animacao
    void currentMascot.offsetWidth;
    if (mood) currentMascot.classList.add(mood);

    var parent = currentMascot.parentNode;
    if (!parent) return;
    var old = parent.querySelector('.bubble');
    if (old) old.parentNode.removeChild(old);
    if (!text) return;

    var b = MC.node('<div class="bubble">' + MC.esc(text) + '</div>');
    parent.appendChild(b);
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = MC.later(function () {
      if (b.parentNode) b.parentNode.removeChild(b);
    }, 2400);
  }

  /* ================= modais ================= */

  function closeModal() {
    var m = modalEl();
    m.classList.remove('on');
    MC.clear(m);
  }

  // html: conteudo do .sheet. opts.dismissable (default true)
  function modal(html, opts) {
    opts = opts || {};
    var m = modalEl();
    MC.clear(m);
    var back = MC.node('<div class="backdrop"><div class="sheet" role="dialog" aria-modal="true">' + html + '</div></div>');
    m.appendChild(back);
    m.classList.add('on');
    if (opts.dismissable !== false) {
      back.addEventListener('click', function (ev) {
        if (ev.target === back) { closeModal(); if (opts.onClose) opts.onClose(); }
      });
    }
    return back.querySelector('.sheet');
  }

  /* ================= portao parental ================= */

  function parentalGate(onPass) {
    var a = 3 + MC.rnd(6), b = 2 + MC.rnd(7);
    var sheet = modal(
      '<h2>' + MC.esc(t('gate.title')) + '</h2>' +
      '<p>' + MC.esc(t('gate.body', { a: a, b: b })) + '</p>' +
      '<input type="number" inputmode="numeric" id="gate-in" autocomplete="off">' +
      '<p class="gate-err" style="color:#FF6F59;display:none">' + MC.esc(t('gate.wrong')) + '</p>' +
      '<div class="actions">' +
      '<button class="btn" data-x>' + MC.esc(t('ui.close')) + '</button>' +
      '<button class="btn primary" data-ok>' + MC.esc(t('gate.ok')) + '</button>' +
      '</div>'
    );
    var input = sheet.querySelector('#gate-in');
    var err = sheet.querySelector('.gate-err');
    MC.later(function () { try { input.focus(); } catch (e) {} }, 120);

    function check() {
      if (parseInt(input.value, 10) === a + b) {
        closeModal();
        onPass();
      } else {
        err.style.display = '';
        input.value = '';
        input.focus();
      }
    }
    MC.tap(sheet.querySelector('[data-ok]'), check);
    MC.tap(sheet.querySelector('[data-x]'), closeModal);
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') check(); });
  }

  /* ================= sugestao de pausa ================= */

  var breakShownAt = 0;

  function maybeBreak() {
    if (MC.store.get('breaks') === false) return false;
    var mins = MC.session.minutes();
    var limit = MC.store.get('breakMinutes');
    if (typeof limit !== 'number') limit = 15;
    if (mins < limit) return false;
    if (Date.now() - breakShownAt < 5 * 60 * 1000) return false;
    breakShownAt = Date.now();

    var sheet = modal(
      '<div style="width:86px;margin:0 auto">' + art.svg('mascot') + '</div>' +
      '<h2 class="mt">' + MC.esc(t('break.title')) + '</h2>' +
      '<p>' + MC.esc(t('break.body', { min: mins })) + '</p>' +
      '<div class="actions">' +
      '<button class="btn" data-more>' + MC.esc(t('break.more')) + '</button>' +
      '<button class="btn primary" data-stop>' + MC.esc(t('break.stop')) + '</button>' +
      '</div>', { dismissable: false }
    );
    MC.audio.speak(t('break.title'));
    MC.tap(sheet.querySelector('[data-more]'), function () {
      MC.session.restart();
      closeModal();
    });
    MC.tap(sheet.querySelector('[data-stop]'), function () {
      MC.session.restart();
      closeModal();
      MC.go('#/');
    });
    return true;
  }

  /* ================= ecra generico ================= */

  /* opts:
       title      titulo na barra
       island     id da ilha (define a cor de destaque)
       back       hash de destino do botao voltar
       dots       numero de rondas (mostra pontos de progresso)
       hint       linha de ajuda por baixo do titulo
       right      html extra no canto superior direito
       noMascot   nao coloca a mascote
  */
  function screen(opts) {
    opts = opts || {};
    var isl = MC.islandById(opts.island || 'letras');
    var root = MC.node(
      '<div class="screen" style="--accent:' + isl.color + ';--accent-soft:' + isl.soft +
      ';background:' + isl.tint + '">' +
      '<div class="topbar">' +
      '<button class="icon-btn back" aria-label="' + MC.esc(t('nav.back')) + '" style="color:' + isl.color + '">' +
      art.svg('back') + '</button>' +
      '<div class="grow title-wrap"><h1>' + MC.esc(opts.title || '') + '</h1>' + levelBadge() + '</div>' +
      '<div class="right-slot"></div>' +
      '</div>' +
      '<div class="stage' + (opts.stageClass ? ' ' + opts.stageClass : '') + '"></div>' +
      '</div>'
    );

    var stage = root.querySelector('.stage');
    var slot = root.querySelector('.right-slot');

    if (opts.dots) {
      var d = '<div class="dots">';
      for (var i = 0; i < opts.dots; i++) d += '<i></i>';
      d += '</div>';
      slot.appendChild(MC.node(d));
    } else if (opts.right) {
      slot.appendChild(MC.node(opts.right));
    } else {
      slot.appendChild(MC.node('<div class="icon-btn ghost"></div>'));
    }

    MC.tap(root.querySelector('.back'), function () {
      MC.audio.shutUp();
      MC.go(opts.back || '#/');
    });

    var badge = root.querySelector('.level-badge');
    if (badge) MC.tap(badge, function () { MC.audio.sfx.tap(); levelPicker(); });

    if (opts.hint) {
      stage.appendChild(MC.node('<p class="hint">' + MC.esc(opts.hint) + '</p>'));
    }

    var api = {
      root: root,
      stage: stage,
      mascot: null,
      // marca i rondas concluidas
      setDots: function (n) {
        MC.qsa('.dots i', root).forEach(function (el, idx) {
          el.classList.toggle('on', idx < n);
        });
      },
      // bloco de conteudo com respiro
      add: function (html) {
        var el = typeof html === 'string' ? MC.node(html) : html;
        stage.appendChild(el);
        return el;
      },
      // fn devolve a instrucao que a voz deve repetir de tempos a tempos
      repeat: function (fn) { startRepeat(fn); },
      stopRepeat: stopRepeat
    };

    if (!opts.noMascot) api.mascot = attachMascot(stage);
    return api;
  }

  /* ================= feedback de resposta ================= */

  function markRight(tile, opts) {
    opts = opts || {};
    tile.classList.add('right');
    if (!tile.querySelector('.check')) {
      tile.appendChild(MC.node('<div class="check">' + art.svg('check', { color: '#fff' }) + '</div>'));
    }
    if (opts.silent !== true) MC.audio.sfx.success();
    confetti(opts.confetti === undefined ? 18 : opts.confetti);
    var praise = MC.i18n.praise();
    mascotSay(praise, 'cheer');
    if (opts.speak !== false) MC.audio.speak(opts.say || praise);
  }

  function markWrong(tile, opts) {
    opts = opts || {};
    tile.classList.remove('wrong');
    void tile.offsetWidth;
    tile.classList.add('wrong');
    MC.audio.sfx.soft();
    var msg = opts.message || MC.i18n.encourage();
    mascotSay(msg, 'nudge');
    if (opts.speak) MC.audio.speak(msg);
    MC.later(function () { tile.classList.remove('wrong'); }, 600);
  }

  /* ================= fases ================= */

  // contexto da fase em curso; o router preenche-o antes de montar o jogo
  function ctx() { return MC.levelCtx || null; }

  function levelBadge() {
    var c = ctx();
    if (!c || c.total < 2) return '';
    return '<button class="level-badge" aria-label="' + MC.esc(t('level.pick')) + '">' +
      MC.esc(t('level.n', { n: c.level })) + '<span class="of">/' + c.total + '</span></button>';
  }

  function goLevel(n) {
    var c = ctx();
    if (!c) return;
    MC.store.setLevel(c.id, n);
    closeModal();
    MC.router.render();
  }

  // escolha de fase: as abertas tocam-se, as fechadas mostram um cadeado
  function levelPicker() {
    var c = ctx();
    if (!c) return;
    var open = MC.store.unlockedLevel(c.id, c.total);
    var cells = '';
    for (var n = 1; n <= c.total; n++) {
      var state = n > open ? 'locked' : (MC.store.isDone(c.id, n) ? 'done' : 'open');
      cells += '<button class="lvl ' + state + (n === c.level ? ' cur' : '') + '" data-n="' + n + '"' +
        (state === 'locked' ? ' disabled aria-disabled="true"' : '') + '>' +
        '<span class="num">' + n + '</span>' +
        (state === 'done' ? art.svg('starShape', { color: '#FFC145', cls: 'lvl-star' }) : '') +
        (state === 'locked' ? '<span class="lock">' + art.svg('lock') + '</span>' : '') +
        '</button>';
    }
    var sheet = modal(
      '<h2>' + MC.esc(t('level.pickTitle')) + '</h2>' +
      '<p>' + MC.esc(t('level.pickSub')) + '</p>' +
      '<div class="lvl-grid">' + cells + '</div>' +
      '<div class="actions"><button class="btn" data-x>' + MC.esc(t('ui.close')) + '</button></div>'
    );
    MC.qsa('.lvl:not([disabled])', sheet).forEach(function (b) {
      MC.tap(b, function () { MC.audio.sfx.tap(); goLevel(parseInt(b.dataset.n, 10)); });
    });
    MC.tap(sheet.querySelector('[data-x]'), closeModal);
  }

  /* ================= ecra de vitoria ================= */

  /* win(gameId, {again:fn, back:'#/ilha/x'})
     Marca a fase como feita, abre a seguinte e oferece "Proxima fase". */
  function win(gameId, opts) {
    opts = opts || {};
    MC.audio.sfx.fanfare();
    confetti(60);

    var c = ctx();
    var level = c && c.id === gameId ? c.level : 1;
    var total = c && c.id === gameId ? c.total : 1;
    MC.store.completeLevel(gameId, level, total);
    var hasNext = level < total;
    var last = level === total;

    var sticker = MC.data.nextSticker();
    var isNew = MC.store.addSticker(sticker.id);

    // uma estrela por fase, ate cinco: ve-se quantas ja foram feitas
    var starRow = '';
    for (var i = 1; i <= total; i++) {
      starRow += art.svg('starShape', {
        color: MC.store.isDone(gameId, i) ? '#FFC145' : '#E7E4F0',
        style: 'width:30px;height:30px'
      });
    }

    var title = hasNext ? t('win.levelDone', { n: level }) : (total > 1 && last ? t('win.allDone') : t('win.title'));

    var sheet = modal(
      '<div class="reward-star" style="width:92px">' +
        art.svg(sticker.art, { color: sticker.color || '' }) +
      '</div>' +
      '<h2 class="mt">' + MC.esc(title) + '</h2>' +
      (isNew ? '<p>' + MC.esc(t('win.body')) + '</p>' : '') +
      (total > 1 ? '<div class="win-stars">' + starRow + '</div>' : '') +
      '<div class="actions">' +
      '<button class="btn" data-island>' + MC.esc(t('win.island')) + '</button>' +
      (hasNext
        ? '<button class="btn" data-again>' + MC.esc(t('win.replay')) + '</button>' +
          '<button class="btn primary" data-next>' + MC.esc(t('win.next')) + '</button>'
        : '<button class="btn primary" data-again>' + MC.esc(t('win.again')) + '</button>') +
      '</div>', { dismissable: false }
    );

    MC.audio.speak(hasNext ? MC.i18n.pick('say.levelDone') : title);

    MC.tap(sheet.querySelector('[data-again]'), function () {
      closeModal();
      if (maybeBreak()) return;
      if (opts.again) opts.again(); else MC.router.render();
    });
    var nx = sheet.querySelector('[data-next]');
    if (nx) MC.tap(nx, function () {
      if (maybeBreak()) { MC.store.setLevel(gameId, level + 1); return; }
      goLevel(level + 1);
    });
    MC.tap(sheet.querySelector('[data-island]'), function () {
      closeModal();
      if (maybeBreak()) return;
      MC.go(opts.back || '#/');
    });
  }

  /* ================= peças auxiliares de marcacao ================= */

  function tileHtml(inner, extraClass, styleAttr) {
    return '<button type="button" class="tile' + (extraClass ? ' ' + extraClass : '') + '"' +
      (styleAttr ? ' style="' + styleAttr + '"' : '') + '>' + inner + '</button>';
  }

  function speakerHtml(label) {
    return '<button type="button" class="speaker" aria-label="' + MC.esc(label || t('ui.listenAgain')) + '">' +
      '<span class="ring"></span><span class="ring b"></span>' +
      art.svg('speaker', { color: 'var(--accent)' }) + '</button>';
  }

  MC.ui = {
    screen: screen,
    modal: modal,
    closeModal: closeModal,
    startRepeat: startRepeat,
    stopRepeat: stopRepeat,
    bumpRepeat: bumpRepeat,
    confetti: confetti,
    mascotSay: mascotSay,
    markRight: markRight,
    markWrong: markWrong,
    win: win,
    levelPicker: levelPicker,
    parentalGate: parentalGate,
    maybeBreak: maybeBreak,
    tileHtml: tileHtml,
    speakerHtml: speakerHtml
  };

})(window.MC);
