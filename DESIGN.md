---
name: Clínica Artus — Anatomia em traço
colors:
  primary: "#123e48"
  ink: "#142a2f"
  petrol: "#123e48"
  petrol-deep: "#102e35"
  accent: "#076f7c"
  accent-hover: "#055560"
  glow: "#16818a"
  muted: "#4c6265"
  line: "#dce5e5"
  wash: "#eef4f4"
  white: "#ffffff"
  on-dark: "#e1f0f0"
  on-dark-muted: "#c6d9da"
  focus-on-light: "#0e8492"
  focus-on-dark: "#a9e5eb"
typography:
  display:
    fontFamily: Figtree
    fontSize: 5.5rem
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: -0.035em
  h2:
    fontFamily: Figtree
    fontSize: 3.25rem
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.03em
  h3:
    fontFamily: Figtree
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: Instrument Sans
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: Instrument Sans
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Instrument Sans
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.3
rounded:
  sm: 6px
  md: 8px
  pill: 999px
spacing:
  page: 1152px
  gutter: 32px
  section: clamp(4.2rem, 8vw, 7.5rem)
  touch-target: 44px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    typography: "{typography.label}"
    height: 46px
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  contact-card:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.white}"
  line-drawing:
    textColor: "{colors.accent}"
    size: 1.25px
  page-text:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  supporting-text:
    textColor: "{colors.muted}"
    typography: "{typography.body-small}"
  section-wash:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
  footer:
    backgroundColor: "{colors.petrol-deep}"
    textColor: "{colors.on-dark-muted}"
  heading:
    textColor: "{colors.ink}"
    typography: "{typography.h2}"
---

## Overview

A Clínica Artus é uma clínica de ortopedia em Cuiabá com sete médicos em seis áreas. O site precisa passar calma, competência e proximidade, sem soar como propaganda. A direção visual se chama **Anatomia em traço**: um traço fino verde-azulado, herdado dos arcos da logo, desenha mão, joelho, quadril, coluna, ombro e pé. Ele é a assinatura do site. O resto fica quieto: fotos reais da clínica, muito respiro, petróleo e off-white.

A regra de ouro é gastar a ousadia num ponto só. O traço e a abertura com a logo 3D são os momentos memoráveis; todo o resto é sóbrio e funcional.

## Colors

- **Petróleo (#123e48)** é a cor da marca: hero, cartão de contato, abertura em vídeo. Sem brilho radial no cartão de contato: petróleo liso.
- **Petróleo profundo (#102e35)** é o rodapé.
- **Verde-azulado (#076f7c)** é a única cor de ação: botões, links, traços anatômicos. Hover em #055560.
- **Tinta (#142a2f)** para títulos e texto; **cinza (#4c6265)** para texto de apoio, nunca abaixo de 0,875rem.
- **Lavado (#eef4f4)** é o fundo de seções alternadas e dos quadros de ícone.
- O brilho #16818a existe só na abertura em vídeo; não usar em cartões.
- Todo texto passa WCAG 2.2 AA (4,5:1; texto grande 3:1). Legendas sobre foto ganham fundo próprio.

## Typography

- **Títulos:** Figtree 600, com espaçamento negativo leve. Os tamanhos dos tokens são o máximo no computador; no site eles escalam com clamp: H1 clamp(2.75rem, 6vw, 5.5rem), H2 clamp(2rem, 3.8vw, 3.25rem), H3 clamp(1.25rem, 2vw, 1.5rem).
- **Texto:** Instrument Sans 400 a 17px, entrelinha 1,6, pensando no público mais velho.
- **Rótulos e botões:** Instrument Sans 600 a 0,875rem ou mais.
- Nenhum texto abaixo de 0,875rem (14px). Títulos do rodapé no mínimo do tamanho do texto.
- Sem rótulos decorativos acima dos títulos ("A estrutura", "Equipe médica"): o título basta.

## Layout

- Página de 1152px com margens de 32px; seções com respiro de 4,2 a 7,5rem.
- No celular, alvos de toque de 44px no mínimo.
- Grades incompletas (como os 7 médicos) centralizam a última linha.

## Elevation & Depth

Profundidade vem da fotografia e do traço, não de sombras. Sombras só suaves e raras; nada de halos coloridos nem brilho radial em cartões.

## Shapes

Raio de 8px nos blocos e 6px nos botões; pílulas (999px) só para chips de região e etiquetas.

## Motion & Micro-interaction

- **Um momento orquestrado:** a abertura com a logo 3D (uma vez por sessão) se dissolve na entrada do hero.
- **O traço:** os desenhos anatômicos se desenham conforme a rolagem (stroke-dashoffset com ScrollTrigger, scrub), e os ícones de área se redesenham no hover (600ms, desaceleração).
- **Nada mais:** sem desfoque de revelação, sem "aparece e sobe" por seção. Transições de hover em até 200ms.
- Com `prefers-reduced-motion: reduce`, os desenhos aparecem prontos e nada se move.

## Voice & Content Strategy

- Português do Brasil, claro e acolhedor, sem jargão. Fala com o paciente pelo que ele sente ("Onde você sente?").
- Regras do CFM (Resolução 2.336/2023): sem promessa de resultado, sem superlativo, sem antes e depois.
- Ações com verbo e resultado: "Ligar para agendar", "Agendar com Dr. Fulano". No computador o número aparece no botão.
- Nomes dos médicos iguais em todo o site.
- Não inventar dados: horários, convênios, WhatsApp e CRM da clínica vêm do cliente.

## Components

- **Botão primário:** verde-azulado, texto branco, 46px de altura. No computador mostra o número: "Ligar (65) 3322-6689".
- **Chips de região (hero):** pílulas com borda clara sobre a foto, uma por área, levando ao perfil do especialista.
- **Ícone de área:** desenho em traço (assets/traco-*.svg; ombro e cotovelo usam o cotovelo) num quadro lavado, traço de 1,25px em verde-azulado.
- **Perfil de cuidado:** desenho anatômico visível ao lado do texto, índice fixo com os 7 médicos e o atual destacado, link "Agendar com…" no fim.
- **Cartão de contato:** petróleo liso com o símbolo da logo em traço, decorativo.

## Do's and Don'ts

- Faça: deixar o traço anatômico visível e bonito; usar fotos reais; manter o telefone sempre a um toque.
- Faça: manter as versões Next.js e estática idênticas.
- Não faça: halos, brilho radial, desfoques de revelação, cartões com faixa lateral colorida.
- Não faça: repetir o mesmo botão "Agendar consulta" sete vezes.
- Não faça: textos menores que 14px ou cinza claro sobre branco.
