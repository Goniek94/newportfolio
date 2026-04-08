"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../../../data/projects";

interface JourneyTabProps {
  project: Project;
}

// Journey tab — interactive vertical timeline of build phases
export default function JourneyTab({ project }: JourneyTabProps) {
  const [activeStep, setActiveStep] = useState(0);

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
          Build Journey
        </span>
        <div className="h-px flex-1 bg-[#1a1a1a]" />
        <span className="text-[10px] font-mono text-neutral-600">
          {project.journey.length} phases
        </span>
      </div>

      {/* Timeline — mobile: horizontal phase pills → vertical detail panel */}
      {/*         desktop: vertical timeline left + detail right          */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Mobile: horizontal scrollable phase pills */}
        <div className="flex md:hidden gap-2 overflow-x-auto scrollbar-none pb-1">
          {project.journey.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0 transition-all duration-300"
              style={{
                borderColor: i === activeStep ? "#D4AF37" : "#222",
                background: i === activeStep ? "rgba(212,175,55,0.1)" : "#0a0a0a",
              }}
            >
              <span
                className="font-mono text-[10px] font-black"
                style={{ color: i === activeStep ? "#D4AF37" : "rgba(255,255,255,0.3)" }}
              >
                {step.phase}
              </span>
              <span
                className="text-[11px] font-bold uppercase tracking-wide"
                style={{ color: i === activeStep ? "#ffffff" : "rgba(255,255,255,0.3)" }}
              >
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Desktop: vertical step selectors */}
        <div className="hidden md:flex flex-col gap-0 relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-5 bottom-5 w-px bg-[#1e1e1e]" />

          {project.journey.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className="relative flex items-center gap-3 py-3 group"
            >
              {/* Circle node */}
              <div
                className="relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  borderColor:
                    i === activeStep
                      ? "#D4AF37"
                      : i < activeStep
                        ? "rgba(212,175,55,0.4)"
                        : "#222",
                  background:
                    i === activeStep
                      ? "rgba(212,175,55,0.12)"
                      : i < activeStep
                        ? "rgba(212,175,55,0.05)"
                        : "#0a0a0a",
                  boxShadow:
                    i === activeStep ? "0 0 16px rgba(212,175,55,0.2)" : "none",
                }}
              >
                {i < activeStep ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="rgba(212,175,55,0.6)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span
                    className="font-mono text-[10px] font-black"
                    style={{
                      color:
                        i === activeStep ? "#D4AF37" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {step.phase}
                  </span>
                )}
              </div>

              {/* Step title */}
              <span
                className="text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300"
                style={{
                  color:
                    i === activeStep
                      ? "#ffffff"
                      : i < activeStep
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(255,255,255,0.15)",
                }}
              >
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Detail panel — full width on mobile, flex-1 on desktop */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-[#1e1e1e] bg-[#0a0a0a] p-6 h-full"
              style={{
                boxShadow: "0 0 30px rgba(212,175,55,0.04)",
                borderColor: "rgba(212,175,55,0.15)",
              }}
            >
              {/* Phase badge */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-widest"
                  style={{
                    background: "rgba(212,175,55,0.08)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    color: "#D4AF37",
                  }}
                >
                  Phase {project.journey[activeStep].phase}
                </span>
                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                  {project.journey[activeStep].duration}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                {project.journey[activeStep].title}
              </h4>

              {/* Description */}
              <p className="text-neutral-400 text-sm leading-[1.85]">
                {project.journey[activeStep].description}
              </p>

              {/* Navigation arrows */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#1a1a1a]">
                <button
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  disabled={activeStep === 0}
                  className="px-4 py-2 rounded-lg border border-[#222] text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Prev
                </button>
                <div className="flex gap-1.5 flex-1 justify-center">
                  {project.journey.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: i === activeStep ? "1.5rem" : "0.5rem",
                        background:
                          i === activeStep
                            ? "#D4AF37"
                            : i < activeStep
                              ? "rgba(212,175,55,0.3)"
                              : "#222",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setActiveStep((s) =>
                      Math.min(project.journey.length - 1, s + 1),
                    )
                  }
                  disabled={activeStep === project.journey.length - 1}
                  className="px-4 py-2 rounded-lg border border-[#222] text-[10px] font-mono uppercase tracking-widest text-neutral-500 hover:border-[#D4AF37]/30 hover:text-[#D4AF37] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
