import { ABERTURA_TOCAR } from "@/lib/abertura";

/**
 * Abertura em vídeo como <dialog> modal: enquanto toca, o resto da página fica inerte para o
 * teclado e o leitor de tela. O script inline logo abaixo abre o diálogo (atributo `open`) e
 * define o `src` do vídeo antes da hidratação; por isso os dois aceitam a diferença.
 * `data-lenis-prevent` impede o Lenis de rolar a página por baixo.
 */
export function SiteIntro() {
  return (
    <>
      <dialog
        className="abertura"
        id="abertura"
        aria-label="Abertura da Clínica Artus"
        aria-describedby="abertura-dica"
        tabIndex={-1}
        data-base="/assets/abertura/"
        data-lenis-prevent
        suppressHydrationWarning
      >
        <video
          className="abertura-video"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          disablePictureInPicture
          disableRemotePlayback
          suppressHydrationWarning
        />
        <p className="abertura-dica" id="abertura-dica">Toque na tela ou pressione Esc para pular a abertura.</p>
      </dialog>
      <script dangerouslySetInnerHTML={{ __html: ABERTURA_TOCAR }} />
    </>
  );
}
