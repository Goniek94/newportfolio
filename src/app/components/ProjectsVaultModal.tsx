"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { FaTimes, FaFolderOpen, FaChevronRight } from "react-icons/fa";

interface ProjectsVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (id: number) => void;
}

export default function ProjectsVaultModal({
  isOpen,
  onClose,
  onSelectProject,
}: ProjectsVaultModalProps) {
  // Zabezpieczenie a11y: Zamknięcie na ESC i blokada scrolla
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#050505] border border-[#D4AF37]/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-[#D4AF37] transition-colors p-2 bg-[#0a0a0a] rounded-full border border-[#1a1a1a] cursor-pointer z-50"
            >
              <FaTimes size={16} />
            </button>

            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-2 flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Select Source
                </h3>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
                  Code <span className="text-[#D4AF37]">Vault</span>
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    name: "Autosell.pl",
                    desc: "Enterprise Marketplace • Node.js, Express, Socket.IO",
                  },
                  {
                    id: 2,
                    name: "Matchdays",
                    desc: "Sports Auction Platform • NestJS, PostgreSQL, Stripe",
                  },
                  {
                    id: 3,
                    name: "Windows XP",
                    desc: "Interactive OS Portfolio • React 19, TypeScript",
                  },
                ].map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj.id)}
                    className="group flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#222] group-hover:border-[#D4AF37]/50 flex items-center justify-center text-neutral-500 group-hover:text-[#D4AF37] transition-colors">
                        <FaFolderOpen size={16} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold group-hover:text-[#D4AF37] transition-colors">
                          {proj.name}
                        </h4>
                        <p className="text-[10px] md:text-xs text-neutral-500 font-mono mt-0.5">
                          {proj.desc}
                        </p>
                      </div>
                    </div>
                    <FaChevronRight className="text-neutral-700 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
