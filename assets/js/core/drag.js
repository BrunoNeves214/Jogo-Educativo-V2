/* Mundo Curioso — arrastar/largar e tracado com o dedo.
   Usa Pointer Events, por isso funciona igual com rato, dedo ou caneta.
   As tolerancias sao deliberadamente generosas: maos de 3 anos. */
(function (MC) {
  'use strict';

  /* ================= arrastar e largar ================= */

  /* MC.drag(el, {
       zones:   funcao que devolve os elementos alvo
       radius:  distancia maxima (px) entre centros para considerar largada
       onStart, onMove
       onDrop:  (zoneEl|null, api) -> true para aceitar (a peca fica onde esta)
                                     false/undefined para voltar ao lugar
     })  */
  function drag(el, opts) {
    opts = opts || {};
    var startX = 0, startY = 0, baseX = 0, baseY = 0;
    var dragging = false;
    var pid = null;

    el.classList.add('draggable');

    function currentOffset() {
      var m = el.style.transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
      return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 0, y: 0 };
    }

    function setOffset(x, y, extra) {
      el.style.transform = 'translate(' + x + 'px, ' + y + 'px)' + (extra || '');
    }

    function down(ev) {
      if (el.dataset.locked === '1') return;
      dragging = true;
      pid = ev.pointerId;
      var o = currentOffset();
      baseX = o.x; baseY = o.y;
      startX = ev.clientX; startY = ev.clientY;
      el.classList.remove('returning');
      el.classList.add('dragging');
      try { el.setPointerCapture(pid); } catch (e) { /* ignora */ }
      if (opts.onStart) opts.onStart(el);
      ev.preventDefault();
    }

    function move(ev) {
      if (!dragging || ev.pointerId !== pid) return;
      var dx = baseX + (ev.clientX - startX);
      var dy = baseY + (ev.clientY - startY);
      setOffset(dx, dy, ' scale(1.08) rotate(-4deg)');
      if (opts.onMove) opts.onMove(el, ev);
      highlight(ev);
      ev.preventDefault();
    }

    function zonesNow() {
      var z = opts.zones ? opts.zones() : [];
      return Array.prototype.slice.call(z || []);
    }

    function nearest(ev) {
      var zones = zonesNow();
      var best = null, bestD = Infinity;
      var radius = opts.radius || 110;
      var c = MC.center(el);
      zones.forEach(function (z) {
        if (!z || z.dataset.full === '1') return;
        var zc = MC.center(z);
        // aceita se o ponteiro esta dentro do alvo, ou se os centros estao perto
        var inside = ev.clientX >= zc.r.left && ev.clientX <= zc.r.right &&
                     ev.clientY >= zc.r.top && ev.clientY <= zc.r.bottom;
        var d = MC.dist(c.x, c.y, zc.x, zc.y);
        if (inside) d = Math.min(d, 1);
        if (d < bestD && (inside || d <= radius)) { bestD = d; best = z; }
      });
      return best;
    }

    function highlight(ev) {
      var hot = nearest(ev);
      zonesNow().forEach(function (z) {
        if (z) z.classList.toggle('hot', z === hot);
      });
    }

    function up(ev) {
      if (!dragging || (pid !== null && ev.pointerId !== pid)) return;
      dragging = false;
      el.classList.remove('dragging');
      try { el.releasePointerCapture(pid); } catch (e) { /* ignora */ }
      pid = null;

      var zone = nearest(ev);
      zonesNow().forEach(function (z) { if (z) z.classList.remove('hot'); });

      var accepted = false;
      if (opts.onDrop) accepted = opts.onDrop(zone, { el: el, home: home, snapTo: snapTo, settleInto: settleInto });
      if (!accepted) home();
      ev.preventDefault();
    }

    function home() {
      el.classList.add('returning');
      setOffset(0, 0);
      MC.later(function () { el.classList.remove('returning'); }, 380);
    }

    // encaixa a peca centrada sobre o alvo e trava-a
    function snapTo(target) {
      var c = MC.center(el);
      var tc = MC.center(target);
      var o = currentOffset();
      el.classList.add('returning');
      setOffset(o.x + (tc.x - c.x), o.y + (tc.y - c.y));
      MC.later(function () { el.classList.remove('returning'); }, 380);
    }

    /* Muda a peca para DENTRO do alvo e trava-a la.
       Ao contrario de snapTo (que so a desloca visualmente), a peca deixa de
       depender do sitio onde nasceu: se o tabuleiro de origem se reorganizar,
       ou a janela mudar de tamanho, ela continua exactamente no alvo.
       style: estilos a aplicar depois de entrar (ex.: ocupar a casa toda).
       A transicao usa FLIP: parte de onde o dedo a largou e desliza ate ao sitio. */
    function settleInto(target, style) {
      var before = el.getBoundingClientRect();
      el.dataset.locked = '1';
      el.classList.remove('draggable', 'dragging', 'returning');
      el.style.transition = 'none';
      el.style.transform = 'none';
      if (style) {
        Object.keys(style).forEach(function (k) { el.style[k] = style[k]; });
      }
      target.appendChild(el);

      var after = el.getBoundingClientRect();
      var dx = (before.left + before.width / 2) - (after.left + after.width / 2);
      var dy = (before.top + before.height / 2) - (after.top + after.height / 2);
      el.style.transition = '';
      // O estilo final (transform:none) ja esta aplicado; a animacao so
      // desenha o caminho ate la. Se for interrompida, a peca fica no sitio
      // certo na mesma — com uma transicao CSS podia ficar presa a meio.
      if (el.animate && (dx || dy)) {
        el.animate(
          [{ transform: 'translate(' + dx + 'px, ' + dy + 'px)' }, { transform: 'none' }],
          { duration: 300, easing: 'cubic-bezier(.3,1.3,.5,1)' }
        );
      }
    }

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    return {
      el: el,
      home: home,
      snapTo: snapTo,
      settleInto: settleInto,
      lock: function () { el.dataset.locked = '1'; el.classList.remove('draggable'); },
      destroy: function () {
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
      }
    };
  }

  /* ================= coordenadas em SVG ================= */

  // converte um ponto do ecra para as unidades internas do svg
  function svgPoint(svg, clientX, clientY) {
    var pt = svg.createSVGPoint ? svg.createSVGPoint() : null;
    if (pt && svg.getScreenCTM) {
      pt.x = clientX; pt.y = clientY;
      var ctm = svg.getScreenCTM();
      if (ctm) {
        var p = pt.matrixTransform(ctm.inverse());
        return { x: p.x, y: p.y };
      }
    }
    // alternativa quando getScreenCTM nao esta disponivel
    var r = svg.getBoundingClientRect();
    var vb = (svg.getAttribute('viewBox') || '0 0 100 100').split(/\s+/).map(Number);
    return {
      x: vb[0] + (clientX - r.left) / r.width * vb[2],
      y: vb[1] + (clientY - r.top) / r.height * vb[3]
    };
  }

  // amostra um <path> em n pontos igualmente espacados
  function pathPoints(pathEl, n) {
    var len = pathEl.getTotalLength();
    var out = [];
    var steps = n || Math.max(24, Math.round(len / 6));
    for (var i = 0; i <= steps; i++) {
      var p = pathEl.getPointAtLength(len * i / steps);
      out.push({ x: p.x, y: p.y, at: i / steps });
    }
    return out;
  }

  /* ================= tracado guiado ================= */

  /* MC.trace(svg, {
       guides:   array de <path> com o contorno pontilhado
       inks:     array de <path> que se vao "acendendo" (pathLength=100)
       tolerance: raio de aceitacao em unidades svg
       onProgress(strokeIndex, pct)
       onStroke(strokeIndex)
       onDone()
     })  */
  function trace(svg, opts) {
    opts = opts || {};
    var tol = opts.tolerance || 42;
    var strokes = opts.guides.map(function (g) {
      return { points: pathPoints(g), idx: 0 };
    });
    var cur = 0;
    var active = false;
    var finished = false;

    function paint(i) {
      var s = strokes[i];
      var pct = Math.round(s.points[s.idx] ? s.points[s.idx].at * 100 : 100);
      if (opts.inks[i]) opts.inks[i].setAttribute('stroke-dasharray', pct + ' 100');
      if (opts.onProgress) opts.onProgress(i, pct);
    }

    function reset() {
      strokes.forEach(function (s, i) {
        s.idx = 0;
        if (opts.inks[i]) opts.inks[i].setAttribute('stroke-dasharray', '0 100');
      });
      cur = 0; finished = false;
    }

    function advance(p) {
      if (finished) return;
      var s = strokes[cur];
      if (!s) return;
      // permite saltar alguns pontos de uma vez (dedo rapido)
      var limit = Math.min(s.points.length - 1, s.idx + 14);
      var moved = false;
      for (var i = s.idx; i <= limit; i++) {
        if (MC.dist(p.x, p.y, s.points[i].x, s.points[i].y) <= tol) {
          if (i >= s.idx) { s.idx = Math.min(i + 1, s.points.length - 1); moved = true; }
        }
      }
      if (moved) {
        paint(cur);
        if (s.idx >= s.points.length - 1) {
          if (opts.onStroke) opts.onStroke(cur);
          MC.audio.sfx.sparkle();
          cur++;
          if (cur >= strokes.length) {
            finished = true;
            if (opts.onDone) opts.onDone();
          }
        }
      }
    }

    function down(ev) {
      active = true;
      try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* ignora */ }
      advance(svgPoint(svg, ev.clientX, ev.clientY));
      ev.preventDefault();
    }
    function move(ev) {
      if (!active) return;
      advance(svgPoint(svg, ev.clientX, ev.clientY));
      ev.preventDefault();
    }
    function up(ev) {
      active = false;
      try { svg.releasePointerCapture(ev.pointerId); } catch (e) { /* ignora */ }
    }

    svg.style.touchAction = 'none';
    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    svg.addEventListener('pointerleave', up);

    return {
      reset: reset,
      isDone: function () { return finished; },
      destroy: function () {
        svg.removeEventListener('pointerdown', down);
        svg.removeEventListener('pointermove', move);
        svg.removeEventListener('pointerup', up);
        svg.removeEventListener('pointercancel', up);
        svg.removeEventListener('pointerleave', up);
      }
    };
  }

  MC.drag = drag;
  MC.svgPoint = svgPoint;
  MC.pathPoints = pathPoints;
  MC.trace = trace;

})(window.MC);
