"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

const quotes = [
  {
    id: 1,
    text: (
      <>
        My journey from <span className="text-[#D4AF37]">Head Chef</span> to{" "}
        <span className="text-[#D4AF37]">Developer</span> taught me how to
        manage chaos and deliver quality under pressure.
      </>
    ),
  },
  {
    id: 2,
    text: (
      <>
        I independently built an{" "}
        <span className="text-[#D4AF37]">Enterprise Marketplace</span> with
        real-time features and advanced architecture in just 12 months.
      </>
    ),
  },
  {
    id: 3,
    text: (
      <>
        I believe in <span className="text-[#D4AF37]">End-to-End</span>{" "}
        thinking. I don't just write code; I take ownership of the entire
        product lifecycle.
      </>
    ),
  },
];

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [time, setTime] = useState("");

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pl-PL", { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotating quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#050505] text-[#e1e1e1] flex flex-col justify-center px-4 md:px-12 overflow-hidden pt-24 md:pt-32 pb-16 md:pb-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#1a1a1a,transparent)] pointer-events-none opacity-60" />

      <div className="z-10 w-full max-w-[1800px] mx-auto flex flex-col justify-center">
        {/* TOP BAR */}
        <div className="flex items-start justify-between mb-6 gap-4">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-3 min-w-0"
          >
            <div className="h-[2px] w-8 md:w-12 bg-[#D4AF37] shrink-0" />
            <span className="text-[10px] md:text-sm font-mono tracking-[0.15em] md:tracking-[0.2em] text-[#D4AF37] uppercase font-bold truncate">
              Full Stack Engineer • Poland
            </span>
          </motion.div>

          {/* RIGHT — Clock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative group shrink-0"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0a0a0a] border-2 border-[#D4AF37]/30 rounded-xl md:rounded-2xl px-3 md:px-6 py-2 md:py-4 backdrop-blur-sm group-hover:border-[#D4AF37] transition-all duration-500">
              <div className="flex items-center gap-2 md:gap-4">
                {/* Time */}
                <div className="font-mono text-2xl md:text-5xl font-black text-white tabular-nums tracking-tighter">
                  {time}
                </div>
                {/* Separator */}
                <div className="h-8 md:h-12 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent" />
                {/* Location */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#27c93f] rounded-full animate-pulse shadow-[0_0_10px_#27c93f]" />
                    <span className="text-[9px] md:text-xs font-mono text-neutral-500 uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <div className="text-xs md:text-sm font-bold text-[#D4AF37]">
                    PL
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* TITLE */}
        <motion.div
          style={{ y, opacity }}
          className="relative z-20 mix-blend-difference"
        >
          <h1 className="text-[16vw] sm:text-[14vw] md:text-[12vw] leading-[0.85] font-black tracking-tighter text-white uppercase break-words">
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
              transition={{ duration: 1, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
              className="block text-neutral-500"
            >
              Goszczycki
            </motion.span>
          </h1>
        </motion.div>

        {/* ROTATING QUOTES */}
        <div className="mt-8 md:mt-12 max-w-3xl border-t border-[#222] pt-6 md:pt-10">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-base md:text-xl lg:text-2xl italic text-neutral-400 font-light leading-relaxed border-l-2 border-[#D4AF37] pl-4 md:pl-8"
              >
                {quotes[quoteIndex].text}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="mt-10 md:mt-16 w-full overflow-hidden whitespace-nowrap pointer-events-none">
          <motion.div
            className="flex gap-6 md:gap-10 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-transparent uppercase"
            style={{ WebkitTextStroke: "1.5px #D4AF37", opacity: 0.8 }}
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
