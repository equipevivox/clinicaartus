/* eslint-disable @next/next/no-img-element -- Imagens em webp já otimizadas, iguais às da versão estática. */
import { autorDe, dataIso, dataLonga, mesCurto, nomeCurto, rotuloArea, type Artigo } from "@/lib/artigos";

/**
 * Cartão de artigo (adaptado do card-23): especialidade e data no topo, tema, introdução,
 * banner e, sobre ele, o médico que publicou. O cartão inteiro é clicável pelo link do título.
 * A mesma marcação sai de scripts/gerar-artigos.mjs para a versão estática.
 */
/** `destaque`: o cartão já aparece no topo da página de artigos e fica fora da lista "Todas". */
export function ArticleCard({ artigo, titulo: Titulo = "h3", destaque = false }: { artigo: Artigo; titulo?: "h2" | "h3"; destaque?: boolean }) {
  const autor = autorDe(artigo);
  return (
    <article className="artigo-card" data-area={artigo.area} data-destaque={destaque ? "" : undefined}>
      <div className="artigo-topo">
        <span className="artigo-area">{rotuloArea(artigo.area)}</span>
        <time className="artigo-data" dateTime={dataIso(artigo)}>
          <span>{mesCurto(artigo)}</span>
          <span>{artigo.ano}</span>
        </time>
      </div>
      <Titulo className="artigo-titulo">
        <a href={`/artigos/${artigo.slug}`}>{artigo.titulo}</a>
      </Titulo>
      <p className="artigo-resumo">{artigo.resumo}</p>
      <div className="artigo-banner">
        <img src={`/assets/${artigo.imagem}`} alt="" loading="lazy" decoding="async" width={960} height={720} />
        <div className="artigo-autor">
          <img src={autor.photo} alt="" loading="lazy" decoding="async" width={88} height={88} />
          <span>
            <strong>{nomeCurto(artigo)}</strong>
            <small>CRM-MT {autor.crm}</small>
          </span>
        </div>
      </div>
    </article>
  );
}

/** Item compacto (miniatura, área, título e médico) das listas laterais. Igual em scripts/gerar-artigos.mjs. */
export function ArtigoMini({ artigo }: { artigo: Artigo }) {
  return (
    <article className="artigo-mini">
      <img src={`/assets/${artigo.imagem}`} alt="" loading="lazy" decoding="async" width={192} height={160} />
      <div>
        <span className="artigo-mini-area">{rotuloArea(artigo.area)}</span>
        <h3 className="artigo-titulo"><a href={`/artigos/${artigo.slug}`}>{artigo.titulo}</a></h3>
        <small>{nomeCurto(artigo)} · <time dateTime={dataIso(artigo)}>{dataLonga(artigo)}</time></small>
      </div>
    </article>
  );
}
