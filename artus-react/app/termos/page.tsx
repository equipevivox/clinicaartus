import type { Metadata } from "next";
import { PaginaLegalView } from "@/components/pagina-legal";
import { termos } from "@/lib/paginas-legais";

export const metadata: Metadata = {
  title: `${termos.titulo} | Clínica Artus Ortopedia`,
  description: termos.descricao,
};

export default function Page() {
  return <PaginaLegalView pagina={termos} />;
}
