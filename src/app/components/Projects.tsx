"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VSCodeViewer from "./VSCodeViewer";
import {
  autosellFiles,
  matchdaysFiles,
  windowsXpFiles,
} from "../data/vscode/index";
import { FaCode, FaTerminal, FaLock, FaUnlock } from "react-icons/fa";

// ─────────────────────────────────────────────
// CODE PANEL
// ─────────────────────────────────────────────
const CodePanel = ({
  snippets,
  onOpen,
}: {
  snippets: { name: string; code: string }[];
  onOpen: () => void;
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setScanLine((p) => (p + 1) % 100);
    }, 30);
    return () => clearInterval(id);
  }, []);

  const handleUnlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unlocked || scanning) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setUnlocked(true);
      onOpen();
    }, 1800);
  };

  const files = snippets.map((s) => s.name);

  return (
    <div className="relative h-full min-h-[340px] bg-[#080808] rounded-[1.5rem] overflow-hidden border border-[#1a1a1a] group-hover:border-[#D4AF37]/40 transition-all duration-700 shadow-2xl flex flex-col font-mono">
      {/* Scanline grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, #D4AF37 2px, #D4AF37 3px)",
        }}
      />

      {/* Moving scan beam */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-[2px] z-20 transition-none"
        style={{
          top: `${scanLine}%`,
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), rgba(212,175,55,0.5), rgba(212,175,55,0.15), transparent)",
          boxShadow: "0 0 12px 2px rgba(212,175,55,0.2)",
        }}
      />

      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0f0f0f] border-b border-[#1a1a1a] shrink-0 relative z-30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[#444] text-[10px] uppercase tracking-[0.25em] flex items-center gap-2">
          <FaTerminal size={9} />
          SOURCE_VAULT
        </span>
        <div className="w-12" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-6 gap-4 relative z-30">
        {/* File list */}
        <div
          className="flex flex-col gap-2 transition-all duration-700"
          style={{
            filter: unlocked ? "none" : "blur(4px)",
            opacity: unlocked ? 1 : 0.4,
          }}
        >
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#111] border border-[#1e1e1e]"
            >
              <span
                className={`w-2 h-2 rounded-full opacity-70 shrink-0 ${
                  f.endsWith(".tsx") || f.endsWith(".jsx")
                    ? "bg-blue-400"
                    : f.endsWith(".js")
                      ? "bg-yellow-400"
                      : f.endsWith(".ts")
                        ? "bg-yellow-300"
                        : "bg-[#D4AF37]"
                }`}
              />
              <span className="text-[#888] text-xs tracking-wide">{f}</span>
              <div className="flex-1 h-px bg-[#1e1e1e]" />
              <span className="text-[10px] text-[#333] uppercase tracking-widest">
                {unlocked ? "ready" : "locked"}
              </span>
            </div>
          ))}
          {[...Array(Math.max(0, 3 - files.length))].map((_, i) => (
            <div
              key={`fake-${i}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#161616]"
            >
              <span className="w-2 h-2 rounded-full bg-[#222] shrink-0" />
              <div className="h-2 bg-[#1a1a1a] rounded flex-1" />
            </div>
          ))}
        </div>

        {/* CTA center */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-2">
          <AnimatePresence mode="wait">
            {scanning ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative w-14 h-14">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="150"
                      animate={{ strokeDashoffset: [150, 0] }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                    />
                  </svg>
                  <FaCode
                    className="absolute inset-0 m-auto text-[#D4AF37]"
                    size={18}
                  />
                </div>
                <span className="text-[#D4AF37] text-[11px] uppercase tracking-[0.3em] animate-pulse">
                  Authenticating...
                </span>
              </motion.div>
            ) : unlocked ? (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-full border border-[#27c93f]/40 flex items-center justify-center bg-[#27c93f]/10">
                  <FaUnlock className="text-[#27c93f]" size={20} />
                </div>
                <span className="text-[#27c93f] text-[11px] uppercase tracking-[0.3em]">
                  Access Granted
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-[#27c93f]/10 border border-[#27c93f]/40 rounded-lg hover:bg-[#27c93f]/20 hover:border-[#27c93f] transition-all duration-300"
                >
                  <FaCode size={12} className="text-[#27c93f]" />
                  <span className="text-[#27c93f] text-[11px] font-black uppercase tracking-widest">
                    View Source
                  </span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="locked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 cursor-pointer"
                onClick={handleUnlock}
              >
                <div className="w-14 h-14 rounded-full border border-[#D4AF37]/20 flex items-center justify-center bg-[#D4AF37]/5 group-hover:border-[#D4AF37]/50 transition-colors duration-500">
                  <FaLock
                    className="text-[#D4AF37]/60 group-hover:text-[#D4AF37] transition-colors duration-500"
                    size={20}
                  />
                </div>
                <span className="text-[#555] text-[11px] uppercase tracking-[0.3em]">
                  Classified
                </span>
                <div className="flex items-center gap-2 px-5 py-2 border border-[#D4AF37]/30 rounded-lg group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/5 transition-all duration-300">
                  <span className="text-[#D4AF37]/60 group-hover:text-[#D4AF37] text-[11px] font-black uppercase tracking-widest transition-colors duration-300">
                    Unlock Access
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-[#333] text-[9px] uppercase tracking-widest pt-2 border-t border-[#111]">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                unlocked
                  ? "bg-[#27c93f]"
                  : scanning
                    ? "bg-[#D4AF37] animate-pulse"
                    : "bg-[#ff5f56]"
              }`}
            />
            {unlocked ? "Secure" : scanning ? "Verifying" : "Protected"}
          </span>
          <span>{files.length} files</span>
          <span>AES-256</span>
        </div>
      </div>

      {/* Gold corner accents */}
      <div className="pointer-events-none absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/30 rounded-tl-[1.5rem]" />
      <div className="pointer-events-none absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/30 rounded-tr-[1.5rem]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/30 rounded-bl-[1.5rem]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/30 rounded-br-[1.5rem]" />
    </div>
  );
};

// ─────────────────────────────────────────────
// PROJECTS DATA — rewritten with professional tone
// ─────────────────────────────────────────────
const projects = [
  {
    id: 1,
    number: "01",
    title: "Autosell.pl",
    nda: true,
    category: "Enterprise Marketplace",
    year: "2024 — 2025",
    description:
      "Designed and delivered a production automotive marketplace for a client, taking full ownership from requirements gathering through architecture, development, and deployment. Implemented real-time messaging via Socket.IO, a scoring-based search engine with 30+ configurable filters, secure JWT authentication with role-based access control, a full admin dashboard, image processing via Sharp, and comprehensive test coverage with Jest. A separate commercial project was also delivered under NDA during the same period.",
    tech: [
      "React 18",
      "JavaScript",
      "Tailwind CSS",
      "REST API",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Socket.IO",
      "JWT",
      "Supabase",
      "Helmet",
      "Sharp",
      "Jest",
    ],
    snippets: [
      {
        name: "SocketContext.js",
        code: `// Real-time WebSocket connection management
const [socket, setSocket] = useState(null);
const { isAuthenticated, user } = useAuth();
const [isConnected, setIsConnected] = useState(false);`,
      },
      {
        name: "adController.js",
        code: `// Advanced search with scoring algorithm
static async searchAds(req, res, next) {
  const { sortBy = "createdAt", order = "desc" } = req.query;
}`,
      },
    ],
    website: "https://www.autosell.pl",
    github: "https://github.com/Goniek94/Autosell_selected_files",
    isInteractive: true,
  },
  {
    id: 2,
    number: "02",
    title: "Matchdays",
    nda: false,
    category: "Sports Auction Marketplace",
    year: "2025 — 2026",
    description:
      "Architected and built a full-stack sports memorabilia auction platform from the ground up. Engineered a real-time bidding system using NestJS WebSocket Gateway with isolated per-auction rooms and atomic Prisma transactions to prevent race conditions. Implemented a multi-step listing form with API-driven auto-fill for team, league, and season data. Integrated Google Gemini for AI-powered jersey authenticity verification, Stripe Connect for seller payouts, and Redis-backed Bull queues for background job processing. The platform is live and open to real users. Demo credentials are available directly in the login modal.",
    tech: [
      "Next.js 14",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "Axios",
      "Socket.IO",
      "shadcn/ui",
      "Tailwind CSS",
      "NestJS 10",
      "Prisma ORM",
      "PostgreSQL",
      "Redis",
      "Bull",
      "Supabase Storage",
      "Swagger",
    ],
    snippets: [
      {
        name: "useAuctionSocket.ts",
        code: `// Custom hook — connects to NestJS WebSocket Gateway
export function useAuctionSocket(auctionId: string) {
  const { updateBid, setConnected } = useAuctionStore();
  // Joins auction room, syncs Zustand on every bid
}`,
      },
      {
        name: "auctions.service.ts",
        code: `// Bid placement with Prisma transaction
async placeBid(auctionId: string, bidderId: string, amount: number) {
  return this.prisma.$transaction(async (tx) => {
    // Atomic update — prevents race conditions
  });
}`,
      },
    ],
    website: "https://www.matchdaysproject.vercel.app",
    github: null,
    codeNote:
      "Source code is under investor NDA. Selected architecture samples are available on request.",
    isInteractive: true,
  },
  {
    id: 3,
    number: "03",
    title: "Windows XP",
    nda: false,
    category: "Interactive OS Portfolio",
    year: "2026",
    description:
      "Designed and built a fully functional Windows XP simulation as an interactive portfolio experience. Engineered a custom window manager with z-index stacking, drag-and-drop positioning, and minimize/maximize state. Implemented a complete boot sequence and recreated retro applications including Winamp and Gadu-Gadu. Demonstrates advanced React state management, complex component composition, and creative UI architecture.",
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "CSS Animations",
    ],
    snippets: [
      {
        name: "useWindowManager.ts",
        code: `// Custom window management logic
const [windows, setWindows] = useState<WindowState[]>([]);
const bringToFront = (id: string) => updateZIndex(id);`,
      },
      {
        name: "WinampPlayer.tsx",
        code: `// Retro audio player with playback state
const { play, pause, currentTrack } = useAudioContext();
const [visualizerData, setVisualizerData] = useState([]);`,
      },
    ],
    website: "https://mateusz-goszczycki-portfolio.vercel.app/",
    github: "https://github.com/Goniek94/Windows_xp",
    isInteractive: true,
  },
];

// ─────────────────────────────────────────────
// CASE STUDY DATA
// ─────────────────────────────────────────────
const caseStudy = {
  project: "Matchdays — Sports Auction Platform",
  sections: [
    {
      label: "Challenge",
      icon: "🎯",
      content:
        "Design and build a real-time auction platform for sports memorabilia that handles concurrent bidding from multiple users without data inconsistencies, while integrating AI-powered product verification and a full payment infrastructure for marketplace sellers.",
    },
    {
      label: "Architecture",
      icon: "🏗️",
      content:
        "Separated concerns into a Next.js 14 frontend with Zustand for client state and TanStack Query for server state, backed by a NestJS monolith exposing both REST and WebSocket endpoints. PostgreSQL with Prisma ORM handles relational data. Redis and Bull manage background jobs and auction expiry timers.",
    },
    {
      label: "Real-time bidding",
      icon: "⚡",
      content:
        "Implemented a NestJS WebSocket Gateway where each auction occupies an isolated room. Bid placement uses a Prisma database transaction to atomically validate the amount, update the current price, and broadcast the new state to all connected clients — eliminating race conditions under concurrent load.",
    },
    {
      label: "AI verification",
      icon: "🤖",
      content:
        "Integrated Google Gemini Vision API into the listing creation flow. When a seller uploads a jersey photo, the system sends it to Gemini for authenticity analysis and returns a structured confidence score. Listings flagged as suspicious are held for manual review before going live.",
    },
    {
      label: "Payments",
      icon: "💳",
      content:
        "Implemented Stripe Connect for marketplace payouts. Sellers complete an onboarding flow to create a connected account. When an auction closes, funds are held and released to the seller via a webhook-driven state machine that tracks payment confirmation before transferring.",
    },
    {
      label: "Outcome",
      icon: "✅",
      content:
        "Delivered a fully operational platform live at matchdaysproject.vercel.app. The system handles real users, real auctions, and real payments. The architecture is modular and designed to support horizontal scaling as user volume grows.",
    },
  ],
};

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function Projects() {
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState(autosellFiles);
  const [currentTitle, setCurrentTitle] = useState("Autosell-Repo");

  const openVSCode = (projectId: number) => {
    if (projectId === 1) {
      setCurrentFiles(autosellFiles);
      setCurrentTitle("Autosell-Repo");
    } else if (projectId === 2) {
      setCurrentFiles(matchdaysFiles);
      setCurrentTitle("Matchdays-Repo");
    } else if (projectId === 3) {
      setCurrentFiles(windowsXpFiles);
      setCurrentTitle("Windows-XP-Repo");
    }
    setIsVSCodeOpen(true);
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-[#050505] text-[#e1e1e1] py-14 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden"
    >
      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={currentFiles}
        title={currentTitle}
      />

      <div className="max-w-[1700px] mx-auto relative z-10">
        {/* HEADER */}
        <div className="mb-10 md:mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left */}
          <div className="lg:col-span-5 space-y-5 md:space-y-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-[2px] w-10 md:w-16 bg-[#D4AF37] shrink-0" />
              <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] md:tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
                Systems & Products
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-white uppercase leading-none">
              Featured
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                Projects
              </span>
            </h2>
          </div>

          {/* Right */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 flex flex-col justify-between h-full">
            <div className="space-y-3 md:space-y-4">
              <p className="text-fluid-h3 text-neutral-300 font-light leading-relaxed border-l-4 border-[#D4AF37] pl-5 md:pl-8">
                Production applications built{" "}
                <span className="text-white font-semibold">
                  from concept to deployment
                </span>
                .
              </p>
              <p className="text-neutral-500 text-fluid-base leading-relaxed pl-5 md:pl-8">
                Every project is production-grade with live users, real data,
                and working payments. Click any card to explore the source code.
              </p>
            </div>

            {/* Quote */}
            <div className="relative pl-5 md:pl-8 pt-4 md:pt-6 border-t border-[#1a1a1a]">
              <span className="absolute -top-5 left-5 md:left-8 text-[#D4AF37]/15 text-6xl md:text-7xl font-serif leading-none select-none">
                &ldquo;
              </span>
              <p className="text-neutral-400 text-fluid-lg italic font-light leading-relaxed">
                Every problem has a solution. And if there is no solution, then
                perhaps it was never a problem to begin with.
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-12 md:mb-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { value: "3", label: "Production Apps", sub: "shipped solo" },
            {
              value: "12mo",
              label: "Time to MVP",
              sub: "enterprise marketplace",
            },
            { value: "100%", label: "Solo Built", sub: "design to deploy" },
            {
              value: "2+",
              label: "Years Commercial",
              sub: "client projects delivered",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:border-[#D4AF37]/40 transition-colors duration-500"
            >
              <div className="text-3xl md:text-5xl font-black text-[#D4AF37] tracking-tighter leading-none mb-1 md:mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-bold text-white uppercase tracking-wider mb-0.5">
                {stat.label}
              </div>
              <div className="text-[10px] md:text-xs text-neutral-500 font-mono">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* PROJECTS LIST */}
        <div className="flex flex-col gap-12 md:gap-24">
          {projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-center group cursor-pointer border border-[#222] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#0a0a0a] transition-all duration-500 hover:border-[#D4AF37]/60 hover:bg-[#0f0f0f] hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]"
              onClick={() => openVSCode(project.id)}
            >
              {/* LEFT: INFO */}
              <div className="lg:col-span-7 space-y-4 md:space-y-6">
                <div className="flex items-center gap-4 md:gap-6 font-mono">
                  <span className="text-4xl md:text-6xl font-black text-[#151515] group-hover:text-[#D4AF37] transition-colors duration-700">
                    {project.number}
                  </span>
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-[#222] to-transparent" />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <span className="text-neutral-600 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block">
                    {project.category} · {project.year}
                  </span>
                  <h3 className="flex flex-wrap items-center gap-2 md:gap-3 text-fluid-h2 font-black text-white uppercase tracking-tighter transition-colors group-hover:text-[#D4AF37] leading-none">
                    {project.title}
                    {project.nda && (
                      <span className="text-xs md:text-sm font-mono font-black tracking-widest bg-red-600 text-white px-2 py-1 rounded align-middle self-center">
                        NDA
                      </span>
                    )}
                  </h3>
                </div>

                <p className="text-neutral-400 text-fluid-base leading-relaxed max-w-2xl font-light">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-2 md:pt-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 md:px-4 py-1.5 md:py-2 bg-[#050505] border border-[#222] text-[9px] md:text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest rounded-lg hover:border-[#D4AF37] transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div
                  className="flex flex-col gap-3 pt-3 md:pt-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        className="group/link flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] md:text-xs border-b-2 border-[#D4AF37] pb-1.5 md:pb-2 hover:border-white transition-all"
                      >
                        View Live Site
                        <span className="group-hover/link:translate-x-1 transition-transform">
                          →
                        </span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] md:text-xs border-b-2 border-[#D4AF37] pb-1.5 md:pb-2 hover:border-white transition-all"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current shrink-0"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        View on GitHub
                        <span className="group-hover/link:translate-x-1 transition-transform">
                          →
                        </span>
                      </a>
                    )}
                  </div>
                  {"codeNote" in project && project.codeNote && (
                    <p className="text-[10px] md:text-xs text-neutral-600 font-mono italic border-l-2 border-[#D4AF37]/20 pl-3">
                      🔒 {project.codeNote}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT: CODE PANEL */}
              <div className="lg:col-span-5 relative h-full">
                <CodePanel
                  snippets={project.snippets}
                  onOpen={() => openVSCode(project.id)}
                />
                <div className="absolute -z-10 -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute -z-10 -top-4 -right-4 w-full h-full border border-[#D4AF37]/20 rounded-[1.5rem] rotate-2 group-hover:rotate-3 transition-all duration-700 hidden md:block" />
              </div>
            </div>
          ))}
        </div>

        {/* ─────────────────────────────────────────────
            CASE STUDY SECTION
        ───────────────────────────────────────────── */}
        <div className="mt-20 md:mt-32 pt-12 md:pt-16">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10 md:mb-14">
            <div className="h-[2px] w-10 md:w-16 bg-[#D4AF37] shrink-0" />
            <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
              Selected Project
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Left: title */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
                Case{" "}
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "2px #D4AF37" }}
                >
                  Study
                </span>
              </h2>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light">
                A technical breakdown of the most architecturally complex
                project in this portfolio.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-xl">
                <div className="w-2 h-2 bg-[#27c93f] rounded-full animate-pulse" />
                <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest">
                  {caseStudy.project}
                </span>
              </div>
            </div>

            {/* Right: sections grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {caseStudy.sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="group relative p-5 md:p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#D4AF37]/40 hover:bg-[#0d0d0d] transition-all duration-500 overflow-hidden"
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/10 group-hover:border-[#D4AF37]/40 rounded-tr-2xl transition-colors duration-500" />

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{section.icon}</span>
                      <h4 className="text-white font-black text-sm uppercase tracking-tight">
                        {section.label}
                      </h4>
                    </div>
                    <p className="text-neutral-500 text-sm leading-relaxed font-light group-hover:text-neutral-400 transition-colors duration-300">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
