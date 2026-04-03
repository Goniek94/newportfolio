"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor — a golden crosshair cursor with trailing dot particles.
 * Replaces the default browser cursor with a high-end agency-style effect.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const TRAIL_COUNT = 8;

  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const trails = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -200, y: -200 })),
  );
  const rafRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch/coarse pointer — hide cursor on mobile
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    // Detect hoverable elements for cursor scale effect
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = target.closest(
        "a, button, [role='button'], [data-cursor='pointer']",
      );
      setIsHovering(!!hoverable);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseover", onMouseOver);

    const animate = () => {
      // Smooth ring follow
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;

      // Cascade trail positions
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        trails.current[i].x +=
          (trails.current[i - 1].x - trails.current[i].x) * 0.35;
        trails.current[i].y +=
          (trails.current[i - 1].y - trails.current[i].y) * 0.35;
      }
      trails.current[0].x += (mouse.current.x - trails.current[0].x) * 0.5;
      trails.current[0].y += (mouse.current.y - trails.current[0].y) * 0.5;

      // Apply positions
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) scale(${isHovering ? 1.8 : 1})`;
      }
      trailsRef.current.forEach((el, i) => {
        if (el) {
          el.style.transform = `translate(${trails.current[i].x}px, ${trails.current[i].y}px)`;
          el.style.opacity = String(((TRAIL_COUNT - i) / TRAIL_COUNT) * 0.6);
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, isHovering]);

  // Don't render on touch/mobile devices
  if (typeof window === "undefined" || isTouchDevice) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[99998]"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
      aria-hidden="true"
    >
      {/* Trailing dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailsRef.current[i] = el;
          }}
          className="fixed top-0 left-0 rounded-full bg-[#D4AF37]"
          style={{
            width: `${Math.max(2, 6 - i * 0.6)}px`,
            height: `${Math.max(2, 6 - i * 0.6)}px`,
            marginLeft: `-${Math.max(1, 3 - i * 0.3)}px`,
            marginTop: `-${Math.max(1, 3 - i * 0.3)}px`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-[#D4AF37]/50"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          transition: "transform 0.05s linear, scale 0.3s ease",
          willChange: "transform",
        }}
      />

      {/* Crosshair dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0"
        style={{ willChange: "transform" }}
      >
        {/* Center dot */}
        <div
          className="absolute rounded-full bg-[#D4AF37]"
          style={{
            width: 4,
            height: 4,
            marginLeft: -2,
            marginTop: -2,
            boxShadow: "0 0 6px rgba(212,175,55,0.8)",
          }}
        />
        {/* Crosshair lines */}
        <div
          className="absolute bg-[#D4AF37]/70"
          style={{ width: 10, height: 1, marginLeft: -5, marginTop: -0.5 }}
        />
        <div
          className="absolute bg-[#D4AF37]/70"
          style={{ width: 1, height: 10, marginLeft: -0.5, marginTop: -5 }}
        />
      </div>
    </div>
  );
}
