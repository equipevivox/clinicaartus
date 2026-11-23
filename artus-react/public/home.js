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
  });
}

window.addEventListener("scroll", scheduleNavTone, { passive: true });
window.addEventListener("resize", scheduleNavTone);
window.addEventListener("pageshow", scheduleNavTone);
scheduleNavTone();

// O recuo das âncoras acompanha a altura real do cabeçalho fixo, que quebra em duas linhas
// em telas estreitas: vira o scroll-padding-top do <html> (usado pelo navegador, pelo Lenis e
// pelo seletor dos perfis) e a variável --cabecalho-fim (topo da coluna fixa do índice).
function syncHeaderOffset() {
  const top = parseFloat(getComputedStyle(header).top) || 0;
  const bottom = Math.ceil(top + header.offsetHeight + 12);
  const root = document.documentElement;
  root.style.setProperty("--cabecalho-fim", bottom + "px");
  root.style.scrollPaddingTop = bottom + "px";
}
new ResizeObserver(syncHeaderOffset).observe(header);
window.addEventListener("resize", syncHeaderOffset);
syncHeaderOffset();

const motion = matchMedia("(prefers-reduced-motion: reduce)");

// Links internos (menu, atalhos, rodapé, "Agendamento e endereço"): depois de rolar, o foco vai
// para o título do destino, sem rolar de novo. Os links #cuidado-x ficam com o seletor dos perfis
// (components/care-selector.tsx), que trata o clique antes e para a propagação.
function focusDestination(hash) {
  if (!hash || hash === "#") return;
  let target = hash === "#inicio" ? document.getElementById("titulo") : document.getElementById(hash.slice(1));
  if (!target) return;
  if (!target.matches("h1, h2, h3")) target = target.querySelector("h1, h2") || target;
  if (!target.hasAttribute("tabindex") && !target.matches("a[href], button, input, select, textarea, summary")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });
}
document.addEventListener("click", (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest?.("a[href^='#']");
  if (!link || link.hash.startsWith("#cuidado-") || link.hash === "#") return;
  const volta = marcarOrigemAncora(link);
  // Depois da navegação para a âncora, que manda o foco para a página quando o destino não é focável.
  // Só se a página ainda estiver nesse destino: um Voltar imediato não pode receber este foco atrasado.
  setTimeout(() => {
    if (location.hash !== link.hash) return;
    marcarDestinoAncora(volta);
    focusDestination(link.hash);
  }, 0);
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


// Sem revelação por seção: o único momento orquestrado é a abertura seguida da entrada do hero
// (o traço dos perfis se desenha quando o perfil aparece, ver care-selector.tsx e artus.css).

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
