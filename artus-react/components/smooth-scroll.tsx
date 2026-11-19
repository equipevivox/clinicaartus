"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    /** Smooth-scroll instance, shared with public/home.js and other components. */
    artusLenis?: Lenis;
  }
}

/**
 * Smooth (inertial) page scroll with Lenis. It keeps native scrolling, so the sticky
 * header, scroll-linked animations and the scrollbar keep working. Off for reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;

    const start = () => {
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        allowNestedScroll: true,
        // Anchor links; Lenis already honours `scroll-padding-top` (artus.css) for the header.
        anchors: true,
      });
      window.artusLenis = lenis;
    };
    const stop = () => {
      lenis?.destroy();
      lenis = undefined;
      delete window.artusLenis;
    };
    const sync = () => (motion.matches ? stop() : lenis ?? start());

    sync();
    motion.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
