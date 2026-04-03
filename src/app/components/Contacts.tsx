"use client";

import { useRef } from "react";
import { FaGithub, FaEnvelope, FaPhone, FaArrowRight } from "react-icons/fa";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: d, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// ─────────────────────────────────────────────
// CONTACT CARD
// ─────────────────────────────────────────────
function ContactCard({
  href,
  icon,
  label,
  value,
  sub,
  delay,
  accent = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover="hover"
      className="group relative flex items-center gap-5 p-6 md:p-7 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: accent
          ? "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)"
          : "rgba(255,255,255,0.03)",
        border: accent
          ? "1px solid rgba(212,175,55,0.35)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Animated background sweep on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0, x: "-100%" }}
        whileHover={{ opacity: 1, x: "0%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background:
            "linear-gradient(90deg, rgba(212,175,55,0.08) 0%, transparent 100%)",
        }}
      />

      {/* Top shimmer line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        initial={{ scaleX: 0, opacity: 0 }}
        whileHover={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
          transformOrigin: "left",
        }}
      />

      {/* Icon */}
      <div
        className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{
          background: "rgba(212,175,55,0.1)",
          border: "1px solid rgba(212,175,55,0.3)",
        }}
      >
        <span className="text-[#D4AF37] text-lg">{icon}</span>
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1 min-w-0">
        <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-neutral-600 mb-1">
          {label}
        </p>
        <p className="text-sm md:text-lg font-black text-white truncate leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
          {value}
        </p>
        <p className="text-[11px] text-neutral-600 mt-0.5 font-mono">{sub}</p>
      </div>

      {/* Arrow */}
      <motion.div
        className="relative z-10 shrink-0 text-[#D4AF37] opacity-30 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <FaArrowRight size={14} />
      </motion.div>
    </motion.a>
  );
}

// ─────────────────────────────────────────────
// AVAILABILITY INDICATOR
// ─────────────────────────────────────────────
function AvailabilityBadge() {
  return (
    <motion.div
      variants={fadeUp}
      custom={0.3}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full"
      style={{
        background: "rgba(39,201,63,0.06)",
        border: "1px solid rgba(39,201,63,0.2)",
      }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27c93f] opacity-60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#27c93f]" />
      </span>
      <span className="text-[11px] font-mono text-neutral-400 tracking-wide">
        Available for work —{" "}
        <span className="text-white font-bold">Immediate start</span>
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MARQUEE STRIP
// ─────────────────────────────────────────────
function MarqueeStrip() {
  const items = [
    "LET'S BUILD SOMETHING GREAT",
    "OPEN TO MID-LEVEL ROLES",
    "FULL STACK DEVELOPER",
    "AVAILABLE NOW",
    "REMOTE · CET TIMEZONE",
  ];
  const repeated = [...items, ...items, ...items].join("  ·  ");

  return (
    <div className="relative overflow-hidden border-y border-[#1a1a1a] py-4 mt-24 md:mt-32">
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #050505, transparent)" }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, #050505, transparent)" }}
      />

      <motion.div
        className="whitespace-nowrap font-black uppercase tracking-widest text-transparent select-none"
        style={{
          WebkitTextStroke: "1px rgba(212,175,55,0.3)",
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {repeated}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: "-50px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#050505] text-white overflow-hidden border-t border-[#1a1a1a]"
    >
      {/* ── Parallax background ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, #050505 100%)",
          }}
        />
        {/* Giant ghost text */}
        <div
          className="absolute -bottom-10 -left-10 font-black select-none leading-none hidden lg:block"
          style={{
            fontSize: "clamp(8rem, 22vw, 32rem)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(212,175,55,0.04)",
            letterSpacing: "-0.05em",
          }}
        >
          HIRE
        </div>
        {/* Gold glow blobs */}
        <div
          className="absolute top-0 right-0 w-[50%] h-[50%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 80% 20%, rgba(212,175,55,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[60%] h-[60%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 20% 80%, rgba(212,175,55,0.05) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pt-20 md:pt-32 pb-0">
        {/* ── Section label ── */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            className="h-[2px] w-12 bg-[#D4AF37] origin-left"
          />
          <span className="text-[11px] font-mono uppercase tracking-[0.4em] text-[#D4AF37]">
            Let&apos;s Connect
          </span>
        </motion.div>

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">
          {/* ── LEFT: Big title + description ── */}
          <div ref={titleRef}>
            {/* Giant stacked title — whole lines animate in, no per-letter clipping */}
            <div
              className="font-black tracking-tighter uppercase mb-10"
              style={{
                fontSize: "clamp(3.2rem, 7.5vw, 8.5rem)",
                lineHeight: 1.05,
              }}
            >
              {/* Line 1 */}
              <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
                <motion.div
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: "0%" } : { y: "110%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ color: "#ffffff" }}
                >
                  READY TO
                </motion.div>
              </div>
              {/* Line 2 */}
              <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
                <motion.div
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: "0%" } : { y: "110%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ color: "#D4AF37" }}
                >
                  BUILD
                </motion.div>
              </div>
              {/* Line 3 */}
              <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
                <motion.div
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: "0%" } : { y: "110%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ color: "#ffffff" }}
                >
                  SOMETHING
                </motion.div>
              </div>
              {/* Line 4 — outline */}
              <div style={{ overflow: "hidden", paddingBottom: "0.12em" }}>
                <motion.div
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: "0%" } : { y: "110%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    WebkitTextStroke: "2px #D4AF37",
                    color: "transparent",
                  }}
                >
                  GREAT?
                </motion.div>
              </div>
            </div>

            {/* Availability */}
            <AvailabilityBadge />

            {/* Description */}
            <motion.p
              variants={fadeUp}
              custom={0.45}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-6 text-base md:text-lg text-neutral-400 font-light leading-relaxed max-w-md border-l-2 border-[#D4AF37]/30 pl-5"
            >
              I&apos;m currently{" "}
              <span className="text-[#D4AF37] font-semibold">
                open to Mid-Level Full-Stack opportunities
              </span>{" "}
              and technically challenging projects. Let&apos;s build something
              exceptional together.
            </motion.p>

            {/* Tags */}
            <motion.div
              variants={fadeUp}
              custom={0.55}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {[
                { icon: "🕐", text: "Full-time / Contract / B2B" },
                { icon: "🌍", text: "Remote · CET timezone" },
                { icon: "⚡", text: "Available now" },
              ].map((tag) => (
                <span
                  key={tag.text}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono text-neutral-500"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span>{tag.icon}</span>
                  {tag.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Contact cards ── */}
          <div className="flex flex-col gap-3">
            <ContactCard
              href="mailto:mateusz.goszczycki1994@gmail.com"
              icon={<FaEnvelope />}
              label="Primary Contact"
              value="mateusz.goszczycki1994@gmail.com"
              sub="Fastest response · Usually within 24h"
              delay={0.15}
              accent
            />
            <ContactCard
              href="tel:+48516223029"
              icon={<FaPhone />}
              label="Direct Line"
              value="+48 516 223 029"
              sub="Available Mon–Fri · 9:00–18:00 CET"
              delay={0.25}
            />

            {/* GitHub — full-width special card */}
            <motion.a
              href="https://github.com/Goniek94"
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              custom={0.35}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative group flex items-center justify-between gap-4 px-7 py-5 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            >
              {/* Hover fill */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.04) 100%)",
                }}
              />
              {/* Top shimmer */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(212,175,55,0.9), transparent)",
                  transformOrigin: "left",
                }}
              />

              <div className="relative z-10 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.3)",
                  }}
                >
                  <FaGithub className="text-[#D4AF37]" size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-neutral-600 mb-0.5">
                    Source Code
                  </p>
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                    GitHub Profile
                  </p>
                </div>
              </div>

              <motion.div
                className="relative z-10 text-[#D4AF37] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <FaArrowRight size={16} />
              </motion.div>
            </motion.a>

            {/* Decorative stat row */}
            <motion.div
              variants={fadeUp}
              custom={0.45}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-3 mt-2"
            >
              {[
                { value: "3+", label: "Apps shipped" },
                { value: "2+", label: "Yrs commercial" },
                { value: "100%", label: "Solo built" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center py-4 rounded-xl text-center"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span className="text-xl md:text-2xl font-black text-[#D4AF37] leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Footer ── */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-neutral-700 font-mono">
          <p>© 2026 Mateusz Goszczycki · All rights reserved</p>
          <p>Based in Łowicz / Warsaw, Poland 🇵🇱 · Working globally 🌍</p>
        </div>
      </div>
    </section>
  );
}
