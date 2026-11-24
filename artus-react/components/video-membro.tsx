"use client";

import { useEffect, useRef } from "react";

/**
 * Animação do membro de cada perfil (vídeo curto, em loop contínuo, sem som), no lugar da radiografia
 * parada. Só toca com pelo menos 25% na tela, e o arquivo só baixa quando vai tocar (preload="none").
 * Sem botão de pausa, por decisão da clínica; com movimento reduzido fica no primeiro quadro (pôster),
 * inclusive se a preferência mudar depois. O fundo escuro do vídeo some no painel pelo mix-blend-mode
 * do CSS. A versão estática (home.js) repete isto.
 */
export function VideoMembro({ arquivo, alt }: { arquivo: string; alt: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v || !("IntersectionObserver" in window)) return;
    const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
    let naTela = false;
    const atualizar = () => {
      if (naTela && !reduzir.matches) v.play().catch(() => {});
      else v.pause();
    };
    const mudouPreferencia = () => {
      // Volta ao pôster em vez de congelar no quadro em que estava.
      if (reduzir.matches && v.currentTime > 0) v.load();
      atualizar();
    };
    const obs = new IntersectionObserver(([e]) => {
      naTela = e.intersectionRatio >= 0.25;
      atualizar();
    }, { threshold: [0, 0.25] });
    obs.observe(v);
    reduzir.addEventListener("change", mudouPreferencia);
    return () => {
      obs.disconnect();
      reduzir.removeEventListener("change", mudouPreferencia);
    };
  }, []);

  return (
    <div className="care-xray">
      <figure className="care-xray-midia" role="img" aria-label={alt}>
        <video
          ref={video}
          src={`/assets/membros/${arquivo}.mp4`}
          poster={`/assets/membros/${arquivo}.webp`}
          width={1080}
          height={1080}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      </figure>
    </div>
  );
}
