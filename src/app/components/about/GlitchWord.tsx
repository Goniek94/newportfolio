"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Detect touch devices once (avoids re-renders)
const isTouchDevice =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

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

  // ← KLUCZOWA ZMIANA: mniejszy clamp na mobilnych
  const fontSize = "clamp(2.8rem, 9vw, 11rem)";
  const lh = "1.2";

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
      style={{ fontSize, lineHeight: lh }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        initial={{ y: "110%", opacity: 0, filter: isTouchDevice ? "blur(0px)" : "blur(8px)" }}
        animate={
          inView
            ? { y: "0%", opacity: 1, filter: "blur(0px)" }
            : { y: "110%", opacity: 0, filter: isTouchDevice ? "blur(0px)" : "blur(8px)" }
        }
        transition={{
          duration: 0.55,
          delay: entryDelay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="block relative"
        style={{ fontSize, lineHeight: lh }}
      >
        <motion.span
          animate={
            hovered ? { y: "-35%", opacity: 0.6 } : { y: "0%", opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="absolute top-0 left-0 w-full font-black uppercase tracking-tighter"
          style={{
            ...baseStyle,
            fontSize,
            lineHeight: lh,
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
          }}
          aria-hidden="true"
        >
          {letter}
        </motion.span>

        <motion.span
          animate={
            hovered ? { y: "35%", opacity: 0.6 } : { y: "0%", opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="absolute top-0 left-0 w-full font-black uppercase tracking-tighter"
          style={{
            ...baseStyle,
            fontSize,
            lineHeight: lh,
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
          }}
          aria-hidden="true"
        >
          {letter}
        </motion.span>

        <span
          className="font-black uppercase tracking-tighter invisible block"
          style={{ fontSize, lineHeight: lh }}
        >
          {letter}
        </span>
      </motion.span>
    </span>
  );
}

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
      { threshold: 0, rootMargin: "0px 0px -20px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-wrap ${className}`}
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
