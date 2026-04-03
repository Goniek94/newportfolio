"use client";

import { useRef, useEffect, useState } from "react";

export default function Counter({
  value,
  suffix = "",
  label,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const [display, setDisplay] = useState<number>(0);
  const [spinning, setSpinning] = useState(false);
  const [settled, setSettled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;

          setTimeout(() => {
            setSpinning(true);

            const totalDuration = 1800;
            const fastPhase = totalDuration * 0.55;
            const slowPhase = totalDuration * 0.45;
            const start = performance.now();

            const animate = (now: number) => {
              const elapsed = now - start;

              if (elapsed < fastPhase) {
                // Faza 1: szybkie losowe liczby
                const randomMax = Math.max(value * 3, 99);
                setDisplay(Math.floor(Math.random() * randomMax));
                requestAnimationFrame(animate);
              } else if (elapsed < fastPhase + slowPhase) {
                // Faza 2: zwalnianie — coraz bliżej docelowej wartości
                const progress = (elapsed - fastPhase) / slowPhase;
                const eased = 1 - Math.pow(1 - progress, 3);
                const noise = Math.floor((1 - eased) * value * 1.5);
                const current = Math.round(
                  value * eased + (Math.random() * noise - noise / 2),
                );
                setDisplay(Math.max(0, Math.min(current, value + noise)));
                requestAnimationFrame(animate);
              } else {
                // Faza 3: zatrzymanie
                setDisplay(value);
                setSpinning(false);
                setSettled(true);
              }
            };

            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.4 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="flex flex-col group">
      {/* Liczba */}
      <div
        className="font-black tabular-nums leading-none transition-colors duration-500"
        style={{
          fontSize: "clamp(3.5rem, 6vw, 6.5rem)",
          color: settled ? "#D4AF37" : spinning ? "#fff" : "#D4AF37",
          textShadow: spinning
            ? "0 0 40px rgba(255,255,255,0.15)"
            : settled
              ? "0 0 60px rgba(212,175,55,0.25)"
              : "none",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: spinning ? "scaleY(1.04)" : "scaleY(1)",
            transition: "transform 0.2s ease",
          }}
        >
          {display}
          {suffix}
        </span>
      </div>

      {/* Separator */}
      <div
        className="mt-3 mb-2 h-px transition-all duration-700"
        style={{
          width: settled ? "100%" : "0%",
          background: "linear-gradient(to right, #D4AF37, transparent)",
        }}
      />

      {/* Label */}
      <div
        className="text-[10px] font-mono uppercase tracking-[0.35em] leading-tight transition-all duration-500"
        style={{
          color: settled ? "rgb(115,115,115)" : "transparent",
        }}
      >
        {label}
      </div>
    </div>
  );
}
