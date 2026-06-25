"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { projects as allProjects, Project } from "../data/projects";

// A cinematic "showroom" (intrkt-style): a dark studio with a glowing screen,
// reflective floor, ambient colour wash, mouse-parallax tilt, breathing glow,
// drifting embers and a spin transition between projects. Pure CSS / framer.

const SHOW = allProjects.filter((p) => p.image);

const ACCENTS: Record<number, { glow: string; soft: string }> = {
  1: { glow: "#ff6a2b", soft: "rgba(255,90,30,0.22)" }, // Autosell — ember
  2: { glow: "#2b8cff", soft: "rgba(43,140,255,0.20)" }, // Matchdays — electric blue
  3: { glow: "#a855f7", soft: "rgba(168,85,247,0.20)" }, // Windows XP — violet
};
const accentFor = (p: Project) =>
  ACCENTS[p.id] ?? { glow: "#D4AF37", soft: "rgba(212,175,55,0.2)" };

// Deterministic drifting embers
const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61.3 + 7) % 100,
  bottom: (i * 17) % 40,
  size: 2 + ((i * 7) % 4),
  dur: 6 + ((i * 5) % 7),
  delay: (i * 1.7) % 6,
  drift: ((i % 5) - 2) * 18,
}));

export default function ProjectsShowroom({
  onSelect,
  fullscreen = false,
}: {
  onSelect: (p: Project) => void;
  fullscreen?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const project = SHOW[active] ?? SHOW[0];
  const accent = accentFor(project);

  // ── mouse-parallax tilt ──
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, (v) => v * 18);
  const rotateX = useTransform(sy, (v) => v * -13);
  const glowX = useTransform(sx, (v) => v * 40);

  const onStageMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onStageLeave = () => {
    mx.set(0);
    my.set(0);
    setPaused(false);
  };

  // Auto-advance through projects (pauses on hover).
  useEffect(() => {
    if (paused || SHOW.length < 2) return;
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % SHOW.length);
    }, 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  if (!project) return null;

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden bg-black ${
        fullscreen ? "min-h-screen" : "rounded-3xl border border-[#ffffff0a]"
      }`}
      style={fullscreen ? undefined : { minHeight: "min(82vh, 760px)" }}
    >
      {/* ── Ambient colour wash (crossfades per project) ── */}
      <AnimatePresence>
        <motion.div
          key={`amb-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 80% at 50% 38%, ${accent.soft} 0%, transparent 55%), radial-gradient(60% 50% at 50% 100%, ${accent.soft} 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* room vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 100% at 50% 0%, transparent 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* big animated PROJECTS marquee in the back */}
      <div className="pointer-events-none absolute inset-x-0 top-[34%] z-0 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap text-[14vw] font-black uppercase leading-none tracking-tighter"
          style={{ WebkitTextStroke: `1px ${accent.glow}`, color: "transparent", opacity: 0.07 }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <span className="pr-10">PROJECTS · PROJECTS · PROJECTS · PROJECTS · </span>
          <span className="pr-10">PROJECTS · PROJECTS · PROJECTS · PROJECTS · </span>
        </motion.div>
      </div>

      {/* perspective floor grid (slow flow) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] overflow-hidden [perspective:600px]">
        <motion.div
          className="absolute inset-x-[-50%] bottom-0 h-[200%] origin-bottom"
          style={{
            transform: "rotateX(72deg)",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to top, black 0%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 80%)",
          }}
          animate={{ backgroundPositionY: ["0px", "60px"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* drifting embers in the accent colour */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {EMBERS.map((e, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${e.left}%`,
              bottom: `${e.bottom}%`,
              width: e.size,
              height: e.size,
              background: accent.glow,
              boxShadow: `0 0 8px ${accent.glow}`,
            }}
            animate={{ y: [0, -160], x: [0, e.drift], opacity: [0, 0.7, 0] }}
            transition={{
              duration: e.dur,
              delay: e.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── TOP BAR ── */}
      <div className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="font-mono text-sm font-black tracking-[0.3em] text-white">
          ◧ PROJECTS
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 md:block">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(SHOW.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── CENTER STAGE: glowing screen + reflection ── */}
      <div
        className="relative z-10 flex flex-1 items-center justify-center px-6 pt-2 pb-[16%] md:pt-6 [perspective:1400px]"
        onMouseMove={onStageMove}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={onStageLeave}
      >
        <motion.button
          onClick={() => onSelect(project)}
          initial={{ opacity: 0, scale: 1.25, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="group relative block w-[min(64vw,820px)] cursor-pointer"
          aria-label={`Open ${project.title}`}
        >
          <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
            {/* breathing glow behind the screen */}
            <AnimatePresence>
              <motion.div
                key={`glow-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.45, 0.62, 0.45], scale: [1, 1.06, 1] }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute -inset-6 rounded-[2rem]"
                style={{ background: accent.glow, filter: "blur(70px)", x: glowX }}
              />
            </AnimatePresence>

            {/* the screen frame */}
            <div
              className="relative h-full w-full overflow-hidden rounded-xl border bg-[#0a0a0a]"
              style={{
                borderColor: accent.glow,
                boxShadow: `0 0 2px ${accent.glow}, 0 0 40px ${accent.glow}66, inset 0 0 60px ${accent.glow}22`,
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={`img-${active}`}
                  src={project.image}
                  alt={project.title}
                  draggable={false}
                  initial={{ opacity: 0, rotateY: 35, scale: 1.06 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -35, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="rounded-full border border-white/30 bg-black/50 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-md">
                  Open project →
                </span>
              </div>
            </div>

            {/* floor reflection */}
            <div
              aria-hidden
              className="absolute left-0 top-full h-full w-full overflow-hidden rounded-xl"
              style={{
                transform: "scaleY(-1)",
                opacity: 0.26,
                filter: "blur(2px)",
                maskImage: "linear-gradient(to bottom, black, transparent 70%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black, transparent 70%)",
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={`refl-${active}`}
                  src={project.image}
                  alt=""
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </AnimatePresence>
            </div>
          </div>
        </motion.button>
      </div>

      {/* ── PROJECT ROW (bottom) ── */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 md:px-10 md:pb-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {SHOW.map((p, i) => {
            const isActive = i === active;
            const a = accentFor(p);
            return (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                onDoubleClick={() => onSelect(p)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className="group text-left"
              >
                <div className="mb-2 h-px w-full bg-white/10">
                  <motion.div
                    className="h-full"
                    style={{ background: a.glow }}
                    initial={false}
                    animate={{ width: isActive ? "100%" : "0%" }}
                    transition={{ duration: isActive ? 5 : 0.3, ease: "linear" }}
                  />
                </div>
                <div
                  className="font-mono text-sm font-black uppercase tracking-wide transition-colors duration-300 md:text-base"
                  style={{ color: isActive ? "#fff" : "#666" }}
                >
                  {p.title}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600">
                  {p.year}
                </div>
                <div
                  className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
                  style={{ color: isActive ? a.glow : "#444" }}
                >
                  {p.website ? "● Live" : "● Case study"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
