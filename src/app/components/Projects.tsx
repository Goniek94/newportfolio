"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VSCodeViewer from "./VSCodeViewer";
import { autosellFiles } from "../data/vscode/index"; // Poprawiona ścieżka do danych

// --- DANE PROJEKTÓW ---
const projects = [
  {
    id: 1,
    number: "01",
    title: "Autosell.pl",
    category: "Commercial Platform (Live)",
    year: "2024 — 2025",
    description:
      "A comprehensive enterprise-grade marketplace for the automotive industry. The system handles real-time user interactions and complex data filtering. Deployed on VPS with NGINX reverse proxy and PM2 process management.",
    highlights: [
      "Modular Socket.IO Architecture",
      "React Context for Global State",
      "Custom Rate Limiting Middleware",
      "Secure Image Processing Pipeline",
    ],
    tech: [
      "Next.js",
      "React Context",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "Redis",
    ],
    image: "/images/Zrzuty/Lista ogłoszeń.webp",
    website: "https://www.autosell.pl",
    github: null,
    isInteractive: true, // Ten projekt otwiera VS Code
  },
  {
    id: 2,
    number: "02",
    title: "Windows XP Portfolio",
    category: "Interactive UI",
    year: "2025",
    description:
      "An interactive, pixel-perfect recreation of the Windows XP operating system in a browser. Features a fully functional window manager, simulated applications (Winamp, Paint), and system-level drag & drop.",
    highlights: [
      "Custom Window Manager Hook",
      "Glitch & CRT Effects",
      "Mobile Touch Support",
      "5000+ Lines of TypeScript",
    ],
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion", "Howler.js"],
    image: "/images/Zrzuty/Formularz.webp",
    website: null,
    github: "https://github.com/Goniek94",
    isInteractive: false,
  },
  {
    id: 3,
    number: "03",
    title: "Transport Services",
    category: "High-Performance Web",
    year: "2024",
    description:
      "A lightning-fast landing page built with a custom component loader architecture. Focused on Core Web Vitals, accessibility, and modular SCSS structure without heavy frameworks. Achieved 99/100 Google Lighthouse score.",
    highlights: [
      "Custom Component Loader (Vanilla JS)",
      "Advanced SCSS Architecture (BEM)",
      "99/100 Google Lighthouse Score",
      "Mobile-First Optimization",
    ],
    tech: ["HTML5", "SCSS (Sass)", "Vanilla JavaScript", "Gulp", "Webpack"],
    // Pamiętaj, aby dodać zdjęcie tego projektu do folderu public/images/Zrzuty!
    image: "/images/Zrzuty/bus-page-preview.webp",
    website: "https://phumarbus.pl", // Jeśli nie masz live, ustaw null
    github: "https://github.com/Goniek94",
    isInteractive: false,
  },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<number>(1);
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);

  return (
    <section
      id="projects"
      className="relative w-full bg-[#050505] text-[#e1e1e1] py-24 md:py-40 px-4 md:px-12 overflow-hidden"
    >
      {/* VS Code Modal */}
      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={autosellFiles}
        title="Autosell-Repo"
      />

      {/* TŁO */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* --- HEADER --- */}
        <div className="mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between border-b border-[#333] pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
              <span className="font-mono text-xs text-[#D4AF37] tracking-widest uppercase">
                Selected Works
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white">
              FEATURED <br className="hidden md:block" /> PROJECTS
            </h2>
          </div>

          <div className="md:text-right max-w-md">
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
              A selection of my most ambitious technical endeavors. Focused on
              scalability, performance, and user experience.
            </p>
          </div>
        </div>

        {/* --- UKŁAD GŁÓWNY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEWA KOLUMNA: LISTA KART */}
          <div className="lg:col-span-7 flex flex-col gap-12 md:gap-24">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative"
                onMouseEnter={() => setActiveProject(project.id)}
              >
                {/* NUMER W TLE */}
                <span className="absolute -top-12 -left-8 md:-left-16 text-[100px] md:text-[180px] font-black text-[#111] leading-none z-0 select-none group-hover:text-[#1a1a1a] transition-colors duration-500">
                  {project.number}
                </span>

                {/* KARTA PROJEKTU */}
                <div className="relative z-10 pl-2 md:pl-8 border-l-2 border-[#222] group-hover:border-[#D4AF37] transition-colors duration-300">
                  {/* --- NAGŁÓWEK (INTERAKTYWNY DLA AUTOSELL) --- */}
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-4">
                    <h3
                      className={`text-3xl md:text-5xl font-bold text-white transition-colors duration-300 ${project.isInteractive ? "cursor-pointer hover:text-[#4ec9b0]" : "group-hover:text-[#D4AF37]"}`}
                      onClick={() => {
                        if (project.isInteractive) {
                          setIsVSCodeOpen(true);
                        }
                      }}
                    >
                      {project.title}
                      {project.isInteractive && (
                        <span className="ml-4 text-xs bg-[#252526] text-[#4ec9b0] px-2 py-1 rounded border border-[#333] align-middle font-mono animate-pulse">
                          &lt;view_code /&gt;
                        </span>
                      )}
                    </h3>
                    <span className="font-mono text-xs md:text-sm text-neutral-500 uppercase tracking-widest">
                      {project.category} • {project.year}
                    </span>
                  </div>

                  <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-xl mb-6">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
                    {project.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-neutral-500 font-mono"
                      >
                        <span className="text-[#D4AF37]">/</span> {h}
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-[#111] border border-[#333] text-xs font-mono text-neutral-300 uppercase tracking-wider rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* MOBILE IMAGE (Widoczny tylko na mobile) */}
                  <div
                    className="lg:hidden w-full h-[250px] md:h-[400px] rounded-lg overflow-hidden border border-[#333] mb-8 relative group-hover:border-[#D4AF37] transition-colors"
                    onClick={() => {
                      if (project.isInteractive) setIsVSCodeOpen(true);
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/800x600/111/333?text=Project+Preview")
                      }
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    {project.isInteractive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black/70 text-white px-4 py-2 rounded border border-[#333] backdrop-blur-md text-xs font-bold uppercase">
                          Tap to View Code
                        </span>
                      </div>
                    )}
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-6 flex-wrap">
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-white font-bold text-sm tracking-[0.2em] uppercase border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors"
                      >
                        Visit Live Website{" "}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          ></path>
                        </svg>
                      </a>
                    )}

                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-white font-bold text-sm tracking-[0.2em] uppercase border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors"
                      >
                        View Repository{" "}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          ></path>
                        </svg>
                      </a>
                    ) : project.isInteractive ? (
                      <button
                        onClick={() => setIsVSCodeOpen(true)}
                        className="inline-flex items-center gap-3 text-neutral-400 font-bold text-sm tracking-[0.2em] uppercase border-b border-transparent pb-1 hover:text-[#4ec9b0] hover:border-[#4ec9b0] transition-colors"
                      >
                        Peek Code (Simulated){" "}
                        <span className="text-xl">⌨️</span>
                      </button>
                    ) : (
                      <span
                        className="inline-flex items-center gap-3 text-neutral-600 font-bold text-sm tracking-[0.2em] uppercase cursor-not-allowed"
                        title="Code Private"
                      >
                        Code Private
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PRAWA KOLUMNA: STICKY PREVIEW */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="sticky top-32 w-full h-[600px]">
              <div className="absolute -inset-4 border border-[#222] z-0"></div>
              <div className="absolute -inset-4 bg-[#0a0a0a] z-0 translate-x-4 translate-y-4 border border-[#222]"></div>

              <div className="relative w-full h-full bg-[#111] border border-[#333] overflow-hidden z-10 shadow-2xl">
                <AnimatePresence mode="wait">
                  {projects.map(
                    (project) =>
                      activeProject === project.id && (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.6,
                            ease: [0.76, 0, 0.24, 1],
                          }}
                          className={`absolute inset-0 ${project.isInteractive ? "cursor-pointer group/image" : ""}`}
                          onClick={() => {
                            if (project.isInteractive) setIsVSCodeOpen(true);
                          }}
                        >
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover/image:scale-105"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://placehold.co/800x1000/111/333?text=Project+Preview")
                            }
                          />

                          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none"></div>

                          {/* OVERLAY DLA INTERAKTYWNYCH */}
                          {project.isInteractive && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                              <div className="bg-[#1e1e1e] border border-[#333] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
                                <span className="text-xl">👨‍💻</span>
                                <span className="font-mono text-sm font-bold tracking-wider uppercase">
                                  Open Code Viewer
                                </span>
                              </div>
                            </div>
                          )}

                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md p-6 border-l-4 border-[#D4AF37] max-w-xs pointer-events-none"
                          >
                            <p className="text-[#D4AF37] text-xs font-mono uppercase mb-2">
                              {project.github
                                ? "Open Source"
                                : "Commercial / Live"}
                            </p>
                            <p className="text-white text-sm leading-relaxed">
                              {project.highlights[0]} <br />
                              {project.highlights[1]}
                            </p>
                          </motion.div>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
