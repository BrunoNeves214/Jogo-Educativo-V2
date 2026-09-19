/* Ilha do Vocabulario — cinco fases por jogo.
   13. Aponta o objeto    2 → 4 → 6 imagens → adivinhas ("o que usamos para beber?") → dois de seguida
   14. Imagem e palavra   2 → 3 palavras → palavras parecidas (GATO/PATO/RATO) → 4 → 5
   15. Historias          cinco historias, cada vez mais compridas */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var D = MC.data;
  var ISLAND = 'vocabulario';
  var BACK = '#/ilha/vocabulario';

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ============ 13. Aponta o objeto ============ */

  MC.registerGame({
    id: 'aponta', island: ISLAND, icon: 'chat',
    title: 'g.aponta', sub: 'g.aponta.sub',
    levels: [
      { label: 'Duas imagens',      mode: 'name', n: 2, cols: 2, rounds: 5 },
      { label: 'Quatro imagens',    mode: 'name', n: 4, cols: 2, rounds: 5 },
      { label: 'Seis imagens',      mode: 'name', n: 6, cols: 3, rounds: 6 },
      { label: 'Adivinhas',         mode: 'clue', n: 4, cols: 2, rounds: 6 },
      { label: 'Dois de seguida',   mode: 'two',  n: 6, cols: 3, rounds: 5 }
    ],
    mount: function (app, cfg) {
      var round = 0, targets = [], step = 0, busy = false;

      var ui = MC.ui.screen({ title: t('g.aponta'), island: ISLAND, back: BACK, dots: cfg.rounds, stageClass: 'tight', hint: cfg.label });
      app.appendChild(ui.root);

      var banner = ui.add('<button class="pill accent"><span class="bx"></span></button>');
      var size = cfg.n > 4 ? 'clamp(84px,17vmin,170px)' : 'clamp(96px,20vmin,200px)';
      var grid = ui.add('<div class="grid" style="grid-template-columns:repeat(' + cfg.cols + ',' + size + ')"></div>');

      function phrase() {
        var a = targets[0];
        if (cfg.mode === 'clue') return pick('g.aponta.clue', { c: a.clue });
        if (cfg.mode === 'two') {
          return pick('g.aponta.two', { a: D.withArticle(targets[0]), b: D.withArticle(targets[1]) })
            .replace(/em o /g, 'no ').replace(/em a /g, 'na ');
        }
        return pick(a.g === 'f' ? 'g.aponta.F' : 'g.aponta.M', { w: D.nameOf(a) });
      }
      function ask() { MC.audio.sfx.tap(); MC.audio.speak(phrase(), { force: true }); }
      MC.tap(banner, ask);
      ui.repeat(function () { return busy || !targets.length ? null : phrase(); });

      function build() {
        busy = false; step = 0;
        MC.clear(grid);
        var pool = D.OBJECTS.filter(function (o) { return o.id !== 'sea'; }).concat(D.ANIMALS);
        var opts = MC.sample(pool, cfg.n);
        targets = MC.sample(opts, cfg.mode === 'two' ? 2 : 1);
        banner.querySelector('.bx').textContent = cap(phrase());

        opts.forEach(function (o) {
          var tile = MC.node(MC.ui.tileHtml(art.svg(o.id), null, '--tile:' + size));
          MC.tap(tile, function () { answer(o, tile); });
          grid.appendChild(tile);
        });
        MC.later(ask, 450);
      }

      function answer(o, tile) {
        if (busy) return;
        if (o.id === targets[step].id) {
          if (step === 0 && targets.length > 1) {
            // primeiro de dois: fica marcado com um 1
            step = 1;
            MC.audio.sfx.pop();
            tile.classList.add('right');
            tile.appendChild(MC.node('<div class="check" style="font:800 16px \'Baloo 2\';color:#fff">1</div>'));
            MC.audio.speak(pick('g.aponta.then', { b: D.withArticle(targets[1]) }));
            return;
          }
          busy = true;
          MC.ui.markRight(tile, { say: pick('g.aponta.right', { w: D.withArticle(o) }) });
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= cfg.rounds) MC.ui.win('aponta', { back: BACK });
            else build();
          }, 1700);
        } else if (step === 0 && targets[1] && o.id === targets[1].id) {
          MC.ui.markWrong(tile, { message: pick('g.aponta.first', { a: D.withArticle(targets[0]) }), speak: true });
        } else {
          MC.ui.markWrong(tile);
          MC.later(ask, 900);
        }
      }

      build();
    }
  });

  /* ============ 14. Associar imagem-palavra ============ */

  var SHORT = ['SOL', 'LUA', 'MAR', 'GATO', 'PATO', 'BOLA', 'CASA', 'VACA'];

  MC.registerGame({
    id: 'palavra', island: ISLAND, icon: 'book',
    title: 'g.palavra', sub: 'g.palavra.sub',
    levels: [
      { label: 'Duas palavras',        n: 2, pool: 'short', boards: 2 },
      { label: 'Três palavras',        n: 3, pool: 'short', boards: 2 },
      { label: 'Palavras parecidas',   n: 3, pool: 'similar', boards: 2 },
      { label: 'Quatro palavras',      n: 4, pool: 'all', boards: 2 },
      { label: 'Cinco palavras',       n: 5, pool: 'all', boards: 2 }
    ],
    mount: function (app, cfg) {
      var board = 0, done = 0, usedSets = [];

      var ui = MC.ui.screen({ title: t('g.palavra'), island: ISLAND, back: BACK, dots: cfg.boards, stageClass: 'tight', hint: cfg.label });
      app.appendChild(ui.root);
      ui.repeat(function () { return t('g.palavra.prompt'); });

      var small = cfg.n >= 4;
      var el = ui.add(
        '<div class="board" style="position:relative;display:flex;align-items:center;' +
        'justify-content:space-between;gap:clamp(30px,10vw,140px);width:min(92vw,760px)">' +
          '<svg class="lines" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1"></svg>' +
          '<div class="words" style="display:flex;flex-direction:column;gap:clamp(8px,' + (small ? '1.4' : '2.4') + 'vh,26px);z-index:2"></div>' +
          '<div class="pics" style="display:flex;flex-direction:column;gap:clamp(8px,' + (small ? '1.4' : '2.4') + 'vh,26px);z-index:2"></div>' +
        '</div>'
      );
      var lines = el.querySelector('.lines');
      var words = el.querySelector('.words');
      var pics = el.querySelector('.pics');

      function chooseWords() {
        if (cfg.pool === 'similar') {
          var sets = D.LOOKALIKE_WORDS.filter(function (s) { return usedSets.indexOf(s) === -1; });
          var set = MC.pick(sets.length ? sets : D.LOOKALIKE_WORDS);
          usedSets.push(set);
          return set.map(D.word).filter(Boolean).slice(0, cfg.n);
        }
        var pool = cfg.pool === 'short' ? SHORT.map(D.word) : D.WORDS;
        return MC.sample(pool, cfg.n);
      }

      function build() {
        done = 0;
        MC.clear(words); MC.clear(pics); MC.clear(lines);
        var chosen = chooseWords();
        var picSize = small ? 'clamp(54px,9.5vmin,96px)' : 'clamp(66px,12vmin,112px)';

        MC.shuffle(chosen).forEach(function (w) {
          pics.appendChild(MC.node(
            '<div class="pic" data-id="' + w.id + '" style="width:' + picSize + ';height:' + picSize + ';' +
            'border-radius:22px;background:#fff;box-shadow:var(--shadow-m);display:flex;align-items:center;' +
            'justify-content:center;padding:10px">' + art.svg(w.id) + '</div>'
          ));
        });

        chosen.forEach(function (w) {
          var card = MC.node(
            '<div class="word" data-id="' + w.id + '" style="min-width:clamp(96px,17vmin,170px);padding:clamp(8px,' +
            (small ? '1.4' : '2') + 'vmin,18px) 14px;text-align:center;background:#fff;border-radius:18px;box-shadow:var(--shadow-m);' +
            'font-family:\'Baloo 2\',sans-serif;font-weight:800;letter-spacing:2px;' +
            'font-size:clamp(16px,' + (small ? '2.8' : '3.2') + 'vmin,28px)">' + MC.esc(w.pt) + '</div>'
          );
          words.appendChild(card);

          MC.drag(card, {
            zones: function () { return MC.qsa('.pic', pics); },
            radius: 110,
            onStart: function () { MC.audio.sfx.tap(); MC.audio.speak(w.pt); },
            onDrop: function (zone) {
              if (!zone) return false;
              if (zone.dataset.id === w.id) {
                drawLine(card, zone);
                card.dataset.locked = '1';
                card.classList.remove('draggable');
                [card, zone].forEach(function (x) {
                  x.style.border = '4px solid var(--accent)';
                  x.style.boxShadow = '0 10px 22px rgba(78,168,222,.3)';
                });
                MC.audio.sfx.success();
                MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
                MC.ui.confetti(8);
                done++;
                if (done >= chosen.length) {
                  board++;
                  ui.setDots(board);
                  MC.later(function () {
                    if (board >= cfg.boards) MC.ui.win('palavra', { back: BACK });
                    else build();
                  }, 1300);
                }
                return false; // volta ao lugar, mas ja com a ligacao feita
              }
              MC.audio.sfx.soft();
              MC.ui.mascotSay(MC.i18n.encourage(), 'nudge');
              return false;
            }
          });
        });
        MC.later(function () { MC.audio.speak(t('g.palavra.prompt')); }, 400);
      }

      function drawLine(a, b) {
        var br = el.getBoundingClientRect();
        var ar = a.getBoundingClientRect();
        var brr = b.getBoundingClientRect();
        var x1 = ar.right - br.left, y1 = ar.top + ar.height / 2 - br.top;
        var x2 = brr.left - br.left, y2 = brr.top + brr.height / 2 - br.top;
        lines.setAttribute('viewBox', '0 0 ' + br.width + ' ' + br.height);
        var mid = (x1 + x2) / 2;
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M' + x1 + ' ' + y1 + ' C' + mid + ' ' + y1 + ',' + mid + ' ' + y2 + ',' + x2 + ' ' + y2);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#4EA8DE');
        path.setAttribute('stroke-width', '5');
        path.setAttribute('stroke-linecap', 'round');
        lines.appendChild(path);
        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        if (path.animate) {
          path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 450, easing: 'ease-out', fill: 'forwards' });
        } else {
          path.style.strokeDashoffset = 0;
        }
      }

      build();
    }
  });

  /* ============ 15. Historias interativas ============ */

  var SCENES = {
    forest:
      '<rect width="900" height="380" fill="#DCEFFC"/>' +
      '<ellipse cx="150" cy="60" rx="58" ry="22" fill="#fff" opacity=".85"/>' +
      '<ellipse cx="700" cy="84" rx="46" ry="18" fill="#fff" opacity=".7"/>' +
      '<circle cx="808" cy="62" r="30" fill="#FFC145"/>' +
      '<path d="M0 250 Q450 216 900 250 L900 380 L0 380Z" fill="#B6E3A6"/>' +
      '<rect x="112" y="212" width="18" height="60" rx="4" fill="#8B5E34"/>' +
      '<path d="M121 112 L177 214 L65 214Z" fill="#57A566"/>' +
      '<rect x="760" y="222" width="16" height="52" rx="4" fill="#8B5E34"/>' +
      '<path d="M768 140 L812 224 L724 224Z" fill="#4E9A5C"/>' +
      '<ellipse cx="420" cy="296" rx="52" ry="20" fill="#9FD692"/>',
    home:
      '<rect width="900" height="380" fill="#FFF3EF"/>' +
      '<rect x="0" y="280" width="900" height="100" fill="#E8C9A0"/>' +
      '<rect x="120" y="96" width="180" height="140" rx="10" fill="#DCEFFC" stroke="#C9C6DC" stroke-width="6"/>' +
      '<path d="M120 166 h180 M210 96 v140" stroke="#C9C6DC" stroke-width="6"/>' +
      '<rect x="600" y="180" width="200" height="100" rx="10" fill="#FFB3C6"/>' +
      '<rect x="620" y="150" width="60" height="34" rx="8" fill="#FFFFFF"/>' +
      '<circle cx="470" cy="118" r="26" fill="#FFC145" opacity=".7"/>',
    sea:
      '<rect width="900" height="380" fill="#BFE9E4"/>' +
      '<circle cx="120" cy="64" r="34" fill="#FFC145"/>' +
      '<path d="M0 170 Q225 140 450 170 T900 170 L900 380 L0 380Z" fill="#4EA8DE"/>' +
      '<path d="M0 220 Q225 196 450 220 T900 220" fill="none" stroke="#7FC4EA" stroke-width="8"/>' +
      '<path d="M0 340 Q450 316 900 340 L900 380 L0 380Z" fill="#F4E0B9"/>',
    night:
      '<rect width="900" height="380" fill="#2B2A4A"/>' +
      '<g fill="#FFD976"><circle cx="90" cy="60" r="4"/><circle cx="220" cy="120" r="3"/><circle cx="360" cy="50" r="4"/>' +
      '<circle cx="540" cy="90" r="3"/><circle cx="660" cy="40" r="4"/><circle cx="820" cy="130" r="3"/><circle cx="740" cy="200" r="3"/></g>' +
      '<circle cx="780" cy="80" r="40" fill="#F6F1D5"/><circle cx="796" cy="70" r="36" fill="#2B2A4A"/>' +
      '<path d="M0 270 Q450 236 900 270 L900 380 L0 380Z" fill="#3E5C4E"/>' +
      '<rect x="120" y="222" width="18" height="60" rx="4" fill="#5A3E24"/>' +
      '<path d="M129 130 L185 230 L73 230Z" fill="#2F4F3F"/>',
    farm:
      '<rect width="900" height="380" fill="#DCEFFC"/>' +
      '<circle cx="110" cy="70" r="34" fill="#FFC145"/>' +
      '<path d="M0 240 Q450 210 900 240 L900 380 L0 380Z" fill="#9FD692"/>' +
      '<rect x="650" y="120" width="170" height="150" fill="#E0543E"/>' +
      '<path d="M636 126 L735 60 L834 126Z" fill="#B23B2B"/>' +
      '<rect x="712" y="190" width="46" height="80" fill="#FFF3DC"/>' +
      '<path d="M712 190l46 80M758 190l-46 80" stroke="#E0543E" stroke-width="6"/>' +
      '<path d="M40 300 h260" stroke="#C99A5E" stroke-width="8"/><path d="M60 270v60M140 270v60M220 270v60M290 270v60" stroke="#C99A5E" stroke-width="8"/>'
  };

  MC.registerGame({
    id: 'historias', island: ISLAND, icon: 'book',
    title: 'g.historias', sub: 'g.historias.sub',
    levels: D.STORIES.map(function (s) { return { label: s.title, story: s.id }; }),
    mount: function (app, cfg) {
      var story = D.STORIES.filter(function (s) { return s.id === cfg.story; })[0] || D.STORIES[0];

      var ui = MC.ui.screen({ title: story.title, island: ISLAND, back: BACK, stageClass: 'tight', noMascot: true });
      app.appendChild(ui.root);
      var holder = ui.add('<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.6vh,18px)"></div>');

      function showNode(key) {
        var node = story.nodes[key];
        var text = node.pt;
        MC.clear(holder);

        var actorSvg = node.actor === 'mascot' ? art.svg('mascot') : art.svg(node.actor);
        var scene = MC.node(
          '<div class="card" style="position:relative;width:min(94vw,860px);padding:0;overflow:hidden">' +
            '<svg viewBox="0 0 900 380" style="width:100%;height:auto;display:block">' + SCENES[node.bg] + '</svg>' +
            '<div class="actor" style="position:absolute;left:44%;bottom:12%;width:clamp(60px,12vmin,130px)">' + actorSvg + '</div>' +
          '</div>'
        );
        holder.appendChild(scene);
        var actor = scene.querySelector('.actor');
        if (actor.animate) {
          actor.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-12px)' }, { transform: 'translateY(0)' }],
            { duration: 2200, iterations: Infinity, easing: 'ease-in-out' });
        }

        holder.appendChild(MC.node(
          '<div style="background:#2B2A4A;color:#fff;border-radius:20px;padding:clamp(12px,2.2vh,20px) clamp(16px,3vw,32px);' +
          'text-align:center;font-size:clamp(13px,2.2vmin,18px);max-width:min(94vw,860px)">' + MC.esc(text) + '</div>'
        ));

        var tools = MC.node('<div class="row"></div>');
        var replay = MC.node('<button class="btn">' + art.svg('speaker', { color: 'var(--ink-soft)' }) +
          '<span>' + MC.esc(t('ui.listenAgain')) + '</span></button>');
        MC.tap(replay, function () { MC.audio.speak(text, { force: true, rate: 0.88 }); });
        tools.appendChild(replay);
        holder.appendChild(tools);

        MC.later(function () { MC.audio.speak(text, { rate: 0.88 }); }, 350);
        ui.repeat(node.end ? function () { return null; } : function () { return text; });

        if (node.end) {
          holder.appendChild(MC.node('<div class="pill accent">' + MC.esc(t('g.historias.end')) + '</div>'));
          MC.later(function () { MC.ui.win('historias', { back: BACK }); }, Math.min(8000, 1800 + text.length * 75));
          return;
        }

        var choices = MC.node('<div class="row"></div>');
        (node.choices || []).forEach(function (c) {
          var btn = MC.node(
            '<button class="btn" style="background:#fff">' +
            '<span style="width:1.8em;height:1.8em;display:inline-flex">' + art.svg(c.art) + '</span>' +
            '<span>' + MC.esc(c.pt) + '</span></button>'
          );
          MC.tap(btn, function () {
            MC.audio.sfx.tap();
            MC.audio.speak(c.pt);
            MC.later(function () { showNode(c.next); }, 700);
          });
          choices.appendChild(btn);
        });
        holder.appendChild(choices);
      }

      showNode(story.start);
    }
  });

})(window.MC);
