/* eslint-disable @next/next/no-html-link-for-pages -- /artigos com carga completa: o artigos.js da inicial não roda de novo numa navegação pelo cliente. */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/ui/article-card";
import { AREAS_ARTIGOS, ARTIGOS_MAX_INICIAL, ARTIGOS_SOBRE, ARTIGOS_TITULO, artigos } from "@/lib/artigos";

/** Filtro por especialidade (botões com aria-pressed); o comportamento fica em public/artigos.js. */
export function FiltroArtigos() {
  return (
    <div className="artigos-filtros" role="group" aria-label="Filtrar artigos por especialidade" data-artigos-filtros>
      <button type="button" data-filtro="todas" aria-pressed="true">Todas</button>
      {AREAS_ARTIGOS.map((area) => (
        <button key={area.id} type="button" data-filtro={area.id} aria-pressed="false">{area.rotulo}</button>
      ))}
    </div>
  );
}

/**
 * Artigos na inicial: carrossel com quatro cartões à vista, filtro por especialidade e
 * "Ver mais", que abre uma segunda linha de quatro. Daí em diante, a página /artigos.
 */
export function ArtigosSecao() {
  return (
    <section className="section artigos" id="artigos" aria-labelledby="artigos-title" data-artigos data-limite={ARTIGOS_MAX_INICIAL}>
      <div className="container">
        <div className="section-heading">
          <div><h2 id="artigos-title" tabIndex={-1}>{ARTIGOS_TITULO}</h2></div>
          <p>{ARTIGOS_SOBRE}</p>
        </div>
        <div className="artigos-barra">
          <FiltroArtigos />
          <div className="artigos-setas" data-artigos-setas>
            <button type="button" className="artigos-seta" data-dir="-1" aria-label="Artigos anteriores" aria-controls="artigos-trilho"><ChevronLeft strokeWidth={1.8} aria-hidden="true" /></button>
            <button type="button" className="artigos-seta" data-dir="1" aria-label="Próximos artigos" aria-controls="artigos-trilho"><ChevronRight strokeWidth={1.8} aria-hidden="true" /></button>
          </div>
        </div>
        <div className="artigos-trilho" id="artigos-trilho" data-artigos-trilho role="region" aria-label="Lista de artigos" tabIndex={0}>
          {artigos.map((artigo) => <ArticleCard key={artigo.slug} artigo={artigo} />)}
        </div>
        <p className="artigos-vazio" data-artigos-vazio hidden>Ainda não há artigos desta especialidade.</p>
        <p className="sr-only" aria-live="polite" data-artigos-aviso></p>
        <div className="artigos-acoes">
          <button type="button" className="artigos-expandir" data-artigos-expandir aria-expanded="false" aria-controls="artigos-trilho">
            <span data-rotulo-fechado>Ver mais artigos</span>
            <span data-rotulo-aberto hidden>Mostrar menos</span>
            <ChevronRight strokeWidth={1.8} aria-hidden="true" />
          </button>
          <a className="inline-link" href="/artigos">Ver todos os artigos <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
