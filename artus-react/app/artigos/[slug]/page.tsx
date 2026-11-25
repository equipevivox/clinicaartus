/* eslint-disable @next/next/no-html-link-for-pages -- A inicial depende de carga completa (abertura, rolagem e scripts em public/): os links para ela são <a> comuns. */
/* eslint-disable @next/next/no-img-element -- Imagens em webp já otimizadas, iguais às da versão estática. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoneCall } from "lucide-react";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { SiteFooter } from "@/components/site-footer";
import { TopoInterno } from "@/components/topo-interno";
import { ArtigoMini } from "@/components/ui/article-card";
import { artigos, autorDe, dataIso, dataLonga, outrosArtigos, rotuloArea } from "@/lib/artigos";
import { TELEFONE, TELEFONE_TEXTO } from "@/lib/contato";
import { MENSAGEM_PADRAO, linkWhatsApp } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

// Todas as páginas saem prontas de generateStaticParams; a navegação pode esperar o servidor.
export const instant = false;
export function generateStaticParams() {
  return artigos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artigo = artigos.find((a) => a.slug === slug);
  if (!artigo) return {};
  return { title: `${artigo.titulo} | Clínica Artus Ortopedia`, description: artigo.resumo };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const artigo = artigos.find((a) => a.slug === slug);
  if (!artigo) notFound();
  const autor = autorDe(artigo);
  const area = rotuloArea(artigo.area);
  const outros = outrosArtigos(artigo);
  return (
    <>
      <TopoInterno />
      <main id="conteudo" className="legal artigo-pagina">
        <div className="artigo-capa artigo-leitura">
          <div className="container artigo-layout">
            <article aria-labelledby="legal-titulo">
              <nav className="legal-trilha" aria-label="Você está em">
                <ol>
                  <li><a href="/">Início</a></li>
                  <li><a href="/artigos">Artigos</a></li>
                  <li aria-current="page">{artigo.titulo}</li>
                </ol>
              </nav>
              <span className="artigo-area">{area}</span>
              <h1 id="legal-titulo">{artigo.titulo}</h1>
              <p className="artigo-capa-resumo">{artigo.resumo}</p>
              <div className="artigo-assinatura">
                <img src={autor.photo} alt="" width={88} height={88} />
                <p>
                  <strong>{autor.name}</strong>
                  <span>CRM-MT {autor.crm} · RQE {autor.rqe}</span>
                  <span>Publicado em <time dateTime={dataIso(artigo)}>{dataLonga(artigo)}</time></span>
                </p>
              </div>
              <figure className="artigo-capa-figura">
                <img src={`/assets/${artigo.imagem}`} alt={artigo.alt} width={960} height={720} fetchPriority="high" />
              </figure>
              <div className="artigo-texto">
                {artigo.corpo.map((p) => (p.startsWith("## ") ? <h2 key={p}>{p.slice(3)}</h2> : <p key={p}>{p}</p>))}
                <p className="artigo-nota">Leitura informativa: não substitui a consulta nem a avaliação individual.</p>
                <aside className="legal-ajuda" aria-labelledby="ajuda-titulo">
                  <div>
                    <h2 id="ajuda-titulo">Quer marcar uma avaliação?</h2>
                    <p>A recepção agenda a consulta por telefone ou WhatsApp.</p>
                  </div>
                  <div className="legal-ajuda-acoes">
                    <a className="botao-whatsapp" href={linkWhatsApp(MENSAGEM_PADRAO)} target="_blank" rel="noopener">
                      <IconeWhatsApp className="icone-whatsapp" />
                      <span>Agendar pelo WhatsApp</span>
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                    <a className="legal-ligar" href={TELEFONE}>
                      <PhoneCall strokeWidth={1.8} aria-hidden="true" />
                      <span>{TELEFONE_TEXTO}</span>
                    </a>
                  </div>
                </aside>
              </div>
            </article>
            <aside className="artigos-lateral artigo-aside" aria-labelledby="outros-titulo">
              <h2 id="outros-titulo">Outros artigos</h2>
              <ol>
                {outros.map((a) => <li key={a.slug}><ArtigoMini artigo={a} /></li>)}
              </ol>
              <a className="inline-link" href={`/artigos?area=${artigo.area}#acervo`}>Ver todos de {area.toLowerCase()} <span aria-hidden="true">→</span></a>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter inicio="/" />
    </>
  );
}
