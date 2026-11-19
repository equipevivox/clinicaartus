import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  label: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  manual?: boolean;
};

export function Marquee({ children, label, reverse, pauseOnHover, manual }: MarqueeProps) {
  return (
    <div
      className="reviews-marquee"
      role="region"
      aria-label={label}
      tabIndex={0}
      data-reverse={reverse || undefined}
      data-pause-on-hover={pauseOnHover || undefined}
      data-manual={manual || undefined}
    >
      <div className="reviews-track">
        <ul className="reviews-row">{children}</ul>
        <ul className="reviews-row reviews-row-copy" aria-hidden="true">{children}</ul>
      </div>
    </div>
  );
}
