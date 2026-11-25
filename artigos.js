/* Artigos dos especialistas: filtro por especialidade, carrossel com setas e "Ver mais".
   Serve à inicial (carrossel, até data-limite cartões) e à página de artigos (grade sem limite).
   O mesmo arquivo vai para a versão estática (artigos.js na raiz), copiado por scripts/gerar-artigos.mjs. */
(function () {
  "use strict";
  var POR_LINHA = 4;
  var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)");

  function iniciar(secao) {
    var filtros = secao.querySelectorAll("[data-filtro]");
    var trilho = secao.querySelector("[data-artigos-trilho]");
    if (!trilho || secao.dataset.artigosPronto) return;
    secao.dataset.artigosPronto = "1";
    var cartoes = Array.prototype.slice.call(trilho.querySelectorAll(".artigo-card"));
    var limite = parseInt(secao.getAttribute("data-limite"), 10) || 0;
    var expandir = secao.querySelector("[data-artigos-expandir]");
    var setas = secao.querySelector("[data-artigos-setas]");
    var vazio = secao.querySelector("[data-artigos-vazio]");
    var aviso = secao.querySelector("[data-artigos-aviso]");
    var aberto = false;
    var area = "todas";
    var visiveis = cartoes;

    function rotuloDe(valor) {
      for (var i = 0; i < filtros.length; i++) if (filtros[i].getAttribute("data-filtro") === valor) return filtros[i].textContent;
      return "";
    }

    function atualizarSetas() {
      if (!setas) return;
      var rola = !aberto && trilho.scrollWidth - trilho.clientWidth > 2;
      setas.hidden = !rola;
      trilho.classList.toggle("rola", rola);
      if (!rola) return;
      var ant = setas.querySelector('[data-dir="-1"]');
      var prox = setas.querySelector('[data-dir="1"]');
      ant.disabled = trilho.scrollLeft <= 2;
      prox.disabled = trilho.scrollLeft >= trilho.scrollWidth - trilho.clientWidth - 2;
    }

    function aplicar(anunciar) {
      // Em "Todas", os cartões que já estão no destaque do topo (data-destaque) saem da lista.
      var filtrados = cartoes.filter(function (c) { return area === "todas" ? !c.hasAttribute("data-destaque") : c.getAttribute("data-area") === area; });
      visiveis = limite ? filtrados.slice(0, limite) : filtrados;
      cartoes.forEach(function (c) { c.hidden = visiveis.indexOf(c) < 0; });
      for (var i = 0; i < filtros.length; i++) filtros[i].setAttribute("aria-pressed", String(filtros[i].getAttribute("data-filtro") === area));
      if (vazio) vazio.hidden = visiveis.length > 0;
      if (expandir) {
        expandir.hidden = visiveis.length <= POR_LINHA;
        if (expandir.hidden) aberto = false;
        expandir.setAttribute("aria-expanded", String(aberto));
        expandir.querySelector("[data-rotulo-fechado]").hidden = aberto;
        expandir.querySelector("[data-rotulo-aberto]").hidden = !aberto;
      }
      secao.classList.toggle("artigos-aberto", aberto);
      trilho.scrollLeft = 0;
      atualizarSetas();
      if (anunciar && aviso) {
        var n = visiveis.length;
        aviso.textContent = n === 0 ? "Nenhum artigo encontrado." : n + (n === 1 ? " artigo" : " artigos") + (area === "todas" ? "" : " de " + rotuloDe(area));
      }
    }

    for (var i = 0; i < filtros.length; i++) {
      filtros[i].addEventListener("click", function (e) {
        area = e.currentTarget.getAttribute("data-filtro");
        aberto = false;
        aplicar(true);
      });
    }

    if (setas) {
      setas.addEventListener("click", function (e) {
        var botao = e.target.closest("[data-dir]");
        if (!botao) return;
        var passo = trilho.clientWidth * parseInt(botao.getAttribute("data-dir"), 10);
        trilho.scrollBy({ left: passo, behavior: reduzir.matches ? "auto" : "smooth" });
      });
      var quadro = 0;
      trilho.addEventListener("scroll", function () {
        if (quadro) return;
        quadro = requestAnimationFrame(function () { quadro = 0; atualizarSetas(); });
      }, { passive: true });
      if ("ResizeObserver" in window) new ResizeObserver(atualizarSetas).observe(trilho);
    }

    if (expandir) {
      expandir.addEventListener("click", function () {
        aberto = !aberto;
        aplicar(false);
        if (aberto) {
          // Leva o foco ao primeiro cartão da linha nova: quem usa teclado continua de onde a lista cresceu.
          var primeiro = visiveis[POR_LINHA] && visiveis[POR_LINHA].querySelector(".artigo-titulo a");
          if (primeiro) primeiro.focus({ preventScroll: true });
        } else {
          var topo = secao.getBoundingClientRect().top;
          if (topo < 0) secao.scrollIntoView({ block: "start", behavior: reduzir.matches ? "auto" : "smooth" });
        }
      });
    }

    // Na página de artigos, ?area=joelho chega já filtrado (links "Ver todos de…" dos artigos).
    var pedida = new URLSearchParams(location.search).get("area");
    if (pedida && rotuloDe(pedida)) area = pedida;
    aplicar(false);
  }

  function tudo() {
    var secoes = document.querySelectorAll("[data-artigos]");
    for (var i = 0; i < secoes.length; i++) iniciar(secoes[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tudo);
  else tudo();
})();
