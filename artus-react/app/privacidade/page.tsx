import type { Metadata } from "next";
import { PaginaLegalView } from "@/components/pagina-legal";
import { privacidade } from "@/lib/paginas-legais";

export const metadata: Metadata = {
  title: `${privacidade.titulo} | Clínica Artus Ortopedia`,
  description: privacidade.descricao,
};

export default function Page() {
  return <PaginaLegalView pagina={privacidade} />;
}
