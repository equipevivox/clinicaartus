/* eslint-disable @next/next/no-html-link-for-pages -- A inicial depende de carga completa (abertura, rolagem e scripts em public/): os links para ela são <a> comuns. */
/* eslint-disable @next/next/no-img-element -- Imagens em webp já otimizadas, iguais às da versão estática. */
import type { Metadata } from "next";
import Script from "next/script";
import { FiltroArtigos } from "@/components/artigos-secao";
import { SiteFooter } from "@/components/site-footer";
import { TopoInterno } from "@/components/topo-interno";
import { ArticleCard, ArtigoMini } from "@/components/ui/article-card";
import { ARTIGOS_SOBRE, ARTIGOS_TITULO, artigos, autorDe, dataIso, mesCurto, nomeCurto, rotuloArea } from "@/lib/artigos";

// O mais recente vai grande no topo; os quatro seguintes, na lateral.
const principal = artigos[0];
const lateral = artigos.slice(1, 5);
const emDestaque = new Set([principal, ...lateral].map((a) => a.slug));

export const metadata: Metadata = {
  title: `${ARTIGOS_TITULO} | Clínica Artus Ortopedia`,
  description: ARTIGOS_SOBRE,
};

export default function Page() {
  return (
    <>
      <TopoInterno />
      <main id="conteudo" className="legal artigos-pagina">
        <section className="artigo-capa" aria-labelledby="legal-titulo">
          <div className="container">
            <nav className="legal-trilha" aria-label="Você está em">
              <ol>
                <li><a href="/">Início</a></li>
                <li aria-current="page">Artigos</li>
              </ol>
            </nav>
            <h1 id="legal-titulo">{ARTIGOS_TITULO}</h1>
            <p className="artigo-capa-resumo">{ARTIGOS_SOBRE}</p>
          </div>
        </section>
        <section className="container artigos-destaque" aria-labelledby="destaque-titulo">
          <h2 id="destaque-titulo" className="sr-only">Em destaque</h2>
          <article className="artigo-principal" data-area={principal.area}>
            <img src={`/assets/${principal.imagem}`} alt="" width={960} height={720} fetchPriority="high" />
            <div className="artigo-principal-conteudo">
              <div className="artigo-topo">
                <span className="artigo-area">{rotuloArea(principal.area)}</span>
                <time className="artigo-data" dateTime={dataIso(principal)}>
                  <span>{mesCurto(principal)}</span>
                  <span>{principal.ano}</span>
                </time>
              </div>
              <h3 className="artigo-titulo"><a href={`/artigos/${principal.slug}`}>{principal.titulo}</a></h3>
              <p className="artigo-resumo">{principal.resumo}</p>
              <div className="artigo-autor">
                <img src={autorDe(principal).photo} alt="" width={88} height={88} />
                <span>
                  <strong>{nomeCurto(principal)}</strong>
                  <small>CRM-MT {autorDe(principal).crm}</small>
                </span>
              </div>
            </div>
          </article>
          <div className="artigos-lateral">
            <h2>Mais recentes</h2>
            <ol>
              {lateral.map((a) => (
                <li key={a.slug}>
                  <ArtigoMini artigo={a} />
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="container artigos-acervo" id="acervo" data-artigos aria-labelledby="acervo-titulo">
          <h2 id="acervo-titulo">Mais artigos</h2>
          <FiltroArtigos />
          <div className="artigos-grade" id="artigos-grade" data-artigos-trilho>
            {artigos.map((artigo) => <ArticleCard key={artigo.slug} artigo={artigo} destaque={emDestaque.has(artigo.slug)} />)}
          </div>
          <p className="artigos-vazio" data-artigos-vazio hidden>Ainda não há artigos desta especialidade.</p>
          <p className="sr-only" aria-live="polite" data-artigos-aviso></p>
          <p className="artigos-fonte">Leitura informativa: não substitui a consulta.</p>
        </section>
      </main>
      <SiteFooter inicio="/" />
      <Script src="/artigos.js" strategy="afterInteractive" />
    </>
  );
}
