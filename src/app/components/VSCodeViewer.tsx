"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileNode } from "../data/vscode/index";

interface VSCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileNode[];
  title: string;
}

const highlightCode = (code: string) => {
  if (!code) return "";

  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .split("\n")
    .map((line) => {
      // Całe linie komentarzy
      if (
        /^\s*\/\//.test(line) ||
        /^\s*\/\*/.test(line) ||
        /^\s*\*/.test(line)
      ) {
        return `<span style="color:#6a9955">${line}</span>`;
      }

      let result = line;

      // Zabezpiecz stringi placeholderem żeby keywords w środku nie były kolorowane
      result = result.replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        "\x00STR\x00$1\x00/STR\x00",
      );

      // Keywords
      result = result.replace(
        /\b(const|let|var|function|return|import|export|from|default|async|await|if|else|for|while|class|extends|new|this|typeof|instanceof|null|undefined|true|false|static|interface|type|enum)\b/g,
        '<span style="color:#569cd6">$1</span>',
      );

      // Types / React
      result = result.replace(
        /\b(React|useState|useEffect|useRef|useCallback|useMemo|Promise|Array|Object|string|number|boolean|void|any)\b/g,
        '<span style="color:#4ec9b0">$1</span>',
      );

      // Numbers
      result = result.replace(
        /\b(\d+)\b/g,
        '<span style="color:#b5cea8">$1</span>',
      );

      // Function names
      result = result.replace(
        /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
        '<span style="color:#dcdcaa">$1</span>',
      );

      // Przywróć stringi z kolorem
      result = result.replace(
        /\x00STR\x00(.*?)\x00\/STR\x00/g,
        '<span style="color:#ce9178">$1</span>',
      );

      return result;
    })
    .join("\n");
};
const findFirstFile = (nodes: FileNode[]): FileNode | null => {
  for (const node of nodes) {
    if (!node.children) return node;
    const found = findFirstFile(node.children);
    if (found) return found;
  }
  return null;
};

// Only collect root-level folder names (depth 0) — keeps sidebar clean on open
const collectRootFolderNames = (nodes: FileNode[]): Set<string> => {
  const names = new Set<string>();
  for (const node of nodes) {
    if (node.children) {
      names.add(node.name);
    }
  }
  return names;
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
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setActiveFile(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setOpenFolders(collectRootFolderNames(files));
      if (!activeFile) {
        setActiveFile(findFirstFile(files));
      }
    }
  }, [isOpen, files]);

  useEffect(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    if (activeFile && activeFile.language !== "image" && activeFile.content) {
      setDisplayedCode("");
      setIsTyping(true);

      let currentIndex = 0;
      const fullCode = activeFile.content;

      typingIntervalRef.current = setInterval(() => {
        if (currentIndex < fullCode.length) {
          setDisplayedCode((prev) => prev + fullCode[currentIndex]);
          currentIndex += 1;
          if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop =
              codeContainerRef.current.scrollHeight;
          }
        } else {
          setIsTyping(false);
          if (typingIntervalRef.current)
            clearInterval(typingIntervalRef.current);
        }
      }, 50);
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

  const toggleFolder = (name: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.name}>
        <div
          className={`flex items-center gap-2 py-[3px] hover:bg-[#2a2d2e] cursor-pointer text-sm select-none ${
            activeFile?.name === node.name
              ? "bg-[#37373d] text-white"
              : "text-[#cccccc]"
          }`}
          style={{ paddingLeft: `${depth * 12 + 10}px` }}
          onClick={() => {
            if (node.children) {
              toggleFolder(node.name);
            } else {
              setActiveFile(node);
            }
          }}
        >
          {node.children ? (
            <span className="flex items-center gap-1 text-neutral-400 shrink-0">
              <motion.span
                animate={{ rotate: openFolders.has(node.name) ? 90 : 0 }}
                transition={{ duration: 0.15 }}
                className="inline-block text-[11px] leading-none"
              >
                ›
              </motion.span>
              <span className="text-[13px]">
                {openFolders.has(node.name) ? "📂" : "📁"}
              </span>
            </span>
          ) : (
            <span
              className={`w-2.5 h-2.5 rounded-full opacity-80 shrink-0 ${
                node.language === "image"
                  ? "bg-purple-400"
                  : node.language === "markdown"
                    ? "bg-blue-300"
                    : node.language === "prisma"
                      ? "bg-green-400"
                      : node.name.endsWith(".tsx") || node.name.endsWith(".jsx")
                        ? "bg-blue-400"
                        : node.name.endsWith(".js")
                          ? "bg-yellow-400"
                          : "bg-yellow-300"
              }`}
            />
          )}
          <span className="truncate">{node.name}</span>
        </div>

        <AnimatePresence initial={false}>
          {node.children && openFolders.has(node.name) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {renderTree(node.children, depth + 1)}
            </motion.div>
          )}
        </AnimatePresence>
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
                />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-xs text-[#cccccc] font-sans">
                {title} - Visual Studio Code
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center text-[#858585] hover:text-white hover:bg-[#ffffff15] rounded transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden">
              {/* SIDEBAR */}
              <div className="w-64 bg-[#252526] border-r border-[#333] hidden md:flex flex-col shrink-0 overflow-hidden">
                <div className="h-8 px-4 flex items-center text-xs font-bold text-[#bbbbbb] uppercase tracking-wider mt-2 shrink-0">
                  Explorer
                </div>
                <div className="mt-2 overflow-y-auto flex-1 pb-4">
                  <div className="px-4 py-1 text-xs font-bold text-blue-400 uppercase mb-1">
                    PROJECT FILES
                  </div>
                  {renderTree(files)}
                </div>
              </div>

              {/* EDITOR */}
              <div className="flex-1 flex flex-col bg-[#1e1e1e] relative min-w-0 overflow-hidden">
                {activeFile && (
                  <div className="h-9 bg-[#1e1e1e] flex items-center border-b border-[#333] shrink-0 overflow-x-auto">
                    <div className="px-4 h-full bg-[#1e1e1e] border-t-2 border-blue-500 text-white text-sm flex items-center gap-2 min-w-fit">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          activeFile.language === "image"
                            ? "bg-purple-400"
                            : activeFile.language === "markdown"
                              ? "bg-blue-300"
                              : activeFile.language === "prisma"
                                ? "bg-green-400"
                                : activeFile.name.endsWith(".tsx") ||
                                    activeFile.name.endsWith(".jsx")
                                  ? "bg-blue-400"
                                  : activeFile.name.endsWith(".js")
                                    ? "bg-yellow-400"
                                    : "bg-yellow-300"
                        }`}
                      />
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

                <div
                  ref={codeContainerRef}
                  className="flex-1 overflow-auto font-mono text-sm leading-6 relative bg-[#1e1e1e]"
                >
                  {activeFile ? (
                    activeFile.language === "image" ? (
                      <div className="w-full h-full flex items-center justify-center p-10">
                        <img
                          src={activeFile.imageSrc}
                          alt={activeFile.name}
                          className="max-w-full max-h-full object-contain shadow-2xl border border-[#333]"
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-full p-4">
                        <div className="flex flex-col text-right pr-4 text-[#858585] select-none border-r border-[#333] mr-4">
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
                            <span className="inline-block w-2 h-5 bg-white align-middle animate-pulse ml-1" />
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
