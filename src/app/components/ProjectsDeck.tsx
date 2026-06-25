"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { projects as allProjects, Project } from "../data/projects";

// A deck of project CARDS you choose from. Front card is highlighted, the
// others peek behind. Click a back card to bring it forward; click the front
// card to FLIP it and reveal project details. From the details face you can
// open the full project below.

const DECK = allProjects.filter((p) => p.image);

const ACCENTS: Record<number, string> = {
  1: "#ff6a2b",
  2: "#2b8cff",
  3: "#a855f7",
};
const accentFor = (p: Project) => ACCENTS[p.id] ?? "#E9C45A";
const shortCategory = (c: string) => c.split("·")[0].trim();
const techChips = (p: Project) =>
  p.stackCategories.flatMap((c) => c.items).slice(0, 6);

function posFor(pos: number) {
  const map = [
    { x: 0, y: 0, scale: 1, rotate: 0, z: 30, opacity: 1 },
    { x: 70, y: 24, scale: 0.93, rotate: 4, z: 20, opacity: 0.5 },
    { x: 128, y: 48, scale: 0.86, rotate: 8, z: 10, opacity: 0.28 },
  ];
  return map[Math.min(pos, map.length - 1)];
}

export default function ProjectsDeck({
  bare = false,
  onSelect,
}: {
  bare?: boolean;
  onSelect: (p: Project) => void;
}) {
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const N = DECK.length;
  const accent = accentFor(DECK[active]);

  const select = (i: number) => {
    if (i === active) {
      setFlipped((f) => !f); // clicking the front card flips it
    } else {
      setActive(i);
      setFlipped(false);
    }
  };

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center ${
        bare ? "" : "min-h-screen overflow-hidden rounded-3xl border border-[#ffffff0a] bg-[#050505] py-20"
      }`}
    >
      {/* local accent glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-700"
        style={{ background: `radial-gradient(50% 45% at 50% 45%, ${accent}1f, transparent 70%)` }}
      />

      {/* heading */}
      <div className="relative z-10 mb-7 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#E9C45A]">
          ◆ Selected work
        </span>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
          Pick a project
        </h2>
      </div>

      {/* the deck */}
      <div
        className="relative z-10 h-[600px] w-[min(92vw,460px)]"
        style={{ perspective: "1600px" }}
      >
        {DECK.map((p, i) => {
          const pos = (i - active + N) % N;
          const s = posFor(pos);
          const a = accentFor(p);
          const isFront = pos === 0;
          const isFlipped = isFront && flipped;
          return (
            <motion.div
              key={p.id}
              className="absolute inset-0 cursor-pointer"
              style={{ zIndex: s.z, transformStyle: "preserve-3d" }}
              animate={{ x: s.x, y: s.y, scale: s.scale, rotate: s.rotate, opacity: s.opacity }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onClick={() => select(i)}
            >
              {/* flip wrapper */}
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* ── FRONT FACE ── */}
                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border bg-[#0d0d0d]"
                  style={{
                    backfaceVisibility: "hidden",
                    borderColor: isFront ? `${a}88` : "#ffffff14",
                    boxShadow: isFront
                      ? `0 30px 80px rgba(0,0,0,0.6), 0 0 50px ${a}33`
                      : "0 20px 50px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="relative h-[50%] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      draggable={false}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                    <span
                      className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black"
                      style={{ background: a }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
                      {p.website ? "Live" : "Case study"}
                    </span>
                    <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
                      {p.year}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: a }}>
                      {shortCategory(p.category)}
                    </span>
                    <h3 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-400 line-clamp-3">
                      {p.description}
                    </p>
                    {isFront && (
                      <div className="mt-auto flex items-center justify-between pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                        <span>Tap card for details</span>
                        <span style={{ color: a }}>↻ flip</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── BACK FACE (details) ── */}
                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border bg-[#0d0d0d] p-6"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderColor: `${a}88`,
                    boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 50px ${a}33`,
                  }}
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: a }}>
                    {shortCategory(p.category)}
                  </span>
                  <h3 className="mt-1 text-xl font-black leading-tight text-white">
                    {p.title}
                  </h3>

                  {/* scrollable detail area pulled from the projects data */}
                  <div className="scrollbar-none mt-3 flex-1 overflow-y-auto pr-1">
                    <p className="text-[13px] leading-relaxed text-neutral-400">
                      {p.description}
                    </p>

                    {p.bullets && p.bullets.length > 0 && (
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {p.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2.5">
                            <span
                              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: a }}
                            />
                            <span className="text-[12px] leading-snug text-neutral-300">
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {techChips(p).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[#ffffff14] bg-[#151515] px-2.5 py-1 text-[10px] font-medium text-neutral-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(p);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-black uppercase tracking-[0.2em] text-black"
                      style={{ background: a }}
                    >
                      Open full project ↓
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(false);
                      }}
                      className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white"
                    >
                      ← back
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* choosable tabs */}
      <div className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-3">
        {DECK.map((p, i) => {
          const isActive = i === active;
          const a = accentFor(p);
          return (
            <button
              key={p.id}
              onClick={() => {
                setActive(i);
                setFlipped(false);
              }}
              className="rounded-full border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest transition-all"
              style={{
                borderColor: isActive ? a : "#ffffff18",
                color: isActive ? "#fff" : "#777",
                background: isActive ? `${a}1a` : "transparent",
              }}
            >
              {p.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
