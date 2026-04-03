"use client";

import { motion } from "framer-motion";
import { Project } from "../../../data/projects";
import { FaCode, FaLock, FaUnlock, FaTerminal } from "react-icons/fa";

interface CodeTabProps {
  project: Project;
  onOpenVSCode: () => void;
}

// Code tab — preview of snippets + launch button for full VSCode viewer
export default function CodeTab({ project, onOpenVSCode }: CodeTabProps) {
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
          Source Code
        </span>
        <div className="h-px flex-1 bg-[#1a1a1a]" />
        <span className="text-[10px] font-mono text-neutral-600">
          {project.snippets.length} files previewed
        </span>
      </div>

      {/* Snippet previews */}
      <div className="flex flex-col gap-3">
        {project.snippets.map((snippet, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a]"
          >
            {/* File title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f0f] border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                  <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[#555] text-[10px] uppercase tracking-[0.25em] flex items-center gap-1.5 ml-2">
                  <FaTerminal size={8} />
                  {snippet.name}
                </span>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  snippet.name.endsWith(".tsx") || snippet.name.endsWith(".jsx")
                    ? "bg-blue-400"
                    : snippet.name.endsWith(".ts")
                      ? "bg-yellow-300"
                      : "bg-yellow-400"
                }`}
              />
            </div>

            {/* Code preview — first 4 lines, blurred at bottom */}
            <div
              className="relative overflow-hidden"
              style={{ maxHeight: "100px" }}
            >
              <pre className="px-4 py-3 text-[11px] font-mono leading-6 text-[#D4AF37]/60 whitespace-pre overflow-hidden">
                {snippet.code.split("\n").slice(0, 5).join("\n")}
              </pre>
              {/* Fade out overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, #0a0a0a)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* NDA note */}
      {project.codeNote && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[#D4AF37]/10 bg-[#D4AF37]/5">
          <FaLock className="text-[#D4AF37]/40 mt-0.5 shrink-0" size={10} />
          <p className="text-neutral-500 text-[11px] font-mono leading-relaxed">
            {project.codeNote}
          </p>
        </div>
      )}

      {/* Launch VSCode viewer CTA */}
      <div
        className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/20 cursor-pointer group"
        onClick={onOpenVSCode}
        style={{
          background: "linear-gradient(135deg, #0f0f0d 0%, #0a0a08 100%)",
        }}
      >
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, #D4AF37 2px, #D4AF37 3px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center gap-4 py-10 px-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center bg-[#D4AF37]/5 group-hover:border-[#D4AF37]/70 group-hover:bg-[#D4AF37]/10 transition-all duration-500">
            <FaCode
              className="text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors duration-500"
              size={22}
            />
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <div className="text-white font-black text-base uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors duration-300">
              Open Full Repository
            </div>
            <div className="text-neutral-600 text-[11px] font-mono uppercase tracking-widest">
              Interactive VSCode viewer
            </div>
          </div>

          {/* CTA button */}
          <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/15 group-hover:border-[#D4AF37]/60 transition-all duration-300">
            <FaUnlock
              size={11}
              className="text-[#D4AF37]/70 group-hover:text-[#D4AF37] transition-colors duration-300"
            />
            <span className="text-[#D4AF37]/70 group-hover:text-[#D4AF37] text-[11px] font-black uppercase tracking-widest transition-colors duration-300">
              View Source Code
            </span>
          </div>
        </div>

        {/* Gold corner accents */}
        <div className="pointer-events-none absolute top-0 left-0 w-5 h-5 border-t border-l border-[#D4AF37]/20 rounded-tl-2xl" />
        <div className="pointer-events-none absolute top-0 right-0 w-5 h-5 border-t border-r border-[#D4AF37]/20 rounded-tr-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[#D4AF37]/20 rounded-bl-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#D4AF37]/20 rounded-br-2xl" />
      </div>
    </motion.div>
  );
}
