"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────
// SPLIT LETTER — top and bottom halves separate on hover
// ─────────────────────────────────────────────
function SplitLetter({
  letter,
  outlined,
  entryDelay,
  inView,
}: {
  letter: string;
  outlined: boolean;
  entryDelay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = outlined
    ? { WebkitTextStroke: "2px #D4AF37", color: "transparent" }
    : { color: "#ffffff" };

  const fontSize = "clamp(4.5rem, 10vw, 11rem)";

  if (letter === " ") {
    return (
      <span
        style={{ display: "inline-block", width: "0.3em" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className="relative inline-block cursor-default select-none"
      style={{ fontSize, lineHeight: "0.85" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Entry animation wrapper */}
      <motion.span
        initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
        animate={
          inView
            ? { y: "0%", opacity: 1, filter: "blur(0px)" }
            : { y: "110%", opacity: 0, filter: "blur(8px)" }
        }
        transition={{
          duration: 0.55,
          delay: entryDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative inline-block overflow-hidden"
        style={{ fontSize, lineHeight: "0.85" }}
      >
        {/* TOP HALF — clips upper 50% and slides up */}
        <motion.span
          animate={
            hovered ? { y: "-35%", opacity: 0.6 } : { y: "0%", opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="absolute inset-0 font-black uppercase tracking-tighter"
          style={{
            ...baseStyle,
            fontSize,
            lineHeight: "0.85",
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
          }}
          aria-hidden="true"
        >
          {letter}
        </motion.span>

        {/* BOTTOM HALF — clips lower 50% and slides down */}
        <motion.span
          animate={
            hovered ? { y: "35%", opacity: 0.6 } : { y: "0%", opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="absolute inset-0 font-black uppercase tracking-tighter"
          style={{
            ...baseStyle,
            fontSize,
            lineHeight: "0.85",
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
          }}
          aria-hidden="true"
        >
          {letter}
        </motion.span>

        {/* Invisible spacer to preserve layout width */}
        <span
          className="font-black uppercase tracking-tighter invisible"
          style={{ fontSize, lineHeight: "0.85" }}
        >
          {letter}
        </span>
      </motion.span>
    </span>
  );
}

// ─────────────────────────────────────────────
// GLITCH WORD — letter-by-letter entry + split hover
// ─────────────────────────────────────────────
export default function GlitchWord({
  text,
  outlined = false,
  entryDelay = 0,
  className = "",
}: {
  text: string;
  outlined?: boolean;
  entryDelay?: number;
  className?: string;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex leading-[0.85] ${className}`}
      style={{ fontWeight: 900 }}
    >
      {text.split("").map((letter, i) => (
        <SplitLetter
          key={i}
          letter={letter}
          outlined={outlined}
          entryDelay={entryDelay + i * 0.04}
          inView={inView}
        />
      ))}
    </div>
  );
}
