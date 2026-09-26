"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis, scrollToSection } from "@/lib/lenis-instance";

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => scrollToSection(id), 300);
    }

    // This page's height keeps growing as client sections mount and fetch their
    // own data (Shop/Checkout products, images, etc). Lenis's ResizeObserver
    // doesn't reliably catch scrollHeight growth on documentElement, so its
    // cached scroll limit goes stale and clamps scrollTo targets short. Force a
    // recalculation on an interval for the page's lifetime — cheap, and it's
    // what keeps both manual scrolling and scrollToSection() honest.
    const resizeInterval = setInterval(() => lenis.resize(), 500);

    return () => {
      clearInterval(resizeInterval);
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
