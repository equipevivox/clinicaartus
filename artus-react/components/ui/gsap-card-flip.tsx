/* eslint-disable @next/next/no-img-element -- Flip measures and tweens plain <img> nodes. */
// Built using Hyperiux Vault: https://vault.hyperiux.com
// Adapted for Clínica Artus: the closed state is a row of labelled cards
// (not a pile); clicking one flips it into the hero with its résumé beside
// it. Section-sized stage, arrow keys only while focus is inside the
// gallery, and `focusId` to open on a given card.
"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, SplitText);
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    getServerReducedMotionSnapshot
  );
}

export interface GsapFlipCardItem {
  id?: string | number;
  /** Image URL. */
  image: string;
  alt?: string;
  /** Short line shown under the info panel, revealed line by line. */
  caption?: string;
  /** Per-item heading. Falls back to the gallery `title`. */
  title?: string;
  /** Per-item meta line. Falls back to the gallery `meta`. */
  meta?: string;
  /** Per-item description. Falls back to the gallery `description`. */
  description?: string;
  /** Optional bullet list shown under the description (e.g. a résumé). */
  details?: string[];
  /** Heading above the bullet list. */
  detailsLabel?: string;
  /** CSS object-position for the photo. */
  imagePosition?: string;
  /** Small lines under the name on the closed row (e.g. CRM, RQE). */
  cardLines?: string[];
}

export interface GsapFlipCardProps {
  items?: GsapFlipCardItem[];
  title?: string;
  meta?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  mutedColor?: string;
  accentColor?: string;
  /** Card corner radius in pixels. */
  rounded?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  thumbGap?: number;
  heroWidth?: number;
  heroHeight?: number;
  /** Flip transition duration in seconds. */
  duration?: number;
  ease?: string;
  /** Height / width of the photos on the closed row. */
  rowRatio?: number;
  /** Gap between cards on the closed row, in pixels. */
  rowGap?: number;
  /** Small call to action under each card on the closed row. */
  cardHint?: string;
  /** Shared instruction shown below the closed row. */
  galleryHint?: string;
  /** Label of the button that returns to the row. */
  backLabel?: string;
  showCounter?: boolean;
  captionLines?: number;
  captionFadeDuration?: number;
  captionRevealDuration?: number;
  captionLineStagger?: number;
  /** Height of the desktop stage while a card is open, in pixels. */
  openHeight?: number;
  /** Width below which the stacked mobile layout is used. */
  mobileBreakpoint?: number;
  /** Change this to bring the item with that id forward (opens the gallery). */
  focusId?: string | number;
  /** Bump to re-apply the same `focusId`. */
  focusKey?: number;
  onClose?: () => void;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A row of labelled cards that flips into a hero preview and a thumbnail rail. Tap any
 * frame and the two trade places, same DOM nodes, measured and tweened via
 * GSAP Flip — never re-mounted. Falls back to a stacked mobile layout, and to
 * an instant swap (no Flip travel) under `prefers-reduced-motion`.
 */
export default function GsapFlipCard({
  items = [],
  title = "",
  meta = "",
  description = "",
  backgroundColor = "#e9e9e7",
  textColor = "#111111",
  mutedColor = "#8a8a86",
  accentColor,
  rounded = 20,
  thumbWidth = 108,
  thumbHeight = 120,
  thumbGap = 12,
  heroWidth = 530,
  heroHeight = 670,
  duration = 0.7,
  ease = "power3.inOut",
  rowRatio = 1.15,
  rowGap = 14,
  cardHint = "Clique para ver o currículo",
  galleryHint,
  backLabel = "Ver todos",
  showCounter = true,
  captionLines = 2,
  captionFadeDuration = 0.25,
  captionRevealDuration = 0.55,
  captionLineStagger = 0.07,
  openHeight = 620,
  mobileBreakpoint = 900,
  focusId,
  focusKey = 0,
  onClose,
  className = "",
}: GsapFlipCardProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [opened, setOpened] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const isAnimatingRef = useRef(false);
  const swapRef = useRef<number[]>([]);
  const pendingOpenRef = useRef(false);
  const [shownCaption, setShownCaption] = useState<string | undefined>(
    () => items[0]?.caption
  );
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const captionTweenRef = useRef<gsap.core.Tween | null>(null);
  const captionSplitRef = useRef<SplitText | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const labelsRef = useRef<HTMLDivElement | null>(null);
  const [labelsHeight, setLabelsHeight] = useState(120);

  const revertCaptionSplit = useCallback(() => {
    captionSplitRef.current?.revert();
    captionSplitRef.current = null;
  }, []);

  // Reset the order when a new items array arrives (adjust state during render).
  const [prevItems, setPrevItems] = useState(items);
  if (prevItems !== items) {
    setPrevItems(items);
    setOrder(items.map((_, i) => i));
  }

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setStageWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Height of the tallest label under the closed row.
  useLayoutEffect(() => {
    const el = labelsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setLabelsHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [stageWidth]);

  const registerCard = useCallback((index: number, node: HTMLButtonElement | null) => {
    if (node) cardRefs.current.set(index, node);
    else cardRefs.current.delete(index);
  }, []);

  const orderedCards = useCallback(
    () => order.map((i) => cardRefs.current.get(i)).filter(Boolean) as HTMLButtonElement[],
    [order]
  );

  const isMobile = stageWidth > 0 && stageWidth < mobileBreakpoint;
  const railCount = Math.max(items.length - 1, 0);
  const tW = thumbWidth;
  const tH = thumbHeight;
  const gap = thumbGap;
  const hW = Math.min(heroWidth, stageWidth * 0.4);
  const hH = heroHeight * (hW / heroWidth || 1);
  const railX = Math.max(24, stageWidth * 0.045);
  const heroX = stageWidth - hW - railX;
  const rowCount = items.length;
  const rowPad = railX;
  const cardW = Math.max(0, (stageWidth - 2 * rowPad - (rowCount - 1) * rowGap) / rowCount);
  const cardH = cardW * rowRatio;
  const rowTop = 28;
  const labelsTop = rowTop + cardH + 14;
  const closedHeight = Math.round(labelsTop + labelsHeight + 28 + (galleryHint ? 24 : 0));
  const stageHeight = opened ? openHeight : closedHeight;
  const infoLeft = railX + tW + Math.max(40, stageWidth * 0.05);
  const infoWidth = Math.max(0, heroX - Math.max(40, stageWidth * 0.05) - infoLeft);

  const slotBox = useCallback(
    (slot: number) => {
      if (slot === 0) {
        return { x: heroX, y: 0, w: hW, h: hH, r: rounded, z: items.length + 1 };
      }
      const railHeight = railCount * tH + (railCount - 1) * gap;
      const top = -railHeight / 2 + (slot - 1) * (tH + gap);
      return {
        x: railX,
        y: top + tH / 2,
        w: tW,
        h: tH,
        r: rounded * 0.6,
        z: items.length - slot,
      };
    },
    [heroX, hW, hH, railX, tW, tH, gap, railCount, rounded, items.length]
  );

  const select = useCallback(
    (itemIndex: number) => {
      if (itemIndex === order[0] || isAnimatingRef.current) return;
      if (!isMobile && opened) {
        flipStateRef.current = Flip.getState(orderedCards(), { props: "borderRadius" });
        swapRef.current = [itemIndex, order[0]];
      }
      setOrder((prev) => {
        const next = [...prev];
        const from = next.indexOf(itemIndex);
        next[from] = next[0];
        next[0] = itemIndex;
        return next;
      });
    },
    [order, orderedCards, isMobile, opened]
  );

  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state) return;
    flipStateRef.current = null;
    const swapped = swapRef.current;
    swapRef.current = [];
    if (reducedMotion || isMobile) return;
    isAnimatingRef.current = true;
    Flip.from(state, {
      duration,
      ease,
      absolute: true,
      props: "borderRadius",
      onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration }),
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
    // Motion blur on the two photos trading places: peaks mid-flight, when
    // they move fastest, and is gone when they land.
    const moving = swapped.map((i) => cardRefs.current.get(i)).filter(Boolean) as HTMLButtonElement[];
    if (moving.length) {
      gsap
        .timeline()
        .fromTo(moving, { filter: "blur(0px)" }, { filter: "blur(6px)", duration: duration * 0.45, ease: "power2.in" })
        .to(moving, { filter: "blur(0px)", duration: duration * 0.55, ease: "power2.out", clearProps: "filter" });
    }
  }, [order, duration, ease, reducedMotion, isMobile]);

  // Open/close Flip runs in a layout effect, after React has committed the
  // new layout. Starting it from requestAnimationFrame raced the commit when
  // open() came from an effect (quick-bar portrait, specialty link): Flip
  // then cached the closed sizes and restored them on complete, leaving
  // row-sized photos stacked on the rail.
  const toggleFlipRef = useRef<{
    state: ReturnType<typeof Flip.getState>;
    vars: Flip.FromToVars;
  } | null>(null);

  useLayoutEffect(() => {
    const pending = toggleFlipRef.current;
    if (!pending) return;
    toggleFlipRef.current = null;
    isAnimatingRef.current = true;
    Flip.from(pending.state, {
      ...pending.vars,
      ease,
      absolute: true,
      props: "borderRadius",
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [opened, ease]);

  const open = useCallback(() => {
    if (opened || isAnimatingRef.current || stageWidth === 0) return;
    if (!reducedMotion && !isMobile) {
      toggleFlipRef.current = {
        state: Flip.getState(orderedCards(), { props: "borderRadius" }),
        vars: { duration, stagger: 0.04 },
      };
    }
    setOpened(true);
  }, [opened, stageWidth, reducedMotion, isMobile, orderedCards, duration]);

  const close = useCallback(() => {
    if (!opened || isAnimatingRef.current) return;
    if (!reducedMotion && !isMobile) {
      toggleFlipRef.current = {
        state: Flip.getState(orderedCards(), { props: "borderRadius" }),
        vars: { duration: duration * 0.9, stagger: { each: 0.035, from: "end" } },
      };
    }
    setOpened(false);
    onClose?.();
  }, [opened, isMobile, reducedMotion, orderedCards, duration, onClose]);

  // Closed: the row is laid out by item, so reordering does not move any
  // card; put the chosen one first, then open (Flip from the row).
  const openOn = useCallback(
    (itemIndex: number) => {
      if (opened) {
        select(itemIndex);
        return;
      }
      if (itemIndex === order[0]) {
        open();
        return;
      }
      pendingOpenRef.current = true;
      setOrder((prev) => {
        const next = [...prev];
        const from = next.indexOf(itemIndex);
        next[from] = next[0];
        next[0] = itemIndex;
        return next;
      });
    },
    [opened, order, select, open]
  );

  // External request to bring an item forward (e.g. a specialty link).
  // Deferred a frame so Flip measures the laid-out cards.
  useEffect(() => {
    if (focusId === undefined) return;
    const itemIndex = items.findIndex((item, i) => (item.id ?? i) === focusId);
    if (itemIndex < 0) return;
    const frame = requestAnimationFrame(() => openOn(itemIndex));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only on a new request
  }, [focusId, focusKey]);

  useEffect(() => {
    if (!pendingOpenRef.current || stageWidth === 0) return;
    pendingOpenRef.current = false;
    open();
  }, [order, open, stageWidth]);

  const heroItemIndex = order[0] ?? 0;
  const heroItem = items[heroItemIndex];
  const nextCaption = heroItem?.caption;
  const activeCaption = reducedMotion ? nextCaption : shownCaption;

  useEffect(() => {
    if (reducedMotion || nextCaption === shownCaption) return;
    const el = captionRef.current;
    if (!el) {
      revertCaptionSplit();
      setShownCaption(nextCaption);
      return;
    }
    captionTweenRef.current?.kill();
    captionTweenRef.current = gsap.to(el, {
      opacity: 0,
      y: -8,
      duration: captionFadeDuration,
      ease: "power2.in",
      onComplete: () => {
        revertCaptionSplit();
        setShownCaption(nextCaption);
      },
    });
  }, [nextCaption, shownCaption, reducedMotion, captionFadeDuration, revertCaptionSplit]);

  useLayoutEffect(() => {
    const el = captionRef.current;
    if (!el || !activeCaption) return;
    if (reducedMotion) {
      revertCaptionSplit();
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    captionTweenRef.current?.kill();
    revertCaptionSplit();
    gsap.set(el, { opacity: 1, y: 0 });
    const split = SplitText.create(el, {
      type: "lines",
      linesClass: "hxs-caption-line",
      mask: "lines",
    });
    captionSplitRef.current = split;
    const lines = split.lines;
    if (!lines?.length) {
      revertCaptionSplit();
      return;
    }
    gsap.set(lines, { yPercent: 100 });
    captionTweenRef.current = gsap.to(lines, {
      yPercent: 0,
      duration: captionRevealDuration,
      stagger: captionLineStagger,
      ease: "power3.out",
    });
    return () => {
      captionTweenRef.current?.kill();
      revertCaptionSplit();
    };
  }, [activeCaption, reducedMotion, captionRevealDuration, captionLineStagger, revertCaptionSplit]);

  // Fade the info panel in whenever the hero item changes.
  useLayoutEffect(() => {
    const el = infoRef.current;
    if (!el || reducedMotion || !opened) return;
    const tween = gsap.fromTo(
      el.querySelectorAll("[data-info-line]"),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power2.out", delay: 0.12 }
    );
    return () => {
      tween.kill();
    };
  }, [heroItemIndex, opened, reducedMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root || !root.contains(document.activeElement)) return;
      if (e.key === "Escape") {
        close();
        return;
      }
      if (!opened || items.length < 2) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        select(order[1]);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        select(order[order.length - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [order, select, close, opened, items.length]);

  if (items.length === 0) return null;

  const heroSlotLabel = heroItemIndex + 1;
  const itemTitle = heroItem?.title ?? title;
  const itemMeta = heroItem?.meta ?? meta;
  const itemDescription = heroItem?.description ?? description;
  const itemDetails = heroItem?.details;
  const accent = accentColor ?? textColor;

  const infoBlock = (
    <>
      {itemMeta && (
        <p data-info-line className="m-0 text-[0.8rem] font-bold" style={{ color: accent }}>
          {itemMeta}
        </p>
      )}
      <h3
        data-info-line
        className="mt-2 mb-0 text-[clamp(1.45rem,2.4vw,2.1rem)] font-semibold leading-[1.08] tracking-[-0.03em] [text-wrap:balance]"
      >
        {itemTitle}
      </h3>
      {itemDescription && (
        <p data-info-line className="mt-3 mb-0 text-[0.98rem] leading-[1.55]" style={{ color: mutedColor }}>
          {itemDescription}
        </p>
      )}
      {itemDetails && itemDetails.length > 0 && (
        <div data-info-line className="mt-5">
          <p className="m-0 text-[0.78rem] font-bold uppercase tracking-[0.06em]" style={{ color: mutedColor }}>
            {heroItem?.detailsLabel ?? "Formação"}
          </p>
          <ul className="mt-2 mb-0 p-0 list-none grid gap-2">
            {itemDetails.map((line) => (
              <li key={line} className="relative pl-4 text-[0.92rem] leading-[1.45]">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.6em] h-[5px] w-[5px] rounded-full"
                  style={{ background: accent }}
                />
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-5" style={{ minHeight: `${1.4 * captionLines}em` }}>
        <p ref={captionRef} className="m-0 text-[0.8rem] leading-[1.4]" style={{ color: mutedColor }}>
          {activeCaption}
        </p>
      </div>
    </>
  );

  const cardLabel = (item: GsapFlipCardItem) => (
    <>
      {item.meta && (
        <p className="m-0 text-[0.74rem] font-bold leading-[1.3]" style={{ color: accent }}>
          {item.meta}
        </p>
      )}
      <p className="mt-1 mb-0 text-[0.92rem] font-semibold leading-[1.22] tracking-[-0.01em] [text-wrap:balance]">
        {item.title}
      </p>
      {item.cardLines?.map((line) => (
        <p key={line} className="mt-1 mb-0 text-[0.72rem] leading-[1.35]" style={{ color: mutedColor }}>
          {line}
        </p>
      ))}
      {cardHint && (
        <p
          className="mt-auto pt-2.5 mb-0 text-[0.72rem] font-semibold leading-[1.3] opacity-80 transition-opacity group-hover:opacity-100"
          style={{ color: accent }}
        >
          {cardHint} <span aria-hidden="true">→</span>
        </p>
      )}
    </>
  );

  const ariaFor = (item: GsapFlipCardItem, itemIndex: number) =>
    [item.meta, item.title ?? item.alt ?? `Item ${itemIndex + 1}`, cardHint].filter(Boolean).join(" — ");

  const closedHint = !opened && galleryHint ? (
    <p
      className="m-0 text-center text-[0.8rem] font-normal leading-[18px]"
      style={{ color: `color-mix(in srgb, ${mutedColor} 90%, ${backgroundColor})` }}
    >
      {galleryHint}
    </p>
  ) : null;

  const backButton = (
    <button
      type="button"
      onClick={close}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.82rem] font-semibold cursor-pointer bg-transparent"
      style={{ color: accent, borderColor: "currentColor" }}
    >
      <span aria-hidden="true">←</span> {backLabel}
    </button>
  );

  if (isMobile) {
    if (!opened) {
      return (
        <div
          ref={rootRef}
          className={`hxs-gsap-flip-card relative w-full ${className}`}
          style={{ background: backgroundColor, color: textColor, borderRadius: rounded }}
        >
          <div className="flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 p-4 [scrollbar-width:thin]">
            {items.map((item, itemIndex) => (
              <button
                key={item.id ?? itemIndex}
                type="button"
                onClick={() => openOn(itemIndex)}
                aria-label={ariaFor(item, itemIndex)}
                className="group flex flex-col justify-start shrink-0 snap-start w-[min(46vw,190px)] p-0 border-none bg-transparent text-left cursor-pointer [-webkit-tap-highlight-color:transparent]"
                style={{ color: textColor }}
              >
                <span
                  className="relative block w-full overflow-hidden bg-[#d8d8d4]"
                  style={{ aspectRatio: `1 / ${rowRatio}`, borderRadius: rounded * 0.75 }}
                >
                  <img
                    src={item.image}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 object-cover"
                    style={{ width: "100%", height: "100%", objectPosition: item.imagePosition ?? "center 30%" }}
                  />
                </span>
                <span className="flex flex-1 flex-col mt-3">{cardLabel(item)}</span>
              </button>
            ))}
          </div>
          {closedHint && <div className="px-4 pb-4">{closedHint}</div>}
        </div>
      );
    }

    return (
      <div
        ref={rootRef}
        className={`hxs-gsap-flip-card relative w-full ${className}`}
        style={{ background: backgroundColor, color: textColor, borderRadius: rounded }}
      >
        <div className="p-4 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            {showCounter && (
              <div className="text-[0.8rem] tracking-[0.02em]" aria-live="polite">
                <span className="font-semibold">{pad(heroSlotLabel)}</span>
                <span style={{ color: mutedColor }}> / {pad(items.length)}</span>
              </div>
            )}
            {backButton}
          </div>

          <div className="grid gap-5 sm:grid-cols-[minmax(0,300px)_1fr] sm:items-start">
            {heroItem && (
              <div
                className="relative w-full aspect-[1.1] overflow-hidden bg-[#d8d8d4]"
                style={{ borderRadius: rounded }}
              >
                <img
                  src={heroItem.image}
                  alt={heroItem.alt ?? ""}
                  draggable={false}
                  className="absolute inset-0 object-cover"
                  style={{ width: "100%", height: "100%", objectPosition: heroItem.imagePosition ?? "center 30%" }}
                />
              </div>
            )}

            <div ref={infoRef}>{infoBlock}</div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {order.slice(1).map((itemIndex) => {
              const item = items[itemIndex];
              if (!item) return null;
              return (
                <button
                  key={item.id ?? itemIndex}
                  type="button"
                  onClick={() => select(itemIndex)}
                  aria-label={item.title ?? item.alt ?? `Item ${itemIndex + 1}`}
                  className="relative p-0 border-none overflow-hidden aspect-square w-full bg-[#d8d8d4] cursor-pointer [-webkit-tap-highlight-color:transparent]"
                  style={{ borderRadius: rounded * 0.6 }}
                >
                  <img
                    src={item.image}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 object-cover"
                    style={{ width: "100%", height: "100%", objectPosition: item.imagePosition ?? "center 30%" }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const cardStyle = (itemIndex: number): CSSProperties => {
    if (!opened) {
      return {
        position: "absolute",
        left: rowPad + itemIndex * (cardW + rowGap),
        top: rowTop,
        width: cardW,
        height: cardH,
        borderRadius: rounded * 0.75,
        zIndex: 1,
      };
    }
    const box = slotBox(order.indexOf(itemIndex));
    return {
      position: "absolute",
      left: box.x,
      top: openHeight / 2 + box.y - box.h / 2,
      width: box.w,
      height: box.h,
      borderRadius: box.r,
      zIndex: box.z,
    };
  };

  const chromeStyle: CSSProperties = {
    opacity: opened ? 1 : 0,
    transition: opened ? "opacity 0.5s ease 0.25s" : "opacity 0.2s ease",
    pointerEvents: opened ? undefined : "none",
    visibility: opened ? "visible" : "hidden",
  };

  const labelsStyle: CSSProperties = {
    top: labelsTop,
    left: rowPad,
    right: rowPad,
    gridTemplateColumns: `repeat(${rowCount}, minmax(0, 1fr))`,
    columnGap: rowGap,
    opacity: opened ? 0 : 1,
    transition: opened ? "opacity 0.15s ease" : "opacity 0.4s ease 0.35s",
    pointerEvents: opened ? "none" : undefined,
    visibility: opened ? "hidden" : "visible",
  };

  return (
    <div
      ref={rootRef}
      className={`hxs-gsap-flip-card relative w-full overflow-hidden ${className}`}
      style={{
        background: backgroundColor,
        color: textColor,
        height: stageWidth > 0 ? stageHeight : undefined,
        minHeight: stageWidth > 0 ? undefined : 360,
        borderRadius: rounded,
        transition: reducedMotion ? undefined : `height ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`,
      }}
    >
      {showCounter && (
        <div
          className="absolute top-6 text-[0.85rem] tracking-[0.02em] z-60"
          style={{ ...chromeStyle, left: railX }}
          aria-live="polite"
        >
          <span className="font-semibold">{pad(heroSlotLabel)}</span>
          <span style={{ color: mutedColor }}> / {pad(items.length)}</span>
        </div>
      )}

      <div className="absolute top-5 z-60" style={{ ...chromeStyle, right: railX }}>
        {backButton}
      </div>

      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className={`relative w-full h-full ${opened ? "cursor-pointer" : "cursor-default"}`}
      >
        <div
          ref={infoRef}
          className="absolute -translate-y-1/2 z-30 cursor-default"
          style={{ ...chromeStyle, top: openHeight / 2, left: infoLeft, width: infoWidth }}
        >
          {infoBlock}
        </div>

        <div ref={labelsRef} className="absolute grid items-stretch" style={labelsStyle} aria-hidden="true">
          {items.map((item, itemIndex) => (
            <div key={item.id ?? itemIndex} className="group flex flex-col cursor-pointer" onClick={() => openOn(itemIndex)}>
              {cardLabel(item)}
            </div>
          ))}
        </div>

        {items.map((item, itemIndex) => {
          const isHero = itemIndex === heroItemIndex;
          return (
            <button
              key={item.id ?? itemIndex}
              type="button"
              ref={(n) => registerCard(itemIndex, n)}
              data-flip-id={`hxs-card-${item.id ?? itemIndex}`}
              onClick={() => openOn(itemIndex)}
              aria-label={opened ? item.title ?? item.alt ?? `Item ${itemIndex + 1}` : ariaFor(item, itemIndex)}
              aria-current={(opened && isHero) || undefined}
              tabIndex={opened && isHero ? -1 : 0}
              className={`group p-0 border-none bg-[#d8d8d4] overflow-hidden shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] [-webkit-tap-highlight-color:transparent] ${
                !opened || !isHero ? "cursor-pointer" : "cursor-default"
              }`}
              style={cardStyle(itemIndex)}
            >
              <img
                src={item.image}
                alt={item.alt ?? ""}
                draggable={false}
                className={`absolute inset-0 object-cover rounded-[inherit] transition-transform duration-500 ${
                  opened ? "" : "group-hover:scale-[1.04]"
                }`}
                style={{ width: "100%", height: "100%", objectPosition: item.imagePosition ?? "center 30%" }}
              />
            </button>
          );
        })}
        {closedHint && <div className="absolute inset-x-4 bottom-5">{closedHint}</div>}
      </div>
    </div>
  );
}
