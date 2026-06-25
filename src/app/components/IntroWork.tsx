"use client";

import { motion } from "framer-motion";
import AboutIntro from "./AboutIntro";
import ProjectsDeck from "./ProjectsDeck";
import HeroSpotlight from "./HeroSpotlight";
import { Project } from "../data/projects";

// ONE split section: left = who I am (animated), right = project cards to pick.
// Clicking a card flips it to reveal details; from there you open the full
// project below. No scroll trickery — it's a single, self-contained section.

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 43.7 + 5) % 100,
  top: (i * 51.3 + 9) % 100,
  size: 1 + ((i * 5) % 3),
  dur: 5 + ((i * 7) % 9),
  delay: (i * 1.3) % 7,
}));

export default function IntroWork({
  start,
  onSelect,
}: {
  start: boolean;
  onSelect: (p: Project) => void;
}) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white">
      {/* shared background — living ASCII texture (ties back to the intro), dimmed */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <HeroSpotlight />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 22% 45%, rgba(233,196,90,0.10), transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[#E9C45A]"
            style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
            animate={{ opacity: [0, 0.5, 0], y: [0, -28, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1640px] grid-cols-1 items-center gap-16 px-6 py-28 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-14">
        {/* LEFT — about / identity */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={start ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center lg:justify-start"
        >
          <AboutIntro bare />
        </motion.div>

        {/* RIGHT — project cards to choose */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={start ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <ProjectsDeck bare onSelect={onSelect} />
        </motion.div>
      </div>
    </section>
  );
}
