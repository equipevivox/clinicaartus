// Gera o FAQ da versão estática (index.html na raiz) a partir dos mesmos textos do Next (lib/faq.ts).
// O bloco fica entre os comentários <!-- FAQ --> e <!-- /FAQ -->, antes de "Agendamento e endereço".
// Uso, dentro de artus-react/:  node scripts/gerar-faq.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FAQ_SOBRE, FAQ_TITULO, temasFaq } from "../lib/faq.ts";
import { MENSAGEM_DUVIDA, linkWhatsApp } from "../lib/whatsapp.ts";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const arquivo = path.join(raiz, "index.html");
const CR = String.fromCharCode(13);
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MAIS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const WHATSAPP = linkWhatsApp(MENSAGEM_DUVIDA);

const abas = temasFaq.map((t, i) => `          <button type="button" role="tab" class="faq-aba" id="faq-aba-${t.id}" aria-controls="faq-painel-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="faq-aba-rotulo">${esc(t.rotulo)}</span><span class="faq-aba-fundo" aria-hidden="true"></span></button>`).join("\n");

const paineis = temasFaq.map((t, i) => `          <div class="faq-painel${i === 0 ? " ativo" : ""}" role="tabpanel" id="faq-painel-${t.id}" aria-labelledby="faq-aba-${t.id}">
${t.perguntas.map((p, j) => `            <div class="faq-item" data-aberto="false">
              <h3 class="faq-item-titulo"><button type="button" class="faq-pergunta" id="faq-${t.id}-${j}-pergunta" aria-expanded="true" aria-controls="faq-${t.id}-${j}-resposta"><span class="faq-pergunta-texto">${esc(p.pergunta)}</span><span class="faq-mais-icone" aria-hidden="true">${MAIS}</span></button></h3>
              <div class="faq-resposta" id="faq-${t.id}-${j}-resposta" role="region" aria-labelledby="faq-${t.id}-${j}-pergunta"><p>${esc(p.resposta)}</p></div>
            </div>`).join("\n")}
          </div>`).join("\n");

const secao = `<!-- FAQ (gerado por artus-react/scripts/gerar-faq.mjs; textos em artus-react/lib/faq.ts) -->
    <section class="faq faq--estatico" id="perguntas" aria-labelledby="faq-titulo" data-faq>
      <div class="container faq-container">
        <div class="faq-cabeca">
          <p class="faq-sobre">${esc(FAQ_SOBRE)}</p>
          <h2 id="faq-titulo" tabindex="-1">${esc(FAQ_TITULO)}</h2>
          <span class="faq-brilho" aria-hidden="true"></span>
        </div>
        <div class="faq-abas" role="tablist" aria-label="Temas das perguntas">
${abas}
        </div>
        <div class="faq-lista">
${paineis}
        </div>
        <p class="faq-ajuda">Não encontrou a sua dúvida? <a href="${WHATSAPP}" target="_blank" rel="noopener">Fale com a recepção pelo WhatsApp<span class="visually-hidden"> (abre em nova aba)</span></a></p>
      </div>
    </section>
    <!-- /FAQ -->`;

const original = fs.readFileSync(arquivo, "utf8");
const crlf = original.includes(CR + "\n");
let s = original.split(CR + "\n").join("\n");
const ini = s.indexOf("<!-- FAQ (gerado");
if (ini >= 0) {
  const fimMarca = s.indexOf("<!-- /FAQ -->", ini);
  if (fimMarca < ini) throw new Error("index.html: marcador <!-- /FAQ --> não encontrado depois do início");
  s = s.slice(0, ini) + secao + s.slice(fimMarca + "<!-- /FAQ -->".length);
} else {
  const ancora = '<section class="contact" id="contato"';
  const pos = s.indexOf(ancora);
  if (pos < 0) throw new Error("seção de contato não encontrada");
  s = s.slice(0, pos) + secao + "\n\n    " + s.slice(pos);
}
fs.writeFileSync(arquivo, crlf ? s.split("\n").join(CR + "\n") : s);
console.log("FAQ estático atualizado no index.html.");
