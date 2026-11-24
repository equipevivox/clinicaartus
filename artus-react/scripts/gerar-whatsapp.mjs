// Gera o atalho flutuante do WhatsApp da versão estática (index.html na raiz) a partir dos mesmos
// dados do Next (lib/whatsapp.ts, ATALHOS_WHATSAPP). O bloco fica entre <!-- WHATS (gerado ... -->
// e <!-- /WHATS -->, logo depois do cabeçalho. O comportamento (abrir, fechar, Esc, conversa) está no
// home.js, que monta a conversa a partir do JSON "whats-dados" gerado aqui.
// Uso, dentro de artus-react/:  node scripts/gerar-whatsapp.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ATALHOS_WHATSAPP, DICA_CONVERSA, TOTAL_ESPECIALISTAS, inicioMensagemAtalho, linkWhatsApp } from "../lib/whatsapp.ts";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const arquivo = path.join(raiz, "index.html");
const CR = String.fromCharCode(13);
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ICONE = fs
  .readFileSync(path.join(raiz, "artus-react", "components", "icone-whatsapp.tsx"), "utf8")
  .match(/<path fill="currentColor" d="([^"]+)"/)[1];
const whats = (classe) => `<svg${classe ? ` class="${classe}"` : ""} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="${ICONE}"/></svg>`;

const opcoes = ATALHOS_WHATSAPP.map((a) => {
  const fotos = a.fotos.map((f) => `<img src="assets/${f}.webp" alt="" width="44" height="44" decoding="async" loading="lazy">`).join("");
  return `            <li><button type="button" class="whats-opcao" data-area="${a.area}"><span class="whats-fotos${a.fotos.length > 1 ? " whats-fotos--dupla" : ""}" aria-hidden="true">${fotos}</span><span class="whats-opcao-texto"><strong>${esc(a.nomes)}</strong><span>${esc(a.especialidade)}</span></span><svg class="whats-enviar" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h14M13 6l6 6-6 6"/></svg></button></li>`;
}).join("\n");

// Dados da conversa para o home.js. O "<" vira < para o JSON nunca fechar a tag <script>.
const dados = JSON.stringify({
  link: linkWhatsApp(""),
  dica: DICA_CONVERSA,
  atalhos: ATALHOS_WHATSAPP.map((a) => ({
    area: a.area,
    pergunta: a.pergunta,
    exemplo: a.exemplo,
    opcoes: a.opcoes,
    inicio: inicioMensagemAtalho(a.especialidade),
  })),
}).replace(/</g, "\\u003c");

const bloco = `<!-- WHATS (gerado por artus-react/scripts/gerar-whatsapp.mjs; textos em artus-react/lib/whatsapp.ts) -->
  <div class="whats-flutuante" data-whats hidden>
    <button type="button" class="whats-botao" aria-expanded="false" aria-controls="whats-janela">${whats("whats-botao-icone")}<span class="visually-hidden">Agendar pelo WhatsApp: escolha entre ${TOTAL_ESPECIALISTAS} especialistas</span><span class="whats-selo" aria-hidden="true">${TOTAL_ESPECIALISTAS}</span></button>
    <div class="whats-janela" id="whats-janela" role="dialog" aria-labelledby="whats-titulo" tabindex="-1">
      <div class="whats-topo">
        <button type="button" class="whats-voltar" hidden><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7"/></svg><span class="visually-hidden">Voltar à lista de especialistas</span></button>
        <span class="whats-topo-avatar" aria-hidden="true"><img src="assets/logo-color.svg" alt="" width="32" height="14"></span>
        <div class="whats-topo-texto">
          <p class="whats-topo-nome" id="whats-titulo">Clínica Artus</p>
          <p class="whats-topo-status">Agendamento pelo WhatsApp</p>
        </div>
        <button type="button" class="whats-fechar"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg><span class="visually-hidden">Fechar</span></button>
      </div>
      <div class="whats-conversa whats-inicio">
        <p class="whats-balao">Olá! Escolha o especialista com quem você quer ser atendido.</p>
        <ul class="whats-lista">
${opcoes}
        </ul>
      </div>
      <div class="whats-chat" role="group" aria-labelledby="whats-pergunta" tabindex="-1" hidden>
        <div class="whats-conversa"></div>
        <form class="whats-envio">
          <label for="whats-campo" class="visually-hidden">Descreva onde dói</label>
          <input id="whats-campo" class="whats-campo" type="text" maxlength="300" autocomplete="off" enterkeyhint="send">
          <button type="submit" class="whats-mandar" disabled><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.4 20.4 21 12 3.4 3.6v6.5L15 12 3.4 13.9z"/></svg><span class="visually-hidden">Enviar pelo WhatsApp (abre em nova aba)</span></button>
        </form>
      </div>
      <script type="application/json" id="whats-dados">${dados}</script>
    </div>
  </div>
  <!-- /WHATS -->`;

const original = fs.readFileSync(arquivo, "utf8");
const crlf = original.includes(CR + "\n");
let s = original.split(CR + "\n").join("\n");
const ini = s.indexOf("<!-- WHATS (gerado");
if (ini >= 0) {
  const fim = s.indexOf("<!-- /WHATS -->", ini);
  if (fim < ini) throw new Error("index.html: marcador <!-- /WHATS --> não encontrado depois do início");
  s = s.slice(0, ini) + bloco + s.slice(fim + "<!-- /WHATS -->".length);
} else {
  const ancora = "\n  </header>\n";
  const pos = s.indexOf(ancora);
  if (pos < 0 || s.indexOf(ancora, pos + 1) >= 0) throw new Error("index.html: fim do cabeçalho não encontrado (ou repetido)");
  s = s.slice(0, pos + ancora.length) + "  " + bloco + "\n" + s.slice(pos + ancora.length);
}
fs.writeFileSync(arquivo, crlf ? s.split("\n").join(CR + "\n") : s);
console.log("Atalho do WhatsApp atualizado no index.html.");
