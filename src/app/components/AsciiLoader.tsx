"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  finishLoading: () => void;
}

// Aino-style intro: a full-screen field of ASCII characters (brightness → glyph
// density) that shimmers like flowing static, out of which the name MATERIALISES
// in gold. Rendered to <canvas> row-by-row for performance.

const NAME_LINES = ["MATEUSZ", "GOSZCZYCKI"];

// Dark → light density ramp (classic 70-char ASCII brightness ramp).
const RAMP =
  " .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

const REVEAL_MS = 2600; // time for the name to fully resolve
const HOLD_MS = 700; // linger once resolved
const COLUMNS = 6; // exit curtain panels
const GOLD = "#D4AF37";
const DIM = "#6f6f6f";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export default function AsciiLoader({ finishLoading }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    let cellW = 0;
    let cellH = 0;
    let fontSize = 12;
    let nameB: Float32Array = new Float32Array(0); // static name brightness grid
    let thresh: Float32Array = new Float32Array(0); // per-cell reveal threshold

    // Build the name-brightness grid by drawing the text to a tiny offscreen
    // canvas at grid resolution, then reading luminance per cell.
    const buildName = () => {
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d");
      if (!o) return;
      o.fillStyle = "#000";
      o.fillRect(0, 0, cols, rows);
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = `900 ${Math.floor(rows / (NAME_LINES.length + 1.2))}px ui-sans-serif, system-ui, sans-serif`;
      const lh = rows / (NAME_LINES.length + 0.6);
      const startY = rows / 2 - ((NAME_LINES.length - 1) * lh) / 2;
      NAME_LINES.forEach((line, i) => {
        // squeeze wide names to fit horizontally
        const m = o.measureText(line);
        const maxW = cols * 0.92;
        const sx = m.width > maxW ? maxW / m.width : 1;
        o.save();
        o.translate(cols / 2, startY + i * lh);
        o.scale(sx, 1);
        o.fillText(line, 0, 0);
        o.restore();
      });
      const data = o.getImageData(0, 0, cols, rows).data;
      nameB = new Float32Array(cols * rows);
      thresh = new Float32Array(cols * rows);
      for (let k = 0; k < cols * rows; k++) {
        nameB[k] = data[k * 4] / 255; // white-on-black → red channel = luma
        thresh[k] = Math.random(); // dissolve-in order
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Bigger cells on small screens (fewer glyphs = smoother).
      fontSize = w < 640 ? 11 : 13;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ui-monospace, "Geist Mono", monospace`;
      ctx.textBaseline = "top";
      cellW = Math.max(ctx.measureText("0").width, 1);
      cellH = fontSize;
      cols = Math.ceil(w / cellW);
      rows = Math.ceil(h / cellH);
      buildName();
    };

    resize();
    window.addEventListener("resize", resize);

    // Cheap flowing "noise" so the background field shimmers.
    const noise = (x: number, y: number, t: number) =>
      0.5 +
      0.18 * Math.sin(x * 0.07 + t * 1.1) +
      0.18 * Math.cos(y * 0.09 - t * 0.8) +
      0.14 * Math.sin((x + y) * 0.05 + t * 1.6);

    const start = performance.now();
    let raf = 0;
    let finishedAt = 0;

    const lastN = RAMP.length - 1;

    const frame = (now: number) => {
      const elapsed = now - start;
      const p = reduce ? 1 : easeOutExpo(Math.min(elapsed / REVEAL_MS, 1));
      const t = now / 1000;

      setCount(Math.round(p * 100));

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px ui-monospace, "Geist Mono", monospace`;

      // Build each row as two strings: a dim field layer + a gold name layer.
      for (let y = 0; y < rows; y++) {
        let fieldRow = "";
        let goldRow = "";
        const py = y * cellH;
        for (let x = 0; x < cols; x++) {
          const k = y * cols + x;
          const field = reduce ? 0.32 : noise(x, y, t) * 0.55;
          // reveal gate: this cell "switches on" as progress passes its threshold
          const gate = smoothstep(thresh[k], thresh[k] + 0.18, p);
          const nb = nameB[k] * gate;
          const b = Math.max(field, nb);
          const idx = Math.max(0, Math.min(lastN, Math.round(b * lastN)));
          const ch = RAMP[idx];
          if (nb > 0.45) {
            // strong name stroke → gold layer, space in field layer
            goldRow += ch;
            fieldRow += " ";
          } else {
            goldRow += " ";
            fieldRow += ch;
          }
        }
        ctx.fillStyle = DIM;
        ctx.fillText(fieldRow, 0, py);
        ctx.fillStyle = GOLD;
        ctx.fillText(goldRow, 0, py);
      }

      if (elapsed >= REVEAL_MS && !finishedAt) {
        finishedAt = now;
      }
      if (finishedAt && now - finishedAt >= HOLD_MS) {
        setLeaving(true);
        return; // stop the render loop; curtain takes over
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.dispatchEvent(new Event("cursor:hide"));
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.dispatchEvent(new Event("cursor:show"));
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#050505]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.6 } }}
    >
      {/* The live ASCII field */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Subtle vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* HUD: counter + meta, on top of the field */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 font-mono text-neutral-400 md:p-10">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.35em]">
          <span>◆ Portfolio · 2026</span>
          <span>Poland</span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[10px] uppercase tracking-[0.35em]">
            Loading
          </span>
          <span className="text-5xl font-bold tabular-nums text-white md:text-7xl">
            {count}
            <span className="text-[#D4AF37]">%</span>
          </span>
        </div>
      </div>

      {/* Exit curtain — column panels sweep up to reveal the site */}
      <div className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-[#050505]"
            initial={{ y: "100%" }}
            animate={leaving ? { y: "0%" } : { y: "100%" }}
            transition={{
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1],
              delay: leaving ? i * 0.06 : 0,
            }}
            onAnimationComplete={
              leaving && i === COLUMNS - 1 ? finishLoading : undefined
            }
          />
        ))}
      </div>
    </motion.div>
  );
}
