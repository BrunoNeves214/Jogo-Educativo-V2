/* Mundo Curioso — as nove ilhas do mapa.
   Cada ilha tem uma silhueta propria (nenhuma e igual a outra), agua a toda a
   volta e um medalhao com o simbolo da ilha. O cartao do ecra inicial e esta
   ilustracao, nao um rectangulo.

   Desenhadas numa caixa 0 0 240 180, mas mostradas com a vista recortada
   (viewBox abaixo) para nao sobrar espaco vazio em cima.
   O centro — x entre 96 e 144 — fica livre para o medalhao: os enfeites e os
   picos vivem nos tercos laterais, para a silhueta de cada ilha continuar
   a ler-se. */
(function (MC) {
  'use strict';

  var VIEW = '4 40 232 142';

  var SAND = '#F6E3BC';
  var SAND_DARK = '#E2C694';
  var GRASS = '#8FCB86';
  var GRASS_DARK = '#63A85B';
  var SEA = '#BDE6F2';
  var SEA_DEEP = '#93CFE6';
  var TRUNK = '#9A6B3F';

  function palm(x, y, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      '<path d="M0 0 C-3 -13 -2 -24 2 -32" fill="none" stroke="' + TRUNK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M2 -33 C-9 -41 -20 -39 -25 -32 C-16 -36 -8 -34 1 -30Z" fill="#57A566"/>' +
      '<path d="M2 -33 C13 -41 24 -38 28 -31 C19 -35 11 -33 3 -29Z" fill="#4A9257"/>' +
      '<path d="M2 -33 C-3 -45 3 -54 12 -56 C6 -49 5 -41 5 -31Z" fill="#69BC74"/>' +
      '<circle cx="2" cy="-33" r="3.2" fill="#8B5E34"/>' +
      '</g>';
  }

  function bush(x, y, s, c) {
    s = s || 1;
    c = c || '#63B46F';
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      '<ellipse cx="0" cy="0" rx="15" ry="9" fill="' + c + '"/>' +
      '<circle cx="-6" cy="-6" r="8" fill="' + c + '"/>' +
      '<circle cx="6" cy="-7" r="9" fill="#6FC26F"/>' +
      '</g>';
  }

  function rock(x, y, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      '<path d="M-15 0 C-15 -10 -8 -16 0 -16 C9 -16 15 -9 15 0Z" fill="#A79A88"/>' +
      '<path d="M-15 0 C-15 -10 -8 -16 0 -16 C-4 -10 -6 -5 -6 0Z" fill="#BFB3A3"/>' +
      '</g>';
  }

  /* sand: contorno da praia · land: a relva · deco: o que a distingue */
  var SHAPES = {
    // redonda e acolhedora, com uma palmeira alta — a ilha de partida
    letras: {
      sand: 'M40 132 C40 108 66 95 92 93 C112 91 128 83 150 87 C182 92 204 108 202 130 C200 150 160 158 120 158 C80 158 40 152 40 132Z',
      land: 'M54 128 C54 110 76 100 98 99 C116 98 130 92 148 96 C174 100 190 112 188 128 C186 141 154 147 120 147 C86 147 54 141 54 128Z',
      deco: palm(66, 132, 1.05) + rock(178, 134, .75)
    },
    // baixa e larga, ondulada como uma fila de colinas
    cores: {
      sand: 'M28 134 C28 118 46 110 62 110 C70 92 92 88 102 104 C116 88 142 91 152 108 C170 104 196 112 202 128 C208 146 160 158 116 158 C72 158 28 150 28 134Z',
      land: 'M42 130 C42 118 56 111 68 112 C76 98 94 96 102 109 C114 97 136 100 142 113 C162 110 186 116 190 128 C194 141 156 147 116 147 C76 147 42 141 42 130Z',
      deco: bush(64, 128, .8, '#57A566') + bush(174, 130, .85, '#6FC26F') +
        '<g transform="translate(150,120)"><rect x="-2" y="-2" width="4" height="14" rx="2" fill="#4E9A5C"/>' +
        '<circle cx="0" cy="-8" r="8" fill="#FF8FB1"/><circle cx="0" cy="-8" r="3.6" fill="#FFC145"/></g>'
    },
    // com um rochedo alto a direita, onde param os passaros
    animais: {
      sand: 'M34 136 C34 116 60 105 88 105 C104 90 134 90 148 104 C186 100 214 112 212 132 C210 150 162 158 120 158 C78 158 34 152 34 136Z',
      land: 'M48 132 C48 118 68 109 90 109 C104 97 130 97 144 108 C176 106 196 116 194 130 C192 142 156 147 120 147 C84 147 48 142 48 132Z',
      deco: rock(178, 128, 1.5) + palm(66, 130, .85) + bush(96, 134, .6)
    },
    // um planalto de arestas direitas, como um bloco de construcao
    logica: {
      sand: 'M42 136 L58 104 L104 94 L152 98 L190 110 L200 136 C200 152 158 158 120 158 C82 158 42 152 42 136Z',
      land: 'M56 132 L70 110 L106 101 L148 105 L180 115 L186 132 C186 142 154 147 120 147 C86 147 56 142 56 132Z',
      deco: '<g transform="translate(58,130)">' +
          '<rect x="0" y="-13" width="13" height="13" rx="3" fill="#8E7DBE"/>' +
          '<rect x="15" y="-13" width="13" height="13" rx="3" fill="#B892FF"/>' +
          '<rect x="7" y="-27" width="13" height="13" rx="3" fill="#7A67AE"/>' +
        '</g>' + bush(180, 132, .7)
    },
    // comprida e estreita, com uma lagoa de agua calma
    vocabulario: {
      sand: 'M22 136 C22 121 52 112 92 110 C124 108 158 110 190 116 C212 120 220 130 218 138 C216 150 170 158 120 158 C70 158 22 150 22 136Z',
      land: 'M36 134 C36 122 64 115 96 114 C124 113 154 115 182 120 C198 123 204 130 202 136 C200 144 166 147 120 147 C74 147 36 143 36 134Z',
      deco: '<ellipse cx="176" cy="130" rx="22" ry="8.5" fill="' + SEA + '"/>' +
        '<ellipse cx="176" cy="129" rx="15" ry="5" fill="' + SEA_DEEP + '"/>' +
        palm(60, 132, .95) + bush(96, 134, .55)
    },
    // duas colinas gemeas, uma de cada lado
    matematica: {
      sand: 'M32 134 C32 114 54 102 76 104 C86 88 106 88 116 102 C128 88 152 90 164 104 C190 104 208 116 206 132 C204 150 162 158 120 158 C78 158 32 150 32 134Z',
      land: 'M46 130 C46 116 62 106 80 108 C90 96 106 96 114 107 C126 96 146 98 156 109 C178 109 190 118 188 130 C186 142 156 147 120 147 C84 147 46 142 46 130Z',
      deco: bush(70, 128, .8, '#57A566') + bush(168, 128, .8, '#57A566')
    },
    // com um pico nevado que se ve de longe
    motricidade: {
      sand: 'M40 136 C40 122 56 113 70 111 L92 66 L114 111 C152 113 198 119 198 136 C198 152 160 158 120 158 C80 158 40 152 40 136Z',
      land: 'M54 132 C54 122 68 116 82 114 L92 82 L104 114 C144 116 186 122 186 132 C186 142 156 147 120 147 C84 147 54 142 54 132Z',
      deco: '<path d="M92 66 L82 87 L102 87Z" fill="#F7F5FC"/>' +
        '<path d="M92 66 L82 87 L88 87 L92 74Z" fill="#E2DFEE"/>' +
        bush(176, 132, .75)
    },
    // em meia-lua, a abracar uma enseada
    rotinas: {
      sand: 'M28 140 C24 118 56 104 92 106 C118 108 138 96 166 102 C200 109 216 126 208 140 C198 156 158 158 120 158 C82 158 34 156 28 140Z',
      land: 'M44 136 C42 122 68 112 94 114 C118 116 138 106 162 112 C186 118 196 128 190 136 C184 145 154 147 120 147 C86 147 48 145 44 136Z',
      deco: '<g transform="translate(62,122)">' +
          '<circle cx="0" cy="0" r="13" fill="#FFF7EC" stroke="#F4A261" stroke-width="3"/>' +
          '<path d="M0 -8v8h6" fill="none" stroke="#F4A261" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' + palm(180, 134, .8)
    },
    // um cone de vulcao adormecido, sempre a fumegar
    musica: {
      sand: 'M40 138 C40 127 54 119 70 115 L84 62 L100 115 C142 119 198 125 198 138 C198 152 160 158 120 158 C80 158 40 152 40 138Z',
      land: 'M54 134 C54 125 66 120 78 117 L84 78 L92 117 C136 121 184 126 184 134 C184 143 154 147 120 147 C86 147 54 143 54 134Z',
      deco: '<path d="M75 62 L84 54 L93 62Z" fill="#C9C6DC"/>' +
        '<ellipse cx="84" cy="62" rx="10" ry="3.6" fill="#7A67AE"/>' +
        '<circle cx="79" cy="52" r="5" fill="#EDE9F8"/>' +
        '<circle cx="90" cy="45" r="6.5" fill="#F4F1FB"/>' +
        '<circle cx="80" cy="37" r="4" fill="#F9F7FD"/>' +
        bush(176, 132, .7)
    }
  };

  /* Ilustracao completa de uma ilha.
     isl vem de MC.ISLANDS; emblemBody e o interior de um <svg> 24x24. */
  function islandSvg(isl, emblemBody) {
    var s = SHAPES[isl.id] || SHAPES.letras;
    return '<svg viewBox="' + VIEW + '" class="island-art" aria-hidden="true">' +
      // mar em duas camadas, para dar profundidade
      '<ellipse cx="120" cy="132" rx="116" ry="43" fill="' + isl.soft + '"/>' +
      '<ellipse cx="120" cy="134" rx="104" ry="36" fill="' + SEA + '"/>' +
      '<path d="M32 146 q9 -5 18 0 t18 0" fill="none" stroke="' + SEA_DEEP + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M174 150 q9 -5 18 0 t16 0" fill="none" stroke="' + SEA_DEEP + '" stroke-width="3" stroke-linecap="round"/>' +
      // areia e relva
      '<path d="' + s.sand + '" fill="' + SAND + '" stroke="' + SAND_DARK + '" stroke-width="2"/>' +
      '<path d="' + s.land + '" fill="' + GRASS + '" stroke="' + GRASS_DARK + '" stroke-width="1.6"/>' +
      s.deco +
      // medalhao com o simbolo da ilha, pousado no meio da relva
      '<g transform="translate(120,120)">' +
        '<ellipse cx="0" cy="24" rx="24" ry="6" fill="' + GRASS_DARK + '" opacity=".25"/>' +
        '<circle r="27" fill="#FFFFFF" opacity=".35"/>' +
        '<circle r="22" fill="#FFFFFF"/>' +
        '<circle r="22" fill="none" stroke="' + isl.color + '" stroke-width="3"/>' +
        '<g transform="translate(-13,-13) scale(1.0833)" style="color:' + isl.color + '">' + emblemBody + '</g>' +
      '</g>' +
      '</svg>';
  }

  MC.islandArt = islandSvg;

})(window.MC);
