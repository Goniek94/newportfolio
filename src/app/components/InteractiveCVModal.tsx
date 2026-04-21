"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import {
  FaTimes,
  FaDownload,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaGithub,
  FaCode,
} from "react-icons/fa";

interface InteractiveCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InteractiveCVModal({
  isOpen,
  onClose,
}: InteractiveCVModalProps) {
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
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#050505] border border-[#D4AF37]/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-neutral-500 hover:text-[#D4AF37] transition-colors p-2 bg-[#0a0a0a] rounded-full border border-[#1a1a1a] cursor-pointer z-50"
            >
              <FaTimes size={20} />
            </button>

            <div className="p-6 sm:p-10 md:p-14 space-y-12">
              {/* 1. HEADER */}
              <div className="border-b border-[#1a1a1a] pb-8">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                  Mateusz <span className="text-[#D4AF37]">Goszczycki</span>
                </h2>
                <h3 className="text-xl md:text-2xl text-neutral-300 mt-3 font-light tracking-wide">
                  Full Stack Engineer · 4 Production Applications Shipped
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <FaCalendarAlt className="text-[#D4AF37]" />{" "}
                    <span>Born: 1994</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <FaMapMarkerAlt className="text-[#D4AF37]" />{" "}
                    <span>Łowicz / Warsaw, PL</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <FaBriefcase className="text-[#D4AF37]" />{" "}
                    <span>Mid-Level · Remote OK</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#27c93f]">
                    <span className="w-2 h-2 rounded-full bg-[#27c93f] inline-block shrink-0" />
                    <span>Open to relocation</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-0 gap-y-2 mt-6 pt-6 border-t border-[#1a1a1a]/50 font-mono text-sm">
                  {[
                    {
                      href: "mailto:mateusz.goszczycki1994@gmail.com",
                      label: "mateusz.goszczycki1994@gmail.com",
                      icon: <FaEnvelope />,
                      external: false,
                    },
                    {
                      href: "tel:+48516223029",
                      label: "+48 516 223 029",
                      icon: <FaPhoneAlt />,
                      external: false,
                    },
                    {
                      href: "https://github.com/Goniek94",
                      label: "github.com/Goniek94",
                      icon: <FaGithub />,
                      external: true,
                    },
                    {
                      href: "https://mateuszgoszczyckiportfolio.vercel.app",
                      label: "portfolio",
                      icon: <FaCode />,
                      external: true,
                    },
                  ].map(({ href, label, icon, external }, i) => (
                    <span key={i} className="flex items-center">
                      <span className="text-[#D4AF37] font-black px-2 select-none">
                        -&gt;
                      </span>
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-1.5 text-[#D4AF37] hover:text-white transition-colors bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        {icon} {label}
                      </a>
                    </span>
                  ))}
                  <span className="text-[#D4AF37] font-black px-2 select-none">
                    -&gt;
                  </span>
                  <a
                    href="/Mateusz_Goszczycki_CV.pdf"
                    download="Mateusz_Goszczycki_CV.pdf"
                    className="flex items-center gap-2 text-sm font-bold font-mono text-[#050505] bg-[#D4AF37] hover:bg-white px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  >
                    <FaDownload /> Download PDF
                  </a>
                </div>
              </div>

              {/* 2. PROFILE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section>
                  <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Professional
                    Profile
                  </h3>
                  <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                    I am a Full Stack Engineer who successfully transitioned
                    from a demanding career in gastronomy. Working as a Head
                    Chef and Instructor for individuals with disabilities taught
                    me extreme patience, crisis management, and the ability to
                    lead under pressure. I bring this mature, organized approach
                    to software engineering, taking end-to-end ownership of the
                    applications I build.
                  </p>
                </section>
                <section>
                  <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-4 flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Key
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "End-to-end product ownership — spec to prod",
                      "Client-facing: requirements, feedback loops, trade-off calls",
                      "Async & remote communication — delivered solo for paying clients",
                      "Rapid self-learning under pressure",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm md:text-base text-neutral-300 font-light"
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* 3. TECH STACK */}
              <section>
                <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Tech Stack
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Frontend",
                      tools: [
                        "JavaScript",
                        "TypeScript",
                        "React 18",
                        "Next.js",
                        "Tailwind CSS v4",
                        "Framer Motion",
                      ],
                    },
                    {
                      title: "Backend",
                      tools: [
                        "Node.js",
                        "NestJS",
                        "Express.js",
                        "REST APIs",
                        "Socket.IO",
                        "JWT Auth",
                      ],
                    },
                    {
                      title: "Database",
                      tools: [
                        "PostgreSQL",
                        "MongoDB",
                        "Prisma ORM",
                        "Mongoose",
                        "Redis",
                        "Supabase",
                      ],
                    },
                    {
                      title: "DevOps & Tools",
                      tools: [
                        "Docker",
                        "Git",
                        "Linux VPS",
                        "NGINX",
                        "PM2",
                        "Jest",
                      ],
                    },
                  ].map((category) => (
                    <div key={category.title}>
                      <h4 className="text-neutral-500 font-mono text-xs uppercase mb-3">
                        {category.title}
                      </h4>
                      <div className="flex flex-col gap-2">
                        {category.tools.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-xs font-mono text-neutral-300 flex items-center justify-between group hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all"
                          >
                            {tech}
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] group-hover:bg-[#D4AF37] transition-colors" />
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. PROJECTS */}
              <section>
                <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Projects
                </h3>
                <div className="space-y-10">
                  {/* Matchdays */}
                  <div className="relative pl-6 border-l-2 border-[#D4AF37]/50">
                    <div className="absolute w-3 h-3 bg-[#D4AF37] rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_#D4AF37]" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h4 className="text-white font-bold text-lg md:text-xl">
                        Matchdays{" "}
                        <span className="text-neutral-400 font-normal text-sm ml-2">
                          — Sports Auction Marketplace
                        </span>
                      </h4>
                      <span className="text-[#D4AF37] font-mono text-xs border border-[#D4AF37]/30 px-2 py-1 rounded">
                        2025 — 2026
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        "Next.js 14",
                        "NestJS",
                        "TypeScript",
                        "PostgreSQL",
                        "Prisma ORM",
                        "Socket.IO",
                        "Stripe Connect",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-[#0a0a0a] border border-[#222] rounded text-[9px] md:text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                      Full-stack sports memorabilia auction platform with
                      real-time bidding via{" "}
                      <strong>NestJS WebSocket Gateway</strong>, JWT auth with
                      account lockout, AI-powered jersey verification,{" "}
                      <strong>Stripe Connect</strong> payouts, and a smart
                      listing engine.
                    </p>
                  </div>
                  {/* Autosell */}
                  <div className="relative pl-6 border-l-2 border-[#D4AF37]/50">
                    <div className="absolute w-3 h-3 bg-[#D4AF37] rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_#D4AF37]" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h4 className="text-white font-bold text-lg md:text-xl">
                        Autosell.pl{" "}
                        <span className="text-neutral-400 font-normal text-sm ml-2">
                          — Automotive Marketplace
                        </span>
                      </h4>
                      <span className="text-[#D4AF37] font-mono text-xs border border-[#D4AF37]/30 px-2 py-1 rounded">
                        2024
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        "React 18",
                        "Node.js",
                        "Express",
                        "MongoDB",
                        "Socket.IO",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-[#0a0a0a] border border-[#222] rounded text-[9px] md:text-[10px] font-mono text-[#D4AF37]/80 uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                      Built an end-to-end production vehicle marketplace for a
                      client. Gathered requirements, managed feedback, and
                      delivered a scalable platform. Implemented real-time
                      messaging using <strong>Socket.IO</strong>.
                    </p>
                  </div>
                </div>
              </section>

              {/* 5. EXPERIENCE */}
              <section>
                <h3 className="text-xs font-mono text-[#D4AF37] tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-[#D4AF37]/50" /> Work
                  Experience
                </h3>
                <div className="space-y-10">
                  <div className="relative pl-6 border-l-2 border-[#1a1a1a]">
                    <div className="absolute w-3 h-3 bg-[#333] rounded-full -left-[7px] top-1.5" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-neutral-300 font-bold text-lg md:text-xl">
                        Freelance Full Stack Engineer
                      </h4>
                      <span className="text-neutral-600 font-mono text-xs border border-[#1a1a1a] px-2 py-1 rounded">
                        2023 - Present
                      </span>
                    </div>
                    <p className="text-neutral-500 text-sm font-mono mb-3">
                      Client Collaboration (Remote)
                    </p>
                    <p className="text-neutral-400 text-sm md:text-base leading-relaxed mt-2">
                      2+ years delivering production systems for paying clients
                      — full ownership from requirements gathering through
                      architecture, iterative feedback loops, and zero-downtime
                      deployment.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
