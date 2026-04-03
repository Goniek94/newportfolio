"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CHALLENGE } from "./data";

function CodeBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#080808] font-mono"
    >
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f0f] border-b border-[#1a1a1a]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[#444] text-[11px] uppercase tracking-[0.25em]">
          challenge.ts
        </span>
        <span className="text-[11px] font-mono text-[#D4AF37]/40 uppercase tracking-widest">
          TypeScript
        </span>
      </div>

      <div className="flex">
        <div className="flex flex-col text-right pr-4 pl-4 py-5 text-[#333] select-none border-r border-[#1a1a1a] text-[14px] leading-7 shrink-0">
          {CHALLENGE.question.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 py-5 px-5 text-[14px] leading-7 overflow-x-auto">
          {CHALLENGE.question.split("\n").map((line, i) => {
            if (line.trim().startsWith("//"))
              return (
                <div key={i} style={{ color: "#6a9955" }}>
                  {line}
                </div>
              );
            if (line.includes("type ") || line.includes("const ")) {
              return (
                <div key={i}>
                  {line
                    .split(/\b(type|const|readonly|extends|object)\b/)
                    .map((part, j) =>
                      [
                        "type",
                        "const",
                        "readonly",
                        "extends",
                        "object",
                      ].includes(part) ? (
                        <span key={j} style={{ color: "#569cd6" }}>
                          {part}
                        </span>
                      ) : (
                        <span key={j} style={{ color: "#d4d4d4" }}>
                          {part}
                        </span>
                      ),
                    )}
                </div>
              );
            }
            return (
              <div key={i} style={{ color: "#d4d4d4" }}>
                {line}
              </div>
            );
          })}
        </pre>
      </div>
    </motion.div>
  );
}

export default function ChallengeTab() {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isCorrect = selected === CHALLENGE.correct;

  return (
    <div className="flex flex-col gap-5">
      <CodeBlock />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        <p className="text-neutral-500 text-[12px] font-mono uppercase tracking-[0.25em]">
          Pick the correct answer
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHALLENGE.options.map((opt) => {
            const isSelected = selected === opt.id;
            const isRight = opt.id === CHALLENGE.correct;
            let borderColor = "rgba(255,255,255,0.06)";
            let bg = "#080808";
            let textColor = "rgba(255,255,255,0.4)";

            if (revealed) {
              if (isRight) {
                borderColor = "rgba(39,201,63,0.5)";
                bg = "rgba(39,201,63,0.06)";
                textColor = "#27c93f";
              } else if (isSelected) {
                borderColor = "rgba(239,68,68,0.5)";
                bg = "rgba(239,68,68,0.06)";
                textColor = "#ef4444";
              }
            } else if (isSelected) {
              borderColor = "rgba(212,175,55,0.5)";
              bg = "rgba(212,175,55,0.06)";
              textColor = "#D4AF37";
            }

            return (
              <button
                key={opt.id}
                onClick={() => !revealed && setSelected(opt.id)}
                disabled={revealed}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-left transition-all duration-200 disabled:cursor-default"
                style={{ borderColor, background: bg }}
              >
                <span
                  className="font-mono text-[10px] font-black uppercase tracking-widest mt-0.5 shrink-0 w-3"
                  style={{ color: textColor }}
                >
                  {opt.id}
                </span>
                <span
                  className="text-[13px] leading-relaxed"
                  style={{ color: textColor }}
                >
                  {opt.text}
                </span>
                {revealed && isRight && (
                  <span className="ml-auto text-[#27c93f] shrink-0 text-sm">
                    ✓
                  </span>
                )}
                {revealed && isSelected && !isRight && (
                  <span className="ml-auto text-[#ef4444] shrink-0 text-sm">
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {!revealed ? (
            <button
              onClick={() => selected && setRevealed(true)}
              disabled={!selected}
              className="px-5 py-2 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: selected
                  ? "rgba(212,175,55,0.5)"
                  : "rgba(255,255,255,0.1)",
                background: selected ? "rgba(212,175,55,0.08)" : "transparent",
                color: selected ? "#D4AF37" : "rgba(255,255,255,0.3)",
              }}
            >
              Check Answer →
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <span
                className="text-[14px] font-bold"
                style={{ color: isCorrect ? "#27c93f" : "#ef4444" }}
              >
                {isCorrect ? "✓ Correct!" : "✗ Not quite."}
              </span>
              <button
                onClick={() => {
                  setSelected(null);
                  setRevealed(false);
                }}
                className="text-[11px] font-mono uppercase tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors ml-2"
              >
                Try again
              </button>
            </motion.div>
          )}
        </div>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a]">
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60 mb-2">
                Explanation
              </div>
              <p className="text-neutral-400 text-[13px] leading-relaxed">
                {CHALLENGE.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
