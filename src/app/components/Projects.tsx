"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import VSCodeViewer from "./VSCodeViewer";
import { projects } from "../data/projects";
import {
  autosellFiles,
  matchdaysFiles,
  windowsXpFiles,
} from "../data/vscode/index";
import OverviewTab from "./projects/tabs/OverviewTab";
import JourneyTab from "./projects/tabs/JourneyTab";
import StackTab from "./projects/tabs/StackTab";

// ─────────────────────────────────────────────
// TAB TYPES
// ─────────────────────────────────────────────
type Tab = "overview" | "journey" | "stack" | "code";

const TABS: { id: Tab; label: string; isCode?: boolean }[] = [
  { id: "overview", label: "Overview" },
  { id: "journey", label: "Journey" },
  { id: "stack", label: "Stack" },
  { id: "code", label: "Code", isCode: true },
];

// ─────────────────────────────────────────────
// SECTION BRIDGE — visual connector between About and Projects
// ─────────────────────────────────────────────
function SectionBridge() {
  return (
    <div className="relative w-full overflow-hidden bg-[#050505]">
      {/* Horizontal rule with centered label */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="relative flex items-center gap-0 py-0">
          {/* Left line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-[#D4AF37]/40 origin-left"
          />
          {/* Center node */}
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
          {/* Right line */}
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

// ─────────────────────────────────────────────
// PROJECTS HEADER — full cinematic treatment
// ─────────────────────────────────────────────

/** Animated grid background — pure CSS, no canvas */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Perspective grid lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(212,175,55,0.07)"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="grid-fade" cx="30%" cy="50%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="url(#grid-fade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid-pattern)"
          mask="url(#grid-mask)"
        />
      </svg>

      {/* Large ghost number "03" in background — hidden on small screens */}
      <div
        className="absolute right-[-2%] top-1/2 -translate-y-1/2 font-black select-none hidden sm:block"
        style={{
          fontSize: "clamp(10rem, 28vw, 42rem)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(212,175,55,0.06)",
          letterSpacing: "-0.05em",
        }}
      >
        03
      </div>

      {/* Gold radial glow — left side, behind title */}
      <div
        className="absolute left-0 top-0 w-[70%] h-full"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 20% 55%, rgba(212,175,55,0.09) 0%, transparent 65%)",
        }}
      />

      {/* Horizontal scan line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="absolute left-0 right-0 origin-left"
        style={{
          top: "52%",
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.1) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}

// Stagger variants for the title words
const titleContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0 },
  },
};

const titleLetterVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const titleContainerVariantsDelayed = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

function ProjectsHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // useInView on the title container — triggers as soon as 1px is visible
  const isInView = useInView(titleRef, { once: true, margin: "0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: title moves slightly up as you scroll past
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  const featuredLetters = "FEATURED".split("");
  const projectsLetters = "PROJECTS".split("");

  return (
    <div ref={ref} className="relative w-full overflow-hidden">
      {/* ── Decorative background ── */}
      <GridBackground />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pt-10 md:pt-14 pb-8 md:pb-12">
        {/* ── Label ── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex items-center gap-4 mb-10"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="h-[2px] w-12 bg-[#D4AF37] origin-left"
          />
          <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-[#D4AF37]">
            Selected Work
          </span>
        </motion.div>

        {/* ── Giant title with parallax ── */}
        <motion.div ref={titleRef} style={{ y: titleY }}>
          {/* FEATURED — white fill */}
          <h1
            className="font-black tracking-tighter uppercase mb-0"
            style={{ fontSize: "clamp(2.2rem, 8.5vw, 11rem)", lineHeight: 1 }}
          >
            <motion.span
              className="inline-flex"
              variants={titleContainerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              aria-label="FEATURED"
            >
              {featuredLetters.map((char, i) => (
                <span
                  key={i}
                  className="inline-block overflow-visible"
                  style={{ lineHeight: 1, paddingBottom: "0.06em" }}
                >
                  <motion.span
                    className="inline-block text-white"
                    variants={titleLetterVariants}
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </motion.span>
          </h1>

          {/* PROJECTS — gold outline */}
          <h1
            className="font-black tracking-tighter uppercase mb-10"
            style={{ fontSize: "clamp(2.2rem, 8.5vw, 11rem)", lineHeight: 1 }}
          >
            <motion.span
              className="inline-flex"
              variants={titleContainerVariantsDelayed}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              aria-label="PROJECTS"
            >
              {projectsLetters.map((char, i) => (
                <span
                  key={i}
                  className="inline-block overflow-visible"
                  style={{ lineHeight: 1, paddingBottom: "0.06em" }}
                >
                  <motion.span
                    className="inline-block"
                    variants={titleLetterVariants}
                    style={{
                      WebkitTextStroke: "2px #D4AF37",
                      color: "transparent",
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </motion.span>
          </h1>
        </motion.div>

        {/* ── Divider line ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="h-px w-full origin-left mb-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.1) 50%, transparent 100%)",
          }}
        />

        {/* ── Description + meta row ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12"
        >
          <p className="text-base md:text-lg text-neutral-400 font-light leading-relaxed max-w-xl border-l-2 border-[#D4AF37]/40 pl-5">
            Production applications built{" "}
            <span className="text-white font-medium">
              from concept to deployment
            </span>
            . Click any project to explore its architecture, build journey, and
            tech stack.
          </p>

          {/* Right meta block */}
          <div className="md:ml-auto shrink-0 flex flex-col items-end gap-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600">
              3 projects · 2024 — 2026
            </span>
            <div className="flex gap-3 mt-2">
              {projects.map((p) => (
                <span
                  key={p.id}
                  className="text-[9px] font-mono text-neutral-700 uppercase tracking-widest"
                >
                  {String(p.id).padStart(2, "0")} {p.title}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function Projects() {
  const [activeId, setActiveId] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);
  const [vsCodeFiles, setVsCodeFiles] = useState(autosellFiles);
  const [vsCodeTitle, setVsCodeTitle] = useState("Autosell-Repo");

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
    if (activeId === id) {
      setActiveId(null);
    } else {
      setActiveId(id);
      setActiveTab("overview");
    }
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-[#050505] text-[#e1e1e1] overflow-hidden"
    >
      {/* Full-screen VSCode viewer */}
      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={vsCodeFiles}
        title={vsCodeTitle}
      />

      {/* ── Visual bridge from About section ── */}
      <SectionBridge />

      {/* ── Cinematic header ── */}
      <ProjectsHeader />

      {/* ── Accordion project list ── */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pb-24 md:pb-36">
        <div className="flex flex-col gap-3">
          {projects.map((project, i) => {
            const isOpen = activeId === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border overflow-hidden transition-all duration-500"
                style={{
                  borderColor: isOpen
                    ? "rgba(212,175,55,0.4)"
                    : "rgba(255,255,255,0.06)",
                  background: isOpen ? "#0c0c0a" : "#080808",
                  boxShadow: isOpen ? "0 0 60px rgba(212,175,55,0.06)" : "none",
                }}
              >
                {/* ── Project header row (always visible) ── */}
                <button
                  onClick={() => handleProjectClick(project.id)}
                  className="w-full flex items-center gap-3 md:gap-6 px-4 sm:px-6 md:px-8 py-5 md:py-7 text-left group"
                >
                  {/* Number — hidden on xs, visible from sm */}
                  <span
                    className="hidden sm:block font-mono text-4xl md:text-6xl font-black leading-none shrink-0 transition-colors duration-300 tabular-nums"
                    style={{
                      color: isOpen
                        ? "rgba(212,175,55,0.25)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  >
                    {project.number}
                  </span>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] transition-colors duration-300"
                        style={{
                          color: isOpen
                            ? "rgba(212,175,55,0.6)"
                            : "rgba(255,255,255,0.2)",
                        }}
                      >
                        {project.category}
                      </span>
                      {project.nda && (
                        <span className="text-[9px] font-mono bg-red-600/80 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                          NDA
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none transition-colors duration-300"
                      style={{ color: isOpen ? "#ffffff" : "#3a3a3a" }}
                    >
                      {project.title}
                    </h3>
                  </div>

                  {/* Right side: year + expand indicator */}
                  <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    <span
                      className="font-mono text-xs md:text-sm hidden md:block transition-colors duration-300"
                      style={{
                        color: isOpen
                          ? "rgba(212,175,55,0.5)"
                          : "rgba(255,255,255,0.15)",
                      }}
                    >
                      {project.year}
                    </span>

                    {/* Expand/collapse icon */}
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0"
                      style={{
                        borderColor: isOpen
                          ? "rgba(212,175,55,0.4)"
                          : "rgba(255,255,255,0.1)",
                        background: isOpen
                          ? "rgba(212,175,55,0.08)"
                          : "transparent",
                      }}
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-lg leading-none font-light"
                        style={{
                          color: isOpen ? "#D4AF37" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        +
                      </motion.span>
                    </div>
                  </div>
                </button>

                {/* ── Expanded panel ── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#1a1a1a]">
                        {/* Tab bar — scrollable on mobile */}
                        <div className="flex items-center gap-0 px-4 sm:px-6 md:px-8 border-b border-[#1a1a1a] overflow-x-auto scrollbar-none">
                          {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;

                            // Code tab — special highlighted style, opens VSCode directly
                            if (tab.isCode) {
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => openVSCode(project.id)}
                                  className="relative ml-2 flex items-center gap-2 px-4 py-2 my-2 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all duration-200 shrink-0"
                                  style={{
                                    background: "rgba(212,175,55,0.08)",
                                    border: "1px solid rgba(212,175,55,0.25)",
                                    color: "#D4AF37",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.background =
                                      "rgba(212,175,55,0.15)";
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.borderColor =
                                      "rgba(212,175,55,0.5)";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.background =
                                      "rgba(212,175,55,0.08)";
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.borderColor =
                                      "rgba(212,175,55,0.25)";
                                  }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse shrink-0" />
                                  {tab.label}
                                </button>
                              );
                            }

                            // Regular tabs
                            return (
                              <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="relative px-4 sm:px-6 py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-colors duration-200 shrink-0"
                                style={{
                                  color: isActive
                                    ? "#D4AF37"
                                    : "rgba(255,255,255,0.25)",
                                }}
                              >
                                {tab.label}
                                {isActive && (
                                  <motion.div
                                    layoutId="tab-line"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                                    transition={{ duration: 0.2 }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Tab content */}
                        <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
                          <AnimatePresence mode="wait">
                            {activeTab === "overview" && (
                              <OverviewTab
                                key={`ov-${project.id}`}
                                project={project}
                              />
                            )}
                            {activeTab === "journey" && (
                              <JourneyTab
                                key={`jn-${project.id}`}
                                project={project}
                              />
                            )}
                            {activeTab === "stack" && (
                              <StackTab
                                key={`st-${project.id}`}
                                project={project}
                              />
                            )}
                          </AnimatePresence>
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
