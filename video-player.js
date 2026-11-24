// Player do vídeo institucional (versão estática e Next.js usam este mesmo arquivo).
// Reproduzir e pausar, linha do tempo para voltar e adiantar (arrastar, clicar ou setas), som e tela cheia.
// A barra de progresso anda a cada quadro (requestAnimationFrame) e só usa transform, para ficar fluida.
(function () {
  "use strict";

  function formatar(s) {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return m + ":" + String(ss).padStart(2, "0");
  }

  function iniciar(raiz) {
    if (raiz.dataset.pronto) return;
    raiz.dataset.pronto = "1";

    const quadro = raiz.querySelector(".filme-quadro");
    const video = raiz.querySelector("video:not(.filme-previa)");
    const previa = raiz.querySelector(".filme-previa");
    const capa = raiz.querySelector(".filme-capa");
    const capaTitulo = raiz.querySelector(".filme-capa strong");
    const tocar = raiz.querySelector(".filme-tocar");
    const som = raiz.querySelector(".filme-som");
    const tela = raiz.querySelector(".filme-tela");
    const linha = raiz.querySelector(".filme-linha");
    const progresso = raiz.querySelector(".filme-progresso");
    const carregado = raiz.querySelector(".filme-carregado");
    const cabeca = raiz.querySelector(".filme-cabeca");
    const dica = raiz.querySelector(".filme-dica");
    const atual = raiz.querySelector("[data-atual]");
    const total = raiz.querySelector("[data-total]");
    const tituloOriginal = capaTitulo ? capaTitulo.textContent : "";
    const rotuloOriginal = capa.getAttribute("aria-label") || "";

    let arrastando = false;
    let tocavaAntes = false;
    let quadroAnim = 0;
    let ocioso = 0;
    let alvoArraste = 0;

    const duracao = () => (isFinite(video.duration) && video.duration > 0 ? video.duration : 0);

    function pintar(t) {
      const d = duracao();
      const p = d ? Math.min(1, Math.max(0, t / d)) : 0;
      progresso.style.transform = "scaleX(" + p + ")";
      cabeca.style.transform = "translateX(" + p * linha.clientWidth + "px)";
      atual.textContent = formatar(t);
      linha.setAttribute("aria-valuenow", String(Math.round(t)));
      linha.setAttribute("aria-valuetext", formatar(t) + " de " + formatar(d));
    }

    function pintarCarregado() {
      const d = duracao();
      if (!d || !video.buffered.length) return;
      let fim = 0;
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= video.currentTime + 0.5) fim = Math.max(fim, video.buffered.end(i));
      }
      carregado.style.transform = "scaleX(" + Math.min(1, fim / d) + ")";
    }

    function laco() {
      if (!arrastando) pintar(video.currentTime);
      quadroAnim = video.paused ? 0 : requestAnimationFrame(laco);
    }

    function mostrarControles() {
      raiz.classList.remove("filme--ocioso");
      clearTimeout(ocioso);
      if (!video.paused && !arrastando) {
        ocioso = setTimeout(() => {
          if (!quadro.contains(document.activeElement) || document.activeElement === video) raiz.classList.add("filme--ocioso");
        }, 2600);
      }
    }

    function alternar() {
      if (video.paused || video.ended) {
        const r = video.play();
        if (r && r.catch) r.catch(() => {});
      } else {
        video.pause();
      }
    }

    function irPara(t) {
      const d = duracao();
      if (!d) return;
      video.currentTime = Math.min(d - 0.05, Math.max(0, t));
      pintar(video.currentTime);
      mostrarControles();
    }

    function tempoDoPonteiro(e) {
      const r = linha.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      return { t: p * duracao(), x: p * r.width };
    }

    // Estado do vídeo
    video.addEventListener("play", () => {
      raiz.classList.add("filme--tocando", "filme--iniciado");
      raiz.classList.remove("filme--fim");
      tocar.setAttribute("aria-label", "Pausar");
      if (!quadroAnim) quadroAnim = requestAnimationFrame(laco);
      mostrarControles();
    });
    video.addEventListener("pause", () => {
      raiz.classList.remove("filme--tocando", "filme--carregando");
      tocar.setAttribute("aria-label", "Reproduzir");
      mostrarControles();
      pintar(video.currentTime);
    });
    video.addEventListener("ended", () => {
      raiz.classList.add("filme--fim");
      raiz.classList.remove("filme--iniciado");
      if (capaTitulo) capaTitulo.textContent = "Assistir de novo";
      capa.setAttribute("aria-label", "Assistir de novo ao vídeo da Clínica Artus");
      // Os controles somem com a capa: o foco que estava neles passa para a capa, sem se perder.
      if (quadro.contains(document.activeElement) && document.activeElement !== capa) capa.focus({ preventScroll: true });
    });
    video.addEventListener("loadedmetadata", () => {
      total.textContent = formatar(duracao());
      linha.setAttribute("aria-valuemax", String(Math.round(duracao())));
      pintar(video.currentTime);
    });
    video.addEventListener("progress", pintarCarregado);
    video.addEventListener("timeupdate", () => { pintarCarregado(); if (video.paused && !arrastando) pintar(video.currentTime); });
    video.addEventListener("waiting", () => raiz.classList.add("filme--carregando"));
    ["playing", "canplay", "seeked"].forEach((ev) => video.addEventListener(ev, () => raiz.classList.remove("filme--carregando")));
    video.addEventListener("volumechange", () => {
      const mudo = video.muted || video.volume === 0;
      raiz.classList.toggle("filme--mudo", mudo);
      som.setAttribute("aria-label", mudo ? "Ativar som" : "Desativar som");
    });

    // Capa (primeiro play e "assistir de novo")
    capa.addEventListener("click", () => {
      if (video.ended) video.currentTime = 0;
      if (capaTitulo) capaTitulo.textContent = tituloOriginal;
      capa.setAttribute("aria-label", rotuloOriginal);
      alternar();
      tocar.focus({ preventScroll: true });
    });

    // Botões
    tocar.addEventListener("click", alternar);
    video.addEventListener("click", alternar);
    som.addEventListener("click", () => { video.muted = !video.muted; if (!video.muted && video.volume === 0) video.volume = 1; mostrarControles(); });

    function emTelaCheia() { return document.fullscreenElement === quadro || document.webkitFullscreenElement === quadro; }
    function alternarTela() {
      if (emTelaCheia()) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else if (quadro.requestFullscreen) {
        quadro.requestFullscreen().catch(() => {});
      } else if (quadro.webkitRequestFullscreen) {
        quadro.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iPhone
      }
    }
    tela.addEventListener("click", alternarTela);
    video.addEventListener("dblclick", alternarTela);
    ["fullscreenchange", "webkitfullscreenchange"].forEach((ev) => document.addEventListener(ev, () => {
      const cheia = emTelaCheia();
      raiz.classList.toggle("filme--tela-cheia", cheia);
      tela.setAttribute("aria-label", cheia ? "Sair da tela cheia" : "Tela cheia");
      pintar(video.currentTime);
    }));

    // Linha do tempo: arrastar (mouse, toque e caneta), clicar e prévia do tempo no hover
    linha.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || !duracao()) return;
      e.preventDefault();
      linha.setPointerCapture(e.pointerId);
      arrastando = true;
      tocavaAntes = !video.paused;
      raiz.classList.add("filme--arrastando");
      if (tocavaAntes) video.pause();
      const { t } = tempoDoPonteiro(e);
      alvoArraste = t;
      pintar(t);
      if (video.fastSeek) video.fastSeek(t); else video.currentTime = t;
      linha.focus({ preventScroll: true });
    });
    linha.addEventListener("pointermove", (e) => {
      if (!duracao()) return;
      const { t, x } = tempoDoPonteiro(e);
      dica.textContent = formatar(t);
      dica.style.transform = "translateX(" + x + "px)";
      if (!arrastando) return;
      alvoArraste = t;
      pintar(t);
      if (video.fastSeek) video.fastSeek(t); else video.currentTime = t;
    });
    function soltar() {
      if (!arrastando) return;
      arrastando = false;
      raiz.classList.remove("filme--arrastando");
      video.currentTime = alvoArraste;
      pintar(alvoArraste);
      if (tocavaAntes) alternar();
      mostrarControles();
    }
    linha.addEventListener("pointerup", soltar);
    linha.addEventListener("pointercancel", soltar);
    linha.addEventListener("lostpointercapture", soltar);
    linha.addEventListener("keydown", (e) => {
      const d = duracao();
      let alvo = null;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") alvo = video.currentTime + 5;
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") alvo = video.currentTime - 5;
      else if (e.key === "PageUp") alvo = video.currentTime + 10;
      else if (e.key === "PageDown") alvo = video.currentTime - 10;
      else if (e.key === "Home") alvo = 0;
      else if (e.key === "End") alvo = d;
      if (alvo === null) return;
      e.preventDefault();
      e.stopPropagation();
      irPara(alvo);
    });

    // Atalhos com o foco no player: espaço/K pausa, setas voltam e adiantam 5 s, M tira o som, F tela cheia
    quadro.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key.toLowerCase();
      const emBotao = e.target.closest("button");
      if ((k === " " && !emBotao) || k === "k") { e.preventDefault(); alternar(); }
      else if (k === "m") { e.preventDefault(); som.click(); }
      else if (k === "f") { e.preventDefault(); alternarTela(); }
      else if ((k === "arrowright" || k === "arrowleft") && raiz.classList.contains("filme--iniciado")) {
        e.preventDefault();
        irPara(video.currentTime + (k === "arrowright" ? 5 : -5));
      }
    });

    // Controles somem com o vídeo tocando e o ponteiro parado; voltam com qualquer movimento ou foco
    quadro.addEventListener("pointermove", mostrarControles);
    quadro.addEventListener("pointerdown", mostrarControles);
    quadro.addEventListener("focusin", mostrarControles);
    quadro.addEventListener("pointerleave", () => { if (!video.paused && !arrastando) raiz.classList.add("filme--ocioso"); });

    // Sai da tela: pausa, para não seguir tocando com som onde ninguém vê
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((itens) => {
        itens.forEach((i) => { if (!i.isIntersecting && !video.paused && !emTelaCheia()) video.pause(); });
      }, { threshold: 0.15 }).observe(quadro);
    }

    // Prévia da capa: trechos sem som, em loop, só enquanto a capa está na tela. Com "reduzir movimento"
    // ligado, fica a foto parada.
    if (previa) {
      previa.muted = true;
      const parado = window.matchMedia("(prefers-reduced-motion: reduce)");
      let naTela = false;
      const atualizarPrevia = () => {
        const deve = naTela && !parado.matches && !raiz.classList.contains("filme--iniciado");
        if (deve && previa.paused) {
          const r = previa.play();
          if (r && r.catch) r.catch(() => {});
        } else if (!deve && !previa.paused) previa.pause();
      };
      previa.addEventListener("playing", () => raiz.classList.add("filme--previa"));
      video.addEventListener("play", atualizarPrevia);
      video.addEventListener("ended", atualizarPrevia);
      if (parado.addEventListener) parado.addEventListener("change", atualizarPrevia);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((itens) => { naTela = itens[0].isIntersecting; atualizarPrevia(); }, { rootMargin: "120px 0px" }).observe(quadro);
      } else { naTela = true; atualizarPrevia(); }
    }

    window.addEventListener("resize", () => pintar(arrastando ? alvoArraste : video.currentTime));
    if (video.readyState >= 1) video.dispatchEvent(new Event("loadedmetadata"));
  }

  function tudo() { document.querySelectorAll("[data-filme]").forEach(iniciar); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tudo);
  else tudo();
  // Next.js: a página pode montar o player depois do script.
  window.addEventListener("load", tudo);
})();
