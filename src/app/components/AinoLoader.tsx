"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  finishLoading: () => void;
}

// Aino-style intro: a minimal preloader with a counter, a name that rises out
// from behind a mask, then a column-curtain that slides up to reveal the site.
const COUNT_DURATION = 2200; // ms for 0 → 100
const HOLD_AFTER = 450; // ms to linger at 100 before the curtain rises
const COLUMNS = 5; // vertical panels that sweep up on exit

// easeOutExpo — the "heavy", premium deceleration agencies love
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Shared mask-reveal: inner text starts pushed down under an overflow-hidden line
const lineReveal = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.2 + i * 0.12,
    },
  }),
};

export default function AinoLoader({ finishLoading }: LoaderProps) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const startedRef = useRef(false);

  // Animate the counter 0 → 100 with eased timing, then trigger the exit.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_DURATION, 1);
      setCount(Math.round(easeOutExpo(t) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setLeaving(true), HOLD_AFTER);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hide the global custom crosshair cursor while the loader owns the screen.
  useEffect(() => {
    window.dispatchEvent(new Event("cursor:hide"));
    return () => {
      window.dispatchEvent(new Event("cursor:show"));
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#050505] text-[#e8e8e8]"
      initial={{ opacity: 1 }}
      // The container itself fades only after the column curtain has swept up.
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.6 } }}
    >
      {/* ── Column curtain: panels that sweep upward to reveal the site ── */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-[#050505]"
            initial={{ y: "0%" }}
            animate={leaving ? { y: "-100%" } : { y: "0%" }}
            transition={{
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
              delay: leaving ? i * 0.06 : 0,
            }}
          />
        ))}
      </div>

      {/* ── Content layer (sits above the curtain panels) ── */}
      <motion.div
        className="relative z-10 flex h-full w-full flex-col justify-between p-6 md:p-12"
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Top bar — small meta, like a studio header */}
        <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            ◆ Portfolio · 2026
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Poland
          </motion.span>
        </div>

        {/* Center — the name, rising out from behind a mask */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-center leading-[0.95]">
            <div className="overflow-hidden">
              <motion.h1
                custom={0}
                variants={lineReveal}
                initial="hidden"
                animate="show"
                className="font-sans text-[clamp(2.5rem,11vw,9rem)] font-black uppercase tracking-tight text-white"
              >
                Mateusz
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                custom={1}
                variants={lineReveal}
                initial="hidden"
                animate="show"
                className="font-sans text-[clamp(2.5rem,11vw,9rem)] font-black uppercase tracking-tight text-[#D4AF37]"
                style={{ textShadow: "0 0 40px rgba(212,175,55,0.25)" }}
              >
                Goszczycki
              </motion.h1>
            </div>
          </div>

          {/* Subtitle — fades up after the name */}
          <div className="mt-5 overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="font-mono text-[11px] uppercase tracking-[0.5em] text-neutral-400 md:text-sm"
            >
              Full&nbsp;Stack&nbsp;Engineer
            </motion.p>
          </div>
        </div>

        {/* Bottom bar — the counter (Aino signature) + a fill line */}
        <div className="flex flex-col gap-4">
          {/* progress line that fills with the counter */}
          <div className="h-px w-full bg-white/10">
            <motion.div
              className="h-full bg-[#D4AF37]"
              style={{ width: `${count}%` }}
            />
          </div>
          <div className="flex items-end justify-between">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500"
            >
              Loading
            </motion.span>
            <span className="font-mono text-5xl font-bold tabular-nums text-white md:text-7xl">
              {count}
              <span className="text-[#D4AF37]">%</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* When the curtain finishes sweeping up, hand control to the site. */}
      {leaving && (
        <motion.div
          onAnimationComplete={finishLoading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9 + (COLUMNS - 1) * 0.06 }}
        />
      )}
    </motion.div>
  );
}
