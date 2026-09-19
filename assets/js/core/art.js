/* Mundo Curioso — biblioteca de desenhos SVG.
   Tudo inline, sem imagens externas: a app pesa pouco, fica nitida em
   qualquer ecra e funciona offline.

   Dois tamanhos de grelha:
   - icones de interface e formas geometricas: 24x24 (traco simples);
   - animais, objectos, roupa e instrumentos: 64x64, com espaco para
     proporcoes certas, sombra e brilho — sao estes que a crianca tem
     de reconhecer a primeira vista.

   Cada entrada e uma string (grelha 24) ou { vb, body } com a sua caixa. */
(function (MC) {
  'use strict';

  var INK = '#2B2A4A';
  var BIG = '0 0 64 64';

  // atalho para declarar um desenho na grelha grande
  function big(body) { return { vb: BIG, body: body }; }

  // olho com brilho, repetido em quase todos os animais
  function eye(x, y, r) {
    r = r || 3;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + INK + '"/>' +
      '<circle cx="' + (x + r * 0.34) + '" cy="' + (y - r * 0.4) + '" r="' + (r * 0.34) + '" fill="#FFFFFF"/>';
  }

  var BODY = {

    /* ============ icones de interface (24x24) ============ */

    back: '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    speaker: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M17 8.5a5 5 0 0 1 0 7"/><path d="M19.5 6a8.5 8.5 0 0 1 0 12"/></g>',
    gear: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.2v2.6M12 19.2v2.6M2.2 12h2.6M19.2 12h2.6M5.1 5.1l1.9 1.9M17 17l1.9 1.9M18.9 5.1 17 7M7 17l-1.9 1.9"/></g>',
    check: '<path d="M5 13l4 4 10-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    star: '<path d="M12 2l3 6 6.5.9-4.7 4.6 1.1 6.5L12 17l-5.9 3 1.1-6.5L2.5 8.9 9 8Z" fill="currentColor"/>',
    refresh: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M5.5 9a7 7 0 0 1 12-3.5L20 8"/><path d="M18.5 15a7 7 0 0 1-12 3.5L4 16"/></g>',
    brush: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-5L16 4l4 4L9 19l-5 1Z"/><path d="M14 6l4 4"/></g>',
    pencil: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-5L16 4l4 4L9 19l-5 1Z"/><path d="M14 6l4 4"/></g>',
    puzzle: '<path d="M4 4h6a2 2 0 1 1 4 0h6v6a2 2 0 1 0 0 4v6h-6a2 2 0 1 1-4 0H4v-6a2 2 0 1 0 0-4Z" fill="currentColor"/>',
    shapes: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="3.4"/><rect x="13" y="4" width="7" height="7" rx="1.4"/><path d="M7 13.5 L11.5 20.5 L2.5 20.5 Z"/></g>',
    paw: '<g fill="currentColor"><ellipse cx="12" cy="16.5" rx="6" ry="4.6"/><ellipse cx="4.6" cy="9.4" rx="2.1" ry="2.9"/><ellipse cx="9.6" cy="5.6" rx="2.1" ry="2.9"/><ellipse cx="14.4" cy="5.6" rx="2.1" ry="2.9"/><ellipse cx="19.4" cy="9.4" rx="2.1" ry="2.9"/></g>',
    chat: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-4 4v-4H4Z"/><path d="M7 9h10M7 12.5h7"/></g>',
    plus: '<g fill="currentColor"><rect x="10" y="3" width="4" height="18" rx="1.4"/><rect x="3" y="10" width="18" height="4" rx="1.4"/></g>',
    checklist: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 9l2 2 4-4"/><path d="M8 16h8"/></g>',
    note: '<path d="M9 17a3 3 0 1 1-2-2.83V4.5a1 1 0 0 1 1.2-.98l8 1.6A1 1 0 0 1 17 6.1v8.4a3 3 0 1 1-2-2.83V8.1l-6-1.2Z" fill="currentColor"/>',
    hand: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6a1.5 1.5 0 0 1 3 0v7a7 7 0 0 1-7 7 7 7 0 0 1-5-2l-3-4a1.6 1.6 0 0 1 2.4-2L8 15"/></g>',
    grid: '<g fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></g>',
    sparkle: '<g fill="currentColor"><path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6Z"/><path d="M19 15l.9 2.4L22 18l-2.1.8L19 21l-.9-2.2L16 18l2.1-.6Z"/></g>',
    lock: '<g fill="currentColor"><rect x="5" y="10.5" width="14" height="10.5" rx="2.4"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5h-2.4V8a1.6 1.6 0 0 0-3.2 0v2.5Z"/></g>',
    alphabet: '<text x="12" y="17.5" text-anchor="middle" fill="currentColor" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="14">Aa</text>',

    /* ============ mascote ============ */

    mascot: {
      vb: BIG,
      body: '<g>' +
        '<path d="M32 4 L39 24 L60 24 L43 37 L49 58 L32 46 L15 58 L21 37 L4 24 L25 24 Z" fill="#FFC145" stroke="#F0A51E" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="18" cy="34" r="3.4" fill="#FF8FB1" opacity=".45"/>' +
        '<circle cx="46" cy="34" r="3.4" fill="#FF8FB1" opacity=".45"/>' +
        eye(25, 29, 3.4) + eye(39, 29, 3.4) +
        '<path d="M24 37 Q32 45 40 37" stroke="' + INK + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '</g>'
    },

    /* ============ animais (64x64) ============ */

    cat: big(
      '<path d="M44 52c9 1 13-5 11-13" fill="none" stroke="#E08A4A" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M18 57c-1-13 5-21 14-21s15 8 14 21z" fill="#F4A261"/>' +
      '<path d="M19 15l-3-11 12 6z" fill="#F4A261"/><path d="M45 15l3-11-12 6z" fill="#F4A261"/>' +
      '<path d="M21 14l-1.6-6 6.4 3.4z" fill="#FFB3C6"/><path d="M43 14l1.6-6-6.4 3.4z" fill="#FFB3C6"/>' +
      '<circle cx="32" cy="27" r="15.5" fill="#F4A261"/>' +
      '<path d="M26 13.5l1.4 6M32 12l0 6M38 13.5l-1.4 6" stroke="#E08A4A" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="32" cy="34" rx="9.5" ry="6" fill="#FFE2C4"/>' +
      eye(25.5, 25.5, 3.4) + eye(38.5, 25.5, 3.4) +
      '<path d="M32 30.5l-2.6 2.4h5.2z" fill="#FF8FB1"/>' +
      '<path d="M32 33v2.2" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M32 35.2q-2.8 2.6-5 .6M32 35.2q2.8 2.6 5 .6" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M22 31l-9-2.4M22 35l-9 2.4M42 31l9-2.4M42 35l9 2.4" stroke="#D97E3C" stroke-width="1.3" stroke-linecap="round"/>'
    ),

    dog: big(
      '<ellipse cx="13" cy="32" rx="7" ry="13" fill="#8B5E34"/>' +
      '<ellipse cx="51" cy="32" rx="7" ry="13" fill="#8B5E34"/>' +
      '<path d="M17 57c-1-12 6-19 15-19s16 7 15 19z" fill="#C68B59"/>' +
      '<circle cx="32" cy="28" r="16" fill="#C68B59"/>' +
      '<path d="M32 12c-7 0-13 4-15 10 3-5 8-7 15-7s12 2 15 7c-2-6-8-10-15-10z" fill="#A8703F"/>' +
      '<ellipse cx="32" cy="37" rx="11.5" ry="8.5" fill="#F0D6B4"/>' +
      eye(25, 25.5, 3.2) + eye(39, 25.5, 3.2) +
      '<ellipse cx="32" cy="33" rx="4.4" ry="3.3" fill="' + INK + '"/>' +
      '<path d="M32 36.3v2.4" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M32 38.7q-3.2 3-5.6.6M32 38.7q3.2 3 5.6.6" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M29.4 42.6h5.2a2.6 2.6 0 0 1-5.2 0z" fill="#FF8FB1"/>'
    ),

    bird: big(
      '<path d="M27 46v10M35 46v10" stroke="#E08A4A" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M22 56h9M31 56h9" stroke="#E08A4A" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M16 32C7 33 2 39 1 46c8 1 14-3 17-9z" fill="#3E8FC4"/>' +
      '<ellipse cx="29" cy="35" rx="18" ry="14" fill="#4EA8DE"/>' +
      '<ellipse cx="31" cy="40" rx="11" ry="8" fill="#9BD3F0"/>' +
      '<path d="M22 32q10-5 17 3-8 6-17 1z" fill="#3E8FC4"/>' +
      '<circle cx="42" cy="21" r="11.5" fill="#4EA8DE"/>' +
      '<path d="M37 10q3-6 8-4-3 2-3.6 5.6z" fill="#3E8FC4"/>' +
      '<path d="M52 19l11 3.4-10.6 4z" fill="#F4A261"/>' +
      '<path d="M52 19l11 3.4-11 1z" fill="#E08A4A"/>' +
      eye(44, 19, 3)
    ),

    duck: big(
      '<path d="M28 50v7M36 50v7" stroke="#F4A261" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M22 57h10M32 57h10" stroke="#F4A261" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M14 30C6 32 2 38 2 44c7 1 13-2 15-8z" fill="#EDAE21"/>' +
      '<ellipse cx="28" cy="36" rx="18" ry="14" fill="#FFC145"/>' +
      '<ellipse cx="30" cy="41" rx="11" ry="7" fill="#FFDD8A"/>' +
      '<path d="M21 33q10-5 17 3-8 6-17 1z" fill="#EDAE21"/>' +
      '<circle cx="42" cy="21" r="11.5" fill="#FFC145"/>' +
      '<path d="M52 19q10 0 10 4t-10 4c-2-2-2-6 0-8z" fill="#F4A261"/>' +
      '<path d="M52 23h10" stroke="#E08A4A" stroke-width="1.4"/>' +
      eye(44, 19, 3)
    ),

    rabbit: big(
      '<ellipse cx="22" cy="20" rx="6" ry="17" fill="#F2F0F8" stroke="#D5D2E2" stroke-width="1.4"/>' +
      '<ellipse cx="42" cy="20" rx="6" ry="17" fill="#F2F0F8" stroke="#D5D2E2" stroke-width="1.4"/>' +
      '<ellipse cx="22" cy="21" rx="2.8" ry="11" fill="#FFB3C6"/>' +
      '<ellipse cx="42" cy="21" rx="2.8" ry="11" fill="#FFB3C6"/>' +
      '<circle cx="50" cy="48" r="7" fill="#FFFFFF" stroke="#D5D2E2" stroke-width="1.4"/>' +
      '<path d="M16 57c-1-12 6-19 16-19s17 7 16 19z" fill="#F7F5FC" stroke="#D5D2E2" stroke-width="1.4"/>' +
      '<circle cx="32" cy="38" r="15" fill="#FAF8FD" stroke="#D5D2E2" stroke-width="1.4"/>' +
      eye(25.5, 36, 3.2) + eye(38.5, 36, 3.2) +
      '<path d="M32 41.5l-2.6 2.4h5.2z" fill="#FF8FB1"/>' +
      '<path d="M32 44v2M32 46q-2.6 2.4-4.6.4M32 46q2.6 2.4 4.6.4" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M26 52h12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>'
    ),

    cow: big(
      '<ellipse cx="9" cy="27" rx="7" ry="5" fill="#E4E2EC" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<ellipse cx="55" cy="27" rx="7" ry="5" fill="#E4E2EC" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<path d="M22 20q-3-8 3-10 2 5 1 10z" fill="#E0B87F" stroke="#C99A5E" stroke-width="1.2"/>' +
      '<path d="M42 20q3-8-3-10-2 5-1 10z" fill="#E0B87F" stroke="#C99A5E" stroke-width="1.2"/>' +
      '<ellipse cx="32" cy="33" rx="19" ry="17" fill="#FFFFFF" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M18 22q7-2 9 4-5 4-11 1z" fill="' + INK + '"/>' +
      '<path d="M46 40q-6 1-7-4 5-2 8 1z" fill="' + INK + '"/>' +
      eye(25, 30, 3.4) + eye(39, 30, 3.4) +
      '<ellipse cx="32" cy="42" rx="11" ry="7.6" fill="#FFB3C6"/>' +
      '<ellipse cx="28" cy="41" rx="1.8" ry="1.3" fill="#D9899E"/>' +
      '<ellipse cx="36" cy="41" rx="1.8" ry="1.3" fill="#D9899E"/>' +
      '<path d="M27 46q5 3 10 0" fill="none" stroke="#D9899E" stroke-width="1.5" stroke-linecap="round"/>'
    ),

    sheep: big(
      '<path d="M18 52v6M46 52v6" stroke="#6B6A8A" stroke-width="3.4" stroke-linecap="round"/>' +
      '<circle cx="18" cy="30" r="9" fill="#F5F3FA" stroke="#D5D2E2" stroke-width="1.6"/>' +
      '<circle cx="46" cy="30" r="9" fill="#F5F3FA" stroke="#D5D2E2" stroke-width="1.6"/>' +
      '<circle cx="23" cy="20" r="9" fill="#F5F3FA" stroke="#D5D2E2" stroke-width="1.6"/>' +
      '<circle cx="41" cy="20" r="9" fill="#F5F3FA" stroke="#D5D2E2" stroke-width="1.6"/>' +
      '<ellipse cx="32" cy="35" rx="21" ry="17" fill="#F5F3FA" stroke="#D5D2E2" stroke-width="1.6"/>' +
      '<circle cx="32" cy="18" r="9" fill="#FAF8FD" stroke="#D5D2E2" stroke-width="1.6"/>' +
      '<ellipse cx="17" cy="35" rx="5.5" ry="3.6" fill="#9C99B4"/>' +
      '<ellipse cx="47" cy="35" rx="5.5" ry="3.6" fill="#9C99B4"/>' +
      '<ellipse cx="32" cy="36" rx="11" ry="10.5" fill="#7E7C96"/>' +
      '<circle cx="27.6" cy="34" r="2.6" fill="#FFFFFF"/><circle cx="36.4" cy="34" r="2.6" fill="#FFFFFF"/>' +
      '<circle cx="28" cy="34.4" r="1.2" fill="' + INK + '"/><circle cx="36.8" cy="34.4" r="1.2" fill="' + INK + '"/>' +
      '<ellipse cx="32" cy="41" rx="3" ry="2" fill="#5C5A72"/>'
    ),

    horse: big(
      '<path d="M18 16l-2-12 11 7z" fill="#A8703F"/>' +
      '<path d="M31 12l1-11 8 9z" fill="#A8703F"/>' +
      '<path d="M37 9q13 5 13 21 0 12-6 19" fill="none" stroke="#7A4C26" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M22 17q16-4 22 12 5 18-9 26-6 4-12 1-8-4-8-15 0-14 7-24z" fill="#C68B59"/>' +
      '<path d="M22 17q8-2 14 2-8 4-11 12-2-8-3-14z" fill="#D9A171"/>' +
      '<ellipse cx="18" cy="48" rx="9" ry="7.5" fill="#E8C8A4" transform="rotate(-14 18 48)"/>' +
      '<circle cx="14.5" cy="46" r="1.6" fill="' + INK + '"/>' +
      '<circle cx="20" cy="49.5" r="1.6" fill="' + INK + '"/>' +
      '<path d="M14 53q5 2 9-1" fill="none" stroke="#C99A5E" stroke-width="1.6" stroke-linecap="round"/>' +
      eye(34, 28, 3.2)
    ),

    pig: big(
      '<path d="M15 20q-4-10 4-11 3 5 3 11z" fill="#FF9FB8"/>' +
      '<path d="M49 20q4-10-4-11-3 5-3 11z" fill="#FF9FB8"/>' +
      '<path d="M17 57c-1-12 6-19 15-19s16 7 15 19z" fill="#FFB3C6"/>' +
      '<circle cx="32" cy="32" r="18" fill="#FFB3C6"/>' +
      '<path d="M15 24q6-4 11 0-6 4-11 0z" fill="#FF8FB1"/>' +
      '<path d="M49 24q-6-4-11 0 6 4 11 0z" fill="#FF8FB1"/>' +
      eye(24.5, 29, 3.2) + eye(39.5, 29, 3.2) +
      '<ellipse cx="32" cy="40" rx="10" ry="7.5" fill="#FF8FB1" stroke="#E8748F" stroke-width="1.4"/>' +
      '<ellipse cx="28.4" cy="40" rx="2" ry="2.6" fill="#D9647F"/>' +
      '<ellipse cx="35.6" cy="40" rx="2" ry="2.6" fill="#D9647F"/>'
    ),

    frog: big(
      '<path d="M8 50q-4 8 2 8 4 0 6-4" fill="#57A566"/>' +
      '<path d="M56 50q4 8-2 8-4 0-6-4" fill="#57A566"/>' +
      '<circle cx="18" cy="20" r="10" fill="#6BBF59"/>' +
      '<circle cx="46" cy="20" r="10" fill="#6BBF59"/>' +
      '<circle cx="18" cy="19" r="6" fill="#FFFFFF"/>' +
      '<circle cx="46" cy="19" r="6" fill="#FFFFFF"/>' +
      '<circle cx="19" cy="19.6" r="3.2" fill="' + INK + '"/>' +
      '<circle cx="47" cy="19.6" r="3.2" fill="' + INK + '"/>' +
      '<circle cx="20.4" cy="18.2" r="1.1" fill="#FFFFFF"/>' +
      '<circle cx="48.4" cy="18.2" r="1.1" fill="#FFFFFF"/>' +
      '<ellipse cx="32" cy="40" rx="24" ry="17" fill="#6BBF59"/>' +
      '<ellipse cx="32" cy="45" rx="15" ry="10" fill="#A6DD8F"/>' +
      '<path d="M18 38q14 11 28 0" fill="none" stroke="#3E8E41" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="24" cy="33" r="1.5" fill="#4E9A5C"/>' +
      '<circle cx="40" cy="33" r="1.5" fill="#4E9A5C"/>'
    ),

    lion: big(
      '<g fill="#D97E3C"><circle cx="55" cy="32" r="9"/><circle cx="51.9" cy="20.5" r="7"/><circle cx="43.5" cy="12.1" r="9"/><circle cx="32" cy="9" r="7"/><circle cx="20.5" cy="12.1" r="9"/><circle cx="12.1" cy="20.5" r="7"/><circle cx="9" cy="32" r="9"/><circle cx="12.1" cy="43.5" r="7"/><circle cx="20.5" cy="51.9" r="9"/><circle cx="32" cy="55" r="7"/><circle cx="43.5" cy="51.9" r="9"/><circle cx="51.9" cy="43.5" r="7"/></g>' +
      '<circle cx="32" cy="32" r="21" fill="#E8974E"/>' +
      '<circle cx="17" cy="16" r="6.5" fill="#E08A4A"/>' +
      '<circle cx="47" cy="16" r="6.5" fill="#E08A4A"/>' +
      '<circle cx="17" cy="16" r="3.2" fill="#FFB3C6"/>' +
      '<circle cx="47" cy="16" r="3.2" fill="#FFB3C6"/>' +
      '<circle cx="32" cy="34" r="14.5" fill="#FFC145"/>' +
      '<ellipse cx="32" cy="41" rx="10" ry="6.5" fill="#FFE9C9"/>' +
      eye(26.5, 31, 3.2) + eye(37.5, 31, 3.2) +
      '<path d="M32 36.5l-3.2 2.8h6.4z" fill="' + INK + '"/>' +
      '<path d="M32 39.3v2.4" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M32 41.7q-3.4 3-6 .6M32 41.7q3.4 3 6 .6" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>' +
      '<g fill="#E8974E"><circle cx="25" cy="40" r="1"/><circle cx="25" cy="43" r="1"/>' +
      '<circle cx="39" cy="40" r="1"/><circle cx="39" cy="43" r="1"/></g>'
    ),

    elephant: big(
      '<path d="M9 34q-7 3-6 12" fill="none" stroke="#8797B5" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="4" cy="47" r="2.6" fill="#8797B5"/>' +
      '<rect x="13" y="40" width="11" height="20" rx="5" fill="#8797B5"/>' +
      '<rect x="33" y="40" width="11" height="20" rx="5" fill="#8797B5"/>' +
      '<ellipse cx="26" cy="34" rx="21" ry="16" fill="#9AA9C4"/>' +
      '<rect x="18" y="42" width="12" height="18" rx="6" fill="#9AA9C4"/>' +
      '<rect x="38" y="42" width="12" height="18" rx="6" fill="#9AA9C4"/>' +
      '<circle cx="46" cy="29" r="15" fill="#A9B7CE"/>' +
      '<ellipse cx="37" cy="27" rx="11" ry="13" fill="#8797B5"/>' +
      '<ellipse cx="37" cy="27" rx="6.5" ry="8" fill="#9AA9C4"/>' +
      '<path d="M54 37q9 7 7 17-1 6-6.4 5t-1.6-6.6q2.4-7.4-5-12.4z" fill="#A9B7CE"/>' +
      '<path d="M55 41q6 6 5 13M53 45q4 4 4 9" fill="none" stroke="#93A2BE" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M47 43q7 1 9 7-6 0-10-4z" fill="#FFFFFF"/>' +
      eye(50, 26, 3.2)
    ),

    fish: big(
      '<path d="M44 32l18-13v26z" fill="#2B8FC4"/>' +
      '<ellipse cx="28" cy="32" rx="24" ry="17" fill="#4EA8DE"/>' +
      '<path d="M26 15q9-8 14 1-7 2-14-1z" fill="#3E8FC4"/>' +
      '<path d="M26 49q9 8 14-1-7-2-14 1z" fill="#3E8FC4"/>' +
      '<ellipse cx="26" cy="38" rx="16" ry="9" fill="#9BD3F0"/>' +
      '<g fill="#3E8FC4" opacity=".65">' +
      '<path d="M24 24a7 7 0 0 1 0 12 9 9 0 0 0 0-12z"/>' +
      '<path d="M32 24a7 7 0 0 1 0 12 9 9 0 0 0 0-12z"/>' +
      '<path d="M40 25a6 6 0 0 1 0 10 8 8 0 0 0 0-10z"/>' +
      '</g>' +
      eye(12, 28, 3.4) +
      '<path d="M6 35q4 3 8 1" fill="none" stroke="#2B8FC4" stroke-width="1.6" stroke-linecap="round"/>'
    ),

    bee: big(
      '<ellipse cx="22" cy="18" rx="13" ry="8" fill="#DCF0FA" stroke="#A9D6EC" stroke-width="1.4" transform="rotate(-24 22 18)"/>' +
      '<ellipse cx="44" cy="18" rx="13" ry="8" fill="#DCF0FA" stroke="#A9D6EC" stroke-width="1.4" transform="rotate(24 44 18)"/>' +
      '<path d="M56 40l7 3-7 3z" fill="' + INK + '"/>' +
      '<ellipse cx="34" cy="40" rx="22" ry="15" fill="#FFC145"/>' +
      '<path d="M28 26q5 28 0 28-5 0-6-4 4-10 0-22z" fill="' + INK + '"/>' +
      '<path d="M42 27q-4 26 0 26 5 0 7-4-5-10-1-22z" fill="' + INK + '"/>' +
      '<circle cx="16" cy="38" r="10" fill="#FFDD8A"/>' +
      eye(14, 36, 2.8) +
      '<path d="M11 42q4 3 8 0" fill="none" stroke="#E08A4A" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M12 28q-3-6-8-7M20 27q0-7-4-10" fill="none" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="4" cy="21" r="2" fill="' + INK + '"/><circle cx="16" cy="17" r="2" fill="' + INK + '"/>'
    ),

    rooster: big(
      '<path d="M50 34q12-4 13 8-9 2-12-2z" fill="#E08A4A"/>' +
      '<path d="M46 30q14-10 17 2-11 3-16 1z" fill="#F4A261"/>' +
      '<path d="M44 28q12-16 18-5-10 6-15 8z" fill="#FFC145"/>' +
      '<path d="M20 52v6M32 52v6" stroke="#F4A261" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M15 58h9M27 58h9" stroke="#F4A261" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="28" cy="40" rx="19" ry="16" fill="#FAF8FD" stroke="#DCD9E8" stroke-width="1.6"/>' +
      '<path d="M18 36q12-5 19 4-10 7-19 2z" fill="#EFEDF6"/>' +
      '<circle cx="24" cy="18" r="11" fill="#FAF8FD" stroke="#DCD9E8" stroke-width="1.6"/>' +
      '<path d="M16 9q2-6 5-1 3-7 5-1 3-6 5 1-7 3-15 1z" fill="#FF6F59"/>' +
      '<path d="M13 22l10 2-9 4z" fill="#FFC145"/>' +
      '<path d="M22 28q1 5 4 6-4 2-6-2z" fill="#FF6F59"/>' +
      eye(26, 16, 2.8)
    ),

    /* ============ objectos (64x64) ============ */

    apple: big(
      '<path d="M32 18c-9 0-16 7-16 17s8 25 16 25 16-15 16-25-7-17-16-17z" fill="#FF6F59"/>' +
      '<path d="M32 18c-6 0-11 4-14 10 3 16 9 27 14 30-8 0-16-15-16-23s7-17 16-17z" fill="#E8543E"/>' +
      '<ellipse cx="24" cy="30" rx="4.5" ry="6.5" fill="#FF9481" transform="rotate(-24 24 30)"/>' +
      '<path d="M32 19c0-5 1-8 3-11" fill="none" stroke="#8B5E34" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M35 12q10-6 14 2-10 5-14-2z" fill="#6BBF59"/>'
    ),

    banana: big(
      '<path d="M12 14c2 21 15 34 38 36-3 6-11 9-21 7C13 54 6 38 8 22c1-5 2-7 4-8z" fill="#FFC145" stroke="#E5A800" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M14 18c3 17 14 28 32 31-14 0-27-12-32-31z" fill="#FFDD8A"/>' +
      '<path d="M10 14l-2-6 6 2z" fill="#8B5E34"/>' +
      '<path d="M50 50l7 2-5 4z" fill="#8B5E34"/>'
    ),

    sun: big(
      '<g stroke="#FFD976" stroke-width="5" stroke-linecap="round">' +
      '<path d="M32 3v8M32 53v8M3 32h8M53 32h8M11.6 11.6l5.6 5.6M46.8 46.8l5.6 5.6M52.4 11.6l-5.6 5.6M17.2 46.8l-5.6 5.6"/></g>' +
      '<circle cx="32" cy="32" r="17" fill="#FFC145"/>' +
      '<circle cx="32" cy="32" r="12" fill="#FFDD8A"/>' +
      '<circle cx="26" cy="30" r="2.4" fill="#E5A800"/>' +
      '<circle cx="38" cy="30" r="2.4" fill="#E5A800"/>' +
      '<path d="M26 37q6 5 12 0" fill="none" stroke="#E5A800" stroke-width="2.4" stroke-linecap="round"/>'
    ),

    moon: big(
      '<path d="M40 6a26 26 0 1 0 17 44A22 22 0 0 1 40 6z" fill="#8E7DBE"/>' +
      '<path d="M40 6a26 26 0 0 0-9 50A26 26 0 0 1 40 6z" fill="#7A67AE"/>' +
      '<circle cx="24" cy="24" r="4" fill="#7A67AE"/>' +
      '<circle cx="20" cy="38" r="3" fill="#7A67AE"/>' +
      '<circle cx="32" cy="44" r="2.4" fill="#7A67AE"/>'
    ),

    sea: big(
      '<rect x="2" y="12" width="60" height="16" rx="4" fill="#DCEFFC"/>' +
      '<circle cx="50" cy="19" r="6" fill="#FFC145"/>' +
      '<path d="M2 30q8-6 15 0t15 0 15 0 15 0v28H2z" fill="#4EA8DE"/>' +
      '<path d="M2 38q8-6 15 0t15 0 15 0 15 0" fill="none" stroke="#9BD3F0" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M2 47q8-6 15 0t15 0 15 0 15 0" fill="none" stroke="#9BD3F0" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M2 56q8-6 15 0t15 0 15 0 15 0" fill="none" stroke="#9BD3F0" stroke-width="3" stroke-linecap="round" opacity=".45"/>'
    ),

    tree: big(
      '<path d="M28 42h8v18h-8z" fill="#8B5E34"/>' +
      '<path d="M28 48l-7-5v4l7 4zM36 52l7-5v4l-7 4z" fill="#8B5E34"/>' +
      '<circle cx="32" cy="24" r="18" fill="#6BBF59"/>' +
      '<circle cx="19" cy="32" r="12" fill="#57A566"/>' +
      '<circle cx="45" cy="32" r="12" fill="#57A566"/>' +
      '<circle cx="32" cy="34" r="13" fill="#7ACB69"/>' +
      '<circle cx="26" cy="20" r="5" fill="#8ED87C" opacity=".7"/>'
    ),

    flower: big(
      '<path d="M31 34h3v26h-3z" fill="#6BBF59"/>' +
      '<path d="M32 46q-11-6-17 2 10 6 17-2z" fill="#6BBF59"/>' +
      '<path d="M33 54q11-6 17 2-10 6-17-2z" fill="#57A566"/>' +
      '<g fill="#FF8FB1">' +
      '<ellipse cx="32" cy="12" rx="9" ry="11"/><ellipse cx="32" cy="36" rx="9" ry="11"/>' +
      '<ellipse cx="13" cy="24" rx="11" ry="9"/><ellipse cx="51" cy="24" rx="11" ry="9"/>' +
      '<ellipse cx="18" cy="12" rx="9" ry="8" transform="rotate(-40 18 12)"/>' +
      '<ellipse cx="46" cy="12" rx="9" ry="8" transform="rotate(40 46 12)"/>' +
      '</g>' +
      '<circle cx="32" cy="24" r="9" fill="#FFC145"/>' +
      '<circle cx="32" cy="24" r="5" fill="#E5A800"/>'
    ),

    ball: big(
      '<circle cx="32" cy="32" r="26" fill="#FFFFFF"/>' +
      '<path d="M32 32 L32 6 A26 26 0 0 1 54.5 19 Z" fill="#FF6F59"/>' +
      '<path d="M32 32 L54.5 19 A26 26 0 0 1 54.5 45 Z" fill="#FFC145"/>' +
      '<path d="M32 32 L54.5 45 A26 26 0 0 1 32 58 Z" fill="#4EA8DE"/>' +
      '<path d="M32 32 L32 58 A26 26 0 0 1 9.5 45 Z" fill="#6BBF59"/>' +
      '<path d="M32 32 L9.5 45 A26 26 0 0 1 9.5 19 Z" fill="#FF8FB1"/>' +
      '<circle cx="32" cy="32" r="26" fill="none" stroke="#D5D2E2" stroke-width="2"/>' +
      '<ellipse cx="21" cy="19" rx="7" ry="4" fill="#FFFFFF" opacity=".55" transform="rotate(-34 21 19)"/>'
    ),

    house: big(
      '<path d="M4 30L32 8l28 22H4z" fill="#FF6F59"/>' +
      '<path d="M32 8L4 30h6L32 13z" fill="#E8543E"/>' +
      '<rect x="44" y="12" width="8" height="12" rx="2" fill="#C25B48"/>' +
      '<rect x="10" y="30" width="44" height="28" rx="3" fill="#FFE2C6"/>' +
      '<rect x="26" y="40" width="12" height="18" rx="2" fill="#8B5E34"/>' +
      '<circle cx="35" cy="49" r="1.4" fill="#FFC145"/>' +
      '<rect x="15" y="36" width="9" height="9" rx="1.6" fill="#4EA8DE" stroke="#FFFFFF" stroke-width="2"/>' +
      '<rect x="40" y="36" width="9" height="9" rx="1.6" fill="#4EA8DE" stroke="#FFFFFF" stroke-width="2"/>'
    ),

    car: big(
      '<path d="M12 34l5-11a5 5 0 0 1 4.6-3h20.8a5 5 0 0 1 4.3 2.4L54 34z" fill="#DCEFFC"/>' +
      '<path d="M8 34h48a6 6 0 0 1 6 6v8H2v-8a6 6 0 0 1 6-6z" fill="#4EA8DE"/>' +
      '<path d="M2 44h60v4H2z" fill="#3E8FC4"/>' +
      '<path d="M16 32l4-9h10v9zM48 32l-4-9H34v9z" fill="#9BD3F0"/>' +
      '<circle cx="17" cy="48" r="7" fill="' + INK + '"/><circle cx="17" cy="48" r="3" fill="#C9C6DC"/>' +
      '<circle cx="47" cy="48" r="7" fill="' + INK + '"/><circle cx="47" cy="48" r="3" fill="#C9C6DC"/>' +
      '<rect x="56" y="36" width="6" height="4" rx="2" fill="#FFC145"/>'
    ),

    book: big(
      '<path d="M32 16C26 11 16 9 6 10v38c10-1 20 1 26 6z" fill="#FF6F59"/>' +
      '<path d="M32 16c6-5 16-7 26-6v38c-10-1-20 1-26 6z" fill="#FF8FB1"/>' +
      '<path d="M29 18v36h6V18z" fill="#E8543E"/>' +
      '<g stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".7">' +
      '<path d="M12 20h12M12 27h12M12 34h9M40 20h12M40 27h12M40 34h9"/></g>'
    ),

    cup: big(
      '<path d="M22 8q2 6-2 9M32 6q2 6-2 9M42 8q2 6-2 9" fill="none" stroke="#C9C6DC" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M10 22h36v20a18 18 0 0 1-36 0z" fill="#4EA8DE"/>' +
      '<path d="M10 22h10v32a18 18 0 0 1-10-12z" fill="#3E8FC4"/>' +
      '<path d="M46 26h6a9 9 0 0 1 0 18h-6" fill="none" stroke="#4EA8DE" stroke-width="5"/>' +
      '<rect x="6" y="56" width="44" height="5" rx="2.5" fill="#C9C6DC"/>'
    ),

    cheese: big(
      '<path d="M6 46 L34 14 L58 32 L58 46 Z" fill="#FFC145"/>' +
      '<path d="M34 14 L58 32 L58 37 L34 19 Z" fill="#FFDD8A"/>' +
      '<path d="M6 46 h52 v7 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z" fill="#E5A800"/>' +
      '<circle cx="22" cy="39" r="4.4" fill="#E5A800"/>' +
      '<circle cx="37" cy="42" r="3.2" fill="#E5A800"/>' +
      '<circle cx="47" cy="38" r="3.6" fill="#E5A800"/>' +
      '<circle cx="30" cy="29" r="2.6" fill="#E5A800"/>'
    ),

    mouse: big(
      '<path d="M8 42Q-2 34 5 24" fill="none" stroke="#8B8B99" stroke-width="3.2" stroke-linecap="round"/>' +
      '<circle cx="18" cy="27" r="11" fill="#B5B5C2"/>' +
      '<circle cx="18" cy="27" r="6.5" fill="#FFB3C6"/>' +
      '<ellipse cx="28" cy="41" rx="22" ry="15" fill="#9C9CAA"/>' +
      '<ellipse cx="31" cy="46" rx="14" ry="8" fill="#C5C5D2"/>' +
      '<circle cx="36" cy="18" r="9" fill="#B5B5C2"/>' +
      '<circle cx="36" cy="18" r="5" fill="#FFB3C6"/>' +
      '<circle cx="45" cy="30" r="14" fill="#9C9CAA"/>' +
      '<path d="M56 28q8 2 8 5t-8 4z" fill="#B5B5C2"/>' +
      '<circle cx="62" cy="32" r="2.8" fill="#FF8FB1"/>' +
      eye(50, 27, 3) +
      '<path d="M54 36l9 4M54 38l8 6" stroke="#8B8B99" stroke-width="1.2" stroke-linecap="round"/>'
    ),

    carrot: big(
      '<path d="M32 60L18 26q14-7 28 0z" fill="#F4A261"/>' +
      '<path d="M32 60L18 26q7-3.6 14-3.6z" fill="#E08A4A"/>' +
      '<g stroke="#E08A4A" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M23 34h6M26 42h6M29 50h4"/></g>' +
      '<path d="M32 24q-6-10-2-16 5 4 6 10z" fill="#6BBF59"/>' +
      '<path d="M32 24q6-10 14-9-4 7-10 10z" fill="#57A566"/>' +
      '<path d="M32 24q-9-4-13 2 7 3 13 0z" fill="#7ACB69"/>'
    ),

    cloud: big(
      '<g fill="#9AA9C4">' +
      '<ellipse cx="32" cy="40" rx="26" ry="14"/>' +
      '<circle cx="20" cy="32" r="13"/><circle cx="42" cy="30" r="15"/><circle cx="52" cy="40" r="10"/>' +
      '</g>' +
      '<ellipse cx="26" cy="34" rx="11" ry="7" fill="#B6C2D8" opacity=".8"/>'
    ),

    snow: big(
      '<g stroke="#4EA8DE" stroke-width="4" stroke-linecap="round">' +
      '<path d="M32 6v52M9 19l46 26M55 19L9 45"/>' +
      '<path d="M32 16l-7-6M32 16l7-6M32 48l-7 6M32 48l7 6"/>' +
      '<path d="M16 25l-9-1M16 25l-2-9M48 39l9 1M48 39l2 9"/>' +
      '<path d="M16 39l-9 1M16 39l-2 9M48 25l9-1M48 25l2-9"/>' +
      '</g>' +
      '<circle cx="32" cy="32" r="5" fill="#9BD3F0"/>'
    ),

    /* ============ roupa (64x64) ============ */

    hat: big(
      '<ellipse cx="32" cy="46" rx="30" ry="10" fill="#FF6F59"/>' +
      '<ellipse cx="32" cy="44" rx="30" ry="9" fill="#FF8FB1"/>' +
      '<path d="M14 44Q16 12 32 12T50 44q-18 6-36 0z" fill="#FF8FB1"/>' +
      '<path d="M14 40q18 6 36 0v5q-18 6-36 0z" fill="#FF6F59"/>' +
      '<circle cx="32" cy="12" r="5" fill="#FFC145"/>'
    ),

    shirt: big(
      '<path d="M22 8L6 16l6 12 6-3v31h28V25l6 3 6-12-16-8-10 6z" fill="#4EA8DE"/>' +
      '<path d="M22 8l10 6 10-6-4-2-6 4-6-4z" fill="#3E8FC4"/>' +
      '<path d="M30 14h4v42h-4z" fill="#3E8FC4"/>' +
      '<circle cx="32" cy="26" r="1.8" fill="#FFFFFF"/>' +
      '<circle cx="32" cy="36" r="1.8" fill="#FFFFFF"/>' +
      '<circle cx="32" cy="46" r="1.8" fill="#FFFFFF"/>'
    ),

    tshirt: big(
      '<path d="M22 8L6 16l6 12 6-3v31h28V25l6 3 6-12-16-8-10 6z" fill="#FFC145"/>' +
      '<path d="M22 8l10 6 10-6-4-2-6 4-6-4z" fill="#E5A800"/>' +
      '<path d="M18 46h28v4H18z" fill="#FFDD8A"/>'
    ),

    coat: big(
      '<path d="M22 8L6 16l6 12 6-3v31h28V25l6 3 6-12-16-8-10 6z" fill="#8E7DBE"/>' +
      '<path d="M22 8L6 16l6 12 6-3v-8z" fill="#7A67AE"/>' +
      '<path d="M42 8l16 8-6 12-6-3v-8z" fill="#7A67AE"/>' +
      '<path d="M30 14h4v42h-4z" fill="#6A5A9C"/>' +
      '<path d="M22 8l10 6 10-6-5-2-5 3-5-3z" fill="#B892FF"/>' +
      '<rect x="12" y="34" width="40" height="5" rx="2.5" fill="#6A5A9C"/>' +
      '<circle cx="26" cy="25" r="2" fill="#F1E9FF"/>' +
      '<circle cx="26" cy="47" r="2" fill="#F1E9FF"/>'
    ),

    shoes: big(
      '<path d="M4 46c0-9 2-15 6-17h9l4 7 9 3 12 2c10 2 16 6 18 11l1 4H4z" fill="#4EA8DE"/>' +
      '<path d="M10 29h9v17h-9z" fill="#3E8FC4"/>' +
      '<path d="M4 46h56l1 4H4z" fill="#FFFFFF"/>' +
      '<path d="M3 50h58a3 3 0 0 1 3 3v3H3a3 3 0 0 1-3-3 3 3 0 0 1 3-3z" fill="' + INK + '"/>' +
      '<g stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round">' +
      '<path d="M22 37l9 4M25 32l9 5M29 28l9 5"/></g>' +
      '<circle cx="48" cy="40" r="3" fill="#9BD3F0"/>'
    ),

    boots: big(
      '<path d="M8 6h14v28h10a6 6 0 0 1 6 6v10H8z" fill="#FFC145"/>' +
      '<path d="M8 6h6v44H8z" fill="#E5A800"/>' +
      '<rect x="6" y="48" width="34" height="8" rx="3" fill="#8B5E34"/>' +
      '<path d="M32 14h12v20h8a5 5 0 0 1 5 5v9H32z" fill="#FFDD8A"/>' +
      '<rect x="30" y="46" width="28" height="7" rx="3" fill="#A8703F"/>'
    ),

    umbrella: big(
      '<path d="M4 30a28 28 0 0 1 56 0z" fill="#F4A261"/>' +
      '<path d="M4 30a28 28 0 0 1 14-24 40 40 0 0 0-4 24z" fill="#E08A4A"/>' +
      '<path d="M32 30a40 40 0 0 0-4-24 40 40 0 0 1 8 0 40 40 0 0 0-4 24z" fill="#E08A4A"/>' +
      '<path d="M60 30a28 28 0 0 0-14-24 40 40 0 0 1 4 24z" fill="#E08A4A"/>' +
      '<circle cx="32" cy="5" r="3" fill="#FF6F59"/>' +
      '<path d="M30 30h4v22h-4z" fill="#8B5E34"/>' +
      '<path d="M34 52a7 7 0 0 1-14 0" fill="none" stroke="#8B5E34" stroke-width="4" stroke-linecap="round"/>'
    ),

    scarf: big(
      '<path d="M20 20v34l6-5 6 5V20z" fill="#FF6F59"/>' +
      '<path d="M38 20v27l5-4 5 4V20z" fill="#FF8FB1"/>' +
      '<path d="M12 16q20 13 40 0v10q-20 13-40 0z" fill="#FF8FB1"/>' +
      '<path d="M12 16q20 13 40 0v3q-20 13-40 0z" fill="#FFB3C6"/>' +
      '<g stroke="#FFFFFF" stroke-width="2.4" opacity=".55">' +
      '<path d="M21 32h10M21 40h10M39 32h8M39 40h8"/></g>'
    ),

    sunglasses: big(
      '<path d="M4 22h56v6H4z" fill="' + INK + '"/>' +
      '<rect x="2" y="24" width="26" height="18" rx="8" fill="' + INK + '"/>' +
      '<rect x="36" y="24" width="26" height="18" rx="8" fill="' + INK + '"/>' +
      '<rect x="26" y="27" width="12" height="5" rx="2.5" fill="' + INK + '"/>' +
      '<path d="M7 29a6 6 0 0 1 8-2 22 22 0 0 0-5 8 5 5 0 0 1-3-6z" fill="#FFFFFF" opacity=".35"/>' +
      '<path d="M41 29a6 6 0 0 1 8-2 22 22 0 0 0-5 8 5 5 0 0 1-3-6z" fill="#FFFFFF" opacity=".35"/>'
    ),

    /* ============ rotinas (64x64) ============ */

    wake: big(
      '<path d="M4 50h56" stroke="#F4A261" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M32 22a18 18 0 0 1 18 18H14a18 18 0 0 1 18-18z" fill="#FFC145"/>' +
      '<path d="M32 22a18 18 0 0 0-18 18h9a13 13 0 0 1 9-18z" fill="#FFDD8A"/>' +
      '<g stroke="#FFC145" stroke-width="4" stroke-linecap="round">' +
      '<path d="M32 6v8M8 20l6 5M56 20l-6 5M2 40h6M56 40h6"/></g>' +
      '<path d="M22 58h20" stroke="#F4A261" stroke-width="4" stroke-linecap="round" opacity=".5"/>'
    ),

    teeth: big(
      '<rect x="24" y="4" width="16" height="16" rx="6" fill="#4EA8DE"/>' +
      '<path d="M26 5q6-3 12 0-6 3-12 0z" fill="#FFFFFF"/>' +
      '<g fill="#FFFFFF"><rect x="26" y="1" width="3" height="5" rx="1.5"/>' +
      '<rect x="30.5" y="0" width="3" height="6" rx="1.5"/><rect x="35" y="1" width="3" height="5" rx="1.5"/></g>' +
      '<rect x="27" y="20" width="10" height="38" rx="5" fill="#DCEFFC"/>' +
      '<rect x="27" y="20" width="4" height="38" rx="2" fill="#9BD3F0"/>' +
      '<path d="M44 16q9 2 9 10t-9 10" fill="none" stroke="#6BBF59" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="46" cy="42" r="4" fill="#A6DD8F"/>'
    ),

    wash: big(
      '<path d="M6 30h52a26 26 0 0 1-52 0z" fill="#4EA8DE"/>' +
      '<path d="M6 30h20a26 26 0 0 0 8 25A26 26 0 0 1 6 30z" fill="#3E8FC4"/>' +
      '<rect x="4" y="56" width="56" height="6" rx="3" fill="#C9C6DC"/>' +
      '<circle cx="18" cy="16" r="7" fill="#DCEFFC" stroke="#9BD3F0" stroke-width="2"/>' +
      '<circle cx="34" cy="8" r="5" fill="#DCEFFC" stroke="#9BD3F0" stroke-width="2"/>' +
      '<circle cx="46" cy="18" r="4" fill="#DCEFFC" stroke="#9BD3F0" stroke-width="2"/>' +
      '<circle cx="16" cy="14" r="2" fill="#FFFFFF"/>'
    ),

    dress: big(
      '<circle cx="32" cy="12" r="9" fill="#FFD9BE"/>' +
      '<path d="M23 8q9-7 18 0-9-3-18 0z" fill="#8B5E34"/>' +
      '<path d="M22 22L10 28l4 10 6-2v26h24V36l6 2 4-10-12-6-8 5z" fill="#FF8FB1"/>' +
      '<path d="M22 22l10 5 10-5-4-2-6 3-6-3z" fill="#E8748F"/>' +
      '<circle cx="32" cy="40" r="2" fill="#FFFFFF" opacity=".85"/>' +
      '<circle cx="32" cy="50" r="2" fill="#FFFFFF" opacity=".85"/>'
    ),

    bed: big(
      '<rect x="2" y="34" width="60" height="16" rx="4" fill="#8E7DBE"/>' +
      '<rect x="2" y="46" width="60" height="6" rx="3" fill="#7A67AE"/>' +
      '<rect x="4" y="52" width="6" height="8" rx="3" fill="#6A5A9C"/>' +
      '<rect x="54" y="52" width="6" height="8" rx="3" fill="#6A5A9C"/>' +
      '<rect x="6" y="24" width="20" height="12" rx="5" fill="#FFFFFF"/>' +
      '<path d="M26 32h34a4 4 0 0 1 4 4v2H26z" fill="#F2F0F8"/>' +
      '<path d="M40 16q4-5 8 0-4 2-8 0zM46 8q3-4 6 0-3 2-6 0z" fill="#C9C6DC"/>'
    ),

    meal: big(
      '<ellipse cx="32" cy="36" rx="22" ry="20" fill="#FFFFFF" stroke="#D5D2E2" stroke-width="2"/>' +
      '<ellipse cx="32" cy="36" rx="15" ry="13" fill="#F2F0F8"/>' +
      '<circle cx="27" cy="33" r="6" fill="#6BBF59"/>' +
      '<circle cx="37" cy="35" r="5" fill="#FF6F59"/>' +
      '<ellipse cx="32" cy="43" rx="8" ry="4" fill="#FFC145"/>' +
      '<rect x="2" y="16" width="3" height="20" rx="1.5" fill="#9AA9C4"/>' +
      '<rect x="7" y="16" width="3" height="20" rx="1.5" fill="#9AA9C4"/>' +
      '<rect x="3" y="34" width="6" height="24" rx="3" fill="#9AA9C4"/>' +
      '<ellipse cx="57" cy="24" rx="4" ry="8" fill="#9AA9C4"/>' +
      '<rect x="54" y="30" width="6" height="28" rx="3" fill="#9AA9C4"/>'
    ),

    /* ============ instrumentos (64x64) ============ */

    drum: big(
      '<path d="M10 22q-6-12 4-16" fill="none" stroke="#8B5E34" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="12" cy="4" r="4" fill="#C68B59"/>' +
      '<path d="M54 22q6-12-4-16" fill="none" stroke="#8B5E34" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="52" cy="4" r="4" fill="#C68B59"/>' +
      '<path d="M8 26v18a24 8 0 0 0 48 0V26z" fill="#FF6F59"/>' +
      '<ellipse cx="32" cy="26" rx="24" ry="9" fill="#FFDD8A"/>' +
      '<ellipse cx="32" cy="26" rx="24" ry="9" fill="none" stroke="#E5A800" stroke-width="2"/>' +
      '<g stroke="#FFC145" stroke-width="3">' +
      '<path d="M10 30l44 10M54 30L10 40"/></g>' +
      '<ellipse cx="26" cy="23" rx="7" ry="3" fill="#FFFFFF" opacity=".45"/>'
    ),

    bell: big(
      '<path d="M32 8a18 18 0 0 1 18 18v14l5 8H9l5-8V26A18 18 0 0 1 32 8z" fill="#FFC145"/>' +
      '<path d="M32 8a18 18 0 0 0-18 18v14l-5 8h12l3-8V26A18 18 0 0 1 32 8z" fill="#FFDD8A"/>' +
      '<rect x="28" y="2" width="8" height="8" rx="4" fill="#E5A800"/>' +
      '<circle cx="32" cy="53" r="6" fill="#E5A800"/>' +
      '<path d="M22 44h20" stroke="#E5A800" stroke-width="2"/>'
    ),

    xylo: big(
      '<rect x="4" y="12" width="10" height="44" rx="5" fill="#FF6F59"/>' +
      '<rect x="17" y="15" width="10" height="38" rx="5" fill="#FFC145"/>' +
      '<rect x="30" y="18" width="10" height="32" rx="5" fill="#6BBF59"/>' +
      '<rect x="43" y="21" width="10" height="26" rx="5" fill="#4EA8DE"/>' +
      '<g fill="#FFFFFF" opacity=".4">' +
      '<rect x="6" y="16" width="6" height="4" rx="2"/><rect x="19" y="19" width="6" height="4" rx="2"/>' +
      '<rect x="32" y="22" width="6" height="4" rx="2"/><rect x="45" y="25" width="6" height="4" rx="2"/></g>' +
      '<path d="M56 46L48 18" stroke="#8B5E34" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="47" cy="14" r="5" fill="#C68B59"/>'
    ),

    triangleInst: big(
      '<path d="M32 12L54 50H10z" fill="none" stroke="#C9C6DC" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M32 12L54 50H10z" fill="none" stroke="#E7E4F0" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M30 10v-6" stroke="#8B5E34" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M44 20l12-8" stroke="#8B5E34" stroke-width="3.4" stroke-linecap="round"/>' +
      '<circle cx="57" cy="11" r="4" fill="#C68B59"/>'
    ),

    shaker: big(
      '<ellipse cx="22" cy="20" rx="13" ry="15" fill="#F4A261"/>' +
      '<ellipse cx="18" cy="15" rx="5" ry="6" fill="#FFC894" opacity=".8"/>' +
      '<rect x="18" y="33" width="8" height="26" rx="4" fill="#8B5E34"/>' +
      '<ellipse cx="45" cy="28" rx="11" ry="13" fill="#FF8FB1"/>' +
      '<ellipse cx="42" cy="24" rx="4" ry="5" fill="#FFC1D4" opacity=".8"/>' +
      '<rect x="41" y="39" width="7" height="22" rx="3.5" fill="#A8703F"/>' +
      '<g fill="#E08A4A"><circle cx="26" cy="16" r="1.8"/><circle cx="20" cy="26" r="1.8"/></g>'
    ),

    /* ============ roupa e natureza, acrescentados com as fases (64x64) ============ */

    pants: big(
      '<path d="M14 6h36l4 50a3 3 0 0 1-3 3H38a3 3 0 0 1-3-2.6L32 26l-3 30.4A3 3 0 0 1 26 59H13a3 3 0 0 1-3-3z" fill="#4E79C4"/>' +
      '<path d="M14 6h36v7H14z" fill="#3D63A8"/>' +
      '<path d="M32 13v12" stroke="#3D63A8" stroke-width="2"/>' +
      '<path d="M17 18h8M39 18h8" stroke="#6E95D8" stroke-width="2.4" stroke-linecap="round"/>' +
      '<rect x="29" y="7" width="6" height="4" rx="1" fill="#FFC145"/>'
    ),

    shorts: big(
      '<path d="M12 14h40l5 30a3 3 0 0 1-3 3.4H38a3 3 0 0 1-3-2.6L32 30l-3 14.8A3 3 0 0 1 26 47.4H10a3 3 0 0 1-3-3.4z" fill="#2EC4B6"/>' +
      '<path d="M12 14h40v7H12z" fill="#1FA79A"/>' +
      '<path d="M16 26h10M38 26h10" stroke="#8FE3DA" stroke-width="2.4" stroke-linecap="round"/>' +
      '<rect x="29" y="15" width="6" height="4" rx="1" fill="#FFFFFF"/>'
    ),

    beanie: big(
      '<circle cx="32" cy="9" r="7" fill="#FFFFFF" stroke="#E2DFEE" stroke-width="2"/>' +
      '<path d="M10 42C10 24 20 14 32 14s22 10 22 28z" fill="#FF6F59"/>' +
      '<path d="M18 22c4 6 5 14 4 20M32 16v26M46 22c-4 6-5 14-4 20" stroke="#E8543E" stroke-width="2.4" fill="none"/>' +
      '<rect x="7" y="40" width="50" height="12" rx="5" fill="#FFC145"/>' +
      '<path d="M12 46h40" stroke="#E5A800" stroke-width="2" stroke-dasharray="4 4"/>'
    ),

    seed: big(
      '<path d="M4 44q28-10 56 0v16H4z" fill="#A0703F"/>' +
      '<path d="M4 44q28-10 56 0" fill="none" stroke="#8B5E34" stroke-width="3"/>' +
      '<ellipse cx="32" cy="24" rx="9" ry="13" fill="#C68B59" transform="rotate(25 32 24)"/>' +
      '<ellipse cx="29" cy="20" rx="3" ry="6" fill="#E3B283" transform="rotate(25 29 20)"/>' +
      '<path d="M30 40l-4 8M36 40l4 7" stroke="#8B5E34" stroke-width="2.4" stroke-linecap="round"/>'
    ),

    wateringCan: big(
      '<path d="M12 26h30v24a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#4EA8DE"/>' +
      '<path d="M12 26h9v28h-5a4 4 0 0 1-4-4z" fill="#3E8FC4"/>' +
      '<path d="M42 32l14-12 3 3-13 14" fill="#4EA8DE"/>' +
      '<rect x="54" y="15" width="8" height="8" rx="2" fill="#3E8FC4" transform="rotate(-40 58 19)"/>' +
      '<path d="M16 26c0-10 22-10 22 0" fill="none" stroke="#3E8FC4" stroke-width="4"/>' +
      '<g fill="#9BD3F0"><circle cx="58" cy="30" r="2"/><circle cx="61" cy="38" r="2"/><circle cx="56" cy="44" r="2"/></g>'
    ),

    sprout: big(
      '<path d="M4 46q28-10 56 0v14H4z" fill="#A0703F"/>' +
      '<path d="M32 46V26" stroke="#57A566" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M32 30C22 30 14 22 14 12c10 0 18 8 18 18z" fill="#6BBF59"/>' +
      '<path d="M32 26c0-10 8-18 18-18 0 10-8 18-18 18z" fill="#7ACB69"/>' +
      '<path d="M32 30C24 26 19 20 17 14" fill="none" stroke="#4E9A5C" stroke-width="1.6"/>'
    ),

    /* ============ formas geometricas (24x24) ============ */

    circle: '<circle cx="12" cy="12" r="9" fill="currentColor"/>',
    square: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5" fill="currentColor"/>',
    triangle: '<path d="M12 3 21.5 20h-19Z" fill="currentColor"/>',
    rect: '<rect x="2" y="6.5" width="20" height="11" rx="2.2" fill="currentColor"/>',
    heart: '<path d="M12 21s-8-5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 3.5C20 16 12 21 12 21Z" fill="currentColor"/>',
    starShape: '<path d="M12 2l3 6 6.5.9-4.7 4.6 1.1 6.5L12 17l-5.9 3 1.1-6.5L2.5 8.9 9 8Z" fill="currentColor"/>'
  };

  function entry(name) {
    var e = BODY[name];
    if (e === undefined) e = BODY.star;
    return (typeof e === 'string') ? { vb: '0 0 24 24', body: e } : e;
  }

  var Art = {
    // interior do svg (sem o elemento <svg>)
    body: function (name) { return entry(name).body; },
    // caixa de coordenadas deste desenho
    viewBox: function (name) { return entry(name).vb; },
    has: function (name) { return BODY[name] !== undefined; },

    // <svg> completo. attrs: {cls, color, style, size}
    svg: function (name, attrs) {
      attrs = attrs || {};
      var e = entry(name);
      var out = '<svg viewBox="' + e.vb + '" aria-hidden="true"';
      if (attrs.cls) out += ' class="' + attrs.cls + '"';
      var st = '';
      if (attrs.color) st += 'color:' + attrs.color + ';';
      if (attrs.size) st += 'width:' + attrs.size + ';height:' + attrs.size + ';';
      if (attrs.style) st += attrs.style;
      if (st) out += ' style="' + st + '"';
      out += '>' + e.body + '</svg>';
      return out;
    },

    names: function () { return Object.keys(BODY); }
  };

  MC.art = Art;

})(window.MC);
