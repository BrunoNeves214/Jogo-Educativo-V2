/* Mundo Curioso — som.
   Tudo e sintetizado com a Web Audio API e a voz vem da sintese de fala do
   sistema, por isso a app nao carrega um unico ficheiro de audio e funciona
   offline. Os sons de animais sao aproximacoes; ver nota no README sobre
   substitui-los por gravacoes reais. */
(function (MC) {
  'use strict';

  var ctx = null;
  var master = null;
  var musicGain = null;
  var musicTimer = null;

  function ac() {
    if (!ctx) {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.0;
      musicGain.connect(master);
    }
    return ctx;
  }

  function on() { return MC.store.get('sfx') !== false; }
  function now() { return ac() ? ctx.currentTime : 0; }

  /* ---------------- blocos base ---------------- */

  // Oscilador com envelope. freq pode ser um numero ou [inicio, fim].
  function tone(opt) {
    if (!on() || !ac()) return;
    var t0 = ctx.currentTime + (opt.delay || 0);
    var dur = opt.dur || 0.25;
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    var node = g;

    osc.type = opt.type || 'sine';
    if (Array.isArray(opt.freq)) {
      osc.frequency.setValueAtTime(opt.freq[0], t0);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, opt.freq[1]), t0 + dur);
    } else {
      osc.frequency.setValueAtTime(opt.freq || 440, t0);
    }

    if (opt.filter) {
      var f = ctx.createBiquadFilter();
      f.type = opt.filter.type || 'lowpass';
      f.frequency.value = opt.filter.freq || 1200;
      f.Q.value = opt.filter.q || 1;
      g.connect(f);
      node = f;
    }

    // vibrato opcional (usado nos sons de animais)
    if (opt.vibrato) {
      var lfo = ctx.createOscillator();
      var lg = ctx.createGain();
      lfo.frequency.value = opt.vibrato.rate || 10;
      lg.gain.value = opt.vibrato.depth || 20;
      lfo.connect(lg); lg.connect(osc.frequency);
      lfo.start(t0); lfo.stop(t0 + dur + 0.05);
    }

    var peak = (opt.gain === undefined ? 0.28 : opt.gain);
    var atk = opt.attack === undefined ? 0.012 : opt.attack;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g);
    node.connect(opt.dest || master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // Rajada de ruido branco filtrado (percussao, sopros, latidos).
  function noise(opt) {
    if (!on() || !ac()) return;
    opt = opt || {};
    var t0 = ctx.currentTime + (opt.delay || 0);
    var dur = opt.dur || 0.2;
    var frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    var buf = ctx.createBuffer(1, frames, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < frames; i++) d[i] = Math.random() * 2 - 1;

    var src = ctx.createBufferSource();
    src.buffer = buf;
    var f = ctx.createBiquadFilter();
    f.type = opt.type || 'bandpass';
    f.frequency.setValueAtTime(opt.freq || 900, t0);
    if (opt.freqEnd) f.frequency.exponentialRampToValueAtTime(Math.max(1, opt.freqEnd), t0 + dur);
    f.Q.value = opt.q || 1;

    var g = ctx.createGain();
    var peak = opt.gain === undefined ? 0.22 : opt.gain;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  /* ---------------- efeitos de interface ---------------- */

  var SFX = {
    tap: function () { tone({ freq: 660, dur: 0.09, type: 'sine', gain: 0.14 }); },
    pop: function () { tone({ freq: [420, 900], dur: 0.14, type: 'sine', gain: 0.2 }); },
    snap: function () { tone({ freq: [900, 500], dur: 0.12, type: 'triangle', gain: 0.22 }); },
    whoosh: function () { noise({ freq: 1600, freqEnd: 300, dur: 0.28, gain: 0.1, q: 0.7 }); },

    // acerto: arpejo alegre em do maior
    success: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone({ freq: f, dur: 0.34, type: 'triangle', gain: 0.22, delay: i * 0.085 });
      });
    },

    // erro: dois tons suaves e descendentes, nunca estridente
    soft: function () {
      tone({ freq: 392, dur: 0.22, type: 'sine', gain: 0.16 });
      tone({ freq: 329.63, dur: 0.3, type: 'sine', gain: 0.14, delay: 0.14 });
    },

    // fim de jogo: fanfarra curta
    fanfare: function () {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
        tone({ freq: f, dur: 0.5, type: 'triangle', gain: 0.2, delay: i * 0.11 });
      });
      MC.later(function () {
        tone({ freq: 1046.5, dur: 0.9, type: 'sine', gain: 0.18 });
        tone({ freq: 1567.98, dur: 0.9, type: 'sine', gain: 0.1 });
      }, 620);
    },

    sparkle: function () {
      [1318.5, 1760, 2093].forEach(function (f, i) {
        tone({ freq: f, dur: 0.22, type: 'sine', gain: 0.1, delay: i * 0.05 });
      });
    },

    count: function (n) {
      tone({ freq: 392 * Math.pow(1.0595, (n || 0) * 2), dur: 0.16, type: 'triangle', gain: 0.18 });
    }
  };

  /* ---------------- instrumentos ---------------- */

  var XYLO = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];

  var INSTRUMENT = {
    drum: function () {
      tone({ freq: [180, 55], dur: 0.32, type: 'sine', gain: 0.5 });
      noise({ freq: 240, dur: 0.12, gain: 0.16, type: 'lowpass' });
    },
    xylo: function (i) {
      var f = XYLO[(i || 0) % XYLO.length];
      tone({ freq: f, dur: 0.85, type: 'sine', gain: 0.26 });
      tone({ freq: f * 3.01, dur: 0.25, type: 'sine', gain: 0.07 });
    },
    bell: function () {
      tone({ freq: 1244.5, dur: 1.5, type: 'sine', gain: 0.18 });
      tone({ freq: 1864.7, dur: 1.1, type: 'sine', gain: 0.08 });
      tone({ freq: 2489, dur: 0.7, type: 'sine', gain: 0.04 });
    },
    triangle: function () {
      tone({ freq: 2093, dur: 1.6, type: 'sine', gain: 0.12 });
      tone({ freq: 3136, dur: 1.2, type: 'sine', gain: 0.06 });
    },
    shaker: function () {
      noise({ freq: 6500, dur: 0.14, gain: 0.12, q: 0.8 });
    },
    piano: function (i) {
      var f = XYLO[(i || 0) % XYLO.length] / 2;
      tone({ freq: f, dur: 0.7, type: 'triangle', gain: 0.24 });
      tone({ freq: f * 2, dur: 0.4, type: 'sine', gain: 0.08 });
    }
  };

  /* ---------------- sons de animais ---------------- */

  var ANIMAL = {
    dog: function () {
      [0, 0.26].forEach(function (d) {
        tone({ freq: [280, 130], dur: 0.16, type: 'sawtooth', gain: 0.3, delay: d,
               filter: { type: 'lowpass', freq: 1100 } });
        noise({ freq: 700, freqEnd: 300, dur: 0.14, gain: 0.16, delay: d, q: 1.2 });
      });
    },
    cat: function () {
      tone({ freq: [560, 820], dur: 0.2, type: 'sawtooth', gain: 0.18,
             filter: { type: 'lowpass', freq: 1800 }, vibrato: { rate: 7, depth: 30 } });
      tone({ freq: [820, 380], dur: 0.45, type: 'sawtooth', gain: 0.2, delay: 0.18,
             filter: { type: 'lowpass', freq: 1500 }, vibrato: { rate: 6, depth: 26 } });
    },
    cow: function () {
      tone({ freq: [150, 118], dur: 1.0, type: 'sawtooth', gain: 0.28, attack: 0.08,
             filter: { type: 'lowpass', freq: 620 }, vibrato: { rate: 4, depth: 8 } });
    },
    sheep: function () {
      tone({ freq: [360, 300], dur: 0.8, type: 'sawtooth', gain: 0.2, attack: 0.05,
             filter: { type: 'lowpass', freq: 1500 }, vibrato: { rate: 14, depth: 34 } });
    },
    duck: function () {
      [0, 0.22, 0.44].forEach(function (d) {
        tone({ freq: [330, 250], dur: 0.14, type: 'square', gain: 0.16, delay: d,
               filter: { type: 'bandpass', freq: 900, q: 3 } });
      });
    },
    bird: function () {
      [0, 0.13, 0.28].forEach(function (d, i) {
        tone({ freq: [2400 + i * 200, 3600], dur: 0.09, type: 'sine', gain: 0.14, delay: d });
      });
    },
    horse: function () {
      tone({ freq: [700, 260], dur: 0.7, type: 'sawtooth', gain: 0.2,
             filter: { type: 'lowpass', freq: 2200 }, vibrato: { rate: 18, depth: 60 } });
      noise({ freq: 1200, dur: 0.3, gain: 0.07, delay: 0.5 });
    },
    pig: function () {
      [0, 0.2, 0.4].forEach(function (d) {
        tone({ freq: [240, 170], dur: 0.13, type: 'sawtooth', gain: 0.2, delay: d,
               filter: { type: 'lowpass', freq: 900 } });
        noise({ freq: 500, dur: 0.1, gain: 0.1, delay: d });
      });
    },
    frog: function () {
      [0, 0.24].forEach(function (d) {
        tone({ freq: 130, dur: 0.2, type: 'square', gain: 0.18, delay: d,
               filter: { type: 'lowpass', freq: 600 }, vibrato: { rate: 30, depth: 40 } });
      });
    },
    lion: function () {
      tone({ freq: [110, 70], dur: 1.3, type: 'sawtooth', gain: 0.3, attack: 0.15,
             filter: { type: 'lowpass', freq: 500 }, vibrato: { rate: 9, depth: 12 } });
      noise({ freq: 320, dur: 1.1, gain: 0.1, q: 0.6 });
    },
    elephant: function () {
      tone({ freq: [420, 240], dur: 0.9, type: 'sawtooth', gain: 0.24, attack: 0.06,
             filter: { type: 'bandpass', freq: 800, q: 2 }, vibrato: { rate: 6, depth: 25 } });
    },
    rooster: function () {
      [[700, 0], [900, 0.2], [780, 0.42], [520, 0.66]].forEach(function (p) {
        tone({ freq: p[0], dur: 0.22, type: 'sawtooth', gain: 0.2, delay: p[1],
               filter: { type: 'lowpass', freq: 2400 }, vibrato: { rate: 12, depth: 30 } });
      });
    },
    bee: function () {
      tone({ freq: 220, dur: 0.9, type: 'sawtooth', gain: 0.1,
             filter: { type: 'lowpass', freq: 700 }, vibrato: { rate: 26, depth: 18 } });
    },
    // rato: guinchos agudos e curtinhos
    mouse: function () {
      [0, 0.16, 0.3].forEach(function (d) {
        tone({ freq: [2600, 3400], dur: 0.07, type: 'sine', gain: 0.1, delay: d });
      });
    },
    // coelho: nao tem voz; um fungar suave e um pulinho
    rabbit: function () {
      [0, 0.12, 0.24].forEach(function (d) {
        noise({ freq: 3200, dur: 0.06, gain: 0.06, delay: d, q: 2 });
      });
      tone({ freq: [180, 90], dur: 0.14, type: 'sine', gain: 0.22, delay: 0.46 });
    },
    fish: function () {
      [0, 0.15, 0.3].forEach(function (d) {
        tone({ freq: [900, 1500], dur: 0.06, type: 'sine', gain: 0.08, delay: d });
      });
    }
  };

  /* ---------------- voz ---------------- */

  var synth = window.speechSynthesis || null;
  var voices = [];

  function refreshVoices() {
    if (!synth) return;
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
  }
  if (synth) {
    refreshVoices();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', refreshVoices);
    }
  }

  /* A qualidade da voz depende quase toda do motor que o aparelho oferece.
     As vozes "naturais"/neurais (Edge, Safari com vozes melhoradas, Android
     recente) soam humanas; as vozes antigas de secretaria soam a robo.
     Por isso damos pontos a cada voz e ficamos com a melhor. */

  var NATURAL = /natural|neural|online|enhanced|premium|melhorad|siri/i;
  var SOFT_NAMES = /raquel|fernanda|joana|catarina|francisca|luciana|camila|thalita|vit[oó]ria|leila|yara|brenda/i;

  function isNatural(v) { return NATURAL.test(v.name || ''); }

  function scoreVoice(v, locale) {
    var lang = (v.lang || '').toLowerCase().replace('_', '-');
    var want = locale.toLowerCase();
    var score = 0;
    if (lang === want) score += 50;
    else if (lang.indexOf(want.split('-')[0]) === 0) score += 20;
    else return -1;                         // outra lingua: nunca
    if (isNatural(v)) score += 45;          // o que mais pesa na suavidade
    if (/google/i.test(v.name)) score += 25;
    if (SOFT_NAMES.test(v.name)) score += 6; // vozes femininas calmas, para criancas
    if (v.localService === false) score += 3;
    return score;
  }

  function ptVoices() {
    if (!voices.length) refreshVoices();
    return voices.filter(function (v) { return /^pt/i.test(v.lang || ''); });
  }

  function bestVoice(locale) {
    if (!voices.length) refreshVoices();
    if (!voices.length) return null;
    // escolha manual feita na area dos pais
    var chosen = MC.store.get('voiceName');
    if (chosen) {
      var m = voices.filter(function (v) { return v.name === chosen; });
      if (m.length) return m[0];
    }
    var best = null, bestScore = -1;
    voices.forEach(function (v) {
      var sc = scoreVoice(v, locale);
      if (sc > bestScore) { bestScore = sc; best = v; }
    });
    return bestScore >= 0 ? best : null;
  }

  /* Pequenos ajustes de texto que fazem muita diferenca no som:
     - palavras em MAIUSCULAS passam a minusculas (senao sao soletradas
       ou lidas com enfase estranha);
     - uma letra isolada e lida pelo seu nome ("bê", "agá"...), porque os
       motores costumam dizer mal letras soltas;
     - a frase termina sempre com pontuacao, para a entoacao descer. */
  var LETTER_NAME = {
    A: 'á', B: 'bê', C: 'cê', D: 'dê', E: 'é', F: 'éfe', G: 'guê', H: 'agá', I: 'i',
    J: 'jota', K: 'capa', L: 'éle', M: 'éme', N: 'éne', O: 'ó', P: 'pê', Q: 'quê',
    R: 'érre', S: 'ésse', T: 'tê', U: 'u', V: 'vê', W: 'dâblio', X: 'xis', Y: 'ípsilon', Z: 'zê'
  };

  function letterName(ch) {
    var up = String(ch).toUpperCase();
    return LETTER_NAME[up] || String(ch);
  }

  function humanize(text) {
    var s = String(text).trim();
    if (/^[A-Za-z]$/.test(s)) return letterName(s);
    s = s.replace(/[A-ZÀ-ÖØ-Þ]{2,}/g, function (w) { return w.toLowerCase(); });
    if (!/[.!?…]$/.test(s)) s += '.';
    return s;
  }

  // Le um texto em voz alta. Devolve uma promessa que resolve no fim
  // (ou de imediato se a voz estiver desligada ou indisponivel).
  function speak(text, opt) {
    opt = opt || {};
    if (!text) return Promise.resolve();
    if (MC.store.get('voice') === false && !opt.force) return Promise.resolve();
    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') {
      return Promise.resolve();
    }
    // falar conta como "acabou de haver instrucao": adia a repeticao
    if (MC.ui && MC.ui.bumpRepeat) MC.ui.bumpRepeat();

    var said = opt.raw ? String(text) : humanize(text);

    return new Promise(function (resolve) {
      try {
        if (!opt.queue) synth.cancel();
        var u = new window.SpeechSynthesisUtterance(said);
        var locale = opt.locale || MC.i18n.speechLocale();
        u.lang = locale;
        var v = bestVoice(locale);
        if (v) { u.voice = v; u.lang = v.lang; }
        var natural = v && isNatural(v);
        // Mudar o tom estraga as vozes neurais e acentua o som metalico das
        // antigas: fica sempre no tom natural. O ritmo e so um pouco mais lento
        // que o normal, como quem fala com uma crianca pequena.
        var rate = opt.rate === undefined ? 0.9 : opt.rate;
        u.rate = natural ? Math.min(1, rate + 0.06) : rate;
        u.pitch = opt.pitch === undefined ? 1 : opt.pitch;
        u.volume = opt.volume === undefined ? 0.92 : opt.volume;
        var done = false;
        var finish = function () { if (!done) { done = true; resolve(); } };
        u.onend = finish;
        u.onerror = finish;
        // rede de seguranca: alguns motores nunca disparam onend
        MC.later(finish, 600 + said.length * 120);
        synth.speak(u);
      } catch (e) { resolve(); }
    });
  }

  function shutUp() {
    if (synth) { try { synth.cancel(); } catch (e) { /* ignora */ } }
  }

  /* ---------------- musica de fundo ---------------- */

  var PAD = [
    [261.63, 329.63, 392.0],   // Do
    [293.66, 349.23, 440.0],   // Re m
    [349.23, 440.0, 523.25],   // Fa
    [392.0, 493.88, 587.33]    // Sol
  ];
  var padStep = 0;

  function musicTick() {
    if (!ac() || MC.store.get('music') !== true) return;
    var chord = PAD[padStep % PAD.length];
    padStep++;
    chord.forEach(function (f, i) {
      var t0 = ctx.currentTime + i * 0.12;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.05, t0 + 1.2);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.6);
      osc.connect(g); g.connect(musicGain);
      osc.start(t0); osc.stop(t0 + 3.8);
    });
  }

  function musicStart() {
    if (musicTimer) return;
    if (!ac()) return;
    musicGain.gain.setTargetAtTime(0.6, ctx.currentTime, 1.5);
    musicTick();
    musicTimer = setInterval(musicTick, 4000);
  }

  function musicStop() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (musicGain && ctx) musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
  }

  /* ---------------- api publica ---------------- */

  var Audio = {
    unlock: function () {
      var c = ac();
      if (c && c.state === 'suspended') { c.resume(); }
      if (MC.store.get('music') === true) musicStart();
    },
    tone: tone,
    noise: noise,
    sfx: SFX,
    instrument: INSTRUMENT,
    animal: function (key) {
      var fn = ANIMAL[key];
      if (fn) fn(); else SFX.pop();
    },
    hasAnimal: function (key) { return !!ANIMAL[key]; },
    speak: speak,
    letterName: letterName,
    voices: ptVoices,
    currentVoice: function () { return bestVoice(MC.i18n.speechLocale()); },
    isNatural: isNatural,
    shutUp: shutUp,
    music: { start: musicStart, stop: musicStop },
    setMusic: function (flag) {
      MC.store.set('music', !!flag);
      if (flag) musicStart(); else musicStop();
    },
    // Fala o nome de uma letra ou digito. Digitos sao lidos por extenso
    // pela propria sintese; letras isoladas tambem.
    say: function (txt, opt) { return speak(txt, opt); }
  };

  MC.audio = Audio;

  // Os browsers so deixam criar som depois de um gesto do utilizador.
  ['pointerdown', 'touchstart', 'keydown'].forEach(function (evt) {
    window.addEventListener(evt, function once() {
      Audio.unlock();
      window.removeEventListener(evt, once);
    }, { passive: true });
  });

})(window.MC);
