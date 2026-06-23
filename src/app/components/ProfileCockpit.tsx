"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useIsTouch } from "../hooks/useIsTouch";
import { projects } from "../data/projects";

/* ────────────────────────────────────────────────────────────
   PROFILE = the cockpit you step into after the loader lands.
   Max Payne noir "case file" rendered on a spaceship cockpit HUD.
   The loader flew you home ("Welcome home") — now the dossier opens.
   Self-contained drop-in section (id="about").
   ──────────────────────────────────────────────────────────── */

const encode = (s: string) => s.replace(/ /g, "%20");

const work = [
  "Real-time systems — WebSocket auctions, Socket.IO rooms, atomic transactions.",
  "Payment rails — Stripe Connect onboarding, escrow payouts, webhook state machines.",
  "AI pipelines — Gemini Vision on Bull queues; the user flow never blocks.",
];

const arsenal = [
  "TypeScript", "Next.js", "React", "Node.js", "NestJS", "PostgreSQL",
  "Prisma", "Socket.IO", "Redis", "Docker", "NGINX", "Stripe",
];

const caseStaysOpen = ["Always learning.", "Always building.", "Always one step ahead."];

const rainLines = [
  "await prisma.$transaction(async (tx) => {",
  "  const top = await tx.bid.findFirst({ orderBy: { amount: 'desc' } });",
  "  if (next <= top.amount) throw new ConflictException('outbid');",
  "  io.to(`auction:${id}`).emit('bid:new', bid);",
  "});",
  "stripe.transfers.create({ amount, destination: seller });",
  "const verdict = await gemini.verify(images);",
];

// Deterministic dust motes (no Math.random → no hydration drift)
const DUST = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61.7) % 100,
  top: (i * 37.3) % 100,
  size: 1 + ((i * 7) % 3),
  dur: 9 + ((i * 13) % 11),
  delay: (i * 1.7) % 6,
  drift: i % 2 === 0 ? 18 : -18,
}));

function DreamLayer() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {DUST.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#D4AF37]"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            filter: "blur(0.5px)",
            boxShadow: "0 0 8px rgba(212,175,55,0.6)",
          }}
          animate={{ y: [0, d.drift, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function GrainOverlay() {
  const noise =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter>
        <rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/>
      </svg>`,
    );
  return (
    <div
      aria-hidden
      className="noir-grain pointer-events-none absolute inset-[-30%] z-30 opacity-[0.06] mix-blend-overlay"
      style={{ backgroundImage: `url("${noise}")`, backgroundRepeat: "repeat" }}
    />
  );
}

// HUD corner brackets (callback to the loader cockpit)
function HudCorners({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {(
        [
          "top-0 left-0 border-t-2 border-l-2",
          "top-0 right-0 border-t-2 border-r-2",
          "bottom-0 left-0 border-b-2 border-l-2",
          "bottom-0 right-0 border-b-2 border-r-2",
        ] as const
      ).map((c) => (
        <span key={c} className={`absolute h-4 w-4 border-[#D4AF37]/50 ${c}`} />
      ))}
    </div>
  );
}

// Taped noir case-note (cream paper, dark serif ink)
function TapeNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative border border-black/30 bg-[#e7d9b6] px-4 py-3 shadow-[5px_5px_0_rgba(0,0,0,0.5)] ${className}`}
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <span className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 -rotate-2 bg-[#D4AF37]/25 mix-blend-screen" />
      <p className="text-[13px] italic leading-snug text-[#1a1206]">{children}</p>
    </div>
  );
}

// Instrument panel shell: HUD label tab + corner ticks
function HudPanel({
  label,
  children,
  className = "",
  delay = 0,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden border border-[#D4AF37]/25 bg-[#070604]/90 ${className}`}
    >
      <div className="absolute left-0 top-0 z-20 flex items-center gap-2 border-b border-r border-[#D4AF37]/25 bg-[#0c0a06] px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#27c93f] shadow-[0_0_6px_#27c93f]" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/80">{label}</span>
      </div>
      <HudCorners />
      <div className="pointer-events-none absolute inset-0 z-10 border border-[#D4AF37]/0 transition-colors duration-500 group-hover:border-[#D4AF37]/30" />
      {children}
    </motion.div>
  );
}

function Stamp({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 border border-[#D4AF37]/30 bg-black/40 px-4 py-2 text-center">
      <span className="font-mono text-2xl font-black leading-none text-[#D4AF37]">{value}</span>
      <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-neutral-500">{label}</span>
    </div>
  );
}

// ── Top cockpit nav bar ───────────────────────────────────────
function TopNav() {
  const links = [
    ["About", "#about"],
    ["Work", "#work"],
    ["Case Files", "#about"],
    ["Contact", "#contact"],
  ] as const;
  return (
    <div className="relative z-20 flex items-center justify-between border-b border-[#D4AF37]/20 py-4">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center border border-[#D4AF37] font-mono text-[13px] font-black text-[#D4AF37]">
          MG
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white md:text-sm">
          Mateusz Goszczycki
        </span>
      </div>
      <nav className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.25em] md:gap-7 md:text-[11px]">
        {links.map(([l, href]) => (
          <a key={l} href={href} className="hidden text-neutral-400 transition-colors hover:text-[#D4AF37] sm:inline">
            {l}
          </a>
        ))}
        <a
          href="#contact"
          className="flex items-center gap-2 border border-[#D4AF37]/40 px-4 py-2 text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
        >
          Open Dossier <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
        </a>
      </nav>
    </div>
  );
}

// ── Side telemetry rails ──────────────────────────────────────
function RailReadout({ label, value }: { label: string; value: string }) {
  return (
    <div className="leading-tight">
      <div className="text-[8px] text-neutral-600">{label}</div>
      <div className="text-[10px] text-[#D4AF37]/80">{value}</div>
    </div>
  );
}

function LeftRail() {
  return (
    <div className="absolute left-0 top-0 bottom-0 z-20 hidden w-16 flex-col items-start gap-7 border-r border-[#D4AF37]/15 px-3 py-8 font-mono uppercase tracking-[0.2em] lg:flex">
      <div className="text-[9px] leading-tight text-[#27c93f]">SYS<br />ONLINE</div>
      <span className="text-[#D4AF37]/40">+</span>
      <RailReadout label="LAT" value="51.10° N" />
      <RailReadout label="LON" value="19.95° E" />
      <RailReadout label="ALT" value="408 KM" />
      <div className="mt-auto text-[9px] leading-tight text-neutral-600">ORBIT<br />STABLE</div>
    </div>
  );
}

function RightRail() {
  const ticks = ["10", "05", "00", "-05", "-10"];
  return (
    <div className="absolute right-0 top-0 bottom-0 z-20 hidden w-16 flex-col items-end gap-6 border-l border-[#D4AF37]/15 px-3 py-8 font-mono uppercase tracking-[0.2em] lg:flex">
      <div className="text-right text-[9px] leading-tight text-[#D4AF37]/70">COMMS<br />ENCRYPTED</div>
      <div className="flex flex-1 flex-col justify-center gap-3 text-[9px] text-neutral-600">
        {ticks.map((t, i) => (
          <div key={t} className="flex items-center justify-end gap-2">
            {i === 2 && <span className="text-[#D4AF37]">▶</span>}
            <span className={i === 2 ? "text-[#D4AF37]" : ""}>{t}</span>
            <span className="h-px w-4 bg-[#D4AF37]/30" />
          </div>
        ))}
      </div>
      <div className="text-right text-[9px] leading-tight text-neutral-600">LOG<br />AUTO SAVE</div>
    </div>
  );
}

function OrbitDiagram() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 text-[#D4AF37]">
      <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="40" cy="40" r="3" fill="currentColor" />
      <circle cx="70" cy="40" r="2.5" fill="currentColor">
        <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="14s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ── Cockpit viewport — cycles through projects → subject file ──
type Feed = { tag: string; title: string; sub: string; text: string; img: string };

const FEEDS: Feed[] = [
  ...projects.map((p) => ({
    tag: `Case File · ${p.year}`,
    title: p.title,
    sub: p.category,
    text: p.description,
    img: encode(p.image ?? "/img/Ziemia.png"),
  })),
  {
    tag: "Subject File",
    title: "M. Goszczycki",
    sub: "Full-stack engineer · Łowicz / Warsaw",
    text: "Two years from zero to shipping. One commercial client, one investor NDA, three production apps — schema to prod, all solo.",
    img: "/img/Ziemia.png",
  },
];

function CockpitWindow() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const feed = FEEDS[i];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % FEEDS.length), 4800);
    return () => clearInterval(id);
  }, [paused]);

  const go = (n: number) => setI((n + FEEDS.length) % FEEDS.length);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative aspect-[16/10] w-full overflow-hidden border-2 border-[#D4AF37]/30 bg-black shadow-[0_0_50px_rgba(0,0,0,0.7)]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${feed.img}")` }}
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
      <div className="hud-scanlines pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-full w-px bg-[#D4AF37]/10" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-[#D4AF37]/10" />
      </div>
      <HudCorners className="z-20" />

      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-[#D4AF37]/20 bg-black/40 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.25em] backdrop-blur-sm">
        <span className="flex items-center gap-2 text-[#D4AF37]/80">
          <span className="hud-blink text-[#27c93f]">●</span> Viewport · Feed
          {` ${String(i + 1).padStart(2, "0")}/${String(FEEDS.length).padStart(2, "0")}`}
        </span>
        <span className="text-neutral-400">{feed.tag}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 p-5 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/70">{feed.sub}</div>
            <h3 className="mt-1 text-2xl md:text-3xl font-black uppercase tracking-tight text-white">{feed.title}</h3>
            <p className="mt-1.5 max-w-md text-[12.5px] leading-snug text-neutral-300 line-clamp-2">{feed.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(i - 1)}
            aria-label="Previous feed"
            className="flex h-7 w-7 items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37]/80 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            ‹
          </button>
          <div className="flex flex-1 items-center gap-1.5">
            {FEEDS.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Feed ${n + 1}`}
                onClick={() => go(n)}
                className={`h-1 flex-1 transition-colors ${n === i ? "bg-[#D4AF37]" : "bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(i + 1)}
            aria-label="Next feed"
            className="flex h-7 w-7 items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37]/80 transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            ›
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Interactive case files: open each to decrypt the subject ──
function CaseFiles({
  openId,
  setOpenId,
  reviewed,
  onReview,
}: {
  openId: number | null;
  setOpenId: (id: number | null) => void;
  reviewed: Set<number>;
  onReview: (id: number) => void;
}) {
  return (
    <div className="relative z-10 flex h-full flex-col gap-2 p-5 pt-14 md:p-6 md:pt-14">
      <p className="mb-1 text-[12px] leading-snug text-neutral-400">
        Evidence. Experiments. Postmortems. Open a file for the full breakdown.
      </p>
      {projects.map((p) => {
        const open = openId === p.id;
        const seen = reviewed.has(p.id);
        const tech = Array.from(new Set(p.stackCategories.flatMap((c) => c.items))).slice(0, 8);
        return (
          <div
            key={p.id}
            className={`border bg-black/40 transition-colors ${open ? "border-[#D4AF37]/50" : "border-[#D4AF37]/15"}`}
          >
            <button
              type="button"
              onClick={() => {
                setOpenId(open ? null : p.id);
                onReview(p.id);
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
            >
              <span className="font-mono text-[11px] font-bold text-[#D4AF37]/60">{p.number}</span>
              <span className="flex-1 text-sm font-black uppercase tracking-wide text-white">{p.title}</span>
              <span
                className={`border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.2em] ${
                  seen ? "border-[#27c93f]/50 text-[#27c93f]" : "border-[#D4AF37]/30 text-[#D4AF37]/60"
                }`}
              >
                {seen ? "Reviewed" : "Sealed"}
              </span>
              <span className="w-3 text-center text-[#D4AF37]/70">{open ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#D4AF37]/10 px-3 py-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/60">
                      {p.category} · {p.year}
                    </div>
                    <p className="mt-1.5 text-[12px] leading-snug text-neutral-400">{p.description}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {tech.map((t) => (
                        <span
                          key={t}
                          className="border border-[#D4AF37]/20 bg-black/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-4 font-mono text-[10px] uppercase tracking-widest">
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noreferrer" className="text-[#D4AF37] hover:underline">
                          Live ↗
                        </a>
                      )}
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-[#D4AF37]">
                          Source ↗
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <p className="mt-auto pt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600">
        {reviewed.size}/{projects.length} files opened · subject data below ↓
      </p>
    </div>
  );
}

const SUBJECT_ROWS: [string, string][] = [
  ["Name", "Mateusz Goszczycki"],
  ["Role", "Full-stack engineer"],
  ["Based", "Łowicz / Warsaw, PL"],
  ["Email", "mateusz.goszczycki1994@gmail.com"],
  ["Phone", "+48 516 223 029"],
  ["GitHub", "github.com/Goniek94"],
  ["Status", "Available · immediate start"],
];

function SubjectData({ unlocked, count, total }: { unlocked: boolean; count: number; total: number }) {
  return (
    <div className="relative z-10 p-6 pt-14 md:p-8 md:pt-14">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em]">
        <span className={unlocked ? "text-[#27c93f]" : "text-[#D4AF37]/70"}>
          {unlocked ? "● Subject data · open channel" : "▮ Encrypted · classified"}
        </span>
        {!unlocked && <span className="text-neutral-600">decryption {count}/{total}</span>}
      </div>
      <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {SUBJECT_ROWS.map(([k, v], idx) => (
          <div key={k} className="flex items-baseline gap-4 border-b border-[#D4AF37]/10 pb-2">
            <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">{k}</span>
            {unlocked ? (
              <motion.span
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="font-mono text-[13px] text-white"
              >
                {v}
              </motion.span>
            ) : (
              <span className="select-none font-mono text-[13px] tracking-widest text-[#D4AF37]/30">████████████</span>
            )}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group/btn relative inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-7 py-3 font-mono text-[12px] font-black uppercase tracking-[0.2em] text-black shadow-[6px_6px_0_rgba(0,0,0,0.7)] transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_rgba(0,0,0,0.7)]"
            >
              Hire me
              <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
            </a>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              The investigation led straight to him.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProfileCockpit() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTouch = useIsTouch();

  const [openId, setOpenId] = useState<number | null>(null);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());
  const onReview = (id: number) =>
    setReviewed((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  // Contact data is always visible — a recruiter shouldn't have to "play" to
  // reach it. The case files stay interactive purely for project detail.
  const unlocked = true;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const titleYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const titleY = isTouch ? "0%" : titleYRaw;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden border-y border-[#D4AF37]/20 bg-[#050505] text-[#e1e1e1]"
    >
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(212,175,55,0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-[12%] top-[8%] z-0 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(36,86,196,0.16),transparent_70%)] blur-[130px]" />
      <div className="pointer-events-none absolute -right-[12%] bottom-[2%] z-0 h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(190,42,110,0.14),transparent_70%)] blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#D4AF3708_1px,transparent_1px),linear-gradient(to_bottom,#D4AF3708_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_90px_20px_rgba(0,0,0,0.5)] md:shadow-[inset_0_0_220px_120px_rgba(0,0,0,0.92)]" />
      <div className="hud-scanlines pointer-events-none absolute inset-0 z-30 opacity-25 md:opacity-50" />
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <div className="hud-sweep h-1/3 w-full bg-[linear-gradient(to_bottom,transparent,rgba(212,175,55,0.05),transparent)]" />
      </div>
      <GrainOverlay />
      <DreamLayer />
      <div className="pointer-events-none absolute inset-3 z-30 md:inset-6"><HudCorners /></div>

      <div className="relative z-10 mx-auto max-w-[1800px] px-6 py-10 md:px-10 md:py-14 lg:px-16">
        <LeftRail />
        <RightRail />
        <TopNav />
            {/* ── HERO: monologue (left) + cockpit window (right) ─ */}
            <div className="mb-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="mb-6 flex items-center gap-3"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
                    Case File MG-02 · The Developer
                  </span>
                </motion.div>

                <motion.h2
                  style={{ y: titleY }}
                  className="text-fluid-h1 font-black uppercase leading-[0.9] tracking-tight text-white"
                >
                  <span className="block">I take problems,</span>
                  <span className="block text-[#D4AF37] noir-flicker">not tickets.</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-400"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  We returned to Earth. Now the investigation begins. I build
                  full-stack systems, ship products, and solve problems that
                  actually matter — schema to prod, all solo.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#27c93f] shadow-[0_0_6px_#27c93f]" />
                  Status: back on planet
                  <span className="text-neutral-700">·</span>
                  <span className="text-[#D4AF37]/70">Investigation active</span>
                </motion.div>
              </div>

              <CockpitWindow />
            </div>

            {/* ── PANEL GRID 01–05 ─────────────────────────── */}
            <div id="work" className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* 01 — THE ORIGIN */}
              <HudPanel label="01 · The Origin" className="min-h-[260px] lg:col-span-4">
                <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.14]">
                  <div className="code-rain-drift font-mono text-[10px] leading-[2.4] text-[#D4AF37] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
                    {[...rainLines, ...rainLines, ...rainLines].map((l, i) => (
                      <div key={i} className="whitespace-nowrap px-4">{l}</div>
                    ))}
                  </div>
                </div>
                <div className="relative z-10 flex h-full flex-col gap-4 p-5 pt-14 md:p-6 md:pt-14">
                  <p className="text-[13px] leading-relaxed text-neutral-400">
                    From a kitchen line to orbital infrastructure. Six years
                    under fire, then years of curiosity, late nights and private
                    builds. The mission never changed.
                  </p>
                  <TapeNote className="-rotate-1 self-start">
                    Curiosity started it. Discipline kept it going.
                  </TapeNote>
                  <div className="mt-auto flex flex-wrap gap-2.5">
                    <Stamp value="3+" label="Shipped" />
                    <Stamp value="2+" label="Yrs comm." />
                    <Stamp value="100%" label="Solo" />
                  </div>
                </div>
              </HudPanel>

              {/* 02 — THE WORK */}
              <HudPanel label="02 · The Work" delay={0.05} className="min-h-[260px] lg:col-span-4">
                <div className="relative z-10 flex h-full flex-col gap-4 p-5 pt-14 md:p-6 md:pt-14">
                  <p className="text-[13px] leading-relaxed text-neutral-400">
                    Web apps. Real-time systems. APIs. AI pipelines. Clean code,
                    shipped on time.
                  </p>
                  <ul className="flex flex-col gap-2">
                    {work.map((w) => (
                      <li key={w} className="flex gap-2 text-[12px] leading-snug text-neutral-400">
                        <span className="mt-0.5 text-[#D4AF37]">›</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {arsenal.map((t) => (
                      <span
                        key={t}
                        className="border border-[#D4AF37]/25 bg-black/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </HudPanel>

              {/* 03 — THE ARSENAL */}
              <HudPanel label="03 · The Arsenal" delay={0.1} className="min-h-[260px] lg:col-span-4">
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center grayscale-[0.5] sepia-[0.35] brightness-[0.45] transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-75"
                  style={{ backgroundImage: 'url("/img/windowxp.png")' }}
                />
                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/80 to-black/50" />
                <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-5 pt-14 md:p-6 md:pt-14">
                  <p className="text-[13px] leading-relaxed text-neutral-300">
                    Tools, frameworks and tactics I rely on to turn messy
                    problems into solid systems — picked for the job, owned end
                    to end.
                  </p>
                </div>
              </HudPanel>

              {/* 04 — THE CASE STAYS OPEN */}
              <HudPanel label="04 · The Case Stays Open" delay={0.05} className="lg:col-span-8">
                <div className="relative z-10 grid grid-cols-1 gap-6 p-6 pt-14 md:grid-cols-[1.3fr_1fr] md:p-8 md:pt-14">
                  <div className="flex flex-col gap-4">
                    <p className="text-[13px] leading-relaxed text-neutral-400">
                      Every system has edge cases. Every case has loose ends.
                    </p>
                    <TapeNote className="rotate-1 self-start">
                      Investigation is a loop, not a checklist.
                    </TapeNote>
                    <ul className="flex flex-col gap-1.5">
                      {caseStaysOpen.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-[13px] text-neutral-300">
                          <span className="text-[#27c93f]">✓</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 border-l border-[#D4AF37]/15 md:pl-6">
                    <div className="self-start font-mono text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/60">
                      Current location
                    </div>
                    <div className="self-start font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                      Low Earth Orbit
                    </div>
                    <OrbitDiagram />
                    <div className="self-start font-mono text-[9px] leading-relaxed text-neutral-500">
                      LAT 51.1042° N<br />LON 19.9491° E
                    </div>
                  </div>
                </div>
              </HudPanel>

              {/* 05 — CASE FILES (interactive) */}
              <HudPanel label="05 · Case Files" delay={0.1} className="lg:col-span-4">
                <CaseFiles openId={openId} setOpenId={setOpenId} reviewed={reviewed} onReview={onReview} />
              </HudPanel>

              {/* SUBJECT DATA — the payoff */}
              <HudPanel
                label={unlocked ? "Subject Data · Declassified" : "Subject Data · Classified"}
                delay={0.05}
                className="lg:col-span-12"
              >
                <SubjectData unlocked={unlocked} count={reviewed.size} total={projects.length} />
              </HudPanel>
            </div>

            {/* bottom status bar */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#D4AF37]/20 pt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-600">
              <span>End of dossier · scroll for the mission log</span>
              <span className="flex items-center gap-2">
                <span className="hud-blink text-[#D4AF37]">▮</span> Awaiting orders
              </span>
            </div>
      </div>
    </section>
  );
}
