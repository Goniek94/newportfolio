"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const quotes = [
  {
    id: 1,
    text: (
      <>
        I independently built an{" "}
        <span className="text-[#D4AF37]">Enterprise Marketplace</span> with
        real-time features and advanced architecture in just 12 months.
      </>
    ),
  },
  {
    id: 2,
    text: (
      <>
        I believe in <span className="text-[#D4AF37]">End-to-End</span> thinking
        — I take ownership of the entire product lifecycle.
      </>
    ),
  },
  {
    id: 3,
    text: (
      <>
        4+ years of continuous learning since 2020, shipping{" "}
        <span className="text-[#D4AF37]">production apps</span> since 2024.
      </>
    ),
  },
];

export default function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pl-PL", { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-svh md:min-h-screen w-full bg-[#050505] text-[#e1e1e1] flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden pt-4 pb-4 md:pt-14 md:pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#1a1a1a,transparent)] pointer-events-none opacity-60" />

      {/* Inner wrapper — fills the section, distributes space on mobile */}
      <div className="z-10 w-full max-w-[1800px] mx-auto flex flex-col flex-1 justify-between md:justify-center">
        {/* TOP BAR — pinned to top on mobile */}
        <div className="flex items-center justify-between mb-4 md:mb-6 gap-3 shrink-0">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-2 md:gap-4 min-w-0"
          >
            <div className="h-[2px] w-6 md:w-12 bg-[#D4AF37] shrink-0" />
            <span className="text-[9px] sm:text-[11px] md:text-sm font-mono tracking-[0.15em] md:tracking-[0.2em] text-[#D4AF37] uppercase font-bold truncate">
              Full Stack Engineer • Poland
            </span>
          </motion.div>

          {/* Clock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative group shrink-0"
          >
            <div className="absolute -inset-1 bg-[#D4AF37]/10 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0a0a0a] border border-[#D4AF37]/40 rounded-xl px-3 py-2 md:px-6 md:py-4 group-hover:border-[#D4AF37] transition-all duration-500">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="font-mono text-xl sm:text-2xl md:text-5xl font-black text-white tabular-nums tracking-tighter">
                  {time}
                </div>
                <div className="h-6 md:h-12 w-[1px] md:w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-0.5">
                    <div className="w-1.5 h-1.5 bg-[#27c93f] rounded-full animate-pulse" />
                    <span className="text-[8px] md:text-xs font-mono text-neutral-500 uppercase tracking-wider hidden sm:block">
                      Live
                    </span>
                  </div>
                  <div className="text-[10px] md:text-sm font-bold text-[#D4AF37]">
                    PL
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] md:h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* CENTER — name + quotes (flex-1 on mobile to fill space) */}
        <div className="flex-1 md:flex-none flex flex-col justify-center">
          {/* TITLE */}
          <div className="relative z-20 mix-blend-difference">
            <h1
              className="font-black tracking-tighter text-white uppercase leading-[0.85]"
              style={{ fontSize: "clamp(2.2rem, 11vw, 12rem)" }}
            >
              <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                className="block"
              >
                Mateusz
              </motion.span>
              <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.1,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="block text-neutral-500"
              >
                Goszczycki
              </motion.span>
            </h1>
          </div>

          {/* ROTATING QUOTES */}
          <div className="mt-4 md:mt-12 max-w-3xl border-t border-[#222] pt-4 md:pt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-fluid-xl italic text-neutral-400 font-light leading-relaxed border-l-2 border-[#D4AF37] pl-4 md:pl-8"
              >
                {quotes[quoteIndex].text}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* MARQUEE — pinned to bottom on mobile */}
        <div className="mt-4 md:mt-16 w-full overflow-hidden whitespace-nowrap pointer-events-none shrink-0">
          <motion.div
            className="flex gap-6 md:gap-10 font-black text-transparent uppercase"
            style={{
              WebkitTextStroke: "1px #D4AF37",
              opacity: 0.7,
              fontSize: "clamp(1.8rem, 6vw, 6rem)",
            }}
            animate={{ x: [0, -2000] }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
          >
            REACT • NEXT.JS • NEST.JS • TYPESCRIPT • JAVASCRIPT • POSTGRESQL •
            NODE.JS • TAILWIND • DOCKER • PRISMA • REACT • NEXT.JS • NEST.JS
          </motion.div>
        </div>
      </div>
    </section>
  );
}
