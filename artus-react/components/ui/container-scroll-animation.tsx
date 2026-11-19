"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

type ContainerScrollProps = {
  titleComponent: ReactNode;
  children: ReactNode;
};

export function ContainerScroll({ titleComponent, children }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 20%"],
  });
  const remaining = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const galleryTransform = useMotionTemplate`perspective(1100px) translateY(calc(var(--gallery-rise) * ${remaining})) rotateX(calc(var(--gallery-tilt) * ${remaining})) scale(calc(1 - var(--gallery-shrink) * ${remaining}))`;

  return (
    <div ref={containerRef} className="container-scroll">
      <motion.div className="container-scroll-motion" style={{ y: headingY }}>
        {titleComponent}
      </motion.div>
      <motion.div className="container-scroll-motion" style={{ transform: galleryTransform }}>
        {children}
      </motion.div>
    </div>
  );
}

export function HeroPerspective({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end 30%"],
  });
  const transform = useMotionTemplate`perspective(1400px) translateY(calc(var(--hero-scroll-rise) * ${scrollYProgress})) rotateX(calc(var(--hero-scroll-tilt) * ${scrollYProgress})) scale(calc(1 - var(--hero-scroll-shrink) * ${scrollYProgress}))`;

  return (
    <div className="hero-scroll-stage" ref={stageRef}>
      <motion.div className="hero-scroll-perspective" style={{ transform }}>
        {children}
      </motion.div>
    </div>
  );
}
