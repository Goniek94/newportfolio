"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode, FaServer, FaDatabase, FaRocket } from "react-icons/fa";

// ─────────────────────────────────────────────
// PANEL TABS
// ─────────────────────────────────────────────
const tabs = ["About", "Skills", "Journey", "Philosophy"] as const;
type Tab = (typeof tabs)[number];

// ─────────────────────────────────────────────
// SKILL PILLARS
// ─────────────────────────────────────────────
const pillars = [
  {
    icon: FaCode,
    label: "Frontend",
    items: [
      "JavaScript",
      "React 18",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },
  {
    icon: FaServer,
    label: "Backend",
    items: ["Node.js", "Express", "NestJS", "REST APIs", "Socket.IO"],
  },
  {
    icon: FaDatabase,
    label: "Data & Auth",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Prisma ORM",
      "Supabase",
      "JWT / NextAuth",
    ],
  },
  {
    icon: FaRocket,
    label: "DevOps & Tools",
    items: ["Docker", "Git", "Vercel", "Railway", "Redis"],
  },
];

// ─────────────────────────────────────────────
// TIMELINE
// ─────────────────────────────────────────────
const timeline = [
  {
    year: "2020",
    title: "The spark",
    desc: "Started learning programming through Udemy courses — HTML, CSS, JavaScript. Balancing 60-70h work weeks as a head chef with evening coding sessions.",
  },
  {
    year: "2023",
    title: "Full commitment",
    desc: "Left gastronomy to go all-in on development. Transitioned from learning to building real projects with modern frameworks.",
  },
  {
    year: "2024",
    title: "First production app",
    desc: "Launched Autosell.pl — a full marketplace with real users, payments, and real-time messaging.",
  },
  {
    year: "2025–26",
    title: "Full-stack & beyond",
    desc: "Built Ecomati.pl e-commerce platform. Mastered NestJS, Docker, PostgreSQL. Open to work and ready to grow with a team.",
  },
];

// ─────────────────────────────────────────────
// TAB INDICATOR HOOK
// ─────────────────────────────────────────────
function useTabIndicator(activeTab: Tab) {
  const tabRefs = useRef<Map<Tab, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current.get(activeTab);
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab]);

  const setRef = (tab: Tab) => (el: HTMLButtonElement | null) => {
    if (el) tabRefs.current.set(tab, el);
  };

  return { indicator, setRef };
}

// ─────────────────────────────────────────────
// PANEL CONTENT COMPONENTS
// ─────────────────────────────────────────────

function AboutPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      {/* Left — large statement */}
      <div className="space-y-8">
        <p className="text-fluid-h3 text-neutral-200 font-light leading-[1.3] tracking-tight">
          Since 2020, I have been building my path in{" "}
          <em className="text-[#D4AF37] font-normal not-italic">
            software development
          </em>{" "}
          — starting from online courses and hands-on practice, gradually moving
          toward full-stack development and production systems.
        </p>
        <p className="text-neutral-500 text-base md:text-lg leading-relaxed">
          My journey was not linear. For several years, I combined intensive
          self-education with full-time work as a{" "}
          <span className="text-neutral-300 font-medium">
            culinary instructor and head chef
          </span>
          , teaching professionally and working with people with disabilities.
          At times, I worked 60–70 hours per week while continuing to learn and
          build projects in the evenings and weekends.
        </p>
      </div>

      {/* Right — details */}
      <div className="space-y-8 lg:pt-4">
        <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
          Working in gastronomy shaped more than my work ethic. It taught me{" "}
          <span className="text-neutral-200 font-medium">
            discipline, humility, and empathy
          </span>
          . I learned humility from the people I worked with — individuals who
          showed up every day with determination despite the adversity they had
          faced. Their resilience changed my perspective and strengthened my
          character.
        </p>
        <p className="text-neutral-500 text-base md:text-lg leading-relaxed">
          Since 2023, I have been fully focused on building, shipping, and
          refining production applications. Based in{" "}
          <span className="text-[#D4AF37] font-medium">
            Łowicz / Warsaw, Poland
          </span>
          . Open to remote or hybrid roles across Europe. I believe in
          end-to-end thinking — taking responsibility for the entire product
          lifecycle.
        </p>

        {/* Stats row */}
        <div className="flex gap-10 pt-6 border-t border-[#1a1a1a]">
          {[
            { value: "4+", label: "Years (since 2020)" },
            { value: "3+", label: "Production apps" },
            { value: "100%", label: "Self-taught" },
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl md:text-4xl font-black text-[#D4AF37] tracking-tighter leading-none">
                {s.value}
              </div>
              <div className="text-[10px] md:text-xs text-neutral-600 uppercase tracking-[0.2em] font-mono">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsPanel() {
  return (
    <div className="space-y-10">
      {/* Intro text */}
      <p className="text-2xl sm:text-3xl md:text-4xl text-neutral-200 font-light leading-[1.3] tracking-tight max-w-4xl">
        I bring ownership and attention to detail to{" "}
        <em className="text-[#D4AF37] font-normal not-italic">
          every layer of the stack
        </em>{" "}
        — from database schema design and backend architecture to pixel-perfect
        UI and deployment pipelines.
      </p>

      {/* Skill cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className="group relative p-5 md:p-7 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37]/50 hover:bg-[#0d0d0d] transition-all duration-500 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:to-transparent transition-all duration-700 rounded-2xl" />
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]/10 group-hover:border-[#D4AF37]/40 rounded-tr-2xl transition-colors duration-500" />

              <div className="relative z-10 space-y-4">
                {/* Icon */}
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/60 group-hover:bg-[#D4AF37]/15 transition-all duration-500">
                  <Icon className="text-[#D4AF37]" size={18} />
                </div>
                {/* Label */}
                <span className="block text-white font-black uppercase tracking-widest text-xs md:text-sm">
                  {pillar.label}
                </span>
                {/* Skills */}
                <ul className="space-y-2">
                  {pillar.items.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2.5 text-neutral-500 text-xs md:text-sm group-hover:text-neutral-400 transition-colors duration-300"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50 shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JourneyPanel() {
  return (
    <div className="space-y-10">
      {/* Intro */}
      <p className="text-2xl sm:text-3xl md:text-4xl text-neutral-200 font-light leading-[1.3] tracking-tight max-w-4xl">
        Every milestone is a{" "}
        <em className="text-[#D4AF37] font-normal not-italic">
          stepping stone
        </em>{" "}
        — from the first line of code to production-ready applications serving
        real users.
      </p>

      {/* Timeline */}
      <div className="relative">
        {/* Horizontal connector — desktop */}
        <div className="hidden lg:block absolute top-6 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {timeline.map((item, i) => (
            <div key={i} className="relative flex flex-col gap-4">
              {/* Dot — desktop */}
              <div className="hidden lg:flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/40 bg-[#050505] flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                </div>
                <div className="flex-1 h-[1px] bg-[#1a1a1a]" />
              </div>

              {/* Card */}
              <div className="p-5 md:p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37]/30 transition-colors duration-500 space-y-2.5 h-full">
                <span className="text-[#D4AF37] font-mono text-xs tracking-[0.3em] uppercase font-black">
                  {item.year}
                </span>
                <h4 className="text-white font-black text-base md:text-lg uppercase tracking-tight leading-tight">
                  {item.title}
                </h4>
                <p className="text-neutral-500 text-sm leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhilosophyPanel() {
  const values = [
    {
      title: "Ownership",
      desc: "I don't just write code — I take full responsibility for the product. From concept to deployment, I treat every project as my own.",
    },
    {
      title: "Quality over speed",
      desc: "Clean, maintainable code is not a luxury — it's a necessity. I invest time in architecture and testing to build things that last.",
    },
    {
      title: "Continuous growth",
      desc: "Technology evolves fast. I dedicate time every day to learning new tools, patterns, and best practices to stay sharp.",
    },
    {
      title: "Authenticity",
      desc: "I believe in honest communication and transparent work. No shortcuts, no excuses — just care, hard work, and real results.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Intro */}
      <p className="text-2xl sm:text-3xl md:text-4xl text-neutral-200 font-light leading-[1.3] tracking-tight max-w-4xl">
        My approach to development is based on{" "}
        <em className="text-[#D4AF37] font-normal not-italic">
          care, authenticity, and hard work
        </em>
        . These are the principles that guide every decision I make.
      </p>

      {/* Values grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {values.map((v, i) => (
          <div
            key={i}
            className="group relative p-6 md:p-8 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37]/30 transition-all duration-500"
          >
            {/* Number */}
            <span className="absolute top-6 right-6 md:top-8 md:right-8 text-[#D4AF37]/15 font-black text-5xl md:text-6xl leading-none select-none group-hover:text-[#D4AF37]/25 transition-colors duration-500">
              0{i + 1}
            </span>

            <div className="relative z-10 space-y-3">
              <h4 className="text-white font-black text-lg md:text-xl uppercase tracking-tight">
                {v.title}
              </h4>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light max-w-md">
                {v.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PANEL MAP
// ─────────────────────────────────────────────
const panelMap: Record<Tab, () => React.ReactElement> = {
  About: AboutPanel,
  Skills: SkillsPanel,
  Journey: JourneyPanel,
  Philosophy: PhilosophyPanel,
};

// ─────────────────────────────────────────────
// AUTO-ROTATE INTERVAL (ms)
// ─────────────────────────────────────────────
const TAB_DURATION = 8000;

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function AboutMe() {
  const [activeTab, setActiveTab] = useState<Tab>("About");
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const { indicator, setRef } = useTabIndicator(activeTab);
  const ActivePanel = panelMap[activeTab];
  const progressRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  // Advance to next tab
  const goNext = useCallback(() => {
    setActiveTab((prev) => {
      const idx = tabs.indexOf(prev);
      return tabs[(idx + 1) % tabs.length];
    });
    setProgress(0);
    progressRef.current = 0;
    lastTickRef.current = Date.now();
  }, []);

  // Manual tab click — reset timer
  const handleTabClick = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setProgress(0);
    progressRef.current = 0;
    lastTickRef.current = Date.now();
  }, []);

  // Auto-rotate with progress bar using requestAnimationFrame
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      if (!isPaused) {
        const now = Date.now();
        const delta = now - lastTickRef.current;
        lastTickRef.current = now;
        progressRef.current += delta;

        const pct = Math.min(progressRef.current / TAB_DURATION, 1);
        setProgress(pct);

        if (pct >= 1) {
          goNext();
          return;
        }
      } else {
        lastTickRef.current = Date.now();
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, goNext]);

  return (
    <section
      id="about"
      className="relative w-full bg-[#050505] text-[#e1e1e1] pt-8 pb-16 md:pt-12 md:pb-24 px-4 md:px-12 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#D4AF37]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1700px] mx-auto relative z-10">
        {/* ── HEADER ── */}
        <div className="space-y-6 mb-10 md:mb-16 text-center">
          {/* Label */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-12 md:w-16 bg-[#D4AF37] shrink-0" />
            <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
              Background & Skills
            </span>
            <div className="h-[2px] w-12 md:w-16 bg-[#D4AF37] shrink-0" />
          </div>

          {/* Big title — inspired by Travelling Distribution serif style */}
          <h2 className="text-7xl sm:text-8xl md:text-[9rem] lg:text-[11rem] font-black tracking-tighter text-white leading-[0.85] uppercase">
            About{" "}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #D4AF37" }}
            >
              Me
            </span>
          </h2>
        </div>

        {/* ── TAB NAVIGATION with progress bars ── */}
        <div className="relative mb-8 md:mb-12">
          {/* Tab bar */}
          <div className="relative flex items-center gap-1 md:gap-2 border-b border-[#1a1a1a] pb-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  ref={setRef(tab)}
                  onClick={() => handleTabClick(tab)}
                  className={`relative px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-mono uppercase tracking-[0.15em] md:tracking-[0.2em] transition-colors duration-300 cursor-pointer ${
                    isActive
                      ? "text-[#D4AF37] font-bold"
                      : "text-neutral-600 hover:text-neutral-400 font-medium"
                  }`}
                >
                  {tab}
                  {/* Progress bar under active tab */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 h-[2px] bg-[#D4AF37] transition-none"
                      style={{ width: `${progress * 100}%` }}
                    />
                  )}
                </button>
              );
            })}

            {/* Animated underline indicator (background track) */}
            <motion.div
              className="absolute bottom-0 h-[2px] bg-[#D4AF37]/15"
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          </div>
        </div>

        {/* ── PANEL CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
