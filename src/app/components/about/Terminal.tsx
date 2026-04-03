"use client";

import { useRef, useEffect, useState } from "react";
import { terminalScript, type TermLine } from "./data";

export default function Terminal() {
  const [visibleLines, setVisibleLines] = useState<TermLine[]>([]);
  const [typingLine, setTypingLine] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRunning(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!running || done) return;
    if (lineIdx >= terminalScript.length) {
      setDone(true);
      return;
    }
    const line = terminalScript[lineIdx];
    if (line.type === "cmd") {
      if (charIdx < line.text.length) {
        const t = setTimeout(() => {
          setTypingLine((prev) => prev + line.text[charIdx]);
          setCharIdx((c) => c + 1);
        }, 65);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setVisibleLines((prev) => [...prev, line]);
          setTypingLine("");
          setCharIdx(0);
          setLineIdx((l) => l + 1);
        }, 120);
        return () => clearTimeout(t);
      }
    } else {
      const delay = line.type === "blank" ? 60 : 16;
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        setLineIdx((l) => l + 1);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [running, done, lineIdx, charIdx]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines, typingLine]);

  return (
    <div ref={sectionRef} className="h-full flex flex-col">
      <div className="rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#080808] flex flex-col font-mono flex-1">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0f0f0f] border-b border-[#1a1a1a] shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[#444] text-[11px] uppercase tracking-[0.25em]">
            mateusz@portfolio ~ %
          </span>
          <div className="w-16" />
        </div>

        {/* Terminal body */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden p-5 text-[14px] leading-[1.9]"
        >
          {visibleLines.map((line, i) => {
            if (line.type === "blank") return <div key={i} className="h-2" />;
            if (line.type === "cmd")
              return (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#27c93f] shrink-0">❯</span>
                  <span className="text-white">{line.text}</span>
                </div>
              );
            return (
              <div key={i} style={{ color: line.color ?? "#888" }}>
                {line.text}
              </div>
            );
          })}

          {typingLine && (
            <div className="flex items-start gap-2">
              <span className="text-[#27c93f] shrink-0">❯</span>
              <span className="text-white">
                {typingLine}
                <span className="inline-block w-2 h-[14px] bg-white align-middle ml-0.5 animate-pulse" />
              </span>
            </div>
          )}

          {done && (
            <div className="flex items-start gap-2 mt-1">
              <span className="text-[#27c93f] shrink-0">❯</span>
              <span className="inline-block w-2 h-[14px] bg-[#27c93f] align-middle animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
