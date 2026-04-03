"use client";

import { motion } from "framer-motion";
import { Project } from "../../data/projects";

interface ProjectListProps {
  projects: Project[];
  activeId: number;
  onSelect: (id: number) => void;
}

// Left column — vertical list of project cards
export default function ProjectList({
  projects,
  activeId,
  onSelect,
}: ProjectListProps) {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((project, i) => {
        const isActive = project.id === activeId;

        return (
          <motion.button
            key={project.id}
            onClick={() => onSelect(project.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative w-full text-left rounded-2xl border transition-all duration-500 overflow-hidden"
            style={{
              background: isActive
                ? "linear-gradient(135deg, #0f0f0f 0%, #0c0c0a 100%)"
                : "#080808",
              borderColor: isActive
                ? "rgba(212,175,55,0.5)"
                : "rgba(255,255,255,0.06)",
              boxShadow: isActive
                ? "0 0 40px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.08)"
                : "none",
            }}
          >
            {/* Active left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-500 rounded-l-2xl"
              style={{
                background: isActive
                  ? "linear-gradient(to bottom, #D4AF37, rgba(212,175,55,0.3))"
                  : "transparent",
              }}
            />

            <div className="px-5 py-4 pl-6">
              {/* Number + category row */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-300"
                  style={{
                    color: isActive
                      ? "rgba(212,175,55,0.7)"
                      : "rgba(255,255,255,0.2)",
                  }}
                >
                  {project.number}
                </span>
                {project.nda && (
                  <span className="text-[9px] font-mono bg-red-600/80 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                    NDA
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="text-xl font-black uppercase tracking-tight leading-none mb-1 transition-colors duration-300"
                style={{ color: isActive ? "#ffffff" : "#444" }}
              >
                {project.title}
              </h3>

              {/* Category + year */}
              <div className="flex items-center justify-between mt-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-wider transition-colors duration-300"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.15)",
                  }}
                >
                  {project.category}
                </span>
                <span
                  className="text-[10px] font-mono transition-colors duration-300"
                  style={{
                    color: isActive
                      ? "rgba(212,175,55,0.5)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  {project.year}
                </span>
              </div>
            </div>

            {/* Hover glow */}
            {!isActive && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl border border-[#D4AF37]/20" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
