/*
 * Clínica Artus: aviso e preferências de cookies, mapa do Google sob consentimento e índice das
 * páginas de documentos. O mesmo arquivo serve as duas versões (assets/site.js na estática e
 * artus-react/public/site.js no Next): mantenha os dois iguais.
 *
 * A escolha fica em localStorage ("artus-cookies") e vale por 365 dias. Só há uma categoria
 * opcional: o mapa do Google no rodapé, que não carrega nada até ser permitido. A escolha é
 * reaplicada quando muda em outra aba (evento storage) e quando a página volta do cache (pageshow).
 */
(function () {
  "use strict";

  var CHAVE = "artus-cookies";
  var VERSAO = 1;
  var VALIDADE = 365 * 24 * 60 * 60 * 1000;
  var html = document.documentElement;

  /** Lê e valida a escolha: formato, versão e data (nem vencida, nem no futuro). */
  function ler() {
    try {
      var v = JSON.parse(localStorage.getItem(CHAVE) || "null");
      if (!v || v.v !== VERSAO || typeof v.terceiros !== "boolean") return null;
      var em = Date.parse(v.em);
      var agora = Date.now();
      if (isNaN(em) || em > agora + 60000 || agora - em >= VALIDADE) return null;
      return v;
    } catch (e) {
      return null;
    }
  }
  var escolha = ler();

  // ---------- Avisos para leitor de tela ----------
  var anuncio = document.createElement("p");
  anuncio.className = "cookies-anuncio";
  anuncio.setAttribute("role", "status");
  document.body.appendChild(anuncio);
  function anunciar(texto) {
    anuncio.textContent = "";
    setTimeout(function () { anuncio.textContent = texto; }, 60);
  }

  /** Destino de foco quando o elemento focado some: o conteúdo principal, sem rolar a página. */
  function focarConteudo() {
    var alvo = document.getElementById("conteudo") || document.querySelector("main");
    if (!alvo) return;
    if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
    alvo.focus({ preventScroll: true });
  }
  function focoPerdido() {
    var a = document.activeElement;
    return !a || a === document.body || !a.isConnected || !!a.closest("[inert]") || a.getClientRects().length === 0;
  }

  // ---------- Mapa do Google ----------
  function mostrarMapas() {
    var mudou = false;
    document.querySelectorAll("[data-mapa]").forEach(function (painel) {
      var quadro = painel.querySelector("iframe[data-src]");
      if (!quadro) return;
      if (quadro.getAttribute("src") !== quadro.getAttribute("data-src")) quadro.setAttribute("src", quadro.getAttribute("data-src"));
      quadro.hidden = false;
      if (!painel.classList.contains("mapa-carregado")) mudou = true;
      painel.classList.add("mapa-carregado");
    });
    return mudou;
  }
  function esconderMapas() {
    var mudou = false;
    document.querySelectorAll("[data-mapa].mapa-carregado").forEach(function (painel) {
      var quadro = painel.querySelector("iframe[data-src]");
      if (quadro) {
        quadro.setAttribute("src", "about:blank");
        quadro.hidden = true;
      }
      painel.classList.remove("mapa-carregado");
      mudou = true;
    });
    return mudou;
  }
  function aplicar() {
    if (escolha && escolha.terceiros) return mostrarMapas();
    return esconderMapas();
  }

  function gravar(terceiros) {
    escolha = { v: VERSAO, terceiros: !!terceiros, em: new Date().toISOString() };
    // Mesmo se o armazenamento falhar, a escolha vale nesta página (a revogação continua possível).
    try { localStorage.setItem(CHAVE, JSON.stringify(escolha)); } catch (e) {}
    var mudou = aplicar();
    if (mudou) anunciar(escolha.terceiros ? "Mapa do Google ativado." : "Mapa do Google desligado.");
    fecharAviso();
  }

  // ---------- Aviso ----------
  var ESCUDO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>';
  var FECHAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function enderecoPolitica() {
    var link = document.querySelector("[data-doc='cookies']");
    return link ? link.getAttribute("href") : "cookies.html";
  }

  var aviso = null;
  /** Reserva espaço no fim da página do tamanho do aviso: nada fica preso embaixo dele. */
  function reservarEspaco(px) {
    if (px) html.style.setProperty("--cookies-aviso-espaco", px + "px");
    else html.style.removeProperty("--cookies-aviso-espaco");
  }
  function abrirAviso() {
    if (aviso || escolha) return;
    aviso = document.createElement("section");
    aviso.className = "cookies-aviso";
    aviso.setAttribute("aria-labelledby", "cookies-aviso-titulo");
    aviso.innerHTML =
      '<div class="cookies-cabeca"><span class="cookies-icone">' + ESCUDO + '</span><h2 id="cookies-aviso-titulo">Sua privacidade</h2></div>' +
      "<p>Seu navegador pode guardar a sua escolha e uma marca da abertura em vídeo. O mapa do Google só carrega se você permitir. O Google pode usar cookies próprios. " +
      '<a href="' + enderecoPolitica() + '">Política de cookies</a></p>' +
      '<div class="cookies-acoes">' +
      '<button type="button" class="cookies-botao cookies-recusar" data-cookies="essenciais">Manter mapa desligado</button>' +
      '<button type="button" class="cookies-botao cookies-aceitar" data-cookies="todos">Permitir mapa</button>' +
      "</div>" +
      '<button type="button" class="cookies-personalizar" data-abrir-cookies>Personalizar</button>';
    document.body.appendChild(aviso);
    reservarEspaco(aviso.offsetHeight + 24);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (aviso) aviso.classList.add("visivel"); });
    });
  }
  function fecharAviso() {
    if (!aviso) return;
    var el = aviso;
    aviso = null;
    var tinhaFoco = el.contains(document.activeElement);
    // Inerte já na saída: o Tab não passa pelos botões durante o esmaecer.
    el.inert = true;
    el.classList.remove("visivel");
    reservarEspaco(0);
    if (tinhaFoco) focarConteudo();
    setTimeout(function () { el.remove(); }, 450);
  }

  // Um controle focado não fica escondido atrás do aviso: a página rola o suficiente para mostrá-lo.
  document.addEventListener("focusin", function (e) {
    if (!aviso || aviso.contains(e.target)) return;
    var r = e.target.getBoundingClientRect();
    var a = aviso.getBoundingClientRect();
    var cobre = r.bottom > a.top && r.top < a.bottom && r.right > a.left && r.left < a.right;
    if (cobre) window.scrollBy({ top: r.bottom - a.top + 16, behavior: "auto" });
  });

  // ---------- Preferências ----------
  var dialogo = null;
  var acionador = null;
  function criarDialogo() {
    dialogo = document.createElement("dialog");
    dialogo.className = "cookies-dialogo";
    dialogo.setAttribute("aria-labelledby", "cookies-dialogo-titulo");
    dialogo.setAttribute("data-lenis-prevent", "");
    dialogo.innerHTML =
      '<div class="cookies-dialogo-topo">' +
      '<span class="cookies-icone">' + ESCUDO + "</span>" +
      '<h2 id="cookies-dialogo-titulo">Preferências de cookies</h2>' +
      "<p>Escolha o que o site pode carregar. Você pode mudar quando quiser.</p>" +
      '<button type="button" class="cookies-fechar" aria-label="Fechar">' + FECHAR + "</button>" +
      "</div>" +
      '<div class="cookies-opcoes">' +
      '<div class="cookies-opcao">' +
      '<span class="cookies-opcao-texto"><strong>Registros do site</strong><span class="cookies-desc">Guardam a sua escolha sobre o mapa e ajudam a evitar que o vídeo de abertura se repita nesta aba.</span></span>' +
      '<span class="cookies-sempre">Gerencie no navegador</span>' +
      "</div>" +
      '<label class="cookies-opcao" for="cookies-terceiros">' +
      '<span class="cookies-opcao-texto"><strong id="cookies-terceiros-nome">Mapa do Google</strong><span class="cookies-desc" id="cookies-terceiros-desc">Quando ativado, o mapa aparece no rodapé da página inicial. O Google pode usar cookies próprios.</span></span>' +
      '<input type="checkbox" role="switch" id="cookies-terceiros" class="cookies-chave" aria-labelledby="cookies-terceiros-nome" aria-describedby="cookies-terceiros-desc">' +
      "</label>" +
      "</div>" +
      '<div class="cookies-dialogo-rodape">' +
      '<button type="button" class="cookies-botao cookies-salvar cookies-manter">Manter mapa desligado</button>' +
      '<button type="button" class="cookies-botao cookies-salvar">Salvar escolha</button>' +
      '<button type="button" class="cookies-botao cookies-aceitar-todos">Permitir mapa</button>' +
      "</div>";
    document.body.appendChild(dialogo);
    var chave = dialogo.querySelector("#cookies-terceiros");
    dialogo.querySelector(".cookies-fechar").addEventListener("click", function () { dialogo.close(); });
    dialogo.querySelector(".cookies-manter").addEventListener("click", function () { gravar(false); dialogo.close(); });
    dialogo.querySelector(".cookies-salvar:not(.cookies-manter)").addEventListener("click", function () { gravar(chave.checked); dialogo.close(); });
    dialogo.querySelector(".cookies-aceitar-todos").addEventListener("click", function () { gravar(true); dialogo.close(); });
    // Clique fora do cartão (no fundo escurecido) fecha sem salvar.
    dialogo.addEventListener("click", function (e) { if (e.target === dialogo) dialogo.close(); });
    // Ao fechar, o foco volta a quem abriu; se ele sumiu (o aviso), vai para o conteúdo principal.
    dialogo.addEventListener("close", function () {
      var volta = acionador;
      acionador = null;
      requestAnimationFrame(function () {
        if (volta && volta.isConnected && !volta.closest("[inert]") && volta.getClientRects().length) volta.focus({ preventScroll: true });
        else if (focoPerdido()) focarConteudo();
      });
    });
  }
  function abrirPreferencias() {
    if (!dialogo) criarDialogo();
    acionador = document.activeElement;
    dialogo.querySelector("#cookies-terceiros").checked = !!(escolha && escolha.terceiros);
    if (!dialogo.open) dialogo.showModal();
  }

  document.addEventListener("click", function (e) {
    var alvo = e.target.closest && e.target.closest("[data-abrir-cookies], [data-cookies], [data-permitir-mapa]");
    if (!alvo) return;
    if (alvo.hasAttribute("data-abrir-cookies")) {
      e.preventDefault();
      abrirPreferencias();
    } else if (alvo.hasAttribute("data-permitir-mapa")) {
      gravar(true);
      // O botão do aviso do mapa some: o foco vai para o link do Google Maps logo acima do mapa.
      var perto = document.querySelector(".footer-map");
      if (perto) perto.focus({ preventScroll: true });
      else focarConteudo();
    } else {
      gravar(alvo.getAttribute("data-cookies") === "todos");
    }
  });

  // ---------- Mudanças vindas de outra aba ou do cache ----------
  function reler() {
    escolha = ler();
    var mudou = aplicar();
    if (mudou) anunciar(escolha && escolha.terceiros ? "Mapa do Google ativado." : "Mapa do Google desligado.");
    if (!escolha) mostrarQuandoPuder();
    else fecharAviso();
  }
  window.addEventListener("storage", function (e) { if (e.key === CHAVE || e.key === null) reler(); });
  window.addEventListener("pageshow", function (e) { if (e.persisted) reler(); });

  // ---------- Início ----------
  function mostrarQuandoPuder() {
    // O aviso espera a abertura em vídeo terminar, para não cobrir a logo.
    var abertura = function () { return html.classList.contains("com-abertura") || html.classList.contains("abertura-elegivel"); };
    var mostrar = function () { setTimeout(abrirAviso, 900); };
    if (!abertura()) return mostrar();
    var observador = new MutationObserver(function () {
      if (abertura()) return;
      observador.disconnect();
      mostrar();
    });
    observador.observe(html, { attributes: true, attributeFilter: ["class"] });
  }
  if (escolha) aplicar();
  else mostrarQuandoPuder();

  // ---------- Índice das páginas de documentos ----------
  // A seção atual é a última cujo título já passou da linha de referência (30% da altura da tela).
  // Um clique no índice marca o destino na hora e segura a atualização até a rolagem chegar.
  var itens = Array.prototype.slice.call(document.querySelectorAll(".legal-indice a[href^='#']"));
  var secoes = Array.prototype.slice.call(document.querySelectorAll(".legal-secao"));
  if (itens.length && secoes.length) {
    var travadoAte = 0;
    var marcar = function (id) {
      itens.forEach(function (a) {
        if (id && a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    var atualizar = function () {
      if (Date.now() < travadoAte) return;
      var linha = window.innerHeight * 0.3;
      var atual = null;
      for (var i = 0; i < secoes.length; i++) {
        if (secoes[i].getBoundingClientRect().top <= linha) atual = secoes[i].id;
      }
      marcar(atual);
    };
    var pedido = false;
    window.addEventListener("scroll", function () {
      if (pedido) return;
      pedido = true;
      requestAnimationFrame(function () { pedido = false; atualizar(); });
    }, { passive: true });
    itens.forEach(function (a) {
      a.addEventListener("click", function () {
        marcar(a.getAttribute("href").slice(1));
        travadoAte = Date.now() + 1200;
        setTimeout(atualizar, 1300);
      });
    });
    atualizar();
  }
})();
