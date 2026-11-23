"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import type { PerguntaFaq, TemaFaq } from "@/lib/faq";

/**
 * FAQ em abas (modelo "faq-tabs"): a cor sobe para dentro da aba escolhida, o painel novo entra
 * esmaecendo e cada pergunta abre com animação de altura e o "+" girando. Todos os painéis ficam
 * no DOM (só o escolhido visível): cada aba aponta para o seu painel e o foco nunca encontra o
 * painel anterior durante a troca. Adaptado ao site: abas com
 * role="tab" e setas do teclado, respostas fora da leitura quando fechadas, movimento reduzido
 * respeitado (MotionConfig) e o visual nas classes .faq-* do artus.css, iguais às da versão estática.
 */
type FAQProps = {
  title: string;
  subtitle: string;
  temas: TemaFaq[];
  /** Linha abaixo da lista, por exemplo o convite para falar com a recepção. */
  rodape?: ReactNode;
  id?: string;
};

export function FAQ({ title, subtitle, temas, rodape, id = "perguntas" }: FAQProps) {
  const [selecionado, setSelecionado] = useState(temas[0]?.id ?? "");
  const base = useId();

  return (
    <MotionConfig reducedMotion="user">
      <section className="faq" id={id} aria-labelledby={`${base}-titulo`}>
        <div className="container faq-container">
          <FAQHeader title={title} subtitle={subtitle} tituloId={`${base}-titulo`} />
          <FAQTabs temas={temas} selecionado={selecionado} selecionar={setSelecionado} base={base} />
          <FAQList temas={temas} selecionado={selecionado} base={base} />
          {rodape}
        </div>
      </section>
    </MotionConfig>
  );
}

function FAQHeader({ title, subtitle, tituloId }: { title: string; subtitle: string; tituloId: string }) {
  return (
    <div className="faq-cabeca">
      <p className="faq-sobre">{subtitle}</p>
      <h2 id={tituloId} tabIndex={-1}>{title}</h2>
      <span className="faq-brilho" aria-hidden="true" />
    </div>
  );
}

function FAQTabs({ temas, selecionado, selecionar, base }: { temas: TemaFaq[]; selecionado: string; selecionar: (id: string) => void; base: string }) {
  const abas = useRef<(HTMLButtonElement | null)[]>([]);

  function teclado(event: KeyboardEvent<HTMLDivElement>) {
    const atual = temas.findIndex((t) => t.id === selecionado);
    const destino = {
      ArrowRight: (atual + 1) % temas.length,
      ArrowLeft: (atual - 1 + temas.length) % temas.length,
      Home: 0,
      End: temas.length - 1,
    }[event.key];
    if (destino === undefined) return;
    event.preventDefault();
    selecionar(temas[destino].id);
    abas.current[destino]?.focus();
  }

  return (
    <div className="faq-abas" role="tablist" aria-label="Temas das perguntas" onKeyDown={teclado}>
      {temas.map((tema, i) => {
        const ativa = tema.id === selecionado;
        return (
          <button
            key={tema.id}
            ref={(el) => { abas.current[i] = el; }}
            type="button"
            role="tab"
            id={`${base}-aba-${tema.id}`}
            aria-selected={ativa}
            aria-controls={`${base}-painel-${tema.id}`}
            tabIndex={ativa ? 0 : -1}
            className="faq-aba"
            onClick={() => selecionar(tema.id)}
          >
            <span className="faq-aba-rotulo">{tema.rotulo}</span>
            <AnimatePresence>
              {ativa && (
                <motion.span
                  className="faq-aba-fundo"
                  aria-hidden="true"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5, ease: "backIn" }}
                />
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}

function FAQList({ temas, selecionado, base }: { temas: TemaFaq[]; selecionado: string; base: string }) {
  const reduzir = useReducedMotion();
  return (
    <div className="faq-lista">
      {temas.map((tema) => {
        const ativo = tema.id === selecionado;
        return (
          <motion.div
            key={tema.id}
            className="faq-painel"
            role="tabpanel"
            id={`${base}-painel-${tema.id}`}
            aria-labelledby={`${base}-aba-${tema.id}`}
            hidden={!ativo}
            initial={false}
            animate={ativo ? "visivel" : "oculto"}
            variants={{ oculto: { opacity: 0, y: 20 }, visivel: { opacity: 1, y: 0 } }}
            transition={reduzir ? { duration: 0 } : { duration: 0.5, ease: "backIn" }}
          >
            {tema.perguntas.map((item, i) => (
              <FAQItem key={item.pergunta} {...item} id={`${base}-${tema.id}-${i}`} />
            ))}
          </motion.div>
        );
      })}
    </div>
  );
}

function FAQItem({ pergunta, resposta, id }: PerguntaFaq & { id: string }) {
  const [aberto, setAberto] = useState(false);
  const reduzir = useReducedMotion();
  return (
    <motion.div className="faq-item" data-aberto={aberto} animate={aberto ? "open" : "closed"}>
      <h3 className="faq-item-titulo">
        <button
          type="button"
          className="faq-pergunta"
          id={`${id}-pergunta`}
          aria-expanded={aberto}
          aria-controls={`${id}-resposta`}
          onClick={() => setAberto(!aberto)}
        >
          <span className="faq-pergunta-texto">{pergunta}</span>
          <motion.span
            className="faq-mais-icone"
            aria-hidden="true"
            variants={{ open: { rotate: 45 }, closed: { rotate: 0 } }}
            transition={{ duration: 0.2 }}
          >
            <Plus strokeWidth={1.8} />
          </motion.span>
        </button>
      </h3>
      <motion.div
        className="faq-resposta"
        id={`${id}-resposta`}
        role="region"
        aria-labelledby={`${id}-pergunta`}
        inert={!aberto}
        initial={false}
        animate={{ height: aberto ? "auto" : 0, marginBottom: aberto ? 16 : 0 }}
        transition={reduzir ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
      >
        <p>{resposta}</p>
      </motion.div>
    </motion.div>
  );
}
