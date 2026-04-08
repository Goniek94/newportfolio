"use client";

/**
 * SplitWord — scatter / explode effect
 *
 * Entry:  letters fly IN from random scattered positions → assemble
 * Hover:  letters EXPLODE away in different directions (random x, y, rotation)
 * Leave:  letters snap back to their correct positions
 *
 * Each letter gets deterministic "random" values based on its index
 * so the animation is stable across renders.
 */

import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

const isTouchDevice =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

/** Deterministic pseudo-random — seeded by index, avoids re-calculation */
function rand(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return min + (x - Math.floor(x)) * (max - min);
}

interface Scatter {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number; // stagger delay for scatter animation
}

function Letter({
  letter,
  color,
  entryDelay,
  scatterDelay,
  inView,
  scattered,
  scatter,
}: {
  letter: string;
  color: string;
  entryDelay: number;
  scatterDelay: number;
  inView: boolean;
  scattered: boolean;
  scatter: Scatter;
}) {
  const fontSize = "clamp(2.8rem, 9vw, 11rem)";

  if (letter === " ") {
    return (
      <span
        style={{ display: "inline-block", width: "0.25em" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.span
      className="inline-block font-black uppercase tracking-tighter"
      style={{ fontSize, lineHeight: 1.1, color, display: "inline-block" }}
      // Start: scattered (same as hover state)
      initial={{
        x: scatter.x,
        y: scatter.y,
        rotate: scatter.rotate,
        scale: scatter.scale,
        opacity: 0,
      }}
      animate={
        !inView
          ? // Hidden before entering viewport
            isTouchDevice
              ? { opacity: 0, y: 20 }
              : { x: scatter.x, y: scatter.y, rotate: scatter.rotate, scale: scatter.scale, opacity: 0 }
          : scattered
            ? // Desktop hover — explode
              { x: scatter.x * 1.6, y: scatter.y * 1.6, rotate: scatter.rotate * 2, scale: 0.7, opacity: 0 }
            : // Assembled
              isTouchDevice
                ? { opacity: 1, y: 0 }
                : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
      }
      transition={
        scattered
          ? { duration: 0.8, delay: scatterDelay, ease: [0.4, 0, 1, 1] }
          : isTouchDevice
            ? { duration: 0.4, delay: entryDelay, ease: "easeOut" }
            : { duration: 0.65, delay: entryDelay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {letter}
    </motion.span>
  );
}

export default function SplitWord({
  text,
  color = "#ffffff",
  entryDelay = 0,
  className = "",
}: {
  text: string;
  color?: string;
  entryDelay?: number;
  className?: string;
}) {
  const [inView, setInView] = useState(false);
  const [scattered, setScattered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Generate stable scatter values once per word
  const scatterValues = useMemo<Scatter[]>(
    () =>
      text.split("").map((_, i) => ({
        x: rand(i * 3 + 1, -160, 160),
        // Weighted toward falling DOWN (gravity feel) — mostly positive Y
        y: rand(i * 5 + 2, -60, 220),
        rotate: rand(i * 7 + 3, -90, 90),
        scale: rand(i * 11 + 4, 0.2, 0.7),
        // Each letter waits a bit before flying — cascading/waterfall feel
        delay: rand(i * 13 + 5, 0, 0.35),
      })),
    [text],
  );

  // Trigger entry animation when section scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-nowrap ${className}`}
      style={{ fontWeight: 900 }}
      aria-label={text}
      // Hover on the whole word triggers scatter for ALL letters at once
      onMouseEnter={() => !isTouchDevice && setScattered(true)}
      onMouseLeave={() => !isTouchDevice && setScattered(false)}
    >
      {text.split("").map((letter, i) => (
        <Letter
          key={i}
          letter={letter}
          color={color}
          entryDelay={entryDelay + i * 0.04}
          scatterDelay={scatterValues[i].delay}
          inView={inView}
          scattered={scattered}
          scatter={scatterValues[i]}
        />
      ))}
    </div>
  );
}
