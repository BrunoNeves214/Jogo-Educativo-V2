/* Ilha dos Animais e Sons — cinco fases por jogo.
   8.  Toca no animal   quinta → casa → natureza (exploracao livre) → "quem faz este som?"
   9.  Memoria          2 → 3 → 4 pares → animal com a sua sombra → 8 pares
   10. Silhueta         2 opcoes → 3 → objectos → animais parecidos → so um bocadinho */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var D = MC.data;
  var ISLAND = 'animais';
  var BACK = '#/ilha/animais';

  function says(a) {
    var who = D.withArticle(a);
    return who.charAt(0).toUpperCase() + who.slice(1) + ' ' + a.says + '!';
  }

  /* ============ 8. Toca no animal, ouve o som ============ */

  MC.registerGame({
    id: 'animais', island: ISLAND, icon: 'paw',
    title: 'g.animais', sub: 'g.animais.sub',
    levels: [
      { label: 'Na quinta',            mode: 'free',  habitat: 'quinta' },
      { label: 'Em casa',              mode: 'free',  habitat: 'casa' },
      { label: 'Na natureza',          mode: 'free',  habitat: 'natureza' },
      { label: 'Quem faz este som?',   mode: 'sound', opts: 3, rounds: 5 },
      { label: 'Adivinha pelo som',    mode: 'sound', opts: 4, rounds: 6 }
    ],
    mount: function (app, cfg) {
      var ui = MC.ui.screen({
        title: t('g.animais'), island: ISLAND, back: BACK, stageClass: 'tight', hint: cfg.label,
        dots: cfg.mode === 'sound' ? cfg.rounds : 0
      });
      app.appendChild(ui.root);
      if (cfg.mode === 'sound') return soundMode(ui, cfg);

      // exploracao livre: a fase acaba quando todos os animais foram visitados
      var grid = ui.add('<div class="free-grid"></div>');
      var list = D.HABITATS[cfg.habitat].map(D.animal);
      var visited = {};
      ui.repeat(function () { return t('g.animais.prompt'); });

      list.forEach(function (a) {
        var card = MC.node(
          '<button class="tile" style="--tile:auto;width:100%;aspect-ratio:1;height:auto">' + art.svg(a.id) + '</button>'
        );
        grid.appendChild(card);
        MC.tap(card, function () {
          MC.audio.animal(a.sound);
          MC.ui.mascotSay(says(a), 'cheer');
          MC.later(function () { MC.audio.speak(says(a)); }, 750);
          if (card.animate) {
            card.animate([
              { transform: 'scale(1) rotate(0deg)' }, { transform: 'scale(1.12) rotate(-4deg)' },
              { transform: 'scale(.97) rotate(3deg)' }, { transform: 'scale(1) rotate(0deg)' }
            ], { duration: 620, easing: 'ease-out' });
          }
          if (!visited[a.id]) {
            visited[a.id] = true;
            card.appendChild(MC.node('<div class="check">' + art.svg('check', { color: '#fff' }) + '</div>'));
            if (Object.keys(visited).length === list.length) {
              MC.later(function () { MC.ui.win('animais', { back: BACK }); }, 2600);
            }
          }
        });
      });
      MC.later(function () { MC.audio.speak(t('g.animais.prompt')); }, 400);
    }
  });

  function soundMode(ui, cfg) {
    var round = 0, busy = false, target = null, last = null;
    var spk = ui.add('<div>' + MC.ui.speakerHtml() + '</div>').firstElementChild;
    var row = ui.add('<div class="row"></div>');
    var noisy = D.ANIMALS.filter(function (a) { return a.noisy !== false; });

    function play() { MC.audio.animal(target.sound); }
    MC.tap(spk, play);
    ui.repeat(function () {
      if (busy || !target) return null;
      MC.later(play, 1600);
      return t('g.animais.whoSound');
    });

    function build() {
      busy = false;
      MC.clear(row);
      var opts;
      do { opts = MC.sample(noisy, cfg.opts); target = MC.pick(opts); } while (target === last);
      last = target;
      opts.forEach(function (a) {
        var tile = MC.node(MC.ui.tileHtml(art.svg(a.id), null, '--tile:clamp(80px,14vmin,130px)'));
        MC.tap(tile, function () { answer(a, tile); });
        row.appendChild(tile);
      });
      MC.later(function () { MC.audio.speak(t('g.animais.whoSound')); }, 300);
      MC.later(play, 1900);
    }

    function answer(a, tile) {
      if (busy) return;
      if (a.id === target.id) {
        busy = true;
        MC.ui.markRight(tile, { say: says(a) });
        round++;
        ui.setDots(round);
        MC.later(function () {
          if (round >= cfg.rounds) MC.ui.win('animais', { back: BACK });
          else build();
        }, 2000);
      } else {
        MC.ui.markWrong(tile);
        MC.later(play, 900);
      }
    }
    build();
  }

  /* ============ 9. Memoria dos animais ============ */

  MC.registerGame({
    id: 'memoria', island: ISLAND, icon: 'grid',
    title: 'g.memoria', sub: 'g.memoria.sub',
    levels: [
      { label: 'Dois pares',               pairs: 2, cols: 2 },
      { label: 'Três pares',               pairs: 3, cols: 3 },
      { label: 'Quatro pares',             pairs: 4, cols: 4 },
      { label: 'O animal e a sua sombra',  pairs: 5, cols: 5, shadow: true },
      { label: 'Oito pares',               pairs: 8, cols: 4 }
    ],
    mount: function (app, cfg) {
      var first = null, busy = false, found = 0;

      var ui = MC.ui.screen({
        title: t('g.memoria'), island: ISLAND, back: BACK, hint: cfg.label, stageClass: 'tight'
      });
      app.appendChild(ui.root);
      var prompt = cfg.shadow ? 'g.memoria.shadow' : 'g.memoria.prompt';
      ui.repeat(function () { return t(prompt); });

      var cards = cfg.pairs * 2;
      var size = cards > 12 ? 'clamp(54px,10.5vmin,92px)' : 'clamp(64px,13vmin,116px)';
      var grid = ui.add('<div class="grid" style="grid-template-columns:repeat(' + cfg.cols + ',' + size + ')"></div>');

      function face(inner) {
        return '<span class="face" style="display:flex;width:100%;height:100%;align-items:center;justify-content:center">' +
          inner + '</span>';
      }
      var BACKFACE = face(art.svg('paw', { color: '#fff', style: 'width:42%;height:42%' }));

      var chosen = MC.sample(D.ANIMALS, cfg.pairs);
      var deck = [];
      chosen.forEach(function (a) {
        deck.push({ a: a, shadow: false });
        deck.push({ a: a, shadow: !!cfg.shadow });
      });

      MC.shuffle(deck).forEach(function (c) {
        var card = MC.node(
          '<button class="card mem" data-id="' + c.a.id + '" style="width:' + size + ';height:' + size + ';border-radius:20px;background:#FFB627;' +
          'padding:8px;transition:transform .18s ease;transform:scaleX(1)">' + BACKFACE + '</button>'
        );
        card.dataset.state = 'down';
        grid.appendChild(card);
        MC.tap(card, function () { click(card, c); });
      });

      function frontOf(c) {
        return face(art.svg(c.a.id, { style: c.shadow ? 'filter:brightness(0)' : '' }));
      }

      function swapFace(card, html, bg) {
        card.style.transform = 'scaleX(0)';
        MC.later(function () {
          card.innerHTML = html;
          card.style.background = bg;
          card.style.transform = 'scaleX(1)';
        }, 170);
      }

      function click(card, c) {
        if (busy || card.dataset.state !== 'down') return;
        MC.audio.sfx.tap();
        card.dataset.state = 'up';
        swapFace(card, frontOf(c), '#FFFFFF');
        if (!first) { first = { card: card, c: c }; return; }

        busy = true;
        MC.later(function () {
          if (first.c.a.id === c.a.id) {
            [first.card, card].forEach(function (el) {
              el.dataset.state = 'done';
              el.style.border = '4px solid #3FB65F';
              el.style.boxShadow = '0 8px 16px rgba(63,182,95,.25)';
            });
            // a sombra ganha cor quando o par e encontrado
            [first.card, card].forEach(function (el) { MC.qsa('svg', el).forEach(function (s) { s.style.filter = ''; }); });
            MC.audio.animal(c.a.sound);
            MC.later(function () { MC.audio.speak(says(c.a)); }, 700);
            MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
            MC.ui.confetti(12);
            found++;
            first = null; busy = false;
            if (found >= cfg.pairs) MC.later(function () { MC.ui.win('memoria', { back: BACK }); }, 1600);
          } else {
            MC.audio.sfx.soft();
            MC.ui.mascotSay(MC.i18n.encourage(), 'nudge');
            var a1 = first;
            MC.later(function () {
              [a1.card, card].forEach(function (el) { el.dataset.state = 'down'; swapFace(el, BACKFACE, '#FFB627'); });
              first = null; busy = false;
            }, 1000);
          }
        }, 560);
      }

      MC.later(function () { MC.audio.speak(t(prompt)); }, 400);
    }
  });

  /* ============ 10. Adivinha pela silhueta ============ */

  MC.registerGame({
    id: 'silhueta', island: ISLAND, icon: 'sparkle',
    title: 'g.silhueta', sub: 'g.silhueta.sub',
    levels: [
      { label: 'Duas escolhas',        pool: 'animals', opts: 2, rounds: 4 },
      { label: 'Três escolhas',        pool: 'animals', opts: 3, rounds: 5 },
      { label: 'Sombras de coisas',    pool: 'objects', opts: 3, rounds: 5 },
      { label: 'Animais parecidos',    pool: 'similar', opts: 4, rounds: 5 },
      { label: 'Só um bocadinho',      pool: 'mixed',   opts: 4, rounds: 6, crop: true }
    ],
    mount: function (app, cfg) {
      var round = 0, target = null, busy = false, last = null;

      var ui = MC.ui.screen({
        title: t('g.silhueta'), island: ISLAND, back: BACK, dots: cfg.rounds, stageClass: 'tight', hint: cfg.label
      });
      app.appendChild(ui.root);

      var frame = ui.add(
        '<div class="card" style="display:flex;align-items:center;justify-content:center;overflow:hidden;' +
        'width:clamp(170px,30vmin,290px);height:clamp(150px,26vmin,250px);padding:18px"></div>'
      );
      var q = cfg.crop ? 'g.silhueta.crop' : (cfg.pool === 'objects' ? 'g.silhueta.thing' : 'g.silhueta.prompt');
      ui.add('<div class="prompt">' + MC.esc(t(q)) + '</div>');
      var row = ui.add('<div class="row"></div>');
      ui.repeat(function () { return busy ? null : t(q); });

      function options() {
        if (cfg.pool === 'objects') return MC.sample(D.OBJECTS.filter(function (o) { return o.id !== 'sea'; }), cfg.opts);
        if (cfg.pool === 'similar') return MC.sample(MC.pick(D.LOOKALIKES), cfg.opts).map(D.animal);
        if (cfg.pool === 'mixed') return MC.sample(D.ANIMALS.concat(D.OBJECTS.filter(function (o) { return o.id !== 'sea'; })), cfg.opts);
        return MC.sample(D.ANIMALS, cfg.opts);
      }

      // recorta um quarto do desenho, ao acaso: so se ve um pedaco
      function cropBox() {
        var spots = [[4, 4], [24, 4], [4, 24], [24, 24], [14, 14]];
        var s = MC.pick(spots);
        return s[0] + ' ' + s[1] + ' 36 36';
      }

      function build() {
        busy = false;
        MC.clear(frame); MC.clear(row);
        var opts;
        do { opts = options(); target = MC.pick(opts); } while (target === last);
        last = target;

        var svg = art.svg(target.id);
        if (cfg.crop) svg = svg.replace(/viewBox="[^"]*"/, 'viewBox="' + cropBox() + '"');
        var shadow = MC.node(
          '<div class="shadow" style="width:100%;height:100%;' + (cfg.crop ? '' : 'filter:brightness(0);') +
          'transition:filter .6s ease">' + svg + '</div>'
        );
        frame.appendChild(shadow);

        opts.forEach(function (a) {
          var tile = MC.node(MC.ui.tileHtml(art.svg(a.id), null, '--tile:clamp(74px,13vmin,124px)'));
          MC.tap(tile, function () { answer(a, tile, shadow); });
          row.appendChild(tile);
        });
        MC.later(function () { MC.audio.speak(t(q)); }, 350);
      }

      function answer(a, tile, shadow) {
        if (busy) return;
        if (a.id === target.id) {
          busy = true;
          shadow.style.filter = 'none';
          if (cfg.crop) shadow.innerHTML = art.svg(target.id);
          if (shadow.animate) {
            shadow.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }],
              { duration: 700, easing: 'ease-out' });
          }
          var isAnimal = !!D.animal(target.id);
          MC.ui.markRight(tile, { speak: false });
          if (isAnimal) MC.audio.animal(target.sound);
          MC.later(function () { MC.audio.speak(pick('g.silhueta.right', { w: D.withArticle(target) })); }, isAnimal ? 800 : 200);
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= cfg.rounds) MC.ui.win('silhueta', { back: BACK });
            else build();
          }, 2300);
        } else {
          MC.ui.markWrong(tile);
        }
      }

      build();
    }
  });

})(window.MC);
