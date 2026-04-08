"use client";

/**
 * Counter — slot-machine style, zero React re-renders during animation.
 *
 * How it works:
 *  - Counts from 0 → target using ease-out (fast start, slow finish)
 *  - To make small numbers like "3" feel like spinning, we overshoot first:
 *    count quickly past the target, then ease back down to land precisely.
 *  - ALL number updates go directly to span.textContent — React never re-renders.
 *  - Only ONE React state flip at the end (to show label + gold color).
 */

import { useRef, useEffect, useState } from "react";

const DURATION = 1400; // ms total

// Ease-out cubic — starts fast, decelerates to stop
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

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
  const [settled, setSettled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        setTimeout(() => {
          const span = numRef.current;
          if (!span) return;

          // White color during spin
          span.style.color = "#ffffff";

          const startTime = performance.now();

          // Overshoot: for small values, spin past a higher number then land.
          // E.g. value=3 → spin through ~30-ish before slowing to 3.
          // This gives the "slot machine" feel even for single-digit targets.
          const spinMax = Math.max(value * 8, 20);

          const tick = (now: number) => {
            const elapsed = Math.min((now - startTime) / DURATION, 1);
            const progress = easeOut(elapsed);

            // First 60% of time: count UP fast past spinMax
            // Last 40%: count down/ease to the real value
            let display: number;
            if (elapsed < 0.6) {
              // Rapid upswing: 0 → spinMax
              display = Math.floor((elapsed / 0.6) * spinMax);
            } else {
              // Slow landing: spinMax → value
              const landProgress = easeOut((elapsed - 0.6) / 0.4);
              display = Math.round(spinMax + (value - spinMax) * landProgress);
            }

            span.textContent = `${Math.max(0, display)}${suffix}`;

            if (elapsed < 1) {
              requestAnimationFrame(tick);
            } else {
              // Done — snap to final value, gold color, one React re-render
              span.textContent = `${value}${suffix}`;
              span.style.color = "";
              setSettled(true);
            }
          };

          requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.3 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [value, suffix, delay]);

  return (
    <div ref={containerRef} className="flex flex-col">
      <div
        className="font-black tabular-nums leading-none"
        style={{
          fontSize: "clamp(3.5rem, 6vw, 6.5rem)",
          color: "#D4AF37",
          letterSpacing: "-0.02em",
          transition: "text-shadow 0.6s ease",
          textShadow: settled ? "0 0 60px rgba(212,175,55,0.25)" : "none",
        }}
      >
        <span ref={numRef}>{`0${suffix}`}</span>
      </div>

      {/* Separator */}
      <div
        className="mt-3 mb-2 h-px"
        style={{
          width: settled ? "100%" : "0%",
          background: "linear-gradient(to right, #D4AF37, transparent)",
          transition: settled ? "width 0.7s ease" : "none",
        }}
      />

      {/* Label */}
      <div
        className="text-[10px] font-mono uppercase tracking-[0.35em] leading-tight"
        style={{
          color: settled ? "rgb(115,115,115)" : "transparent",
          transition: "color 0.5s ease",
        }}
      >
        {label}
      </div>
    </div>
  );
}
