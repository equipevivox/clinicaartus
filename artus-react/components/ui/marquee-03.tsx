/* eslint-disable @next/next/no-img-element -- Fotos de perfil pequenas, já otimizadas em WebP. */
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-03-utils/marquee";
import type { Avaliacao } from "@/lib/avaliacoes";

/** Logo "G" do Google, para indicar a origem da avaliação. */
function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true" focusable="false" className="shrink-0">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function Estrelas({ quantidade }: { quantidade: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${quantidade} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
          <path fill={i < quantidade ? "#FBBC04" : "#DADCE0"} d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </span>
  );
}

const ReviewCard = ({ nome, texto, estrelas, foto }: Avaliacao) => (
  <Card className="avaliacao-card relative w-full overflow-hidden rounded-2xl border border-[#dce5e5] bg-white p-4 shadow-none">
    <CardContent className="flex flex-col gap-2.5 p-0">
      <div className="flex flex-row items-center gap-3">
        <img className="size-10 shrink-0 rounded-full" width={40} height={40} alt="" src={foto} loading="lazy" decoding="async" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-[0.9375rem] font-semibold text-[#142a2f]">{nome}</p>
          <Estrelas quantidade={estrelas} />
        </div>
        <GoogleG />
      </div>
      <p className="text-[0.9375rem] leading-relaxed text-[#3d5559]">{texto}</p>
    </CardContent>
  </Card>
);

/**
 * Avaliações do Google em colunas que deslizam na vertical (3 no computador, 2 no tablet, 1 no
 * celular), com as bordas de cima e de baixo se dissolvendo no fundo. Param ao passar o mouse e
 * quando a área recebe o foco do teclado (movimento automático precisa de um jeito de parar).
 */
export default function VerticalMarqueeDemo({ reviews }: { reviews: Avaliacao[] }) {
  return (
    <div className="avaliacoes-marquee">
      <div className="relative flex h-125 w-full flex-row items-center justify-center overflow-hidden" aria-label="Avaliações de pacientes no Google" role="region" tabIndex={0}>
        <div className="flex h-full w-full flex-row items-center justify-center gap-4 px-1">
          <Marquee pauseOnHover vertical className="hidden h-full flex-1 [--duration:46s] sm:flex">
            {reviews.filter((_, i) => i % 3 === 0).map((review) => <ReviewCard key={review.nome} {...review} />)}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="hidden h-full flex-1 [--duration:52s] sm:flex">
            {reviews.filter((_, i) => i % 3 === 1).map((review) => <ReviewCard key={review.nome} {...review} />)}
          </Marquee>
          <Marquee pauseOnHover vertical className="hidden h-full flex-1 [--duration:48s] lg:flex">
            {reviews.filter((_, i) => i % 3 === 2).map((review) => <ReviewCard key={review.nome} {...review} />)}
          </Marquee>
          <Marquee pauseOnHover vertical className="flex h-full flex-1 [--duration:70s] sm:hidden">
            {reviews.map((review) => <ReviewCard key={review.nome} {...review} />)}
          </Marquee>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-white" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-white" />
      </div>
    </div>
  );
}
