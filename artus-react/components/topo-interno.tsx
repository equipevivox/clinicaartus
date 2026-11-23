/* eslint-disable @next/next/no-html-link-for-pages -- A inicial depende de carga completa (abertura, rolagem e scripts em public/): os links para ela são <a> comuns, sem navegação no cliente. */
/* eslint-disable @next/next/no-img-element -- Logo em SVG, já otimizado. */
import { ArrowLeft } from "lucide-react";
import { IconeWhatsApp } from "@/components/icone-whatsapp";
import { MENSAGEM_DUVIDA, linkWhatsApp } from "@/lib/whatsapp";

/** Cabeçalho das páginas internas (documentos e 404): logo, volta ao site e WhatsApp. */
export function TopoInterno() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header className="legal-topo">
        <div className="container legal-topo-barra">
          <a className="legal-marca" href="/" aria-label="Clínica Artus Ortopedia, página inicial">
            <img src="/assets/logo-color.svg" alt="" width="445" height="163" />
          </a>
          <div className="legal-topo-acoes">
            <a className="legal-voltar" href="/">
              <ArrowLeft strokeWidth={1.8} aria-hidden="true" />
              <span>Voltar à página inicial</span>
            </a>
            <a className="botao-whatsapp botao-whatsapp-compacto" href={linkWhatsApp(MENSAGEM_DUVIDA)} target="_blank" rel="noopener" aria-label="WhatsApp da recepção (abre em nova aba)">
              <IconeWhatsApp className="icone-whatsapp" />
              <span className="botao-whatsapp-rotulo">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
