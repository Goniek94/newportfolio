"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// "The Path" — an animated career timeline. A vertical gold line draws itself
// as you scroll, and each milestone rises into view. Honest story: kitchen →
// self-taught → first paying client → real-time/AI builds → open to work.

type Milestone = {
  tag: string;
  title: string;
  desc: string;
  accent: string;
  now?: boolean;
};

const MILESTONES: Milestone[] = [
  {
    tag: "Before code",
    title: "Six years in a kitchen",
    desc: "Service taught me to ship under pressure, stay clean in chaos, and deliver on time — every single shift. That discipline never left.",
    accent: "#9a9a9a",
  },
  {
    tag: "The switch",
    title: "Self-taught full-stack",
    desc: "Nights and weekends: JavaScript → TypeScript, React, Node, SQL. Schema → API → UI → deploy. No bootcamp, no shortcuts — just shipped projects.",
    accent: "#E9C45A",
  },
  {
    tag: "2024 — 2025",
    title: "autosell.pl — first paying client",
    desc: "Delivered a commercial automotive marketplace solo, end to end. Live in production with real users — 30+ search filters, real-time chat, payments, Docker deploy. Requirements to prod, all mine.",
    accent: "#ff6a2b",
  },
  {
    tag: "2025 — 2026",
    title: "Matchdays — real-time at scale",
    desc: "A high-concurrency auction platform: sub-100ms WebSocket bidding, atomic Prisma transactions, Stripe Connect payouts, Gemini AI verification on Bull queues. Built under investor NDA.",
    accent: "#2b8cff",
  },
  {
    tag: "2026",
    title: "Three apps, shipped solo",
    desc: "Production-grade systems owned from schema to prod. One commercial client, one investor NDA, one creative build — every architectural decision mine.",
    accent: "#a855f7",
  },
  {
    tag: "Now",
    title: "Open to work",
    desc: "Mid-level full-stack · remote · open to relocation. Give me a problem — I'll handle the architecture, backend, UI and server, and hand you a working product.",
    accent: "#27c93f",
    now: true,
  },
];

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 65%"],
  });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="journey"
      className="relative w-full overflow-hidden bg-[#050505] py-28 text-white md:py-40"
    >
      {/* background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(233,196,90,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-8">
        {/* heading */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#E9C45A]"
          >
            ◆ The path
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl"
          >
            How I got here
          </motion.h2>
        </div>

        {/* timeline */}
        <div ref={ref} className="relative pl-10 md:pl-14">
          {/* faint track */}
          <div className="absolute left-[6px] top-2 bottom-2 w-px bg-white/10 md:left-[10px]" />
          {/* drawn line */}
          <motion.div
            style={{ height: lineH }}
            className="absolute left-[6px] top-2 w-px origin-top bg-gradient-to-b from-[#E9C45A] via-[#E9C45A] to-transparent md:left-[10px]"
          />

          <div className="flex flex-col gap-14 md:gap-20">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* dot */}
                <span
                  className="absolute top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#050505]"
                  style={{
                    left: "-38px",
                    background: m.accent,
                    boxShadow: `0 0 14px ${m.accent}`,
                  }}
                >
                  {m.now && (
                    <span
                      className="absolute inset-0 animate-ping rounded-full"
                      style={{ background: m.accent }}
                    />
                  )}
                </span>

                <span
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: m.accent }}
                >
                  {m.tag}
                </span>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
                  {m.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-400">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
