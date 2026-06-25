"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  finishLoading: () => void;
}

// Aino-style intro: a full-screen field of shimmering ASCII characters acts as
// a living TEXTURE. The name + title sit on top as crisp, real typography, with
// a dark halo carved into the ASCII behind them so they read clearly.

const BIG_LINES = ["MATEUSZ", "GOSZCZYCKI"];

const RAMP =
  " .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

const REVEAL_MS = 2400; // counter 0 → 100
const HOLD_MS = 800; // linger once resolved
const COLUMNS = 6; // exit curtain panels
const DIM = "#54514a"; // warm-grey field

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Mask-reveal variant for each line of the headline.
const lineReveal = {
  hidden: { y: "115%" },
  show: (i: number) => ({
    y: "0%",
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.3 + i * 0.13,
    },
  }),
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
    let fontSize = 13;
    let halo: Float32Array = new Float32Array(0); // 0..1 darkening behind text

    // Build a soft, rounded-rectangle dark halo in the center where the text
    // sits, so the ASCII field is knocked back behind the headline.
    const buildHalo = () => {
      halo = new Float32Array(cols * rows);
      const cx = cols / 2;
      const cy = rows / 2;
      const hw = cols * 0.3; // halo half-width
      const hh = rows * 0.22; // halo half-height
      const feather = Math.max(cols, rows) * 0.06;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // distance to the rounded rect (in cells)
          const dx = Math.max(0, Math.abs(x - cx) - hw);
          const dy = Math.max(0, Math.abs(y - cy) - hh);
          const d = Math.sqrt(dx * dx + dy * dy);
          halo[y * cols + x] = Math.max(0, 1 - d / feather);
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
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
      buildHalo();
    };

    resize();
    window.addEventListener("resize", resize);

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
      ctx.fillStyle = DIM;

      for (let y = 0; y < rows; y++) {
        let row = "";
        const py = y * cellH;
        for (let x = 0; x < cols; x++) {
          const k = y * cols + x;
          const base = reduce ? 0.32 : noise(x, y, t) * 0.5;
          // knock the field back behind the headline
          const b = base * (1 - 0.97 * halo[k]);
          const idx = Math.max(0, Math.min(lastN, Math.round(b * lastN)));
          row += RAMP[idx];
        }
        ctx.fillText(row, 0, py);
      }

      if (elapsed >= REVEAL_MS && !finishedAt) finishedAt = now;
      if (finishedAt && now - finishedAt >= HOLD_MS) {
        setLeaving(true);
        return;
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
      {/* Living ASCII texture */}
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 38%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* ── Crisp headline on top of the texture ── */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="leading-[0.92]">
          {BIG_LINES.map((line, i) => (
            <div key={line} className="overflow-hidden">
              <motion.h1
                custom={i}
                variants={lineReveal}
                initial="hidden"
                animate="show"
                className="font-sans text-[clamp(2.75rem,12vw,9.5rem)] font-black uppercase tracking-tight"
                style={{
                  color: i === 1 ? "#E9C45A" : "#ffffff",
                  textShadow:
                    i === 1
                      ? "0 2px 40px rgba(233,196,90,0.35)"
                      : "0 2px 30px rgba(0,0,0,0.8)",
                }}
              >
                {line}
              </motion.h1>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden">
          <motion.p
            initial={{ y: "120%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            className="font-mono text-[clamp(0.7rem,1.6vw,1rem)] uppercase tracking-[0.55em] text-neutral-300"
          >
            Fullstack&nbsp;Engineer
          </motion.p>
        </div>
      </div>

      {/* HUD: counter + meta */}
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
            <span className="text-[#E9C45A]">%</span>
          </span>
        </div>
      </div>

      {/* Exit curtain */}
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
