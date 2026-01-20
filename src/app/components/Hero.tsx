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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#050505] text-[#e1e1e1] flex flex-col justify-center px-4 md:px-12 overflow-hidden pt-32 pb-32"
    >
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#1a1a1a,transparent)] pointer-events-none opacity-60"></div>

      {/* --- MAIN CONTENT --- */}
      <div className="z-10 w-full max-w-[1800px] mx-auto flex flex-col justify-center h-full">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-[2px] w-12 bg-[#D4AF37]" />
          <span className="text-xs md:text-sm font-mono tracking-[0.2em] text-neutral-400 uppercase">
            Based in Poland • Available for hire
          </span>
        </motion.div>

        {/* TITLE */}
        <motion.div
          style={{ y, opacity }}
          className="relative z-20 mix-blend-difference"
        >
          <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter text-white uppercase break-words">
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

        {/* BIO + ROTATING QUOTES + CTA */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-start border-t border-[#333] pt-10">
          {/* Column 1: Description */}
          <div className="md:col-span-7 text-lg md:text-xl text-neutral-400 leading-relaxed min-h-[160px]">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mb-4"
            >
              <strong className="text-white">Full-stack Developer</strong>{" "}
              crafting complete web solutions — from intuitive UX to robust
              backend architecture.
            </motion.p>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="italic text-neutral-300 border-l-2 border-[#D4AF37] pl-4"
                >
                  {quotes[quoteIndex].text}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Column 2: Buttons */}
          <div className="md:col-span-5 flex flex-col gap-4 items-start md:items-end">
            <motion.a
              href="#projects"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-full hover:bg-[#D4AF37] transition-colors"
            >
              View Projects
            </motion.a>
            <motion.a
              href="https://github.com/Goniek94"
              target="_blank"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="text-sm font-mono text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
            >
              GITHUB PROFILE ↗
            </motion.a>
          </div>
        </div>
      </div>

      {/* --- INFINITE MARQUEE --- */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden whitespace-nowrap pointer-events-none z-0">
        <motion.div
          className="flex gap-10 text-6xl md:text-8xl font-black text-transparent uppercase"
          style={{
            WebkitTextStroke: "1px #D4AF37",
            opacity: 0.6,
          }}
          // Czas trwania (duration) zwiększony do 35s, bo tekst jest dłuższy
          animate={{ x: [0, -1800] }}
          transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
        >
          REACT • NEXT.JS • NEST.JS • TYPESCRIPT • JAVASCRIPT • POSTGRESQL •
          PRISMA • NODE.JS • TAILWIND • DOCKER — REACT • NEXT.JS • NEST.JS •
          TYPESCRIPT • JAVASCRIPT
        </motion.div>
      </div>
    </section>
  );
}
