// Project data types and content for the Projects section

export type JourneyStep = {
  phase: string;
  title: string;
  description: string;
  duration: string;
};

export type StackCategory = {
  label: string;
  items: string[];
};

export type CodeSnippet = {
  name: string;
  code: string;
};

export type Project = {
  id: number;
  number: string;
  title: string;
  nda: boolean;
  category: string;
  year: string;
  description: string;
  bullets?: string[];
  tech: string[];
  stackCategories: StackCategory[];
  journey: JourneyStep[];
  snippets: CodeSnippet[];
  website: string | null;
  github: string | null;
  codeNote?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    number: "01",
    title: "Autosell.pl",
    nda: true,
    category: "Client Project · Live in Production",
    year: "2024 — 2025",
    description:
      "Built and deployed a production automotive marketplace for a paying client, live at autosell.pl and used by real users.",
    bullets: [
      "Delivered the full system end-to-end as a sole developer",
      "Built a search system with 30+ filters that ranks listings by relevance, not just date",
      "Implemented real-time messaging between buyers and sellers, with message history and read receipts",
      "Integrated TPay payment gateway for listing fees",
      "Implemented authentication and basic security features for production use",
      "Wrote integration tests with Jest and Supertest covering search filters, auth, and input validation",
      "Deployed to production using Docker on a Linux VPS",
    ],
    tech: [
      "React 18",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "Docker",
      "Jest",
    ],
    stackCategories: [
      { label: "Frontend", items: ["React 18", "JavaScript", "Tailwind CSS"] },
      {
        label: "Backend",
        items: ["Node.js", "Express", "MongoDB", "Mongoose", "Socket.IO"],
      },
      {
        label: "Auth & Security",
        items: ["JWT", "Helmet", "Role-based Access Control"],
      },
      {
        label: "Infrastructure",
        items: ["Supabase", "Sharp", "Jest"],
      },
    ],
    journey: [
      {
        phase: "01",
        title: "Client Discovery & System Design",
        description:
          "Ran requirements workshops with the client, mapped user flows, and made the first hard call: MongoDB for flexible vehicle schemas, Socket.IO for real-time chat, Express for the API layer. Defined all API contracts before writing a line of code.",
        duration: "2 weeks",
      },
      {
        phase: "02",
        title: "Security-First Backend",
        description:
          "Built the Express/MongoDB API with a layered security stack: JWT rotation, bcrypt + argon2, 2FA TOTP via Speakeasy, account lockout, Helmet headers, MongoDB sanitization. The scoring-based search engine with 30+ filters came next — relevance ranking, not just queries.",
        duration: "6 weeks",
      },
      {
        phase: "03",
        title: "Real-Time Messaging & Payments",
        description:
          "Socket.IO rooms for per-conversation chat with message persistence and read receipts. TPay payment gateway integration for the Polish market — OAuth2 token caching, webhook handling, invoice PDF generation via PDFKit.",
        duration: "3 weeks",
      },
      {
        phase: "04",
        title: "Frontend, Admin & Image Pipeline",
        description:
          "Built the React frontend and a full admin moderation dashboard. Image uploads run through Sharp for compression before landing in Supabase Storage. Multi-channel notifications via Nodemailer, Resend, and Twilio SMS.",
        duration: "4 weeks",
      },
      {
        phase: "05",
        title: "Production Deployment",
        description:
          "Jest test suite covering core business logic. Deployed on Linux VPS with Docker + NGINX + PM2 for zero-downtime restarts. Client accepted delivery. autosell.pl went live.",
        duration: "2 weeks",
      },
    ],
    snippets: [
      {
        name: "SocketContext.js",
        code: `// Real-time WebSocket connection management
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};`,
      },
      {
        name: "adController.js",
        code: `// Advanced search with scoring algorithm
static async searchAds(req, res, next) {
  try {
    const {
      query,
      category,
      priceMin,
      priceMax,
      location,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { status: "active" };

    if (query) {
      filter.$text = { $search: query };
    }
    if (category) filter.category = category;
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    const ads = await Ad.find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({ ads, total: await Ad.countDocuments(filter) });
  } catch (err) {
    next(err);
  }
}`,
      },
    ],
    website: "https://www.autosell.pl",
    github: "https://github.com/Goniek94/Autosell_selected_files",
  },
  {
    id: 2,
    number: "02",
    title: "Matchdays",
    nda: false,
    category: "Personal Project · Seed Round In Progress",
    year: "2025 — 2026",
    description:
      "Built a fullstack marketplace for real-time sports jersey auctions, running live with backend-driven bidding logic.",
    bullets: [
      "Built a real-time bidding system using WebSockets with live price updates",
      "Ensured consistent data handling during simultaneous bids using database transactions",
      "Designed backend API handling auctions, users, and listing logic",
      "Integrated Stripe for seller payouts and payment flows",
      "Implemented AI-based image verification for uploaded items",
      "Used background jobs to process AI checks without blocking user actions",
    ],
    tech: [
      "Next.js 14",
      "TypeScript",
      "NestJS",
      "PostgreSQL",
      "Socket.IO",
      "Stripe",
      "Redis",
    ],
    stackCategories: [
      {
        label: "Frontend",
        items: [
          "Next.js 14",
          "TypeScript",
          "Zustand",
          "TanStack Query",
          "shadcn/ui",
          "Tailwind CSS",
        ],
      },
      {
        label: "Backend",
        items: ["NestJS 10", "Prisma ORM", "PostgreSQL", "Socket.IO"],
      },
      {
        label: "Infrastructure",
        items: ["Redis", "Bull", "Supabase Storage", "Swagger"],
      },
      {
        label: "Integrations",
        items: ["Stripe Connect", "Google Gemini AI"],
      },
    ],
    journey: [
      {
        phase: "01",
        title: "System Design",
        description:
          "Designed the auction engine architecture — WebSocket room strategy, bid transaction model, and Stripe Connect onboarding flow. Defined all API contracts with Swagger.",
        duration: "3 weeks",
      },
      {
        phase: "02",
        title: "Auction Engine",
        description:
          "Built the NestJS WebSocket Gateway with isolated per-auction rooms. Implemented atomic Prisma transactions for bid placement — structurally preventing race conditions.",
        duration: "4 weeks",
      },
      {
        phase: "03",
        title: "AI Verification & Queues",
        description:
          "Integrated Google Gemini Vision for jersey authenticity checks via Bull queues with exponential backoff. Seller flow never blocks — suspicious listings are held automatically.",
        duration: "3 weeks",
      },
      {
        phase: "04",
        title: "Payments & Payouts",
        description:
          "Implemented Stripe Connect for seller onboarding and automated payouts. Built webhook handlers for payment lifecycle events with idempotency keys.",
        duration: "3 weeks",
      },
      {
        phase: "05",
        title: "Frontend & Launch",
        description:
          "Built the Next.js 14 frontend with Zustand for real-time bid state, TanStack Query for server state, and shadcn/ui components. Deployed and opened to real users.",
        duration: "4 weeks",
      },
    ],
    snippets: [
      {
        name: "useAuctionSocket.ts",
        code: `// Custom hook — connects to NestJS WebSocket Gateway
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuctionStore } from "@/store/auctionStore";

let socket: Socket | null = null;

export function useAuctionSocket(auctionId: string) {
  const { updateBid, setConnected } = useAuctionStore();

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token: localStorage.getItem("access_token") },
    });

    // Join isolated auction room
    socket.emit("join_auction", { auctionId });
    socket.on("connect", () => setConnected(true));

    // Sync Zustand store on every incoming bid
    socket.on("bid_placed", (data) => {
      updateBid(auctionId, data.price, data.bidderId);
    });

    return () => {
      socket?.emit("leave_auction", { auctionId });
      socket?.disconnect();
    };
  }, [auctionId]);
}`,
      },
      {
        name: "auctions.service.ts",
        code: `// Bid placement with Prisma transaction — race condition proof
async placeBid(
  auctionId: string,
  bidderId: string,
  amount: number,
): Promise<Auction> {
  return this.prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({
      where: { id: auctionId },
      select: { currentPrice, status, endsAt },
    });

    if (!auction || auction.status !== "ACTIVE") {
      throw new BadRequestException("Auction is not active");
    }
    if (new Date() > auction.endsAt) {
      throw new BadRequestException("Auction has ended");
    }
    if (amount <= auction.currentPrice) {
      throw new BadRequestException("Bid must exceed current price");
    }

    // Atomic update — prevents race conditions
    const updated = await tx.auction.update({
      where: { id: auctionId },
      data: { currentPrice: amount, leadingBidderId: bidderId },
    });

    await tx.bid.create({
      data: { auctionId, bidderId, amount },
    });

    return updated;
  });
}`,
      },
    ],
    website: "https://www.matchdaysproject.vercel.app",
    github: null,
    codeNote:
      "Source code is under investor NDA. Selected architecture samples are available on request.",
  },
  {
    id: 3,
    number: "03",
    title: "Windows XP",
    nda: false,
    category: "Interactive Browser OS · Creative Project",
    year: "2026",
    description:
      "Built an interactive Windows XP-style desktop in the browser to explore advanced UI architecture and state management.",
    bullets: [
      "Developed a custom window manager with dragging, focus handling, and window state (minimize/maximize)",
      "Implemented multiple interactive apps — audio player and messenger — with independent state and shared UI logic",
      "Built complex UI interactions and animations without external libraries",
      "Managed global state and transitions across the full boot-to-desktop experience",
    ],
    tech: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
    ],
    stackCategories: [
      {
        label: "Framework",
        items: ["Next.js 16", "React 19", "TypeScript"],
      },
      {
        label: "Styling",
        items: ["Tailwind CSS v4", "CSS Animations", "Custom Themes"],
      },
      {
        label: "Architecture",
        items: ["Custom Window Manager", "Drag & Drop", "Z-index Stacking"],
      },
    ],
    journey: [
      {
        phase: "01",
        title: "Concept & Boot Sequence",
        description:
          "Designed the Windows XP aesthetic and built the full boot sequence — BIOS screen, loading bar, and desktop reveal animation.",
        duration: "1 week",
      },
      {
        phase: "02",
        title: "Window Manager",
        description:
          "Engineered a custom window management system with z-index stacking, drag-and-drop positioning, minimize/maximize/close state, and taskbar integration.",
        duration: "2 weeks",
      },
      {
        phase: "03",
        title: "Retro Applications",
        description:
          "Recreated classic Windows XP apps: Winamp with audio playback and visualizer, Gadu-Gadu messenger, Minesweeper, and a functional file explorer.",
        duration: "3 weeks",
      },
      {
        phase: "04",
        title: "Polish & Details",
        description:
          "Added authentic XP sounds, right-click context menus, desktop icon drag, screensaver, and the iconic start menu with all its quirks.",
        duration: "1 week",
      },
    ],
    snippets: [
      {
        name: "useWindowManager.ts",
        code: `// Custom window management — z-index, drag, minimize/maximize
import { useState, useCallback } from "react";

export type WindowState = {
  id: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
};

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [zCounter, setZCounter] = useState(100);

  const bringToFront = useCallback((id: string) => {
    setZCounter((z) => z + 1);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter + 1 } : w)),
    );
  }, [zCounter]);

  const minimize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  const maximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    );
  }, []);

  return { windows, bringToFront, minimize, maximize };
}`,
      },
      {
        name: "WinampPlayer.tsx",
        code: `// Retro Winamp audio player with visualizer
import { useRef, useState, useEffect } from "react";

export function WinampPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>(
    Array(20).fill(0),
  );

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVisualizerData(
        Array.from({ length: 20 }, () => Math.random() * 100),
      );
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggle = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying((p) => !p);
  };

  return (
    <div className="winamp-skin">
      <div className="visualizer">
        {visualizerData.map((h, i) => (
          <div key={i} style={{ height: \`\${h}%\` }} className="bar" />
        ))}
      </div>
      <button onClick={toggle}>{isPlaying ? "⏸" : "▶"}</button>
    </div>
  );
}`,
      },
    ],
    website: "https://mateusz-goszczycki-portfolio.vercel.app/",
    github: "https://github.com/Goniek94/Windows_xp",
  },
];
