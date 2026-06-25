"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allStack } from "./about/data";

// Living "who am I" LAYER (no section of its own) — used as the first half of
// the combined IntroWork section. Rapidly cycles what I build (scramble),
// flashes the stack, ticks facts.

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&/<>";
const GOLD = "#E9C45A";

const BUILDS = [
  "REAL-TIME SYSTEMS",
  "AUCTION ENGINES",
  "PAYMENT FLOWS",
  "AI PIPELINES",
  "MARKETPLACES",
  "THINGS THAT SHIP",
];

const FACTS = [
  "I take problems, not tickets.",
  "Schema → API → UI → prod. Solo.",
  "One paying client. One investor NDA.",
  "Sub-100ms real-time bidding.",
  "Stripe Connect payouts, end to end.",
];

const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37.7 + 5) % 100,
  top: (i * 53.3 + 11) % 100,
  size: 1 + ((i * 5) % 3),
  dur: 5 + ((i * 7) % 9),
  delay: (i * 1.3) % 7,
}));

function useAutoScramble(words: string[], hold = 1500, speed = 26) {
  const [display, setDisplay] = useState(words[0]);
  useEffect(() => {
    let cancelled = false;
    let to: ReturnType<typeof setTimeout>;
    let idx = 0;
    const scrambleTo = (target: string) => {
      let i = 0;
      const total = target.length * 3;
      const run = () => {
        if (cancelled) return;
        setDisplay(
          target
            .split("")
            .map((ch, k) => {
              if (ch === " ") return " ";
              if (k < Math.floor(i / 3)) return target[k];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join(""),
        );
        i++;
        if (i <= total) to = setTimeout(run, speed);
        else {
          setDisplay(target);
          to = setTimeout(next, hold);
        }
      };
      run();
    };
    const next = () => {
      idx = (idx + 1) % words.length;
      scrambleTo(words[idx]);
    };
    to = setTimeout(next, hold);
    return () => {
      cancelled = true;
      clearTimeout(to);
    };
  }, [words, hold, speed]);
  return display;
}

export default function AboutIntro({ bare = false }: { bare?: boolean }) {
  const build = useAutoScramble(BUILDS, 1400, 24);
  const [fact, setFact] = useState(0);
  const [stackI, setStackI] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const f = setInterval(() => setFact((p) => (p + 1) % FACTS.length), 2400);
    const s = setInterval(
      () => setStackI((p) => (p + 1) % allStack.length),
      360,
    );
    const c = setInterval(
      () => setTime(new Date().toLocaleTimeString("pl-PL", { hour12: false })),
      1000,
    );
    setTime(new Date().toLocaleTimeString("pl-PL", { hour12: false }));
    return () => {
      clearInterval(f);
      clearInterval(s);
      clearInterval(c);
    };
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden text-white ${
        bare ? "" : "h-full bg-[#050505]"
      }`}
    >
      {!bare && (
        <>
          {/* grid + glow background */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgba(233,196,90,0.10), transparent 70%)",
            }}
          />
          {/* drifting particles */}
          <div className="pointer-events-none absolute inset-0">
            {PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-[#E9C45A]"
                style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
                animate={{ opacity: [0, 0.6, 0], y: [0, -30, 0] }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </>
      )}

      <div
        className={
          bare
            ? "relative z-10 w-full max-w-2xl"
            : "relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-6 md:px-12"
        }
      >
        {/* top status row */}
        <div className="mb-10 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em]">
          <span className="flex items-center gap-2 text-[#27c93f]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#27c93f] shadow-[0_0_10px_#27c93f]" />
            Available
          </span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400">Mateusz Goszczycki</span>
          <span className="text-neutral-600">/</span>
          <span className="tabular-nums text-neutral-500">{time}</span>
        </div>

        {/* MAIN: I build <scrambling thing> */}
        <h1 className="font-sans text-[clamp(2.4rem,6vw,5.5rem)] font-black uppercase leading-[0.95] tracking-tighter">
          <span className="text-neutral-500">I build</span>
          <br />
          <span
            className="inline-block font-mono"
            style={{ color: GOLD, textShadow: `0 0 40px ${GOLD}55` }}
          >
            {build}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="ml-1"
            >
              _
            </motion.span>
          </span>
        </h1>

        {/* fast-rotating fact */}
        <div className="mt-8 h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={fact}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -28, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg font-light italic text-neutral-300 md:text-2xl"
            >
              {FACTS[fact]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* flashing stack + quick stats */}
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-[#222] pt-8 font-mono">
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">
              stack
            </span>
            <span className="min-w-[9ch] text-base font-bold text-[#E9C45A] md:text-lg">
              {allStack[stackI]}
            </span>
          </div>
          <Stat n="03" label="Prod apps" />
          <Stat n="01" label="Paying client" />
          <Stat n="∞" label="Owned end-to-end" />
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black tabular-nums text-white md:text-3xl">
        {n}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </span>
    </div>
  );
}
