/* Ilha das Rotinas — cinco fases por jogo.
   22. Sequencia do dia     3 passos → manha → noite → como cresce uma flor → o dia inteiro
   23. Veste-te p/ o tempo  2 opcoes → 3 → 4 → escolhe duas coisas → escolhe tres coisas */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var D = MC.data;
  var ISLAND = 'rotinas';
  var BACK = '#/ilha/rotinas';

  /* ============ 22. Sequencia do dia ============ */

  MC.registerGame({
    id: 'higiene', island: ISLAND, icon: 'checklist',
    title: 'g.higiene', sub: 'g.higiene.sub',
    levels: [
      { label: 'Três passos',            routines: ['manha3', 'noite3'] },
      { label: 'De manhã',               routines: ['manha'] },
      { label: 'À noite',                routines: ['noite'] },
      { label: 'Como cresce uma flor',   routines: ['flor'] },
      { label: 'O dia inteiro',          routines: ['dia'] }
    ],
    mount: function (app, cfg) {
      var idx = 0, placed = 0, steps = [];

      var ui = MC.ui.screen({
        title: t('g.higiene'), island: ISLAND, back: BACK, hint: cfg.label, stageClass: 'tight',
        dots: cfg.routines.length > 1 ? cfg.routines.length : 0
      });
      app.appendChild(ui.root);
      ui.repeat(function () { return t('g.higiene.prompt'); });

      var tray = ui.add('<div class="row" style="min-height:clamp(84px,15vmin,124px)"></div>');
      var line = ui.add('<div class="card row" style="padding:clamp(10px,2.2vmin,22px);gap:clamp(6px,1.6vmin,18px);align-items:center;max-width:96vw"></div>');

      function build() {
        placed = 0;
        MC.clear(tray); MC.clear(line);
        steps = D.ROUTINES[cfg.routines[idx]];
        var n = steps.length;
        var s = n > 4 ? 'clamp(62px,11vmin,110px)' : 'clamp(72px,14vmin,124px)';
        var size = 'width:' + s + ';height:' + s;

        steps.forEach(function (st, i) {
          line.appendChild(MC.node(
            '<div class="slot step-slot" data-i="' + i + '" style="' + size +
            ';border-radius:18px;background:#FDF2E8;border:4px dashed var(--accent);' +
            'display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative">' +
            '<span style="position:absolute;top:-12px;left:-8px;width:26px;height:26px;border-radius:50%;z-index:2;' +
            'background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;' +
            'font:800 13px \'Baloo 2\',sans-serif">' + (i + 1) + '</span></div>'
          ));
          if (i < n - 1) {
            line.appendChild(MC.node(
              '<span style="color:var(--ink-ghost);width:clamp(10px,2vmin,20px)"><svg viewBox="0 0 24 24">' +
              '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
            ));
          }
        });

        MC.shuffle(steps.map(function (st, i) { return { st: st, i: i }; })).forEach(function (o) {
          var card = MC.node(
            '<div class="step-card" data-i="' + o.i + '" style="' + size +
            ';border-radius:18px;background:#fff;box-shadow:0 10px 18px rgba(43,42,74,.16);' +
            'display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px">' +
            '<span style="width:58%;height:58%;display:flex">' + art.svg(o.st.art) + '</span>' +
            '<span style="font-weight:700;font-size:clamp(8px,1.5vmin,12px);color:var(--ink-soft);text-align:center;' +
            'margin-top:3px;line-height:1.1">' + MC.esc(o.st.pt) + '</span></div>'
          );
          tray.appendChild(card);

          MC.drag(card, {
            zones: function () { return MC.qsa('.step-slot', line); },
            radius: 100,
            onStart: function () { MC.audio.sfx.tap(); MC.audio.speak(o.st.pt); },
            onDrop: function (zone, api) {
              if (!zone) return false;
              if (parseInt(zone.dataset.i, 10) === o.i) {
                zone.dataset.full = '1';
                zone.style.borderStyle = 'solid';
                zone.style.background = '#fff';
                api.settleInto(zone, { width: '100%', height: '100%', boxShadow: 'none' });
                MC.audio.sfx.snap();
                MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
                MC.ui.confetti(8);
                placed++;
                if (placed >= steps.length) finished();
                return true;
              }
              zone.classList.remove('refuse');
              void zone.offsetWidth;
              zone.classList.add('refuse');
              MC.audio.sfx.soft();
              var msg = zone.dataset.full ? MC.i18n.encourage() : pick('g.higiene.order', { n: +zone.dataset.i + 1 });
              MC.ui.mascotSay(msg, 'nudge');
              return false;
            }
          });
        });
        MC.later(function () { MC.audio.speak(t('g.higiene.prompt')); }, 400);
      }

      // no fim, a sequencia e contada em voz alta como uma pequena historia
      function finished() {
        var story = steps.map(function (s, k) {
          return (k === 0 ? t('g.higiene.first') : (k === steps.length - 1 ? t('g.higiene.last') : t('g.higiene.then'))) + ' ' + s.pt;
        }).join(', ') + '.';
        MC.later(function () { MC.audio.speak(story); }, 400);
        idx++;
        if (cfg.routines.length > 1) ui.setDots(idx);
        MC.later(function () {
          if (idx >= cfg.routines.length) MC.ui.win('higiene', { back: BACK });
          else build();
        }, 1500 + story.length * 70);
      }

      build();
    }
  });

  /* ============ 23. Veste-te conforme o tempo ============ */

  MC.registerGame({
    id: 'tempo', island: ISLAND, icon: 'checklist',
    title: 'g.tempo', sub: 'g.tempo.sub',
    levels: [
      { label: 'Sol ou chuva',          weathers: ['sun', 'rain'],          opts: 2, pick: 1, rounds: 4 },
      { label: 'Sol, chuva ou frio',    weathers: ['sun', 'rain', 'cold'],  opts: 3, pick: 1, rounds: 5 },
      { label: 'Mais roupa à escolha',  weathers: ['sun', 'rain', 'cold'],  opts: 4, pick: 1, rounds: 5 },
      { label: 'Escolhe duas coisas',   weathers: ['sun', 'rain', 'cold'],  opts: 4, pick: 2, rounds: 4 },
      { label: 'Escolhe três coisas',   weathers: ['sun', 'rain', 'cold'],  opts: 6, pick: 3, rounds: 4 }
    ],
    mount: function (app, cfg) {
      var round = 0, scene = null, busy = false, got = 0, last = null;

      var ui = MC.ui.screen({ title: t('g.tempo'), island: ISLAND, back: BACK, dots: cfg.rounds, stageClass: 'tight', hint: cfg.label });
      app.appendChild(ui.root);

      var sky = ui.add('<div class="sky" style="position:relative;height:clamp(80px,16vmin,150px);width:clamp(160px,30vmin,280px);display:flex;align-items:center;justify-content:center"></div>');
      var prompt = ui.add('<div class="prompt"></div>');
      var row = ui.add('<div class="row" style="max-width:min(94vw,760px)"></div>');

      function phrase() {
        var base = t(scene.key);
        return cfg.pick > 1 ? base + ' ' + pick('g.tempo.pickN', { n: cfg.pick === 2 ? 'duas' : 'três' }) : base + ' ' + t('g.tempo.pick1');
      }
      ui.repeat(function () { return busy || !scene ? null : phrase(); });

      function build() {
        busy = false; got = 0;
        MC.clear(sky); MC.clear(row);
        var ws = cfg.weathers.map(function (id) { return D.WEATHER.filter(function (w) { return w.id === id; })[0]; });
        // com tres escolhas certas, so serve um tempo que tenha tres pecas certas
        var ok = ws.filter(function (w) {
          return D.WEAR.filter(function (x) { return x.ok.indexOf(w.id) !== -1; }).length >= cfg.pick && w !== last;
        });
        scene = MC.pick(ok.length ? ok : ws);
        last = scene;
        prompt.textContent = phrase();

        var icon = MC.node('<div style="width:clamp(70px,13vmin,124px);height:clamp(70px,13vmin,124px)">' + art.svg(scene.icon) + '</div>');
        sky.appendChild(icon);
        if (scene.id === 'rain' || scene.id === 'cold') {
          MC.range(5).forEach(function (i) {
            var drop = MC.node(
              '<div style="position:absolute;left:' + (22 + i * 13) + '%;top:56%;width:' + (scene.id === 'rain' ? '8px;height:16px;border-radius:0 0 8px 8px;background:#4EA8DE' : '10px;height:10px;border-radius:50%;background:#DCEFFC;box-shadow:0 0 0 2px #9BD3F0') + ';opacity:.85"></div>'
            );
            sky.appendChild(drop);
            if (drop.animate) {
              drop.animate([{ transform: 'translateY(0)', opacity: 0.9 }, { transform: 'translateY(44px)', opacity: 0 }],
                { duration: scene.id === 'rain' ? 900 : 1800, delay: i * 180, iterations: Infinity });
            }
          });
        } else if (icon.animate) {
          icon.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 26000, iterations: Infinity });
        }

        var right = D.WEAR.filter(function (x) { return x.ok.indexOf(scene.id) !== -1; });
        var wrong = D.WEAR.filter(function (x) { return x.ok.indexOf(scene.id) === -1; });
        var opts = MC.sample(right, cfg.pick).concat(MC.sample(wrong, cfg.opts - cfg.pick));

        MC.shuffle(opts).forEach(function (o) {
          var isRight = o.ok.indexOf(scene.id) !== -1;
          var tile = MC.node(
            '<button class="card" style="width:clamp(86px,15vmin,150px);padding:clamp(8px,1.6vmin,16px);' +
            'display:flex;flex-direction:column;align-items:center;gap:6px">' +
            '<span style="width:clamp(40px,7.4vmin,68px);height:clamp(40px,7.4vmin,68px)">' + art.svg(o.art) + '</span>' +
            '<span style="font-family:\'Baloo 2\',sans-serif;font-weight:700;font-size:clamp(11px,1.8vmin,15px)">' + MC.esc(o.pt) + '</span></button>'
          );
          MC.tap(tile, function () { answer(o, isRight, tile); });
          row.appendChild(tile);
        });
        MC.later(function () { MC.audio.speak(phrase()); }, 400);
      }

      function answer(o, isRight, tile) {
        if (busy || tile.dataset.done) return;
        if (isRight) {
          tile.dataset.done = '1';
          tile.style.border = '4px solid #3FB65F';
          tile.style.boxShadow = '0 10px 26px rgba(63,182,95,.35)';
          got++;
          if (got < cfg.pick) {
            MC.audio.sfx.pop();
            MC.audio.speak(pick('g.tempo.more', { w: o.pt }));
            return;
          }
          busy = true;
          MC.audio.sfx.success();
          MC.ui.confetti(18);
          MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
          MC.audio.speak(pick('g.tempo.right', { w: o.pt }));
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= cfg.rounds) MC.ui.win('tempo', { back: BACK });
            else build();
          }, 1800);
        } else {
          tile.classList.remove('wrong');
          void tile.offsetWidth;
          tile.classList.add('wrong');
          MC.audio.sfx.soft();
          var msg = pick('g.tempo.wrong_' + scene.id, { w: o.pt });
          MC.ui.mascotSay(msg, 'nudge');
          MC.audio.speak(msg);
          MC.later(function () { tile.classList.remove('wrong'); }, 600);
        }
      }

      build();
    }
  });

})(window.MC);
