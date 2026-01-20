"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileNode } from "../data/vscode/index"; // Zaktualizowany import

interface VSCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileNode[];
  title: string;
}

const highlightCode = (code: string) => {
  if (!code) return "";
  return code
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /\b(const|let|var|class|import|from|return|if|else|try|catch|async|await|new|this|export|default|function|interface|type)\b/g,
      '<span style="color: #c586c0;">$1</span>',
    )
    .replace(
      /\b(require|module|exports|console|window|document|localStorage|process)\b/g,
      '<span style="color: #4ec9b0;">$1</span>',
    )
    .replace(/'([^']*)'/g, "<span style=\"color: #ce9178;\">'$1'</span>")
    .replace(/"([^"]*)"/g, '<span style="color: #ce9178;">"$1"</span>')
    .replace(/\/\/.*$/gm, '<span style="color: #6a9955;">$&</span>')
    .replace(
      /\b([A-Z][a-zA-Z0-9_]*)\b/g,
      '<span style="color: #4ec9b0;">$1</span>',
    )
    .replace(
      /\b([a-z][a-zA-Z0-9_]*)(?=\()/g,
      '<span style="color: #dcdcaa;">$1</span>',
    );
};

export default function VSCodeViewer({
  isOpen,
  onClose,
  files,
  title,
}: VSCodeViewerProps) {
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Otwórz pierwszy plik domyślnie
  useEffect(() => {
    if (isOpen && !activeFile) {
      // Spróbuj znaleźć pierwszy plik w pierwszym folderze
      const firstFile = files[0]?.children ? files[0].children[0] : files[0];
      setActiveFile(firstFile || null);
    }
  }, [isOpen, files, activeFile]);

  // --- EFEKT WOLNEGO PISANIA ---
  useEffect(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    if (activeFile && activeFile.language !== "image" && activeFile.content) {
      setDisplayedCode("");
      setIsTyping(true);

      let currentIndex = 0;
      const fullCode = activeFile.content;

      // BARDZO WOLNO I DOKŁADNIE: 50ms na 1 znak
      const charsPerTick = 1;
      const intervalTime = 50;

      typingIntervalRef.current = setInterval(() => {
        if (currentIndex < fullCode.length) {
          setDisplayedCode(
            (prev) =>
              prev + fullCode.slice(currentIndex, currentIndex + charsPerTick),
          );
          currentIndex += charsPerTick;

          if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop =
              codeContainerRef.current.scrollHeight;
          }
        } else {
          setIsTyping(false);
          if (typingIntervalRef.current)
            clearInterval(typingIntervalRef.current);
        }
      }, intervalTime);
    } else {
      setDisplayedCode("");
      setIsTyping(false);
    }

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [activeFile]);

  const handleSkip = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (activeFile?.content) {
      setDisplayedCode(activeFile.content);
      setIsTyping(false);
    }
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.name} className="select-none">
        <div
          className={`flex items-center gap-2 px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer text-sm ${
            activeFile?.name === node.name
              ? "bg-[#37373d] text-white"
              : "text-[#cccccc]"
          }`}
          style={{ paddingLeft: `${depth * 12 + 10}px` }}
          onClick={() => {
            // Jeśli to plik (nie ma dzieci), ustaw jako aktywny
            if (!node.children) setActiveFile(node);
          }}
        >
          {node.children ? (
            <span className="text-neutral-400">›</span>
          ) : (
            <span
              className={`w-3 h-3 ${
                node.language === "image"
                  ? "bg-purple-400"
                  : node.name.endsWith("js")
                    ? "bg-yellow-400"
                    : node.name.endsWith("tsx")
                      ? "bg-blue-400"
                      : "bg-blue-500"
              } rounded-full opacity-80`}
            ></span>
          )}
          <span>{node.name}</span>
        </div>
        {node.children && <div>{renderTree(node.children, depth + 1)}</div>}
      </div>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10"
          onClick={onClose}
        >
          <div
            className="w-full max-w-7xl h-[85vh] bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#333] flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TITLE BAR */}
            <div className="h-10 bg-[#323233] flex items-center justify-between px-4 select-none shrink-0">
              <div className="flex items-center gap-2">
                <div
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer"
                ></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="text-xs text-[#cccccc] font-sans">
                {title} - Visual Studio Code
              </div>
              <div className="w-16"></div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden">
              {/* SIDEBAR EXPLORER */}
              <div className="w-64 bg-[#252526] border-r border-[#333] flex flex-col hidden md:flex shrink-0">
                <div className="h-8 px-4 flex items-center text-xs font-bold text-[#bbbbbb] uppercase tracking-wider mt-2">
                  Explorer
                </div>
                <div className="mt-2 overflow-y-auto">
                  <div className="px-4 py-1 text-xs font-bold text-blue-400 uppercase">
                    PROJECT FILES
                  </div>
                  {renderTree(files)}
                </div>
              </div>

              {/* EDITOR AREA */}
              <div className="flex-1 flex flex-col bg-[#1e1e1e] relative min-w-0">
                {/* TABS */}
                {activeFile && (
                  <div className="h-9 bg-[#1e1e1e] flex items-center border-b border-[#333] shrink-0 overflow-x-auto">
                    <div className="px-4 h-full bg-[#1e1e1e] border-t-2 border-blue-500 text-white text-sm flex items-center gap-2 min-w-fit">
                      <span
                        className={`w-3 h-3 ${
                          activeFile.language === "image"
                            ? "bg-purple-400"
                            : "bg-blue-500"
                        } rounded-full`}
                      ></span>
                      {activeFile.name}
                      <span
                        className="ml-2 text-neutral-500 hover:text-white cursor-pointer"
                        onClick={() => setActiveFile(null)}
                      >
                        ×
                      </span>
                    </div>
                  </div>
                )}

                {/* CONTENT */}
                <div
                  ref={codeContainerRef}
                  className="flex-1 overflow-auto font-mono text-sm leading-6 custom-scrollbar relative bg-[#1e1e1e]"
                >
                  {activeFile ? (
                    activeFile.language === "image" ? (
                      <div className="w-full h-full flex items-center justify-center p-10 bg-[#1e1e1e]">
                        <img
                          src={activeFile.imageSrc}
                          alt={activeFile.name}
                          className="max-w-full max-h-full object-contain shadow-2xl border border-[#333]"
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-full p-4">
                        <div className="flex flex-col text-right pr-4 text-[#858585] select-none border-r border-[#333] mr-4 h-full">
                          {displayedCode.split("\n").map((_, i) => (
                            <div key={i} className="leading-6">
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 text-[#d4d4d4] whitespace-pre font-mono">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: highlightCode(displayedCode),
                            }}
                          />
                          {isTyping && (
                            <span className="inline-block w-2 h-5 bg-white align-middle animate-pulse ml-1"></span>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#333]">
                      <div className="text-center">
                        <div className="text-6xl mb-4 opacity-20">⌨️</div>
                        <p>Select a file...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* SKIP BUTTON */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={handleSkip}
                      className="absolute bottom-6 right-6 bg-[#007acc] hover:bg-[#0063a5] text-white px-4 py-2 rounded shadow-lg text-xs font-bold tracking-wider uppercase transition-colors z-50 flex items-center gap-2"
                    >
                      Skip Writing ⏩
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* STATUS BAR */}
            <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-xs select-none shrink-0">
              <div className="flex gap-4">
                <span>main*</span>
                {isTyping ? <span>Writing...</span> : <span>Ready</span>}
              </div>
              <div className="flex gap-4">
                {activeFile?.language !== "image" && (
                  <span>Ln {displayedCode.split("\n").length}, Col 1</span>
                )}
                <span>UTF-8</span>
                <span>{activeFile?.language?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
