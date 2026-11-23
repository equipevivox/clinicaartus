/**
 * Abertura em vídeo da logo 3D (video-logo-3d/). Toca uma vez por sessão, antes do hero.
 * Os dois scripts rodam como <script> inline, antes da hidratação, para não piscar o site.
 * A versão estática (index.html na raiz) usa uma cópia idêntica destes dois scripts.
 *
 * Regras: pula com ?abertura=0, com qualquer #âncora na URL, com movimento reduzido ou se o
 * sessionStorage não estiver disponível; ?abertura=1 força (ignora as outras regras).
 */

/**
 * No <head>: só marca o <html> como elegível (fundo petróleo, sem travar nada).
 * Quem ativa a abertura e trava a rolagem é o segundo script, depois de armar todas as saídas.
 */
export const ABERTURA_DECIDIR = `(function () {
  var html = document.documentElement;
  var q = null;
  try { q = new URLSearchParams(location.search).get("abertura"); } catch (e) {}
  if (q === "0") return;
  // Só na página inicial (a rota /): documentos e 404, inclusive /index.html, abrem direto.
  // Única linha diferente da cópia estática, que aceita também o arquivo /index.html.
  if (location.pathname !== "/") return;
  if (q !== "1") {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (location.hash) return;
    try {
      if (sessionStorage.getItem("artus-abertura")) return;
      sessionStorage.setItem("artus-abertura", "1");
    } catch (e) {
      return;
    }
  }
  html.classList.add("abertura-elegivel");
  // Se o segundo script não rodar, nada fica travado: a marca sai quando a página termina de carregar.
  document.addEventListener("DOMContentLoaded", function () {
    if (!html.classList.contains("com-abertura")) html.classList.remove("abertura-elegivel");
  });
})();`;

/**
 * Logo depois do <dialog id="abertura">: abre como modal (o resto da página fica inerte),
 * sem botão: um clique na tela ou Esc encerram;
 * escolhe o vídeo (horizontal ou mobile), toca e sai com fade. Erro e demora vão direto ao site.
 */
export const ABERTURA_TOCAR = `(function () {
  var html = document.documentElement;
  var box = document.getElementById("abertura");
  if (!box || !html.classList.contains("abertura-elegivel")) return;
  var video = box.querySelector("video");
  var retrato = matchMedia("(orientation: portrait)").matches;
  var nome = box.getAttribute("data-base") + "artus-logo-3d-" + (retrato ? "mobile" : "horizontal");
  // 10 bits primeiro (sem faixas no degradê): VP9 (Chrome, Edge, Firefox), HEVC (Safari); H.264 é a reserva.
  var fontes = [];
  if (video.canPlayType('video/webm; codecs="vp09.02.41.10"') === "probably") fontes.push(nome + ".webm");
  if (video.canPlayType('video/mp4; codecs="hvc1.2.4.L123.B0"') === "probably") fontes.push(nome + "-hevc.mp4");
  fontes.push(nome + "-h264.mp4");
  var atual = 0;
  var fim = false;
  var limpo = false;
  var espera = 0;
  var teto = 0;

  function limpar() {
    if (limpo) return;
    limpo = true;
    clearTimeout(espera);
    clearTimeout(teto);
    html.classList.remove("com-abertura", "abertura-saindo", "abertura-elegivel", "abertura-retrato");
    if (box.open && box.close) box.close();
    else box.removeAttribute("open");
    video.pause();
    video.removeAttribute("src");
    video.load();
    // O foco vai para o conteúdo principal, sem rolar a página.
    var alvo = document.getElementById("conteudo");
    if (alvo) {
      if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
      alvo.focus({ preventScroll: true });
    }
    document.dispatchEvent(new CustomEvent("artus:abertura-fim"));
  }

  // "natural" e "pulo" saem com fade; "falha" (erro, autoplay bloqueado, demora) vai direto ao site.
  function encerrar(modo) {
    if (fim) return;
    fim = true;
    clearTimeout(espera);
    if (modo !== "natural") video.pause();
    if (modo === "falha") return limpar();
    html.classList.add("abertura-saindo");
    var dur = parseFloat(getComputedStyle(box).transitionDuration) || 0;
    if (!dur) return limpar();
    var feito = false;
    var terminar = function () { if (!feito) { feito = true; limpar(); } };
    box.addEventListener("transitionend", function (e) {
      if (e.target === box && e.propertyName === "opacity") terminar();
    });
    setTimeout(terminar, dur * 1000 + 150);
  }

  function tocar() {
    var p = video.play();
    if (p && p.catch) p.catch(function (erro) {
      if (!fim && erro && erro.name === "NotAllowedError") encerrar("falha");
    });
  }

  // Os ouvintes vêm antes do src, para nenhum evento escapar.
  video.addEventListener("playing", function () {
    if (fim) { video.pause(); return; }
    clearTimeout(espera);
  });
  video.addEventListener("error", function () {
    if (fim) return;
    if (atual < fontes.length - 1) { atual++; video.src = fontes[atual]; tocar(); }
    else encerrar("falha");
  });
  // A logo já saiu aos 3,25 s; o resto do vídeo é só o fundo, e o fade começa aí.
  if (video.requestVideoFrameCallback) {
    video.requestVideoFrameCallback(function quadro(agora, info) {
      if (info.mediaTime >= 3.25) encerrar("natural");
      else if (!fim) video.requestVideoFrameCallback(quadro);
    });
  }
  video.addEventListener("timeupdate", function () { if (video.currentTime >= 3.25) encerrar("natural"); });
  video.addEventListener("ended", function () { encerrar("natural"); });
  box.addEventListener("click", function () { encerrar("pulo"); });
  box.addEventListener("cancel", function (e) { e.preventDefault(); encerrar("pulo"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") encerrar("pulo"); });

  // Sem modal não há abertura: o resto da página não ficaria inerte.
  try { box.showModal(); } catch (e) { html.classList.remove("abertura-elegivel"); return; }

  // Se não começar a tocar em 2,5 s, segue direto. Teto rígido de 7 s desde a ativação, mesmo durante o fade.
  espera = setTimeout(function () { encerrar("falha"); }, 2500);
  teto = setTimeout(limpar, 7000);

  // Só agora, com o diálogo aberto e todas as saídas armadas, a rolagem trava.
  if (retrato) html.classList.add("abertura-retrato");
  html.classList.add("com-abertura");
  box.focus({ preventScroll: true });
  video.src = fontes[0];
  tocar();
})();`;
