/* Ilha da Musica e Ritmo — cinco fases por jogo.
   24. Instrumentos   tambor e sino → percussao → xilofone → piano → toca uma cancao a seguir as luzes
   25. Repete         2 sons → 3 → sequencias de 3 → 4 sons → so de ouvido */
(function (MC) {
  'use strict';

  var t = function (k, v) { return MC.i18n.t(k, v); };
  var pick = function (k, v) { return MC.i18n.pick(k, v); };
  var art = MC.art;
  var ISLAND = 'musica';
  var BACK = '#/ilha/musica';

  var BAR_COLORS = ['#FF6F59', '#F4A261', '#FFC145', '#6BBF59', '#2EC4B6', '#4EA8DE', '#8E7DBE', '#FF8FB1'];

  var KIT = {
    drum:     { art: 'drum',         bg: '#FFE7E1', pt: 'tambor',    play: function () { MC.audio.instrument.drum(); } },
    bell:     { art: 'bell',         bg: '#FFF3D9', pt: 'sino',      play: function () { MC.audio.instrument.bell(); } },
    triangle: { art: 'triangleInst', bg: '#E3F2FB', pt: 'triângulo', play: function () { MC.audio.instrument.triangle(); } },
    shaker:   { art: 'shaker',       bg: '#E8F6E4', pt: 'maracas',   play: function () { MC.audio.instrument.shaker(); } }
  };

  // melodias simples do dominio publico, em notas do xilofone (0 = do ... 7 = do agudo)
  var SONGS = [
    { name: 'Brilha, brilha, estrelinha', notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0] },
    { name: 'Frei João',                  notes: [0, 1, 2, 0, 0, 1, 2, 0, 2, 3, 4, 2, 3, 4] }
  ];

  /* ============ 24. Instrumentos ============ */

  MC.registerGame({
    id: 'instrumentos', island: ISLAND, icon: 'note',
    title: 'g.instrumentos', sub: 'g.instrumentos.sub',
    levels: [
      { label: 'Tambor e sino',      set: 'kit',  kit: ['drum', 'bell'] },
      { label: 'Percussão',          set: 'kit',  kit: ['drum', 'bell', 'triangle', 'shaker'] },
      { label: 'Xilofone',           set: 'xylo' },
      { label: 'Piano',              set: 'piano' },
      { label: 'Toca uma canção',    set: 'song' }
    ],
    mount: function (app, cfg) {
      var ui = MC.ui.screen({ title: t('g.instrumentos'), island: ISLAND, back: BACK, hint: cfg.label, stageClass: 'tight' });
      app.appendChild(ui.root);
      var visited = {}, total = 0, ended = false;
      var prompt = cfg.set === 'song' ? 'g.instrumentos.song' : 'g.instrumentos.explore';
      ui.repeat(function () { return ended ? null : t(prompt); });

      // nas fases livres, experimentar todos os sons conclui a fase
      function visit(key, el) {
        if (cfg.set === 'song' || visited[key] || ended) return;
        visited[key] = true;
        el.appendChild(MC.node('<div class="check" style="top:-8px;right:-8px">' + art.svg('check', { color: '#fff' }) + '</div>'));
        if (Object.keys(visited).length >= total) {
          ended = true;
          MC.later(function () {
            MC.audio.sfx.fanfare();
            MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
            MC.later(function () { MC.ui.win('instrumentos', { back: BACK }); }, 1400);
          }, 900);
        }
      }

      function bounce(el) {
        if (el.animate) el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 240 });
      }

      if (cfg.set === 'kit') {
        var pads = ui.add('<div class="row"></div>');
        total = cfg.kit.length;
        var big = total <= 2 ? 'clamp(120px,24vmin,210px)' : 'clamp(84px,16vmin,140px)';
        cfg.kit.forEach(function (k) {
          var ins = KIT[k];
          var pad = MC.node(
            '<button class="card" style="position:relative;width:' + big + ';height:' + big + ';background:' + ins.bg +
            ';display:flex;align-items:center;justify-content:center;padding:16px">' + art.svg(ins.art) + '</button>'
          );
          pads.appendChild(pad);
          MC.tap(pad, function () { ins.play(); bounce(pad); visit(k, pad); });
        });
      }

      var bars = [];
      if (cfg.set === 'xylo' || cfg.set === 'song') {
        var xrow = ui.add('<div class="row" style="align-items:flex-start;gap:clamp(5px,1.2vmin,12px)"></div>');
        total = 8;
        BAR_COLORS.forEach(function (c, i) {
          var h = 100 - i * 7;
          var bar = MC.node(
            '<button class="bar" style="position:relative;width:clamp(28px,5.4vmin,58px);height:clamp(' + (h * 1.1) + 'px,' +
            (h * 0.24) + 'vh,' + (h * 2) + 'px);border-radius:14px;background:' + c + ';' +
            'box-shadow:0 8px 14px rgba(43,42,74,.18);transition:transform .1s ease, box-shadow .2s ease"></button>'
          );
          xrow.appendChild(bar);
          bars.push(bar);
          MC.tap(bar, function () {
            MC.audio.instrument.xylo(i);
            bar.style.transform = 'scaleY(.94)';
            MC.later(function () { bar.style.transform = ''; }, 120);
            visit('b' + i, bar);
            if (cfg.set === 'song') songTap(i);
          });
        });
      }

      if (cfg.set === 'piano') {
        total = 8;
        var kb = ui.add('<div class="piano" style="position:relative;display:flex;gap:4px;padding:12px;background:#2B2A4A;border-radius:22px;box-shadow:var(--shadow-l)"></div>');
        BAR_COLORS.forEach(function (c, i) {
          var key = MC.node(
            '<button class="key" style="position:relative;width:clamp(34px,7vmin,70px);height:clamp(130px,30vmin,250px);' +
            'background:#fff;border-radius:0 0 12px 12px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:12px;' +
            'transition:background .12s ease">' +
            '<span style="width:clamp(12px,2.4vmin,20px);height:clamp(12px,2.4vmin,20px);border-radius:50%;background:' + c + '"></span></button>'
          );
          kb.appendChild(key);
          MC.tap(key, function () {
            MC.audio.instrument.piano(i);
            key.style.background = '#F1EFF8';
            MC.later(function () { key.style.background = '#fff'; }, 160);
            visit('k' + i, key);
          });
        });
        // teclas pretas, so de enfeite
        [0, 1, 3, 4, 5].forEach(function (i) {
          kb.appendChild(MC.node(
            '<span style="position:absolute;top:12px;left:calc(12px + (' + (i + 1) + ' * (clamp(34px,7vmin,70px) + 4px)) - clamp(11px,2.2vmin,22px));' +
            'width:clamp(22px,4.4vmin,44px);height:clamp(78px,18vmin,150px);background:#2B2A4A;border-radius:0 0 8px 8px;pointer-events:none"></span>'
          ));
        });
      }

      // --- modo cancao: a barra que brilha e a proxima nota ---
      var song = cfg.set === 'song' ? MC.pick(SONGS) : null, note = 0;
      function light() {
        bars.forEach(function (b, i) {
          var on = song && i === song.notes[note];
          b.style.boxShadow = on ? '0 0 0 5px #fff, 0 0 0 10px ' + BAR_COLORS[i] + ', 0 10px 22px rgba(43,42,74,.3)' : '0 8px 14px rgba(43,42,74,.18)';
          b.classList.toggle('pulse-dot', !!on);
        });
      }
      function songTap(i) {
        if (!song || ended) return;
        if (i !== song.notes[note]) return;       // outra barra: so toca, sem castigo
        note++;
        if (note >= song.notes.length) {
          ended = true;
          light();
          bars.forEach(function (b) { b.style.boxShadow = '0 8px 14px rgba(43,42,74,.18)'; b.classList.remove('pulse-dot'); });
          // a cancao inteira toca de seguida, como recompensa
          MC.later(function () {
            song.notes.forEach(function (n, k) { MC.later(function () { MC.audio.instrument.xylo(n); bounce(bars[n]); }, k * 330); });
            MC.later(function () {
              MC.audio.speak(pick('g.instrumentos.songDone', { name: song.name }));
              MC.later(function () { MC.ui.win('instrumentos', { back: BACK }); }, 2200);
            }, song.notes.length * 330 + 300);
          }, 500);
          return;
        }
        light();
      }
      if (song) {
        ui.add('<div class="pill">' + MC.esc(song.name) + '</div>');
        light();
      }

      MC.later(function () { MC.audio.speak(t(prompt)); }, 400);
    }
  });

  /* ============ 25. Repete a sequencia ============ */

  var PADS = [
    { art: 'drum',  color: '#FF6F59', soft: '#FFE7E1', play: function () { MC.audio.instrument.drum(); } },
    { art: 'bell',  color: '#FFC145', soft: '#FFF3D9', play: function () { MC.audio.instrument.bell(); } },
    { art: 'xylo',  color: '#4EA8DE', soft: '#E3F2FB', play: function () { MC.audio.instrument.xylo(4); } },
    { art: 'shaker', color: '#6BBF59', soft: '#E8F6E4', play: function () { MC.audio.instrument.shaker(); } }
  ];

  MC.registerGame({
    id: 'repetir', island: ISLAND, icon: 'note',
    title: 'g.repetir', sub: 'g.repetir.sub',
    levels: [
      { label: 'Dois sons',            pads: 2, len: [2, 2], rounds: 3 },
      { label: 'Três sons',            pads: 3, len: [2, 3], rounds: 4 },
      { label: 'Sequências de três',   pads: 3, len: [3, 3], rounds: 4 },
      { label: 'Quatro sons',          pads: 4, len: [3, 4], rounds: 4 },
      { label: 'Só de ouvido',         pads: 4, len: [3, 4], rounds: 4, ear: true }
    ],
    mount: function (app, cfg) {
      var pads = PADS.slice(0, cfg.pads);
      var round = 0, seq = [], step = 0, phase = 'idle';

      var ui = MC.ui.screen({ title: t('g.repetir'), island: ISLAND, back: BACK, dots: cfg.rounds, stageClass: 'tight', hint: cfg.label });
      app.appendChild(ui.root);

      var strip = ui.add('<div class="card row" style="padding:clamp(10px,2vmin,18px);gap:clamp(6px,1.4vmin,14px);' +
        'min-height:clamp(52px,9vmin,84px);visibility:hidden"></div>');
      var status = ui.add('<div class="prompt"></div>');
      var row = ui.add('<div class="row"></div>');
      var startBtn = ui.add('<button class="btn primary big">' + MC.esc(t('g.repetir.start')) + '</button>');

      var padEls = [];
      pads.forEach(function (p, i) {
        var pad = MC.node(
          '<button class="pad card" style="width:clamp(80px,16vmin,150px);height:clamp(80px,16vmin,150px);background:' + p.soft +
          ';display:flex;align-items:center;justify-content:center;padding:16px;transition:transform .12s ease, background .2s ease">' +
          art.svg(p.art) + '</button>'
        );
        row.appendChild(pad);
        padEls.push(pad);
        MC.tap(pad, function () { press(i); });
      });

      MC.tap(startBtn, function () { startBtn.style.display = 'none'; startRound(); });
      ui.repeat(function () {
        if (phase === 'play') return t('g.repetir.yourTurn');
        if (phase === 'idle' && !seq.length) return t(cfg.ear ? 'g.repetir.earIntro' : 'g.repetir.sub');
        return null;
      });

      function flash(i, strong) {
        var p = pads[i], pad = padEls[i];
        pad.style.background = strong === false ? p.soft : p.color;
        pad.style.transform = 'scale(1.08)';
        MC.later(function () { pad.style.background = p.soft; pad.style.transform = 'scale(1)'; }, 340);
      }

      function drawStrip(revealed) {
        MC.clear(strip);
        strip.style.visibility = seq.length ? 'visible' : 'hidden';
        seq.forEach(function (id, i) {
          if (revealed && !cfg.ear) {
            strip.appendChild(MC.node('<span style="width:clamp(30px,5.4vmin,48px);height:clamp(30px,5.4vmin,48px);display:flex">' +
              art.svg(pads[id].art) + '</span>'));
          } else {
            strip.appendChild(MC.node('<span style="width:clamp(30px,5.4vmin,48px);height:clamp(30px,5.4vmin,48px);border-radius:50%;' +
              'background:' + (i < step ? pads[seq[i]].color : '#EDEBF5') + '"></span>'));
          }
        });
      }

      function playSeq(delay) {
        phase = 'listen';
        status.textContent = t('g.repetir.listen');
        drawStrip(true);
        seq.forEach(function (id, i) {
          MC.later(function () {
            pads[id].play();
            // no modo "so de ouvido" os botoes nao acendem: e so pelo som
            if (!cfg.ear) flash(id);
            if (i === seq.length - 1) {
              MC.later(function () {
                phase = 'play';
                step = 0;
                drawStrip(false);
                status.textContent = t('g.repetir.yourTurn');
                MC.audio.speak(t('g.repetir.yourTurn'));
              }, 800);
            }
          }, delay + i * 850);
        });
      }

      function startRound() {
        var len = cfg.len[0] + MC.rnd(cfg.len[1] - cfg.len[0] + 1);
        seq = [];
        // evita tres iguais seguidos, que confundem mais do que ensinam
        while (seq.length < len) {
          var n = MC.rnd(pads.length);
          if (seq.length >= 2 && seq[seq.length - 1] === n && seq[seq.length - 2] === n) continue;
          seq.push(n);
        }
        step = 0;
        strip.dataset.seq = seq.join('');
        MC.audio.speak(t('g.repetir.listen'));
        playSeq(1000);
      }

      function press(i) {
        pads[i].play();
        flash(i);
        if (phase !== 'play') return;           // fora da vez: e so um instrumento
        if (i === seq[step]) {
          step++;
          drawStrip(false);
          if (step >= seq.length) {
            phase = 'idle';
            MC.audio.sfx.success();
            MC.ui.confetti(20);
            MC.ui.mascotSay(MC.i18n.praise(), 'cheer');
            MC.audio.speak(MC.i18n.praise());
            round++;
            ui.setDots(round);
            MC.later(function () {
              if (round >= cfg.rounds) MC.ui.win('repetir', { back: BACK });
              else startRound();
            }, 1700);
          }
        } else {
          // sem perder: volta a ouvir a sequencia
          phase = 'idle';
          MC.audio.sfx.soft();
          MC.ui.mascotSay(t('try.3'), 'nudge');
          MC.audio.speak(t('try.3'));
          MC.later(function () { playSeq(600); }, 1200);
        }
      }

      status.textContent = t(cfg.ear ? 'g.repetir.earIntro' : 'g.repetir.sub');
      drawStrip(false);
    }
  });

})(window.MC);
