# 📚 DOCUMENTAÇÃO — MediaQueries.lab

> Demonstração de página única sobre **Media Queries e Design Responsivo**,
> com botão para ligar/desligar o CSS responsivo em tempo real.

|                    |                                                                              |
| ------------------ | ---------------------------------------------------------------------------- |
| **Arquivos**       | `index.html`, `styles.css`, `script.js` (+ `README.md` resumido)             |
| **Tecnologias**    | HTML5 semântico, CSS3 (Grid, Flexbox, custom properties), JavaScript vanilla |
| **Dependências**   | Nenhuma (apenas fontes do Google Fonts, com fallback do sistema)             |
| **Público**        | Turma de faculdade — nenhum conhecimento prévio é exigido                    |
| **Licença de uso** | Livre para uso acadêmico                                                     |

---

## Índice

1. [Objetivo didático](#1-objetivo-didático)
2. [Como executar](#2-como-executar)
3. [Estrutura do projeto](#3-estrutura-do-projeto)
4. [Arquitetura e fluxo da aplicação](#4-arquitetura-e-fluxo-da-aplicação)
5. [Documentação do `index.html`](#5-documentação-do-indexhtml)
6. [Documentação do `styles.css`](#6-documentação-do-stylescss)
7. [Documentação do `script.js`](#7-documentação-do-scriptjs)
8. [Contrato de estado (o que muda no DOM)](#8-contrato-de-estado-o-que-muda-no-dom)
9. [Acessibilidade](#9-acessibilidade)
10. [Compatibilidade com navegadores](#10-compatibilidade-com-navegadores)
11. [Checklist de testes](#11-checklist-de-testes)
12. [Guia de personalização](#12-guia-de-personalização)
13. [Decisões de projeto (por quê)](#13-decisões-de-projeto-por-quê)
14. [Limitações e melhorias futuras](#14-limitações-e-melhorias-futuras)
15. [FAQ da aula](#15-faq-da-aula)

---

## 1. Objetivo didático

Mostrar, de forma **visível e reversível**, o que as media queries fazem:

- **Com responsividade ligada** → o celular recebe o layout de 1 coluna, header
  empilhado e fontes menores.
- **Com responsividade desligada** → o celular continua recebendo o **layout desktop**
  (4 colunas, fontes grandes, margens largas) e a página **transborda**
  (scroll horizontal), evidenciando o problema que o `@media` resolve.

> **Ideia central:** o layout base (desktop) é escrito **fora** de qualquer media
> query, e as media queries ficam **condicionadas a uma classe no `<body>`**.
> O botão apenas liga e desliga essa classe.

---

## 2. Como executar

**Opção A — direto:** abra o `index.html` no navegador (duplo clique).

**Opção B — servidor local** (recomendado, evita bloqueio de recursos):

```bash
npx serve .            # ou
python -m http.server 8000
# depois acesse http://localhost:8000
```

**Para a aula projetada / celular:**

1. Rode o servidor na sua máquina e descubra o IP local (`ipconfig` no Windows).
2. Compartilhe a mesma rede Wi-Fi com a turma e abra `http://SEU_IP:8000` no celular.
3. O pill verde no topo mostra a **largura da viewport ao vivo**, útil para comentar.

> O estado **não** é salvo em `localStorage` de propósito: a cada atualização a
> página volta ao modo responsivo, o que facilita demonstrar repetidamente.

---

## 3. Estrutura do projeto

```
jquery/
├── index.html        # estrutura e conteúdo (página única)
├── styles.css        # visual + layout base + media queries
├── script.js         # botão de toggle (liga/desliga a classe)
└── README.md   # este arquivo
```

Não há etapa de build, transpiler ou bundler: os arquivos são abertos como estão.

---

## 4. Arquitetura e fluxo da aplicação

### 4.1 Estados possíveis

```
   ┌──────────────────────────────────────────────────────┐
   │  ESTADO 1 — RESPONSIVO LIGADO (padrão)               │
   │  <body class="responsive-active">                    │
   │  • media queries (max-width) VALEM                   │
   │  • 390px → 1 coluna, header empilhado, fontes menores│
   └───────────────────────┬──────────────────────────────┘
                           │  clique no botão flutuante
                           │  body.classList.toggle("responsive-active")
                           ▼
   ┌──────────────────────────────────────────────────────┐
   │  ESTADO 2 — RESPONSIVO DESLIGADO                     │
   │  <body> (sem a classe)                               │
   │  • NENHUMA media query vale                          │
   │  • o layout desktop base é aplicado em qualquer      │
   │    largura → em 390px a página transborda e “quebra”  │
   └───────────────────────┬──────────────────────────────┘
                           │  clique novamente (volta a classe)
                           ▼
                        ESTADO 1
```

### 4.2 Por que funciona

A regra responsiva tem **maior especificidade** que a regra base:

| Regra                                                              | Especificidade | Quando vale                                                    |
| ------------------------------------------------------------------ | -------------- | -------------------------------------------------------------- |
| `.card-grid { grid-template-columns: repeat(4,1fr) }`              | `(0,1,0)`      | sempre (base desktop)                                          |
| `body.responsive-active .card-grid { grid-template-columns: 1fr }` | `(0,2,1)`      | só dentro de `@media (max-width:…)` **e** com a classe no body |

Como `(0,2,1) > (0,1,0)`, a versão responsiva vence **sem `!important`**.

### 4.3 Divisão de responsabilidades

| Arquivo      | Responsabilidade                                         | Não faz                    |
| ------------ | -------------------------------------------------------- | -------------------------- |
| `index.html` | conteúdo, semântica, IDs usados pelo JS                  | —                          |
| `styles.css` | todo o visual **e** o estado visual (via `[data-state]`) | —                          |
| `script.js`  | alternar classes/atributos e ler `innerWidth`            | não escreve estilos inline |

---

## 5. Documentação do `index.html`

### 5.1 Mapa de seções

| Seção          | `id`                | Classes principais                         | Conteúdo                                   |
| -------------- | ------------------- | ------------------------------------------ | ------------------------------------------ |
| Cabeçalho      | —                   | `.site-header > .nav-bar.glass`            | marca, menu, pill de estado                |
| Hero           | `inicio` (`<main>`) | `.hero`                                    | título, subtítulo, chips, dica de uso      |
| Aviso          | —                   | `.notice` (`hidden` inicialmente)          | alerta quando o responsivo está desligado  |
| 01 · Conceito  | `sobre`             | `.info-grid` → `.info-card` + `.code-card` | texto, analogia, tabela, código + tradução |
| 02 · Glossário | `glossario`         | `.glossary-grid` → `.term`                 | 12 termos com definição + analogia         |
| 03 · Cards     | `cards`             | `.card-grid` → `.card`                     | 4 cards de conteúdo simulado               |
| 04 · Prática   | `teste`             | `.steps` → `.step`                         | 4 passos da demonstração                   |
| Rodapé         | —                   | `.footer-inner.glass`                      | crédito + dica                             |
| Botão          | —                   | `#toggleBtn.toggle-btn`                    | controle do modo responsivo                |

### 5.2 Contrato com o JavaScript (IDs)

Estes IDs **precisam existir** — `init()` aborta se algum faltar:

| ID            | Elemento   | Papel                            |
| ------------- | ---------- | -------------------------------- |
| `toggleBtn`   | `<button>` | recebe o `click` do toggle       |
| `btnLabel`    | `<span>`   | texto do botão                   |
| `statusPill`  | `<span>`   | pill verde/vermelho do cabeçalho |
| `statusText`  | `<span>`   | texto do pill                    |
| `statusWidth` | `<span>`   | largura atual (`"390px"`)        |
| `notice`      | `<div>`    | aviso de modo desktop forçado    |

### 5.3 Atributos relevantes

- `<body class="responsive-active">` — classe inicial que ativa o modo responsivo.
- `<button aria-pressed="true" data-state="on">` — estado inicial do controle.
- `<div class="notice" hidden>` — oculto por padrão (mostrado só no modo DESLIGADO).
- `role="status"` no pill e no aviso → anúncio automático a leitores de tela.
- `aria-hidden="true"` em ícones, orbs decorativas e na janela do cartão de código.
- `viewport` meta: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  (indispensável para as media queries fazerem sentido no celular).
- `<script src="script.js" defer>` — o script só roda com o DOM pronto.

### 5.4 Camada didática presente na página

- Caixa **💡 Analogia** (`.analogy`) — `@media` como “SE… ENTÃO”.
- **Tradução linha a linha** (`.legend`) — leitura do código em português.
- **Dica de uso** (`.hero-hint`) — chama a atenção para o botão.
- **Glossário** com 12 termos e analogias do dia a dia.
- Textos dos cards e passos escritos em linguagem simples.

---

## 6. Documentação do `styles.css`

O arquivo está organizado em **5 blocos numerados** no cabeçalho de cada um:

| Bloco | Linhas (aprox.) | Conteúdo                                                |
| ----- | --------------- | ------------------------------------------------------- |
| 1     | 18–221          | Tokens (`:root`), reset, utilitários e fundo decorativo |
| 2     | 222–869         | **Layout base (desktop)** — fora de media queries       |
| 3     | 870–986         | Estados do toggle (botão, pill, aviso, flash)           |
| 4     | 987–1324        | **Media queries** — todas sob `body.responsive-active`  |
| 5     | 1325–1343       | Acessibilidade (`prefers-reduced-motion`)               |

> `styles.css` tem **1343 linhas** no total; o cabeçalho (linhas 1–17) explica a
> estratégia do arquivo e lista esses 5 blocos.

### 6.1 Tokens (`:root`)

| Token                              | Valor                               | Para quê                                                |
| ---------------------------------- | ----------------------------------- | ------------------------------------------------------- |
| `--bg-0`                           | `#0b1020`                           | cor de base do fundo                                    |
| `--text` / `--text-muted`          | `#eef1ff` / `rgba(238,241,255,.72)` | texto e texto secundário                                |
| `--accent-violet/cyan/pink`        | `#8b5cf6` `#22d3ee` `#f472b6`       | gradiente e destaques                                   |
| `--glass-bg` / `--glass-bg-strong` | `rgba(255,255,255,.07)` / `.10`     | fundo dos painéis de vidro                              |
| `--glass-border`                   | `rgba(255,255,255,.14)`             | borda sutil do vidro                                    |
| `--glass-blur`                     | `18px`                              | intensidade do desfoque                                 |
| `--radius-lg` / `--radius-md`      | `26px` / `18px`                     | arredondamentos                                         |
| `--container`                      | `1200px`                            | largura máxima do conteúdo                              |
| `--pad-x`                          | `32px`                              | margem lateral (**reescrita** dentro das media queries) |

### 6.2 Utilitários

| Classe           | Papel                                                                       |
| ---------------- | --------------------------------------------------------------------------- |
| `.container`     | centraliza o conteúdo (`max-width`) e aplica `padding-inline: var(--pad-x)` |
| `.glass`         | superfície translúcida + `backdrop-filter` + borda clara + sombra interna   |
| `.eyebrow`       | rótulo numerado acima dos títulos (`01 · Conceito`)                         |
| `.gradient-text` | texto com gradiente (`background-clip: text`)                               |

### 6.3 Componentes

| Classe                                                           | Papel                                       |
| ---------------------------------------------------------------- | ------------------------------------------- |
| `.bg-orbs`, `.orb--violet/cyan/pink`                             | orbes coloridas desfocadas no fundo (fixas) |
| `.nav-bar`, `.brand`, `.nav-links`                               | cabeçalho em “pílula” de vidro              |
| `.status-pill[data-state]`                                       | indicador de estado + largura da viewport   |
| `.hero`, `.lead`, `.chips`                                       | abertura da página                          |
| `.hero-hint`                                                     | dica de uso do botão (**bloco**, não flex)  |
| `.section`, `.section-head`, `.section-title`, `.section-sub`    | padrão dos títulos de seção                 |
| `.info-grid`                                                     | grid 2 colunas (texto + código)             |
| `.info-card`, `.def-list`, `.def-item`, `.info-note`             | explicação do `@media`                      |
| `.code-card`, `.code-head`, `.c-*`                               | cartão de código com destaque de sintaxe    |
| `.legend`                                                        | tradução linha a linha (usa contador CSS)   |
| `.analogy`                                                       | caixa de analogia didática                  |
| `.glossary-grid`, `.term`, `.term-aka`, `.term-def`, `.term-tip` | glossário                                   |
| `.card-grid`, `.card`, `.card-icon`, `.card-tag`                 | grade de 4 cards                            |
| `.steps`, `.step`, `.step-num`                                   | 4 passos numerados                          |
| `.toggle-btn[data-state]`, `.btn-icon`                           | botão flutuante fixo                        |
| `.notice[hidden]`, `.notice-icon`                                | aviso de modo desligado                     |
| `.site-footer`, `.footer-inner`                                  | rodapé                                      |

### 6.4 Breakpoints

| Media query                      | O que adapta                                                                                                                      |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `max-width: 1024px`              | `--pad-x: 26px`; cards 4→2; **glossário 3→2**; **passos 4→2**; títulos menores                                                    |
| `max-width: 860px`               | `.info-grid` 2→1 coluna                                                                                                           |
| `max-width: 768px`               | header empilhado; **cards/glossário/passos → 1 coluna**; fontes e margens menores; botão compacto; `.legend`/`.analogy` reduzidos |
| `max-width: 480px`               | `--pad-x: 16px`; ajuste fino de tipografia; pill esconde a largura; **botão em largura total**                                    |
| `prefers-reduced-motion: reduce` | desliga animações (**fora** da classe, por ser acessibilidade)                                                                    |

> **Todas as 4 media queries de layout** têm suas regras escritas como
> `body.responsive-active <seletor> { … }` — verificado por script.
> No total são 69 seletores condicionados.

### 6.5 Convenções e armadilhas evitadas

- **Nenhum `!important` nas regras de layout** — a especificidade cuida da ordem.
  Os únicos `!important` do arquivo estão no bloco 5 (`prefers-reduced-motion`),
  onde forçar a parada das animações é necessário por acessibilidade.
- **`padding-block` em vez de `padding`** em `.hero` e `.section`: como essas
  classes são combinadas com `.container` (`padding-inline`), um shorthand
  `padding: 72px 0` zeraria a margem lateral.
- **Estado visual por atributo**, não por classe: `.toggle-btn[data-state="off"]`
  e `.status-pill[data-state="off"]` são alterados pelo JS.
- **`overflow-x: auto`** no `<pre>` e no `.legend code` — linhas longas rolam
  dentro do cartão em vez de estourar a página.
- **Nomes** em kebab-case com modificadores (`orb--cyan`, `code-dot--red`).

---

## 7. Documentação do `script.js`

Módulo autocontido (IIFE com `"use strict"`), sem dependências e sem efeitos globais.

### 7.1 Constantes

| Nome         | Valor                        | Papel                                 |
| ------------ | ---------------------------- | ------------------------------------- |
| `CLASS_NAME` | `"responsive-active"`        | única classe manipulada no `<body>`   |
| `LABELS.on`  | `"Desativar Responsividade"` | texto quando o responsivo está ligado |
| `LABELS.off` | `"Ativar Responsividade"`    | texto quando está desligado           |

### 7.2 Funções

| Função                   | O que faz                                                                    |
| ------------------------ | ---------------------------------------------------------------------------- |
| `init()`                 | captura os elementos, valida presença, registra os eventos e faz o 1º render |
| `render(isActive)`       | sincroniza **todo** o DOM com o estado (botão, pill, aviso)                  |
| `toggleResponsiveness()` | `classList.toggle(CLASS_NAME)` → `render()` → flash de 500 ms                |
| `updateViewportWidth()`  | grava `Math.round(innerWidth) + "px"` no pill                                |
| `scheduleWidthUpdate()`  | gatilho no `resize` com **throttle de `requestAnimationFrame`**              |

### 7.3 Eventos

| Evento                      | Alvo         | Tratador                                      |
| --------------------------- | ------------ | --------------------------------------------- |
| `click`                     | `#toggleBtn` | `toggleResponsiveness`                        |
| `resize` (`{passive:true}`) | `window`     | `scheduleWidthUpdate`                         |
| `DOMContentLoaded`          | `document`   | `init` (guarda caso o script não use `defer`) |

### 7.4 Fluxo de um clique

1. `classList.toggle()` alterna a classe e **devolve o novo estado** (`true`/`false`).
2. `render()` atualiza `data-state`, `aria-pressed`, textos e `notice.hidden`.
3. `just-toggled` é adicionada ao `<body>` e removida após 500 ms (flash no `<main>`).
4. O CSS, sozinho, refaz o layout (nenhum estilo é calculado em JS).

### 7.5 Por que assim?

- **Estado no CSS, lógica no JS**: o JS nunca escreve `element.style.*`.
- **Um único ponto de verdade**: `render(isActive)` é chamado na inicialização e
  em cada clique — não há estado dessincronizado.
- **Guardas de segurança**: se um ID sumir do HTML, `init()` simplesmente não prossegue.
- **Sem `localStorage`**: cada carregamento começa responsivo (melhor para demonstrar).

---

## 8. Contrato de estado (o que muda no DOM)

| Propriedade                | LIGADO (padrão)          | DESLIGADO                            |
| -------------------------- | ------------------------ | ------------------------------------ |
| `body.className`           | `responsive-active`      | _(vazio; `just-toggled` por 500 ms)_ |
| `#toggleBtn[aria-pressed]` | `"true"`                 | `"false"`                            |
| `#toggleBtn[data-state]`   | `on`                     | `off`                                |
| `#btnLabel.textContent`    | Desativar Responsividade | Ativar Responsividade                |
| `#statusPill[data-state]`  | `on` (verde)             | `off` (vermelho)                     |
| `#statusText.textContent`  | Responsividade ativa     | Responsividade desativada            |
| `#notice.hidden`           | `true`                   | `false`                              |
| `.card-grid` @390px        | 1 coluna                 | 4 colunas espremidas                 |
| overflow horizontal @390px | não                      | **sim**                              |

---

## 9. Acessibilidade

| Recurso                                                        | Onde                           |
| -------------------------------------------------------------- | ------------------------------ |
| Controle real de `<button>` (Tab + Enter/Espaço)               | botão flutuante                |
| `aria-pressed` refletindo o estado                             | `#toggleBtn`                   |
| `role="status"` (anúncio silencioso)                           | pill e aviso                   |
| Foco visível (`:focus-visible` com contorno 3px)               | global                         |
| Contraste alto de texto sobre fundo escuro                     | variáveis `--text*`            |
| `prefers-reduced-motion` desliga animações                     | bloco 5 do CSS                 |
| Áreas de toque ≥ 44px                                          | botão (≈ 52px), links do menu  |
| Semântica (`header`, `main`, `nav`, `section`, `footer`, `ol`) | HTML                           |
| Decorativos com `aria-hidden`                                  | orbs, ícones, janela do código |
| `<noscript>` esconde o botão e explica                         | HTML                           |

---

## 10. Compatibilidade com navegadores

| Recurso                              | Navegadores                       | Observação                                                                                  |
| ------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------- |
| CSS Grid / Flexbox                   | todos atuais                      | base do layout                                                                              |
| `backdrop-filter`                    | Chrome, Edge, Firefox, Safari 18+ | prefixo `-webkit-` incluído; sem suporte, o vidro vira apenas o fundo translúcido (legível) |
| Custom properties                    | todos atuais                      | tokens                                                                                      |
| `:focus-visible`                     | todos atuais                      | aprimoramento progressivo                                                                   |
| `text-wrap: balance`                 | Chrome/Edge recentes              | ignorado onde não suportado                                                                 |
| Contadores CSS (`counter-increment`) | todos                             | números da `.legend`                                                                        |
| Google Fonts                         | precisa de internet               | fallback `system-ui` mantém o layout                                                        |

---

## 11. Checklist de testes

### 11.1 Manual (recomendado para a aula)

- [ ] Desktop (≥ 1025px): 4 colunas de cards, 3 de glossário, 4 de passos.
- [ ] Desktop: clicar no botão **não altera o layout** (só cores/texto do controle) — comportamento esperado, pois as media queries não casam.
- [ ] Celular (≤ 768px): tudo em 1 coluna, header empilhado, **sem barra de rolagem lateral**.
- [ ] Celular: clicar → aviso aparece, botão fica laranja, texto estoura e surge **rolagem horizontal**.
- [ ] Clicar de novo → layout volta ao normal e o aviso some.
- [ ] DevTools → _Device toolbar_: repetir os passos redimensionando a janela.
- [ ] Pill do cabeçalho mostra a largura correta ao redimensionar.
- [ ] Navegar por `Tab`: foco visível em todos os elementos interativos.
- [ ] Ativar “reduzir movimento” no sistema: animações param.

---

## 12. Guia de personalização

### 12.1 Trocar as cores

Edite os tokens no topo de `styles.css`:

```css
:root {
  --accent-violet: #8b5cf6; /* roxo */
  --accent-cyan: #22d3ee; /* ciano */
  --accent-pink: #f472b6; /* rosa */
}
```

### 12.2 Alterar um breakpoint

Localize **todos** os blocos daquele valor e edita-os em conjunto
(padrão, tablet, celular e celular pequeno):

```css
@media (max-width: 768px) {
  /* ← valor do breakpoint */
  body.responsive-active .card-grid {
    /* ← classe obrigatória */
    grid-template-columns: 1fr;
  }
}
```

### 12.3 Adicionar um novo breakpoint

1. Crie o bloco `@media (max-width: XXXpx) { … }` **dentro do bloco 4**.
2. Préfixe **todas** as regras com `body.responsive-active`.
3. Comece pelas propriedades “de quebra”: `grid-template-columns`, `font-size`,
   `padding`, `gap` e `flex-direction`.
4. Rode o checklist da seção 11 nos dois estados (ligado/desligado).

### 12.4 Inverter para _mobile first_ (versão “de produção”)

Para um site real, o recomendado é o contrário: base mínima sem media query e
crescimento com `min-width`. Basta trocar os seletores condicionais:

```css
/* base: celular */
.card-grid {
  grid-template-columns: 1fr;
}

/* cresce no desktop */
@media (min-width: 769px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

Nesse modelo o botão perde o sentido (não há “modo quebrado” a desligar).

---

## 13. Decisões de projeto (por quê)

| Decisão                                 | Motivo                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------- |
| Base desktop **fora** das media queries | é o que permite “quebrar” a página ao remover a classe                 |
| Condição em `body.responsive-active`    | único interruptor; especificidade suficiente sem `!important`          |
| Usar `max-width` (e não `min-width`)    | necessário para que o layout desktop seja o _default_ fora das queries |
| JS só alterna classes                   | separação de responsabilidades; facilita depurar no DevTools           |
| Sem framework/library                   | o foco da aula é CSS; zero dependências                                |
| Pill com largura ao vivo                | material de apoio para o professor comentar na projeção                |
| Glossário + analogias na página         | a turma acompanha sem glossário externo                                |
| `localStorage` desligado                | toda demonstração começa do mesmo ponto                                |
| Orbs fixas com `z-index: 0`             | fundo rico sem poluir o fluxo do conteúdo                              |

---

## 14. Limitações e melhorias futuras

**Limitações conhecidas**

- O layout base usa medidas fixas (px) — intencional, para a quebra ser evidente.
- A rolagem horizontal no modo desligado é esperada (faz parte da demonstração).
- As fontes dependem da internet; offline, cai no `system-ui`.
- Não há testes automatizados formais (o checklist da §11 cobre o essencial).

**Melhorias possíveis**

1. `localStorage` opcional para lembrar a preferência.
2. Atalho de teclado (ex.: `R`) para alternar o modo.
3. Modo “grayscale” simulando deficiência visual.
4. Exportar o CSS gerado para um slide da aula.
5. Versão com `min-width` (mobile first) lado a lado, para comparar estratégias.

---

## 15. FAQ da aula

**Por que a página quebra quando eu desligo?**
Porque o navegador continua recebendo as regras desktop (4 colunas, fontes de 54px,
margens de 32px) e tenta desenhar tudo numa tela de 390px. O conteúdo não cabe →
transborda → aparece rolagem horizontal.

**Por que não usar `!important` na regra responsiva?**
Porque `body.responsive-active .card-grid` já tem especificidade maior que
`.card-grid`. `!important` é um remendo que dificulta a manutenção.

**Por que a classe está no `<body>` e não em um `<html>` ou `<div>`?**
O `<body>` é o “corpo da página”: colocar a condição lá deixa explícito que o
estado vale para o documento inteiro e fica fácil de ver no DevTools.

**No desktop o botão não muda nada — é bug?**
Não. Abaixo de 1024px nenhuma media query casava antes, e continua não casando;
o toggle só tem efeito visual em telas pequenas. Isso reforça que a media query é
uma **condição de largura**, não um interruptor de “visual bonito”.

**Posso ver isso sem celular?**
Sim. Abra o DevTools (F12) → ícone de dispositivo (`Ctrl+Shift+M`) → redimensione
para 390px e use o botão da página.

**Isso é usado em sites reais?**
O mecanismo de “classe condicionando media query” é didático (usado em temas,
ex.: dark mode ou modo compacto). Em produção, o padrão é _mobile first_ com
`min-width` (ver §12.6).

**Por que sem framework (Bootstrap/Tailwind)?**
Para isolar o conceito: com uma linha de CSS a mais ou a menos, a turma enxerga
exatamente o que faz a diferença.

---
