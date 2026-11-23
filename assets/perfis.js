// Perfis dos ortopedistas: seletor direto (plano de melhorias, rodadas 2 a 4).
// Sem JavaScript, os 7 perfis aparecem em sequência e o índice funciona como âncoras.
// Com JavaScript, só o perfil escolhido aparece; o índice, os chips do hero, a grade de
// especialidades, a equipe e o rodapé escolhem o perfil pelo #cuidado-x.
// Histórico: quem chega de fora do índice cria uma entrada nova (pushState); as trocas dentro do
// índice só substituem a atual (replaceState). Cada entrada guarda o perfil em history.state, e
// Voltar e Avançar restauram o perfil daquela entrada. Âncoras comuns (#contato) não mudam a escolha.
// Carrega com async (não segura o DOMContentLoaded, que é quando o navegador rola até a âncora);
// por isso espera o documento terminar de ser lido. A escolha inicial já foi feita pelo script inline.
function iniciarPerfis() {
  const section = document.getElementById("cuidados");
  if (!section) return;
  const articles = Array.from(section.querySelectorAll(".care-profile"));
  const indexBox = section.querySelector(".care-index");
  const links = Array.from(indexBox.querySelectorAll("a[href^='#cuidado-']"));
  const stage = section.querySelector(".care-stage");
  const header = document.querySelector(".site-header");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 900px)");
  // Marcado no <head> (index.html) na primeira rolagem, toque ou tecla antes deste script rodar.
  const interagiuAntes = Boolean(window.__artusInteragiu);
  let atual = null;
  // Só a última seleção vale: cliques rápidos, Voltar ou outra troca descartam as transições que
  // ainda esperavam as imagens (o perfil visível, a URL e o foco ficam sempre de acordo).
  let pedidoVt = 0;
  let transicaoAtiva = false;
  let visto = false;
  let contadorOrigem = 0;

  const porId = (id) => articles.find((article) => article.id === id);
  const comportamento = () => (reduce.matches ? "instant" : "smooth");

  // Fragmento malformado (ex.: #%E0%A4%A) não pode derrubar o seletor.
  function decodificar(texto) {
    try { return decodeURIComponent(texto); } catch (erro) { return ""; }
  }

  function reiniciar(elemento, classe) {
    elemento.classList.remove(classe);
    void elemento.offsetWidth;
    elemento.classList.add(classe);
    // A entrada sai quando termina: assim nenhuma mudança de classe depois a faz rodar de novo.
    if (classe === "entra") {
      elemento.addEventListener("animationend", function fim(e) {
        if (e.target !== elemento) return;
        elemento.classList.remove("entra");
        elemento.removeEventListener("animationend", fim);
      });
    }
  }

  // Estado da entrada em que a página está agora: ao atravessar o histórico, diz de onde se veio.
  // O <head> acompanha o histórico (window.__artusDe = entrada de onde se veio); este script avisa
  // quando muda a entrada atual.
  const gravou = () => { if (window.__artusGravou) window.__artusGravou(); };

  function gravarHistorico(alvo, modo, volta) {
    const hash = "#" + alvo.id;
    if (!modo) return;
    if (location.hash === hash) modo = "replace";
    if (modo === "push") history.pushState(volta ? { perfil: alvo.id, perfilChegada: volta } : { perfil: alvo.id }, "", hash);
    else history.replaceState(Object.assign({}, history.state, { perfil: alvo.id }), "", hash);
    gravou();
  }

  function escolher(id, { historico = null, animar = true, volta = null, entrada = true } = {}) {
    pedidoVt++;
    const alvo = porId(id) || articles[0];
    if (alvo !== atual) {
      articles.forEach((article) => { article.hidden = article !== alvo; });
      links.forEach((link) => {
        if (link.hash === "#" + alvo.id) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      mostrarNaFaixa(links.find((link) => link.hash === "#" + alvo.id));
      atual = alvo;
      if (animar && !reduce.matches) {
        if (entrada) reiniciar(alvo, "entra");
        // O desenho grande se traça a cada troca, depois que a seção já foi vista.
        if (visto) reiniciar(alvo, "traca");
      }
    }
    gravarHistorico(alvo, historico, volta);
    return alvo;
  }

  // No celular o índice é uma faixa rolável: o médico escolhido fica centralizado nela.
  function mostrarNaFaixa(link) {
    const faixa = link && link.closest("ol");
    if (!faixa || faixa.scrollWidth <= faixa.clientWidth) return;
    const desvio = link.getBoundingClientRect().left - faixa.getBoundingClientRect().left;
    faixa.scrollTo({ left: faixa.scrollLeft + desvio - (faixa.clientWidth - link.offsetWidth) / 2, behavior: "instant" });
  }

  function focarNome(article) {
    const nome = article.querySelector(".care-heading h3");
    if (nome) nome.focus({ preventScroll: true });
  }

  // Rola até o topo do elemento, abaixo do cabeçalho. O recuo (scroll-padding-top) é a altura
  // real do cabeçalho, medida pelo home.js.
  // A rolagem suave é feita aqui, quadro a quadro, para poder ser cancelada: a do navegador pode
  // começar atrasada e passar por cima da posição que o Voltar restaura.
  let animacao = 0;
  function cancelarRolagem() {
    if (animacao) cancelAnimationFrame(animacao);
    animacao = 0;
  }
  function rolarSuave(destino) {
    cancelarRolagem();
    const inicio = window.scrollY;
    const delta = destino - inicio;
    if (Math.abs(delta) < 2) return;
    const duracao = Math.min(700, 250 + Math.abs(delta) * 0.25);
    const t0 = performance.now();
    const passo = (agora) => {
      const t = Math.min(1, (agora - t0) / duracao);
      window.scrollTo({ top: inicio + delta * (1 - Math.pow(1 - t, 3)), behavior: "instant" });
      animacao = t < 1 ? requestAnimationFrame(passo) : 0;
    };
    animacao = requestAnimationFrame(passo);
  }
  // Quem rola ou digita durante a animação assume a rolagem.
  for (const tipo of ["wheel", "touchstart", "keydown", "pointerdown"]) {
    window.addEventListener(tipo, cancelarRolagem, { passive: true, capture: true });
  }

  function rolarAte(elemento, comportamentoForcado) {
    const margem = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const topo = Math.max(0, elemento.getBoundingClientRect().top + window.scrollY - margem);
    if ((comportamentoForcado || comportamento()) === "smooth") rolarSuave(topo);
    else {
      cancelarRolagem();
      window.scrollTo({ top: topo, behavior: "instant" });
    }
  }

  // No computador a página não pula: só se alinha quando o topo do perfil ficou acima do cabeçalho.
  function alinharPalco() {
    const limite = header ? header.getBoundingClientRect().bottom + 8 : 0;
    if (stage.getBoundingClientRect().top < limite) rolarAte(stage);
  }

  // Chama cb quando a rolagem para (a restauração do Voltar é animada com scroll-behavior: smooth):
  // a posição fica igual por 3 quadros seguidos, ou no máximo 1,5 s.
  function aposAssentar(cb) {
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

  // Visível na tela, abaixo do cabeçalho fixo.
  function visivel(elemento) {
    if (!elemento || elemento.closest("[hidden]")) return false;
    const r = elemento.getBoundingClientRect();
    const limite = header ? header.getBoundingClientRect().bottom : 0;
    return r.width > 0 && r.bottom > limite && r.top < window.innerHeight;
  }

  // Elemento no topo da tela, para manter o lugar de quem já rolou.
  function pontoDeAncora() {
    const y = Math.min((header ? header.getBoundingClientRect().bottom : 0) + 2, window.innerHeight - 1);
    const el = document.elementFromPoint(window.innerWidth / 2, y);
    if (!el || el === document.documentElement || el === document.body) return null;
    return { el, topo: el.getBoundingClientRect().top };
  }

  // Antes de criar a entrada nova, a entrada atual guarda o link que levou ao perfil:
  // ao Voltar, o foco retorna a ele (se estiver na tela).
  // A entrada de origem ganha a marca de saída (perfilSaida) e a do perfil, a mesma marca de chegada
  // (perfilChegada): a posição e a origem guardadas só valem ao voltar daquele perfil. Marcas
  // separadas, para uma entrada intermediária não perder o vínculo com a anterior.
  function marcarOrigem(link) {
    if (!link.dataset.origem) link.dataset.origem = String(++contadorOrigem);
    const volta = "v" + Date.now().toString(36) + contadorOrigem;
    // Guarda também a posição da página, para o Voltar devolver a pessoa exatamente aqui.
    history.replaceState(Object.assign({}, history.state, { origem: link.dataset.origem, y: Math.round(window.scrollY), perfilSaida: volta }), "");
    gravou();
    return volta;
  }

  // Depois da carga, as fotos e radiografias dos outros perfis vêm em segundo plano: a troca não
  // mostra o cartão vazio enquanto a imagem chega.
  const carregarOutras = () => {
    section.querySelectorAll(".care-profile img[loading='lazy']").forEach((img) => { img.loading = "eager"; });
  };
  if (document.readyState === "complete") setTimeout(carregarOutras, 300);
  else window.addEventListener("load", () => setTimeout(carregarOutras, 300), { once: true });
  const imagensProntas = (artigo) => Promise.race([
    Promise.all(Array.from(artigo.querySelectorAll("img")).map((img) => (img.decode ? img.decode().catch(() => {}) : null))),
    new Promise((ok) => setTimeout(ok, 250)),
  ]);

  // Os ouvintes entram antes de esconder os perfis: se algo falhar depois, os links continuam
  // funcionando como âncoras para os 7 perfis visíveis.
  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[href^='#cuidado-']");
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!porId(link.hash.slice(1))) return;
    event.preventDefault();
    const doIndice = indexBox.contains(link);
    // Troca pelo índice, no computador: o perfil que sai e o que entra se cruzam (View Transitions).
    const id = link.hash.slice(1);
    if (doIndice && desktop.matches && !reduce.matches && document.startViewTransition && porId(id) !== atual) {
      const raizHtml = document.documentElement;
      raizHtml.classList.add("vt-perfil");
      articles.forEach((a) => a.classList.remove("entra"));
      let novo = null;
      const pedido = ++pedidoVt;
      imagensProntas(porId(id)).then(() => {
      if (pedido !== pedidoVt) {
        if (!transicaoAtiva) raizHtml.classList.remove("vt-perfil");
        return;
      }
      raizHtml.classList.add("vt-perfil");
      transicaoAtiva = true;
      const yInicio = window.scrollY;
      const transicao = document.startViewTransition(() => { novo = escolher(id, { historico: "replace", entrada: false }); });
      transicao.updateCallbackDone.then(() => { if (novo) focarNome(novo); });
      transicao.finished.finally(() => {
        transicaoAtiva = false;
        raizHtml.classList.remove("vt-perfil");
        // Só realinha se a pessoa não rolou nem seguiu outro link durante a transição.
        if (Math.abs(window.scrollY - yInicio) < 2 && location.hash === "#" + id) alinharPalco();
      });
      });
      return;
    }
    const volta = doIndice ? null : marcarOrigem(link);
    const alvo = escolher(link.hash.slice(1), { historico: doIndice ? "replace" : "push", volta });
    if (!doIndice) rolarAte(section);
    else if (desktop.matches) alinharPalco();
    else rolarAte(alvo);
    focarNome(alvo);
  });

  // Voltar, Avançar ou um #cuidado-x digitado: a entrada diz qual perfil mostrar.
  // Nunca grava no histórico durante a restauração.
  function restaurar(estado, de) {
    const doHash = porId(location.hash.slice(1));
    let alvo;
    if (estado && Object.prototype.hasOwnProperty.call(estado, "perfil")) alvo = porId(estado.perfil) || articles[0];
    else if (doHash) alvo = doHash;
    else return; // outra âncora (#contato, #equipe…): a escolha continua a mesma
    // Volta à entrada de onde a pessoa saiu: a posição guardada é aplicada já, o que também
    // interrompe uma rolagem suave de ida ainda em curso (ela passaria por cima da restauração).
    cancelarRolagem();
    // Só ao voltar do perfil que esta entrada abriu valem a posição e a origem guardadas aqui.
    const retornoDoPerfil = Boolean(de && estado && de.perfilChegada && de.perfilChegada === estado.perfilSaida);
    // Volta de um link interno comum (#contato…) que saiu desta entrada: quem cuida do foco e da
    // rolagem é o home.js (link de origem) e o navegador; aqui só se reabre o perfil da entrada.
    const retornoDeAncora = Boolean(de && estado && de.ancoraChegada && de.ancoraChegada === estado.ancoraSaida);
    if (retornoDoPerfil && !doHash && typeof estado.y === "number") window.scrollTo({ top: estado.y, behavior: "instant" });
    const focoNosPerfis = section.contains(document.activeElement);
    escolher(alvo.id);
    if (retornoDeAncora) return;
    if (doHash === alvo) {
      // Depois da restauração de rolagem do navegador: o perfil fica logo abaixo do cabeçalho.
      requestAnimationFrame(() => {
        rolarAte(alvo, "instant");
        focarNome(alvo);
      });
      return;
    }
    // Entrada sem perfil: volta ao padrão sem mexer na rolagem restaurada pelo navegador.
    // Depois do quadro (o Chrome tira o foco ao chegar a uma âncora não focável), o foco volta ao
    // link que levou ao perfil, se estiver na tela; senão ao nome, se estiver na tela. Nunca a um
    // ponto fora da tela: aí o foco sai e o próximo Tab parte do começo do documento.
    const origem = retornoDoPerfil && estado.origem ? document.querySelector('[data-origem="' + estado.origem + '"]') : null;
    let decidido = false;
    const encerrarEspera = () => {
      decidido = true;
      window.removeEventListener("keydown", aoTecla, true);
      document.removeEventListener("focusin", aoFocarOutro, true);
    };
    // Pelo Tab, o link de origem vale mesmo antes de a rolagem restaurada chegar até ele.
    const decidir = (porTab) => {
      if (decidido) return;
      encerrarEspera();
      if (origem && origem.isConnected && (porTab || visivel(origem))) origem.focus({ preventScroll: true });
      else if (focoNosPerfis && visivel(alvo.querySelector(".care-heading h3"))) focarNome(alvo);
      else if (focoNosPerfis && document.activeElement && document.activeElement.blur) document.activeElement.blur();
    };
    // Tab durante a espera: o link de origem vira o ponto de partida antes de o Tab andar.
    const aoTecla = (event) => { if (event.key === "Tab") decidir(true); };
    // Foco que a pessoa pôs em outro controle cancela o foco agendado.
    const aoFocarOutro = (event) => { if (!decidido && event.target !== document.body) encerrarEspera(); };
    window.addEventListener("keydown", aoTecla, true);
    document.addEventListener("focusin", aoFocarOutro, true);
    // Espera o navegador restaurar a rolagem da entrada (animada, depois do popstate) antes de decidir.
    aposAssentar(() => decidir(false));
  }
  // O Chrome dispara popstate também em cliques de âncora; hashchange fica só de reserva.
  let tratadoAgora = false;
  window.addEventListener("popstate", (event) => {
    tratadoAgora = true;
    setTimeout(() => { tratadoAgora = false; });
    restaurar(event.state, window.__artusDe);
  });
  window.addEventListener("hashchange", () => {
    if (tratadoAgora) return;
    restaurar(history.state, window.__artusDe);
  });

  // Daqui em diante este script responde pelos #cuidado-x; o script inline (index.html) cede.
  window.__artusSeletor = true;

  // Se a pessoa já rolou antes deste script rodar, esconder 6 perfis não pode tirar a página do
  // lugar: guarda o que está no topo da tela e devolve depois.
  const ancora = interagiuAntes ? pontoDeAncora() : null;
  section.classList.add("care-js");
  const inicial = porId(location.hash.slice(1));
  escolher(inicial ? inicial.id : articles[0].id, { animar: false });
  if (ancora) {
    const ponto = ancora.el.isConnected && !ancora.el.closest("[hidden]") ? ancora.el : section;
    const desvio = ponto.getBoundingClientRect().top - ancora.topo;
    if (ponto === ancora.el && desvio) window.scrollBy({ top: desvio, behavior: "instant" });
  }
  // A entrada em que a página abriu também guarda o perfil (nenhum = o padrão).
  history.replaceState(Object.assign({}, history.state, { perfil: inicial ? inicial.id : null }), "");
  gravou();

  // Primeira vez que a seção aparece: o desenho do perfil escolhido se traça.
  if (!reduce.matches && "IntersectionObserver" in window) {
    section.classList.add("aguarda");
    const observador = new IntersectionObserver((entradas) => {
      if (!entradas.some((entrada) => entrada.isIntersecting)) return;
      observador.disconnect();
      visto = true;
      section.classList.remove("aguarda");
      reiniciar(atual, "traca");
    }, { threshold: 0.2 });
    observador.observe(stage);
  } else {
    visto = true;
  }

  // Chegada pela URL: esconder 6 perfis encurta a página depois que o navegador já rolou até a
  // âncora. A seção (#cuidado-x) ou o destino (#contato…) se realinha depois que a página assenta,
  // a menos que a pessoa já tenha rolado ou tocado na página: aí a rolagem é dela.
  const destinoInicial = inicial ? section : (() => {
    const id = decodificar(location.hash.slice(1));
    const el = id && id !== "inicio" ? document.getElementById(id) : null;
    return el && !section.contains(el) ? el : null;
  })();
  if (destinoInicial && !interagiuAntes) {
    const controle = new AbortController();
    const alinhar = () => { if (!controle.signal.aborted) rolarAte(destinoInicial, "instant"); };
    // Realinha enquanto a página assenta: carga, fontes e mudança de altura do cabeçalho.
    requestAnimationFrame(alinhar);
    window.addEventListener("load", alinhar, { once: true, signal: controle.signal });
    if (document.fonts) document.fonts.ready.then(() => requestAnimationFrame(alinhar));
    if (header && "ResizeObserver" in window) {
      const observador = new ResizeObserver(() => requestAnimationFrame(alinhar));
      observador.observe(header);
      controle.signal.addEventListener("abort", () => observador.disconnect());
    }
    setTimeout(() => controle.abort(), 2500);
    for (const tipo of ["pointerdown", "wheel", "touchstart", "keydown"]) {
      window.addEventListener(tipo, () => controle.abort(), { once: true, passive: true, signal: controle.signal });
    }
  }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciarPerfis, { once: true });
else iniciarPerfis();
