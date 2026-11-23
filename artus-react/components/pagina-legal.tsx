/* eslint-disable @next/next/no-html-link-for-pages -- A inicial depende de carga completa (abertura, rolagem e scripts em public/): os links para ela são <a> comuns, sem navegação no cliente. */
import { Fragment, type ReactNode } from "react";
import { PhoneCall, SlidersHorizontal } from "lucide-react";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { SiteFooter } from "@/components/site-footer";
import { TopoInterno } from "@/components/topo-interno";
import { TELEFONE, TELEFONE_TEXTO } from "@/lib/contato";
import { ATUALIZADO_EM, ATUALIZADO_ISO, paginasLegais, type Bloco, type PaginaLegal } from "@/lib/paginas-legais";
import { MENSAGEM_DUVIDA, linkWhatsApp } from "@/lib/whatsapp";

/** Transforma [texto](/caminho) em link; o resto fica como texto. */
function comLinks(texto: string): ReactNode {
  const partes = texto.split(/\[([^\]]+)\]\(([^)]+)\)/);
  if (partes.length === 1) return texto;
  return partes.map((parte, i) => {
    if (i % 3 === 0) return <Fragment key={i}>{parte}</Fragment>;
    if (i % 3 === 1) return <a key={i} href={partes[i + 1]}>{parte}</a>;
    return null;
  });
}

function BlocoLegal({ bloco }: { bloco: Bloco }) {
  if (typeof bloco === "string") return <p>{comLinks(bloco)}</p>;
  if ("lista" in bloco) return <ul>{bloco.lista.map((item) => <li key={item}>{comLinks(item)}</li>)}</ul>;
  if ("tabela" in bloco) {
    return (
      <div className="legal-tabela" role="region" aria-label="Tabela de cookies e registros" tabIndex={0}>
        <table>
          <thead><tr>{bloco.tabela.cabecalho.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
          <tbody>
            {bloco.tabela.linhas.map((linha) => (
              <tr key={linha[0]}>{linha.map((celula, i) => (i === 0 ? <th key={i} scope="row">{celula}</th> : <td key={i}>{celula}</td>))}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <p>
      <button type="button" className="legal-botao" data-abrir-cookies>
        <SlidersHorizontal strokeWidth={1.8} aria-hidden="true" />
        {bloco.preferencias}
      </button>
    </p>
  );
}

const numero = (i: number) => String(i + 1).padStart(2, "0");

/** Página de documento (privacidade, cookies, termos): capa, índice lateral, resumo e seções. */
export function PaginaLegalView({ pagina }: { pagina: PaginaLegal }) {
  return (
    <>
      <TopoInterno />
      <main id="conteudo" className="legal">
        <section className="legal-capa" aria-labelledby="legal-titulo">
          <div className="container">
            <nav className="legal-trilha" aria-label="Você está em">
              <ol>
                <li><a href="/">Início</a></li>
                <li aria-current="page">{pagina.titulo}</li>
              </ol>
            </nav>
            <p className="legal-rotulo">Documentos da clínica</p>
            <h1 id="legal-titulo">{pagina.titulo}</h1>
            <p className="legal-descricao">{pagina.descricao}</p>
            <div className="legal-meta">
              <p className="legal-data">Última atualização: <time dateTime={ATUALIZADO_ISO}>{ATUALIZADO_EM}</time></p>
              <nav className="legal-docs" aria-label="Documentos">
                {paginasLegais.map((doc) => (
                  <a key={doc.slug} href={`/${doc.slug}`} aria-current={doc.slug === pagina.slug ? "page" : undefined}>{doc.curto}</a>
                ))}
              </nav>
            </div>
          </div>
        </section>
        <div className="container legal-corpo">
          <aside className="legal-indice">
            <nav aria-labelledby="indice-titulo">
              <p id="indice-titulo">Nesta página</p>
              <ol>
                {pagina.secoes.map((secao, i) => (
                  <li key={secao.id}><a href={`#${secao.id}`}><span aria-hidden="true">{numero(i)}</span>{secao.titulo}</a></li>
                ))}
              </ol>
            </nav>
          </aside>
          <article className="legal-texto">
            <section className="legal-resumo" aria-labelledby="resumo-titulo">
              <h2 id="resumo-titulo">Em resumo</h2>
              <ul>{pagina.resumo.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            {pagina.secoes.map((secao, i) => (
              <section className="legal-secao" id={secao.id} key={secao.id} aria-labelledby={`${secao.id}-titulo`}>
                <h2 id={`${secao.id}-titulo`}><span className="legal-num" aria-hidden="true">{numero(i)}</span>{secao.titulo}</h2>
                {secao.blocos.map((bloco, j) => <BlocoLegal key={j} bloco={bloco} />)}
              </section>
            ))}
            <aside className="legal-ajuda" aria-labelledby="ajuda-titulo">
              <div>
                <h2 id="ajuda-titulo">Ficou com alguma dúvida?</h2>
                <p>A recepção responde por telefone ou WhatsApp.</p>
              </div>
              <div className="legal-ajuda-acoes">
                <a className="botao-whatsapp" href={linkWhatsApp(MENSAGEM_DUVIDA)} target="_blank" rel="noopener">
                  <IconeWhatsApp className="icone-whatsapp" />
                  <span>Falar pelo WhatsApp</span>
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                <a className="legal-ligar" href={TELEFONE}>
                  <PhoneCall strokeWidth={1.8} aria-hidden="true" />
                  <span>{TELEFONE_TEXTO}</span>
                </a>
              </div>
            </aside>
          </article>
        </div>
      </main>
      <SiteFooter inicio="/" />
    </>
  );
}
