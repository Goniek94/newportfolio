"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsTouch } from "../hooks/useIsTouch";

/* ────────────────────────────────────────────────────────────
   MAX PAYNE — style noir graphic-novel "case file" profile.
   Self-contained drop-in section (id="about").
   ──────────────────────────────────────────────────────────── */

// ── Disciplines (the "evidence") ──────────────────────────────
const disciplines = [
  {
    no: "01",
    title: "Real-time engines",
    line: "WebSocket auctions. Socket.IO rooms. Atomic Prisma transactions that never lose a bid.",
  },
  {
    no: "02",
    title: "Payment rails",
    line: "Stripe Connect — seller onboarding, escrow payouts, webhook-driven state machines.",
  },
  {
    no: "03",
    title: "AI pipelines",
    line: "Gemini Vision verification on Bull queues with backoff. The user flow never blocks.",
  },
];

const arsenal = [
  "TypeScript", "Next.js", "React", "Node.js", "NestJS", "Express",
  "Socket.IO", "PostgreSQL", "Prisma", "Redis", "Docker", "NGINX",
  "Linux VPS", "Stripe Connect",
];

const closingFacts = [
  "Shipped for a real, paying client — autosell.pl is live.",
  "Full ownership: schema → API → UI → prod. All mine.",
  "6 years running a kitchen under fire. Incidents don't scare me.",
  "Zero to shipping developer in two years.",
];

// Falling-code text for the origin panel background
const rainLines = [
  "await prisma.$transaction(async (tx) => {",
  "  const top = await tx.bid.findFirst({ orderBy: { amount: 'desc' } });",
  "  if (next <= top.amount) throw new ConflictException('outbid');",
  "  io.to(`auction:${id}`).emit('bid:new', bid);",
  "});",
  "stripe.transfers.create({ amount, destination: seller });",
  "const verdict = await gemini.verify(images);",
  "queue.add('verify', job, { attempts: 5, backoff: 'exponential' });",
  "socket.join(`auction:${auctionId}`);",
  "export class AuctionsGateway implements OnGatewayConnection {",
];

// ── Film-grain overlay ────────────────────────────────────────
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
      className="noir-grain pointer-events-none absolute inset-[-30%] z-30 opacity-[0.07] mix-blend-overlay"
      style={{ backgroundImage: `url("${noise}")`, backgroundRepeat: "repeat" }}
    />
  );
}

// ── Noir comic caption box (cream paper, dark serif ink) ──────
function Caption({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative max-w-md border border-black/30 bg-[#e7d9b6] px-4 py-3 shadow-[5px_5px_0_rgba(0,0,0,0.55)] ${className}`}
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <p className="text-[13px] md:text-[15px] italic leading-snug text-[#1a1206]">
        {children}
      </p>
    </div>
  );
}

// ── Panel shell: hard shadow, slight tilt, scroll reveal ──────
function Panel({
  children,
  className = "",
  tilt = 0,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.96, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotate: `${tilt}deg` }}
      className={`group relative overflow-hidden border-2 border-black bg-[#0a0805] shadow-[10px_10px_0_rgba(0,0,0,0.7)] ${className}`}
    >
      {/* amber edge glow on hover */}
      <div className="pointer-events-none absolute inset-0 z-20 border-2 border-[#D4AF37]/0 transition-colors duration-500 group-hover:border-[#D4AF37]/40" />
      {children}
    </motion.div>
  );
}

// ── Evidence stamp (stat) ─────────────────────────────────────
function Stamp({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 border border-[#D4AF37]/30 bg-black/40 px-4 py-2 text-center">
      <span className="font-mono text-2xl font-black leading-none text-[#D4AF37]">
        {value}
      </span>
      <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </span>
    </div>
  );
}

export default function ProfileNoir() {
  const sectionRef = useRef<HTMLElement>(null);
  const isTouch = useIsTouch();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const titleYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const titleY = isTouch ? "0%" : titleYRaw;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden border-t border-[#111] bg-[#050505] text-[#e1e1e1]"
    >
      {/* Amber noir wash + vignette + grain */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(212,175,55,0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_70%_100%,rgba(212,175,55,0.05),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_220px_120px_rgba(0,0,0,0.92)]" />
      <GrainOverlay />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-24 lg:px-16">
        {/* ── HEADER / MONOLOGUE ───────────────────────────── */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="h-[2px] w-10 bg-[#D4AF37]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
              Case File No. 02 — The Developer
            </span>
          </motion.div>

          <motion.h2
            style={{ y: titleY }}
            className="max-w-4xl text-fluid-h1 font-black uppercase leading-[0.92] tracking-tight text-white"
          >
            <span className="block">I take problems,</span>
            <span className="block text-[#D4AF37] noir-flicker">
              not tickets.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-neutral-400"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Full-stack engineer out of Łowicz. One commercial client, one
            investor NDA, three production apps — all of it built alone, from the
            schema to the server it runs on.
          </motion.p>
        </div>

        {/* ── COMIC PAGE GRID ──────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          {/* ORIGIN — tall left panel with falling code */}
          <Panel
            tilt={-0.5}
            className="min-h-[380px] lg:col-span-7 lg:row-span-2 lg:min-h-[560px]"
          >
            {/* falling code background */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.18]">
              <div className="code-rain-drift font-mono text-[11px] leading-[2.4] text-[#D4AF37] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                {[...rainLines, ...rainLines, ...rainLines].map((l, i) => (
                  <div key={i} className="whitespace-nowrap px-5">
                    {l}
                  </div>
                ))}
              </div>
            </div>
            {/* amber-to-black gradient floor */}
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/70 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-8 p-6 md:p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">
                01 — The Origin
              </span>

              <div className="flex flex-col gap-6">
                <Caption className="-rotate-1">
                  They told me a cook couldn&apos;t write code. Six years in a
                  kitchen under fire taught me something else — how to ship when
                  everything is on the line.
                </Caption>
                <Caption className="ml-auto rotate-1">
                  Two years later, <strong>autosell.pl</strong> went live to real,
                  paying users. Schema, API, UI, deployment. I take ownership,
                  not assignments.
                </Caption>

                <div className="mt-2 flex flex-wrap gap-3">
                  <Stamp value="3+" label="Apps shipped" />
                  <Stamp value="2+" label="Yrs commercial" />
                  <Stamp value="100%" label="Solo built" />
                </div>
              </div>
            </div>
          </Panel>

          {/* THE WORK — disciplines over screenshot */}
          <Panel tilt={0.6} delay={0.1} className="min-h-[260px] lg:col-span-5">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center grayscale-[0.6] sepia-[0.4] brightness-[0.55] transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-75"
              style={{ backgroundImage: 'url("/img/autosell%20(3).png")' }}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/85 to-black/40" />
            <div className="relative z-10 flex h-full flex-col gap-4 p-6 md:p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/70">
                02 — The Work
              </span>
              <div className="flex flex-col gap-4">
                {disciplines.map((d) => (
                  <div key={d.no} className="flex gap-3">
                    <span className="font-mono text-[11px] font-bold text-[#D4AF37]/50">
                      {d.no}
                    </span>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wide text-white">
                        {d.title}
                      </h4>
                      <p className="mt-0.5 text-[12.5px] leading-snug text-neutral-400">
                        {d.line}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* THE ARSENAL — stack chips */}
          <Panel tilt={-0.7} delay={0.2} className="min-h-[260px] lg:col-span-5">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:22px_22px]" />
            <div className="relative z-10 flex h-full flex-col gap-5 p-6 md:p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/70">
                03 — The Arsenal
              </span>
              <div className="flex flex-wrap gap-2">
                {arsenal.map((t) => (
                  <span
                    key={t}
                    className="border border-[#D4AF37]/25 bg-black/50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-neutral-300 transition-colors duration-300 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p
                className="mt-auto text-[12px] italic leading-snug text-neutral-500"
                style={{ fontFamily: "Georgia, serif" }}
              >
                &ldquo;Pick the tool the problem needs — then own it end to
                end.&rdquo;
              </p>
            </div>
          </Panel>

          {/* CLOSING — availability + facts + CTA */}
          <Panel tilt={0.4} delay={0.15} className="lg:col-span-12">
            <div className="relative z-10 grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div className="flex flex-col gap-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/70">
                  04 — The Case Stays Open
                </span>
                <Caption className="-rotate-[0.5deg]">
                  The case isn&apos;t closed. I&apos;m available, immediate start,
                  remote on CET and open to relocation.
                </Caption>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {closingFacts.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-[13px] leading-snug text-neutral-400"
                    >
                      <span className="mt-1 text-[#D4AF37]">›</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start gap-4 md:items-end">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#27c93f] opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#27c93f]">
                    Available
                  </span>
                </div>
                <a
                  href="#contact"
                  className="group/btn relative inline-flex items-center gap-3 border-2 border-[#D4AF37] bg-[#D4AF37] px-7 py-3 font-mono text-[12px] font-black uppercase tracking-[0.2em] text-black shadow-[6px_6px_0_rgba(0,0,0,0.7)] transition-all duration-200 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_rgba(0,0,0,0.7)]"
                >
                  Hire me
                  <span className="transition-transform duration-200 group-hover/btn:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
