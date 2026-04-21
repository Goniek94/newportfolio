// src/app/data/projects.ts

export type JourneyStep = {
  phase: string;
  title: string;
  description: string;
  duration: string;
};

export type StackCategory = {
  label: string;
  items: string[];
  description?: string; // <--- NOWE POLE NA CASE STUDY
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
  image?: string;
  thumbnail?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    number: "01",
    title: "Autosell.pl",
    nda: true,
    category: "Client Project · Live in Production",
    year: "2024 — 2025",
    image: "/img/autosell (3).png",
    thumbnail: "/img/Lista ogłoszeń.webp",
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
      {
        label: "Frontend Architecture",
        items: ["React 18", "JavaScript", "Tailwind CSS"],
        description:
          "Built for maximum responsiveness and speed. Leveraged React 18 for smooth rendering of complex search filters and dynamic forms without performance bottlenecks.",
      },
      {
        label: "Backend & Database",
        items: ["Node.js", "Express", "MongoDB", "Mongoose", "Socket.IO"],
        description:
          "MongoDB provided the schema flexibility needed for vehicles with hundreds of varying parameters. Socket.io powers the real-time buyer-seller chat system.",
      },
      {
        label: "Auth & Security",
        items: ["JWT", "Helmet", "Role-based Access Control"],
        description:
          "Implemented robust session management using rotating JWTs, role-based access control (RBAC) for admins, and Helmet to prevent common web vulnerabilities.",
      },
      {
        label: "Infrastructure",
        items: ["Supabase", "Sharp", "Jest"],
        description:
          "Supabase acts as a secure storage layer for thousands of vehicle images, which are compressed on-the-fly using Sharp to cut bandwidth costs. Tested heavily with Jest.",
      },
    ],
    journey: [
      {
        phase: "01",
        title: "Client Discovery",
        description: "Ran requirements workshops with the client.",
        duration: "2 weeks",
      },
      {
        phase: "02",
        title: "Backend Design",
        description:
          "Built the Express/MongoDB API with a layered security stack.",
        duration: "6 weeks",
      },
      {
        phase: "03",
        title: "Real-Time & Payments",
        description: "Socket.IO chat and TPay gateway integration.",
        duration: "3 weeks",
      },
      {
        phase: "04",
        title: "Frontend & Admin",
        description: "Built React frontend and moderation dashboard.",
        duration: "4 weeks",
      },
      {
        phase: "05",
        title: "Production",
        description: "Dockerized deployment on Linux VPS.",
        duration: "2 weeks",
      },
    ],
    snippets: [],
    website: "https://www.autosell.pl",
    github: "https://github.com/Goniek94/Autosell_selected_files",
  },
  {
    id: 2,
    number: "02",
    title: "Matchdays",
    nda: false,
    category: "Real-time Auction Platform · High-Concurrency System",
    year: "2025 — 2026",
    image: "/img/Matchdays (2).png",
    thumbnail: "/img/Panel - Admina Dashboard.webp",
    description:
      "A professional-grade auction marketplace for sports memorabilia, engineered to handle high-concurrency bidding wars. Built with a focus on data integrity, real-time synchronization, and automated trust systems.",
    bullets: [
      "Engineered a high-performance Real-Time Bidding Engine using WebSockets, achieving sub-100ms latency for price updates across all connected clients",
      "Implemented a bulletproof concurrency model using Prisma Atomic Transactions to prevent race conditions during simultaneous high-frequency bids",
      "Integrated an AI-powered verification layer using Google Gemini Vision to automatically analyze and flag suspicious or low-quality memorabilia listings",
      "Architected a complex multi-party payment flow with Stripe Connect, handling automated seller onboarding, escrow-like hold periods, and instant payouts",
      "Built a robust background processing system using Redis and Bull queues to handle heavy tasks like AI analysis and automated auction closings without impacting API performance",
    ],
    tech: [
      "Next.js 14",
      "NestJS",
      "PostgreSQL",
      "Socket.IO",
      "Stripe Connect",
      "Google Gemini AI",
      "Redis",
    ],
    stackCategories: [
      {
        label: "Frontend & State",
        items: ["Next.js 14", "TypeScript", "Zustand", "TanStack Query"],
        description:
          "Utilized Next.js 14 App Router for optimized SEO and performance. Zustand was chosen for global state management due to its minimal overhead, enabling lightning-fast 'Optimistic UI' updates during live auctions.",
      },
      {
        label: "Backend & Concurrency",
        items: ["NestJS", "Prisma ORM", "PostgreSQL", "Socket.IO"],
        description:
          "NestJS provides a modular architecture. The core challenge—preventing double-bidding—was solved at the database level using atomic transactions in Prisma, ensuring that only the highest bid is ever recorded, even under extreme load.",
      },
      {
        label: "DevOps & Infrastructure",
        items: ["Redis", "BullMQ", "Docker", "Supabase Storage"],
        description:
          "Redis acts as the backbone for real-time messaging and job queuing. BullMQ manages a distributed task system that handles auction expiry logic and Gemini AI image processing in the background.",
      },
      {
        label: "Integrations & Trust",
        items: ["Stripe Connect", "Google Gemini Vision"],
        description:
          "Leveraged Stripe Connect to build a scalable marketplace infrastructure. Google Gemini Vision provides an automated 'Trust Score' for items by verifying jersey details against known authentic patterns.",
      },
    ],
    journey: [
      {
        phase: "01",
        title: "Architecture & Bid Logic",
        description:
          "Defined the fundamental bidding algorithm. Decided on a room-based WebSocket strategy where each auction is an isolated channel to maximize performance.",
        duration: "3 weeks",
      },
      {
        phase: "02",
        title: "The Bidding Engine",
        description:
          "Developed the core NestJS gateway. This phase focused heavily on edge cases: what happens if a bid arrives at 0.001s before the auction ends? Implemented automatic time extension logic (anti-sniping).",
        duration: "5 weeks",
      },
      {
        phase: "03",
        title: "FinTech & AI Layer",
        description:
          "Integrated Stripe Connect for complex marketplace payouts. Simultaneously implemented the AI verification pipeline using BullMQ to ensure listing quality without blocking the UI.",
        duration: "4 weeks",
      },
      {
        phase: "04",
        title: "Optimization & Stress Testing",
        description:
          "Conducted load testing to ensure the WebSocket server could handle thousands of concurrent bid broadcasts. Optimized PostgreSQL indexes for fast auction filtering.",
        duration: "2 weeks",
      },
    ],
    snippets: [],
    website: "https://www.matchdaysproject.vercel.app",
    github: null,
    codeNote:
      "Core bidding engine and financial logic are private. Architecture diagrams available upon request.",
  },
  {
    id: 3,
    number: "03",
    title: "Windows XP",
    nda: false,
    category: "Interactive Browser OS · Frontend Architecture",
    year: "2026",
    image: "/img/windowxp.png",
    thumbnail: "/img/lights.jpg",
    description:
      "An incredibly complex, interactive simulation of the Windows XP operating system built entirely in the browser. A deep dive into advanced DOM manipulation, custom window management, and native HTML5 APIs.",
    bullets: [
      "Engineered a custom Window Management system from scratch, handling complex drag-and-drop bounding, z-index stacking algorithms, and minimize/maximize states",
      "Recreated functional legacy applications, including a fully operational Winamp player using the HTML5 Audio API and a retro Gadu-Gadu messenger",
      "Developed a deeply nested, globally synchronized state architecture linking the taskbar, system tray, desktop icons, and active window processes",
      "Built a highly authentic boot sequence and custom 'Glitch/Blue Screen' engine using advanced CSS animations and React lifecycles",
      "Implemented a functional File Explorer routing system to showcase portfolio projects within the retro OS environment",
    ],
    tech: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "HTML5 Audio API",
    ],
    stackCategories: [
      {
        label: "Frontend Architecture",
        items: ["Next.js", "React 19", "TypeScript", "Custom Hooks"],
        description:
          "Built as a client-side heavy application. TypeScript was absolutely crucial here to ensure type safety across hundreds of complex OS-level interfaces, such as window coordinates, application states, and taskbar processes.",
      },
      {
        label: "Core Systems",
        items: ["Window Manager", "HTML5 Audio API", "Drag & Drop"],
        description:
          "The crown jewel of the project is the custom Window Manager. Instead of relying on external libraries, I built a bespoke system that natively calculates focus states, draggable boundaries, and window stacking, treating the browser DOM like a real desktop environment.",
      },
      {
        label: "Styling & Animations",
        items: ["Tailwind CSS", "CSS Keyframes", "CSS Variables"],
        description:
          "Tailwind CSS handled the complex, pixel-perfect retro UI grids. The authentic CRT scanlines, matrix rain, and boot glitches were crafted using deeply optimized CSS animations to maintain a strict 60FPS without frame drops.",
      },
    ],
    journey: [
      {
        phase: "01",
        title: "The Boot Sequence & Desktop Grid",
        description:
          "Started by perfectly replicating the iconic boot sequence with sound synchronization. Then, mapped out the desktop grid logic for icon placement and selection state.",
        duration: "1.5 weeks",
      },
      {
        phase: "02",
        title: "Engineering the Window Manager",
        description:
          "The hardest architectural challenge. Built the logic connecting taskbar instances to desktop windows, implementing active focus handling and preventing windows from being dragged outside the viewport.",
        duration: "3 weeks",
      },
      {
        phase: "03",
        title: "Retro Ecosystem (Winamp & Apps)",
        description:
          "Brought the OS to life by building functional applications. Hooked up the HTML5 Audio API to a custom Winamp skin, loaded with an authentic early-2000s playlist.",
        duration: "2 weeks",
      },
      {
        phase: "04",
        title: "The Glitch Engine & Polish",
        description:
          "Added the final 'hacker' vibe by coding custom glitch screens, matrix rain effects, and a fake recovery system, pushing React's rendering performance to the limit.",
        duration: "1.5 weeks",
      },
    ],
    snippets: [],
    website: "https://mateusz-goszczycki-portfolio.vercel.app/",
    github: "https://github.com/Goniek94/Windows_xp",
  },
];
