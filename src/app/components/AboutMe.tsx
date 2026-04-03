"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import GlitchWord from "./about/GlitchWord";
import Counter from "./about/Counter";
import StackPill from "./about/StackPill";
import Terminal from "./about/Terminal";
import ChallengeTab from "./about/ChallengeTab";
import { buildItems, allStack } from "./about/data";

function RightColumn() {
  return (
    <div className="flex flex-col gap-8 lg:pl-10">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60">
          02
        </span>
        <div className="h-px flex-1 bg-[#111]" />
        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-600">
          Expertise
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {buildItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="group p-5 rounded-2xl border border-[#111] bg-[#080808] hover:border-[#D4AF37]/25 hover:bg-[#0c0c0a] transition-all duration-300 flex flex-col"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <h4 className="text-white font-bold text-sm mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
              {item.title}
            </h4>
            <p className="text-neutral-500 text-[13px] leading-relaxed flex-1">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#1a1a1a] bg-[#080808] p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60">
            03
          </span>
          <div className="h-px flex-1 bg-[#111]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-600">
            Hover to scramble
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allStack.map((tech, i) => (
            <StackPill key={tech} label={tech} delay={i * 0.02} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TabNav({
  activeTab,
  onTabChange,
  showChallengeGlow = true,
}: {
  activeTab: "profile" | "challenge";
  onTabChange: (tab: "profile" | "challenge") => void;
  showChallengeGlow?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-[#111] mb-8">
      {(["profile", "challenge"] as const).map((tab, i) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className="relative flex items-center gap-2 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.25em] transition-colors duration-200"
          style={{
            color: activeTab === tab ? "#D4AF37" : "rgba(255,255,255,0.25)",
          }}
        >
          <span
            className="text-[9px] tracking-[0.3em]"
            style={{
              color: activeTab === tab ? "#D4AF37" : "rgba(255,255,255,0.12)",
            }}
          >
            0{i + 1}
          </span>

          {tab === "challenge" && showChallengeGlow && activeTab !== tab ? (
            <span className="relative inline-flex items-center">
              <span
                className="px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-[0.25em]"
                style={{
                  color: "#569cd6",
                  textShadow:
                    "0 0 8px rgba(86,156,214,0.8), 0 0 20px rgba(86,156,214,0.4)",
                  background: "rgba(86,156,214,0.08)",
                  border: "1px solid rgba(86,156,214,0.35)",
                  borderRadius: "4px",
                }}
              >
                {tab}
                <span
                  className="absolute inset-0 rounded animate-ping"
                  style={{
                    background: "rgba(86,156,214,0.12)",
                    animationDuration: "2s",
                  }}
                />
              </span>
            </span>
          ) : (
            <span className="capitalize">{tab}</span>
          )}

          {activeTab === tab && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  const [activeTab, setActiveTab] = useState<"profile" | "challenge">(
    "profile",
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#050505] text-[#e1e1e1] border-t border-[#111]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/[0.025] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/[0.015] rounded-full blur-[120px] pointer-events-none" />

      {/* HERO BLOCK */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pt-10 md:pt-16 pb-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="h-[2px] w-10 bg-[#D4AF37]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#D4AF37]">
            About
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 items-end">
          <motion.div
            style={{ y: titleY, overflow: "visible" }}
            className="pb-8"
          >
            <GlitchWord text="FULL" entryDelay={0} />
            <GlitchWord text="STACK" entryDelay={0.15} />
            <GlitchWord text="DEVELOPER" outlined entryDelay={0.3} />
          </motion.div>

          {/* Desktop stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex flex-col gap-0 pb-3 pl-16"
          >
            <div className="flex gap-10 items-stretch">
              <div className="w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent self-stretch" />
              <div className="flex flex-col gap-10 justify-center">
                <Counter
                  value={3}
                  suffix="+"
                  label="Production apps shipped"
                  delay={0}
                />
                <Counter
                  value={2}
                  suffix="+"
                  label="Years commercial"
                  delay={200}
                />
                <Counter
                  value={15}
                  suffix="+"
                  label="Technologies mastered"
                  delay={400}
                />
                <Counter
                  value={100}
                  suffix="%"
                  label="Solo built"
                  delay={600}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex lg:hidden flex-wrap gap-8 mt-10 pt-8 border-t border-[#111]"
        >
          <Counter
            value={3}
            suffix="+"
            label="Production apps shipped"
            delay={0}
          />
          <Counter value={2} suffix="+" label="Years commercial" delay={200} />
          <Counter
            value={15}
            suffix="+"
            label="Technologies mastered"
            delay={400}
          />
          <Counter value={100} suffix="%" label="Solo built" delay={600} />
        </motion.div>
      </div>

      {/* CONTENT BLOCK */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 mt-8 md:mt-12 pb-10 md:pb-16">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-[#111]" />
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-neutral-700">
            Profile & Expertise
          </span>
          <div className="h-px flex-1 bg-[#111]" />
        </div>

        {activeTab === "profile" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-8 lg:gap-0">
            <div className="flex flex-col lg:pr-10">
              <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="flex-1">
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Terminal />
                </motion.div>
              </div>
            </div>

            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-[#1a1a1a] to-transparent" />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <RightColumn />
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col">
            <TabNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              showChallengeGlow={false}
            />
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChallengeTab />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
