"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import VSCodeViewer from "./VSCodeViewer";
import {
  autosellFiles,
  newEcomatiFiles,
  portfolioFiles,
} from "../data/vscode/index";
import { FaCode, FaTerminal } from "react-icons/fa";

const LiveCodeTerminal = ({
  snippets,
}: {
  snippets: { name: string; code: string }[];
}) => {
  const [index, setIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    setDisplayedCode("");
    const currentSnippet = snippets[index];

    const typingInterval = setInterval(() => {
      setDisplayedCode(currentSnippet.code.slice(0, i));
      i++;
      if (i > currentSnippet.code.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % snippets.length);
        }, 4000);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [index, snippets, isInView]);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[320px] bg-[#0d0d0d] rounded-[1.5rem] overflow-hidden border border-[#222] group-hover:border-[#D4AF37]/50 transition-all duration-700 shadow-2xl flex flex-col font-mono"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#161616] border-b border-[#222]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={snippets[index].name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-neutral-500 text-[10px] uppercase tracking-widest flex items-center gap-2"
          >
            <FaTerminal size={10} /> {snippets[index].name}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="p-6 flex-1 overflow-hidden relative">
        <pre className="text-[#ce9178] leading-relaxed text-[11px] md:text-[13px] whitespace-pre">
          <code>
            {displayedCode}
            <span className="animate-pulse bg-[#D4AF37] w-1.5 h-4 inline-block ml-1"></span>
          </code>
        </pre>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60"></div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#D4AF37]/5 backdrop-blur-[1px]">
          <div className="bg-[#1e1e1e] border border-[#333] text-white px-4 py-2 rounded-lg flex items-center gap-3 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <FaCode className="text-[#D4AF37]" />
            <span className="font-bold text-[10px] uppercase tracking-widest">
              Launch Full Editor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const projects = [
  {
    id: 1,
    number: "01",
    title: "Autosell.pl",
    category: "Enterprise Marketplace",
    year: "2024 — 2025",
    description:
      "Full-stack automotive marketplace with real-time WebSocket notifications, advanced search engine with 30+ filters, and professional admin dashboard. Built with React, Node.js, MongoDB, and Socket.IO.",
    tech: ["React 18", "Node.js", "MongoDB", "Socket.IO", "Express", "Redis"],
    snippets: [
      {
        name: "SocketContext.js",
        code: `// Real-time WebSocket connection management
const [socket, setSocket] = useState(null);
const { isAuthenticated, user } = useAuth();
const [isConnected, setIsConnected] = useState(false);

useEffect(() => {
  if (!isAuthenticated) {
    if (notificationService.isConnected()) {
      notificationService.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
    return;
  }

  const initializeSocket = async () => {
    await notificationService.connect();
    const s = notificationService.socket;
    
    if (s) {
      s.on("connect", () => setIsConnected(true));
      s.on("disconnect", () => setIsConnected(false));
      setSocket(s);
    }
  };

  initializeSocket();
}, [isAuthenticated]);`,
      },
      {
        name: "adController.js",
        code: `// Advanced search with scoring algorithm
static async searchAds(req, res, next) {
  const { sortBy = "createdAt", order = "desc" } = req.query;
  const activeFilter = { status: getActiveStatusFilter() };

  const allAds = await Ad.find(activeFilter);

  const adsWithScore = allAds.map((ad) => {
    const match_score = calculateMatchScore(ad, req.query);
    const is_featured = ad.listingType === "wyróżnione" ? 1 : 0;
    return { ...ad.toObject(), match_score, is_featured };
  });

  adsWithScore.sort((a, b) => {
    if (b.is_featured !== a.is_featured)
      return b.is_featured - a.is_featured;
    
    let comparison = 0;
    switch (sortBy) {
      case "price": comparison = (a.price || 0) - (b.price || 0); break;
      case "year": comparison = (a.year || 0) - (b.year || 0); break;
      default: comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    return comparison * (order === "desc" ? -1 : 1);
  });

  res.status(200).json({ ads: adsWithScore });
}`,
      },
    ],
    website: "https://www.autosell.pl",
    github: "https://github.com/Goniek94",
    isInteractive: true,
  },
  {
    id: 2,
    number: "02",
    title: "Ecomati.pl",
    category: "Organic E-Commerce",
    year: "2024 — 2025",
    description:
      "Full-stack organic food e-commerce platform with dynamic product variants, admin dashboard, and Supabase storage. Features shopping cart management, Prisma ORM, and NextAuth authentication.",
    tech: ["Next.js 14", "TypeScript", "Prisma", "PostgreSQL", "NextAuth"],
    snippets: [
      {
        name: "ProductCard.tsx",
        code: `// Dynamic product variants with real-time updates
const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
const currentVariant = product.variants?.[selectedVariantIndex];
const displayPrice = currentVariant?.price || product.price;

const handleQuickAdd = (e: React.MouseEvent) => {
  e.preventDefault();
  addToCart(product, displaySize, 1);
  showToast(\`Dodano: \${product.name}\`);
};`,
      },
      {
        name: "products/route.ts",
        code: `// Admin API with rate limiting
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, limit, remaining } = await checkRateLimit(\`products_\${ip}\`);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const validated = createProductSchema.parse(body);
  
  const product = await prisma.product.create({ data: validated });
  return NextResponse.json(product, { status: 201 });
}`,
      },
    ],
    website: "https://ecomati.pl",
    github: "https://github.com/Goniek94/ecomati",
    isInteractive: true,
  },
  {
    id: 3,
    number: "03",
    title: "Portfolio XP",
    category: "Interactive Portfolio",
    year: "2026",
    description:
      "Windows XP-inspired interactive portfolio with modern animations, 3D globe visualization, and VSCode-style code viewer. Features real-time clock, animated loader, and smooth page transitions.",
    tech: ["Next.js 14", "TypeScript", "Framer Motion", "Three.js"],
    snippets: [
      {
        name: "Hero.tsx",
        code: `// Animated hero with real-time clock
const [time, setTime] = useState("");
const [quoteIndex, setQuoteIndex] = useState(0);

useEffect(() => {
  const updateTime = () => {
    const now = new Date();
    setTime(now.toLocaleTimeString("pl-PL", { hour12: false }));
  };
  updateTime();
  const timer = setInterval(updateTime, 1000);
  return () => clearInterval(timer);
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  }, 5000);
  return () => clearInterval(interval);
}, []);`,
      },
      {
        name: "InitialLoader.tsx",
        code: `// Tech snow animation with particles
const [particles, setParticles] = useState<Array<any>>([]);

useEffect(() => {
  const generated = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    symbol: snowSymbols[Math.floor(Math.random() * snowSymbols.length)],
    size: Math.random() * 14 + 10,
    opacity: Math.random() * 0.3 + 0.05,
  }));
  setParticles(generated);
}, []);`,
      },
    ],
    website: "https://portfolio-xp.vercel.app",
    github: "https://github.com/Goniek94/Portfolio",
    isInteractive: true,
  },
];

export default function Projects() {
  const [isVSCodeOpen, setIsVSCodeOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState(autosellFiles);
  const [currentTitle, setCurrentTitle] = useState("Autosell-Repo");

  const openVSCode = (projectId: number) => {
    if (projectId === 1) {
      setCurrentFiles(autosellFiles);
      setCurrentTitle("Autosell-Repo");
    } else if (projectId === 2) {
      setCurrentFiles(newEcomatiFiles);
      setCurrentTitle("Ecomati-Repo");
    } else if (projectId === 3) {
      setCurrentFiles(portfolioFiles);
      setCurrentTitle("Portfolio-Repo");
    }
    setIsVSCodeOpen(true);
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-[#050505] text-[#e1e1e1] py-32 px-4 md:px-12 overflow-hidden"
    >
      <VSCodeViewer
        isOpen={isVSCodeOpen}
        onClose={() => setIsVSCodeOpen(false)}
        files={currentFiles}
        title={currentTitle}
      />

      <div className="max-w-[1700px] mx-auto relative z-10">
        {/* --- HEADER --- */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[2px] w-16 bg-[#D4AF37]" />
            <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
              Systems & Products
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none mb-8"
          >
            Featured
            <br />
            Projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-500 font-light leading-relaxed"
          >
            Real-world applications built from concept to deployment.
            <br />
            Click any project to explore the source code.
          </motion.p>
        </div>

        {/* --- PROJECTS GRID --- */}
        <div className="flex flex-col gap-24">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group cursor-pointer border border-[#222] p-8 rounded-[2rem] bg-[#0a0a0a] transition-all duration-500 hover:border-[#D4AF37]/60 hover:bg-[#0f0f0f] hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]"
              onClick={() => openVSCode(project.id)}
            >
              {/* LEFT: INFO */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-6 font-mono">
                  <span className="text-6xl font-black text-[#151515] group-hover:text-[#D4AF37] transition-colors duration-700">
                    {project.number}
                  </span>
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-[#222] to-transparent"></div>
                </div>

                <div className="space-y-2">
                  <span className="text-neutral-600 text-xs uppercase tracking-[0.3em] font-bold block">
                    {project.category} • {project.year}
                  </span>
                  <h3 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter transition-colors group-hover:text-[#D4AF37] leading-none">
                    {project.title}
                  </h3>
                </div>

                <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-2 bg-[#050505] border border-[#222] text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest rounded-lg hover:border-[#D4AF37] transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center gap-6 pt-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      className="group/link flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs border-b-2 border-[#D4AF37] pb-2 hover:border-white transition-all"
                    >
                      View Live Site
                      <span className="group-hover/link:translate-x-1 transition-transform">
                        →
                      </span>
                    </a>
                  )}
                  <button
                    onClick={() => openVSCode(project.id)}
                    className="flex items-center gap-2 text-[#4ec9b0] font-mono text-xs uppercase font-black hover:text-white transition-all"
                  >
                    <FaCode size={14} /> Explore Code
                  </button>
                </div>
              </div>

              {/* RIGHT: TERMINAL */}
              <div className="lg:col-span-5 relative h-full">
                <LiveCodeTerminal snippets={project.snippets} />

                {/* Glowing shadow effect */}
                <div className="absolute -z-10 -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute -z-10 -top-4 -right-4 w-full h-full border border-[#D4AF37]/20 rounded-[1.5rem] rotate-2 group-hover:rotate-3 transition-all duration-700"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
