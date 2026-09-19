# Mundo Curioso

Aplicação web de jogos educativos para crianças dos **3 aos 5 anos**, em **português**.

Os 25 mini-jogos estão todos implementados e a funcionar, cada um com 5 fases (125 ao todo). Sem anúncios, sem
compras dentro da app, sem contas e sem recolha de dados — o progresso fica
guardado apenas no aparelho.

```
index.html          a app (abre este ficheiro)
assets/             código, estilos e ícones
design/             os 27 mockups originais do Design Canvas (referência visual)
manifest.webmanifest + sw.js    para instalar como PWA
```

## Como abrir

**Modo simples** — faz duplo clique em `index.html`. Funciona: não há módulos
ES nem `fetch` de ficheiros, por isso a app corre directamente do disco.

**Modo recomendado** — serve a pasta por HTTP, para teres também o service
worker, a instalação como app e o modo offline:

```bash
python -m http.server 5510
```

Depois abre <http://localhost:5510>. No Chrome/Edge aparece o botão de
instalar na barra de endereço.

## Os 25 jogos, cada um com 5 fases

Cada jogo tem **5 fases**. A primeira está sempre aberta; cada uma das
seguintes abre quando se acaba a anterior. As fases não aumentam só a
quantidade — mudam o *tipo* de desafio, para a criança não sentir que está
a repetir o mesmo.

No topo de cada jogo aparece o selo **"Fase 2/5"**: tocar nele abre a
escolha de fase, e as já concluídas mostram uma estrela. No fim de cada fase
o ecrã de vitória oferece **"Próxima fase"**. Na área dos pais há um
interruptor para abrir todas as fases de uma vez.

| # | Jogo | Fase 1 → Fase 5 |
|---|------|-----------------|
| 1 | Ouve e Toca | vogais → consoantes → números → letras parecidas (E/F, M/N, P/R…) → letras minúsculas |
| 2 | Desenha a Letra | linhas direitas → inclinadas → curvas → letras mistas → as mais difíceis (6, 8, 9, G, S…). Uma bolinha numerada mostra onde começa cada traço |
| 3 | Puzzle do Alfabeto | letras seguidas → mais letras → palavras de 3 letras com imagem → palavras de 4 letras com uma peça a mais → alfabeto sem ajudas |
| 4 | Conta e Escolhe | até 3 em fila → até 5 → espalhados → contar só um tipo no meio de outros → até 10 |
| 5 | Combinar por Cor | 3 cores → 4 → muitas bolas → formas coloridas → coisas de verdade (a banana vai para o amarelo) |
| 6 | Encontra a Forma | 3 formas na floresta → todas as formas → praia → encontrar todas as iguais → pela cor e pela forma ("o triângulo azul") |
| 7 | Pinta com as Cores | pintar à vontade → mais desenhos → desenhos maiores → pintar igual ao modelo → modelos difíceis |
| 8 | Toca no Animal | na quinta → em casa → na natureza (exploração livre) → "quem faz este som?" → adivinha pelo som |
| 9 | Memória dos Animais | 2 pares → 3 → 4 → o animal e a sua sombra → 8 pares |
| 10 | Adivinha a Silhueta | 2 escolhas → 3 → sombras de coisas → animais parecidos → só se vê um bocadinho |
| 11 | O Que Vem a Seguir? | duas cores → duas formas → de três em três → padrões com pares (AAB) → o que falta no meio |
| 12 | Puzzle de Encaixe | 4 peças → 6 → 9 → 9 sem guia → 12 |
| 13 | Aponta o Objeto | 2 imagens → 4 → 6 → adivinhas ("o que usamos para beber?") → dois de seguida |
| 14 | Imagem e Palavra | 2 palavras → 3 → palavras parecidas (GATO/PATO/RATO) → 4 → 5 |
| 15 | Histórias Interativas | cinco histórias, cada vez mais compridas: o coelho, o peixe, a estrela que caiu, o cão e a bola, a festa na quinta |
| 16 | Conta e Agrupa | até 3 → até 5 → até 7 → dois cestos ao mesmo tempo → só o tipo de fruta pedido |
| 17 | Maior ou Menor | tamanhos → quantidades → tamanhos parecidos → entre três → números |
| 18 | Somas com Imagens | somas até 3 → até 5 → até 8 → tirar → somar e tirar, com a conta escrita |
| 19 | Veste o Boneco | chapéu, camisa e sapatos → com calças → muita roupa → para a praia → para a neve (com peças erradas à mistura) |
| 20 | Liga os Pontos | 3–4 pontos → até 7 → 10 → 12 → 15, com figuras diferentes em cada fase |
| 21 | Labirinto | caminho direito → uma curva → aos esses → ziguezague → caracol. O caminho estreita e muda quem leva o quê (o rato ao queijo, a abelha à flor…) |
| 22 | Sequência do Dia | 3 passos → de manhã → à noite → como cresce uma flor → o dia inteiro |
| 23 | Veste-te para o Tempo | 2 opções → 3 → 4 → escolhe duas coisas → escolhe três |
| 24 | Instrumentos | tambor e sino → percussão → xilofone → piano → tocar uma canção a seguir as luzes |
| 25 | Repete a Sequência | 2 sons → 3 → sequências de 3 → 4 sons → só de ouvido (os botões não acendem) |

Nas fases de exploração livre (animais, instrumentos) não há resposta
certa nem errada: a fase acaba quando a criança experimentou tudo.

## Primeiro arranque

Em cada sessão nova a app abre num ecrã de boas-vindas que cumprimenta
consoante a hora local (bom dia / boa tarde / boa noite) e pede o nome da
criança. O nome fica guardado neste browser, por isso das próximas vezes já
aparece escrito — basta tocar no botão para entrar. Pode ser mudado a
qualquer momento na área dos pais.

## Princípios de desenho para esta idade

Ficaram no código, não só no papel:

- **Sem leitura obrigatória** — toda a navegação é visual e sonora; cada
  instrução é também dita em voz alta.
- **A instrução repete-se** ao fim de 8 segundos parados, e o contador
  reinicia a cada toque: quem está a jogar nunca ouve a app a falar por
  cima de si, e quem ficou baralhado volta a ouvir o que fazer.
- **Sem cronómetros** e sem pressão de tempo em nenhum jogo.
- **Errar não penaliza** — nunca há um "X" vermelho: a peça abana, a mascote
  diz "tenta outra vez" e o som repete-se. Não se perdem pontos nem vidas.
- **Alvos de toque grandes**, no mínimo ~64 px, e tolerâncias generosas no
  arrasto e no traçado.
- **Recompensas não competitivas** — estrelas e autocolantes, sem
  classificações nem comparação com outras crianças.
- **Sugestão de pausa** ao fim de 15 minutos de sessão (desligável).
- **Portão parental** (uma soma simples) à entrada da área dos pais.

## Arquitectura

JavaScript simples, sem framework nem passo de build. Scripts clássicos com um
único namespace global `MC`, para que a app corra tal e qual a partir do disco.

```
assets/js/core/
  util.js     helpers de DOM, listas, temporizadores canceláveis
  i18n.js     todos os textos da app, num sítio só
  store.js    definições e progresso em localStorage
  audio.js    som sintetizado (Web Audio) + voz (SpeechSynthesis)
  art.js      biblioteca de desenhos SVG inline (grelha 64 para os desenhos)
  islands.js  as nove silhuetas de ilha do ecrã inicial
  data.js     letras, números, animais, objetos, histórias, desenhos...
  ui.js       casca dos ecrãs, mascote, confetti, modais, recompensas
  drag.js     arrastar/largar e traçado com o dedo (Pointer Events)
  router.js   encaminhador por hash
assets/js/games/    um ficheiro por ilha, 25 jogos registados em MC.registerGame
assets/js/app.js    ecrã inicial, ilhas, autocolantes e área dos pais
```

Para acrescentar um jogo novo basta chamar `MC.registerGame({...})` num
ficheiro de `assets/js/games/` e juntá-lo à lista de `<script>` do
`index.html` — ele aparece sozinho na ilha respectiva.

### A voz

A narração usa a síntese de fala do próprio aparelho, e **a qualidade
depende quase toda das vozes que o aparelho tem instaladas**. As vozes
antigas do Windows (por exemplo a "Helia") soam robóticas por mais que se
afinem; as vozes neurais soam praticamente humanas. Por isso a app:

- **escolhe sozinha a voz mais natural** disponível em português, dando
  preferência às vozes "Natural", "Neural", "Melhorada" ou "Premium";
- fala **no tom natural da voz** (subir o tom, como antes, deixava-a mais
  metálica) e só **um pouco mais devagar** do que o normal;
- diz o **nome** das letras ("bê", "agá", "érre") em vez de as ler soltas,
  que os motores costumam pronunciar mal;
- tem **várias maneiras de dizer cada coisa** e nunca repete a mesma frase
  duas vezes seguidas, para não soar a gravador;
- deixa os pais **escolher a voz** e ouvi-la na área dos pais, e avisa
  quando o aparelho só tem vozes antigas.

**Onde soa melhor:** no Microsoft Edge (Windows, Mac ou Android), que traz
vozes portuguesas "Natural" como a Raquel ou o Duarte; num iPhone ou iPad
com uma voz "Melhorada" instalada em Definições → Acessibilidade → Conteúdo
falado → Vozes → Português (Portugal). No Chrome, em Windows, só há a voz
antiga do sistema.

Uma voz humana gravada continua a ser o passo seguinte que mais melhoraria
a experiência — todos os pontos onde a app fala passam por `MC.audio.speak()`.

### Som sem ficheiros de áudio

Todos os sons são gerados em tempo real com a Web Audio API e as vozes vêm da
síntese de fala do sistema operativo. A app não carrega um único ficheiro de
áudio: pesa pouco e funciona offline de imediato.

## O que ainda vale a pena melhorar

Honestamente, e por ordem de importância:

1. **Vozes gravadas.** Ver a secção sobre a voz, acima: é o que mais mudaria a experiência.
2. **Sons de animais reais.** Os actuais são aproximações sintetizadas e
   ouvem-se como tal. São substituíveis um a um em `ANIMAL`, dentro de
   `assets/js/core/audio.js`.
3. **Teste com crianças reais.** Nenhuma decisão de interface aqui foi
   validada com uma criança de 3 anos. É a fase que falta e a que mais vai
   mudar o produto.
4. **Perfis múltiplos.** Hoje há um único perfil por aparelho.
5. **Acessibilidade por teclado nos jogos de arrasto.** Os jogos de toque e
   escolha já respondem ao teclado; os de arrastar, não.

## Publicar

A app é estática: serve a pasta em qualquer alojamento (GitHub Pages, Netlify,
Vercel, Cloudflare Pages). Como é PWA, os pais podem instalá-la a partir do
browser sem passar pelas lojas. Para empacotar para App Store / Play Store,
o caminho natural é o Capacitor por cima desta mesma pasta.

**Ao publicar alterações**, sobe o `VERSION` em `sw.js` para garantires que os
aparelhos já instalados descarregam a versão nova.

## A pasta `design/`

Os 27 ficheiros HTML originais do Design Canvas continuam lá, intactos, como
referência visual — `design/index-mockups.html` serve de índice. São mockups
estáticos: as cores, tipos de letra e animações da app vieram todos deles.
