import type { Metadata } from "next";
import { PaginaLegalView } from "@/components/pagina-legal";
import { cookies } from "@/lib/paginas-legais";

export const metadata: Metadata = {
  title: `${cookies.titulo} | Clínica Artus Ortopedia`,
  description: cookies.descricao,
};

export default function Page() {
  return <PaginaLegalView pagina={cookies} />;
}
