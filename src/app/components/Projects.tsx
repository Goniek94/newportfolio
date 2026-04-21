"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import VSCodeViewer from "./VSCodeViewer";
import { projects, Project } from "../data/projects";
import {
  autosellFiles,
  matchdaysFiles,
  windowsXpFiles,
} from "../data/vscode/index";

type Tab = "overview" | "journey" | "stack";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "journey", label: "Journey" },
  { id: "stack", label: "Stack" },
];

// --- KOMPONENTY ZAKŁADEK ---

function OverviewTabContent({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-light">
        {project.description}
      </p>
      {project.bullets && project.bullets.length > 0 && (
        <ul className="flex flex-col gap-3">
          {project.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm md:text-base text-neutral-400"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function JourneyTabContent({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8"
    >
      {project.journey?.map((step, i) => (
        <div key={i} className="relative pl-6 border-l border-[#333]">
          <div className="absolute w-3 h-3 bg-[#D4AF37] rounded-full -left-[6.5px] top-1" />
          <span className="text-[10px] text-[#D4AF37] tracking-widest font-mono uppercase">
            {step.phase} • {step.duration}
          </span>
          <h4 className="text-lg font-bold text-white mt-1 mb-2">
            {step.title}
          </h4>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {step.description}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

// ZMIENIONY KOMPONENT STACK - TERAZ JAKO CASE STUDY ARCHITEKTURY
function StackTabContent({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8"
    >
      {project.stackCategories?.map((category, i) => (
        <div key={i} className="flex flex-col gap-3">
          {/* Elegancki nagłówek z linią */}
          <div className="flex items-center gap-4">
            <h4 className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] whitespace-nowrap">
              {category.label}
            </h4>
            <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
          </div>

          {/* Opis architektoniczny (Case Study) */}
          {category.description && (
            <p className="text-sm text-neutral-400 leading-relaxed font-light">
              {category.description}
            </p>
          )}

          {/* Technologie w bańkach pod spodem */}
          <div className="flex flex-wrap gap-2 mt-2">
            {category.items.map((item, j) => (
              <span
                key={j}
                className="px-4 py-1.5 bg-[#111] border border-[#333] text-neutral-300 text-[11px] font-medium rounded-full shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// --- GŁÓWNY KOMPONENT PROJECTS ---

function SectionBridge() {
  return (
    <div className="relative w-full overflow-hidden bg-[#050505]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="relative flex items-center gap-0 py-0">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-[#D4AF37]/40 origin-left"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="relative mx-6 shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <div
              className="absolute inset-0 rounded-full bg-[#D4AF37]/30 animate-ping"
              style={{ animationDuration: "2.5s" }}
            />
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/20 to-[#D4AF37]/40 origin-right"
          />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeIds, setActiveIds] = useState<number[]>([1]);
  const [activeTabs, setActiveTabs] = useState<Record<number, Tab>>({});

  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);
  const [vsCodeFiles, setVsCodeFiles] = useState(autosellFiles);
  const [vsCodeTitle, setVsCodeTitle] = useState("Autosell-Repo");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getActiveTab = (projectId: number) =>
    activeTabs[projectId] || "overview";

  const openVSCode = (projectId: number) => {
    if (projectId === 1) {
      setVsCodeFiles(autosellFiles);
      setVsCodeTitle("Autosell-Repo");
    } else if (projectId === 2) {
      setVsCodeFiles(matchdaysFiles);
      setVsCodeTitle("Matchdays-Repo");
    } else {
      setVsCodeFiles(windowsXpFiles);
      setVsCodeTitle("Windows-XP-Repo");
    }
    setIsVSCodeOpen(true);
  };

  const handleProjectClick = (id: number) => {
    setActiveIds((prev) =>
      prev.includes(id)
        ? prev.filter((activeId) => activeId !== id)
        : [...prev, id],
    );
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-[#050505] text-[#e1e1e1] overflow-hidden"
    >
      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={vsCodeFiles}
        title={vsCodeTitle}
      />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 md:p-10 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Zoomed Project"
              className="max-w-full max-h-full rounded-lg border border-[#333] shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SectionBridge />

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pt-20 pb-24 md:pb-36">
        <div className="flex flex-col gap-6">
          {projects.map((project, i) => {
            const isOpen = activeIds.includes(project.id);
            const currentTab = getActiveTab(project.id);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-3xl border border-[#ffffff08] transition-all duration-500 overflow-hidden"
                style={{
                  background: isOpen ? "#0c0c0c" : "#080808",
                  boxShadow: isOpen ? "0 0 80px rgba(0,0,0,0.5)" : "none",
                }}
              >
                {/* NAGŁÓWEK */}
                <button
                  onClick={() => handleProjectClick(project.id)}
                  className="w-full flex items-center gap-8 px-6 sm:px-8 py-8 md:py-12 text-left group"
                >
                  <span
                    className="font-mono text-5xl md:text-7xl font-black tabular-nums transition-colors duration-300"
                    style={{ color: isOpen ? "rgba(212,175,55,0.4)" : "#111" }}
                  >
                    {project.number}
                  </span>
                  <div className="flex-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block opacity-60">
                      {project.category}
                    </span>
                    <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white">
                      {project.title}
                    </h3>
                  </div>
                  <div
                    className={`hidden sm:flex w-12 h-12 rounded-full border border-[#D4AF37]/30 items-center justify-center transition-all ${isOpen ? "bg-[#D4AF37] text-black" : "text-[#D4AF37]"}`}
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="text-2xl"
                    >
                      +
                    </motion.span>
                  </div>
                </button>

                {/* ROZWINIĘTY PANEL */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-[#ffffff05]"
                    >
                      <div className="flex flex-col lg:flex-row bg-[#0c0c0c]">
                        {/* LEWA STRONA (55%) */}
                        <div className="lg:w-[55%] flex flex-col border-r border-[#ffffff05]">
                          <div className="flex items-center px-4 border-b border-[#ffffff05] bg-[#0e0e0e] overflow-x-auto scrollbar-none">
                            {TABS.map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() =>
                                  setActiveTabs((prev) => ({
                                    ...prev,
                                    [project.id]: tab.id,
                                  }))
                                }
                                className={`px-6 py-5 text-[10px] font-bold uppercase tracking-widest transition-all relative shrink-0 ${currentTab === tab.id ? "text-[#D4AF37]" : "text-neutral-500 hover:text-neutral-300"}`}
                              >
                                {tab.label}
                                {currentTab === tab.id && (
                                  <motion.div
                                    layoutId={`t-line-${project.id}`}
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                          <div className="p-6 md:p-10 flex-1">
                            <AnimatePresence mode="wait">
                              {currentTab === "overview" && (
                                <OverviewTabContent
                                  key="ov"
                                  project={project}
                                />
                              )}
                              {currentTab === "journey" && (
                                <JourneyTabContent key="jn" project={project} />
                              )}
                              {currentTab === "stack" && (
                                <StackTabContent key="st" project={project} />
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* PRAWA STRONA (45%) */}
                        <div className="lg:w-[45%] bg-[#080808] p-6 md:p-10 flex flex-col justify-center items-center relative overflow-hidden">
                          {project.image && (
                            <div className="w-full flex flex-col gap-6 max-w-xl">
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={() =>
                                  setSelectedImage(project.image as string)
                                }
                                className="relative w-full rounded-2xl overflow-hidden border border-[#ffffff10] shadow-xl cursor-zoom-in group"
                              >
                                <div className="h-7 w-full bg-[#151515] border-b border-[#ffffff08] flex items-center px-4 gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/50" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/50" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/50" />
                                </div>
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="w-full h-auto object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                  <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.3em]">
                                    CLICK TO ENLARGE
                                  </span>
                                </div>
                              </motion.div>

                              <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 w-full">
                                {project.website && (
                                  <a
                                    href={project.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-2 sm:px-3 py-3 bg-[#D4AF37] text-black rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                                  >
                                    <FaExternalLinkAlt size={10} /> Live Site
                                  </a>
                                )}
                                <button
                                  onClick={() => openVSCode(project.id)}
                                  className="flex-1 flex items-center justify-center gap-2 px-2 sm:px-3 py-3 bg-[#111] text-[#D4AF37] border border-[#D4AF37]/30 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                                >
                                  💻 View Code
                                </button>
                                {project.github && (
                                  <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-2 sm:px-3 py-3 bg-[#111] text-[#D4AF37] border border-[#D4AF37]/30 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37]/10 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                                  >
                                    <FaGithub size={12} /> Repo
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
