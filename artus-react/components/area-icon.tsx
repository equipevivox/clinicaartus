import { readFileSync } from "node:fs";
import path from "node:path";

/*
 * Inline, animatable versions of the specialty icons in public/assets/area-*.svg.
 * The files stay the source of truth: their paths are read at build time and grouped
 * into anatomical parts, which artus.css moves gently while the card is hovered.
 * The source drawings are upside down (the card flips them with `scale: 1 -1`), so every
 * coordinate below is in the file's own, unflipped space.
 */

export type Area = "mao" | "joelho" | "quadril" | "coluna" | "ombro" | "pe";

function readIcon(area: Area) {
  const svg = readFileSync(path.join(process.cwd(), "public/assets", `area-${area}.svg`), "utf8");
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 48 48";
  const paths = [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  return { viewBox, paths };
}

const Part = ({ d, className }: { d?: string; className?: string }) =>
  d ? <path d={d} className={className} /> : null;

function Parts({ area, paths }: { area: Area; paths: string[] }) {
  const p = paths;
  switch (area) {
    case "mao":
      // One silhouette: the palm stays, the fingers (below the knuckle line, y > 27)
      // shorten and lengthen from that line. The clips overlap so no hairline shows.
      return (
        <>
          <defs>
            <clipPath id="area-mao-palm"><rect x="0" y="0" width="47" height="28" /></clipPath>
            <clipPath id="area-mao-fingers"><rect x="0" y="26.4" width="47" height="19" /></clipPath>
          </defs>
          <g clipPath="url(#area-mao-palm)"><Part d={p[0]} /></g>
          <g clipPath="url(#area-mao-fingers)"><Part d={p[0]} className="ai-mao-fingers" /></g>
        </>
      );
    case "pe":
      // One silhouette: the leg stays, the forefoot (x > 21) tilts up and down at the ankle.
      // The two clips overlap by ~1 unit so anti-aliasing never leaves a hairline seam.
      return (
        <>
          <defs>
            <clipPath id="area-pe-leg"><rect x="0" y="0" width="21.8" height="35" /></clipPath>
            <clipPath id="area-pe-foot"><rect x="20.4" y="-4" width="27" height="40" /></clipPath>
          </defs>
          <g clipPath="url(#area-pe-leg)"><Part d={p[0]} /></g>
          <g clipPath="url(#area-pe-foot)"><Part d={p[0]} className="ai-pe-foot" /></g>
        </>
      );
    case "joelho":
      // Femur and patellar line stay; tibia and fibula bend at the knee.
      return (
        <>
          <Part d={p[0]} />
          <Part d={p[1]} />
          <g className="ai-joelho-leg">
            <Part d={p[2]} />
            <Part d={p[3]} />
          </g>
        </>
      );
    case "quadril":
      // Pelvis and sacrum tilt side to side; each femur rises or drops with its hip.
      return (
        <>
          <g className="ai-quadril-pelvis">
            <Part d={p[2]} />
            <Part d={p[0]} />
            <Part d={p[1]} />
            <Part d={p[3]} />
            <Part d={p[4]} />
          </g>
          <Part d={p[5]} className="ai-quadril-femur-a" />
          <Part d={p[6]} className="ai-quadril-femur-b" />
        </>
      );
    case "coluna":
      // Posterior column stays; the vertebral bodies flex in a short wave.
      return (
        <>
          <Part d={p[1]} />
          <Part d={p[2]} />
          <Part d={p[3]} />
          <Part d={p[5]} />
          <Part d={p[6]} />
          <Part d={p[0]} className="ai-coluna-v1" />
          <Part d={p[4]} className="ai-coluna-v2" />
          <Part d={p[7]} className="ai-coluna-v3" />
        </>
      );
    case "ombro":
      // The shoulder lifts and lowers; the pain marks over the joint flash in turn.
      return (
        <>
          <Part d={p[2]} className="ai-ombro-shoulder" />
          <Part d={p[3]} className="ai-ombro-mark ai-ombro-mark-1" />
          <Part d={p[1]} className="ai-ombro-mark ai-ombro-mark-2" />
          <Part d={p[0]} className="ai-ombro-mark ai-ombro-mark-3" />
        </>
      );
  }
}

export function AreaIcon({ area }: { area: Area }) {
  const { viewBox, paths } = readIcon(area);
  return (
    <svg
      className={`area-icon-svg ai-${area}`}
      viewBox={viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <Parts area={area} paths={paths} />
    </svg>
  );
}
