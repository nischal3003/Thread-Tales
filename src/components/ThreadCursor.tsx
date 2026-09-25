"use client";

import { useEffect, useRef } from "react";
import styles from "./ThreadCursor.module.css";

const TRAIL_LIFETIME = 420; // ms
const DASH_LENGTH = 5;
const DASH_GAP = 6;
const HOVER_SELECTOR = "a, button, input, textarea, select, [role='button'], label.seg-opt";

type Point = { x: number; y: number; t: number };

export default function ThreadCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canPointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canPointer || reduced) return;

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    if (!canvas || !dot) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.documentElement.classList.add("tc-active");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + "px";
      canvas!.style.height = window.innerHeight + "px";
    }
    resize();
    window.addEventListener("resize", resize);

    const points: Point[] = [];
    let hovering = false;
    let rafId = 0;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    function onMove(e: PointerEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      dot!.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

      const target = e.target as Element | null;
      const nowHovering = !!target?.closest(HOVER_SELECTOR);
      if (nowHovering !== hovering) {
        hovering = nowHovering;
        dot!.dataset.hover = String(hovering);
      }
    }

    function onLeave() {
      dot!.dataset.visible = "false";
    }
    function onEnter() {
      dot!.dataset.visible = "true";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    function draw() {
      const now = performance.now();
      while (points.length && now - points[0].t > TRAIL_LIFETIME) points.shift();

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (points.length > 1) {
        ctx!.lineCap = "round";
        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const age = (now - p1.t) / TRAIL_LIFETIME;
          const alpha = Math.max(0, 1 - age) * 0.5;
          if (alpha <= 0) continue;
          ctx!.strokeStyle = `rgba(168, 70, 29, ${alpha})`;
          ctx!.lineWidth = 1.5;
          ctx!.setLineDash([DASH_LENGTH, DASH_GAP]);
          ctx!.beginPath();
          ctx!.moveTo(p0.x, p0.y);
          ctx!.lineTo(p1.x, p1.y);
          ctx!.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    }
    rafId = requestAnimationFrame(draw);
    dot.style.transform = `translate(${lastX}px, ${lastY}px)`;

    return () => {
      document.documentElement.classList.remove("tc-active");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div ref={dotRef} className={styles.dot} data-visible="true" aria-hidden="true" />
    </>
  );
}
