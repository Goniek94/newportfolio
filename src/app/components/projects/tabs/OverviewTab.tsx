"use client";

import { motion } from "framer-motion";
import { Project } from "../../../data/projects";

interface OverviewTabProps {
  project: Project;
}

// Overview tab — description, links, quick stats
export default function OverviewTab({ project }: OverviewTabProps) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-8"
    >
      {/* Description */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-[#D4AF37]/40" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60">
            About
          </span>
        </div>
        <p className="text-neutral-300 text-base leading-[1.85] font-light">
          {project.description}
        </p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Category", value: project.category },
          { label: "Year", value: project.year },
          { label: "Stack", value: `${project.tech.length} technologies` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 border border-[#1a1a1a] bg-[#0a0a0a]"
          >
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-600 mb-1.5">
              {stat.label}
            </div>
            <div className="text-sm font-bold text-white leading-tight">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tech tags */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-[#D4AF37]/40" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60">
            Technologies
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37]/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#1a1a1a]">
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-black uppercase tracking-widest hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60 transition-all duration-300"
          >
            Live Site →
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#333] bg-[#111] text-neutral-400 text-xs font-black uppercase tracking-widest hover:border-[#555] hover:text-white transition-all duration-300"
          >
            GitHub →
          </a>
        )}
        {project.codeNote && (
          <p className="text-neutral-600 text-[11px] font-mono leading-relaxed">
            {project.codeNote}
          </p>
        )}
      </div>
    </motion.div>
  );
}
