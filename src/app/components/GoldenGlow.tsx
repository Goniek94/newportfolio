"use client";

import { useEffect, useRef } from "react";

export default function GoldenGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const visible = useRef(false);

  useEffect(() => {
    // Na urządzeniach dotykowych nie odpalamy nic
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible.current && glowRef.current) {
        glowRef.current.style.opacity = "1";
        visible.current = true;
        pos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
        visible.current = false;
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-10"
      style={{
        width: 400,
        height: 400,
        marginLeft: -200,
        marginTop: -200,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(212,175,55,0.07) 0%, rgba(212,175,55,0.03) 30%, rgba(180,140,30,0.01) 55%, transparent 70%)",
        opacity: 0,
        transition: "opacity 0.4s ease",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
