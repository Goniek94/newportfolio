"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaGithub,
  FaCode,
  FaFileAlt,
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaEnvelope,
  FaPhoneAlt,
  FaFolderOpen,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";

// Importy potrzebne do uruchomienia VSCode wprost z Hero
import VSCodeViewer from "./VSCodeViewer";
import {
  autosellFiles,
  newEcomatiFiles,
  windowsXpFiles,
} from "../data/vscode/index";

const quotes = [
  {
    id: 1,
    text: (
      <>
        I built and delivered a production-ready{" "}
        <span className="text-[#D4AF37]">full-stack marketplace</span> for a
        client, handling everything from requirements to deployment.
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
        From <span className="text-[#D4AF37]">Head Chef</span> to Developer — I
        know how to handle heat, deliver under pressure, and organize complex
        processes.
      </>
    ),
  },
];

export default function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [time, setTime] = useState("");

  // Stany Modali
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  // Stany dla VSCode
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState(autosellFiles);
  const [currentTitle, setCurrentTitle] = useState("Autosell-Repo");

  // Obsługa otwierania konkretnego projektu
  const handleOpenVSCode = (projectId: number) => {
    if (projectId === 1) {
      setCurrentFiles(autosellFiles);
      setCurrentTitle("Autosell-Repo");
    } else if (projectId === 2) {
      setCurrentFiles(newEcomatiFiles);
      setCurrentTitle("Ecomati-Repo");
    } else if (projectId === 3) {
      setCurrentFiles(windowsXpFiles);
      setCurrentTitle("Windows-XP-Repo");
    }
    setIsProjectsModalOpen(false); // Zamknij modal z listą
    setIsVSCodeOpen(true); // Otwórz edytor VSCode
  };

  // Blokowanie scrolla gdy którykolwiek modal jest otwarty
  useEffect(() => {
    if (isCVModalOpen || isProjectsModalOpen || isVSCodeOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCVModalOpen, isProjectsModalOpen, isVSCodeOpen]);

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
    <>
      <section className="relative min-h-svh md:min-h-screen w-full bg-[#050505] text-[#e1e1e1] flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden pt-4 pb-4 md:pt-14 md:pb-20">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#1a1a1a,transparent)] pointer-events-none opacity-60" />

        {/* Inner wrapper */}
        <div className="z-10 w-full max-w-[1800px] mx-auto flex flex-col flex-1 justify-between md:justify-center">
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-4 md:mb-6 gap-3 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-2 md:gap-4 min-w-0"
            >
              <div className="h-[2px] w-6 md:w-12 bg-[#D4AF37] shrink-0" />
              <span className="text-[9px] sm:text-[11px] md:text-sm font-mono tracking-[0.15em] md:tracking-[0.2em] text-[#D4AF37] uppercase font-bold truncate">
                Full Stack Developer • Poland
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

          {/* CENTER */}
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

            {/* ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 md:mt-10 flex flex-wrap items-center gap-3 md:gap-5 z-30 relative"
            >
              <a
                href="https://github.com/goniek94"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-4 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37] rounded-full text-xs md:text-sm font-mono uppercase tracking-widest transition-all hover:text-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] cursor-pointer"
              >
                <FaGithub size={16} /> GitHub
              </a>

              <button
                onClick={() => setIsProjectsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-4 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37] rounded-full text-xs md:text-sm font-mono uppercase tracking-widest transition-all hover:text-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] cursor-pointer"
              >
                <FaCode size={16} /> Code Viewer
              </button>

              <button
                onClick={() => setIsCVModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-full text-xs md:text-sm font-mono uppercase tracking-widest text-[#D4AF37] transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer"
              >
                <FaFileAlt size={16} /> Interactive CV
              </button>
            </motion.div>

            {/* ROTATING QUOTES */}
            <div className="mt-8 md:mt-12 max-w-3xl border-t border-[#222] pt-4 md:pt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-fluid-xl italic text-neutral-400 font-light leading-relaxed border-l-2 border-[#D4AF37] pl-4 md:pl-8 min-h-[80px]"
                >
                  {quotes[quoteIndex].text}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* MARQUEE */}
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

      {/* ------------------------------------------------------------------ */}
      {/* 1. MODAL: WYBÓR PROJEKTÓW DLA CODE VIEWER */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isProjectsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setIsProjectsModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#050505] border border-[#D4AF37]/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <button
                onClick={() => setIsProjectsModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-[#D4AF37] transition-colors p-2 bg-[#0a0a0a] rounded-full border border-[#1a1a1a] cursor-pointer z-50"
              >
                <FaTimes size={16} />
              </button>

              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-2 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Select
                    Source
                  </h3>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
                    Code <span className="text-[#D4AF37]">Vault</span>
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      name: "Autosell.pl",
                      desc: "Production Marketplace • Node.js, Express, Socket.IO",
                    },
                    {
                      id: 2,
                      name: "Ecomati.pl",
                      desc: "Organic E-Commerce • Next.js, Prisma, PostgreSQL",
                    },
                    {
                      id: 3,
                      name: "Windows XP",
                      desc: "Interactive Portfolio • React, TS, Tailwind",
                    },
                  ].map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => handleOpenVSCode(proj.id)}
                      className="group flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#222] group-hover:border-[#D4AF37]/50 flex items-center justify-center text-neutral-500 group-hover:text-[#D4AF37] transition-colors">
                          <FaFolderOpen size={16} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold group-hover:text-[#D4AF37] transition-colors">
                            {proj.name}
                          </h4>
                          <p className="text-[10px] md:text-xs text-neutral-500 font-mono mt-0.5">
                            {proj.desc}
                          </p>
                        </div>
                      </div>
                      <FaChevronRight className="text-neutral-700 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* 2. KOMPONENT VSCODE VIEWER (Wysuwa się po kliknięciu w projekt) */}
      {/* ------------------------------------------------------------------ */}
      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={currentFiles}
        title={currentTitle}
      />

      {/* ------------------------------------------------------------------ */}
      {/* 3. INTERACTIVE CV MODAL */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isCVModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCVModalOpen(false)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#050505] border border-[#D4AF37]/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] custom-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsCVModalOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-neutral-500 hover:text-[#D4AF37] transition-colors p-2 bg-[#0a0a0a] rounded-full border border-[#1a1a1a] cursor-pointer z-50"
              >
                <FaTimes size={20} />
              </button>

              {/* CV Content Wrapper */}
              <div className="p-6 sm:p-10 md:p-14 space-y-12">
                {/* 1. HEADER SECTION */}
                <div className="border-b border-[#1a1a1a] pb-8">
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                    Mateusz <span className="text-[#D4AF37]">Goszczycki</span>
                  </h2>
                  <h3 className="text-xl md:text-2xl text-neutral-300 mt-3 font-light tracking-wide">
                    Full Stack Developer
                  </h3>

                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                      <FaCalendarAlt className="text-[#D4AF37]" />{" "}
                      <span>Born: 1994</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                      <FaMapMarkerAlt className="text-[#D4AF37]" />{" "}
                      <span>Łowicz / Warsaw, PL (Remote OK)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                      <FaBriefcase className="text-[#D4AF37]" />{" "}
                      <span>Junior / Mid Position</span>
                    </div>
                  </div>

                  {/* Contact Links */}
                  <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[#1a1a1a]/50">
                    <a
                      href="mailto:mateusz.goszczycki1994@gmail.com"
                      className="flex items-center gap-2 text-sm font-mono text-[#D4AF37] hover:underline bg-[#D4AF37]/10 px-4 py-2 rounded-lg cursor-pointer"
                    >
                      <FaEnvelope /> mateusz.goszczycki1994@gmail.com
                    </a>
                    <a
                      href="tel:+48516223029"
                      className="flex items-center gap-2 text-sm font-mono text-[#D4AF37] hover:underline bg-[#D4AF37]/10 px-4 py-2 rounded-lg cursor-pointer"
                    >
                      <FaPhoneAlt /> +48 516 223 029
                    </a>
                    {/* LINK DO POBRANIA - wymaga by plik na dysku nazywał się Mateusz_Goszczycki_CV.pdf */}
                    <a
                      href="/Mateusz_Goszczycki_CV.pdf"
                      download="Mateusz_Goszczycki_CV.pdf"
                      className="flex items-center gap-2 text-sm font-bold font-mono text-[#050505] bg-[#D4AF37] hover:bg-white px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    >
                      <FaDownload /> Download PDF
                    </a>
                  </div>
                </div>

                {/* 2. PROFILE & STRENGTHS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section>
                    <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
                      <div className="h-[1px] w-8 bg-[#D4AF37]/50" />{" "}
                      Professional Profile
                    </h3>
                    <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                      I am a highly motivated Full Stack Developer who
                      successfully transitioned from a demanding career in
                      gastronomy. Working as a Head Chef and Instructor for
                      individuals with disabilities taught me extreme patience,
                      crisis management, and the ability to lead under pressure.
                      I bring this mature, organized approach to software
                      engineering, taking end-to-end ownership of the
                      applications I build.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
                      <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Key
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "High stress tolerance & adaptability",
                        "End-to-End product ownership",
                        "Empathetic communication & teamwork",
                        "Rapid self-learning & problem solving",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm md:text-base text-neutral-300 font-light"
                        >
                          <div className="mt-1.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* 3. TECH STACK (Categorized) - Równiutkie 6 elementów na kolumnę */}
                <section>
                  <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Tech Stack
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Frontend */}
                    <div>
                      <h4 className="text-neutral-500 font-mono text-xs uppercase mb-3">
                        Frontend
                      </h4>
                      <div className="flex flex-col gap-2">
                        {[
                          "JavaScript",
                          "TypeScript",
                          "React 18",
                          "Next.js",
                          "Tailwind CSS v4",
                          "Framer Motion",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-xs font-mono text-neutral-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all cursor-default flex items-center justify-between group"
                          >
                            {tech}
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] group-hover:bg-[#D4AF37] transition-colors" />
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Backend */}
                    <div>
                      <h4 className="text-neutral-500 font-mono text-xs uppercase mb-3">
                        Backend
                      </h4>
                      <div className="flex flex-col gap-2">
                        {[
                          "Node.js",
                          "NestJS",
                          "Express.js",
                          "REST APIs",
                          "Socket.IO",
                          "JWT Auth",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-xs font-mono text-neutral-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all cursor-default flex items-center justify-between group"
                          >
                            {tech}
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] group-hover:bg-[#D4AF37] transition-colors" />
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Database */}
                    <div>
                      <h4 className="text-neutral-500 font-mono text-xs uppercase mb-3">
                        Database
                      </h4>
                      <div className="flex flex-col gap-2">
                        {[
                          "PostgreSQL",
                          "MongoDB",
                          "Prisma ORM",
                          "Mongoose",
                          "Redis",
                          "Supabase",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-xs font-mono text-neutral-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all cursor-default flex items-center justify-between group"
                          >
                            {tech}
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] group-hover:bg-[#D4AF37] transition-colors" />
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* DevOps & Tools */}
                    <div>
                      <h4 className="text-neutral-500 font-mono text-xs uppercase mb-3">
                        DevOps & Tools
                      </h4>
                      <div className="flex flex-col gap-2">
                        {[
                          "Docker",
                          "Git",
                          "Linux VPS",
                          "NGINX",
                          "PM2",
                          "Jest",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-xs font-mono text-neutral-300 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all cursor-default flex items-center justify-between group"
                          >
                            {tech}
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] group-hover:bg-[#D4AF37] transition-colors" />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. PROJECTS */}
                <section>
                  <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Projects
                  </h3>
                  <div className="space-y-10">
                    {/* Ecomati */}
                    <div className="relative pl-6 border-l-2 border-[#D4AF37]/50">
                      <div className="absolute w-3 h-3 bg-[#D4AF37] rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_#D4AF37]" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <h4 className="text-white font-bold text-lg md:text-xl">
                          Ecomati.pl{" "}
                          <span className="text-neutral-400 font-normal text-sm ml-2">
                            — E-commerce Platform
                          </span>
                        </h4>
                        <span className="text-[#D4AF37] font-mono text-xs border border-[#D4AF37]/30 px-2 py-1 rounded">
                          2025 - 2026
                        </span>
                      </div>

                      {/* TECH BADGES */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          "Next.js",
                          "NestJS",
                          "TypeScript",
                          "PostgreSQL",
                          "Prisma",
                          "Docker",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-[#0a0a0a] border border-[#222] rounded text-[9px] md:text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                        Designed and developed a modern e-commerce solution from
                        scratch. Architected a scalable backend using{" "}
                        <strong>NestJS</strong> and containerized the
                        application with <strong>Docker</strong>. Engineered an
                        optimized, responsive frontend providing a seamless user
                        experience.
                      </p>
                    </div>

                    {/* Autosell */}
                    <div className="relative pl-6 border-l-2 border-[#D4AF37]/50">
                      <div className="absolute w-3 h-3 bg-[#D4AF37] rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_#D4AF37]" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <h4 className="text-white font-bold text-lg md:text-xl">
                          Autosell.pl{" "}
                          <span className="text-neutral-400 font-normal text-sm ml-2">
                            — Automotive Marketplace
                          </span>
                        </h4>
                        <span className="text-[#D4AF37] font-mono text-xs border border-[#D4AF37]/30 px-2 py-1 rounded">
                          2024
                        </span>
                      </div>

                      {/* TECH BADGES */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          "React 18",
                          "Node.js",
                          "Express",
                          "MongoDB",
                          "Socket.IO",
                          "JWT",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-[#0a0a0a] border border-[#222] rounded text-[9px] md:text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                        Built an end-to-end production vehicle marketplace for a
                        client. Gathered requirements, managed feedback, and
                        delivered a scalable platform. Implemented real-time
                        messaging using <strong>Socket.IO</strong>, complex
                        search filters, secure JWT authentication, and designed
                        a robust database schema.
                      </p>
                    </div>

                    {/* Windows XP Portfolio */}
                    <div className="relative pl-6 border-l-2 border-[#D4AF37]/50">
                      <div className="absolute w-3 h-3 bg-[#D4AF37] rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_#D4AF37]" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <h4 className="text-white font-bold text-lg md:text-xl">
                          Windows XP Portfolio{" "}
                          <span className="text-neutral-400 font-normal text-sm ml-2">
                            — Interactive OS Simulation
                          </span>
                        </h4>
                        <span className="text-[#D4AF37] font-mono text-xs border border-[#D4AF37]/30 px-2 py-1 rounded">
                          2026
                        </span>
                      </div>

                      {/* TECH BADGES */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          "React 19",
                          "TypeScript",
                          "Tailwind CSS v4",
                          "CSS Animations",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-[#0a0a0a] border border-[#222] rounded text-[9px] md:text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                        Built a fully functional Windows XP simulation acting as
                        an interactive portfolio. Engineered a custom window
                        manager, boot sequence, and recreated retro apps.
                        Showcases advanced <strong>React</strong> state
                        management and complex UI architecture.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 5. WORK EXPERIENCE */}
                <section>
                  <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Work
                    Experience
                  </h3>
                  <div className="space-y-10">
                    {/* Freelance Full Stack Developer */}
                    <div className="relative pl-6 border-l-2 border-[#1a1a1a]">
                      <div className="absolute w-3 h-3 bg-[#333] rounded-full -left-[7px] top-1.5" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="text-neutral-300 font-bold text-lg md:text-xl">
                          Freelance Full Stack Developer
                        </h4>
                        <span className="text-neutral-600 font-mono text-xs border border-[#1a1a1a] px-2 py-1 rounded">
                          2023 - Present
                        </span>
                      </div>
                      <p className="text-neutral-500 text-sm font-mono mb-3">
                        Client Collaboration (Remote)
                      </p>
                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed mt-2">
                        2 years of commercial experience working directly with
                        clients: gathering requirements, managing feedback
                        loops, and delivering production-ready applications.
                        Built and deployed Autosell.pl as a client project —
                        full lifecycle ownership from specification and
                        architecture through production deployment.
                      </p>
                    </div>

                    {/* ZAZ Ja Ty My */}
                    <div className="relative pl-6 border-l-2 border-[#1a1a1a]">
                      <div className="absolute w-3 h-3 bg-[#333] rounded-full -left-[7px] top-1.5" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="text-neutral-300 font-bold text-lg md:text-xl">
                          Head Chef & Culinary Instructor
                        </h4>
                        <span className="text-neutral-600 font-mono text-xs border border-[#1a1a1a] px-2 py-1 rounded">
                          2017 - 2023
                        </span>
                      </div>
                      <p className="text-neutral-500 text-sm font-mono mb-3">
                        Zakład Aktywności Zawodowej "Ja Ty My"
                      </p>
                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed mt-2">
                        Managed full kitchen operations and acted as an
                        instructor and mentor for individuals with disabilities.
                        This highly demanding role honed my leadership, empathy,
                        and crisis-management abilities. During this time, I
                        dedicated my evenings to intensive, self-directed
                        programming study, eventually transitioning fully into
                        software engineering.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 6. LANGUAGES & INTERESTS */}
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Languages */}
                    <div>
                      <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-5 flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[#D4AF37]/50" />{" "}
                        Languages
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3 rounded-xl hover:border-[#D4AF37]/40 transition-colors">
                          <span className="text-white font-bold text-sm">
                            Polish
                          </span>
                          <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase">
                            Native
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] px-4 py-3 rounded-xl hover:border-[#D4AF37]/40 transition-colors">
                          <span className="text-white font-bold text-sm">
                            English
                          </span>
                          <span className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase">
                            B1 / Communicative
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-5 flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-[#D4AF37]/50" />{" "}
                        Interests
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "Sports",
                          "Traveling",
                          "Music",
                          "Video Games",
                          "Artificial Intelligence",
                        ].map((interest, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg text-xs md:text-sm text-neutral-400 font-light flex items-center gap-2 hover:border-[#D4AF37]/40 transition-colors"
                          >
                            <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
