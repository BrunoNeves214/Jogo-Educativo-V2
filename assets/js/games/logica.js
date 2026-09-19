/* Ilha da Logica e Memoria — cinco fases por jogo.
   11. O que vem a seguir?  cores → formas → de tres em tres → pares (AAB) → o que falta no meio
   12. Puzzle de encaixe    4 → 6 → 9 pecas → 9 sem guia → 12 pecas */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var D = MC.data;
  var ISLAND = 'logica';
  var BACK = '#/ilha/logica';

  /* ============ 11. O que vem a seguir? ============ */

  var SHAPE_ARTS = ['circle', 'square', 'triangle', 'starShape', 'heart'];

  MC.registerGame({
    id: 'sequencias', island: ISLAND, icon: 'puzzle',
    title: 'g.sequencias', sub: 'g.sequencias.sub',
    levels: [
      { label: 'Duas cores',            pats: ['AB'],  vary: 'color', opts: 2, rounds: 4 },
      { label: 'Duas formas',           pats: ['AB'],  vary: 'shape', opts: 3, rounds: 5 },
      { label: 'De três em três',       pats: ['ABC'], vary: 'both',  opts: 3, rounds: 5 },
      { label: 'Padrões com pares',     pats: ['AAB', 'ABB', 'AABB'], vary: 'both', opts: 3, rounds: 5 },
      { label: 'O que falta no meio?',  pats: ['AB', 'ABC', 'AAB', 'ABB'], vary: 'both', opts: 4, rounds: 6, middle: true }
    ],
    mount: function (app, cfg) {
      var round = 0, answer = null, busy = false;
      var q = cfg.middle ? 'g.sequencias.middle' : 'g.sequencias.prompt';

      var ui = MC.ui.screen({ title: t('g.sequencias'), island: ISLAND, back: BACK, dots: cfg.rounds, hint: cfg.label });
      app.appendChild(ui.root);
      ui.repeat(function () { return busy ? null : t(q); });

      var strip = ui.add('<div class="card row" style="padding:clamp(10px,2.2vmin,22px);gap:clamp(6px,1.6vmin,18px);max-width:94vw"></div>');
      ui.add('<div class="prompt">' + MC.esc(t(q)) + '</div>');
      var row = ui.add('<div class="row"></div>');

      function pieceHtml(p, size) {
        return '<span style="display:flex;align-items:center;justify-content:center;width:' + size +
          ';height:' + size + ';color:' + p.color + '">' + art.svg(p.shape) + '</span>';
      }

      // k pecas diferentes entre si, variando so a cor, so a forma, ou as duas
      function makeUnits(k) {
        var shapes = MC.sample(SHAPE_ARTS, k + 2);
        var colors = MC.sample(D.COLORS, k + 2);
        var fixedShape = MC.pick(SHAPE_ARTS), fixedColor = MC.pick(D.COLORS);
        return MC.range(k + 2).map(function (i) {
          var shape = cfg.vary === 'color' ? fixedShape : shapes[i];
          var color = cfg.vary === 'shape' ? fixedColor : colors[i];
          return { shape: shape, color: color.hex, id: shape + color.id };
        });
      }

      function build() {
        busy = false;
        MC.clear(strip); MC.clear(row);
        var pat = MC.pick(cfg.pats);
        var letters = pat.split('').filter(function (c, i, a) { return a.indexOf(c) === i; });
        var pool = makeUnits(letters.length);
        var unit = {};
        letters.forEach(function (c, i) { unit[c] = pool[i]; });

        var len = pat.length === 2 ? 5 : pat.length * 2;
        var seq = [];
        for (var i = 0; i <= len; i++) seq.push(unit[pat[i % pat.length]]);
        var blank = cfg.middle ? pat.length + MC.rnd(len - pat.length + 1) : len;
        answer = seq[blank];
        var shown = cfg.middle ? seq : seq.slice(0, len + 1);

        var size = shown.length > 7 ? 'clamp(34px,6.4vmin,62px)' : 'clamp(40px,7.6vmin,74px)';
        shown.forEach(function (p, k) {
          if (k === blank) {
            strip.appendChild(MC.node(
              '<div class="blank" style="width:' + size + ';height:' + size + ';border-radius:18px;' +
              'background:#F3F1FA;border:4px dashed var(--accent);display:flex;align-items:center;justify-content:center;' +
              'font:800 clamp(18px,3.6vmin,30px) \'Baloo 2\',sans-serif;color:var(--accent)">?</div>'
            ));
          } else {
            strip.appendChild(MC.node('<div>' + pieceHtml(p, size) + '</div>'));
          }
        });

        // opcoes: as pecas do padrao, mais distractores de fora
        var opts = letters.map(function (c) { return unit[c]; });
        var extra = pool.slice(letters.length);
        while (opts.length < cfg.opts && extra.length) opts.push(extra.shift());
        opts = opts.slice(0, Math.max(cfg.opts, 2));
        if (opts.indexOf(answer) === -1) opts[0] = answer;

        MC.shuffle(opts).forEach(function (p) {
          var tile = MC.node(MC.ui.tileHtml(pieceHtml(p, '58%'), null, '--tile:clamp(70px,12vmin,116px)'));
          MC.tap(tile, function () { check(p, tile); });
          row.appendChild(tile);
        });
        MC.later(function () { MC.audio.speak(t(q)); }, 350);
      }

      function check(p, tile) {
        if (busy) return;
        if (p.id === answer.id) {
          busy = true;
          var b = strip.querySelector('.blank');
          b.style.background = '#fff';
          b.style.border = 'none';
          b.innerHTML = pieceHtml(answer, '100%');
          MC.ui.markRight(tile);
          round++;
          ui.setDots(round);
          MC.later(function () {
            if (round >= cfg.rounds) MC.ui.win('sequencias', { back: BACK });
            else build();
          }, 1500);
        } else {
          MC.ui.markWrong(tile, { message: t('g.sequencias.look') });
        }
      }

      build();
    }
  });

  /* ============ 12. Puzzle de encaixe ============ */

  var PICTURES = [
    '<rect width="300" height="300" fill="#DCEFFC"/>' +
      '<circle cx="246" cy="52" r="26" fill="#FFC145"/>' +
      '<ellipse cx="70" cy="56" rx="40" ry="16" fill="#fff" opacity=".85"/>' +
      '<path d="M0 214 Q150 186 300 214 L300 300 L0 300Z" fill="#8FCB86"/>' +
      '<path d="M42 150 L150 62 L258 150 Z" fill="#FF6F59"/>' +
      '<rect x="66" y="146" width="168" height="108" rx="8" fill="#FFE2C6"/>' +
      '<rect x="128" y="188" width="46" height="66" rx="6" fill="#8B5E34"/>' +
      '<rect x="88" y="170" width="34" height="34" rx="5" fill="#4EA8DE"/>' +
      '<rect x="182" y="170" width="34" height="34" rx="5" fill="#4EA8DE"/>' +
      '<rect x="196" y="74" width="22" height="46" rx="4" fill="#C25B48"/>' +
      '<g transform="translate(110 14) scale(.5)">' + art.body('bird') + '</g>' +
      '<g transform="translate(14 170) scale(.7)">' + art.body('tree') + '</g>' +
      '<g transform="translate(246 210) scale(.6)">' + art.body('flower') + '</g>',
    '<rect width="300" height="300" fill="#BFE9E4"/>' +
      '<circle cx="54" cy="52" r="24" fill="#FFC145"/>' +
      '<ellipse cx="196" cy="44" rx="34" ry="13" fill="#fff"/>' +
      '<g transform="translate(240 40) scale(.5)">' + art.body('bird') + '</g>' +
      '<path d="M150 84 l10 -8 10 8 M166 70 l8 -6 8 6" fill="none" stroke="#6B6A8A" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M0 120 Q75 100 150 120 T300 120 L300 300 L0 300Z" fill="#4EA8DE"/>' +
      '<ellipse cx="150" cy="196" rx="62" ry="40" fill="#2EC4B6"/>' +
      '<path d="M212 196 L262 164 L262 228 Z" fill="#1FA79A"/>' +
      '<circle cx="118" cy="182" r="8" fill="#2B2A4A"/>' +
      '<path d="M0 274 Q150 254 300 274 L300 300 L0 300Z" fill="#F4E0B9"/>' +
      '<circle cx="60" cy="250" r="10" fill="#FF8FB1"/><circle cx="240" cy="256" r="12" fill="#FFC145"/>',
    // o ceu tem sempre alguma coisa: com muitas pecas, nenhuma fica em branco
      '<rect width="300" height="300" fill="#DCEFFC"/>' +
      '<circle cx="250" cy="48" r="24" fill="#FFC145"/>' +
      '<ellipse cx="60" cy="46" rx="38" ry="15" fill="#fff"/>' +
      '<ellipse cx="160" cy="100" rx="30" ry="12" fill="#fff" opacity=".9"/>' +
      '<g transform="translate(122 20) scale(.55)">' + art.body('bird') + '</g>' +
      '<g transform="translate(220 110) scale(.5)">' + art.body('bee') + '</g>' +
      '<path d="M0 210 Q150 190 300 210 L300 300 L0 300Z" fill="#8FCB86"/>' +
      '<rect x="70" y="180" width="10" height="70" rx="5" fill="#6BBF59"/>' +
      '<circle cx="75" cy="160" r="26" fill="#FF8FB1"/><circle cx="75" cy="160" r="12" fill="#FFC145"/>' +
      '<rect x="150" y="196" width="10" height="56" rx="5" fill="#6BBF59"/>' +
      '<circle cx="155" cy="178" r="22" fill="#B892FF"/><circle cx="155" cy="178" r="10" fill="#FFC145"/>' +
      '<rect x="228" y="188" width="10" height="64" rx="5" fill="#6BBF59"/>' +
      '<circle cx="233" cy="170" r="24" fill="#FF6F59"/><circle cx="233" cy="170" r="11" fill="#FFC145"/>',
    // quinta com celeiro e vaca
    '<rect width="300" height="300" fill="#DCEFFC"/>' +
      '<ellipse cx="220" cy="50" rx="46" ry="16" fill="#fff"/>' +
      '<circle cx="44" cy="44" r="22" fill="#FFC145"/>' +
      '<g transform="translate(140 30) scale(.5)">' + art.body('bird') + '</g>' +
      '<g transform="translate(236 104) scale(.55)">' + art.body('rooster') + '</g>' +
      '<path d="M0 190 Q150 170 300 190 L300 300 L0 300Z" fill="#9FD692"/>' +
      '<rect x="30" y="110" width="110" height="100" fill="#E0543E"/>' +
      '<path d="M22 114 L85 64 L148 114Z" fill="#B23B2B"/>' +
      '<rect x="66" y="150" width="38" height="60" fill="#FFF3DC"/>' +
      '<path d="M66 150l38 60M104 150l-38 60" stroke="#E0543E" stroke-width="5"/>' +
      '<g transform="translate(170 170) scale(1.6)">' + art.body('cow') + '</g>',
    // noite com lua e estrelas
    '<rect width="300" height="300" fill="#2B2A4A"/>' +
      '<g transform="translate(180 30) scale(1.4)">' + art.body('moon') + '</g>' +
      '<g fill="#FFC145"><circle cx="40" cy="50" r="4"/><circle cx="110" cy="90" r="3"/><circle cx="70" cy="140" r="4"/>' +
      '<circle cx="150" cy="40" r="3"/><circle cx="260" cy="170" r="4"/><circle cx="30" cy="190" r="3"/></g>' +
      '<path d="M0 230 Q150 200 300 230 L300 300 L0 300Z" fill="#3E5C4E"/>' +
      '<rect x="120" y="190" width="70" height="60" fill="#8E7DBE"/>' +
      '<path d="M112 194 L155 160 L198 194Z" fill="#6A5A9C"/>' +
      '<rect x="146" y="206" width="18" height="18" fill="#FFC145"/>'
  ];

  MC.registerGame({
    id: 'encaixe', island: ISLAND, icon: 'grid',
    title: 'g.encaixe', sub: 'g.encaixe.sub',
    levels: [
      { label: 'Quatro peças',     r: 2, c: 2, guide: 0.2 },
      { label: 'Seis peças',       r: 2, c: 3, guide: 0.18 },
      { label: 'Nove peças',       r: 3, c: 3, guide: 0.14 },
      { label: 'Nove, sem ajuda',  r: 3, c: 3, guide: 0, preview: true },
      { label: 'Doze peças',       r: 3, c: 4, guide: 0.06, preview: true }
    ],
    mount: function (app, cfg) {
      var total = cfg.r * cfg.c, placed = 0;
      var pic = MC.pick(PICTURES);

      var ui = MC.ui.screen({ title: t('g.encaixe'), island: ISLAND, back: BACK, hint: cfg.label, stageClass: 'tight' });
      app.appendChild(ui.root);
      ui.repeat(function () { return t('g.encaixe.prompt'); });

      var wrap = ui.add(
        '<div class="row" style="align-items:center;gap:clamp(12px,3vw,40px)">' +
          (cfg.preview ? '<div class="card preview" style="padding:8px;text-align:center">' +
            '<div class="hint" style="margin:0 0 4px">' + MC.esc(t('g.encaixe.model')) + '</div>' +
            '<svg viewBox="0 0 300 300" style="width:clamp(70px,13vmin,120px);height:clamp(70px,13vmin,120px);border-radius:10px">' +
            pic + '</svg></div>' : '') +
          '<div class="board card" style="position:relative;padding:0;overflow:hidden;' +
            'width:clamp(200px,40vmin,380px);height:clamp(200px,40vmin,380px)"></div>' +
          '<div class="tray row" style="max-width:clamp(140px,26vw,300px)"></div>' +
        '</div>'
      );
      var board = wrap.querySelector('.board');
      var tray = wrap.querySelector('.tray');

      board.appendChild(MC.node(
        '<svg viewBox="0 0 300 300" style="position:absolute;inset:0;width:100%;height:100%;opacity:' + cfg.guide + '">' + pic + '</svg>'
      ));
      var slots = MC.node(
        '<div class="slots" style="position:absolute;inset:0;display:grid;' +
        'grid-template-columns:repeat(' + cfg.c + ',1fr);grid-template-rows:repeat(' + cfg.r + ',1fr)"></div>'
      );
      board.appendChild(slots);
      MC.range(total).forEach(function (i) {
        slots.appendChild(MC.node('<div class="slot cell" data-i="' + i + '" style="border:2px dashed rgba(43,42,74,.22);min-width:0;min-height:0"></div>'));
      });

      var cw = 300 / cfg.c, ch = 300 / cfg.r;
      var bw = board.getBoundingClientRect().width || 300;
      var pw = Math.round(bw / cfg.c * 0.78), ph = Math.round(bw / cfg.r * 0.78);

      MC.shuffle(MC.range(total)).forEach(function (i) {
        var r = Math.floor(i / cfg.c), c = i % cfg.c;
        var piece = MC.node(
          '<div class="piece" data-i="' + i + '" style="width:' + pw + 'px;height:' + ph + 'px;' +
          'border-radius:8px;overflow:hidden;box-shadow:0 8px 14px rgba(43,42,74,.2);background:#fff">' +
          '<svg viewBox="' + (c * cw) + ' ' + (r * ch) + ' ' + cw + ' ' + ch + '" preserveAspectRatio="none" ' +
          'style="width:100%;height:100%">' + pic + '</svg></div>'
        );
        tray.appendChild(piece);

        MC.drag(piece, {
          zones: function () { return MC.qsa('.cell', slots); },
          radius: 80,
          onStart: function () { MC.audio.sfx.tap(); },
          onDrop: function (zone, api) {
            if (!zone) return false;
            if (parseInt(zone.dataset.i, 10) === i) {
              zone.dataset.full = '1';
              zone.style.border = 'none';
              api.settleInto(zone, {
                width: '100%', height: '100%', borderRadius: '0', boxShadow: 'none', display: 'block'
              });
              MC.audio.sfx.snap();
              MC.ui.confetti(6);
              placed++;
              if (placed >= total) {
                MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
                MC.audio.speak(pick('g.encaixe.done'));
                MC.later(function () { MC.ui.win('encaixe', { back: BACK }); }, 1200);
              }
              return true;
            }
            zone.classList.remove('refuse');
            void zone.offsetWidth;
            zone.classList.add('refuse');
            MC.audio.sfx.soft();
            return false;
          }
        });
      });

      MC.later(function () { MC.audio.speak(t('g.encaixe.prompt')); }, 400);
    }
  });

})(window.MC);
