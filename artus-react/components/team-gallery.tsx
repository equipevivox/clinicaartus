"use client";

import GsapFlipCard, { type GsapFlipCardItem } from "@/components/ui/gsap-card-flip";
import { doctors } from "@/lib/doctors";

/*
 * Currículos resumidos a partir do dossiê "artus-cuiaba-acervo-do-site.html"
 * (levantamento de 18/11/2026). O próprio dossiê pede validação de cada médico
 * antes da publicação: confirmar instituições, anos e títulos.
 */
type Resume = Pick<GsapFlipCardItem, "description" | "details" | "imagePosition"> & { rqeLabel: string };

const resumes: Record<string, Resume> = {
  cassio: {
    description: "Ortopedista com atuação em cirurgia da mão, dos dedos e do punho.",
    details: [
      "Graduação em Medicina pela Universidade Federal de Juiz de Fora",
      "Residência no Hospital Ortopédico de Belo Horizonte",
      "Título da Sociedade Brasileira de Cirurgia da Mão (2010)",
    ],
    rqeLabel: "RQE 2393 (Ortopedia e Traumatologia) · RQE 2749 (Cirurgia da Mão)",
  },
  lucio: {
    description: "Ortopedista com atuação em cirurgia do joelho.",
    details: [
      "Formação pela Universidade Federal do Paraná",
      "Aperfeiçoamento em Lyon, na França",
      "Coautor de capítulos em publicações da editora Springer",
    ],
    rqeLabel: "RQE 2633 (Ortopedia e Traumatologia)",
  },
  renam: {
    description: "Ortopedista com atuação em cirurgia do quadril e trauma ortopédico.",
    details: [
      "Formação na Faculdade de Medicina da USP",
      "Instituto de Ortopedia e Traumatologia do Hospital das Clínicas (USP)",
      "Mestrado",
      "Presidente da SBOT regional Mato Grosso em 2019–2020",
    ],
    rqeLabel: "RQE 2621 (Ortopedia e Traumatologia)",
  },
  andre: {
    description: "Ortopedista com formação em cirurgia da coluna. Membro titular da SBOT.",
    details: [
      "Medicina pela Faculdade de Ciências Médicas da Santa Casa de São Paulo",
      "Residência em Ortopedia e Traumatologia na Faculdade de Medicina do ABC",
      "Aperfeiçoamento no Institut Mutualiste Montsouris, em Paris",
      "Mestrado em Ciências pela UNIFESP",
      "Extensão em cirurgia endoscópica pela Faculdade de Medicina de Ribeirão Preto",
    ],
    rqeLabel: "RQE 4059 (Ortopedia e Traumatologia)",
  },
  luiz: {
    imagePosition: "center 22%",
    description: "Ortopedista com atuação em ombro e cotovelo.",
    details: [
      "Graduação em Medicina pela UFMT",
      "Formação no Instituto Nacional de Traumatologia e Ortopedia (INTO)",
    ],
    rqeLabel: "RQE 2370 (Ortopedia e Traumatologia)",
  },
  valmir: {
    description: "Ortopedista com atuação em ombro e cotovelo.",
    details: [
      "Formação pela UFMT",
      "Artigo na Revista Brasileira de Ortopedia (2014) sobre tomografia computadorizada e reconstrução tridimensional",
    ],
    rqeLabel: "RQE 3373 (Ortopedia e Traumatologia)",
  },
  ricardo: {
    description:
      "Ortopedista com atuação em pé e tornozelo, incluindo artroscopia, cirurgia minimamente invasiva e reconstrução.",
    details: [
      "Graduação, residência e especialização em pé e tornozelo pela Santa Casa de São Paulo",
      "Fellowship no Rush, nos Estados Unidos (2010)",
      "Primeiro secretário da SBOT regional Mato Grosso",
    ],
    rqeLabel: "RQE 2358 (Ortopedia e Traumatologia)",
  },
};

const items: GsapFlipCardItem[] = doctors.map((doctor) => {
  const resume = resumes[doctor.id];
  return {
    id: doctor.id,
    image: doctor.photo,
    alt: doctor.name,
    title: doctor.name,
    meta: doctor.specialty,
    description: resume?.description,
    details: resume?.details,
    imagePosition: resume?.imagePosition,
    caption: `CRM-MT ${doctor.crm} · ${resume?.rqeLabel ?? `RQE ${doctor.rqe}`}`,
    cardLines: [`CRM-MT ${doctor.crm}`, `RQE ${doctor.rqe}`],
    link: { href: `#cuidado-${doctor.id}`, label: "Ver perfil" },
  };
});

export function TeamGallery() {
  return (
    <GsapFlipCard
      items={items}
      backgroundColor="var(--wash)"
      textColor="var(--ink)"
      mutedColor="var(--artus-muted)"
      accentColor="var(--artus-accent)"
      rounded={12}
      thumbWidth={76}
      thumbHeight={76}
      thumbGap={10}
      heroWidth={380}
      heroHeight={430}
      rowRatio={1.15}
      rowGap={14}
      cardHint=""
      openLabel="Ver formação"
      galleryHint={
        <>Selecione a foto de um especialista para ver sua formação.</>
      }
      backLabel="Ver todos"
      openHeight={620}
    />
  );
}
