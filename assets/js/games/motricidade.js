/* Ilha da Motricidade Fina — cinco fases por jogo.
   19. Veste o boneco   3 pecas → com calcas → muita roupa → para a praia → para a neve (com pecas erradas)
   20. Liga os pontos   3-4 pontos → 7 → 10 → 12 → 15, com figuras diferentes
   21. Labirinto        recta → curva → S → ziguezague → caracol, caminho cada vez mais estreito */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var D = MC.data;
  var ISLAND = 'motricidade';
  var BACK = '#/ilha/motricidade';

  /* ============ 19. Veste o boneco ============ */

  // zonas do corpo, em % do boneco (caixa 200x320). A ordem e a de sobreposicao:
  // o cachecol e os oculos ficam por cima do casaco e do chapeu.
  var ZONES = [
    { id: 'head',  top: -6, left: 18, w: 64, h: 22 },
    { id: 'torso', top: 31, left: 12, w: 76, h: 33 },
    { id: 'legs',  top: 62, left: 24, w: 52, h: 27 },
    { id: 'feet',  top: 86, left: 18, w: 64, h: 14 },
    { id: 'neck',  top: 27, left: 24, w: 52, h: 13 },
    { id: 'eyes',  top: 12, left: 24, w: 52, h: 9 }
  ];

  MC.registerGame({
    id: 'vestir', island: ISLAND, icon: 'hand',
    title: 'g.vestir', sub: 'g.vestir.sub',
    levels: [
      { label: 'Chapéu, camisa e sapatos', pieces: ['hat', 'shirt', 'shoes'] },
      { label: 'Agora com calças',         pieces: ['hat', 'tshirt', 'pants', 'shoes'] },
      { label: 'Muita roupa',              pieces: ['beanie', 'scarf', 'coat', 'pants', 'boots'] },
      { label: 'Vamos à praia',            pieces: ['hat', 'sunglasses', 'tshirt', 'shorts'], decoys: ['scarf', 'coat', 'boots'], theme: 'praia' },
      { label: 'Vamos para a neve',        pieces: ['beanie', 'scarf', 'coat', 'pants', 'boots'], decoys: ['sunglasses', 'shorts', 'tshirt'], theme: 'neve' }
    ],
    mount: function (app, cfg) {
      var placed = 0;
      var prompt = cfg.theme ? 'g.vestir.' + cfg.theme : 'g.vestir.prompt';

      var ui = MC.ui.screen({ title: t('g.vestir'), island: ISLAND, back: BACK, hint: cfg.label, stageClass: 'tight' });
      app.appendChild(ui.root);
      ui.repeat(function () { return t(prompt); });

      var wrap = ui.add(
        '<div class="row" style="align-items:center;gap:clamp(20px,6vw,80px)">' +
          '<div class="doll" style="position:relative;margin-top:clamp(18px,4vh,36px);width:clamp(100px,min(25vmin,32vh),240px);aspect-ratio:5/8"></div>' +
          '<div class="tray" style="display:grid;grid-template-columns:repeat(2,auto);gap:clamp(8px,1.8vh,18px)"></div>' +
        '</div>'
      );
      var doll = wrap.querySelector('.doll');
      var tray = wrap.querySelector('.tray');

      doll.appendChild(MC.node(
        '<svg viewBox="0 0 200 320" style="position:absolute;inset:0;width:100%;height:100%">' +
          '<rect x="40" y="108" width="22" height="86" rx="11" fill="#FFD9BE"/>' +
          '<rect x="138" y="108" width="22" height="86" rx="11" fill="#FFD9BE"/>' +
          '<rect x="74" y="196" width="22" height="94" rx="11" fill="#FFD9BE"/>' +
          '<rect x="104" y="196" width="22" height="94" rx="11" fill="#FFD9BE"/>' +
          '<ellipse cx="82" cy="296" rx="16" ry="9" fill="#FFD9BE"/><ellipse cx="118" cy="296" rx="16" ry="9" fill="#FFD9BE"/>' +
          '<rect x="66" y="100" width="68" height="104" rx="18" fill="#FFE8D6"/>' +
          '<circle cx="100" cy="58" r="42" fill="#FFD9BE"/>' +
          '<path d="M58 44 q42 -38 84 0 q-10 -30 -42 -30 t-42 30Z" fill="#8B5E34"/>' +
          '<circle cx="86" cy="56" r="5" fill="#2B2A4A"/><circle cx="114" cy="56" r="5" fill="#2B2A4A"/>' +
          '<circle cx="78" cy="70" r="6" fill="#FF8FB1" opacity=".5"/><circle cx="122" cy="70" r="6" fill="#FF8FB1" opacity=".5"/>' +
          '<path d="M88 74 q12 10 24 0" stroke="#2B2A4A" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '</svg>'
      ));

      // so aparecem as zonas que esta fase usa
      var needed = cfg.pieces.map(function (p) { return D.CLOTHES[p].zone; });
      ZONES.forEach(function (z) {
        if (needed.indexOf(z.id) === -1) return;
        doll.appendChild(MC.node(
          '<div class="slot zone" data-zone="' + z.id + '" style="position:absolute;top:' + z.top + '%;left:' + z.left +
          '%;width:' + z.w + '%;height:' + z.h + '%;border-radius:16px;border:3px dashed rgba(255,143,177,.55)"></div>'
        ));
      });

      var list = cfg.pieces.map(function (p) { return { art: p, ok: true }; })
        .concat((cfg.decoys || []).map(function (p) { return { art: p, ok: false }; }));

      MC.shuffle(list).forEach(function (it) {
        var info = D.CLOTHES[it.art];
        var piece = MC.node(
          '<div class="cloth" data-zone="' + info.zone + '" data-ok="' + (it.ok ? 1 : 0) + '" style="width:clamp(56px,10vmin,96px);height:clamp(56px,10vmin,96px);display:flex;' +
          'align-items:center;justify-content:center;filter:drop-shadow(0 8px 10px rgba(43,42,74,.22))">' + art.svg(it.art) + '</div>'
        );
        tray.appendChild(piece);

        MC.drag(piece, {
          zones: function () { return MC.qsa('.zone', doll); },
          radius: 120,
          onStart: function () { MC.audio.sfx.tap(); MC.audio.speak(info.pt); },
          onDrop: function (zone, api) {
            if (!zone) return false;
            var refuse = function (msg, say) {
              zone.classList.remove('refuse');
              void zone.offsetWidth;
              zone.classList.add('refuse');
              MC.audio.sfx.soft();
              MC.ui.mascotSay(msg, 'nudge');
              if (say) MC.audio.speak(msg);
              return false;
            };
            if (!it.ok) return refuse(pick('g.vestir.wrong' + (cfg.theme === 'neve' ? 'Neve' : 'Praia'), { w: info.pt }), true);
            if (zone.dataset.zone !== info.zone) return refuse(MC.i18n.encourage());
            zone.dataset.full = '1';
            zone.style.border = 'none';
            api.settleInto(zone, { width: '100%', height: '100%', filter: 'none' });
            MC.audio.sfx.snap();
            MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
            MC.ui.confetti(8);
            placed++;
            if (placed >= cfg.pieces.length) {
              MC.audio.speak(pick('g.vestir.done'));
              if (doll.animate) {
                doll.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0deg)' }], { duration: 800 });
              }
              MC.later(function () { MC.ui.win('vestir', { back: BACK }); }, 1500);
            }
            return true;
          }
        });
      });

      MC.later(function () { MC.audio.speak(t(prompt)); }, 400);
    }
  });

  /* ============ 20. Liga os pontos ============ */

  // figuras: pontos fixos, um caminho que se amostra, ou uma formula
  var FIGURES = {
    triangulo: { name: 'um triângulo', fill: '#FF6F59', dots: [[150, 50], [250, 240], [50, 240]] },
    quadrado:  { name: 'um quadrado',  fill: '#4EA8DE', dots: [[70, 70], [230, 70], [230, 230], [70, 230]] },
    barco:     { name: 'um barco',     fill: '#4EA8DE', dots: [[40, 180], [260, 180], [226, 250], [74, 250]] },
    papagaio:  { name: 'um papagaio de papel', fill: '#B892FF', dots: [[150, 36], [240, 140], [150, 264], [60, 140]] },
    casa:      { name: 'uma casa',     fill: '#F4A261', dots: [[34, 150], [150, 54], [266, 150], [214, 150], [214, 262], [86, 262], [86, 150]] },
    // a cauda tem dois pontos de juncao separados: nunca ha dois pontos no mesmo sitio
    peixe:     { name: 'um peixe',     fill: '#2EC4B6', dots: [[40, 150], [120, 86], [210, 96], [252, 128], [292, 96], [292, 204], [252, 172], [210, 204], [120, 214]] },
    estrela:   { name: 'uma estrela',  fill: '#FFC145', dots: [[150, 30], [186, 116], [278, 120], [206, 178], [232, 268], [150, 214], [68, 268], [94, 178], [22, 120], [114, 116]] },
    coracao:   { name: 'um coração',   fill: '#FF6F59',
      path: 'M150 262 C92 222 44 180 44 126 C44 84 76 58 108 58 C130 58 144 72 150 88 C156 72 170 58 192 58 C224 58 256 84 256 126 C256 180 208 222 150 262 Z' },
    sol:       { name: 'um sol',       fill: '#FFC145', path: 'M150 50 A100 100 0 1 1 149.9 50 Z' },
    flor:      { name: 'uma flor',     fill: '#FF8FB1', rose: true },
    // curva suave, sem pontas: os pontos ficam sempre bem afastados uns dos outros
    nuvem:     { name: 'uma nuvem', fill: '#9AA9C4',
      path: 'M80 206 C34 206 30 140 78 134 C76 84 138 72 162 106 C186 64 256 76 250 132 C292 138 290 206 244 206 Z' }
  };

  function roseDots(n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var th = -Math.PI / 2 + i * 2 * Math.PI / n;
      var r = 104 + 26 * Math.cos(5 * th + Math.PI / 2);   // petalas suaves: pontos sempre afastados
      out.push([Math.round(150 + r * Math.cos(th)), Math.round(150 + r * Math.sin(th))]);
    }
    return out;
  }

  MC.registerGame({
    id: 'pontos', island: ISLAND, icon: 'pencil',
    title: 'g.pontos', sub: 'g.pontos.sub',
    levels: [
      { label: 'Poucos pontos',       figs: ['triangulo', 'quadrado', 'barco'], rounds: 2 },
      { label: 'Até 9',               figs: ['casa', 'papagaio', 'peixe'],      rounds: 2 },
      { label: 'Até 10',              figs: ['estrela', 'coracao'], n: 10,      rounds: 2 },
      { label: 'Até 12',              figs: ['coracao', 'sol', 'flor'], n: 12,  rounds: 2 },
      { label: 'Até 15',              figs: ['flor', 'nuvem', 'sol'], n: 15,   rounds: 2 }
    ],
    mount: function (app, cfg) {
      var round = 0, next = 0, pressing = false, fig = null, dots = [];
      var order = MC.shuffle(cfg.figs);

      var ui = MC.ui.screen({ title: t('g.pontos'), island: ISLAND, back: BACK, dots: cfg.rounds, hint: cfg.label, stageClass: 'tight' });
      app.appendChild(ui.root);
      ui.repeat(function () { return next < dots.length ? pick('g.pontos.next', { n: next + 1 }) : null; });

      var board = ui.add('<div class="card" style="padding:clamp(10px,2vmin,20px)"></div>');
      var release = function () { pressing = false; };
      window.addEventListener('pointerup', release);

      function build() {
        fig = FIGURES[order[round % order.length]];
        next = 0;
        MC.clear(board);
        var svg = MC.node(
          '<svg viewBox="0 0 300 300" style="width:clamp(160px,min(44vmin,60vh),400px);height:clamp(160px,min(44vmin,60vh),400px);touch-action:none">' +
          '<path class="shape" d="" fill="' + fig.fill + '" opacity="0"/>' +
          '<g class="lines" stroke="' + fig.fill + '" stroke-width="7" stroke-linecap="round" fill="none"></g>' +
          '<g class="dots"></g></svg>'
        );
        board.appendChild(svg);

        if (fig.dots) dots = fig.dots.slice();
        else if (fig.rose) dots = roseDots(cfg.n || 12);
        else {
          var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          p.setAttribute('d', fig.path);
          p.setAttribute('fill', 'none');
          svg.appendChild(p);
          var len = p.getTotalLength(), n = cfg.n || 10;
          dots = MC.range(n).map(function (i) {
            var pt = p.getPointAtLength(len * i / n);
            return [Math.round(pt.x), Math.round(pt.y)];
          });
          svg.removeChild(p);
        }

        var lines = svg.querySelector('.lines');
        var shape = svg.querySelector('.shape');
        var g = svg.querySelector('.dots');
        var fs = dots.length > 10 ? 13 : 15;
        dots.forEach(function (d, i) {
          var el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          el.setAttribute('class', 'dot');
          el.style.cursor = 'pointer';
          el.innerHTML = '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="20" fill="transparent"/>' +
            '<circle class="bead" cx="' + d[0] + '" cy="' + d[1] + '" r="11" fill="#fff" stroke="#C9C6DC" stroke-width="3"/>' +
            '<text x="' + d[0] + '" y="' + (d[1] + 5) + '" text-anchor="middle" style="font:800 ' + fs +
            'px \'Baloo 2\',sans-serif;fill:#6B6A8A">' + (i + 1) + '</text>';
          g.appendChild(el);
          var fire = function () { hit(i, el); };
          el.addEventListener('pointerdown', function () { pressing = true; fire(); });
          el.addEventListener('pointerenter', function () { if (pressing) fire(); });
          el.addEventListener('click', fire);
        });
        highlightNext();

        function highlightNext() {
          MC.qsa('.bead', svg).forEach(function (b, k) {
            b.setAttribute('stroke', k === next ? fig.fill : '#C9C6DC');
            b.setAttribute('r', k === next ? '14' : '11');
          });
        }

        function hit(i, el) {
          if (i !== next) {
            if (i > next) {
              MC.audio.sfx.soft();
              MC.ui.mascotSay(pick('g.pontos.next', { n: next + 1 }), 'nudge');
            }
            return;
          }
          var bead = el.querySelector('.bead');
          bead.setAttribute('fill', fig.fill);
          MC.audio.sfx.count(i);
          MC.audio.speak(String(i + 1));
          if (i > 0) seg(dots[i - 1], dots[i]);
          next++;
          highlightNext();
          if (next >= dots.length) {
            seg(dots[dots.length - 1], dots[0]);
            shape.setAttribute('d', 'M' + dots.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') + ' Z');
            if (shape.animate) shape.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, fill: 'forwards' });
            else shape.setAttribute('opacity', '1');
            MC.audio.sfx.success();
            MC.ui.confetti(26);
            MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
            MC.later(function () { MC.audio.speak(pick('g.pontos.done', { w: fig.name })); }, 500);
            round++;
            ui.setDots(round);
            MC.later(function () {
              if (round >= cfg.rounds) MC.ui.win('pontos', { back: BACK });
              else build();
            }, 2400);
          }
        }

        function seg(a, b) {
          var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]);
          l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]);
          lines.appendChild(l);
          var len = MC.dist(a[0], a[1], b[0], b[1]);
          l.style.strokeDasharray = len;
          l.style.strokeDashoffset = len;
          if (l.animate) l.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 260, easing: 'ease-out', fill: 'forwards' });
          else l.style.strokeDashoffset = 0;
        }

        MC.later(function () { MC.audio.speak(t('g.pontos.prompt')); }, 400);
      }

      build();
      return function () { window.removeEventListener('pointerup', release); };
    }
  });

  /* ============ 21. Labirinto ============ */

  var PATHS = {
    reta:    'M60 130 L660 130',
    curva:   'M60 200 Q360 10 660 200',
    s1:      'M50 130 C160 40, 260 220, 360 130 S 560 40, 670 130',
    s2:      'M60 60 C200 60, 160 210, 300 210 S 480 60, 660 100',
    zig:     'M60 200 L200 60 L340 200 L480 60 L660 190',
    longo:   'M60 60 C200 60 200 205 340 205 S 480 60 560 60 S 660 200 660 200',
    caracol: 'M60 215 C60 35 660 35 660 140 C660 225 300 225 300 150 C300 105 470 105 470 150'
  };

  var TRIPS = [
    { who: 'mouse',  goal: 'cheese', w: 'o rato',   to: 'ao queijo' },
    { who: 'bee',    goal: 'flower', w: 'a abelha', to: 'à flor' },
    { who: 'rabbit', goal: 'carrot', w: 'o coelho', to: 'à cenoura' },
    { who: 'dog',    goal: 'ball',   w: 'o cão',    to: 'à bola' },
    { who: 'fish',   goal: 'sea',    w: 'o peixe',  to: 'ao mar' }
  ];

  MC.registerGame({
    id: 'labirinto', island: ISLAND, icon: 'hand',
    title: 'g.labirinto', sub: 'g.labirinto.sub',
    levels: [
      { label: 'Caminho direito',   paths: ['reta', 'curva'],    stroke: 72 },
      { label: 'Uma curva',         paths: ['curva', 's2'],      stroke: 64 },
      { label: 'Aos esses',         paths: ['s1', 's2'],         stroke: 56 },
      { label: 'Ziguezague',        paths: ['zig', 'longo'],     stroke: 50 },
      { label: 'Caracol',           paths: ['caracol', 'zig'],   stroke: 44 }
    ],
    mount: function (app, cfg) {
      var ROUNDS = cfg.paths.length;
      var round = 0, lastWarn = 0, trip = null;
      var trips = MC.shuffle(TRIPS);

      var ui = MC.ui.screen({ title: t('g.labirinto'), island: ISLAND, back: BACK, dots: ROUNDS, hint: cfg.label, stageClass: 'tight' });
      app.appendChild(ui.root);
      var banner = ui.add('<div class="pill accent"><span class="bx"></span></div>');
      var board = ui.add('<div class="card" style="padding:clamp(10px,2vmin,20px);width:min(94vw,860px,170vh)"></div>');
      var phrase = function () { return pick('g.labirinto.go', { w: trip.w, to: trip.to }); };
      ui.repeat(function () { return trip ? phrase() : null; });

      function build() {
        trip = trips[round % trips.length];
        var d = PATHS[cfg.paths[round]];
        var S = cfg.stroke;
        banner.querySelector('.bx').textContent = phrase();
        MC.clear(board);

        var svg = MC.node(
          '<svg viewBox="0 0 720 260" style="width:100%;height:auto;touch-action:none">' +
            '<path class="track" d="' + d + '" fill="none" stroke="#F3D9E2" stroke-width="' + S + '" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 12" stroke-linecap="round" opacity=".9"/>' +
            '<path class="done" d="' + d + '" fill="none" stroke="#FF8FB1" stroke-width="' + S + '" ' +
              'stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="0 100"/>' +
            '<g class="goal"></g>' +
            '<g class="marker"><circle r="' + Math.round(S * 0.46) + '" fill="#fff" stroke="#FF8FB1" stroke-width="5"/>' +
              '<g transform="translate(-19,-19) scale(0.594)">' + art.body(trip.who) + '</g></g>' +
          '</svg>'
        );
        board.appendChild(svg);

        var track = svg.querySelector('.track');
        var done = svg.querySelector('.done');
        var marker = svg.querySelector('.marker');
        var pts = MC.pathPoints(track, 240);
        var idx = 0, active = false, finished = false;
        var z = pts[pts.length - 1];
        svg.querySelector('.goal').innerHTML =
          '<g transform="translate(' + (z.x - 26) + ',' + (z.y - 26) + ') scale(0.825)">' + art.body(trip.goal) + '</g>';

        function place(i) {
          idx = i;
          marker.setAttribute('transform', 'translate(' + pts[i].x + ',' + pts[i].y + ')');
          done.setAttribute('stroke-dasharray', Math.round(pts[i].at * 100) + ' 100');
        }
        place(0);

        function move(ev) {
          if (!active || finished) return;
          var p = MC.svgPoint(svg, ev.clientX, ev.clientY);
          var best = -1, bestD = Infinity;
          for (var i = idx; i <= Math.min(pts.length - 1, idx + 24); i++) {
            var dd = MC.dist(p.x, p.y, pts[i].x, pts[i].y);
            if (dd < bestD) { bestD = dd; best = i; }
          }
          if (best >= 0 && bestD <= S * 0.85) {
            if (best > idx) place(best);
            if (idx >= pts.length - 1) finish();
          } else if (Date.now() - lastWarn > 1500) {
            lastWarn = Date.now();
            MC.audio.sfx.soft();
            MC.ui.mascotSay(t('g.labirinto.back'), 'nudge');
          }
          ev.preventDefault();
        }
        svg.addEventListener('pointerdown', function (ev) {
          active = true;
          try { svg.setPointerCapture(ev.pointerId); } catch (e) {}
          move(ev);
        });
        svg.addEventListener('pointermove', move);
        svg.addEventListener('pointerup', function () { active = false; });
        svg.addEventListener('pointercancel', function () { active = false; });

        function finish() {
          if (finished) return;
          finished = true;
          MC.audio.sfx.success();
          MC.ui.confetti(28);
          MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
          MC.audio.speak(pick('g.labirinto.done', { w: trip.w.charAt(0).toUpperCase() + trip.w.slice(1), to: trip.to }));
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= ROUNDS) MC.ui.win('labirinto', { back: BACK });
            else build();
          }, 1900);
        }

        MC.later(function () { MC.audio.speak(phrase()); }, 400);
      }

      build();
    }
  });

})(window.MC);
