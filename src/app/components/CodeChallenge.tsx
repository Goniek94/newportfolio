"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────
// INTERACTIVE CODE CHALLENGE DIVIDER
// A TypeScript puzzle the visitor can solve
// ─────────────────────────────────────────────

const CHALLENGE = {
  question: `// What does this TypeScript function return?

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

const config: DeepReadonly<{
  db: { host: string; port: number };
  debug: boolean;
}> = {
  db: { host: "localhost", port: 5432 },
  debug: false,
};

config.db.port = 3000; // What happens here?`,
  options: [
    { id: "a", text: "Compiles fine, port is updated to 3000" },
    {
      id: "b",
      text: "TypeScript error: Cannot assign to 'port' — it's readonly",
    },
    { id: "c", text: "Runtime error: property is not writable" },
    { id: "d", text: "Compiles fine, but port stays 5432 at runtime" },
  ],
  correct: "b",
  explanation:
    "DeepReadonly recursively marks all nested properties as readonly. Since db.port is nested inside an object, it becomes readonly too — TypeScript throws a compile-time error. This is a common pattern for immutable config objects.",
};

export default function CodeChallenge() {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected === CHALLENGE.correct;

  return (
    <section className="relative w-full bg-[#050505] overflow-hidden border-t border-[#111]">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-[2px] w-10 bg-[#D4AF37]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#D4AF37]">
            Quick Challenge
          </span>
          <div className="h-px flex-1 bg-[#111]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-600">
            TypeScript
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code block */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#080808] font-mono"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f0f] border-b border-[#1a1a1a]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[#444] text-[10px] uppercase tracking-[0.25em]">
                challenge.ts
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37]/40 uppercase tracking-widest">
                TypeScript
              </span>
            </div>

            {/* Code */}
            <div className="flex overflow-x-auto">
              {/* Line numbers */}
              <div className="flex flex-col text-right pr-4 pl-4 py-4 text-[#333] select-none border-r border-[#1a1a1a] text-[11px] leading-6 shrink-0">
                {CHALLENGE.question.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Code content */}
              <pre className="flex-1 py-4 px-4 text-[11px] leading-6 overflow-x-auto">
                {CHALLENGE.question.split("\n").map((line, i) => {
                  // Simple syntax coloring
                  if (line.trim().startsWith("//")) {
                    return (
                      <div key={i} style={{ color: "#6a9955" }}>
                        {line}
                      </div>
                    );
                  }
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

          {/* Answer panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              Pick the correct answer — no pressure, it&apos;s just for fun 🙂
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {CHALLENGE.options.map((opt) => {
                const isSelected = selected === opt.id;
                const isRight = opt.id === CHALLENGE.correct;
                const showResult = revealed;

                let borderColor = "rgba(255,255,255,0.06)";
                let bg = "#080808";
                let textColor = "rgba(255,255,255,0.4)";

                if (showResult) {
                  if (isRight) {
                    borderColor = "rgba(39,201,63,0.5)";
                    bg = "rgba(39,201,63,0.06)";
                    textColor = "#27c93f";
                  } else if (isSelected && !isRight) {
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
                    className="flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 disabled:cursor-default"
                    style={{ borderColor, background: bg }}
                  >
                    <span
                      className="font-mono text-[10px] font-black uppercase tracking-widest mt-0.5 shrink-0 w-4"
                      style={{ color: textColor }}
                    >
                      {opt.id}
                    </span>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: textColor }}
                    >
                      {opt.text}
                    </span>
                    {showResult && isRight && (
                      <span className="ml-auto text-[#27c93f] shrink-0">✓</span>
                    )}
                    {showResult && isSelected && !isRight && (
                      <span className="ml-auto text-[#ef4444] shrink-0">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit / result */}
            <div className="flex items-center gap-3 mt-1">
              {!revealed ? (
                <button
                  onClick={() => selected && setRevealed(true)}
                  disabled={!selected}
                  className="px-5 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    borderColor: selected
                      ? "rgba(212,175,55,0.5)"
                      : "rgba(255,255,255,0.1)",
                    background: selected
                      ? "rgba(212,175,55,0.08)"
                      : "transparent",
                    color: selected ? "#D4AF37" : "rgba(255,255,255,0.3)",
                  }}
                >
                  Check Answer →
                </button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: isCorrect ? "#27c93f" : "#ef4444" }}
                    >
                      {isCorrect ? "✓ Correct!" : "✗ Not quite."}
                    </span>
                    <button
                      onClick={() => {
                        setSelected(null);
                        setRevealed(false);
                      }}
                      className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors ml-2"
                    >
                      Try again
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a]">
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/60 mb-2">
                      Explanation
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {CHALLENGE.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
