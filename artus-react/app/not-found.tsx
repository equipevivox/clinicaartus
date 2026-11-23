/* eslint-disable @next/next/no-html-link-for-pages -- A inicial depende de carga completa (abertura, rolagem e scripts em public/): os links para ela são <a> comuns, sem navegação no cliente. */
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { SiteFooter } from "@/components/site-footer";
import { TopoInterno } from "@/components/topo-interno";
import { regioes } from "@/lib/contato";
import { linkWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Página não encontrada | Clínica Artus Ortopedia",
  description: "O endereço procurado não existe no site da Clínica Artus.",
};

/** 404: minimalista, uma coluna centralizada com o caminho de volta e os atalhos para as áreas. */
export default function NotFound() {
  return (
    <>
      <TopoInterno />
      <main id="conteudo" className="erro">
        <section className="erro-palco" aria-labelledby="erro-titulo">
          <div className="container erro-grade">
            <div className="erro-texto">
              <p className="erro-codigo" aria-hidden="true">404</p>
              <h1 id="erro-titulo">Página não encontrada</h1>
              <p className="erro-descricao">Volte à página inicial ou escolha uma área de atendimento abaixo.</p>
              <div className="erro-acoes">
                <a className="erro-inicio" href="/">
                  <ArrowLeft strokeWidth={1.8} aria-hidden="true" />
                  <span>Ir para a página inicial</span>
                </a>
                <a className="botao-whatsapp" href={linkWhatsApp()} target="_blank" rel="noopener">
                  <IconeWhatsApp className="icone-whatsapp" />
                  <span>Agendar pelo WhatsApp</span>
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </div>
              <nav className="erro-atalhos" aria-labelledby="atalhos-titulo">
                <p id="atalhos-titulo">Procurando um especialista?</p>
                <ul>
                  {regioes.map(({ label, target }) => (
                    <li key={target}><a href={`/#cuidado-${target}`}>{label}</a></li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter inicio="/" />
    </>
  );
}
