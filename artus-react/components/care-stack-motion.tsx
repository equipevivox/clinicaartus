"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mountCareStack } from "@/public/care-stack.mjs";

export function CareStackMotion() {
  useEffect(() => {
    const section = document.getElementById("cuidados");
    if (section) return mountCareStack(section, gsap, ScrollTrigger);
  }, []);
  return null;
}
