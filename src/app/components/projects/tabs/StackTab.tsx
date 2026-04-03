"use client";

import { motion } from "framer-motion";
import { Project } from "../../../data/projects";

interface StackTabProps {
  project: Project;
}

// Stack tab — tech stack grouped by category
export default function StackTab({ project }: StackTabProps) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-px w-6 bg-[#D4AF37]/40" />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60">
          Technology Stack
        </span>
        <div className="h-px flex-1 bg-[#1a1a1a]" />
        <span className="text-[10px] font-mono text-neutral-600">
          {project.tech.length} total
        </span>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {project.stackCategories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5 hover:border-[#D4AF37]/20 transition-colors duration-300"
          >
            {/* Category label */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60">
                {cat.label}
              </span>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 text-[11px] font-mono rounded-lg border border-[#222] bg-[#111] text-neutral-300 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all duration-200 cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full list bar chart style */}
      <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-5">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600 mb-4">
          All Technologies
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-lg border border-[#D4AF37]/15 bg-[#D4AF37]/5 text-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all duration-200 cursor-default"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
