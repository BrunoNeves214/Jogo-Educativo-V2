/* Mundo Curioso — textos da aplicacao, em portugues.
   Fica tudo centralizado aqui para ser facil rever a linguagem num sitio so
   (e, se um dia voltar a fazer sentido, acrescentar outro idioma ao lado). */
(function (MC) {
  'use strict';

  var PT = {
    'app.name': 'Mundo Curioso',
    'app.tagline': 'Aprender a brincar, dos 3 aos 5 anos',

    /* ---- boas-vindas ---- */
    'hello.morning': 'Bom dia',
    'hello.afternoon': 'Boa tarde',
    'hello.evening': 'Boa noite',
    'hello.who': 'Como te chamas?',
    'hello.namePlaceholder': 'O teu nome',
    'hello.start': 'Vamos brincar!',
    'hello.back': 'Que bom ver-te outra vez!',
    'hello.first': 'Escreve o teu nome para começarmos',
    'hello.change': 'Não sou eu',

    /* ---- inicio ---- */
    'home.greet': '{hello}, {name}!',
    'home.pick': 'Escolhe uma ilha para começar a brincar!',
    'home.games': '{n} jogos',

    'nav.back': 'Voltar',
    'nav.home': 'Voltar ao início',
    'nav.settings': 'Área dos pais',
    'nav.stickers': 'Os meus autocolantes',

    'ui.play': 'Jogar',
    'ui.again': 'Outra vez',
    'ui.next': 'Seguinte',
    'ui.listen': 'Ouvir',
    'ui.listenAgain': 'Ouvir outra vez',
    'ui.clear': 'Limpar',
    'ui.close': 'Fechar',
    'ui.continue': 'Continuar',
    'ui.save': 'Guardar',
    'ui.free': 'Explora à vontade — não há respostas erradas!',

    'win.title': 'Muito bem!',
    'win.body': 'Ganhaste um autocolante novo!',
    'win.again': 'Jogar outra vez',
    'win.island': 'Voltar à ilha',

    /* Frases de incentivo: muitas variantes, para a voz nao soar a gravador.
       Escritas como se fala com uma crianca pequena — curtas e calorosas. */
    'praise.1': 'Boa! Muito bem!',
    'praise.2': 'Isso mesmo!',
    'praise.3': 'Que bem que fizeste!',
    'praise.4': 'Conseguiste!',
    'praise.5': 'Uau, fantástico!',
    'praise.6': 'Estás a ir tão bem!',
    'praise.7': 'Muito bem, és um campeão!',
    'praise.8': 'Olha só, acertaste!',
    'try.1': 'Quase! Vamos tentar outra vez?',
    'try.2': 'Hum, esse não é. Experimenta outro.',
    'try.3': 'Vamos ouvir outra vez, com calma.',
    'try.4': 'Não faz mal. Tenta de novo!',
    'try.5': 'Estás quase lá!',

    /* ---- fases ---- */
    'level.n': 'Fase {n}',
    'level.pick': 'Escolher a fase',
    'level.pickTitle': 'Escolhe a fase',
    'level.pickSub': 'Cada fase é um bocadinho mais difícil. As que têm cadeado abrem quando acabares a anterior.',
    'win.levelDone': 'Fase {n} concluída!',
    'win.allDone': 'Acabaste todas as fases!',
    'win.next': 'Próxima fase',
    'win.replay': 'Repetir',
    'say.levelDone.1': 'Muito bem! Vamos para a próxima fase?',
    'say.levelDone.2': 'Conseguiste! Há mais uma fase à tua espera.',
    'say.levelDone.3': 'Fantástico! Queres tentar uma mais difícil?',

    /* ---- area dos pais ---- */
    'parents.title': 'Área dos pais',
    'parents.child': 'Nome da criança',
    'parents.voice': 'Voz',
    'parents.voice.sub': 'Lê as instruções em voz alta',
    'parents.repeat': 'Repetir a instrução',
    'parents.repeat.sub': 'Volta a dizer o que fazer se a criança parar',
    'parents.voiceName': 'Qual voz',
    'parents.voiceName.sub': 'Escolhe a que soar mais natural',
    'parents.voiceAuto': 'Automática (a mais natural)',
    'parents.voiceTest': 'Ouvir',
    'parents.voiceSample': 'Olá! Vamos brincar e aprender juntos?',
    'parents.voiceNatural': 'natural',
    'parents.voiceHint': 'Este aparelho só tem vozes antigas, que soam mais robóticas. Para uma voz muito mais humana, abre o Mundo Curioso no Microsoft Edge (vozes "Natural") ou num iPhone ou iPad com uma voz "Melhorada" instalada.',
    'parents.voiceHintOther': 'A voz escolhida soa um pouco robótica. Nesta lista há uma voz mais natural, mas com sotaque do Brasil: experimenta-a em "Qual voz". Para uma voz natural com sotaque de Portugal, usa o Microsoft Edge.',
    'parents.allLevels': 'Abrir todas as fases',
    'parents.allLevels.sub': 'Deixa escolher qualquer fase sem ter de fazer as anteriores',
    'parents.sfx': 'Sons',
    'parents.sfx.sub': 'Efeitos e sons dos jogos',
    'parents.music': 'Música de fundo',
    'parents.break': 'Sugerir pausa',
    'parents.break.sub': 'Lembrete simpático a cada 15 minutos',
    'parents.progress': 'Progresso',
    'parents.progress.sub': '{stars} · {stickers}',
    'parents.reset': 'Apagar progresso',
    'parents.resetAsk': 'Apagar todo o progresso desta criança?',
    'parents.noAds': 'Sem anúncios. Sem compras dentro da app. Sem recolha de dados: tudo fica guardado apenas neste aparelho.',

    'gate.title': 'Só para adultos',
    'gate.body': 'Quanto é {a} + {b}?',
    'gate.wrong': 'Não é esse. Tenta de novo.',
    'gate.ok': 'Entrar',

    'break.title': 'Que tal uma pausa?',
    'break.body': 'Já brincaste {min} minutos. Vamos espreguiçar e beber água?',
    'break.more': 'Brincar mais um bocado',
    'break.stop': 'Fazer uma pausa',

    'stickers.title': 'Os meus autocolantes',
    'stickers.sub': 'Ganha autocolantes a terminar os jogos!',
    'stickers.empty': 'Ainda não tens autocolantes. Joga um jogo para ganhar o primeiro!',

    /* ---- ilhas ---- */
    'island.letras': 'Letras e Números',
    'island.letras.sub': 'Reconhecer, ouvir e desenhar',
    'island.cores': 'Cores e Formas',
    'island.cores.sub': 'Combinar, encontrar e pintar',
    'island.animais': 'Animais e Sons',
    'island.animais.sub': 'Ouvir, lembrar e adivinhar',
    'island.logica': 'Lógica e Memória',
    'island.logica.sub': 'Padrões e encaixes',
    'island.vocabulario': 'Vocabulário',
    'island.vocabulario.sub': 'Palavras, imagens e histórias',
    'island.matematica': 'Matemática',
    'island.matematica.sub': 'Contar, comparar e somar',
    'island.motricidade': 'Motricidade Fina',
    'island.motricidade.sub': 'Dedos a treinar',
    'island.rotinas': 'Rotinas',
    'island.rotinas.sub': 'O dia a dia',
    'island.musica': 'Música e Ritmo',
    'island.musica.sub': 'Tocar e repetir',

    /* ---- jogos ---- */
    'g.choice': 'Ouve e Toca',
    'g.choice.sub': 'Ouve o som e toca na letra certa',
    'g.choice.prompt': 'Toca no som certo!',
    'g.choice.say': 'Toca no {ch}',
    'g.tracing': 'Desenha a Letra',
    'g.tracing.sub': 'Segue o pontilhado com o dedo',
    'g.tracing.prompt': 'Segue o pontilhado com o dedo',
    'g.tracing.say': 'Desenha o {ch} com o dedo',
    'g.alfabeto': 'Puzzle do Alfabeto',
    'g.alfabeto.sub': 'Arrasta a letra para o lugar certo',
    'g.alfabeto.prompt': 'Arrasta as peças para o lugar certo',
    'g.contar': 'Conta e Escolhe',
    'g.contar.sub': 'Conta os objetos e escolhe o número',
    'g.contar.prompt': 'Quantos vês?',
    'g.contar.count': 'Contar comigo',

    'g.cor': 'Combinar por Cor',
    'g.cor.sub': 'Cada bola na caixa da sua cor',
    'g.cor.prompt': 'Põe cada bola na caixa da mesma cor',
    'g.forma': 'Encontra a Forma',
    'g.forma.sub': 'Descobre a forma escondida no cenário',
    'g.forma.prompt': 'Encontra o {shape}!',
    'g.pintar': 'Pinta com as Cores',
    'g.pintar.sub': 'Escolhe uma cor e toca no desenho',
    'g.pintar.prompt': 'Escolhe uma cor e toca no desenho',
    'g.pintar.new': 'Outro desenho',

    'g.animais': 'Toca no Animal',
    'g.animais.sub': 'Ouve o som de cada animal',
    'g.animais.prompt': 'Toca num animal para ouvires o som',
    'g.memoria': 'Memória dos Animais',
    'g.memoria.sub': 'Encontra os pares escondidos',
    'g.memoria.prompt': 'Vira duas cartas e encontra o par',
    'g.memoria.easy': 'Fácil',
    'g.memoria.hard': 'Difícil',
    'g.silhueta': 'Adivinha a Silhueta',
    'g.silhueta.sub': 'Que animal está na sombra?',
    'g.silhueta.prompt': 'Que animal é este?',

    'g.sequencias': 'O Que Vem a Seguir?',
    'g.sequencias.sub': 'Completa o padrão',
    'g.sequencias.prompt': 'O que vem a seguir?',
    'g.encaixe': 'Puzzle de Encaixe',
    'g.encaixe.sub': 'Junta as peças da imagem',
    'g.encaixe.prompt': 'Arrasta cada peça para o seu lugar',

    'g.aponta': 'Aponta o Objeto',
    'g.aponta.sub': 'Ouve o nome e toca na imagem',
    'g.aponta.prompt': 'Onde está o {word}?',
    'g.aponta.promptF': 'Onde está a {word}?',
    'g.palavra': 'Imagem e Palavra',
    'g.palavra.sub': 'Liga a palavra à imagem certa',
    'g.palavra.prompt': 'Liga cada palavra à sua imagem',
    'g.historias': 'Histórias Interativas',
    'g.historias.sub': 'Escolhe o que acontece a seguir',
    'g.historias.pick': 'Escolhe uma história',
    'g.historias.end': 'Fim da história!',

    'g.agrupar': 'Conta e Agrupa',
    'g.agrupar.sub': 'Põe o número certo no cesto',
    'g.agrupar.prompt': 'Junta {n} estrelas no cesto',
    'g.agrupar.full': 'Já temos {n}!',
    'g.maior': 'Maior ou Menor',
    'g.maior.sub': 'Compara os dois grupos',
    'g.maior.big': 'Toca no MAIOR',
    'g.maior.small': 'Toca no MENOR',
    'g.somas': 'Somas com Imagens',
    'g.somas.sub': 'Junta e conta quantos ficam',
    'g.somas.prompt': 'Quantas ficam ao todo?',

    'g.vestir': 'Veste o Boneco',
    'g.vestir.sub': 'Arrasta a roupa para o sítio certo',
    'g.vestir.prompt': 'Arrasta a roupa para o sítio certo',
    'g.pontos': 'Liga os Pontos',
    'g.pontos.sub': 'Segue os números e descobre o desenho',
    'g.pontos.prompt': 'Toca nos números pela ordem',
    'g.labirinto': 'Labirinto',
    'g.labirinto.sub': 'Leva o ratinho até ao queijo',
    'g.labirinto.prompt': 'Arrasta sem sair do caminho',

    'g.higiene': 'Sequência do Dia',
    'g.higiene.sub': 'Põe as ações pela ordem certa',
    'g.higiene.prompt': 'Põe por ordem, do primeiro ao último',
    'g.tempo': 'Veste-te para o Tempo',
    'g.tempo.sub': 'Escolhe a roupa certa para o dia',
    'g.tempo.sun': 'Está sol! O que vestes?',
    'g.tempo.rain': 'Está a chover! O que levas?',
    'g.tempo.cold': 'Está frio! O que vestes?',

    'g.instrumentos': 'Instrumentos',
    'g.instrumentos.sub': 'Toca à vontade',
    'g.repetir': 'Repete a Sequência',
    'g.repetir.sub': 'Ouve e toca pela mesma ordem',
    'g.repetir.listen': 'Ouve com atenção...',
    'g.repetir.yourTurn': 'Agora tu!',
    'g.repetir.start': 'Começar',

    /* ---- frases faladas dos jogos (as variantes .1 .2 .3 sao escolhidas ao acaso) ---- */
    'g.choice.L.1': 'Onde está a letra {x}?',
    'g.choice.L.2': 'Consegues encontrar a letra {x}?',
    'g.choice.L.3': 'Toca na letra {x}.',
    'g.choice.N.1': 'Onde está o número {x}?',
    'g.choice.N.2': 'Consegues encontrar o número {x}?',
    'g.choice.N.3': 'Toca no número {x}.',
    'g.choice.rightL.1': 'Isso! É a letra {x}.',
    'g.choice.rightL.2': 'Muito bem, encontraste a letra {x}!',
    'g.choice.rightN.1': 'Isso! É o número {x}.',
    'g.choice.rightN.2': 'Muito bem, o número {x}!',
    'g.tracing.L.1': 'Vamos desenhar a letra {x}. Começa na bolinha.',
    'g.tracing.L.2': 'Com o dedo, desenha a letra {x}.',
    'g.tracing.N.1': 'Vamos desenhar o número {x}. Começa na bolinha.',
    'g.tracing.N.2': 'Com o dedo, desenha o número {x}.',
    'g.tracing.doneL.1': 'Que bonito! Desenhaste a letra {x}.',
    'g.tracing.doneL.2': 'Muito bem! Esta é a letra {x}.',
    'g.tracing.doneN.1': 'Que bonito! Desenhaste o número {x}.',
    'g.tracing.doneN.2': 'Muito bem! Este é o número {x}.',
    'g.alfabeto.decoy': 'Essa letra não faz parte. Experimenta outra!',
    'g.alfabeto.word.1': 'Vamos escrever {w}. Que letras faltam?',
    'g.alfabeto.word.2': 'Olha a imagem. Ajuda-me a escrever {w}!',
    'g.alfabeto.wordDone.1': 'Escreveste {w}! Muito bem!',
    'g.alfabeto.wordDone.2': 'Isso! Diz {w}.',
    'g.contar.q.1': '{Q} {what} vês?',
    'g.contar.q.2': 'Consegues contar {os} {what}?',
    'g.contar.q.3': 'Vamos contar {os} {what}. {Q} são?',
    'g.contar.right.1': 'Isso! São {n} {what}.',
    'g.contar.right.2': 'Muito bem, contaste {n}!',

    'g.cor.promptThings': 'De que cor é cada coisa? Põe-na na caixa certa.',
    'g.cor.right.1': 'Isso, {c}!',
    'g.cor.right.2': 'Muito bem, é {c}!',
    'g.cor.rightThing.1': 'Isso! {w} é {cT}.',
    'g.cor.rightThing.2': 'Muito bem, {w} vai para a caixa {cF}.',
    'g.forma.one.1': 'Encontra {a} {s}!',
    'g.forma.one.2': 'Onde se esconde {a} {s}?',
    'g.forma.color.1': 'Encontra {a} {s} {c}!',
    'g.forma.color.2': 'Consegues ver {a} {s} {c}?',
    'g.forma.all.1': 'Encontra {todos} {s}!',
    'g.forma.all.2': 'Há mais do que um! Encontra {todos} {s}.',
    'g.forma.more.1': 'Boa! Ainda há mais.',
    'g.forma.more.2': 'Isso! Continua a procurar.',
    'g.pintar.copy': 'Pinta igual ao desenho pequenino.',
    'g.pintar.model': 'Modelo',
    'g.pintar.hint.1': 'Olha para o modelo: essa parte é {c}.',
    'g.pintar.hint.2': 'Hum, no modelo essa parte é {c}.',
    'g.pintar.done.1': 'Que desenho tão bonito!',
    'g.pintar.done.2': 'Ficou lindo!',

    'g.animais.whoSound': 'Ouve com atenção. Que animal faz este som?',
    'g.memoria.shadow': 'Encontra cada animal e a sua sombra.',
    'g.silhueta.thing': 'Que coisa é esta?',
    'g.silhueta.crop': 'Só se vê um bocadinho. O que é?',
    'g.silhueta.right.1': 'Isso! É {w}.',
    'g.silhueta.right.2': 'Adivinhaste! Era {w}.',

    'g.sequencias.middle': 'O que falta aqui no meio?',
    'g.sequencias.look': 'Olha bem para o padrão e tenta outra vez.',
    'g.encaixe.model': 'Imagem',
    'g.encaixe.done.1': 'O puzzle está completo!',
    'g.encaixe.done.2': 'Muito bem, juntaste todas as peças!',

    'g.aponta.M.1': 'Onde está o {w}?',
    'g.aponta.M.2': 'Consegues encontrar o {w}?',
    'g.aponta.F.1': 'Onde está a {w}?',
    'g.aponta.F.2': 'Consegues encontrar a {w}?',
    'g.aponta.clue.1': 'Onde está {c}?',
    'g.aponta.clue.2': 'Adivinha: onde está {c}?',
    'g.aponta.two.1': 'Toca em {a} e depois em {b}.',
    'g.aponta.then.1': 'Isso! Agora {b}.',
    'g.aponta.first.1': 'Primeiro {a}!',
    'g.aponta.right.1': 'Isso, é {w}!',
    'g.aponta.right.2': 'Muito bem, encontraste {w}!',

    'g.agrupar.one.1': 'Põe {n} estrelas no cesto.',
    'g.agrupar.one.2': 'Leva {n} estrelas para o cesto.',
    'g.agrupar.two.1': 'Põe {a} no cesto azul e {b} no cesto vermelho.',
    'g.agrupar.kind.1': 'Põe {n} {what} no cesto. Só {what}!',
    'g.agrupar.wrongKind.1': 'Isso é {one}! Só queremos {what}.',
    'g.maior.more': 'Toca no grupo com MAIS',
    'g.maior.less': 'Toca no grupo com MENOS',
    'g.maior.bigNum': 'Toca no número MAIOR',
    'g.maior.smallNum': 'Toca no número MENOR',
    'g.somas.minus': 'Quantas ficaram?',
    'g.somas.had.1': 'Tinhas {n} {what}.',
    'g.somas.away.1': 'Olha, {n} foram-se embora!',
    'g.somas.right.1': 'Isso! Ao todo são {n} {what}.',
    'g.somas.right.2': 'Muito bem! São {n}!',
    'g.somas.rightMinus.1': 'Isso! Ficaram {n}.',
    'g.somas.rightMinus.2': 'Muito bem, ficaram {n}!',

    'g.vestir.praia': 'Vamos à praia! Veste só o que serve para o calor.',
    'g.vestir.neve': 'Vamos para a neve! Veste o que te aquece.',
    'g.vestir.wrongPraia.1': 'Na praia está calor, não precisas de {w}!',
    'g.vestir.wrongNeve.1': 'Isso é para o calor! Na neve precisamos de roupa quentinha.',
    'g.vestir.done.1': 'Está pronto! Que bem vestido!',
    'g.vestir.done.2': 'Olha que giro que ficou!',
    'g.pontos.next.1': 'Agora o número {n}.',
    'g.pontos.next.2': 'Procura o número {n}.',
    'g.pontos.done.1': 'Olha, é {w}!',
    'g.pontos.done.2': 'Descobriste {w}!',
    'g.labirinto.go.1': 'Leva {w} até {to}.',
    'g.labirinto.go.2': 'Ajuda {w} a chegar {to}!',
    'g.labirinto.back': 'Volta para o caminho.',
    'g.labirinto.done.1': 'Conseguiste! {w} chegou {to}.',

    'g.higiene.order.1': 'Esse ainda não. Qual vem em {n}.º lugar?',
    'g.higiene.first': 'Primeiro,',
    'g.higiene.then': 'depois,',
    'g.higiene.last': 'e no fim,',
    'g.tempo.pick1': 'Escolhe a melhor roupa.',
    'g.tempo.pickN.1': 'Escolhe {n} coisas.',
    'g.tempo.more.1': 'Boa! Escolhe mais uma.',
    'g.tempo.right.1': 'Isso! Assim ficas preparado.',
    'g.tempo.right.2': 'Muito bem escolhido!',
    'g.tempo.wrong_sun.1': 'Com este calor, não precisas de {w}!',
    'g.tempo.wrong_rain.1': 'Hum, isso não te protege da chuva.',
    'g.tempo.wrong_cold.1': 'Brr! Com {w} ficavas com frio.',

    'g.instrumentos.explore': 'Experimenta tocar em todos!',
    'g.instrumentos.song': 'Toca na barra que brilha, e vais ouvir uma canção!',
    'g.instrumentos.songDone.1': 'Tocaste {name}! Que lindo!',
    'g.repetir.earIntro': 'Agora os botões não acendem. Ouve só o som!',

    'shape.circlePl': 'CÍRCULOS', 'shape.squarePl': 'QUADRADOS', 'shape.trianglePl': 'TRIÂNGULOS',
    'shape.starPl': 'ESTRELAS', 'shape.heartPl': 'CORAÇÕES', 'shape.rectPl': 'RETÂNGULOS',
    'shape.circle': 'CÍRCULO', 'shape.square': 'QUADRADO',
    'shape.triangle': 'TRIÂNGULO', 'shape.star': 'ESTRELA',
    'shape.heart': 'CORAÇÃO', 'shape.rect': 'RETÂNGULO'
  };

  var lastPick = {};

  var I18n = {
    lang: 'pt',

    // t('home.greet', {name:'Sofia'})
    t: function (key, vars) {
      var s = PT[key];
      if (s === undefined) return key;
      if (vars) {
        s = s.replace(/\{(\w+)\}/g, function (m, k) {
          return vars[k] === undefined ? m : vars[k];
        });
      }
      return s;
    },

    // escolhe ao acaso uma das variantes key.1, key.2... (ou a propria key)
    pick: function (key, vars) {
      var n = 0;
      while (PT[key + '.' + (n + 1)] !== undefined) n++;
      if (!n) return I18n.t(key, vars);
      var k = 1 + MC.rnd(n);
      // evita dizer a mesma variante duas vezes seguidas
      if (n > 1 && lastPick[key] === k) k = (k % n) + 1;
      lastPick[key] = k;
      return I18n.t(key + '.' + k, vars);
    },

    praise: function () { return I18n.pick('praise'); },
    encourage: function () { return I18n.pick('try'); },
    speechLocale: function () { return 'pt-PT'; },

    // saudacao conforme a hora local do aparelho
    hello: function (date) {
      var h = (date || new Date()).getHours();
      if (h >= 5 && h < 13) return I18n.t('hello.morning');
      if (h >= 13 && h < 20) return I18n.t('hello.afternoon');
      return I18n.t('hello.evening');
    }
  };

  document.documentElement.lang = 'pt';

  MC.i18n = I18n;
  MC.t = I18n.t;

})(window.MC);
