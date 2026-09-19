/* Ilha da Matematica — cinco fases por jogo.
   16. Conta e agrupa   ate 3 → ate 5 → ate 7 → dois cestos → so um tipo de fruta
   17. Maior ou menor   tamanhos → quantidades → tamanhos parecidos → entre tres → numeros
   18. Somas            ate 3 → ate 5 → ate 8 → tirar → somar e tirar, com a conta escrita */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var D = MC.data;
  var ISLAND = 'matematica';
  var BACK = '#/ilha/matematica';

  function between(r) { return r[0] + MC.rnd(r[1] - r[0] + 1); }

  var FRUIT = [
    { art: 'apple',  pl: 'maçãs',    sg: 'uma maçã' },
    { art: 'banana', pl: 'bananas',  sg: 'uma banana' },
    { art: 'carrot', pl: 'cenouras', sg: 'uma cenoura' },
    { art: 'flower', pl: 'flores',   sg: 'uma flor' }
  ];

  /* ============ 16. Conta e agrupa ============ */

  MC.registerGame({
    id: 'agrupar', island: ISLAND, icon: 'plus',
    title: 'g.agrupar', sub: 'g.agrupar.sub',
    levels: [
      { label: 'Até 3',          mode: 'one',  n: [2, 3], rounds: 2 },
      { label: 'Até 5',          mode: 'one',  n: [3, 5], rounds: 2 },
      { label: 'Até 7',          mode: 'one',  n: [5, 7], rounds: 2 },
      { label: 'Dois cestos',    mode: 'two',  n: [1, 4], rounds: 2 },
      { label: 'Só o que peço',  mode: 'kind', n: [3, 6], rounds: 2 }
    ],
    mount: function (app, cfg) {
      var round = 0, baskets = [], kind = null, prompt = '';

      var ui = MC.ui.screen({ title: t('g.agrupar'), island: ISLAND, back: BACK, dots: cfg.rounds, stageClass: 'tight', hint: cfg.label });
      app.appendChild(ui.root);
      var banner = ui.add('<div class="pill accent"><span class="bx"></span></div>');
      var field = ui.add('<div class="field" style="position:relative;width:min(94vw,860px);height:clamp(250px,50vh,440px)"></div>');
      ui.repeat(function () { return prompt; });

      function build() {
        MC.clear(field);
        baskets = [];
        var items = [];
        var BASKET_COLORS = [D.color('blue'), D.color('red')];

        if (cfg.mode === 'two') {
          var a = between(cfg.n), b = between(cfg.n);
          baskets = [{ need: a, c: BASKET_COLORS[0] }, { need: b, c: BASKET_COLORS[1] }];
          prompt = pick('g.agrupar.two', { a: a, b: b });
          for (var i = 0; i < a + b + 2; i++) items.push({ art: 'starShape', ok: true });
        } else if (cfg.mode === 'kind') {
          var pair = MC.sample(FRUIT, 2);
          kind = pair[0];
          var n = between(cfg.n);
          baskets = [{ need: n, c: D.color('orange') }];
          prompt = pick('g.agrupar.kind', { n: n, what: kind.pl });
          for (var k = 0; k < n + 2; k++) items.push({ art: kind.art, ok: true });
          for (var j = 0; j < 3; j++) items.push({ art: pair[1].art, ok: false, other: pair[1] });
        } else {
          var m = between(cfg.n);
          baskets = [{ need: m, c: D.color('orange') }];
          prompt = pick('g.agrupar.one', { n: m });
          for (var s = 0; s < m + 3; s++) items.push({ art: 'starShape', ok: true });
        }
        banner.querySelector('.bx').textContent = prompt;
        MC.later(function () { MC.audio.speak(prompt); }, 400);

        // cestos em baixo
        var row = MC.node('<div style="position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;gap:clamp(16px,6vw,80px)"></div>');
        field.appendChild(row);
        baskets.forEach(function (bk) {
          bk.count = 0;
          bk.el = MC.node(
            '<div class="basket slot" style="position:relative;width:clamp(130px,' + (baskets.length > 1 ? 22 : 30) + 'vmin,260px);' +
            'height:clamp(100px,20vmin,180px);border-radius:0 0 50% 50%/0 0 60% 60%;' +
            'background:' + bk.c.soft + ';border:6px solid ' + bk.c.hex + ';border-top-style:dashed;' +
            'display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:4px;padding:14px"></div>'
          );
          bk.badge = MC.node(
            '<div style="position:absolute;top:-38px;left:50%;transform:translateX(-50%);background:#fff;border-radius:999px;' +
            'padding:4px 14px;box-shadow:var(--shadow-s);font:800 clamp(14px,2.6vmin,20px) \'Baloo 2\',sans-serif;color:' +
            bk.c.hex + ';white-space:nowrap">0 / ' + bk.need + '</div>'
          );
          bk.el.appendChild(bk.badge);
          row.appendChild(bk.el);
        });

        // objectos espalhados na parte de cima, numa grelha com desvios
        var cells = MC.sample(MC.range(12), items.length);
        MC.shuffle(items).forEach(function (it, idx) {
          var c = cells[idx];
          var left = (c % 6) * 16 + 2 + MC.rnd(6);
          var top = Math.floor(c / 6) * 26 + MC.rnd(8);
          var el = MC.node(
            '<div class="star-piece" data-ok="' + (it.ok ? 1 : 0) + '" style="position:absolute;left:' + left + '%;top:' + top + '%;' +
            'width:clamp(38px,7vmin,60px);height:clamp(38px,7vmin,60px);color:#FFC145">' + art.svg(it.art) + '</div>'
          );
          field.appendChild(el);

          MC.drag(el, {
            zones: function () { return baskets.map(function (b) { return b.el; }); },
            radius: 140,
            onStart: function () { MC.audio.sfx.tap(); },
            onDrop: function (zone, api) {
              if (!zone) return false;
              var bk = baskets.filter(function (b) { return b.el === zone; })[0];
              var refuse = function (msg) {
                zone.classList.remove('refuse');
                void zone.offsetWidth;
                zone.classList.add('refuse');
                MC.audio.sfx.soft();
                MC.ui.mascotSay(msg, 'nudge');
                MC.audio.speak(msg);
                return false;
              };
              if (!it.ok) return refuse(pick('g.agrupar.wrongKind', { one: it.other.sg, what: kind.pl }));
              if (bk.count >= bk.need) return refuse(t('g.agrupar.full', { n: bk.need }));
              bk.count++;
              api.settleInto(zone, {
                position: 'static', left: '', top: '',
                width: 'clamp(22px,4.2vmin,36px)', height: 'clamp(22px,4.2vmin,36px)'
              });
              bk.badge.textContent = bk.count + ' / ' + bk.need;
              MC.audio.sfx.count(bk.count);
              MC.audio.speak(String(bk.count));
              if (baskets.every(function (b) { return b.count >= b.need; })) {
                MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
                MC.ui.confetti(24);
                round++;
                ui.setDots(round);
                MC.later(function () {
                  if (round >= cfg.rounds) MC.ui.win('agrupar', { back: BACK });
                  else build();
                }, 1500);
              }
              return true;
            }
          });
        });
      }

      build();
    }
  });

  /* ============ 17. Maior ou menor ============ */

  MC.registerGame({
    id: 'maior', island: ISLAND, icon: 'shapes',
    title: 'g.maior', sub: 'g.maior.sub',
    levels: [
      { label: 'Grande e pequeno',     mode: 'size',   ratio: [0.4, 0.9],  rounds: 4 },
      { label: 'Mais e menos',         mode: 'count',  rounds: 5 },
      { label: 'Tamanhos parecidos',   mode: 'size',   ratio: [0.62, 0.86], rounds: 5 },
      { label: 'Entre três',           mode: 'three',  rounds: 5 },
      { label: 'Números',              mode: 'digits', rounds: 6 }
    ],
    mount: function (app, cfg) {
      var round = 0, wantBig = true, busy = false, rightIdx = 0, q = '';

      var ui = MC.ui.screen({ title: t('g.maior'), island: ISLAND, back: BACK, dots: cfg.rounds, stageClass: 'tight', hint: cfg.label });
      app.appendChild(ui.root);
      var banner = ui.add('<div class="pill accent"><span class="bx"></span></div>');
      var row = ui.add('<div class="row" style="align-items:center;gap:clamp(14px,4vw,60px)"></div>');
      ui.repeat(function () { return busy ? null : q; });

      function build() {
        busy = false;
        MC.clear(row);
        wantBig = MC.rnd(2) === 0;
        var thing = MC.pick(['apple', 'starShape', 'flower', 'ball', 'banana', 'fish', 'duck']);
        var color = thing === 'starShape' ? '#FFC145' : '';
        var values, render;

        if (cfg.mode === 'count') {
          var a = 1 + MC.rnd(4);
          values = [a, a + 1 + MC.rnd(3)];
          q = t(wantBig ? 'g.maior.more' : 'g.maior.less');
          render = function (v) {
            var h = '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;width:100%;height:100%">';
            for (var k = 0; k < v; k++) {
              h += '<span style="width:clamp(22px,4vmin,38px);height:clamp(22px,4vmin,38px);color:' + color + '">' + art.svg(thing) + '</span>';
            }
            return h + '</div>';
          };
        } else if (cfg.mode === 'digits') {
          var x = 1 + MC.rnd(9), y;
          do { y = 1 + MC.rnd(9); } while (y === x);
          values = [x, y];
          q = t(wantBig ? 'g.maior.bigNum' : 'g.maior.smallNum');
          render = function (v) {
            return '<span style="font:800 clamp(56px,13vmin,120px) \'Baloo 2\',sans-serif;color:var(--accent)">' + v + '</span>';
          };
        } else {
          values = cfg.mode === 'three' ? [0.34, 0.6, 0.92] : [cfg.ratio[0], cfg.ratio[1]];
          q = t(wantBig ? 'g.maior.big' : 'g.maior.small');
          render = function (v) {
            var pct = Math.round(v * 100) + '%';
            return '<span style="width:' + pct + ';height:' + pct + ';color:' + color + '">' + art.svg(thing) + '</span>';
          };
        }
        values = MC.shuffle(values);
        var best = wantBig ? Math.max.apply(null, values) : Math.min.apply(null, values);
        rightIdx = values.indexOf(best);
        banner.querySelector('.bx').textContent = q;

        var box = values.length > 2 ? 'clamp(100px,22vmin,200px)' : 'clamp(120px,26vmin,240px)';
        values.forEach(function (v, i) {
          var card = MC.node(
            '<button class="card" style="width:' + box + ';height:' + box + ';display:flex;align-items:center;' +
            'justify-content:center;padding:14px;animation:bob 3s ease-in-out infinite ' + (i * 0.4) + 's">' + render(v) + '</button>'
          );
          MC.tap(card, function () { answer(i, card); });
          row.appendChild(card);
        });
        MC.later(function () { MC.audio.speak(q); }, 350);
      }

      function answer(i, card) {
        if (busy) return;
        if (i === rightIdx) {
          busy = true;
          card.style.border = '4px solid #3FB65F';
          card.style.boxShadow = '0 10px 26px rgba(63,182,95,.35)';
          MC.audio.sfx.success();
          MC.ui.confetti(18);
          MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
          MC.audio.speak(MC.i18n.praise());
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= cfg.rounds) MC.ui.win('maior', { back: BACK });
            else build();
          }, 1400);
        } else {
          card.classList.remove('wrong');
          void card.offsetWidth;
          card.classList.add('wrong');
          MC.audio.sfx.soft();
          MC.ui.mascotSay(MC.i18n.encourage(), 'nudge');
          MC.later(function () { card.classList.remove('wrong'); }, 600);
        }
      }

      build();
    }
  });

  /* ============ 18. Somas com imagens ============ */

  MC.registerGame({
    id: 'somas', island: ISLAND, icon: 'plus',
    title: 'g.somas', sub: 'g.somas.sub',
    levels: [
      { label: 'Somas até 3',     op: '+',   max: 3,  opts: 3 },
      { label: 'Somas até 5',     op: '+',   max: 5,  opts: 3 },
      { label: 'Somas até 8',     op: '+',   max: 8,  opts: 3 },
      { label: 'Tirar',           op: '-',   max: 6,  opts: 3 },
      { label: 'Somar e tirar',   op: 'mix', max: 10, opts: 4, digits: true }
    ],
    mount: function (app, cfg) {
      var ROUNDS = 5;
      var round = 0, result = 0, busy = false, op = '+', a = 0, b = 0, thing = FRUIT[0];

      var ui = MC.ui.screen({ title: t('g.somas'), island: ISLAND, back: BACK, dots: ROUNDS, stageClass: 'tight', hint: cfg.label });
      app.appendChild(ui.root);
      var eq = ui.add('<div class="card row" style="padding:clamp(12px,2.4vmin,24px);gap:clamp(8px,2vmin,22px);max-width:94vw"></div>');
      var sum = ui.add('<div class="prompt sum-line" style="letter-spacing:4px"></div>');
      var prompt = ui.add('<div class="prompt"></div>');
      var row = ui.add('<div class="row"></div>');
      var q = function () { return t(op === '-' ? 'g.somas.minus' : 'g.somas.prompt'); };
      ui.repeat(function () { return (busy || !prompt.textContent) ? null : q(); });

      function unit(extra) {
        return '<span class="unit' + (extra || '') + '" style="display:block;width:clamp(26px,4.8vmin,44px);height:clamp(26px,4.8vmin,44px)">' +
          art.svg(thing.art) + '</span>';
      }
      function group(n) {
        var h = '<div class="grp" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:clamp(90px,18vmin,200px)">';
        for (var i = 0; i < n; i++) h += unit();
        return h + '</div>';
      }
      function sign(s) {
        return '<div class="sign" style="font:800 clamp(26px,5vmin,46px) \'Baloo 2\',sans-serif;color:var(--accent)">' + s + '</div>';
      }

      function build() {
        busy = false;
        MC.clear(eq); MC.clear(row);
        prompt.textContent = '';
        sum.textContent = '';
        thing = MC.pick(FRUIT);
        op = cfg.op === 'mix' ? (MC.rnd(2) ? '+' : '-') : cfg.op;

        if (op === '+') {
          a = 1 + MC.rnd(cfg.max - 1);
          b = 1 + MC.rnd(Math.max(1, cfg.max - a));
          result = a + b;
          eq.appendChild(MC.node(group(a)));
          eq.appendChild(MC.node(sign('+')));
          eq.appendChild(MC.node(group(b)));
          MC.later(merge, 800);
        } else {
          a = 2 + MC.rnd(cfg.max - 1);
          b = 1 + MC.rnd(a - 1);
          result = a - b;
          eq.appendChild(MC.node(group(a)));
          MC.audio.speak(pick('g.somas.had', { n: a, what: thing.pl }));
          MC.later(takeAway, 1600);
        }
        if (cfg.digits) sum.textContent = a + ' ' + (op === '+' ? '+' : '−') + ' ' + b + ' = ?';
      }

      // soma: os dois grupos juntam-se e contam-se
      function merge() {
        var plus = eq.querySelector('.sign');
        var groups = MC.qsa('.grp', eq);
        MC.audio.sfx.whoosh();
        if (plus && plus.animate) plus.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
        groups.forEach(function (g, i) {
          if (g.animate) g.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + (i ? -16 : 16) + 'px)' }],
            { duration: 500, easing: 'ease-out', fill: 'forwards' });
        });
        MC.later(function () { bounceAll(MC.qsa('.unit', eq), showOptions); }, 550);
      }

      // tirar: alguns vao-se embora e ficam so em sombra
      function takeAway() {
        var units = MC.qsa('.unit', eq);
        var gone = units.slice(units.length - b);
        MC.audio.sfx.whoosh();
        MC.audio.speak(pick('g.somas.away', { n: b }));
        gone.forEach(function (u, i) {
          MC.later(function () {
            if (u.animate) {
              u.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-22px)', opacity: 0.18 }],
                { duration: 500, fill: 'forwards' });
            } else u.style.opacity = '0.18';
            u.classList.add('gone');
          }, i * 220);
        });
        MC.later(function () {
          bounceAll(units.filter(function (u) { return gone.indexOf(u) === -1; }), showOptions);
        }, gone.length * 220 + 1400);
      }

      function bounceAll(list, then) {
        list.forEach(function (u, i) {
          MC.later(function () {
            MC.audio.sfx.count(i);
            if (u.animate) u.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-12px)' }, { transform: 'translateY(0)' }], { duration: 320 });
          }, i * 240);
        });
        MC.later(then, list.length * 240 + 250);
      }

      function showOptions() {
        prompt.textContent = q();
        MC.audio.speak(q());
        var choices = [result];
        while (choices.length < cfg.opts) {
          var c = MC.clamp(result + (MC.rnd(5) - 2), 0, 12);
          if (choices.indexOf(c) === -1) choices.push(c);
        }
        MC.clear(row);
        MC.shuffle(choices).forEach(function (n) {
          var tile = MC.node(MC.ui.tileHtml('<span class="glyph">' + n + '</span>', null, '--tile:clamp(64px,11vmin,104px)'));
          MC.tap(tile, function () { check(n, tile); });
          row.appendChild(tile);
        });
      }

      function check(n, tile) {
        if (busy) return;
        if (n === result) {
          busy = true;
          MC.ui.markRight(tile, { say: pick(op === '-' ? 'g.somas.rightMinus' : 'g.somas.right', { n: result, what: thing.pl }) });
          if (cfg.digits) sum.textContent = a + ' ' + (op === '+' ? '+' : '−') + ' ' + b + ' = ' + result;
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= ROUNDS) MC.ui.win('somas', { back: BACK });
            else build();
          }, 1900);
        } else {
          MC.ui.markWrong(tile);
        }
      }

      build();
    }
  });

})(window.MC);
