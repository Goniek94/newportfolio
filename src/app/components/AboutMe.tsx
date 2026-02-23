"use client";

import { motion } from "framer-motion";
import { FaCode, FaServer, FaDatabase, FaRocket } from "react-icons/fa";

// ─────────────────────────────────────────────
// SKILL PILLARS
// ─────────────────────────────────────────────
const pillars = [
  {
    icon: FaCode,
    label: "Frontend",
    items: [
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
    year: "2023",
    title: "Journey begins",
    desc: "Left the kitchen, opened VS Code.",
  },
  {
    year: "2024",
    title: "First production app",
    desc: "Launched Autosell.pl with real users & payments.",
  },
  {
    year: "2025",
    title: "Full-stack expansion",
    desc: "Built Ecomati.pl, NestJS, Docker.",
  },
  {
    year: "2026",
    title: "Open to work",
    desc: "Looking for a team to grow with.",
  },
];

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function AboutMe() {
  return (
    <section
      id="about"
      className="relative w-full bg-[#050505] text-[#e1e1e1] py-20 md:py-32 px-4 md:px-12 overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#D4AF37]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1700px] mx-auto relative z-10 space-y-14 md:space-y-20">
        {/* ── ROW 1: HEADER + BIO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left — label + big title + stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-5 md:space-y-6"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-[2px] w-10 md:w-16 bg-[#D4AF37] shrink-0" />
              <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] md:tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
                Background & Skills
              </span>
            </div>

            <h2 className="text-6xl sm:text-7xl md:text-[7rem] font-black tracking-tighter text-white uppercase leading-none">
              About
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                Me
              </span>
            </h2>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8 pt-4 border-t border-[#1a1a1a]">
              {[
                { value: "4+", label: "Years learning" },
                { value: "3+", label: "Apps" },
                { value: "100%", label: "Self-taught" },
              ].map((s, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-tighter leading-none">
                    {s.value}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 space-y-4 md:space-y-6"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-neutral-300 font-light leading-relaxed border-l-4 border-[#D4AF37] pl-5 md:pl-8">
              4 years of learning, building{" "}
              <span className="text-white font-semibold">
                production apps for clients
              </span>{" "}
              since August 2024.
            </p>
            <p className="text-neutral-500 text-base md:text-lg leading-relaxed pl-5 md:pl-8">
              I started learning programming seriously and never stopped. I
              bring discipline, ownership, and attention to detail to every line
              of code — from database schema design to pixel-perfect UI and
              deployment pipelines.
            </p>
            <p className="text-neutral-600 text-sm md:text-base pl-5 md:pl-8">
              Based in{" "}
              <span className="text-[#D4AF37] font-semibold">
                Łowicz / Warsaw, Poland
              </span>
              . Open to remote or hybrid roles across Europe.
            </p>
          </motion.div>
        </div>

        {/* ── ROW 2: SKILL PILLARS (4 columns) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37]/50 hover:bg-[#0d0d0d] transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:to-transparent transition-all duration-700 rounded-[1.5rem]" />
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-10 h-10 md:w-12 md:h-12 border-t-2 border-r-2 border-[#D4AF37]/10 group-hover:border-[#D4AF37]/40 rounded-tr-[1.25rem] md:rounded-tr-[1.5rem] transition-colors duration-500" />

                <div className="relative z-10 space-y-3 md:space-y-5">
                  {/* Icon */}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/60 group-hover:bg-[#D4AF37]/15 transition-all duration-500">
                    <Icon className="text-[#D4AF37]" size={16} />
                  </div>
                  {/* Label */}
                  <span className="block text-white font-black uppercase tracking-widest text-xs md:text-sm">
                    {pillar.label}
                  </span>
                  {/* Skills */}
                  <ul className="space-y-1.5 md:space-y-2">
                    {pillar.items.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-2 text-neutral-500 text-xs md:text-sm group-hover:text-neutral-400 transition-colors duration-300"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50 shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── ROW 3: TIMELINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          {/* Horizontal connector line — desktop only */}
          <div className="hidden lg:block absolute top-5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col gap-3 md:gap-4"
              >
                {/* Dot — desktop only */}
                <div className="hidden lg:flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/50 bg-[#050505] flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  </div>
                  <div className="flex-1 h-[1px] bg-[#1a1a1a]" />
                </div>

                {/* Content card */}
                <div className="p-4 md:p-5 rounded-[1.25rem] bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37]/30 transition-colors duration-500 space-y-1.5 md:space-y-2">
                  <span className="text-[#D4AF37] font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase font-black">
                    {item.year}
                  </span>
                  <h4 className="text-white font-black text-sm md:text-base uppercase tracking-tight leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
