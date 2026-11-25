// Gera a versão estática dos artigos a partir dos mesmos dados do Next (lib/artigos.ts):
// a seção "Artigos dos especialistas" do index.html (entre os marcadores <!-- ARTIGOS -->),
// artigos.html, artigo-<slug>.html e artigos.js na raiz do projeto.
// Uso, dentro de artus-react/:  node scripts/gerar-artigos.mjs
// Depois de mudar o rodapé, rode também scripts/gerar-paginas-legais.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AREAS_ARTIGOS, ARTIGOS_MAX_INICIAL, ARTIGOS_SOBRE, ARTIGOS_TITULO,
  artigos, autorDe, dataIso, dataLonga, mesCurto, nomeCurto, outrosArtigos, rotuloArea,
} from "../lib/artigos.ts";
import { MENSAGEM_PADRAO, linkWhatsApp } from "../lib/whatsapp.ts";
import { ICONE_TEL, NOVA_ABA, WA, documento, esc, escrever, ler } from "./gerar-paginas-legais.mjs";

const CR = String.fromCharCode(13);
const aqui = path.dirname(fileURLToPath(import.meta.url));
const icone = (corpo) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${corpo}</svg>`;
const ESQUERDA = icone('<path d="m15 18-6-6 6-6"/>');
const DIREITA = icone('<path d="m9 18 6-6-6-6"/>');
const semBarra = (src) => src.replace(/^\//, "");
const linkArtigo = (a) => `artigo-${a.slug}.html`;
const GERADOR = "gerar-artigos.mjs: edite os textos em artus-react/lib/artigos.ts";

/** Mesmo HTML de components/ui/article-card.tsx. */
function cartao(a, titulo = "h3", recuo = "          ", destaque = false) {
  const autor = autorDe(a);
  return `${recuo}<article class="artigo-card" data-area="${a.area}"${destaque ? " data-destaque" : ""}>
${recuo}  <div class="artigo-topo">
${recuo}    <span class="artigo-area">${esc(rotuloArea(a.area))}</span>
${recuo}    <time class="artigo-data" datetime="${dataIso(a)}"><span>${mesCurto(a)}</span><span>${a.ano}</span></time>
${recuo}  </div>
${recuo}  <${titulo} class="artigo-titulo"><a href="${linkArtigo(a)}">${esc(a.titulo)}</a></${titulo}>
${recuo}  <p class="artigo-resumo">${esc(a.resumo)}</p>
${recuo}  <div class="artigo-banner">
${recuo}    <img src="assets/${a.imagem}" alt="" loading="lazy" decoding="async" width="960" height="720">
${recuo}    <div class="artigo-autor">
${recuo}      <img src="${semBarra(autor.photo)}" alt="" loading="lazy" decoding="async" width="88" height="88">
${recuo}      <span><strong>${esc(nomeCurto(a))}</strong><small>CRM-MT ${autor.crm}</small></span>
${recuo}    </div>
${recuo}  </div>
${recuo}</article>`;
}

/** Mesmo HTML de ArtigoMini (components/ui/article-card.tsx). */
function mini(o, recuo) {
  return `${recuo}<article class="artigo-mini">
${recuo}  <img src="assets/${o.imagem}" alt="" loading="lazy" decoding="async" width="192" height="160">
${recuo}  <div>
${recuo}    <span class="artigo-mini-area">${esc(rotuloArea(o.area))}</span>
${recuo}    <h3 class="artigo-titulo"><a href="${linkArtigo(o)}">${esc(o.titulo)}</a></h3>
${recuo}    <small>${esc(nomeCurto(o))} · <time datetime="${dataIso(o)}">${dataLonga(o)}</time></small>
${recuo}  </div>
${recuo}</article>`;
}

function filtro(recuo) {
  return `${recuo}<div class="artigos-filtros" role="group" aria-label="Filtrar artigos por especialidade" data-artigos-filtros>
${recuo}  <button type="button" data-filtro="todas" aria-pressed="true">Todas</button>
${AREAS_ARTIGOS.map((x) => `${recuo}  <button type="button" data-filtro="${x.id}" aria-pressed="false">${esc(x.rotulo)}</button>`).join("\n")}
${recuo}</div>`;
}

// Seção da inicial (igual a components/artigos-secao.tsx).
const secao = `    <!-- ARTIGOS: gerado por artus-react/scripts/${GERADOR}. -->
    <section class="section artigos" id="artigos" aria-labelledby="artigos-title" data-artigos data-limite="${ARTIGOS_MAX_INICIAL}">
      <div class="container">
        <div class="section-heading">
          <div><h2 id="artigos-title" tabindex="-1">${esc(ARTIGOS_TITULO)}</h2></div>
          <p>${esc(ARTIGOS_SOBRE)}</p>
        </div>
        <div class="artigos-barra">
${filtro("          ")}
          <div class="artigos-setas" data-artigos-setas>
            <button type="button" class="artigos-seta" data-dir="-1" aria-label="Artigos anteriores" aria-controls="artigos-trilho">${ESQUERDA}</button>
            <button type="button" class="artigos-seta" data-dir="1" aria-label="Próximos artigos" aria-controls="artigos-trilho">${DIREITA}</button>
          </div>
        </div>
        <div class="artigos-trilho" id="artigos-trilho" data-artigos-trilho role="region" aria-label="Lista de artigos" tabindex="0">
${artigos.map((a) => cartao(a)).join("\n")}
        </div>
        <p class="artigos-vazio" data-artigos-vazio hidden>Ainda não há artigos desta especialidade.</p>
        <p class="visually-hidden" aria-live="polite" data-artigos-aviso></p>
        <div class="artigos-acoes">
          <button type="button" class="artigos-expandir" data-artigos-expandir aria-expanded="false" aria-controls="artigos-trilho">
            <span data-rotulo-fechado>Ver mais artigos</span>
            <span data-rotulo-aberto hidden>Mostrar menos</span>
            ${DIREITA}
          </button>
          <a class="inline-link" href="artigos.html">Ver todos os artigos <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
    <!-- /ARTIGOS -->`;

let home = ler("index.html").split(CR + "\n").join("\n");
const ini = home.indexOf("    <!-- ARTIGOS");
const fimMarca = "<!-- /ARTIGOS -->";
if (ini >= 0) {
  const fim = home.indexOf(fimMarca, ini);
  if (fim < 0) throw new Error("index.html: marcador <!-- /ARTIGOS --> não encontrado");
  home = home.slice(0, ini) + secao + home.slice(fim + fimMarca.length);
} else {
  const ancora = '    <section class="section container reviews" id="avaliacoes"';
  if (!home.includes(ancora)) throw new Error("index.html: seção #avaliacoes não encontrada");
  home = home.replace(ancora, `${secao}\n\n${ancora}`);
}
if (!home.includes('<script src="artigos.js" defer></script>')) {
  if (!home.includes('<script src="home.js" defer></script>')) throw new Error("index.html: script home.js não encontrado");
  home = home.replace('<script src="home.js" defer></script>', '<script src="home.js" defer></script>\n  <script src="artigos.js" defer></script>');
}
escrever("index.html", home);

// Página com todos os artigos (igual a app/artigos/page.tsx): o mais recente grande no topo, os quatro seguintes ao lado.
const principal = artigos[0];
const lateral = artigos.slice(1, 5);
const emDestaque = new Set([principal, ...lateral].map((a) => a.slug));
escrever("artigos.html", documento({
  tipo: "doc",
  titulo: ARTIGOS_TITULO,
  descricao: ARTIGOS_SOBRE,
  gerador: GERADOR,
  scripts: ["artigos.js"],
  corpo: `  <main id="conteudo" class="legal artigos-pagina">
    <section class="artigo-capa" aria-labelledby="legal-titulo">
      <div class="container">
        <nav class="legal-trilha" aria-label="Você está em">
          <ol>
            <li><a href="index.html">Início</a></li>
            <li aria-current="page">Artigos</li>
          </ol>
        </nav>
        <h1 id="legal-titulo">${esc(ARTIGOS_TITULO)}</h1>
        <p class="artigo-capa-resumo">${esc(ARTIGOS_SOBRE)}</p>
      </div>
    </section>
    <section class="container artigos-destaque" aria-labelledby="destaque-titulo">
      <h2 id="destaque-titulo" class="visually-hidden">Em destaque</h2>
      <article class="artigo-principal" data-area="${principal.area}">
        <img src="assets/${principal.imagem}" alt="" width="960" height="720" fetchpriority="high">
        <div class="artigo-principal-conteudo">
          <div class="artigo-topo">
            <span class="artigo-area">${esc(rotuloArea(principal.area))}</span>
            <time class="artigo-data" datetime="${dataIso(principal)}"><span>${mesCurto(principal)}</span><span>${principal.ano}</span></time>
          </div>
          <h3 class="artigo-titulo"><a href="${linkArtigo(principal)}">${esc(principal.titulo)}</a></h3>
          <p class="artigo-resumo">${esc(principal.resumo)}</p>
          <div class="artigo-autor">
            <img src="${semBarra(autorDe(principal).photo)}" alt="" width="88" height="88">
            <span><strong>${esc(nomeCurto(principal))}</strong><small>CRM-MT ${autorDe(principal).crm}</small></span>
          </div>
        </div>
      </article>
      <div class="artigos-lateral">
        <h2>Mais recentes</h2>
        <ol>
${lateral.map((o) => `          <li>\n${mini(o, "            ")}\n          </li>`).join("\n")}
        </ol>
      </div>
    </section>
    <section class="container artigos-acervo" id="acervo" data-artigos aria-labelledby="acervo-titulo">
      <h2 id="acervo-titulo">Mais artigos</h2>
${filtro("      ")}
      <div class="artigos-grade" id="artigos-grade" data-artigos-trilho>
${artigos.map((a) => cartao(a, "h3", "        ", emDestaque.has(a.slug))).join("\n")}
      </div>
      <p class="artigos-vazio" data-artigos-vazio hidden>Ainda não há artigos desta especialidade.</p>
      <p class="visually-hidden" aria-live="polite" data-artigos-aviso></p>
      <p class="artigos-fonte">Leitura informativa: não substitui a consulta.</p>
    </section>
  </main>`,
}));

// Uma página por artigo (igual a app/artigos/[slug]/page.tsx).
for (const a of artigos) {
  const autor = autorDe(a);
  const area = rotuloArea(a.area);
  const outros = outrosArtigos(a);
  escrever(linkArtigo(a), documento({
    tipo: "doc",
    titulo: a.titulo,
    descricao: a.resumo,
    gerador: GERADOR,
    corpo: `  <main id="conteudo" class="legal artigo-pagina">
    <div class="artigo-capa artigo-leitura">
      <div class="container artigo-layout">
        <article aria-labelledby="legal-titulo">
          <nav class="legal-trilha" aria-label="Você está em">
            <ol>
              <li><a href="index.html">Início</a></li>
              <li><a href="artigos.html">Artigos</a></li>
              <li aria-current="page">${esc(a.titulo)}</li>
            </ol>
          </nav>
          <span class="artigo-area">${esc(area)}</span>
          <h1 id="legal-titulo">${esc(a.titulo)}</h1>
          <p class="artigo-capa-resumo">${esc(a.resumo)}</p>
          <div class="artigo-assinatura">
            <img src="${semBarra(autor.photo)}" alt="" width="88" height="88">
            <p>
              <strong>${esc(autor.name)}</strong>
              <span>CRM-MT ${autor.crm} · RQE ${autor.rqe}</span>
              <span>Publicado em <time datetime="${dataIso(a)}">${dataLonga(a)}</time></span>
            </p>
          </div>
          <figure class="artigo-capa-figura">
            <img src="assets/${a.imagem}" alt="${esc(a.alt)}" width="960" height="720" fetchpriority="high">
          </figure>
          <div class="artigo-texto">
${a.corpo.map((p) => (p.startsWith("## ") ? `            <h2>${esc(p.slice(3))}</h2>` : `            <p>${esc(p)}</p>`)).join("\n")}
            <p class="artigo-nota">Leitura informativa: não substitui a consulta nem a avaliação individual.</p>
            <aside class="legal-ajuda" aria-labelledby="ajuda-titulo">
              <div>
                <h2 id="ajuda-titulo">Quer marcar uma avaliação?</h2>
                <p>A recepção agenda a consulta por telefone ou WhatsApp.</p>
              </div>
              <div class="legal-ajuda-acoes">
                <a class="botao-whatsapp" href="${linkWhatsApp(MENSAGEM_PADRAO)}" target="_blank" rel="noopener">${WA}<span>Agendar pelo WhatsApp</span>${NOVA_ABA}</a>
                <a class="legal-ligar" href="tel:+556533226689">${ICONE_TEL}<span>(65) 3322-6689</span></a>
              </div>
            </aside>
          </div>
        </article>
        <aside class="artigos-lateral artigo-aside" aria-labelledby="outros-titulo">
          <h2 id="outros-titulo">Outros artigos</h2>
          <ol>
${outros.map((o) => `            <li>\n${mini(o, "              ")}\n            </li>`).join("\n")}
          </ol>
          <a class="inline-link" href="artigos.html?area=${a.area}#acervo">Ver todos de ${esc(area.toLowerCase())} <span aria-hidden="true">→</span></a>
        </aside>
      </div>
    </div>
  </main>`,
  }));
}

// O comportamento é o mesmo arquivo do Next.
fs.copyFileSync(path.join(aqui, "..", "public", "artigos.js"), path.join(aqui, "..", "..", "artigos.js"));
console.log(`Geradas: seção de artigos do index.html, artigos.html, ${artigos.length} páginas artigo-*.html e artigos.js.`);
