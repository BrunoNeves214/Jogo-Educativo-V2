/* Ilha das Letras e Numeros — cinco fases por jogo.
   1. Ouve e toca       vogais → consoantes → numeros → letras parecidas → minusculas
   2. Desenha a letra   rectas → inclinadas → curvas → mistas → as mais dificeis
   3. Puzzle            sequencias do alfabeto → palavras com imagem → com pecas a mais
   4. Conta e escolhe   em fila → espalhados → contar so um tipo no meio de outros */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var D = MC.data;
  var ISLAND = 'letras';
  var BACK = '#/ilha/letras';

  // como se diz em voz alta: "a letra bê", "o número três"
  function spoken(ch, lower) {
    if (/[0-9]/.test(ch)) return { k: 'N', x: ch };
    var name = MC.audio.letterName(ch);
    return { k: 'L', x: lower ? name + ' pequenina' : name };
  }

  function nextOrWin(state, cfgRounds, id, build) {
    state.round++;
    state.ui.setDots(state.round);
    MC.later(function () {
      if (state.round >= cfgRounds) MC.ui.win(id, { back: BACK });
      else build();
    }, 1500);
  }

  /* ============ 1. Ouve e toca ============ */

  MC.registerGame({
    id: 'choice', island: ISLAND, icon: 'speaker',
    title: 'g.choice', sub: 'g.choice.sub',
    levels: [
      { label: 'Vogais',               pool: 'AEIOU',          opts: 3, rounds: 5 },
      { label: 'Consoantes',           pool: 'BCDFGLMNPRSTV',  opts: 3, rounds: 6 },
      { label: 'Números',              pool: '123456789',      opts: 4, rounds: 6 },
      { label: 'Letras parecidas',     pairs: ['EF', 'MN', 'OQ', 'PR', 'CG', 'IL', 'UV', 'BD'], opts: 4, rounds: 6 },
      { label: 'Letras pequeninas',    pool: 'abdefgilmnoprstu', opts: 5, rounds: 8, lower: true }
    ],
    mount: function (app, cfg) {
      var st = { round: 0 };
      var streak = 0, target = null, busy = false, last = null;

      st.ui = MC.ui.screen({ title: t('g.choice'), island: ISLAND, back: BACK, dots: cfg.rounds, hint: cfg.label });
      app.appendChild(st.ui.root);

      var spk = st.ui.add('<div>' + MC.ui.speakerHtml() + '</div>').firstElementChild;
      var row = st.ui.add('<div class="row"></div>');

      function phrase() {
        var s = spoken(target, cfg.lower);
        return pick('g.choice.' + s.k, { x: s.x });
      }
      function sayTarget() { MC.audio.sfx.tap(); MC.audio.speak(phrase(), { force: true }); }

      MC.tap(spk, sayTarget);
      st.ui.repeat(function () { return busy || !target ? null : phrase(); });

      function build() {
        busy = false;
        MC.clear(row);
        // depois de 3 acertos seguidos aparece mais uma opcao
        var n = Math.min(cfg.opts + (streak >= 3 ? 1 : 0), 6);
        var opts;
        do {
          if (cfg.pairs) {
            var pair = MC.pick(cfg.pairs).split('');
            target = MC.pick(pair);
            opts = MC.shuffle(pair.concat(MC.sample(D.LETTERS, n - 2, pair)));
          } else {
            opts = MC.sample(cfg.pool.split(''), Math.min(n, cfg.pool.length));
            target = MC.pick(opts);
          }
        } while (target === last);
        last = target;

        opts.forEach(function (ch) {
          var tile = MC.node(MC.ui.tileHtml('<span class="glyph">' + ch + '</span>'));
          MC.tap(tile, function () { answer(ch, tile); });
          row.appendChild(tile);
        });
        MC.later(sayTarget, 450);
      }

      function answer(ch, tile) {
        if (busy) return;
        if (ch === target) {
          busy = true;
          streak++;
          var s = spoken(target, cfg.lower);
          MC.ui.markRight(tile, { say: pick('g.choice.right' + s.k, { x: s.x }) });
          MC.qsa('.tile', row).forEach(function (el) { if (el !== tile) el.classList.add('dim'); });
          nextOrWin(st, cfg.rounds, 'choice', build);
        } else {
          streak = 0;
          MC.ui.markWrong(tile);
          MC.later(sayTarget, 1100);
        }
      }

      build();
    }
  });

  /* ============ 2. Desenha a letra ============ */

  MC.registerGame({
    id: 'tracing', island: ISLAND, icon: 'pencil',
    title: 'g.tracing', sub: 'g.tracing.sub',
    levels: [
      { label: 'Linhas direitas',   chars: 'ILTHEF1',      count: 3, tol: 52 },
      { label: 'Linhas inclinadas', chars: 'AVNMZXK47',    count: 4, tol: 48 },
      { label: 'Curvas',            chars: 'OCUSJ0Q',      count: 4, tol: 46 },
      { label: 'Letras mistas',     chars: 'BDPRGWY235',   count: 5, tol: 42 },
      { label: 'Os mais difíceis',  chars: '6892GSBRK',    count: 5, tol: 38 }
    ],
    mount: function (app, cfg) {
      var round = 0;
      var queue = MC.sample(cfg.chars.split(''), cfg.count);
      var tracer = null;

      var ui = MC.ui.screen({
        title: t('g.tracing'), island: ISLAND, back: BACK, dots: cfg.count, stageClass: 'tight', hint: cfg.label
      });
      app.appendChild(ui.root);

      var wrap = ui.add(
        '<div class="row" style="align-items:center;gap:clamp(14px,3vw,56px)">' +
          '<div class="card pad" style="padding:clamp(10px,2vmin,22px);display:flex;flex-direction:column;' +
            'align-items:center;justify-content:center"></div>' +
          '<div class="side" style="display:flex;flex-direction:column;gap:clamp(10px,2vh,18px);width:clamp(150px,22vw,240px)"></div>' +
        '</div>'
      );
      var pad = wrap.querySelector('.pad');
      var side = wrap.querySelector('.side');

      side.appendChild(MC.node(
        '<div class="card" style="padding:clamp(12px,2vmin,20px);text-align:center">' +
          '<div class="big-letter" style="font-family:\'Baloo 2\',sans-serif;font-weight:800;' +
          'font-size:clamp(38px,8vmin,62px);color:var(--accent);line-height:1"></div>' +
        '</div>'
      ));
      var btnHear = MC.node('<button class="btn primary">' + art.svg('speaker', { color: '#fff' }) +
        '<span>' + MC.esc(t('ui.listen')) + '</span></button>');
      var btnClear = MC.node('<button class="btn">' + art.svg('refresh', { color: 'var(--ink-soft)' }) +
        '<span>' + MC.esc(t('ui.clear')) + '</span></button>');
      side.appendChild(btnHear);
      side.appendChild(btnClear);
      var bigLetter = side.querySelector('.big-letter');

      function phrase() {
        var s = spoken(queue[round]);
        return pick('g.tracing.' + s.k, { x: s.x });
      }

      MC.tap(btnHear, function () { MC.audio.sfx.tap(); MC.audio.speak(phrase(), { force: true }); });
      var markers = [];
      MC.tap(btnClear, function () {
        MC.audio.sfx.whoosh();
        if (tracer) tracer.reset();
        showMarker(0);
      });
      ui.repeat(function () { return round < queue.length ? phrase() : null; });

      // bolinha numerada no inicio de cada traco: mostra por onde comecar
      function showMarker(i) {
        markers.forEach(function (m, k) {
          m.style.opacity = k === i ? '1' : '0';
          m.classList.toggle('pulse-dot', k === i);
        });
      }

      function build() {
        var ch = queue[round];
        bigLetter.textContent = ch;
        MC.clear(pad);

        var strokes = D.TRACE[ch] || D.TRACE.O;
        var size = 'width:clamp(160px,min(40vmin,56vh),380px);height:clamp(160px,min(40vmin,56vh),380px)';
        var inner = '';
        strokes.forEach(function (d) {
          inner += '<path class="guide" d="' + d + '" fill="none" stroke="#E4C9C3" stroke-width="18" ' +
                   'stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 22"/>';
        });
        strokes.forEach(function (d) {
          inner += '<path class="ink" d="' + d + '" fill="none" stroke="#2EC4B6" stroke-width="19" ' +
                   'stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="0 100"/>';
        });
        var svg = MC.node('<svg viewBox="0 0 300 300" style="' + size + '">' + inner + '<g class="marks"></g></svg>');
        pad.appendChild(svg);
        pad.appendChild(MC.node('<p class="hint" style="margin:6px 0 0">' + MC.esc(t('g.tracing.prompt')) + '</p>'));

        var guides = MC.qsa('.guide', svg);
        var inks = MC.qsa('.ink', svg);
        var marks = svg.querySelector('.marks');
        markers = guides.map(function (g, i) {
          var p = g.getPointAtLength(0);
          var m = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          m.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ')');
          m.innerHTML = '<circle r="15" fill="#2EC4B6" stroke="#fff" stroke-width="4"/>' +
            '<text y="5.5" text-anchor="middle" fill="#fff" style="font:800 15px \'Baloo 2\',sans-serif">' + (i + 1) + '</text>';
          m.style.transition = 'opacity .25s ease';
          marks.appendChild(m);
          return m;
        });
        showMarker(0);

        if (tracer) tracer.destroy();
        tracer = MC.trace(svg, {
          guides: guides,
          inks: inks,
          tolerance: cfg.tol,
          onStroke: function (i) { showMarker(i + 1); },
          onDone: function () {
            MC.audio.sfx.success();
            MC.ui.confetti(24);
            MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
            inks.forEach(function (p) { p.setAttribute('stroke', '#FF6F59'); });
            if (svg.animate) {
              svg.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }],
                { duration: 700, easing: 'ease-in-out' });
            }
            var s = spoken(ch);
            MC.audio.speak(pick('g.tracing.done' + s.k, { x: s.x }));
            round++;
            ui.setDots(round);
            MC.later(function () {
              if (round >= queue.length) MC.ui.win('tracing', { back: BACK });
              else build();
            }, 2000);
          }
        });

        MC.later(function () { MC.audio.speak(phrase()); }, 400);
      }

      build();
      return function () { if (tracer) tracer.destroy(); };
    }
  });

  /* ============ 3. Puzzle do alfabeto ============ */

  MC.registerGame({
    id: 'alfabeto', island: ISLAND, icon: 'puzzle',
    title: 'g.alfabeto', sub: 'g.alfabeto.sub',
    levels: [
      { label: 'Letras seguidas',       mode: 'seq',  len: 4, loose: 2, decoys: 0, hints: true,  puzzles: 2 },
      { label: 'Mais letras seguidas',  mode: 'seq',  len: 5, loose: 3, decoys: 0, hints: true,  puzzles: 2 },
      { label: 'Palavras pequeninas',   mode: 'word', words: ['SOL', 'LUA', 'MAR'], loose: 2, decoys: 0, hints: true, puzzles: 3 },
      { label: 'Palavras de 4 letras',  mode: 'word', words: ['BOLA', 'CASA', 'GATO', 'PATO', 'RATO', 'FLOR', 'VACA', 'COPO', 'GALO'],
        loose: 3, decoys: 1, hints: false, puzzles: 3 },
      { label: 'Alfabeto sem ajudas',   mode: 'seq',  len: 6, loose: 4, decoys: 2, hints: false, puzzles: 2 }
    ],
    mount: function (app, cfg) {
      var COLORS = ['#FFC145', '#4EA8DE', '#6BBF59', '#8E7DBE', '#FF6F59', '#2EC4B6'];
      var puzzle = 0, placed = 0, need = 0, word = null, usedWords = [];

      var ui = MC.ui.screen({
        title: t('g.alfabeto'), island: ISLAND, back: BACK, dots: cfg.puzzles, hint: cfg.label
      });
      app.appendChild(ui.root);
      ui.repeat(function () { return t('g.alfabeto.prompt'); });

      var tray = ui.add('<div class="row" style="min-height:clamp(84px,16vmin,124px)"></div>');
      var bedWrap = ui.add('<div class="row" style="align-items:center"></div>');

      var size = 'width:clamp(52px,11vmin,92px);height:clamp(52px,11vmin,92px)';
      var glyph = 'font-family:\'Baloo 2\',sans-serif;font-weight:800;font-size:clamp(24px,5.4vmin,42px)';

      function build() {
        MC.clear(tray); MC.clear(bedWrap);
        placed = 0;
        var letters;
        if (cfg.mode === 'word') {
          var pool = cfg.words.filter(function (w) { return usedWords.indexOf(w) === -1; });
          word = MC.pick(pool.length ? pool : cfg.words);
          usedWords.push(word);
          letters = word.split('');
          var w = D.word(word);
          if (w) {
            bedWrap.appendChild(MC.node(
              '<div class="card" style="' + size.replace(/92px/g, '110px') + ';padding:10px;display:flex">' +
              art.svg(w.id) + '</div>'
            ));
          }
        } else {
          word = null;
          var s = MC.rnd(D.LETTERS_ALL.length - cfg.len + 1);
          letters = D.LETTERS_ALL.slice(s, s + cfg.len);
        }

        var missing = MC.sample(MC.range(letters.length), Math.min(cfg.loose, letters.length - 1));
        need = missing.length;
        var bed = MC.node('<div class="card row" style="padding:clamp(10px,2vmin,20px);gap:clamp(6px,1.4vmin,14px)"></div>');
        bedWrap.appendChild(bed);

        letters.forEach(function (ch, i) {
          if (missing.indexOf(i) !== -1) {
            bed.appendChild(MC.node(
              '<div class="slot" data-letter="' + ch + '" style="' + size +
              ';border-radius:18px;background:#FDEDE9;border:4px dashed var(--accent);' +
              'display:flex;align-items:center;justify-content:center">' +
              (cfg.hints ? '<span class="ghost" style="' + glyph + ';color:#F5C3B8">' + ch + '</span>' : '') + '</div>'
            ));
          } else {
            bed.appendChild(MC.node(
              '<div style="' + size + ';border-radius:18px;background:' + COLORS[i % COLORS.length] + ';' +
              'box-shadow:0 6px 12px rgba(43,42,74,.14);display:flex;align-items:center;justify-content:center">' +
              '<span style="' + glyph + ';color:#fff">' + ch + '</span></div>'
            ));
          }
        });

        var pieces = missing.map(function (i) { return { ch: letters[i], decoy: false }; });
        MC.sample(D.LETTERS, cfg.decoys, letters).forEach(function (ch) { pieces.push({ ch: ch, decoy: true }); });

        MC.shuffle(pieces).forEach(function (p, k) {
          var piece = MC.node(
            '<div class="piece" data-letter="' + p.ch + '" style="' + size +
            ';border-radius:20px;background:' + COLORS[(k + 2) % COLORS.length] + ';box-shadow:0 10px 18px rgba(43,42,74,.16);' +
            'display:flex;align-items:center;justify-content:center;transform:rotate(' + (k % 2 ? 6 : -7) + 'deg)">' +
            '<span style="' + glyph + ';color:#fff">' + p.ch + '</span></div>'
          );
          tray.appendChild(piece);

          MC.drag(piece, {
            zones: function () { return MC.qsa('.slot', bed); },
            radius: 110,
            onStart: function () { MC.audio.sfx.tap(); },
            onDrop: function (zone, api) {
              if (!zone) return false;
              if (!p.decoy && zone.dataset.letter === p.ch) {
                zone.dataset.full = '1';
                zone.style.border = 'none';
                zone.style.background = 'transparent';
                var gh = zone.querySelector('.ghost');
                if (gh) gh.parentNode.removeChild(gh);
                api.settleInto(zone);
                MC.audio.sfx.snap();
                MC.audio.speak(MC.audio.letterName(p.ch));
                MC.ui.confetti(10);
                placed++;
                if (placed >= need) done();
                return true;
              }
              zone.classList.remove('refuse');
              void zone.offsetWidth;
              zone.classList.add('refuse');
              MC.audio.sfx.soft();
              MC.ui.mascotSay(p.decoy ? t('g.alfabeto.decoy') : MC.i18n.encourage(), 'nudge');
              return false;
            }
          });
        });

        MC.later(function () {
          MC.audio.speak(word ? pick('g.alfabeto.word', { w: word }) : t('g.alfabeto.prompt'));
        }, 400);
      }

      function done() {
        MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
        MC.audio.sfx.success();
        MC.audio.speak(word ? pick('g.alfabeto.wordDone', { w: word }) : MC.i18n.praise());
        puzzle++;
        ui.setDots(puzzle);
        MC.later(function () {
          if (puzzle >= cfg.puzzles) MC.ui.win('alfabeto', { back: BACK });
          else build();
        }, 1800);
      }

      build();
    }
  });

  /* ============ 4. Conta e escolhe ============ */

  var THINGS = [
    { art: 'apple',     pl: 'maçãs' },
    { art: 'starShape', pl: 'estrelas', color: '#FFC145' },
    { art: 'flower',    pl: 'flores' },
    { art: 'ball',      pl: 'bolas' },
    { art: 'banana',    pl: 'bananas' },
    { art: 'fish',      pl: 'peixes', m: true },
    { art: 'duck',      pl: 'patinhos', m: true },
    { art: 'carrot',    pl: 'cenouras' }
  ];

  MC.registerGame({
    id: 'contar', island: ISLAND, icon: 'plus',
    title: 'g.contar', sub: 'g.contar.sub',
    levels: [
      { label: 'Até 3',                     min: 1, max: 3,  opts: 3, layout: 'row',     rounds: 5 },
      { label: 'Até 5',                     min: 2, max: 5,  opts: 3, layout: 'row',     rounds: 5 },
      { label: 'Espalhados',                min: 3, max: 7,  opts: 3, layout: 'scatter', rounds: 6 },
      { label: 'Conta só os que te peço',   min: 3, max: 7,  opts: 4, layout: 'scatter', distract: 3, rounds: 6 },
      { label: 'Até 10',                    min: 5, max: 10, opts: 4, layout: 'scatter', distract: 4, rounds: 7 }
    ],
    mount: function (app, cfg) {
      var round = 0, answer = 0, busy = false, counting = false, thing = THINGS[0];

      var ui = MC.ui.screen({
        title: t('g.contar'), island: ISLAND, back: BACK, dots: cfg.rounds, stageClass: 'tight', hint: cfg.label
      });
      app.appendChild(ui.root);

      var field = ui.add('<div class="count-field"></div>');
      var prompt = ui.add('<div class="prompt"></div>');
      var btnCount = ui.add('<button class="btn">' + art.svg('hand', { color: 'var(--ink-soft)' }) +
        '<span>' + MC.esc(t('g.contar.count')) + '</span></button>');
      var row = ui.add('<div class="row"></div>');

      function question() {
        return pick('g.contar.q', { what: thing.pl, Q: thing.m ? 'Quantos' : 'Quantas', os: thing.m ? 'os' : 'as' });
      }
      ui.repeat(function () { return busy ? null : question(); });
      MC.tap(btnCount, countAloud);

      function countAloud() {
        if (counting) return;
        counting = true;
        var items = MC.qsa('.thing.target', field);
        items.forEach(function (el, i) {
          MC.later(function () {
            el.querySelector('.badge').style.opacity = '1';
            MC.audio.sfx.count(i);
            MC.audio.speak(String(i + 1));
            if (el.animate) {
              el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0)' }],
                { duration: 420, easing: 'ease-out' });
            }
            if (i === items.length - 1) MC.later(function () { counting = false; }, 500);
          }, i * 700);
        });
      }

      function itemHtml(th, isTarget, n, pos) {
        var st = pos ? 'position:absolute;left:' + pos.x + '%;top:' + pos.y + '%;' : 'position:relative;';
        return '<div class="thing' + (isTarget ? ' target' : '') + '" style="' + st +
          'display:flex;flex-direction:column;align-items:center;gap:2px">' +
          (isTarget ? '<span class="badge" style="opacity:0;transition:opacity .2s ease;width:22px;height:22px;' +
            'border-radius:50%;background:#6BBF59;color:#fff;display:flex;align-items:center;justify-content:center;' +
            'font:800 12px \'Baloo 2\',sans-serif">' + n + '</span>' : '<span style="height:22px"></span>') +
          '<span style="display:block;width:clamp(34px,6.4vmin,54px);height:clamp(34px,6.4vmin,54px);color:' +
          (th.color || '') + '">' + art.svg(th.art) + '</span></div>';
      }

      function build() {
        busy = false; counting = false;
        MC.clear(field); MC.clear(row);
        var pair = MC.sample(THINGS, 2);
        thing = pair[0];
        answer = cfg.min + MC.rnd(cfg.max - cfg.min + 1);
        var extras = cfg.distract ? 1 + MC.rnd(cfg.distract) : 0;
        prompt.textContent = question();

        if (cfg.layout === 'row') {
          field.className = 'count-field row';
          for (var i = 0; i < answer; i++) field.appendChild(MC.node(itemHtml(thing, true, i + 1)));
        } else {
          // grelha com desvios aleatorios: espalhado, mas sem sobreposicoes
          field.className = 'count-field scatter';
          var cols = 5, rows = 3;
          var cells = MC.sample(MC.range(cols * rows), answer + extras);
          var kinds = MC.shuffle(MC.range(answer + extras).map(function (k) { return k < answer; }));
          var n = 0;
          // numerar da esquerda para a direita, de cima para baixo
          var placed = cells.map(function (c, k) { return { c: c, target: kinds[k] }; })
            .sort(function (a, b) { return a.c - b.c; });
          placed.forEach(function (p) {
            var x = (p.c % cols) * (100 / cols) + 2 + MC.rnd(8);
            var y = Math.floor(p.c / cols) * (100 / rows) + MC.rnd(6);
            if (p.target) n++;
            field.appendChild(MC.node(itemHtml(p.target ? thing : pair[1], p.target, n, { x: x, y: y })));
          });
        }

        var choices = [answer];
        while (choices.length < cfg.opts) {
          var c = MC.clamp(answer + (MC.rnd(5) - 2), 1, 12);
          if (choices.indexOf(c) === -1) choices.push(c);
        }
        MC.shuffle(choices).forEach(function (v) {
          var tile = MC.node(MC.ui.tileHtml('<span class="glyph">' + v + '</span>', null, '--tile:clamp(64px,11vmin,104px)'));
          MC.tap(tile, function () { check(v, tile); });
          row.appendChild(tile);
        });

        MC.later(function () { MC.audio.speak(question()); }, 400);
      }

      function check(v, tile) {
        if (busy) return;
        if (v === answer) {
          busy = true;
          MC.ui.markRight(tile, { say: pick('g.contar.right', { n: answer, what: thing.pl }) });
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= cfg.rounds) MC.ui.win('contar', { back: BACK });
            else build();
          }, 1700);
        } else {
          MC.ui.markWrong(tile);
          MC.later(countAloud, 800);
        }
      }

      build();
    }
  });

})(window.MC);
