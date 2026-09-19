/* Mundo Curioso — bancos de conteudo.
   Letras, numeros, animais, objectos, cores, formas, palavras e historias.
   Os tracados das letras estao numa caixa de 300x300. */
(function (MC) {
  'use strict';

  /* ---------------- tracados de letras e numeros ---------------- */

  var TRACE = {
    A: ['M70 260 L150 40 L230 260', 'M105 175 L195 175'],
    B: ['M90 40 L90 260', 'M90 40 L170 40 Q215 40 215 95 Q215 150 170 150 L90 150', 'M90 150 L180 150 Q225 150 225 205 Q225 260 180 260 L90 260'],
    C: ['M220 80 C180 20 80 30 70 150 C60 270 180 285 220 215'],
    D: ['M90 40 L90 260', 'M90 40 L155 40 Q225 40 225 150 Q225 260 155 260 L90 260'],
    E: ['M215 40 L90 40 L90 260 L215 260', 'M90 150 L185 150'],
    F: ['M215 40 L90 40 L90 260', 'M90 150 L185 150'],
    G: ['M220 80 C180 20 80 30 70 150 C60 270 195 285 220 200 L220 160 L160 160'],
    H: ['M80 40 L80 260', 'M220 40 L220 260', 'M80 150 L220 150'],
    I: ['M150 40 L150 260', 'M100 40 L200 40', 'M100 260 L200 260'],
    J: ['M190 40 L190 200 Q190 260 130 260 Q80 260 75 210'],
    K: ['M85 40 L85 260', 'M215 40 L95 150 L215 260'],
    L: ['M90 40 L90 260 L215 260'],
    M: ['M70 260 L70 40 L150 170 L230 40 L230 260'],
    N: ['M80 260 L80 40 L220 260 L220 40'],
    O: ['M150 40 C90 40 65 95 65 150 C65 205 90 260 150 260 C210 260 235 205 235 150 C235 95 210 40 150 40'],
    P: ['M90 260 L90 40 L170 40 Q225 40 225 105 Q225 165 170 165 L90 165'],
    Q: ['M150 40 C90 40 65 95 65 150 C65 205 90 260 150 260 C210 260 235 205 235 150 C235 95 210 40 150 40', 'M175 200 L235 268'],
    R: ['M90 260 L90 40 L170 40 Q225 40 225 105 Q225 165 170 165 L90 165', 'M150 165 L225 260'],
    S: ['M215 80 C200 35 105 25 90 85 C75 145 215 140 215 200 C215 265 110 272 85 220'],
    T: ['M70 40 L230 40', 'M150 40 L150 260'],
    U: ['M80 40 L80 180 Q80 260 150 260 Q220 260 220 180 L220 40'],
    V: ['M75 40 L150 260 L225 40'],
    W: ['M60 40 L100 260 L150 110 L200 260 L240 40'],
    X: ['M80 40 L220 260', 'M220 40 L80 260'],
    Y: ['M80 40 L150 150 L220 40', 'M150 150 L150 260'],
    Z: ['M80 40 L220 40 L80 260 L220 260'],

    '0': ['M150 40 C95 40 70 95 70 150 C70 205 95 260 150 260 C205 260 230 205 230 150 C230 95 205 40 150 40'],
    '1': ['M105 85 L150 40 L150 260', 'M100 260 L200 260'],
    '2': ['M80 90 C85 35 190 25 210 85 C230 145 100 190 80 260 L220 260'],
    '3': ['M80 70 C110 25 210 35 205 95 C202 140 155 150 140 150 C155 150 215 155 215 205 C215 265 110 272 80 225'],
    '4': ['M180 260 L180 40 L70 185 L225 185'],
    '5': ['M210 40 L100 40 L90 140 C140 110 220 130 220 195 C220 260 120 275 85 230'],
    '6': ['M200 50 C150 40 85 80 85 165 C85 225 115 260 155 260 C200 260 225 225 225 185 C225 145 195 118 155 118 C115 118 90 145 88 175'],
    '7': ['M75 40 L225 40 L130 260'],
    '8': ['M150 145 C100 145 80 112 85 82 C92 42 205 42 212 82 C218 114 195 145 150 145 C95 145 70 180 72 210 C76 265 225 265 228 210 C230 180 205 145 150 145'],
    '9': ['M215 130 C215 90 190 62 152 62 C112 62 85 90 85 128 C85 165 112 190 152 190 C190 190 215 168 215 130 L215 180 C215 248 175 264 118 258']
  };

  var LETTERS = 'ABCDEFGHIJLMNOPRSTUVZ'.split('');   // sem K, W, X, Y, Q (raras em pt para 3-5 anos)
  var LETTERS_ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var DIGITS = '0123456789'.split('');

  /* ---------------- animais ----------------
     g: genero (o/a) · says: o que "diz", em frase completa
     noisy: false para os que nao tem um som reconhecivel
     clue: pista para a fase de adivinhas do "Aponta o objeto" */

  var ANIMALS = [
    { id: 'cat',      sound: 'cat',      g: 'm', pt: 'gato',     says: 'faz miau, miau',  clue: 'o animal que diz miau' },
    { id: 'dog',      sound: 'dog',      g: 'm', pt: 'cão',      says: 'faz ão, ão',       clue: 'o animal que ladra' },
    { id: 'bird',     sound: 'bird',     g: 'm', pt: 'pássaro',  says: 'faz piu, piu',     clue: 'o animal que voa e canta' },
    { id: 'duck',     sound: 'duck',     g: 'm', pt: 'pato',     says: 'faz quá, quá',     clue: 'o animal que nada e diz quá quá' },
    { id: 'rabbit',   sound: 'rabbit',   g: 'm', pt: 'coelho',   says: 'mexe o narizinho', clue: 'o animal de orelhas compridas', noisy: false },
    { id: 'cow',      sound: 'cow',      g: 'f', pt: 'vaca',     says: 'faz muuu',         clue: 'o animal que nos dá leite' },
    { id: 'sheep',    sound: 'sheep',    g: 'f', pt: 'ovelha',   says: 'faz méé',          clue: 'o animal que nos dá lã' },
    { id: 'horse',    sound: 'horse',    g: 'm', pt: 'cavalo',   says: 'relincha',         clue: 'o animal que galopa' },
    { id: 'pig',      sound: 'pig',      g: 'm', pt: 'porco',    says: 'faz óinc, óinc',   clue: 'o animal cor-de-rosa que diz óinc' },
    { id: 'frog',     sound: 'frog',     g: 'f', pt: 'rã',       says: 'faz cróc, cróc',   clue: 'o animal verde que dá saltos' },
    { id: 'lion',     sound: 'lion',     g: 'm', pt: 'leão',     says: 'ruge muito alto',  clue: 'o rei da selva' },
    { id: 'elephant', sound: 'elephant', g: 'm', pt: 'elefante', says: 'barrita com a tromba', clue: 'o animal com uma tromba comprida' },
    { id: 'fish',     sound: 'fish',     g: 'm', pt: 'peixe',    says: 'faz bolhinhas',    clue: 'o animal que vive na água', noisy: false },
    { id: 'rooster',  sound: 'rooster',  g: 'm', pt: 'galo',     says: 'faz cócórócó',     clue: 'o animal que canta de manhã' },
    { id: 'bee',      sound: 'bee',      g: 'f', pt: 'abelha',   says: 'faz zzzz',         clue: 'o bichinho que faz mel' },
    { id: 'mouse',    sound: 'mouse',    g: 'm', pt: 'rato',     says: 'faz chi, chi',     clue: 'o animal pequenino que adora queijo' }
  ];

  // animais parecidos entre si, para a fase dificil da silhueta
  var LOOKALIKES = [
    ['cat', 'dog', 'lion', 'rabbit', 'mouse'],
    ['duck', 'bird', 'rooster', 'bee'],
    ['cow', 'horse', 'pig', 'sheep'],
    ['frog', 'fish', 'elephant', 'mouse']
  ];

  // onde vive cada animal, para as fases de exploracao livre
  var HABITATS = {
    quinta:   ['cow', 'pig', 'sheep', 'horse', 'rooster', 'duck'],
    casa:     ['cat', 'dog', 'fish', 'rabbit', 'bird', 'mouse'],
    natureza: ['lion', 'elephant', 'frog', 'bee', 'bird', 'fish']
  };

  /* ---------------- objectos do dia a dia ---------------- */

  var OBJECTS = [
    { id: 'apple',  g: 'f', pt: 'maçã',    clue: 'a fruta vermelha e redondinha' },
    { id: 'sun',    g: 'm', pt: 'sol',     clue: 'o que brilha no céu durante o dia' },
    { id: 'moon',   g: 'f', pt: 'lua',     clue: 'o que aparece no céu à noite' },
    { id: 'sea',    g: 'm', pt: 'mar',     clue: 'a água onde nadam os peixes' },
    { id: 'tree',   g: 'f', pt: 'árvore',  clue: 'a planta grande com tronco e folhas' },
    { id: 'ball',   g: 'f', pt: 'bola',    clue: 'a coisa redonda para brincar' },
    { id: 'house',  g: 'f', pt: 'casa',    clue: 'o sítio onde moramos' },
    { id: 'car',    g: 'm', pt: 'carro',   clue: 'o que tem rodas e anda na estrada' },
    { id: 'flower', g: 'f', pt: 'flor',    clue: 'a planta com pétalas coloridas' },
    { id: 'book',   g: 'm', pt: 'livro',   clue: 'o que usamos para ler histórias' },
    { id: 'cup',    g: 'm', pt: 'copo',    clue: 'o que usamos para beber' },
    { id: 'banana', g: 'f', pt: 'banana',  clue: 'a fruta amarela e comprida' },
    { id: 'cheese', g: 'm', pt: 'queijo',  clue: 'o que os ratinhos adoram comer' },
    { id: 'carrot', g: 'f', pt: 'cenoura', clue: 'o que os coelhos adoram comer' }
  ];

  /* ---------------- palavras para leitura ---------------- */

  var WORDS = [
    { id: 'sun',     pt: 'SOL' },
    { id: 'moon',    pt: 'LUA' },
    { id: 'sea',     pt: 'MAR' },
    { id: 'ball',    pt: 'BOLA' },
    { id: 'house',   pt: 'CASA' },
    { id: 'cat',     pt: 'GATO' },
    { id: 'duck',    pt: 'PATO' },
    { id: 'mouse',   pt: 'RATO' },
    { id: 'flower',  pt: 'FLOR' },
    { id: 'cow',     pt: 'VACA' },
    { id: 'cup',     pt: 'COPO' },
    { id: 'rooster', pt: 'GALO' },
    { id: 'fish',    pt: 'PEIXE' },
    { id: 'car',     pt: 'CARRO' },
    { id: 'book',    pt: 'LIVRO' },
    { id: 'pig',     pt: 'PORCO' },
    { id: 'lion',    pt: 'LEÃO' },
    { id: 'apple',   pt: 'MAÇÃ' },
    { id: 'tree',    pt: 'ÁRVORE' },
    { id: 'banana',  pt: 'BANANA' }
  ];

  // grupos de palavras que se confundem facilmente
  var LOOKALIKE_WORDS = [
    ['GATO', 'PATO', 'RATO'],
    ['CASA', 'VACA', 'BOLA'],
    ['GALO', 'GATO', 'PATO'],
    ['COPO', 'PORCO', 'LIVRO']
  ];

  /* ---------------- cores ---------------- */
  // things: objectos que tem naturalmente esta cor (fase dificil de "Combinar por cor")

  var COLORS = [
    { id: 'red',    hex: '#FF6F59', soft: '#FFE7E1', pt: 'vermelho', things: ['apple'] },
    { id: 'blue',   hex: '#4EA8DE', soft: '#E3F2FB', pt: 'azul',     things: ['fish', 'car', 'bird'] },
    { id: 'yellow', hex: '#FFC145', soft: '#FFF3D9', pt: 'amarelo',  things: ['banana', 'cheese', 'sun'] },
    { id: 'green',  hex: '#6BBF59', soft: '#E8F6E4', pt: 'verde',    things: ['tree', 'frog'] },
    { id: 'purple', hex: '#B892FF', soft: '#F1E9FF', pt: 'roxo',     things: ['moon'] },
    { id: 'orange', hex: '#F4A261', soft: '#FDEEDF', pt: 'laranja',  things: ['carrot', 'cat'] }
  ];

  /* ---------------- formas ---------------- */

  var SHAPES = [
    { id: 'circle',   art: 'circle',     key: 'shape.circle',   g: 'm' },
    { id: 'square',   art: 'square',     key: 'shape.square',   g: 'm' },
    { id: 'triangle', art: 'triangle',   key: 'shape.triangle', g: 'm' },
    { id: 'star',     art: 'starShape',  key: 'shape.star',     g: 'f' },
    { id: 'heart',    art: 'heart',      key: 'shape.heart',    g: 'm' },
    { id: 'rect',     art: 'rect',       key: 'shape.rect',     g: 'm' }
  ];

  /* ---------------- rotinas ---------------- */

  var ROUTINES = {
    manha3: [
      { art: 'wake',  pt: 'acordar' },
      { art: 'dress', pt: 'vestir' },
      { art: 'meal',  pt: 'tomar o pequeno-almoço' }
    ],
    noite3: [
      { art: 'meal',  pt: 'jantar' },
      { art: 'teeth', pt: 'escovar os dentes' },
      { art: 'bed',   pt: 'ir dormir' }
    ],
    manha: [
      { art: 'wake',  pt: 'acordar' },
      { art: 'teeth', pt: 'escovar os dentes' },
      { art: 'wash',  pt: 'lavar a cara' },
      { art: 'dress', pt: 'vestir' }
    ],
    noite: [
      { art: 'meal',  pt: 'jantar' },
      { art: 'wash',  pt: 'tomar banho' },
      { art: 'teeth', pt: 'escovar os dentes' },
      { art: 'bed',   pt: 'ir dormir' }
    ],
    flor: [
      { art: 'seed',        pt: 'pôr a semente na terra' },
      { art: 'wateringCan', pt: 'regar' },
      { art: 'sun',         pt: 'apanhar sol' },
      { art: 'sprout',      pt: 'nasce um rebento' },
      { art: 'flower',      pt: 'cresce uma flor' }
    ],
    dia: [
      { art: 'wake',  pt: 'acordar' },
      { art: 'teeth', pt: 'escovar os dentes' },
      { art: 'dress', pt: 'vestir' },
      { art: 'meal',  pt: 'almoçar' },
      { art: 'wash',  pt: 'tomar banho' },
      { art: 'bed',   pt: 'ir dormir' }
    ]
  };

  /* ---------------- tempo e roupa ---------------- */

  var WEATHER = [
    { id: 'sun',  icon: 'sun',   key: 'g.tempo.sun' },
    { id: 'rain', icon: 'cloud', key: 'g.tempo.rain' },
    { id: 'cold', icon: 'snow',  key: 'g.tempo.cold' }
  ];

  // para que tempo serve cada peca
  var WEAR = [
    { art: 'tshirt',     pt: 't-shirt',       ok: ['sun'] },
    { art: 'sunglasses', pt: 'óculos de sol', ok: ['sun'] },
    { art: 'hat',        pt: 'chapéu',        ok: ['sun'] },
    { art: 'shorts',     pt: 'calções',       ok: ['sun'] },
    { art: 'umbrella',   pt: 'guarda-chuva',  ok: ['rain'] },
    { art: 'boots',      pt: 'botas',         ok: ['rain', 'cold'] },
    { art: 'coat',       pt: 'casaco',        ok: ['rain', 'cold'] },
    { art: 'scarf',      pt: 'cachecol',      ok: ['cold'] },
    { art: 'beanie',     pt: 'gorro',         ok: ['cold'] }
  ];

  /* ---------------- roupa do boneco ---------------- */
  // cada peca sabe em que zona do corpo encaixa

  var CLOTHES = {
    hat:        { zone: 'head',  pt: 'chapéu' },
    beanie:     { zone: 'head',  pt: 'gorro' },
    sunglasses: { zone: 'eyes',  pt: 'óculos de sol' },
    scarf:      { zone: 'neck',  pt: 'cachecol' },
    shirt:      { zone: 'torso', pt: 'camisa' },
    tshirt:     { zone: 'torso', pt: 't-shirt' },
    coat:       { zone: 'torso', pt: 'casaco' },
    pants:      { zone: 'legs',  pt: 'calças' },
    shorts:     { zone: 'legs',  pt: 'calções' },
    shoes:      { zone: 'feet',  pt: 'sapatos' },
    boots:      { zone: 'feet',  pt: 'botas' }
  };

  /* ---------------- historias ramificadas ---------------- */
  // cada no: texto, cenario (bg), personagem (actor) e escolhas, ou end

  var STORIES = [
    {
      id: 'coelho', title: 'O coelho curioso', cover: 'rabbit', start: 'a',
      nodes: {
        a: { bg: 'forest', actor: 'rabbit',
          pt: 'O coelhinho acordou e encontrou uma cenoura enorme no jardim. O que fez a seguir?',
          choices: [
            { art: 'tree',   pt: 'Foi à floresta', next: 'b1' },
            { art: 'house',  pt: 'Voltou a casa',  next: 'b2' }
          ] },
        b1: { bg: 'forest', actor: 'bird',
          pt: 'Na floresta encontrou um pássaro que cantava muito alto. O coelho quis...',
          choices: [
            { art: 'note',   pt: 'Cantar também',       next: 'c1' },
            { art: 'carrot', pt: 'Partilhar a cenoura', next: 'c2' }
          ] },
        b2: { bg: 'home', actor: 'rabbit',
          pt: 'Em casa, a mãe coelha fez uma sopa de cenoura para toda a família.',
          choices: [
            { art: 'meal', pt: 'Comer a sopa', next: 'c3' },
            { art: 'bed',  pt: 'Ir dormir',    next: 'c3' }
          ] },
        c1: { bg: 'forest', actor: 'bird', end: true,
          pt: 'Cantaram juntos até ao pôr do sol. Ficaram amigos para sempre!' },
        c2: { bg: 'forest', actor: 'rabbit', end: true,
          pt: 'Partilhar soube ainda melhor do que comer sozinho. Que dia bonito!' },
        c3: { bg: 'home', actor: 'rabbit', end: true,
          pt: 'De barriga cheia e coração contente, o coelhinho adormeceu a sorrir.' }
      }
    },
    {
      id: 'peixe', title: 'O peixe da ilha', cover: 'fish', start: 'a',
      nodes: {
        a: { bg: 'sea', actor: 'fish',
          pt: 'Um peixinho azul nadava perto da praia quando viu uma concha a brilhar.',
          choices: [
            { art: 'sparkle', pt: 'Ir ver a concha',  next: 'b1' },
            { art: 'sea',     pt: 'Nadar mais longe', next: 'b2' }
          ] },
        b1: { bg: 'sea', actor: 'fish',
          pt: 'Dentro da concha vivia um caranguejo simpático que lhe contou uma adivinha.',
          choices: [
            { art: 'chat', pt: 'Responder',     next: 'c1' },
            { art: 'fish', pt: 'Chamar amigos', next: 'c1' }
          ] },
        b2: { bg: 'sea', actor: 'bird',
          pt: 'Mais longe encontrou uma gaivota que lhe mostrou as ilhas lá ao fundo.',
          choices: [
            { art: 'sun',   pt: 'Ver o pôr do sol', next: 'c2' },
            { art: 'house', pt: 'Voltar a casa',    next: 'c2' }
          ] },
        c1: { bg: 'sea', actor: 'fish', end: true,
          pt: 'Acertaram todos juntos! O caranguejo ofereceu a concha ao peixinho.' },
        c2: { bg: 'sea', actor: 'sun', end: true,
          pt: 'O sol pintou o mar de laranja. O peixinho prometeu voltar amanhã.' }
      }
    },
    {
      id: 'estrela', title: 'A estrela que caiu do céu', cover: 'mascot', start: 'a',
      nodes: {
        a: { bg: 'night', actor: 'mascot',
          pt: 'Numa noite calminha, uma estrelinha escorregou do céu e caiu no jardim. Estava um bocadinho assustada. O que fazemos?',
          choices: [
            { art: 'heart', pt: 'Dar-lhe um abraço',     next: 'b1' },
            { art: 'chat',  pt: 'Perguntar o nome dela', next: 'b2' }
          ] },
        b1: { bg: 'night', actor: 'mascot',
          pt: 'A estrelinha ficou quentinha e sorriu. Mas tinha saudades das outras estrelas. Como a ajudamos a voltar?',
          choices: [
            { art: 'bird',    pt: 'Pedir ajuda ao pássaro', next: 'c1' },
            { art: 'sparkle', pt: 'Fazer um desejo',        next: 'c2' }
          ] },
        b2: { bg: 'night', actor: 'mascot',
          pt: 'Chamava-se Curi! Disse que brilha mais quando alguém sorri. Queres experimentar?',
          choices: [
            { art: 'sun',  pt: 'Sorrir muito',      next: 'c2' },
            { art: 'note', pt: 'Cantar uma canção', next: 'c1' }
          ] },
        c1: { bg: 'night', actor: 'bird', end: true,
          pt: 'O pássaro levou a Curi nas asas, lá para cima, até ao céu. Olha, ela está a piscar-te o olho!' },
        c2: { bg: 'night', actor: 'mascot', end: true,
          pt: 'A Curi brilhou tanto, tanto, que subiu sozinha para o céu. Agora, todas as noites, diz-te boa noite lá de cima.' }
      }
    },
    {
      id: 'bola', title: 'O cão e a bola perdida', cover: 'dog', start: 'a',
      nodes: {
        a: { bg: 'home', actor: 'dog',
          pt: 'O Bobi adora a sua bola vermelha. Mas hoje de manhã não a encontra em lado nenhum! Onde vamos procurar primeiro?',
          choices: [
            { art: 'house', pt: 'Dentro de casa', next: 'b1' },
            { art: 'tree',  pt: 'No jardim',      next: 'b2' }
          ] },
        b1: { bg: 'home', actor: 'cat',
          pt: 'Dentro de casa, o gato Tareco estava a dormir em cima de uma coisa redonda. Será a bola?',
          choices: [
            { art: 'hand', pt: 'Acordar o gato devagarinho', next: 'c1' },
            { art: 'book', pt: 'Esperar que ele acorde',     next: 'c1' }
          ] },
        b2: { bg: 'forest', actor: 'bird',
          pt: 'No jardim, um passarinho disse: vi uma bola a rolar para o lago! O que fazemos?',
          choices: [
            { art: 'sea',  pt: 'Ir ao lago',               next: 'c2' },
            { art: 'chat', pt: 'Perguntar a mais amigos',  next: 'b3' }
          ] },
        b3: { bg: 'farm', actor: 'cow',
          pt: 'A vaca Mimosa viu tudo: a bola está escondida atrás do monte de palha. E agora?',
          choices: [
            { art: 'hand',  pt: 'Ir buscá-la',        next: 'c3' },
            { art: 'heart', pt: 'Agradecer à vaca',   next: 'c3' }
          ] },
        c1: { bg: 'home', actor: 'dog', end: true,
          pt: 'Era mesmo a bola! O Tareco espreguiçou-se, e o Bobi ficou tão contente que abanou o rabo sem parar.' },
        c2: { bg: 'forest', actor: 'dog', end: true,
          pt: 'A bola estava a boiar no lago. O Bobi deu um salto, splash, e trouxe-a na boca. Que cão corajoso!' },
        c3: { bg: 'farm', actor: 'dog', end: true,
          pt: 'Lá estava a bola, atrás da palha! O Bobi agradeceu a todos e brincaram juntos a tarde inteira.' }
      }
    },
    {
      id: 'festa', title: 'A festa na quinta', cover: 'rooster', start: 'a',
      nodes: {
        a: { bg: 'farm', actor: 'rooster',
          pt: 'Cócórócó! O galo acordou a quinta com uma novidade: hoje há festa! O que preparamos primeiro?',
          choices: [
            { art: 'note', pt: 'A música', next: 'b1' },
            { art: 'meal', pt: 'A comida', next: 'b2' }
          ] },
        b1: { bg: 'farm', actor: 'duck',
          pt: 'Os patos trouxeram tambores e as ovelhas cantaram. Mas ainda falta qualquer coisa. O quê?',
          choices: [
            { art: 'flower', pt: 'Flores para enfeitar', next: 'c1' },
            { art: 'sun',    pt: 'Um dia de sol',        next: 'c2' }
          ] },
        b2: { bg: 'farm', actor: 'cow',
          pt: 'A vaca trouxe leite e o coelho trouxe cenouras. Quem vamos convidar?',
          choices: [
            { art: 'dog', pt: 'O cão da casa',        next: 'c1' },
            { art: 'bee', pt: 'As abelhas do jardim', next: 'c3' }
          ] },
        c1: { bg: 'farm', actor: 'sheep',
          pt: 'Com flores e amigos por todo o lado, a quinta ficou linda. De repente, ouviu-se um barulho... Quem será?',
          choices: [
            { art: 'horse', pt: 'Um cavalo',    next: 'd1' },
            { art: 'pig',   pt: 'Um porquinho', next: 'd2' }
          ] },
        c2: { bg: 'farm', actor: 'sun',
          pt: 'O sol espreitou e aqueceu toda a gente. Os animais foram dançar. Que dança fazemos?',
          choices: [
            { art: 'hand',    pt: 'Bater palmas',  next: 'd1' },
            { art: 'sparkle', pt: 'Dar voltinhas', next: 'd2' }
          ] },
        c3: { bg: 'farm', actor: 'bee',
          pt: 'As abelhas trouxeram mel para os bolos! Hum, que cheirinho. Quem prova primeiro?',
          choices: [
            { art: 'rabbit', pt: 'O coelho', next: 'd2' },
            { art: 'duck',   pt: 'O pato',   next: 'd1' }
          ] },
        d1: { bg: 'farm', actor: 'horse', end: true,
          pt: 'Todos dançaram e riram até as estrelas aparecerem no céu. Foi a festa mais bonita da quinta!' },
        d2: { bg: 'farm', actor: 'pig', end: true,
          pt: 'O porquinho rebolou de alegria e toda a gente se riu muito. Que festa tão divertida! Boa noite, quinta!' }
      }
    }
  ];

  /* ---------------- desenhos para pintar ----------------
     regioes numa caixa 0 0 300 300; cada regiao comeca branca.
     ref: a cor de cada regiao no modelo (fases "pinta como o modelo").
     deco: tracos que nao se pintam (antenas, riscas). */

  var COLORINGS = {
    barco: {
      regions: [
        { d: 'M40 200 L260 200 L226 260 L74 260 Z', ref: 'red' },
        { d: 'M146 40 L146 196 L52 196 Z', ref: 'yellow' },
        { d: 'M158 60 L232 150 L158 150 Z', ref: 'orange' },
        { d: 'M20 268 C70 256 110 280 150 268 C190 256 232 280 280 268 L280 292 L20 292 Z', ref: 'blue' }
      ],
      deco: '<path d="M152 36v164" stroke="#8B5E34" stroke-width="5"/>'
    },
    casa: {
      regions: [
        { d: 'M40 150 L150 56 L260 150 L240 150 L240 262 L60 262 L60 150 Z', ref: 'yellow' },
        { d: 'M32 152 L150 48 L268 152 L150 74 Z', ref: 'red' },
        { d: 'M126 190 h48 v72 h-48 Z', ref: 'orange' },
        { d: 'M84 176 h44 v44 h-44 Z', ref: 'blue' },
        { d: 'M172 176 h44 v44 h-44 Z', ref: 'blue' },
        { d: 'M196 66 h26 v46 h-26 Z', ref: 'red' }
      ]
    },
    peixe: {
      regions: [
        { d: 'M40 150 C40 108 92 78 146 78 C200 78 236 112 236 150 C236 188 200 222 146 222 C92 222 40 192 40 150 Z', ref: 'orange' },
        { d: 'M236 150 L290 106 L290 194 Z', ref: 'red' },
        { d: 'M140 96 C160 70 190 70 204 92 C182 96 158 96 140 96 Z', ref: 'red' },
        { d: 'M140 204 C160 230 190 230 204 208 C182 204 158 204 140 204 Z', ref: 'red' },
        { d: 'M64 132 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0 Z', ref: 'blue' }
      ]
    },
    flor: {
      regions: [
        { d: 'M150 28 C176 28 194 50 194 76 C194 102 176 122 150 122 C124 122 106 102 106 76 C106 50 124 28 150 28Z', ref: 'red' },
        { d: 'M56 118 C56 92 76 72 102 72 C128 72 146 92 146 118 C146 144 128 164 102 164 C76 164 56 144 56 118Z', ref: 'red' },
        { d: 'M244 118 C244 92 224 72 198 72 C172 72 154 92 154 118 C154 144 172 164 198 164 C224 164 244 144 244 118Z', ref: 'red' },
        { d: 'M150 108 C172 108 188 126 188 148 C188 170 172 188 150 188 C128 188 112 170 112 148 C112 126 128 108 150 108Z', ref: 'yellow' },
        { d: 'M144 186 h12 v92 h-12 Z', ref: 'green' },
        { d: 'M144 214 C118 200 96 206 84 224 C104 240 130 238 144 226 Z', ref: 'green' },
        { d: 'M156 236 C182 222 204 228 216 246 C196 262 170 260 156 248 Z', ref: 'green' }
      ]
    },
    borboleta: {
      regions: [
        { d: 'M140 130 C110 58 38 50 40 112 C42 152 92 160 140 150 Z', ref: 'orange' },
        { d: 'M160 130 C190 58 262 50 260 112 C258 152 208 160 160 150 Z', ref: 'orange' },
        { d: 'M140 160 C100 168 58 190 68 232 C80 262 130 242 142 180 Z', ref: 'yellow' },
        { d: 'M160 160 C200 168 242 190 232 232 C220 262 170 242 158 180 Z', ref: 'yellow' },
        { d: 'M72 110 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0 Z', ref: 'blue' },
        { d: 'M192 110 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0 Z', ref: 'blue' },
        { d: 'M150 78 C161 78 163 110 163 150 C163 192 161 224 150 224 C139 224 137 192 137 150 C137 110 139 78 150 78 Z', ref: 'purple' }
      ],
      deco: '<path d="M146 82 Q130 50 112 40 M154 82 Q170 50 188 40" fill="none" stroke="#6B6A8A" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="112" cy="40" r="6" fill="#6B6A8A"/><circle cx="188" cy="40" r="6" fill="#6B6A8A"/>'
    },
    gelado: {
      regions: [
        { d: 'M106 150 L194 150 L150 284 Z', ref: 'orange' },
        { d: 'M94 154 C88 112 128 94 150 98 C172 94 212 112 206 154 C180 168 120 168 94 154 Z', ref: 'yellow' },
        { d: 'M110 108 C106 68 132 52 150 54 C168 52 194 68 190 108 C170 120 130 120 110 108 Z', ref: 'purple' },
        { d: 'M138 42 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 Z', ref: 'red' }
      ],
      deco: '<path d="M122 176 L166 222 M140 164 L178 204 M178 176 L134 222 M160 164 L122 204" stroke="#C9C6DC" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M150 30 q6 -14 18 -16" fill="none" stroke="#57A566" stroke-width="3" stroke-linecap="round"/>'
    }
  };

  /* ---------------- autocolantes ---------------- */

  var STICKERS = [
    { id: 'st-star',     art: 'starShape', color: '#FFC145' },
    { id: 'st-cat',      art: 'cat' },
    { id: 'st-dog',      art: 'dog' },
    { id: 'st-sun',      art: 'sun' },
    { id: 'st-flower',   art: 'flower' },
    { id: 'st-rabbit',   art: 'rabbit' },
    { id: 'st-fish',     art: 'fish' },
    { id: 'st-bee',      art: 'bee' },
    { id: 'st-apple',    art: 'apple' },
    { id: 'st-moon',     art: 'moon' },
    { id: 'st-bird',     art: 'bird' },
    { id: 'st-cheese',   art: 'cheese' },
    { id: 'st-house',    art: 'house' },
    { id: 'st-car',      art: 'car' },
    { id: 'st-heart',    art: 'heart', color: '#FF8FB1' },
    { id: 'st-music',    art: 'note',  color: '#B892FF' },
    { id: 'st-lion',     art: 'lion' },
    { id: 'st-cow',      art: 'cow' },
    { id: 'st-frog',     art: 'frog' },
    { id: 'st-elephant', art: 'elephant' },
    { id: 'st-duck',     art: 'duck' },
    { id: 'st-pig',      art: 'pig' },
    { id: 'st-ball',     art: 'ball' },
    { id: 'st-rooster',  art: 'rooster' },
    { id: 'st-sheep',    art: 'sheep' },
    { id: 'st-horse',    art: 'horse' },
    { id: 'st-mouse',    art: 'mouse' },
    { id: 'st-drum',     art: 'drum' },
    { id: 'st-umbrella', art: 'umbrella' },
    { id: 'st-sprout',   art: 'sprout' }
  ];

  function nameOf(item) {
    return item.pt || item.id;
  }

  // "o gato" / "a vaca"
  function withArticle(item) {
    return (item.g === 'f' ? 'a ' : 'o ') + nameOf(item);
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  MC.data = {
    TRACE: TRACE,
    LETTERS: LETTERS,
    LETTERS_ALL: LETTERS_ALL,
    DIGITS: DIGITS,
    ANIMALS: ANIMALS,
    LOOKALIKES: LOOKALIKES,
    HABITATS: HABITATS,
    OBJECTS: OBJECTS,
    WORDS: WORDS,
    LOOKALIKE_WORDS: LOOKALIKE_WORDS,
    COLORS: COLORS,
    SHAPES: SHAPES,
    ROUTINES: ROUTINES,
    WEATHER: WEATHER,
    WEAR: WEAR,
    CLOTHES: CLOTHES,
    STORIES: STORIES,
    COLORINGS: COLORINGS,
    STICKERS: STICKERS,
    nameOf: nameOf,
    withArticle: withArticle,
    animal: function (id) { return byId(ANIMALS, id); },
    object: function (id) { return byId(OBJECTS, id) || byId(ANIMALS, id); },
    color: function (id) { return byId(COLORS, id); },
    word: function (pt) {
      for (var i = 0; i < WORDS.length; i++) if (WORDS[i].pt === pt) return WORDS[i];
      return null;
    },

    // um autocolante ainda nao ganho, ou um qualquer se ja tiver todos
    nextSticker: function () {
      var locked = STICKERS.filter(function (s) { return !MC.store.hasSticker(s.id); });
      return locked.length ? MC.pick(locked) : MC.pick(STICKERS);
    },
    stickerById: function (id) {
      return byId(STICKERS, id) || STICKERS[0];
    }
  };

})(window.MC);
