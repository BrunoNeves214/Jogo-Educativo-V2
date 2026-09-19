/* Ilha das Cores e Formas — cinco fases por jogo.
   5. Combinar por cor   bolas → mais cores → formas → coisas de verdade (a banana e amarela)
   6. Encontra a forma   floresta → praia → encontrar todas → encontrar pela cor
   7. Pinta              livre → desenhos maiores → pinta como o modelo */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var D = MC.data;
  var ISLAND = 'cores';
  var BACK = '#/ilha/cores';

  // "caixa vermelha", "forma amarela": o adjectivo concorda com o feminino
  function colorF(c) { return c.pt.replace(/o$/, 'a'); }

  /* ============ 5. Combinar por cor ============ */

  MC.registerGame({
    id: 'cor', island: ISLAND, icon: 'shapes',
    title: 'g.cor', sub: 'g.cor.sub',
    levels: [
      { label: 'Três cores',            colors: 3, per: 1, kind: 'ball' },
      { label: 'Quatro cores',          colors: 4, per: 1, kind: 'ball' },
      { label: 'Muitas bolas',          colors: 4, per: 2, kind: 'ball' },
      { label: 'Formas coloridas',      colors: 5, per: 2, kind: 'shape' },
      { label: 'Coisas de verdade',     colors: 5, per: 2, kind: 'things' }
    ],
    mount: function (app, cfg) {
      var ui = MC.ui.screen({
        title: t('g.cor'), island: ISLAND, back: BACK, hint: cfg.label, stageClass: 'tight'
      });
      app.appendChild(ui.root);
      ui.repeat(function () { return t(cfg.kind === 'things' ? 'g.cor.promptThings' : 'g.cor.prompt'); });

      var tray = ui.add('<div class="row" style="min-height:clamp(70px,14vmin,110px);max-width:min(94vw,820px)"></div>');
      var boxes = ui.add('<div class="row" style="align-items:flex-end"></div>');

      var colors = MC.sample(D.COLORS, cfg.colors);
      var items = [];
      colors.forEach(function (c) {
        if (cfg.kind === 'things') {
          MC.sample(c.things, cfg.per).forEach(function (a) { items.push({ c: c, art: a }); });
        } else {
          for (var k = 0; k < cfg.per; k++) {
            items.push({ c: c, art: cfg.kind === 'shape' ? MC.pick(['starShape', 'heart', 'square', 'triangle', 'circle']) : null });
          }
        }
      });
      var left = items.length;

      colors.forEach(function (c) {
        boxes.appendChild(MC.node(
          '<div class="slot basket" data-color="' + c.id + '" style="' +
          'width:clamp(70px,' + (60 / cfg.colors) + 'vw,170px);height:clamp(64px,11vh,100px);' +
          'border-radius:0 0 30px 30px;background:' + c.soft + ';border:5px solid ' + c.hex + ';border-top:none;' +
          'display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:center;gap:3px;padding:4px 4px 8px"></div>'
        ));
      });

      var sz = items.length > 6 ? 'clamp(44px,7.4vmin,64px)' : 'clamp(50px,9vmin,76px)';
      MC.shuffle(items).forEach(function (it, i) {
        var inner = it.art ? art.svg(it.art, { color: it.c.hex }) : '';
        var shapeStyle = it.art ? '' : 'border-radius:50%;background:' + it.c.hex + ';' +
          'box-shadow:0 10px 16px rgba(43,42,74,.16), inset -6px -6px 0 rgba(0,0,0,.08);';
        var piece = MC.node(
          '<div class="ball" data-color="' + it.c.id + '" style="width:' + sz + ';height:' + sz + ';' + shapeStyle +
          (it.art ? 'filter:drop-shadow(0 8px 10px rgba(43,42,74,.18));' : '') +
          'animation:bob 2.6s ease-in-out infinite ' + (i * 0.25) + 's">' + inner + '</div>'
        );
        tray.appendChild(piece);

        MC.drag(piece, {
          zones: function () { return MC.qsa('.basket', boxes); },
          radius: 120,
          onStart: function () { MC.audio.sfx.tap(); piece.style.animation = 'none'; },
          onDrop: function (zone, api) {
            if (!zone) return false;
            if (zone.dataset.color === it.c.id) {
              api.settleInto(zone, {
                width: 'clamp(26px,4.6vmin,40px)', height: 'clamp(26px,4.6vmin,40px)', animation: 'none'
              });
              MC.audio.sfx.snap();
              var thing = it.art && cfg.kind === 'things' ? D.object(it.art) : null;
              MC.audio.speak(thing
                ? pick('g.cor.rightThing', { w: D.withArticle(thing), cT: thing.g === 'f' ? colorF(it.c) : it.c.pt, cF: colorF(it.c) })
                : pick('g.cor.right', { c: it.c.pt }));
              MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
              MC.ui.confetti(8);
              left--;
              if (left <= 0) MC.later(function () { MC.ui.win('cor', { back: BACK }); }, 1100);
              return true;
            }
            // a caixa "recusa" com um tremor, sem esconder a peca
            zone.classList.remove('refuse');
            void zone.offsetWidth;
            zone.classList.add('refuse');
            MC.audio.sfx.soft();
            MC.ui.mascotSay(MC.i18n.encourage(), 'nudge');
            return false;
          }
        });
      });

      MC.later(function () { MC.audio.speak(t(cfg.kind === 'things' ? 'g.cor.promptThings' : 'g.cor.prompt')); }, 400);
    }
  });

  /* ============ 6. Encontra a forma escondida ============ */

  function starPath(cx, cy, R, r) {
    var p = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
      p += (i ? 'L' : 'M') + (cx + rad * Math.cos(a)).toFixed(1) + ' ' + (cy + rad * Math.sin(a)).toFixed(1) + ' ';
    }
    return p + 'Z';
  }
  function heartPath(cx, cy, s) {
    return 'M' + cx + ' ' + (cy + s) + ' s' + (-s * 1.1) + ' ' + (-s * 0.7) + ' ' + (-s * 1.1) + ' ' + (-s * 1.45) +
      ' a' + (s * 0.55) + ' ' + (s * 0.55) + ' 0 0 1 ' + (s * 1.1) + ' ' + (-s * 0.3) +
      ' a' + (s * 0.55) + ' ' + (s * 0.55) + ' 0 0 1 ' + (s * 1.1) + ' ' + (s * 0.3) +
      ' c0 ' + (s * 0.75) + ' ' + (-s * 1.1) + ' ' + (s * 1.45) + ' ' + (-s * 1.1) + ' ' + (s * 1.45) + 'Z';
  }

  // floresta: uma forma de cada tipo, bem camuflada
  var FOREST =
    '<rect width="900" height="430" fill="#BFE9E4"/>' +
    '<g stroke="#FFD976" stroke-width="7" stroke-linecap="round">' +
      '<path d="M790 4v18M790 118v18M716 70h18M846 70h18M738 18l13 13M829 109l13 13M842 18l-13 13M751 109l-13 13"/></g>' +
    '<circle class="hot" data-shape="circle" data-color="yellow" cx="790" cy="70" r="46" fill="#FFC145"/>' +
    '<ellipse cx="180" cy="66" rx="66" ry="24" fill="#fff" opacity=".85"/>' +
    '<ellipse cx="520" cy="96" rx="52" ry="20" fill="#fff" opacity=".7"/>' +
    '<path d="M0 300 Q450 246 900 300 L900 430 L0 430Z" fill="#8FCB86"/>' +
    '<rect x="112" y="268" width="20" height="62" rx="5" fill="#8B5E34"/>' +
    '<path class="hot" data-shape="triangle" data-color="green" d="M122 152 L184 270 L60 270 Z" fill="#4E9A5C"/>' +
    '<rect class="hot" data-shape="square" data-color="orange" x="262" y="252" width="86" height="86" rx="12" fill="#9C8F7E"/>' +
    '<circle class="hot" data-shape="circle" data-color="green" cx="470" cy="286" r="60" fill="#5CB85C" stroke="#3E8E41" stroke-width="5"/>' +
    '<path class="hot" data-shape="star" data-color="red" d="' + starPath(640, 170, 52, 22) + '" fill="#FF8FB1"/>' +
    '<path d="M640 222 q12 26 -8 44" stroke="#FF8FB1" stroke-width="4" fill="none"/>' +
    '<path d="M700 330 L768 268 L836 330 Z" fill="#F4A261"/>' +
    '<rect x="712" y="326" width="112" height="70" rx="6" fill="#FFE2C6"/>' +
    '<rect class="hot" data-shape="rect" data-color="orange" x="748" y="344" width="42" height="52" rx="5" fill="#8B5E34"/>' +
    '<rect x="200" y="330" width="7" height="58" rx="3" fill="#6BBF59"/>' +
    '<circle cx="176" cy="326" r="18" fill="#FFD976"/><circle cx="228" cy="326" r="18" fill="#FFD976"/>' +
    '<circle cx="203" cy="302" r="18" fill="#FFD976"/><circle cx="203" cy="352" r="18" fill="#FFD976"/>' +
    '<path class="hot" data-shape="heart" data-color="red" d="' + heartPath(203, 342, 18) + '" fill="#FF6F59"/>' +
    '<ellipse cx="560" cy="330" rx="44" ry="28" fill="#6FC26F"/>' +
    '<ellipse cx="360" cy="342" rx="34" ry="22" fill="#6FC26F"/>';

  // praia: varias formas repetidas, com cores diferentes
  var BEACH =
    '<rect width="900" height="430" fill="#CFEFFB"/>' +
    '<ellipse cx="120" cy="60" rx="60" ry="22" fill="#fff" opacity=".9"/>' +
    '<circle class="hot" data-shape="circle" data-color="yellow" cx="800" cy="72" r="44" fill="#FFC145"/>' +
    '<path class="hot" data-shape="heart" data-color="red" d="' + heartPath(420, 96, 30) + '" fill="#FF6F59"/>' +
    '<path d="M420 140 q-18 40 10 80" fill="none" stroke="#FF6F59" stroke-width="3"/>' +
    '<path class="hot" data-shape="heart" data-color="purple" d="' + heartPath(600, 118, 26) + '" fill="#B892FF"/>' +
    '<path d="M600 156 v60" stroke="#B892FF" stroke-width="3"/>' +
    '<path d="M0 190 Q225 176 450 190 T900 190 L900 262 L0 262Z" fill="#4EA8DE"/>' +
    '<path d="M0 222 Q225 208 450 222 T900 222" fill="none" stroke="#9BD3F0" stroke-width="6"/>' +
    '<path d="M150 204 h160 l-24 30 h-112z" fill="#8B5E34"/>' +
    '<path d="M232 84 v120" stroke="#6B4A2A" stroke-width="5"/>' +
    '<path class="hot" data-shape="triangle" data-color="blue" d="M226 90 L226 198 L158 198 Z" fill="#2E6FB5"/>' +
    '<path class="hot" data-shape="triangle" data-color="red" d="M238 110 L238 198 L296 198 Z" fill="#FF6F59"/>' +
    '<path d="M0 252 Q450 232 900 252 L900 430 L0 430Z" fill="#F6E3BC"/>' +
    '<rect class="hot" data-shape="rect" data-color="green" x="70" y="330" width="170" height="62" rx="6" fill="#6BBF59"/>' +
    '<path d="M100 330v62M140 330v62M180 330v62M220 330v62" stroke="#A6DD8F" stroke-width="6"/>' +
    '<rect class="hot" data-shape="square" data-color="orange" x="316" y="314" width="78" height="78" rx="6" fill="#F4A261"/>' +
    '<path d="M316 314 v-14 h16 v14 M348 314 v-14 h16 v14 M380 314 v-14 h14 v14" fill="#F4A261" stroke="#F4A261" stroke-width="2"/>' +
    '<circle class="hot" data-shape="circle" data-color="red" cx="478" cy="346" r="34" fill="#FF6F59"/>' +
    '<path d="M450 334 q28 16 56 0" fill="none" stroke="#fff" stroke-width="6"/>' +
    '<rect x="626" y="250" width="132" height="130" rx="6" fill="#FFF3DC"/>' +
    '<path class="hot" data-shape="triangle" data-color="orange" d="M612 254 L692 190 L772 254 Z" fill="#E08A4A"/>' +
    '<rect class="hot" data-shape="rect" data-color="blue" x="672" y="302" width="40" height="78" rx="4" fill="#4EA8DE"/>' +
    '<rect class="hot" data-shape="square" data-color="yellow" x="636" y="270" width="28" height="28" rx="3" fill="#FFC145"/>' +
    '<path class="hot" data-shape="star" data-color="orange" d="' + starPath(574, 388, 30, 13) + '" fill="#F4A261"/>' +
    '<path class="hot" data-shape="star" data-color="purple" d="' + starPath(846, 364, 28, 12) + '" fill="#B892FF"/>';

  MC.registerGame({
    id: 'forma', island: ISLAND, icon: 'circle',
    title: 'g.forma', sub: 'g.forma.sub',
    levels: [
      { label: 'Três formas',              scene: FOREST, shapes: ['circle', 'square', 'triangle'], mode: 'one', rounds: 3 },
      { label: 'Todas as formas',          scene: FOREST, mode: 'one', rounds: 4 },
      { label: 'Na praia',                 scene: BEACH,  mode: 'one', rounds: 4 },
      { label: 'Encontra todas iguais',    scene: BEACH,  mode: 'all', rounds: 3 },
      { label: 'Pela cor e pela forma',    scene: BEACH,  mode: 'color', rounds: 5 }
    ],
    mount: function (app, cfg) {
      var round = 0, busy = false, target = null, found = 0, need = 1, asked = [];

      var ui = MC.ui.screen({ title: t('g.forma'), island: ISLAND, back: BACK, dots: cfg.rounds, stageClass: 'tight', hint: cfg.label });
      app.appendChild(ui.root);

      var banner = ui.add('<div class="pill accent"><span class="bannerTx"></span></div>');
      var scene = ui.add('<div class="card" style="width:min(96vw,900px);padding:0;overflow:hidden"></div>');
      scene.appendChild(MC.node('<svg viewBox="0 0 900 430" style="width:100%;height:auto;display:block">' + cfg.scene + '</svg>'));
      var hots = MC.qsa('.hot', scene);
      hots.forEach(function (el) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', function () { hit(el); });
      });

      function shapeOf(id) { return D.SHAPES.filter(function (s) { return s.id === id; })[0]; }
      function matches(el) {
        return el.dataset.shape === target.shape && (!target.color || el.dataset.color === target.color);
      }
      function phrase() {
        var s = shapeOf(target.shape);
        var name = t(s.key).toLowerCase();
        if (cfg.mode === 'all') return pick('g.forma.all', { s: t(s.key + 'Pl').toLowerCase(), todos: s.g === 'f' ? 'todas as' : 'todos os' });
        if (target.color) {
          var c = D.color(target.color);
          return pick('g.forma.color', { s: name, a: s.g === 'f' ? 'a' : 'o', c: s.g === 'f' ? colorF(c) : c.pt });
        }
        return pick('g.forma.one', { s: name, a: s.g === 'f' ? 'a' : 'o' });
      }
      ui.repeat(function () { return busy ? null : phrase(); });

      function build() {
        busy = false; found = 0;
        hots.forEach(function (h) { h.dataset.found = ''; h.style.filter = ''; });
        var shapes = cfg.shapes || D.SHAPES.map(function (s) { return s.id; });
        var candidates = [];
        hots.forEach(function (h) {
          if (shapes.indexOf(h.dataset.shape) === -1) return;
          var same = hots.filter(function (x) { return x.dataset.shape === h.dataset.shape; }).length;
          if (cfg.mode === 'all' && same < 2) return;
          if (cfg.mode === 'color' && same < 2) return;
          candidates.push({ shape: h.dataset.shape, color: cfg.mode === 'color' ? h.dataset.color : null });
        });
        // nao repetir o que ja se pediu nesta fase, se houver alternativa
        var fresh = candidates.filter(function (c) { return asked.indexOf(c.shape + c.color) === -1; });
        target = MC.pick(fresh.length ? fresh : candidates);
        asked.push(target.shape + target.color);
        need = cfg.mode === 'all' ? hots.filter(function (h) { return h.dataset.shape === target.shape; }).length : 1;
        banner.querySelector('.bannerTx').textContent = phrase();
        MC.later(function () { MC.audio.speak(phrase()); }, 400);
      }

      function glow(el) {
        el.style.filter = 'drop-shadow(0 0 10px #fff) drop-shadow(0 0 18px ' + (el.getAttribute('fill') || '#fff') + ')';
        if (el.animate) {
          el.animate([
            { transform: 'scale(1)', transformBox: 'fill-box', transformOrigin: 'center' },
            { transform: 'scale(1.18)', transformBox: 'fill-box', transformOrigin: 'center' },
            { transform: 'scale(1)', transformBox: 'fill-box', transformOrigin: 'center' }
          ], { duration: 700, iterations: 2 });
        }
      }

      function hit(el) {
        if (busy || el.dataset.found === '1') return;
        if (matches(el)) {
          el.dataset.found = '1';
          found++;
          glow(el);
          MC.audio.sfx.success();
          MC.ui.confetti(14);
          if (found < need) {
            MC.ui.mascotSay(pick('g.forma.more', { n: need - found }), 'cheer');
            MC.audio.speak(pick('g.forma.more', { n: need - found }));
            return;
          }
          busy = true;
          MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
          MC.audio.speak(MC.i18n.praise());
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= cfg.rounds) MC.ui.win('forma', { back: BACK });
            else build();
          }, 1900);
        } else {
          MC.audio.sfx.soft();
          MC.ui.mascotSay(MC.i18n.encourage(), 'nudge');
          if (el.animate) {
            el.animate([
              { transform: 'rotate(0deg)', transformBox: 'fill-box', transformOrigin: 'center' },
              { transform: 'rotate(-5deg)', transformBox: 'fill-box', transformOrigin: 'center' },
              { transform: 'rotate(5deg)', transformBox: 'fill-box', transformOrigin: 'center' },
              { transform: 'rotate(0deg)', transformBox: 'fill-box', transformOrigin: 'center' }
            ], { duration: 420 });
          }
          MC.later(function () { MC.audio.speak(phrase()); }, 900);
        }
      }

      build();
    }
  });

  /* ============ 7. Pinta com as cores ============ */

  MC.registerGame({
    id: 'pintar', island: ISLAND, icon: 'brush',
    title: 'g.pintar', sub: 'g.pintar.sub',
    levels: [
      { label: 'Pinta à vontade',       drawings: ['barco'],               mode: 'free' },
      { label: 'Mais desenhos',         drawings: ['casa', 'peixe'],       mode: 'free' },
      { label: 'Desenhos maiores',      drawings: ['flor', 'borboleta'],   mode: 'free' },
      { label: 'Pinta como o modelo',   drawings: ['barco', 'casa', 'peixe'], mode: 'copy', count: 2 },
      { label: 'Modelos difíceis',      drawings: ['borboleta', 'gelado', 'flor'], mode: 'copy', count: 2 }
    ],
    mount: function (app, cfg) {
      var list = MC.sample(cfg.drawings, cfg.count || cfg.drawings.length);
      var idx = 0, current = D.COLORS[0], painted = 0, total = 0, busy = false, def = null;

      var ui = MC.ui.screen({
        title: t('g.pintar'), island: ISLAND, back: BACK, dots: list.length, stageClass: 'tight', hint: cfg.label
      });
      app.appendChild(ui.root);
      var prompt = function () { return t(cfg.mode === 'copy' ? 'g.pintar.copy' : 'g.pintar.prompt'); };
      ui.repeat(function () { return busy ? null : prompt(); });

      var wrap = ui.add('<div class="row" style="align-items:center;gap:clamp(12px,3vw,40px)"></div>');
      var board = MC.node('<div class="card" style="padding:clamp(10px,2vmin,20px)"></div>');
      var model = MC.node('<div class="card model" style="padding:10px;text-align:center"></div>');
      wrap.appendChild(board);
      if (cfg.mode === 'copy') wrap.appendChild(model);
      var palette = ui.add('<div class="row" style="gap:clamp(10px,2.4vmin,20px)"></div>');
      var tools = ui.add('<div class="row"></div>');

      D.COLORS.forEach(function (c, i) {
        var sw = MC.node(
          '<button class="swatch" aria-label="' + MC.esc(c.pt) + '" style="' +
          'width:clamp(40px,7vmin,54px);height:clamp(40px,7vmin,54px);border-radius:50%;background:' + c.hex + ';' +
          'box-shadow:0 6px 12px rgba(43,42,74,.14);transition:transform .15s ease"></button>'
        );
        palette.appendChild(sw);
        MC.tap(sw, function () { selectColor(c, sw, true); });
        if (i === 0) MC.later(function () { selectColor(c, sw, false); }, 0);
      });

      var btnClear = MC.node('<button class="btn">' + art.svg('brush', { color: 'var(--ink-soft)' }) +
        '<span>' + MC.esc(t('ui.clear')) + '</span></button>');
      tools.appendChild(btnClear);
      MC.tap(btnClear, function () {
        MC.audio.sfx.whoosh();
        MC.qsa('.region', board).forEach(function (p) { p.setAttribute('fill', '#FFFFFF'); p.dataset.painted = ''; });
        painted = 0;
      });

      function selectColor(c, sw, say) {
        current = c;
        MC.qsa('.swatch', palette).forEach(function (s) {
          s.style.transform = 'scale(1)';
          s.style.boxShadow = '0 6px 12px rgba(43,42,74,.14)';
        });
        sw.style.transform = 'scale(1.18)';
        sw.style.boxShadow = '0 0 0 4px #fff, 0 0 0 8px ' + c.hex + ', 0 8px 14px rgba(43,42,74,.2)';
        if (say) { MC.audio.sfx.tap(); MC.audio.speak(c.pt); }
      }

      function drawingSvg(d, colored, size) {
        var inner = '';
        d.regions.forEach(function (r, i) {
          var fill = colored ? D.color(r.ref).hex : '#FFFFFF';
          inner += '<path class="' + (colored ? '' : 'region') + '" data-i="' + i + '" d="' + r.d + '" fill="' + fill + '" ' +
            'stroke="#C9C6DC" stroke-width="3" stroke-linejoin="round"' + (colored ? '' : ' style="cursor:pointer"') + '/>';
        });
        return '<svg viewBox="0 0 300 300" style="width:' + size + ';height:' + size + '">' + inner + (d.deco || '') + '</svg>';
      }

      function build() {
        busy = false;
        def = D.COLORINGS[list[idx]];
        painted = 0;
        total = def.regions.length;
        MC.clear(board);
        board.appendChild(MC.node(drawingSvg(def, false, 'clamp(150px,min(40vmin,46vh),380px)')));
        if (cfg.mode === 'copy') {
          MC.clear(model);
          model.appendChild(MC.node('<div class="hint" style="margin:0 0 6px">' + MC.esc(t('g.pintar.model')) + '</div>'));
          model.appendChild(MC.node(drawingSvg(def, true, 'clamp(90px,16vmin,150px)')));
        }
        MC.qsa('.region', board).forEach(function (p) {
          p.addEventListener('click', function () { fill(p); });
        });
        MC.later(function () { MC.audio.speak(prompt()); }, 350);
      }

      function fill(p) {
        if (busy) return;
        var ref = def.regions[+p.dataset.i].ref;
        if (cfg.mode === 'copy' && current.id !== ref) {
          // pista suave: diz que cor e aquela parte no modelo
          MC.audio.sfx.soft();
          var c = D.color(ref);
          MC.ui.mascotSay(pick('g.pintar.hint', { c: c.pt }), 'nudge');
          MC.audio.speak(pick('g.pintar.hint', { c: c.pt }));
          if (p.animate) p.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], { duration: 400 });
          return;
        }
        var wasEmpty = !p.dataset.painted;
        p.setAttribute('fill', current.hex);
        p.dataset.painted = '1';
        MC.audio.sfx.pop();
        if (p.animate) p.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
        if (wasEmpty) {
          painted++;
          if (painted >= total) {
            busy = true;
            MC.audio.sfx.success();
            MC.ui.confetti(24);
            MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
            MC.audio.speak(pick('g.pintar.done'));
            idx++;
            ui.setDots(idx);
            MC.later(function () {
              if (idx >= list.length) MC.ui.win('pintar', { back: BACK });
              else build();
            }, 1900);
          }
        }
      }

      build();
    }
  });

})(window.MC);
