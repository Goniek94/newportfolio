"use client";

import { useEffect, useRef } from "react";

// A cursor "flashlight" that reveals a living ASCII texture beneath the hero —
// the same character aesthetic as the intro loader, tying the two together.
// Everything is dark until the cursor (or, on touch, a slow auto-path) sweeps
// over it and the ASCII field lights up in gold within a soft radius.

const RAMP = " .:-=+*ho#W%@$08&MB";

export default function HeroSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let cellW = 0;
    let cellH = 0;
    let fontSize = 13;
    let radius = 200;
    const lastN = RAMP.length - 1;

    // Spotlight position (px, relative to canvas). Start off-canvas centred.
    const mouse = { x: -9999, y: -9999, has: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      fontSize = w < 640 ? 12 : 14;
      radius = Math.min(Math.max(w, h) * 0.2, 230);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ui-monospace, "Geist Mono", monospace`;
      ctx.textBaseline = "top";
      cellW = Math.max(ctx.measureText("0").width, 1);
      cellH = fontSize + 2;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.has = true;
    };
    const onLeave = () => {
      mouse.has = false;
    };
    window.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);

    const noise = (x: number, y: number, t: number) =>
      0.5 +
      0.22 * Math.sin(x * 0.45 + t * 1.2) +
      0.22 * Math.cos(y * 0.5 - t * 0.9) +
      0.16 * Math.sin((x + y) * 0.3 + t * 1.7);

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = reduce ? 0 : (now - start) / 1000;

      // Touch / no-mouse → drift the spotlight along a gentle path so it lives.
      let mx = mouse.x;
      let my = mouse.y;
      if (!mouse.has) {
        mx = w * (0.5 + 0.28 * Math.sin(t * 0.45));
        my = h * (0.5 + 0.22 * Math.cos(t * 0.35));
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px ui-monospace, "Geist Mono", monospace`;

      // Only iterate the grid cells inside the spotlight bounding box.
      const c0 = Math.max(0, Math.floor((mx - radius) / cellW));
      const c1 = Math.min(Math.ceil(w / cellW), Math.ceil((mx + radius) / cellW));
      const r0 = Math.max(0, Math.floor((my - radius) / cellH));
      const r1 = Math.min(Math.ceil(h / cellH), Math.ceil((my + radius) / cellH));

      for (let r = r0; r < r1; r++) {
        const py = r * cellH;
        for (let c = c0; c < c1; c++) {
          const px = c * cellW;
          const dx = px - mx;
          const dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue;

          // soft falloff 1 (centre) → 0 (edge)
          const fall = 1 - dist / radius;
          const soft = fall * fall;
          const b = noise(c, r, t) * soft;
          if (b < 0.06) continue;

          const idx = Math.max(0, Math.min(lastN, Math.round(b * lastN)));
          // bright core = gold, outer ring = dim warm grey
          if (soft > 0.55) {
            ctx.fillStyle = `rgba(233,196,90,${0.35 + soft * 0.55})`;
          } else {
            ctx.fillStyle = `rgba(150,140,110,${0.25 + soft * 0.4})`;
          }
          ctx.fillText(RAMP[idx], px, py);
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
    />
  );
}
