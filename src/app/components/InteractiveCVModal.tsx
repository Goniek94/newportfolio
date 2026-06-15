"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaDownload,
  FaServer,
  FaCodeBranch,
  FaUsers,
  FaLightbulb,
  FaRocket,
  FaShieldAlt,
} from "react-icons/fa";
import { useEffect } from "react";

interface InteractiveCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InteractiveCVModal({
  isOpen,
  onClose,
}: InteractiveCVModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 sm:p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-7xl h-[90vh] md:h-[85vh] bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* --- HEADER --- */}
          <div className="h-20 sm:h-24 bg-[#0f0f0f] border-b border-[#222] flex items-center justify-between px-6 sm:px-10 shrink-0 relative z-20">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
                Mateusz Goszczycki
              </h2>
              <p className="text-[#D4AF37] font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-1">
                Full Stack Software Engineer
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* DESKTOP DOWNLOAD BUTTON */}
              <a
                href="/cv_mateusz.pdf"
                download="Mateusz_Goszczycki_CV.pdf"
                className="hidden sm:flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] transform hover:-translate-y-0.5"
              >
                <FaDownload size={12} /> Download PDF
              </a>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#1a1a1a] hover:bg-[#D4AF37] text-white hover:text-black rounded-full flex items-center justify-center transition-colors border border-[#333] hover:border-transparent"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* MOBILE DOWNLOAD BUTTON */}
          <div className="sm:hidden p-4 border-b border-[#222] bg-[#0a0a0a]">
            <a
              href="/cv_mateusz.pdf"
              download="Mateusz_Goszczycki_CV.pdf"
              className="w-full flex justify-center items-center gap-2 bg-[#D4AF37] text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              <FaDownload size={12} /> Download PDF
            </a>
          </div>

          {/* --- GŁÓWNA TREŚĆ --- */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.2fr] gap-12 lg:gap-20">
              {/* --- LEWA KOLUMNA: FILOZOFIA, KLIENT, STACK --- */}
              <div className="flex flex-col gap-10">
                <section>
                  <h3 className="text-xs font-mono text-[#555] uppercase tracking-[0.3em] mb-4 border-b border-[#222] pb-2 flex items-center gap-2">
                    <FaLightbulb className="text-[#D4AF37]" /> Engineering
                    Philosophy
                  </h3>
                  <p className="text-neutral-400 text-[13px] leading-relaxed font-light">
                    I don&apos;t just write code; I build businesses. My focus is on
                    robust architecture, scalable databases, and seamless user
                    experiences. I believe in choosing the right tool for the
                    job, writing maintainable code, and anticipating bottlenecks
                    before they happen in production.
                  </p>
                </section>

                <section>
                  <h3 className="text-xs font-mono text-[#555] uppercase tracking-[0.3em] mb-4 border-b border-[#222] pb-2 flex items-center gap-2">
                    <FaUsers className="text-[#D4AF37]" /> Client & Product
                    Ownership
                  </h3>
                  <p className="text-neutral-400 text-[13px] leading-relaxed font-light mb-3">
                    Experience in driving projects from zero to one. I
                    specialize in translating vague business requirements into
                    concrete technical specifications.
                  </p>
                  <ul className="text-[12px] text-neutral-400 flex flex-col gap-2 font-light">
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">▹</span>{" "}
                      Requirements gathering & architecture planning
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">▹</span> Transparent
                      communication & sprint estimations
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">▹</span> End-to-end
                      delivery (DB to Deployment)
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xs font-mono text-[#555] uppercase tracking-[0.3em] mb-4 border-b border-[#222] pb-2 flex items-center gap-2">
                    <FaCodeBranch className="text-[#D4AF37]" /> Core Arsenal
                  </h3>
                  <div className="flex flex-col gap-5">
                    <div>
                      <span className="text-white text-xs font-bold uppercase block mb-2">
                        Backend & Architecture
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Node.js",
                          "NestJS",
                          "Express",
                          "Microservices",
                          "REST API",
                          "Socket.IO",
                          "WebSockets",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-[#151515] border border-[#2a2a2a] rounded text-[10px] text-neutral-300 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-white text-xs font-bold uppercase block mb-2">
                        Frontend & State
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "React 18",
                          "Next.js 14",
                          "TypeScript",
                          "Zustand",
                          "TanStack Query",
                          "Tailwind",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-[#151515] border border-[#2a2a2a] rounded text-[10px] text-neutral-300 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-white text-xs font-bold uppercase block mb-2">
                        Data & Infra
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "PostgreSQL",
                          "MongoDB",
                          "Prisma ORM",
                          "Redis",
                          "BullMQ",
                          "Docker",
                          "Linux VPS",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-[#151515] border border-[#2a2a2a] rounded text-[10px] text-neutral-300 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* --- PRAWA KOLUMNA: DOŚWIADCZENIE I PROBLEMY INŻYNIERYJNE --- */}
              <div className="flex flex-col gap-10">
                <section>
                  <h3 className="text-sm font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-8 flex items-center gap-3 border-b border-[#222] pb-4">
                    <FaServer /> Engineering Case Studies & Experience
                  </h3>

                  {/* PROJEKT 1: MATCHDAYS */}
                  <div className="mb-12 relative">
                    <div className="absolute left-[-30px] sm:left-[-40px] top-1.5 w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]" />
                    <div className="absolute left-[-25px] sm:left-[-35px] top-6 w-px h-[105%] bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          Matchdays
                        </h4>
                        <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded text-[10px] font-mono uppercase">
                          Startup / Seed
                        </span>
                      </div>
                      <span className="text-xs font-mono text-neutral-500 tracking-widest">
                        2025 — 2026
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 mb-6 font-light">
                      High-concurrency sports memorabilia auction platform.
                    </p>

                    <div className="bg-[#111] border border-[#222] rounded-xl p-5 sm:p-8 hover:border-[#333] transition-colors">
                      <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <FaRocket className="text-[#D4AF37]" /> The Challenge:
                        Race Conditions & Real-Time Sync
                      </h5>
                      <p className="text-[13px] text-neutral-400 mb-6 leading-relaxed">
                        In a live auction, multiple users can place bids in the
                        exact same millisecond. The system needed a bulletproof
                        way to process bids, reject conflicting ones instantly,
                        and broadcast the new price to all connected clients
                        with sub-100ms latency.
                      </p>
                      <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <FaShieldAlt className="text-green-500" /> Architectural
                        Solution
                      </h5>
                      <ul className="text-[13px] text-neutral-400 leading-relaxed flex flex-col gap-3 font-light">
                        <li>
                          <strong className="text-neutral-200">
                            Concurrency Control:
                          </strong>{" "}
                          Implemented PostgreSQL atomic transactions via Prisma.
                          This guarantees at the database level that only the
                          absolute highest bid is recorded, structurally
                          preventing double-bidding.
                        </li>
                        <li>
                          <strong className="text-neutral-200">
                            WebSocket Engine:
                          </strong>{" "}
                          Architected a NestJS Gateway using isolated Socket.IO
                          rooms. State is synced globally using Redis, ensuring
                          seamless performance across instances.
                        </li>
                        <li>
                          <strong className="text-neutral-200">
                            FinTech & AI:
                          </strong>{" "}
                          Integrated Stripe Connect for automated multi-party
                          payouts (escrow-like logic) and BullMQ background
                          queues to run Google Gemini AI image verifications
                          without blocking the main event loop.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* PROJEKT 2: AUTOSELL */}
                  <div className="mb-12 relative">
                    <div className="absolute left-[-30px] sm:left-[-40px] top-1.5 w-3 h-3 rounded-full bg-neutral-500" />
                    <div className="absolute left-[-25px] sm:left-[-35px] top-6 w-px h-[105%] bg-gradient-to-b from-neutral-500/30 to-transparent" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          Autosell.pl
                        </h4>
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded text-[10px] font-mono uppercase">
                          B2B Client Project
                        </span>
                      </div>
                      <span className="text-xs font-mono text-neutral-500 tracking-widest">
                        2024 — 2025
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 mb-6 font-light">
                      Production automotive marketplace delivered end-to-end.
                    </p>

                    <div className="bg-[#111] border border-[#222] rounded-xl p-5 sm:p-8 hover:border-[#333] transition-colors">
                      <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <FaUsers className="text-[#D4AF37]" /> The Challenge:
                        Client Needs & Data Flexibility
                      </h5>
                      <p className="text-[13px] text-neutral-400 mb-6 leading-relaxed">
                        The client required a highly dynamic platform where
                        vehicles could have dozens of varying, category-specific
                        attributes. I was responsible for the entire lifecycle:
                        gathering requirements, designing the DB, coding the
                        backend/frontend, integrating payments, and deployment.
                      </p>
                      <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <FaCodeBranch className="text-blue-400" /> Architectural
                        Solution
                      </h5>
                      <ul className="text-[13px] text-neutral-400 leading-relaxed flex flex-col gap-3 font-light">
                        <li>
                          <strong className="text-neutral-200">
                            Database Design:
                          </strong>{" "}
                          Chose MongoDB to handle the dynamic schema
                          requirements of diverse vehicle parameters, allowing
                          for a deeply nested, scalable 30+ filter search
                          engine.
                        </li>
                        <li>
                          <strong className="text-neutral-200">
                            Business Logic:
                          </strong>{" "}
                          Integrated the TPay payment gateway for listing
                          monetization, complete with webhook handlers and
                          automated invoice generation.
                        </li>
                        <li>
                          <strong className="text-neutral-200">
                            Production Deployment:
                          </strong>{" "}
                          Dockerized the entire application and deployed it to a
                          Linux VPS (NGINX + PM2), setting up a CI/CD pipeline
                          and ensuring 99.9% uptime for the live business.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* PROJEKT 3: WINDOWS XP */}
                  <div className="mb-4 relative">
                    <div className="absolute left-[-30px] sm:left-[-40px] top-1.5 w-3 h-3 rounded-full bg-neutral-700" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          Windows XP Web OS
                        </h4>
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 rounded text-[10px] font-mono uppercase">
                          Engineering Showcase
                        </span>
                      </div>
                      <span className="text-xs font-mono text-neutral-500 tracking-widest">
                        2026
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 mb-6 font-light">
                      Advanced DOM manipulation and state management.
                    </p>

                    <div className="bg-[#111] border border-[#222] rounded-xl p-5 sm:p-8 hover:border-[#333] transition-colors">
                      <p className="text-[13px] text-neutral-400 leading-relaxed font-light">
                        <strong className="text-white">
                          Why build an OS in a browser?
                        </strong>{" "}
                        To demonstrate profound understanding of React state and
                        browser APIs without relying on external libraries. I
                        engineered a bespoke{" "}
                        <strong className="text-[#D4AF37]">
                          Window Manager
                        </strong>{" "}
                        from scratch that calculates complex z-index stacking,
                        drag-and-drop boundary collisions, and focus states. The
                        project also utilizes the native HTML5 Audio API for a
                        fully functional Winamp clone, proving deep, low-level
                        frontend capabilities.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
