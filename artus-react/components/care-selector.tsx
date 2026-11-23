"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    /** true enquanto o CareSelector cuida dos #cuidado-x (o script inline de CareProfiles cede). */
    __artusSeletor?: boolean;
    /** Marcado no <head> (app/layout.tsx) na primeira rolagem, toque ou tecla. */
    __artusInteragiu?: boolean;
    /** Estado da entrada de onde se veio no último popstate (acompanhado no <head>). */
    __artusDe?: unknown;
    /** Avisa o rastreador do <head> que um script mudou a entrada atual do histórico. */
    __artusGravou?: () => void;
  }
}

/*
 * Seletor dos perfis (substitui a pilha presa na rolagem). O HTML vem do servidor com os sete
 * perfis; o script inline de CareProfiles já escolheu o inicial antes da pintura. Aqui:
 * - um clique no índice troca o perfil sem pular a página, atualiza a URL e leva o foco ao nome;
 * - um link #cuidado-x de fora (chips do hero, especialidades, rodapé, equipe) escolhe o perfil,
 *   alinha a seção (no celular, o perfil) ao topo e leva o foco ao nome;
 * - voltar/avançar no histórico reabre o perfil daquela entrada (URL ou history.state);
 * - numa URL com âncora, o destino é realinhado enquanto a página assenta;
 * - a seção ganha .is-visto na primeira vez que entra na tela (o desenho se traça, ver artus.css).
 */
export function CareSelector() {
  useEffect(() => {
    const secao = document.getElementById("cuidados");
    if (!secao) return;
    const perfis = Array.from(secao.querySelectorAll<HTMLElement>(".care-profile"));
    const links = Array.from(secao.querySelectorAll<HTMLAnchorElement>(".care-index a[data-perfil]"));
    const faixa = secao.querySelector<HTMLElement>(".care-index ol");
    const zona = secao.querySelector<HTMLElement>(".care-zone");
    const ids = perfis.map((p) => p.dataset.perfil ?? "");
    const movimento = matchMedia("(prefers-reduced-motion: reduce)");
    const celular = matchMedia("(max-width: 899.98px)");

    const idDoHash = (hash: string) => (hash.startsWith("#cuidado-") ? hash.slice(9) : "");

    // Só a última seleção vale: cliques rápidos, Voltar ou desmontagem descartam as transições que
    // ainda esperavam as imagens (perfil visível, URL e foco ficam sempre de acordo).
    let pedidoVt = 0;
    let transicaoAtiva = false;

    function marcarAtual(id: string, entrada = false) {
      pedidoVt++;
      const mudou = secao!.dataset.ativo !== id;
      secao!.dataset.ativo = id;
      perfis.forEach((p) => {
        p.hidden = p.dataset.perfil !== id;
        p.classList.remove("entra");
      });
      // Entrada animada só nas trocas sem View Transition; a classe sai quando a animação termina,
      // para nenhuma mudança de classe depois a fazer rodar de novo (era o "piscar").
      const novo = perfis[ids.indexOf(id)];
      if (entrada && mudou && novo && !movimento.matches) {
        novo.classList.add("entra");
        novo.addEventListener("animationend", function fim(e) {
          if (e.target !== novo) return;
          novo.classList.remove("entra");
          novo.removeEventListener("animationend", fim);
        });
      }
      links.forEach((link) => {
        if (link.dataset.perfil === id) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      // No celular o índice é uma faixa horizontal: mantém o atual à vista, sem mexer na página.
      const atual = links.find((link) => link.dataset.perfil === id)?.parentElement;
      if (faixa && atual && faixa.scrollWidth > faixa.clientWidth) {
        faixa.scrollTo({
          left: atual.offsetLeft - (faixa.clientWidth - atual.offsetWidth) / 2,
          behavior: movimento.matches ? "instant" : "smooth",
        });
      }
    }

    // A margem é o scroll-padding-top do <html>, que public/home.js mantém igual à altura real
    // do cabeçalho fixo (ele cresce quando quebra em duas linhas em telas estreitas).
    function rolarAte(alvo: HTMLElement, instantaneo = movimento.matches) {
      const margem = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const top = alvo.getBoundingClientRect().top + window.scrollY - margem;
      if (window.artusLenis) window.artusLenis.scrollTo(top, { immediate: instantaneo, force: true });
      else window.scrollTo({ top, behavior: instantaneo ? "instant" : "smooth" });
    }

    function focarNome(id: string) {
      document.getElementById(`nome-${id}`)?.focus({ preventScroll: true });
    }

    // Chama cb quando a rolagem para (a restauração do Voltar é animada com scroll-behavior: smooth):
    // a posição fica igual por 3 quadros seguidos, ou no máximo 1,5 s.
    function aposAssentar(cb: () => void) {
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
      window.setTimeout(verificar, 60);
    }

    // Depois da carga, as fotos e radiografias dos outros perfis vêm em segundo plano: a troca não
    // mostra o cartão vazio enquanto a imagem chega.
    const section = secao!;
    const carregarOutras = () => {
      section.querySelectorAll<HTMLImageElement>(".care-profile img[loading='lazy']").forEach((img) => { img.loading = "eager"; });
    };
    if (document.readyState === "complete") setTimeout(carregarOutras, 300);
    else window.addEventListener("load", () => setTimeout(carregarOutras, 300), { once: true });
    const imagensProntas = (artigo: HTMLElement | undefined) => Promise.race([
      Promise.all(Array.from(artigo?.querySelectorAll("img") ?? []).map((img) => (img.decode ? img.decode().catch(() => {}) : null))),
      new Promise<void>((ok) => setTimeout(ok, 250)),
    ]);

    // Visível na tela, abaixo do cabeçalho fixo.
    const cabecalho = document.querySelector<HTMLElement>(".site-header");
    function visivel(elemento: Element | null): elemento is HTMLElement {
      if (!elemento || elemento.closest("[hidden]")) return false;
      const r = elemento.getBoundingClientRect();
      const limite = cabecalho ? cabecalho.getBoundingClientRect().bottom : 0;
      return r.width > 0 && r.bottom > limite && r.top < window.innerHeight;
    }

    // Antes de criar a entrada nova, a entrada atual guarda o link que levou ao perfil:
    // ao Voltar, o foco retorna a ele (se estiver na tela).
    let contadorOrigem = 0;
    // A entrada de origem ganha a marca de saída (artusSaida) e a do perfil, a mesma marca de chegada
    // (artusChegada): a origem guardada só vale ao voltar daquele perfil. Marcas separadas, para uma
    // entrada intermediária não perder o vínculo com a anterior.
    function marcarOrigem(link: HTMLAnchorElement) {
      if (!link.dataset.origem) link.dataset.origem = String(++contadorOrigem);
      const volta = `v${Date.now().toString(36)}${contadorOrigem}`;
      history.replaceState({ ...(history.state ?? {}), artusOrigem: link.dataset.origem, artusSaida: volta }, "", location.href);
      gravou();
      return volta;
    }

    function escolher(id: string, origem: "indice" | "fora") {
      if (!ids.includes(id)) return;
      // Troca pelo índice, no computador: o perfil que sai e o que entra se cruzam (View Transitions).
      const raizHtml = document.documentElement;
      if (origem === "indice" && !celular.matches && !movimento.matches && document.startViewTransition && secao!.dataset.ativo !== id) {
        raizHtml.classList.add("vt-perfil");
        const pedido = ++pedidoVt;
        imagensProntas(perfis[ids.indexOf(id)]).then(() => {
          if (pedido !== pedidoVt) {
            if (!transicaoAtiva) raizHtml.classList.remove("vt-perfil");
            return;
          }
          raizHtml.classList.add("vt-perfil");
          transicaoAtiva = true;
          const yInicio = window.scrollY;
          const transicao = document.startViewTransition(() => marcarAtual(id));
          transicao.updateCallbackDone.then(() => focarNome(id));
          transicao.finished.finally(() => {
            transicaoAtiva = false;
            raizHtml.classList.remove("vt-perfil");
            // Só realinha se a pessoa não rolou nem seguiu outro link durante a transição.
            const parada = Math.abs(window.scrollY - yInicio) < 2 && location.hash === `#cuidado-${id}`;
            if (parada && zona && zona.getBoundingClientRect().top < 0) rolarAte(secao!.querySelector<HTMLElement>(".care-titulo") ?? secao!);
          });
        });
        return;
      }
      marcarAtual(id, true);
      const perfil = perfis[ids.indexOf(id)];
      if (origem === "fora") {
        rolarAte(celular.matches ? perfil : secao!);
      } else if (celular.matches) {
        rolarAte(perfil);
      } else if (zona && zona.getBoundingClientRect().top < 0) {
        // No computador o índice não pula a página; só volta ao começo do perfil se a pessoa
        // já tinha rolado para dentro do anterior.
        rolarAte(secao!.querySelector<HTMLElement>(".care-titulo") ?? secao!);
      }
      focarNome(id);
    }

    // Cada entrada do histórico guarda o perfil que estava aberto nela (history.state.artusPerfil),
    // inclusive a entrada em que a página abriu. O Next mistura este dado com o estado dele.
    const estadoCom = (id: string) => ({ ...(history.state ?? {}), artusPerfil: id });
    const atual = () => secao!.dataset.ativo ?? ids[0];
    type EstadoArtus = {
      artusPerfil?: string;
      artusOrigem?: string;
      artusSaida?: string;
      artusChegada?: string;
      ancoraSaida?: string;
      ancoraChegada?: string;
    };
    const gravou = () => window.__artusGravou?.();
    const guardarNaEntrada = (id: string) => {
      history.replaceState(estadoCom(id), "", location.href);
      gravou();
    };

    let ultimoEndereco = location.href;
    // Último clique numa âncora comum (#contato, #equipe...). O Chrome dispara popstate também
    // nesse clique: é navegação nova, não volta no histórico, e não muda o perfil. O marcador vale
    // uma vez só, para o destino clicado: um Voltar logo depois é tratado como volta no histórico.
    let cliqueEmAncora: { hash: string; t: number } | null = null;
    // Se o foco estava nos perfis. O navegador pode mandar o foco para o body ao voltar no
    // histórico, então o estado vem de focusin, não do activeElement da hora.
    let focoNosPerfis = false;
    const aoFocar = (event: FocusEvent) => { focoNosPerfis = secao!.contains(event.target as Node); };

    // Captura no window: roda antes do Lenis (anchors: true) e do salto nativo da âncora.
    function aoClicar(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const ancora = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href^='#']");
      if (ancora && !ancora.hash.startsWith("#cuidado-")) cliqueEmAncora = { hash: ancora.hash, t: performance.now() };
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href^='#cuidado-']");
      if (!link) return;
      const id = idDoHash(link.hash);
      if (!ids.includes(id)) return;
      event.preventDefault();
      event.stopPropagation();
      const doIndice = secao!.contains(link);
      // Trocas dentro do índice substituem a entrada; quem chega de fora cria uma nova,
      // para o Voltar retornar ao ponto de onde a pessoa saiu.
      if (doIndice) {
        history.replaceState(estadoCom(id), "", link.hash);
        gravou();
      }
      else {
        const volta = marcarOrigem(link);
        history.pushState({ artusPerfil: id, artusChegada: volta }, "", link.hash);
        gravou();
      }
      ultimoEndereco = location.href;
      escolher(id, doIndice ? "indice" : "fora");
    }

    // Voltar/avançar e trocas de hash. Um tratamento só por endereço (popstate e hashchange
    // chegam juntos); a restauração nunca grava no histórico.
    function aoMudarHistorico() {
      if (location.href === ultimoEndereco) return;
      ultimoEndereco = location.href;
      // De qual entrada se veio (acompanhado no <head>): a origem só vale ao voltar do perfil que
      // ela abriu; na volta de um link interno comum, quem cuida do foco é o public/home.js.
      const de = (window.__artusDe ?? null) as EstadoArtus | null;
      const clique = cliqueEmAncora;
      cliqueEmAncora = null;
      if (clique && clique.hash === location.hash && performance.now() - clique.t < 1000) {
        // Clique numa âncora comum: a entrada nova guarda o perfil que continua aberto.
        guardarNaEntrada(atual());
        return;
      }
      // Travessia no histórico: uma rolagem animada de ida ainda em curso (Lenis) não pode
      // passar por cima da posição que o navegador restaura para esta entrada.
      if (window.artusLenis) {
        window.artusLenis.stop();
        window.artusLenis.start();
      }
      const daUrl = idDoHash(location.hash);
      const estado = history.state as EstadoArtus | null;
      const guardado = estado?.artusPerfil;
      // Volta de um link interno comum (#contato…) que saiu desta entrada: o navegador restaura a
      // rolagem e o public/home.js devolve o foco ao link de origem; aqui só se reabre o perfil.
      if (de?.ancoraChegada && de.ancoraChegada === estado?.ancoraSaida) {
        marcarAtual(ids.includes(daUrl) ? daUrl : guardado && ids.includes(guardado) ? guardado : ids[0]);
        return;
      }
      if (ids.includes(daUrl)) {
        marcarAtual(daUrl);
        // Depois que o navegador restaura a rolagem da entrada: alinha o perfil abaixo do
        // cabeçalho, sem animação, e leva o foco ao nome.
        requestAnimationFrame(() => {
          rolarAte(perfis[ids.indexOf(daUrl)], true);
          focarNome(daUrl);
        });
      } else {
        // Entrada sem perfil na URL (sem hash, #inicio, #contato...): o perfil que ela guardou,
        // ou o padrão. A rolagem fica a que o navegador restaurou. No quadro seguinte (o Chrome
        // tira o foco ao chegar a uma âncora não focável), o foco volta ao link que levou ao perfil,
        // se estiver na tela; senão ao nome, se estiver na tela. Nunca a um ponto fora da tela:
        // aí o foco sai e o próximo Tab parte do começo do documento.
        const id = guardado && ids.includes(guardado) ? guardado : ids[0];
        const retornoDoPerfil = Boolean(de?.artusChegada && de.artusChegada === estado?.artusSaida);
        const origem = retornoDoPerfil && estado?.artusOrigem
          ? document.querySelector<HTMLElement>(`[data-origem="${estado.artusOrigem}"]`)
          : null;
        marcarAtual(id);
        let decidido = false;
        const encerrarEspera = () => {
          decidido = true;
          window.removeEventListener("keydown", aoTecla, true);
          document.removeEventListener("focusin", aoFocarOutro, true);
        };
        // Pelo Tab, o link de origem vale mesmo antes de a rolagem restaurada chegar até ele.
        const decidir = (porTab: boolean) => {
          if (decidido) return;
          encerrarEspera();
          if (origem && origem.isConnected && (porTab || visivel(origem))) origem.focus({ preventScroll: true });
          else if (focoNosPerfis && visivel(document.getElementById(`nome-${id}`))) focarNome(id);
          else if (focoNosPerfis) (document.activeElement as HTMLElement | null)?.blur?.();
        };
        // Tab durante a espera: o link de origem vira o ponto de partida antes de o Tab andar.
        const aoTecla = (event: KeyboardEvent) => { if (event.key === "Tab") decidir(true); };
        // Foco que a pessoa pôs em outro controle cancela o foco agendado.
        const aoFocarOutro = (event: FocusEvent) => {
          if (!decidido && event.target !== document.body) encerrarEspera();
        };
        window.addEventListener("keydown", aoTecla, true);
        document.addEventListener("focusin", aoFocarOutro, true);
        // Espera o navegador restaurar a rolagem da entrada (animada, depois do popstate) antes de decidir.
        aposAssentar(() => decidir(false));
      }
    }

    // Garante o estado inicial (o script inline já fez isso quando havia hash) e o guarda na
    // entrada em que a página abriu.
    const inicial = idDoHash(location.hash);
    marcarAtual(ids.includes(inicial) ? inicial : secao.dataset.ativo && ids.includes(secao.dataset.ativo) ? secao.dataset.ativo : ids[0]);
    guardarNaEntrada(atual());

    // URL com âncora: enquanto a página assenta (carga, fontes, cabeçalho mudando de altura,
    // perfis escondidos encurtando a página), o destino é realinhado. Para na primeira interação
    // ou em 2,5 s. Vale para #cuidado-x e para âncoras fora dos perfis (#contato, #equipe...).
    // Quem já rolou ou tocou na página antes de o seletor carregar manda na rolagem: sem realinhar.
    let assentando = Boolean(location.hash) && location.hash !== "#inicio" && !window.__artusInteragiu;
    const pararDeAssentar = () => { assentando = false; };
    function realinhar() {
      if (!assentando) return;
      const daUrl = idDoHash(location.hash);
      const alvo = ids.includes(daUrl)
        ? (celular.matches ? perfis[ids.indexOf(daUrl)] : secao!)
        : document.getElementById(location.hash.slice(1));
      if (alvo) rolarAte(alvo, true);
    }
    const sinaisDeInteracao = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const pararPelaPessoa = () => {
      pararDeAssentar();
      sinaisDeInteracao.forEach((tipo) => window.removeEventListener(tipo, pararPelaPessoa, true));
    };
    let assentamento: ResizeObserver | undefined;
    let prazoAssentar = 0;
    if (assentando) {
      sinaisDeInteracao.forEach((tipo) => window.addEventListener(tipo, pararPelaPessoa, { capture: true, passive: true }));
      requestAnimationFrame(realinhar);
      window.addEventListener("load", realinhar);
      document.fonts?.ready.then(realinhar);
      assentamento = new ResizeObserver(() => requestAnimationFrame(realinhar));
      assentamento.observe(document.body);
      const cabecalho = document.querySelector(".site-header");
      if (cabecalho) assentamento.observe(cabecalho);
      prazoAssentar = window.setTimeout(pararPelaPessoa, 2500);
    }

    // Espessura do traço grande: a altura exibida do desenho define a largura em unidades do
    // desenho (ver ".traco path" em artus.css). Só o perfil visível tem altura.
    const medida = new ResizeObserver((entradas) => {
      for (const entrada of entradas) {
        const altura = entrada.contentRect.height;
        if (altura > 0) (entrada.target as SVGElement).style.setProperty("--traco-h", altura.toFixed(1));
      }
    });
    secao.querySelectorAll<SVGElement>(".care-drawing").forEach((svg) => medida.observe(svg));

    const observador = new IntersectionObserver((entradas) => {
      if (entradas.some((e) => e.isIntersecting)) {
        secao.classList.add("is-visto");
        observador.disconnect();
      }
    }, { rootMargin: "0px 0px -20% 0px" });
    observador.observe(secao);

    // Daqui em diante o seletor responde pelos hashes; o ouvinte do script inline sai de cena.
    window.__artusSeletor = true;
    window.addEventListener("click", aoClicar, true);
    document.addEventListener("focusin", aoFocar);
    window.addEventListener("popstate", aoMudarHistorico);
    window.addEventListener("hashchange", aoMudarHistorico);
    return () => {
      window.__artusSeletor = false;
      // Descarta transições que ainda esperavam imagens quando o componente sai.
      pedidoVt++;
      pararPelaPessoa();
      assentamento?.disconnect();
      clearTimeout(prazoAssentar);
      window.removeEventListener("load", realinhar);
      medida.disconnect();
      observador.disconnect();
      window.removeEventListener("click", aoClicar, true);
      document.removeEventListener("focusin", aoFocar);
      window.removeEventListener("popstate", aoMudarHistorico);
      window.removeEventListener("hashchange", aoMudarHistorico);
    };
  }, []);

  return null;
}
