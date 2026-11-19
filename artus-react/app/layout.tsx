import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./artus.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CustomScrollbar } from "@/components/custom-scrollbar";

export const metadata: Metadata = {
  title: "Clínica Artus Ortopedia | Cuiabá, MT",
  description: "Conheça as áreas de ortopedia da Clínica Artus, em Cuiabá, e agende sua consulta pela central (65) 3322-6689.",
};

export const viewport: Viewport = { themeColor: "#123e48" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preload" href="/assets/instrument-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/figtree-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body id="inicio">
        <SmoothScroll />
        <CustomScrollbar />
        {children}
      </body>
    </html>
  );
}
