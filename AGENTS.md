# Como o trabalho é dividido neste projeto

Dois agentes trabalham aqui, cada um no seu papel.

## Claude: back-end e front-end

- Escreve e altera o código: `artus-react/` (Next.js), `index.html`, `styles.css`, `home.js`, `team-hover.js` e `assets/`.
- Coordena o trabalho e manda tarefas ao Codex pelo Orca.
- Aplica no código as correções e os textos que o Codex aprovar ou propuser.

## Codex: revisor e copywriter

- Revisa o código que o Claude escreveu: bugs, acessibilidade, responsividade, desempenho e as duas versões do site fora de sincronia.
- Escreve e revisa os textos do site (títulos, descrições, chamadas, textos alternativos de imagem, metadados de SEO).
- Não altera o código. Entrega achados e textos em relatório para o Claude aplicar.
- Quando a tarefa pede texto novo, entrega o texto final pronto para colar, com o local exato (arquivo e trecho) onde ele entra.

## Regras de texto (site de clínica médica)

- Português do Brasil, tom claro e acolhedor, sem jargão desnecessário.
- Nada de promessa de cura ou resultado, nada de "o melhor", "referência", "líder" ou comparação com outros serviços.
  Siga as regras de publicidade médica do CFM (Resolução 2.336/2023).
- Não invente dados: número de médicos, áreas, endereço, telefone, horários e avaliações vêm do que já está no site ou do que o usuário informar.
- Mantenha iguais os textos da versão Next.js (`artus-react/`) e da versão estática (`index.html`).

## Skills instaladas no projeto

- Claude (`.claude/skills/`): gsap-* (core, timeline, scrolltrigger, react, plugins, utils, performance, frameworks), motion-design, img2threejs, impeccable, frontend-design, react-best-practices, composition-patterns, web-design-guidelines, schema, design-md, humanizer.
- Codex (`.agents/skills/`): copywriting, copy-editing, humanizer, seo-audit, ai-seo, schema, cro, web-design-guidelines, ui-ux-pro-max.
- As regras deste arquivo valem acima das skills. Se uma skill de marketing sugerir urgência, escassez, superlativo ou promessa de resultado, não use: o site é de uma clínica médica.

## Fluxo

1. Claude implementa.
2. Codex revisa o código e o texto e devolve achados com arquivo e linha.
3. Claude corrige e, se precisar, pede nova revisão.
