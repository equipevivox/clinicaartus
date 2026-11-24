import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "./artus.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CustomScrollbar } from "@/components/custom-scrollbar";
import { SiteIntro } from "@/components/site-intro";
import { ABERTURA_DECIDIR } from "@/lib/abertura";

export const metadata: Metadata = {
  title: "Clínica Artus Ortopedia | Cuiabá, MT",
  description: "Conheça os especialistas em Ortopedia e Traumatologia da Clínica Artus, em Cuiabá. Agende uma consulta pelo telefone ou WhatsApp (65) 3322-6689.",
};

/** Marca que há JavaScript (html.js), registra a primeira interação (o seletor dos perfis não toma a
 * rolagem de quem já rolou) e acompanha o histórico: window.__artusDe é a entrada de onde se veio no
 * último popstate; window.__artusGravou() avisa que um script mudou a entrada atual. */
const MARCAR_JS = `window.__artusAtual=history.state;window.__artusDe=null;window.__artusGravou=function(){window.__artusAtual=history.state};addEventListener("popstate",function(e){window.__artusDe=window.__artusAtual;window.__artusAtual=e.state},true);document.documentElement.classList.add("js");["pointerdown","wheel","touchstart","keydown"].forEach(function(t){addEventListener(t,function(){window.__artusInteragiu=true},{once:true,passive:true,capture:true})});`;

export const viewport: Viewport = { themeColor: "#123e48" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Marca que há JavaScript antes da pintura: sem ele, o cabeçalho deixa de ser fixo (artus.css). */}
        <script dangerouslySetInnerHTML={{ __html: MARCAR_JS }} />
        {/* Abertura em vídeo: decide antes da primeira pintura (ver lib/abertura.ts). */}
        <script dangerouslySetInnerHTML={{ __html: ABERTURA_DECIDIR }} />
        <link rel="preload" href="/assets/instrument-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/figtree-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body id="inicio">
        <SiteIntro />
        <SmoothScroll />
        <CustomScrollbar />
        {children}
        {/* Aviso e preferências de cookies, mapa sob consentimento e índice das páginas internas. */}
        <Script src="/site.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
