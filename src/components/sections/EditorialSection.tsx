"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "@/app/page.module.css";

export default function EditorialSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!section || !image || !text) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const textItems = Array.from(text.children);
      gsap.set(textItems, { opacity: 0, y: 24 });
      gsap.set(image, { opacity: 0, scale: 1.04 });

      gsap.to(image, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 80%" },
      });

      gsap.to(textItems, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.editorial} ref={sectionRef}>
      <div className={styles.editorialImage} ref={imageRef}>
        <Image
          src="/jaipur/amber-fort-elephants.jpg"
          alt="Traditional craft procession"
          fill
          sizes="(max-width: 900px) 100vw, 42vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.editorialText} ref={textRef}>
        <span className="eyebrow">The Source</span>
        <h2>Printed by hand. Never by machine.</h2>
        <p className="text-muted">
          Every Thread&amp;Tales piece starts as hand block-printed cotton — kalamkari vines, bandhani dots, ikat
          stripes — made by the same printers we return to season after season. We cut and stitch each piece
          ourselves, so the craft behind it stays visible.
        </p>
        <a href="/about" className="btn btn-outline">
          Read the full story
        </a>
      </div>
    </div>
  );
}
