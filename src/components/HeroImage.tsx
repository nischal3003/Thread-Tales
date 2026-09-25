"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HeroImage.module.css";

export default function HeroImage({ src, alt, sticker }: { src: string; alt: string; sticker?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reveal = revealRef.current;
    if (!root || !reveal) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(
      reveal,
      { clipPath: "inset(0% 0% 100% 0%)", scale: 1.15 },
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.3, ease: "power3.out" },
    );

    const parallax = gsap.to(reveal, {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0 },
    });

    return () => {
      tl.kill();
      parallax.scrollTrigger?.kill();
      parallax.kill();
    };
  }, []);

  return (
    <div className={styles.hero} ref={rootRef}>
      <div className={styles.reveal} ref={revealRef}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 45vw"
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
        />
      </div>
      {sticker && <span className={styles.sticker}>{sticker}</span>}
    </div>
  );
}
