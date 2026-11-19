"use client";

import { useEffect, useRef } from "react";

const INSET = 4; // px from the viewport edges

/**
 * Thin overlay scrollbar for the page. The native one is hidden on fine pointers
 * (artus.css), so it no longer takes layout width and both page gutters match.
 * Touch devices keep their own overlay scrollbar.
 */
export function CustomScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    let frame = 0;
    let thumbH = 0;
    let travel = 0; // px the thumb can move
    let range = 0; // px the page can scroll

    const update = () => {
      frame = 0;
      const view = window.innerHeight;
      const total = document.documentElement.scrollHeight;
      range = Math.max(0, total - view);
      const trackH = view - INSET * 2;
      thumbH = Math.max(40, (view / total) * trackH);
      travel = trackH - thumbH;
      track.style.display = range > 0 ? "" : "none";
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translateY(${range ? (window.scrollY / range) * travel : 0}px)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const scrollTo = (y: number) => {
      if (window.artusLenis) window.artusLenis.scrollTo(y, { immediate: true });
      else window.scrollTo({ top: y, behavior: "instant" });
    };

    let dragStartY = 0;
    let dragStartScroll = 0;
    const onDown = (event: PointerEvent) => {
      event.preventDefault();
      thumb.setPointerCapture(event.pointerId);
      dragStartY = event.clientY;
      dragStartScroll = window.scrollY;
      track.dataset.dragging = "";
    };
    const onMove = (event: PointerEvent) => {
      if (!thumb.hasPointerCapture(event.pointerId) || travel <= 0) return;
      scrollTo(dragStartScroll + ((event.clientY - dragStartY) / travel) * range);
    };
    const onUp = (event: PointerEvent) => {
      if (thumb.hasPointerCapture(event.pointerId)) thumb.releasePointerCapture(event.pointerId);
      delete track.dataset.dragging;
    };
    // Clicking the track jumps there (centred on the thumb), smoothly when Lenis is on.
    const onTrackDown = (event: PointerEvent) => {
      if (event.target !== track || travel <= 0) return;
      const y = ((event.clientY - INSET - thumbH / 2) / travel) * range;
      if (window.artusLenis) window.artusLenis.scrollTo(y);
      else window.scrollTo({ top: y });
    };

    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    thumb.addEventListener("pointerdown", onDown);
    thumb.addEventListener("pointermove", onMove);
    thumb.addEventListener("pointerup", onUp);
    thumb.addEventListener("pointercancel", onUp);
    track.addEventListener("pointerdown", onTrackDown);
    update();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      thumb.removeEventListener("pointerdown", onDown);
      thumb.removeEventListener("pointermove", onMove);
      thumb.removeEventListener("pointerup", onUp);
      thumb.removeEventListener("pointercancel", onUp);
      track.removeEventListener("pointerdown", onTrackDown);
    };
  }, []);

  return (
    <div ref={trackRef} className="page-scrollbar" aria-hidden="true">
      <div ref={thumbRef} className="page-scrollbar-thumb" />
    </div>
  );
}
