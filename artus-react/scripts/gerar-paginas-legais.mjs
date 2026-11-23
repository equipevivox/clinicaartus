// Gera a versão estática das páginas internas a partir dos mesmos textos do Next (lib/paginas-legais.ts):
// privacidade.html, cookies.html, termos.html e 404.html na raiz do projeto, e o rodapé do index.html.
// Uso, dentro de artus-react/:  node scripts/gerar-paginas-legais.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ATUALIZADO_EM, ATUALIZADO_ISO, paginasLegais } from "../lib/paginas-legais.ts";
import { MENSAGEM_DUVIDA, MENSAGEM_PADRAO, linkWhatsApp } from "../lib/whatsapp.ts";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, "..", "..");
const CR = String.fromCharCode(13);

const ler = (rel) => fs.readFileSync(path.join(raiz, rel), "utf8");
function escrever(rel, conteudo) {
  const arq = path.join(raiz, rel);
  const crlf = fs.existsSync(arq) && fs.readFileSync(arq, "utf8").includes(CR + "\n");
  fs.writeFileSync(arq, crlf ? conteudo.split("\n").join(CR + "\n") : conteudo);
}
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const indexHtml = ler("index.html").split(CR + "\n").join("\n");
const ICONE_TEL = indexHtml.match(/<svg class="icone-tel"[^>]*>.*?<\/svg>/)[0];
const WHATSAPP_PATH = ler("artus-react/components/icone-whatsapp.tsx").match(/ d="([^"]+)"/)[1];
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><symbol id="simbolo-whatsapp" viewBox="0 0 24 24"><path fill="currentColor" d="${WHATSAPP_PATH}"/></symbol></svg>`;
const icone = (corpo, classe = "") => `<svg${classe ? ` class="${classe}"` : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${corpo}</svg>`;
const SETA = icone('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>');
const PINO = icone('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>');
const AJUSTES = icone('<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>');
const WA = '<svg class="icone-whatsapp" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#simbolo-whatsapp"/></svg>';
// Mensagens e número vêm de lib/whatsapp.ts, a mesma fonte do Next.
const WHATSAPP = linkWhatsApp(MENSAGEM_PADRAO);
const WHATSAPP_DUVIDA = linkWhatsApp(MENSAGEM_DUVIDA);
const MAPA = "https://www.google.com/maps/search/?api=1&amp;query=Clinica%20Artus%20Ortopedia%20Cuiaba&amp;query_place_id=ChIJpUtfAgCznZMRXrrjG1MNmHU";
const MAPA_EMBED = "https://www.google.com/maps/embed?origin=mfe&amp;pb=!1m3!2m1!1sCl%C3%ADnica+Artus+Ortopedia,+Av.+Egito+95,+Cuiab%C3%A1+MT!6i16";
const NOVA_ABA = '<span class="visually-hidden"> (abre em nova aba)</span>';
const regioes = [["Mão e punho", "cassio"], ["Joelho", "lucio"], ["Quadril", "renam"], ["Coluna", "andre"], ["Ombro e cotovelo", "valmir"], ["Pé e tornozelo", "ricardo"]];

/** Caminhos de cada contexto: na inicial, âncoras; nas internas, a inicial; no 404, tudo a partir da raiz. */
function caminhos(tipo) {
  const p = tipo === "404" ? "/" : "";
  return {
    ativo: p,
    inicio: tipo === "home" ? "" : tipo === "404" ? "/" : "index.html",
    marca: tipo === "home" ? "#inicio" : tipo === "404" ? "/" : "index.html",
    doc: (slug) => `${p}${slug}.html`,
  };
}

/** Converte [texto](/caminho) nos links da versão estática. */
function comLinks(texto, c) {
  return esc(texto).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, rotulo, alvo) => {
    const href = alvo === "/" ? c.inicio || "index.html" : c.doc(alvo.replace(/^\//, ""));
    return `<a href="${href}">${rotulo}</a>`;
  });
}

function rodape(tipo) {
  const c = caminhos(tipo);
  const ir = (a) => `${c.inicio}#${a}`;
  const mapa = tipo === "home"
    ? `
      <div class="footer-map-panel" data-mapa>
        <iframe title="Google Maps — localização da Clínica Artus" data-src="${MAPA_EMBED}" width="1152" height="248" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen hidden></iframe>
        <div class="mapa-aviso">
          <span class="mapa-pino" aria-hidden="true">${PINO}</span>
          <p><strong>Mapa do Google</strong>O Google pode usar cookies quando o mapa é carregado. Se você permitir, o site guarda essa escolha neste navegador.</p>
          <div class="mapa-acoes">
            <button type="button" class="mapa-permitir" data-permitir-mapa>Permitir e mostrar mapa</button>
            <a class="mapa-externo" href="${MAPA}" target="_blank" rel="noopener">Abrir no Google Maps${NOVA_ABA} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>`
    : "";
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-layout">
        <div class="footer-brand">
          <a class="brand" href="${c.marca}" aria-label="Clínica Artus Ortopedia, início"><img src="${c.ativo}assets/logo.svg" alt="" width="445" height="163"></a>
          <p>Ortopedia em Cuiabá, com sete médicos e seis áreas de atuação.</p>
        </div>
        <nav class="footer-group" aria-labelledby="footer-nav-title">
          <h2 id="footer-nav-title">A clínica</h2>
          <ul>
            <li><a href="${ir("clinica")}">Estrutura</a></li>
            <li><a href="${ir("equipe")}">Equipe médica</a></li>
            <li><a href="${ir("especialidades")}">Especialidades</a></li>
            <li><a href="${ir("perguntas")}">Perguntas frequentes</a></li>
            <li><a href="${ir("contato")}">Agendamento e endereço</a></li>
          </ul>
        </nav>
        <nav class="footer-group" aria-labelledby="footer-areas-title">
          <h2 id="footer-areas-title">Áreas de atuação</h2>
          <ul>
${regioes.map(([rotulo, id]) => `            <li><a href="${ir(`cuidado-${id}`)}">${rotulo}</a></li>`).join("\n")}
          </ul>
        </nav>
        <div class="footer-group">
          <h2>Central de atendimento</h2>
          <address>
            Av. Egito, 95 · Santa Rosa<br>
            Cuiabá, MT
          </address>
          <a class="footer-phone" href="tel:+556533226689">${ICONE_TEL}<span>Ligar para a recepção <small>(65) 3322-6689</small></span></a>
          <a class="footer-map" href="${MAPA}" target="_blank" rel="noopener">Abrir no Google Maps${NOVA_ABA} <span aria-hidden="true">↗</span></a>
        </div>
      </div>${mapa}
      <div class="footer-bottom">
        <div class="footer-legal">
          <p>© 2026 Clínica Artus Ortopedia</p>
          <nav class="footer-docs" aria-label="Privacidade e termos">
            <a href="${c.doc("privacidade")}" data-doc="privacidade">Política de privacidade</a>
            <a href="${c.doc("cookies")}" data-doc="cookies">Política de cookies</a>
            <a href="${c.doc("termos")}" data-doc="termos">Termos de uso</a>
            <button type="button" data-abrir-cookies>Preferências de cookies</button>
          </nav>
        </div>
        <div class="footer-assinatura">
          <a class="inline-link" href="#inicio">Voltar ao topo <span aria-hidden="true">↑</span></a>
          <p class="feito-por">Feita pela <img src="${c.ativo}assets/vivox.svg" alt="VIVOX" width="472" height="117"></p>
        </div>
      </div>
    </div>
  </footer>`;
}

function topo(tipo) {
  const c = caminhos(tipo);
  return `<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
  <header class="legal-topo">
    <div class="container legal-topo-barra">
      <a class="legal-marca" href="${c.inicio}" aria-label="Clínica Artus Ortopedia, página inicial"><img src="${c.ativo}assets/logo-color.svg" alt="" width="445" height="163"></a>
      <div class="legal-topo-acoes">
        <a class="legal-voltar" href="${c.inicio}">${SETA}<span>Voltar à página inicial</span></a>
        <a class="botao-whatsapp botao-whatsapp-compacto" href="${WHATSAPP_DUVIDA}" target="_blank" rel="noopener" aria-label="WhatsApp da recepção (abre em nova aba)">${WA}<span class="botao-whatsapp-rotulo">WhatsApp</span></a>
      </div>
    </div>
  </header>`;
}

function documento({ tipo, titulo, descricao, corpo }) {
  const c = caminhos(tipo);
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#123e48">${tipo === "404" ? '\n  <meta name="robots" content="noindex">' : ""}
  <!-- Gerada por artus-react/scripts/gerar-paginas-legais.mjs: edite os textos em artus-react/lib/paginas-legais.ts. -->
  <meta name="description" content="${esc(descricao)}">
  <title>${esc(titulo)} | Clínica Artus Ortopedia</title>
  <link rel="icon" href="${c.ativo}favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${c.ativo}assets/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${c.ativo}assets/figtree-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${c.ativo}styles.css">
  <script src="${c.ativo}assets/site.js" defer></script>
</head>
<body id="inicio">
  ${SPRITE}
  ${topo(tipo)}
${corpo}
  ${rodape(tipo)}
</body>
</html>
`;
}

const numero = (i) => String(i + 1).padStart(2, "0");

function bloco(b, c) {
  if (typeof b === "string") return `<p>${comLinks(b, c)}</p>`;
  if (b.lista) return `<ul>\n${b.lista.map((i) => `              <li>${comLinks(i, c)}</li>`).join("\n")}\n            </ul>`;
  if (b.tabela) {
    const { cabecalho, linhas } = b.tabela;
    return `<div class="legal-tabela" role="region" aria-label="Tabela de cookies e registros" tabindex="0">
              <table>
                <thead><tr>${cabecalho.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>
                <tbody>
${linhas.map((l) => `                  <tr>${l.map((cel, i) => (i === 0 ? `<th scope="row">${esc(cel)}</th>` : `<td>${esc(cel)}</td>`)).join("")}</tr>`).join("\n")}
                </tbody>
              </table>
            </div>`;
  }
  return `<p><button type="button" class="legal-botao" data-abrir-cookies>${AJUSTES}${esc(b.preferencias)}</button></p>`;
}

for (const pagina of paginasLegais) {
  const c = caminhos("doc");
  const corpo = `  <main id="conteudo" class="legal">
    <section class="legal-capa" aria-labelledby="legal-titulo">
      <div class="container">
        <nav class="legal-trilha" aria-label="Você está em">
          <ol>
            <li><a href="index.html">Início</a></li>
            <li aria-current="page">${esc(pagina.titulo)}</li>
          </ol>
        </nav>
        <p class="legal-rotulo">Documentos da clínica</p>
        <h1 id="legal-titulo">${esc(pagina.titulo)}</h1>
        <p class="legal-descricao">${esc(pagina.descricao)}</p>
        <div class="legal-meta">
          <p class="legal-data">Última atualização: <time datetime="${ATUALIZADO_ISO}">${ATUALIZADO_EM}</time></p>
          <nav class="legal-docs" aria-label="Documentos">
${paginasLegais.map((d) => `            <a href="${c.doc(d.slug)}"${d.slug === pagina.slug ? ' aria-current="page"' : ""}>${esc(d.curto)}</a>`).join("\n")}
          </nav>
        </div>
      </div>
    </section>
    <div class="container legal-corpo">
      <aside class="legal-indice">
        <nav aria-labelledby="indice-titulo">
          <p id="indice-titulo">Nesta página</p>
          <ol>
${pagina.secoes.map((s, i) => `            <li><a href="#${s.id}"><span aria-hidden="true">${numero(i)}</span>${esc(s.titulo)}</a></li>`).join("\n")}
          </ol>
        </nav>
      </aside>
      <article class="legal-texto">
        <section class="legal-resumo" aria-labelledby="resumo-titulo">
          <h2 id="resumo-titulo">Em resumo</h2>
          <ul>
${pagina.resumo.map((r) => `            <li>${esc(r)}</li>`).join("\n")}
          </ul>
        </section>
${pagina.secoes.map((s, i) => `        <section class="legal-secao" id="${s.id}" aria-labelledby="${s.id}-titulo">
          <h2 id="${s.id}-titulo"><span class="legal-num" aria-hidden="true">${numero(i)}</span>${esc(s.titulo)}</h2>
          ${s.blocos.map((b) => bloco(b, c)).join("\n          ")}
        </section>`).join("\n")}
        <aside class="legal-ajuda" aria-labelledby="ajuda-titulo">
          <div>
            <h2 id="ajuda-titulo">Ficou com alguma dúvida?</h2>
            <p>A recepção responde por telefone ou WhatsApp.</p>
          </div>
          <div class="legal-ajuda-acoes">
            <a class="botao-whatsapp" href="${WHATSAPP_DUVIDA}" target="_blank" rel="noopener">${WA}<span>Falar pelo WhatsApp</span>${NOVA_ABA}</a>
            <a class="legal-ligar" href="tel:+556533226689">${ICONE_TEL}<span>(65) 3322-6689</span></a>
          </div>
        </aside>
      </article>
    </div>
  </main>`;
  escrever(`${pagina.slug}.html`, documento({ tipo: "doc", titulo: pagina.titulo, descricao: pagina.descricao, corpo }));
}

// 404: caminhos a partir da raiz, porque o servidor entrega esta página em qualquer endereço.
escrever("404.html", documento({
  tipo: "404",
  titulo: "Página não encontrada",
  descricao: "O endereço procurado não existe no site da Clínica Artus.",
  corpo: `  <main id="conteudo" class="erro">
    <section class="erro-palco" aria-labelledby="erro-titulo">
      <div class="container erro-grade">
        <div class="erro-texto">
          <p class="erro-codigo" aria-hidden="true">404</p>
          <h1 id="erro-titulo">Página não encontrada</h1>
          <p class="erro-descricao">Volte à página inicial ou escolha uma área de atendimento abaixo.</p>
          <div class="erro-acoes">
            <a class="erro-inicio" href="/">${SETA}<span>Ir para a página inicial</span></a>
            <a class="botao-whatsapp" href="${WHATSAPP}" target="_blank" rel="noopener">${WA}<span>Agendar pelo WhatsApp</span>${NOVA_ABA}</a>
          </div>
          <nav class="erro-atalhos" aria-labelledby="atalhos-titulo">
            <p id="atalhos-titulo">Procurando um especialista?</p>
            <ul>
${regioes.map(([rotulo, id]) => `              <li><a href="/#cuidado-${id}">${rotulo}</a></li>`).join("\n")}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  </main>`,
}));

// Inicial: rodapé novo (documentos, preferências, assinatura e mapa sob consentimento) e o site.js.
let home = indexHtml;
const ini = home.indexOf('<footer class="site-footer">');
const fimTag = ini < 0 ? -1 : home.indexOf("</footer>", ini);
// Sem os dois delimitadores, na ordem, não grava nada (evita corromper o index.html).
if (ini < 0 || fimTag < ini) throw new Error("index.html: rodapé não encontrado");
const fim = fimTag + "</footer>".length;
home = home.slice(0, ini) + rodape("home") + home.slice(fim);
if (!home.includes('<script src="assets/site.js" defer></script>')) {
  if (!home.includes('<script src="home.js" defer></script>')) throw new Error("index.html: script home.js não encontrado");
  home = home.replace('<script src="home.js" defer></script>', '<script src="home.js" defer></script>\n  <script src="assets/site.js" defer></script>');
}
escrever("index.html", home);
console.log("Geradas: privacidade.html, cookies.html, termos.html, 404.html; rodapé do index.html atualizado.");
