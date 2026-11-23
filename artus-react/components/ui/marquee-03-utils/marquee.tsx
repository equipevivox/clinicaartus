import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marquee (no formato do Magic UI): repete o conteúdo e o desliza sem fim, na horizontal ou na
 * vertical. As cópias extras ficam escondidas do leitor de tela (aria-hidden), que lê o conteúdo
 * uma vez só; com movimento reduzido, nada se move. A animação vem de globals.css
 * (--animate-marquee e --animate-marquee-vertical).
 */
interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  children: ReactNode;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)] motion-reduce:animate-none",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
