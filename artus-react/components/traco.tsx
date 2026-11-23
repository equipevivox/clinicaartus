import { readFileSync } from "node:fs";
import path from "node:path";

/*
 * Desenhos anatômicos em traço (public/assets/traco-*.svg), em SVG inline para poderem
 * se desenhar: cada caminho tem pathLength=1, então stroke-dashoffset vai de 1 (apagado)
 * a 0 (desenhado). O CSS controla espessura e cor (currentColor) — ver ".traco" em artus.css.
 * A espessura é em unidades do desenho (--vb = altura do viewBox), não com vector-effect:
 * non-scaling-stroke, que no Chrome deixa o tracejado incompleto quando o desenho é ampliado.
 * Os arquivos são lidos no build; eles continuam sendo a fonte dos desenhos.
 */

export type Traco = "mao" | "joelho" | "quadril" | "coluna" | "ombro" | "cotovelo" | "pe";
export type Area = "mao" | "joelho" | "quadril" | "coluna" | "ombro" | "pe";

/** Ícone de cada área: "Ombro e cotovelo" usa o cotovelo, que se reconhece melhor pequeno. */
export const tracoDaArea: Record<Area, Traco> = {
  mao: "mao",
  joelho: "joelho",
  quadril: "quadril",
  coluna: "coluna",
  ombro: "cotovelo",
  pe: "pe",
};

function lerTraco(nome: Traco) {
  const svg = readFileSync(path.join(process.cwd(), "public/assets", `traco-${nome}.svg`), "utf8");
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 48 48";
  const transform = svg.match(/<g\b[^>]*\btransform="([^"]+)"/)?.[1];
  const paths = [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  return { viewBox, transform, paths };
}

export function TracoDesenho({ nome, className = "" }: { nome: Traco; className?: string }) {
  const { viewBox, transform, paths } = lerTraco(nome);
  const [, , w, h] = viewBox.trim().split(/[\s,]+/).map(Number);
  return (
    <svg className={`traco ${className}`.trim()} viewBox={viewBox} style={{ aspectRatio: `${w} / ${h}`, ["--vb" as string]: h }} aria-hidden="true" focusable="false">
      <g transform={transform}>
        {paths.map((d, i) => (
          <path key={i} d={d} pathLength={1} />
        ))}
      </g>
    </svg>
  );
}

/** Ícone de área: o desenho em traço num quadro lavado. */
export function AreaIcon({ area }: { area: Area }) {
  return <TracoDesenho nome={tracoDaArea[area]} className="area-icon-svg" />;
}
