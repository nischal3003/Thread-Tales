"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const [hiding, setHiding] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = true;
    try {
      seen = Boolean(sessionStorage.getItem("tt_loaded"));
    } catch {
      seen = false;
    }
    if (reduced || seen) return;

    started.current = true;
    setVisible(true);

    const start = performance.now();
    const duration = 1100;
    let raf: number;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setPct(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        try {
          sessionStorage.setItem("tt_loaded", "1");
        } catch {
          // ignore
        }
        setHiding(true);
        setTimeout(() => setVisible(false), 500);
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      started.current = false;
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${hiding ? styles.hide : ""}`}>
      <div className={styles.logoWrap}>
        <Image src="/logo-full.png" alt="Thread&Tales" width={1208} height={556} priority className={styles.logo} />
      </div>
      <span className={styles.pct}>{pct}%</span>
    </div>
  );
}
