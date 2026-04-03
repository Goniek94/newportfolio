"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../../data/projects";
import OverviewTab from "./tabs/OverviewTab";
import JourneyTab from "./tabs/JourneyTab";
import StackTab from "./tabs/StackTab";

type Tab = "overview" | "journey" | "stack" | "code";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "journey", label: "Journey" },
  { id: "stack", label: "Stack" },
  { id: "code", label: "Code" },
];

interface ProjectPanelProps {
  project: Project;
  onOpenVSCode: (id: number) => void;
}

// Right panel — tabbed detail view for the selected project
export default function ProjectPanel({
  project,
  onOpenVSCode,
}: ProjectPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const handleTabClick = (tabId: Tab) => {
    // Clicking "code" immediately opens the VSCode viewer — no extra step needed
    if (tabId === "code") {
      onOpenVSCode(project.id);
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      {/* Panel header — project title + tab bar */}
      <div
        className="shrink-0 rounded-t-2xl border border-b-0 px-6 pt-5 pb-0"
        style={{
          background: "linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%)",
          borderColor: "rgba(212,175,55,0.2)",
        }}
      >
        {/* Project title row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]/50">
                {project.number}
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-600">
                {project.category}
              </span>
              {project.nda && (
                <span className="text-[9px] font-mono bg-red-600/80 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                  NDA
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-none">
              {project.title}
            </h2>
          </div>
          <span
            className="font-mono text-[11px] px-3 py-1.5 rounded-lg border mt-1"
            style={{
              color: "rgba(212,175,55,0.6)",
              borderColor: "rgba(212,175,55,0.2)",
              background: "rgba(212,175,55,0.05)",
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border-b border-[#1a1a1a]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-200"
              style={{
                color:
                  activeTab === tab.id ? "#D4AF37" : "rgba(255,255,255,0.25)",
              }}
            >
              {tab.label}
              {/* Active underline — only for non-code tabs */}
              {activeTab === tab.id && tab.id !== "code" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel body — scrollable tab content */}
      <div
        className="flex-1 overflow-y-auto rounded-b-2xl border border-t-0 p-6"
        style={{
          background: "#080808",
          borderColor: "rgba(212,175,55,0.2)",
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewTab key={`overview-${project.id}`} project={project} />
          )}
          {activeTab === "journey" && (
            <JourneyTab key={`journey-${project.id}`} project={project} />
          )}
          {activeTab === "stack" && (
            <StackTab key={`stack-${project.id}`} project={project} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
