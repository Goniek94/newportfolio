"use client";

import { useRef, useEffect, useState } from "react";

// Animated number counter — starts when element enters viewport
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
  const [count, setCount] = useState(0);
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
            const steps = 50;
            const inc = value / steps;
            let cur = 0;
            const t = setInterval(() => {
              cur += inc;
              if (cur >= value) {
                setCount(value);
                clearInterval(t);
              } else setCount(Math.floor(cur));
            }, 1400 / steps);
          }, delay);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="flex flex-col">
      <div
        className="font-black text-[#D4AF37] tabular-nums leading-none"
        style={{ fontSize: "clamp(2.5rem, 4vw, 4.5rem)" }}
      >
        {count}
        {suffix}
      </div>
      <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-600 mt-2 leading-tight">
        {label}
      </div>
    </div>
  );
}
