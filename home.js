const menu = document.querySelector("#menu");
const menuToggle = document.querySelector(".menu-toggle");
const mobile = matchMedia("(max-width: 760px)");

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("is-open", open);
  menu.inert = mobile.matches && !open;
}

function syncMenu() {
  menuToggle.hidden = !mobile.matches;
  setMenu(false);
}

const header = document.querySelector(".site-header");
const navShell = header.querySelector(".nav-shell");
const hero = document.querySelector(".hero");
header.classList.add("menu-ready");

// Altura real do cabeçalho fixo (muda com a largura, o zoom e a quebra de linha): vira o recuo de
// rolagem da página (scroll-padding-top) e o topo da coluna do índice, para nada ficar sob ele.
function medirCabecalho() {
  const estilo = getComputedStyle(header);
  const fixo = estilo.position === "sticky" || estilo.position === "fixed";
  const recuo = fixo ? Math.ceil((parseFloat(estilo.top) || 0) + header.offsetHeight + 12) : 16;
  document.documentElement.style.setProperty("--cabecalho", recuo + "px");
}
medirCabecalho();
if ("ResizeObserver" in window) new ResizeObserver(medirCabecalho).observe(header);
else window.addEventListener("resize", medirCabecalho);
syncMenu();
mobile.addEventListener("change", syncMenu);
menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") === "false");
});
menu.addEventListener("click", (event) => {
  if (mobile.matches && event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

function hasDarkBackground(x, y) {
  for (const element of document.elementsFromPoint(x, y)) {
    if (header.contains(element)) continue;
    if (hero.contains(element)) return false;

    const color = getComputedStyle(element).backgroundColor;
    const channels = color.match(/[\d.]+/g)?.map(Number);
    if (!channels || channels.length < 3) continue;
    const [red, green, blue, opacity = 1] = channels;
    if (opacity < .7) continue;

    return red * .2126 + green * .7152 + blue * .0722 < 140;
  }
  return false;
}

let navFrame = 0;
// Amostras ao longo de toda a largura da barra. Uma faixa escura pequena (a coluna escura do cartão
// do médico, o médico ativo no índice) não troca a cor: a barra só escurece quando três quartos dela
// estão sobre fundo escuro, e volta a clarear assim que metade estiver sobre fundo claro.
const navSampleColumns = [.06, .18, .3, .42, .54, .66, .78, .9];
const navSampleRows = [.3, .7];
const navDarkAt = .75;
const navLightAt = .5;

function scheduleNavTone() {
  if (navFrame) return;
  navFrame = requestAnimationFrame(() => {
    navFrame = 0;
    const { left, top, width, height } = navShell.getBoundingClientRect();
    let darkCount = 0;
    for (const row of navSampleRows) {
      for (const column of navSampleColumns) {
        if (hasDarkBackground(left + width * column, top + height * row)) darkCount += 1;
      }
    }

    const darkShare = darkCount / (navSampleColumns.length * navSampleRows.length);
    let tone = header.dataset.tone || "light";
    if (darkShare >= navDarkAt) tone = "dark";
    else if (1 - darkShare >= navLightAt) tone = "light";
    if (header.dataset.tone !== tone) header.dataset.tone = tone;
    // Fora da abertura (hero) a barra encolhe e flutua; volta ao tamanho cheio ao subir até ela.
    header.toggleAttribute("data-compacto", hero.getBoundingClientRect().bottom < top + height + 24);
  });
}

// A entrada da barra e da abertura roda uma vez só (ver .entrada-feita no CSS): termina sozinha
// ou no primeiro foco, para não recomeçar com blur quando o foco sai da barra depois de um clique.
{
  const raiz = document.documentElement;
  const encerrar = () => raiz.classList.add("entrada-feita");
  document.addEventListener("focusin", encerrar, { once: true });
  header.addEventListener("animationend", (e) => {
    if (e.target === header && e.animationName === "hero-focus") setTimeout(encerrar, 600);
  });
}

window.addEventListener("scroll", scheduleNavTone, { passive: true });
window.addEventListener("resize", scheduleNavTone);
window.addEventListener("pageshow", scheduleNavTone);
scheduleNavTone();

const motion = matchMedia("(prefers-reduced-motion: reduce)");

// Links internos: depois de rolar, o foco vai ao título do destino (o menu já fechou).
// Os perfis (#cuidado-*) ficam com o assets/perfis.js, que escolhe o perfil e foca o nome.
document.addEventListener("click", (event) => {
  const link = event.target.closest && event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  let id = "";
  try { id = decodeURIComponent(link.hash.slice(1)); } catch (erro) { return; }
  if (!id || id.startsWith("cuidado-")) return;
  const destino = document.getElementById(id);
  if (!destino) return;
  const titulo = destino.matches("h1, h2, h3") ? destino : destino.querySelector("h1, h2");
  if (!titulo) return;
  if (!titulo.hasAttribute("tabindex")) titulo.setAttribute("tabindex", "-1");
  const volta = marcarOrigemAncora(link);
  // Só se a página ainda estiver nesse destino: um Voltar imediato não pode receber este foco atrasado.
  requestAnimationFrame(() => {
    if (location.hash !== link.hash) return;
    marcarDestinoAncora(volta);
    titulo.focus({ preventScroll: true });
  });
});

// Voltar de um link interno: o foco volta ao link que levou ao destino. A entrada de origem guarda
// o link (origemAncora) e a marca de saída (ancoraSaida); a de destino, a mesma marca de chegada
// (ancoraChegada). Só vale ao voltar daquele destino, e uma entrada intermediária tem as duas marcas.
// O <head> acompanha o histórico (window.__artusDe = entrada de onde se veio).
const gravouAncora = () => { if (window.__artusGravou) window.__artusGravou(); };
let contadorAncora = 0;
function marcarOrigemAncora(link) {
  if (!link.dataset.origemAncora) link.dataset.origemAncora = String(++contadorAncora);
  const volta = "a" + Date.now().toString(36) + contadorAncora;
  // Guarda também a posição: no Voltar, o navegador pode preferir a âncora da entrada (#cuidado-x).
  history.replaceState(Object.assign({}, history.state, { origemAncora: link.dataset.origemAncora, ancoraSaida: volta, yAncora: Math.round(window.scrollY) }), "");
  gravouAncora();
  return volta;
}
function marcarDestinoAncora(volta) {
  history.replaceState(Object.assign({}, history.state, { ancoraChegada: volta }), "");
  gravouAncora();
}
// Visível de fato: fora de menu fechado (inert/oculto) e, se estiver na página, não atrás do
// cabeçalho fixo. Itens do próprio cabeçalho só precisam estar dentro da janela.
function ancoraVisivel(el) {
  if (!el || el.closest("[hidden], [inert]") || getComputedStyle(el).visibility === "hidden") return false;
  const r = el.getBoundingClientRect();
  const cabecalho = document.querySelector(".site-header");
  const limite = cabecalho && !cabecalho.contains(el) ? cabecalho.getBoundingClientRect().bottom : 0;
  return r.width > 0 && r.bottom > limite && r.top < window.innerHeight;
}
// A restauração do Voltar é animada (scroll-behavior: smooth): decide quando a rolagem para.
function depoisDeAssentar(cb) {
  let ultimo = -1;
  let parado = 0;
  const inicio = performance.now();
  const verificar = () => {
    const y = window.scrollY;
    parado = y === ultimo ? parado + 1 : 0;
    ultimo = y;
    if (parado >= 3 || performance.now() - inicio > 1500) cb();
    else requestAnimationFrame(verificar);
  };
  setTimeout(verificar, 60);
}
window.addEventListener("popstate", (event) => {
  const de = window.__artusDe;
  const estado = event.state;
  if (!de || !estado || !de.ancoraChegada || de.ancoraChegada !== estado.ancoraSaida || !estado.origemAncora) return;
  let origem = document.querySelector('[data-origem-ancora="' + estado.origemAncora + '"]');
  if (!origem) return;
  // A página volta exatamente aonde a pessoa estava quando seguiu o link. De novo no quadro seguinte:
  // numa entrada com âncora (#cuidado-x), o navegador ainda rola até ela depois do popstate.
  if (typeof estado.yAncora === "number") {
    const y = estado.yAncora;
    window.scrollTo({ top: y, behavior: "instant" });
    requestAnimationFrame(() => { if (window.scrollY !== y) window.scrollTo({ top: y, behavior: "instant" }); });
  }
  // Link de um menu que está fechado: o foco vai ao botão do menu.
  const toggle = document.querySelector(".menu-toggle");
  if (origem.closest("#menu") && toggle && !toggle.hidden && !ancoraVisivel(origem)) origem = toggle;
  let decidido = false;
  const encerrar = () => {
    decidido = true;
    window.removeEventListener("keydown", aoTecla, true);
    document.removeEventListener("focusin", aoFocarOutro, true);
  };
  const decidir = (porTab) => {
    if (decidido) return;
    encerrar();
    // Se o navegador ainda levou a página para a âncora da entrada, devolve à posição guardada.
    if (typeof estado.yAncora === "number" && Math.abs(window.scrollY - estado.yAncora) > 2) {
      window.scrollTo({ top: estado.yAncora, behavior: "instant" });
    }
    if (porTab || ancoraVisivel(origem)) origem.focus({ preventScroll: true });
    // Fora da tela (atrás do cabeçalho, por exemplo): o foco vai a ele assim mesmo e o navegador o
    // traz para a vista, respeitando o recuo do cabeçalho. O foco nunca fica perdido no documento.
    else origem.focus();
  };
  // Tab durante a espera: o link de origem vira o ponto de partida antes de o Tab andar.
  const aoTecla = (e) => { if (e.key === "Tab") decidir(true); };
  // Foco que a pessoa pôs em outro controle cancela o foco agendado.
  const aoFocarOutro = (e) => { if (!decidido && e.target !== document.body) encerrar(); };
  window.addEventListener("keydown", aoTecla, true);
  document.addEventListener("focusin", aoFocarOutro, true);
  depoisDeAssentar(() => decidir(false));
});


// Traço anatômico com espessura constante na tela (1,25px), qualquer que seja o tamanho do desenho.
const tracos = document.querySelectorAll("svg.traco");
function ajustarTraco(svg) {
  const box = svg.viewBox.baseVal;
  const { width, height } = svg.getBoundingClientRect();
  if (!box || !box.width || !width || !height) return;
  const escala = Math.min(width / box.width, height / box.height);
  svg.style.setProperty("--traco-largura", (1.25 / escala).toFixed(4));
}
if ("ResizeObserver" in window) {
  const tracoObserver = new ResizeObserver((entries) => entries.forEach(({ target }) => ajustarTraco(target)));
  tracos.forEach((svg) => tracoObserver.observe(svg));
} else {
  tracos.forEach(ajustarTraco);
}

// Retrato da especialidade: segue o ponteiro em câmera lenta. A cada quadro a prévia percorre só uma
// fração do caminho até o destino (interpolação), inclina de leve conforme a velocidade e, no par de
// fotos, a de trás atrasa um pouco mais, dando profundidade. Com movimento reduzido, nada segue o
// ponteiro (o par fica ancorado no cartão, como no foco por teclado).
const finePointer = matchMedia("(hover: hover) and (min-width: 761px)");
document.querySelectorAll(".area-card").forEach((card) => {
  const preview = card.querySelector(".area-preview");
  if (!preview) return;
  const paired = preview.classList.contains("area-preview-pair");
  const SUAVIDADE = 0.05; // fração do caminho por quadro: quanto menor, mais lento
  let frame = 0;
  let ativo = false;
  let pointerX = 0;
  let pointerY = 0;
  let alvoX = 0;
  let alvoY = 0;
  let x = 0;
  let y = 0;
  let inclinacao = 0;
  let atraso = 0;

  // Destino da prévia, perto do ponteiro e dentro da janela (no par: abaixo do cabeçalho).
  function calcularDestino() {
    const rect = card.getBoundingClientRect();
    const maxX = document.documentElement.clientWidth - preview.offsetWidth - 12;
    const maxY = window.innerHeight - preview.offsetHeight - 12;
    const anchored = paired && (motion.matches || card.matches(":focus-visible"));
    const preferredX = anchored ? rect.right - preview.offsetWidth - 14 : pointerX + 26;
    const preferredY = anchored ? rect.top - preview.offsetHeight + 14 : pointerY - preview.offsetHeight * .72;
    const px = Math.max(12, Math.min(preferredX, maxX));
    const minY = paired ? Math.max(12, header.getBoundingClientRect().bottom + 8) : 12;
    const py = Math.max(12, Math.min(Math.max(minY, preferredY), maxY));
    alvoX = px - rect.left - card.clientLeft;
    alvoY = py - rect.top - card.clientTop;
  }
  function aplicar() {
    preview.style.setProperty("--preview-x", x.toFixed(1) + "px");
    preview.style.setProperty("--preview-y", y.toFixed(1) + "px");
    preview.style.setProperty("--preview-tilt", inclinacao.toFixed(2) + "deg");
    preview.style.setProperty("--preview-lag", atraso.toFixed(1));
  }
  function saltarParaDestino() {
    calcularDestino();
    x = alvoX;
    y = alvoY;
    inclinacao = 0;
    atraso = 0;
    aplicar();
  }
  function quadro() {
    frame = 0;
    calcularDestino();
    const dx = alvoX - x;
    const dy = alvoY - y;
    x += dx * SUAVIDADE;
    y += dy * SUAVIDADE;
    inclinacao += (Math.max(-5, Math.min(5, dx * 0.035)) - inclinacao) * 0.12;
    atraso += (Math.max(-28, Math.min(28, dx * 0.18)) - atraso) * 0.12;
    aplicar();
    const parado = Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3 && Math.abs(inclinacao) < 0.05 && Math.abs(atraso) < 0.1;
    if (ativo && !parado) frame = requestAnimationFrame(quadro);
  }
  const animar = () => { if (!frame) frame = requestAnimationFrame(quadro); };

  if (paired) {
    // Foco por teclado, rolagem e redimensionamento com o par visível: ele se reposiciona na hora.
    const updateVisiblePair = () => {
      if (finePointer.matches && card.matches(":hover, :focus-visible")) saltarParaDestino();
    };
    card.addEventListener("focus", updateVisiblePair);
    window.addEventListener("scroll", () => { if (!ativo) updateVisiblePair(); }, { passive: true });
    window.addEventListener("resize", updateVisiblePair);
  }
  card.addEventListener("pointerenter", (event) => {
    if (!finePointer.matches || (motion.matches && !paired) || event.pointerType === "touch") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    saltarParaDestino();
    card.classList.add("is-following");
    ativo = !motion.matches;
  });
  card.addEventListener("pointermove", (event) => {
    if (!ativo || !finePointer.matches || motion.matches) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    animar();
  });
  // Rolar com o ponteiro parado sobre o cartão também move o destino: a prévia acompanha devagar.
  window.addEventListener("scroll", () => { if (ativo) animar(); }, { passive: true });
  card.addEventListener("pointerleave", () => {
    ativo = false;
    cancelAnimationFrame(frame);
    frame = 0;
  });
});

// Perguntas dos perfis: a resposta abre e fecha com animação (altura, opacidade e um leve
// deslocamento) em vez de aparecer de uma vez; a seta gira junto. Com movimento reduzido, fica o
// comportamento nativo do <details>.
document.querySelectorAll(".care-copy details").forEach((pergunta) => {
  const resumo = pergunta.querySelector("summary");
  const resposta = pergunta.querySelector("summary + *");
  if (!resumo || !resposta) return;
  let animacao = null;
  resumo.addEventListener("click", (event) => {
    if (motion.matches || !resposta.animate) return;
    event.preventDefault();
    const fechando = pergunta.open && !pergunta.hasAttribute("data-fechando");
    const alturaAtual = animacao ? resposta.getBoundingClientRect().height : null;
    if (animacao) animacao.cancel();
    const padding = getComputedStyle(resposta).paddingBottom;
    if (!fechando) {
      pergunta.removeAttribute("data-fechando");
      pergunta.open = true;
      const altura = resposta.scrollHeight;
      animacao = resposta.animate([
        { height: (alturaAtual ?? 0) + "px", paddingBottom: alturaAtual ? padding : "0px", opacity: alturaAtual ? 1 : 0, transform: "translateY(-4px)" },
        { height: altura + "px", paddingBottom: padding, opacity: 1, transform: "none" },
      ], { duration: 320, easing: "cubic-bezier(.22,.7,.3,1)" });
    } else {
      pergunta.setAttribute("data-fechando", "");
      animacao = resposta.animate([
        { height: (alturaAtual ?? resposta.getBoundingClientRect().height) + "px", paddingBottom: padding, opacity: 1 },
        { height: "0px", paddingBottom: "0px", opacity: 0 },
      ], { duration: 240, easing: "cubic-bezier(.4,0,.2,1)" });
      animacao.onfinish = () => {
        pergunta.open = false;
        pergunta.removeAttribute("data-fechando");
      };
    }
    animacao.addEventListener("finish", () => { animacao = null; });
  });
});

// Perguntas frequentes (só na versão estática; no Next é o components/ui/faq-tabs.tsx com
// framer-motion): a cor sobe para dentro da aba escolhida (CSS), a lista sai e entra esmaecendo e
// cada pergunta abre animando a altura, com o "+" girando. Mesmos tempos e curvas do componente.
(() => {
  const faq = document.querySelector("[data-faq]");
  if (!faq) return;
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const BACK_IN = "cubic-bezier(.6,-.28,.735,.045)";
  const abas = [...faq.querySelectorAll('[role="tab"]')];
  const paineis = abas.map((aba) => document.getElementById(aba.getAttribute("aria-controls")));
  let visivel = paineis[Math.max(0, abas.findIndex((aba) => aba.getAttribute("aria-selected") === "true"))];

  // A aba escolhida mostra o seu painel na hora e só a entrada é animada: o foco nunca encontra
  // perguntas do painel anterior (cada aba aponta para o seu painel, que já está no DOM).
  function selecionar(i) {
    abas.forEach((aba, j) => {
      aba.setAttribute("aria-selected", String(j === i));
      aba.tabIndex = j === i ? 0 : -1;
    });
    const painel = paineis[i];
    if (painel === visivel) return;
    paineis.forEach((p) => p.classList.toggle("ativo", p === painel));
    visivel = painel;
    if (!reduzir.matches && painel.animate) {
      painel.animate([{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: BACK_IN });
    }
  }
  abas.forEach((aba, i) => aba.addEventListener("click", () => selecionar(i)));
  faq.querySelector('[role="tablist"]').addEventListener("keydown", (event) => {
    const atual = abas.findIndex((aba) => aba.getAttribute("aria-selected") === "true");
    const destino = { ArrowRight: (atual + 1) % abas.length, ArrowLeft: (atual - 1 + abas.length) % abas.length, Home: 0, End: abas.length - 1 }[event.key];
    if (destino === undefined) return;
    event.preventDefault();
    selecionar(destino);
    abas[destino].focus();
  });

  faq.querySelectorAll(".faq-item").forEach((item) => {
    const botao = item.querySelector(".faq-pergunta");
    const resposta = item.querySelector(".faq-resposta");
    botao.setAttribute("aria-expanded", "false");
    resposta.inert = true;
    let animacao = null;
    botao.addEventListener("click", () => {
      const abrir = botao.getAttribute("aria-expanded") !== "true";
      const altura = resposta.getBoundingClientRect().height;
      const margem = getComputedStyle(resposta).marginBottom;
      if (animacao) animacao.cancel();
      botao.setAttribute("aria-expanded", String(abrir));
      item.dataset.aberto = String(abrir);
      resposta.inert = !abrir;
      resposta.classList.toggle("aberta", abrir);
      if (reduzir.matches || !resposta.animate) return;
      const destino = resposta.getBoundingClientRect().height;
      animacao = resposta.animate(
        [{ height: altura + "px", marginBottom: margem }, { height: destino + "px", marginBottom: abrir ? "16px" : "0px" }],
        { duration: 300, easing: "ease-in-out" }
      );
      animacao.onfinish = () => { animacao = null; };
    });
  });
})();

// Animação do membro de cada perfil (mesmo comportamento do components/video-membro.tsx): loop
// contínuo, sem botão de pausa; só toca com pelo menos 25% na tela, o arquivo só baixa quando vai tocar
// e, com movimento reduzido, fica no pôster (também se a preferência mudar depois).
(() => {
  const videos = [...document.querySelectorAll(".care-xray video")];
  if (!videos.length || !("IntersectionObserver" in window)) return;
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const naTela = new Set();
  const atualizar = (v) => {
    if (naTela.has(v) && !reduzir.matches) v.play().catch(() => {});
    else v.pause();
  };
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.intersectionRatio >= 0.25) naTela.add(e.target);
      else naTela.delete(e.target);
      atualizar(e.target);
    });
  }, { threshold: [0, 0.25] });
  videos.forEach((v) => obs.observe(v));
  reduzir.addEventListener("change", () => videos.forEach((v) => {
    // Volta ao pôster em vez de congelar no quadro em que estava.
    if (reduzir.matches && v.currentTime > 0) v.load();
    atualizar(v);
  }));
})();

// Atalho flutuante do WhatsApp (bloco gerado por artus-react/scripts/gerar-whatsapp.mjs). Mesmo
// comportamento do components/whatsapp-flutuante.tsx: janela não modal; Esc, o botão de fechar ou um
// clique fora fecham; o selo some depois da primeira abertura. Ao escolher um especialista, a janela
// vira uma conversa montada com os dados do JSON "whats-dados"; o envio abre o WhatsApp da recepção.
(() => {
  const raiz = document.querySelector("[data-whats]");
  const fonte = document.getElementById("whats-dados");
  if (!raiz || !fonte) return;
  const dados = JSON.parse(fonte.textContent);
  const botao = raiz.querySelector(".whats-botao");
  const janela = raiz.querySelector(".whats-janela");
  const voltar = raiz.querySelector(".whats-voltar");
  const inicio = raiz.querySelector(".whats-inicio");
  const chat = raiz.querySelector(".whats-chat");
  const conversa = chat.querySelector(".whats-conversa");
  const form = chat.querySelector(".whats-envio");
  const campo = form.querySelector(".whats-campo");
  const mandar = form.querySelector(".whats-mandar");
  let atual = null;
  raiz.hidden = false; // sem JavaScript o atalho não aparece; o contato do rodapé continua lá

  const criar = (tag, classe, texto) => {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto != null) el.textContent = texto;
    return el;
  };
  // Mesma regra do juntarSugestao (lib/whatsapp.ts): troca a resposta rápida do começo e mantém o resto.
  const juntar = (texto) => {
    let resto = campo.value.trim();
    const inicio = atual.opcoes.map((o) => o.texto).sort((a, b) => b.length - a.length).find((t) => resto.toLowerCase().startsWith(t.toLowerCase()));
    if (inicio) resto = resto.slice(inicio.length).trim();
    return resto ? texto + " " + resto : texto + " ";
  };
  // Mesma regra do fraseRelato (lib/whatsapp.ts): inicial maiúscula e ponto final.
  const frase = (relato) => {
    const t = relato.trim().replace(/\s+/g, " ");
    if (!t) return "";
    const f = t.charAt(0).toUpperCase() + t.slice(1);
    return /[.!?]$/.test(f) ? f : f + ".";
  };
  const atualizar = () => { mandar.disabled = !campo.value.trim(); };

  function alternar(abrir, devolverFoco) {
    raiz.classList.toggle("aberta", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
    if (abrir) {
      raiz.querySelector(".whats-selo")?.remove();
      janela.focus({ preventScroll: true });
    } else if (devolverFoco) {
      botao.focus();
    }
  }

  function mostrarLista(focarArea) {
    atual = null;
    chat.hidden = true;
    inicio.hidden = false;
    voltar.hidden = true;
    if (focarArea) raiz.querySelector('.whats-opcao[data-area="' + focarArea + '"]')?.focus();
  }

  function escolher(opcao) {
    atual = dados.atalhos.find((a) => a.area === opcao.dataset.area);
    if (!atual) return;
    const meu = criar("div", "whats-balao whats-balao--meu");
    meu.append(opcao.querySelector(".whats-fotos").cloneNode(true), opcao.querySelector(".whats-opcao-texto").cloneNode(true));
    const pergunta = criar("p", "whats-balao", atual.pergunta);
    pergunta.id = "whats-pergunta";
    const sugestoes = criar("div", "whats-sugestoes");
    sugestoes.setAttribute("role", "group");
    sugestoes.setAttribute("aria-label", "Respostas rápidas");
    atual.opcoes.forEach((o) => {
      const b = criar("button", "whats-sugestao", o.rotulo);
      b.type = "button";
      b.addEventListener("click", () => {
        campo.value = juntar(o.texto);
        atualizar();
        campo.focus();
        campo.setSelectionRange(campo.value.length, campo.value.length);
      });
      sugestoes.append(b);
    });
    conversa.replaceChildren(meu, pergunta, criar("p", "whats-balao", dados.dica), sugestoes);
    campo.value = "";
    campo.placeholder = atual.exemplo;
    atualizar();
    inicio.hidden = true;
    chat.hidden = false;
    voltar.hidden = false;
    conversa.scrollTop = 0;
    chat.focus({ preventScroll: true });
  }

  botao.addEventListener("click", () => alternar(!raiz.classList.contains("aberta"), false));
  raiz.querySelector(".whats-fechar").addEventListener("click", () => alternar(false, true));
  voltar.addEventListener("click", () => mostrarLista(atual && atual.area));
  raiz.querySelectorAll(".whats-opcao").forEach((opcao) => opcao.addEventListener("click", () => escolher(opcao)));
  campo.addEventListener("input", atualizar);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!atual || !campo.value.trim()) return;
    const url = dados.link + encodeURIComponent((atual.inicio + " " + frase(campo.value)).trim());
    const aba = window.open(url, "_blank");
    // Se o navegador bloquear a nova aba, abre o WhatsApp nesta mesma aba: o relato não se perde.
    if (!aba) {
      location.href = url;
      return;
    }
    aba.opener = null;
    alternar(false, true);
    mostrarLista(null);
    campo.value = "";
    atualizar();
  });
  document.addEventListener("keydown", (e) => {
    // Só devolve o foco ao botão se ele estava na janela; se a pessoa já foi para outro ponto, fica lá.
    if (e.key === "Escape" && raiz.classList.contains("aberta")) alternar(false, raiz.contains(document.activeElement) || document.activeElement === document.body);
  });
  document.addEventListener("pointerdown", (e) => {
    if (raiz.classList.contains("aberta") && !raiz.contains(e.target)) alternar(false, false);
  });
})();

// Vídeo de fundo do hero: é a capa e começa sozinho (autoplay, fonte escolhida pelo <source media>).
// Pausa fora da tela; o botão do canto pausa e toca (preferência guardada na sessão).
// Com "reduzir movimento" no sistema, fica parado no primeiro quadro até a pessoa apertar tocar.
(() => {
  const video = document.querySelector(".hero-video");
  const botao = document.querySelector(".hero-pausa");
  if (!video || !botao) return;
  video.muted = true; // o React nem sempre grava o atributo muted, e sem ele o navegador bloqueia o play()
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const salvo = sessionStorage.getItem("artus-hero-pausa");
  let pausado = salvo === null ? reduzir.matches : salvo === "1";
  let naTela = true;
  const marcar = () => {
    botao.setAttribute("aria-pressed", String(pausado));
    botao.setAttribute("aria-label", pausado ? "Tocar o vídeo de fundo" : "Pausar o vídeo de fundo");
  };
  const atualizar = () => {
    if (naTela && !pausado) video.play().catch(() => {});
    else video.pause();
  };
  botao.addEventListener("click", () => {
    pausado = !pausado;
    sessionStorage.setItem("artus-hero-pausa", pausado ? "1" : "0");
    marcar();
    atualizar();
  });
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { naTela = e.isIntersecting; atualizar(); }).observe(video);
  marcar();
  atualizar();
  botao.hidden = false;
})();
