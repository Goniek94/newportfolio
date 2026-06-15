"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FaGithub, FaCode, FaFileAlt } from "react-icons/fa";

import VSCodeViewer from "./VSCodeViewer";
import ProjectsVaultModal from "./ProjectsVaultModal";
import InteractiveCVModal from "./InteractiveCVModal";

import { heroQuotes } from "../data/hero-quotes";
import {
  autosellFiles,
  matchdaysFiles,
  windowsXpFiles,
} from "../data/vscode/index";

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

  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState(autosellFiles);
  const [currentTitle, setCurrentTitle] = useState("Autosell-Repo");

  // Clock
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString("pl-PL", { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotating hero quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % heroQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handler do odpalania Code Viewera
  const handleOpenVSCode = (projectId: number) => {
    if (projectId === 1) {
      setCurrentFiles(autosellFiles);
      setCurrentTitle("Autosell-Repo");
    } else if (projectId === 2) {
      setCurrentFiles(matchdaysFiles);
      setCurrentTitle("Matchdays-Repo");
    } else if (projectId === 3) {
      setCurrentFiles(windowsXpFiles);
      setCurrentTitle("Windows-XP-Repo");
    }
    setIsProjectsModalOpen(false);
    setIsVSCodeOpen(true);
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#050505] text-[#e1e1e1] flex flex-col justify-center px-4 md:px-12 overflow-hidden pt-32 pb-20"
      >
        {/* --- BACKGROUND --- */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#1a1a1a,transparent)] pointer-events-none opacity-60"></div>

        {/* Nebula gradients — same palette as the loader's deep-space scene */}
        <div className="absolute -left-[15%] -top-[10%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(36,86,196,0.22),transparent_70%)] blur-[120px] pointer-events-none" />
        <div className="absolute -right-[15%] bottom-[-12%] h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(190,42,110,0.20),transparent_70%)] blur-[130px] pointer-events-none" />
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)] blur-[110px] pointer-events-none" />

        {/* --- MAIN CONTENT --- */}
        <div className="z-10 w-full max-w-[1800px] mx-auto flex flex-col justify-center">
          {/* TOP BAR */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-4"
            >
              <div className="h-[2px] w-12 bg-[#D4AF37]" />
              <span className="text-xs md:text-sm font-mono tracking-[0.2em] text-[#D4AF37] uppercase font-bold">
                Software Engineer • Poland
              </span>
            </motion.div>

            {/* ZEGAR */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="relative group shrink-0"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-[#0a0a0a] border-2 border-[#D4AF37]/30 rounded-2xl px-6 py-4 backdrop-blur-sm group-hover:border-[#D4AF37] transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-5xl font-black text-white tabular-nums tracking-tighter">
                    {time}
                  </div>
                  <div className="h-12 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent"></div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-[#27c93f] rounded-full animate-pulse shadow-[0_0_10px_#27c93f]"></div>
                      <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                        Live
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#D4AF37]">
                      Łódź, PL
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
              </div>
            </motion.div>
          </div>

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
          </motion.div>

          {/* ACTION BUTTONS (Bez pobierania, bo przenieśliśmy do CV) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3 md:gap-5 z-30 relative"
          >
            <a
              href="https://github.com/goniek94"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37] rounded-full text-sm font-mono uppercase tracking-widest transition-all hover:text-[#D4AF37]"
            >
              <FaGithub size={16} /> GitHub
            </a>
            <button
              onClick={() => setIsProjectsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37] rounded-full text-sm font-mono uppercase tracking-widest transition-all hover:text-[#D4AF37]"
            >
              <FaCode size={16} /> Code Viewer
            </button>
            <button
              onClick={() => setIsCVModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-full text-sm font-mono uppercase tracking-widest text-[#D4AF37] transition-all"
            >
              <FaFileAlt size={16} /> Interactive CV
            </button>
          </motion.div>

          {/* BIO + ROTATING QUOTES */}
          <div className="mt-12 max-w-3xl border-t border-[#222] pt-10">
            <div className="relative overflow-hidden min-h-[100px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-xl md:text-2xl italic text-neutral-400 font-light leading-relaxed border-l-2 border-[#D4AF37] pl-8"
                >
                  {heroQuotes[quoteIndex].text}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* --- GOLD STACK MARQUEE --- */}
          <div className="mt-16 w-full overflow-hidden whitespace-nowrap pointer-events-none">
            <motion.div
              className="flex gap-10 text-6xl md:text-8xl font-black text-transparent uppercase"
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

      {/* --- WYDZIELONE MODALE --- */}
      <ProjectsVaultModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        onSelectProject={handleOpenVSCode}
      />

      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={currentFiles}
        title={currentTitle}
      />

      <InteractiveCVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />
    </>
  );
}
