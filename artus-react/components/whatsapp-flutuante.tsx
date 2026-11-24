"use client";

/* eslint-disable @next/next/no-img-element -- Fotos locais já otimizadas, as mesmas da equipe. */
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { ATALHOS_WHATSAPP, DICA_CONVERSA, TOTAL_ESPECIALISTAS, juntarSugestao, linkWhatsApp, mensagemAtalho } from "@/lib/whatsapp";

type Atalho = (typeof ATALHOS_WHATSAPP)[number];

function Contato({ atalho }: { atalho: Atalho }) {
  return (
    <>
      <span className={`whats-fotos${atalho.fotos.length > 1 ? " whats-fotos--dupla" : ""}`} aria-hidden="true">
        {atalho.fotos.map((f) => (
          <img key={f} src={`/assets/${f}.webp`} alt="" width="44" height="44" decoding="async" loading="lazy" />
        ))}
      </span>
      <span className="whats-opcao-texto">
        <strong>{atalho.nomes}</strong>
        <span>{atalho.especialidade}</span>
      </span>
    </>
  );
}

/**
 * Atalho do WhatsApp no canto inferior direito. Abre uma mini-janela no estilo de conversa: primeiro a
 * pessoa escolhe o especialista; depois o atendimento pergunta onde é a dor, ela responde (resposta
 * rápida ou texto livre) e o envio abre o WhatsApp da recepção com a área e o relato.
 * Janela não modal: Esc, o botão de fechar ou um clique fora fecham e o foco volta ao botão.
 * A versão estática (index.html + home.js) repete esta marcação e este comportamento.
 */
export function WhatsappFlutuante() {
  const [aberta, setAberta] = useState(false);
  const [vista, setVista] = useState(false);
  const [area, setArea] = useState<Atalho["area"] | null>(null);
  const [relato, setRelato] = useState("");
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const janela = useRef<HTMLDivElement>(null);
  const chat = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const id = useId();
  const idJanela = `whats-janela-${id}`;
  const idTitulo = `whats-titulo-${id}`;
  const idPergunta = `whats-pergunta-${id}`;
  const idCampo = `whats-campo-${id}`;
  const atalho = ATALHOS_WHATSAPP.find((a) => a.area === area);

  function fechar(devolverFoco: boolean) {
    setAberta(false);
    if (devolverFoco) botao.current?.focus();
  }

  function escolher(a: Atalho) {
    setArea(a.area);
    setRelato("");
    requestAnimationFrame(() => chat.current?.focus({ preventScroll: true }));
  }

  function voltar() {
    const anterior = area;
    setArea(null);
    requestAnimationFrame(() => raiz.current?.querySelector<HTMLElement>(`.whats-opcao[data-area="${anterior}"]`)?.focus());
  }

  // O campo já existe: foca na hora do toque e grava o valor direto, para o cursor ficar no fim e a
  // pessoa continuar escrevendo sem perder nenhuma letra. O que ela já escreveu fica (juntarSugestao).
  function sugerir(sugestao: string) {
    const c = campo.current;
    const texto = juntarSugestao(c?.value ?? relato, sugestao, atalho?.opcoes.map((o) => o.texto) ?? []);
    if (c) {
      c.value = texto;
      c.focus();
      c.setSelectionRange(texto.length, texto.length);
    }
    setRelato(texto);
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    if (!atalho || !relato.trim()) return;
    const url = linkWhatsApp(mensagemAtalho(atalho.especialidade, relato));
    const aba = window.open(url, "_blank");
    // Se o navegador bloquear a nova aba, abre o WhatsApp nesta mesma aba: o relato não se perde.
    if (!aba) {
      window.location.assign(url);
      return;
    }
    aba.opener = null;
    fechar(true);
    setArea(null);
    setRelato("");
  }

  useEffect(() => {
    if (!aberta) return;
    janela.current?.focus({ preventScroll: true });
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Só devolve o foco ao botão se ele estava na janela; se a pessoa já foi para outro ponto, fica lá.
      const dentro = raiz.current?.contains(document.activeElement) || document.activeElement === document.body;
      setAberta(false);
      if (dentro) botao.current?.focus();
    };
    const fora = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberta(false);
    };
    document.addEventListener("keydown", tecla);
    document.addEventListener("pointerdown", fora);
    return () => {
      document.removeEventListener("keydown", tecla);
      document.removeEventListener("pointerdown", fora);
    };
  }, [aberta]);

  return (
    <div className={`whats-flutuante${aberta ? " aberta" : ""}`} ref={raiz}>
      <button
        ref={botao}
        type="button"
        className="whats-botao"
        aria-expanded={aberta}
        aria-controls={idJanela}
        onClick={() => {
          setAberta((a) => !a);
          setVista(true);
        }}
      >
        <IconeWhatsApp className="whats-botao-icone" />
        <span className="sr-only">Agendar pelo WhatsApp: escolha entre {TOTAL_ESPECIALISTAS} especialistas</span>
        {!vista && <span className="whats-selo" aria-hidden="true">{TOTAL_ESPECIALISTAS}</span>}
      </button>

      <div className="whats-janela" id={idJanela} ref={janela} role="dialog" aria-labelledby={idTitulo} tabIndex={-1}>
        <div className="whats-topo">
          <button type="button" className="whats-voltar" onClick={voltar} hidden={!atalho}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" /></svg>
            <span className="sr-only">Voltar à lista de especialistas</span>
          </button>
          <span className="whats-topo-avatar" aria-hidden="true"><img src="/assets/logo-color.svg" alt="" width="32" height="14" /></span>
          <div className="whats-topo-texto">
            <p className="whats-topo-nome" id={idTitulo}>Clínica Artus</p>
            <p className="whats-topo-status">Agendamento pelo WhatsApp</p>
          </div>
          <button type="button" className="whats-fechar" onClick={() => fechar(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" /></svg>
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        <div className="whats-conversa whats-inicio" hidden={!!atalho}>
          <p className="whats-balao">Olá! Escolha o especialista com quem você quer ser atendido.</p>
          <ul className="whats-lista">
            {ATALHOS_WHATSAPP.map((a) => (
              <li key={a.area}>
                <button type="button" className="whats-opcao" data-area={a.area} onClick={() => escolher(a)}>
                  <Contato atalho={a} />
                  <svg className="whats-enviar" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {atalho && (
          <div className="whats-chat" ref={chat} role="group" aria-labelledby={idPergunta} tabIndex={-1} key={atalho.area}>
            <div className="whats-conversa">
              <div className="whats-balao whats-balao--meu"><Contato atalho={atalho} /></div>
              <p className="whats-balao" id={idPergunta}>{atalho.pergunta}</p>
              <p className="whats-balao">{DICA_CONVERSA}</p>
              <div className="whats-sugestoes" role="group" aria-label="Respostas rápidas">
                {atalho.opcoes.map((o) => (
                  <button key={o.rotulo} type="button" className="whats-sugestao" onClick={() => sugerir(o.texto)}>{o.rotulo}</button>
                ))}
              </div>
            </div>
            <form className="whats-envio" onSubmit={enviar}>
              <label htmlFor={idCampo} className="sr-only">Descreva onde dói</label>
              <input
                ref={campo}
                id={idCampo}
                className="whats-campo"
                type="text"
                maxLength={300}
                autoComplete="off"
                enterKeyHint="send"
                placeholder={atalho.exemplo}
                value={relato}
                onChange={(e) => setRelato(e.target.value)}
              />
              <button type="submit" className="whats-mandar" disabled={!relato.trim()}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.4 20.4 21 12 3.4 3.6v6.5L15 12 3.4 13.9z" /></svg>
                <span className="sr-only">Enviar pelo WhatsApp (abre em nova aba)</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
