"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaCopy, FaCheck, FaGithub, FaPhone, FaEnvelope } from "react-icons/fa";

const EASE = [0.16, 1, 0.3, 1] as const;
const EMAIL = "mateusz.goszczycki1994@gmail.com";

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  return { copied, copy };
}

const LINKS = [
  {
    icon: FaEnvelope,
    label: "Email",
    value: "mateusz.goszczycki1994@gmail.com",
    href: `mailto:${EMAIL}`,
    sub: "Preferred contact",
    external: false,
  },
  {
    icon: FaPhone,
    label: "Phone",
    value: "+48 516 223 029",
    href: "tel:+48516223029",
    sub: "Mon–Fri · 9–18 CET",
    external: false,
  },
  {
    icon: FaGithub,
    label: "GitHub",
    value: "github.com/Goniek94",
    href: "https://github.com/Goniek94",
    sub: "Projects & open source",
    external: true,
  },
];

const STATS = [
  { num: "3+", label: "Apps shipped" },
  { num: "2+", label: "Yrs commercial" },
  { num: "100%", label: "Solo built" },
  { num: "CET", label: "Warsaw · Remote" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { copied, copy } = useCopy(EMAIL);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const bgY = isTouch ? "0%" : bgYRaw;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#050505] text-white overflow-hidden border-t border-[#111]"
    >
      {/* BG */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.03) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px]"
          style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(212,175,55,0.06) 0%, transparent 55%)" }}
        />
        <div
          className="absolute bottom-0 right-[-2%] font-black select-none leading-none pointer-events-none hidden xl:block"
          style={{
            fontSize: "clamp(14rem,28vw,42rem)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(212,175,55,0.022)",
            letterSpacing: "-0.05em",
          }}
        >
          HIRE
        </div>
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">

        {/* TOP BAR */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center justify-between pt-14 md:pt-20 mb-10 md:mb-14"
        >
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-10 bg-[#D4AF37]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.45em] text-[#D4AF37]">
              04 · Contact
            </span>
          </div>
          <div
            className="flex items-center gap-2.5 px-4 py-2 rounded-full text-[11px] font-mono"
            style={{ background: "rgba(39,201,63,0.07)", border: "1px solid rgba(39,201,63,0.2)", color: "#27c93f" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27c93f] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27c93f]" />
            </span>
            <span className="hidden sm:inline">Available · </span>Immediate start
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 pb-16 md:pb-20">

          {/* LEFT — Headline + bio */}
          <div className="flex flex-col justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.85, ease: EASE }}
            >
              <h2 className="font-black tracking-tighter uppercase leading-[0.88] mb-8">
                <span className="block text-white" style={{ fontSize: "clamp(2.6rem, 6.5vw, 8rem)" }}>
                  Open to
                </span>
                <span
                  className="block"
                  style={{ fontSize: "clamp(3.8rem, 10vw, 13rem)", WebkitTextStroke: "2px #D4AF37", color: "transparent" }}
                >
                  Work.
                </span>
              </h2>

              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-md">
                Seeking{" "}
                <span className="text-white font-semibold">Mid-Level Full-Stack</span>{" "}
                roles and ambitious projects. I take full ownership from
                architecture to deployment — remote-first, CET timezone.
              </p>
            </motion.div>

            {/* Work type tags */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="flex flex-wrap gap-2"
            >
              {["Full-time", "Contract / B2B", "Freelance", "Remote · CET"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-mono text-neutral-500"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {t}
                </span>
              ))}
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="grid grid-cols-4 gap-3"
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center py-4 rounded-xl gap-1.5 text-center"
                  style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}
                >
                  <span className="font-black text-[#D4AF37] tabular-nums leading-none text-xl md:text-2xl">
                    {s.num}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-600">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Contact links */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="flex flex-col gap-3"
          >
            {LINKS.map(({ icon: Icon, label, value, href, sub, external }, i) => (
              <motion.a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="group relative flex items-center gap-4 p-5 rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: i === 0 ? "rgba(212,175,55,0.07)" : "rgba(255,255,255,0.02)",
                  border: i === 0 ? "1px solid rgba(212,175,55,0.25)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Hover fill */}
                <motion.span
                  className="absolute inset-0 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{ background: i === 0 ? "rgba(212,175,55,0.1)" : "rgba(212,175,55,0.05)" }}
                  transition={{ duration: 0.25 }}
                />

                {/* Icon */}
                <div
                  className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ background: i === 0 ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.2)" }}
                >
                  <Icon size={15} color={i === 0 ? "#D4AF37" : "#666"} className="group-hover:text-[#D4AF37] transition-colors duration-300" />
                </div>

                {/* Text */}
                <div className="relative flex-1 min-w-0">
                  <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-neutral-600 mb-0.5">
                    {label}
                  </div>
                  <div
                    className="font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 truncate"
                    style={{ fontSize: "clamp(0.75rem, 1.4vw, 0.95rem)" }}
                  >
                    {value}
                  </div>
                </div>

                {/* Sub + arrow */}
                <div className="relative shrink-0 flex flex-col items-end gap-1 hidden sm:flex">
                  <span className="text-[10px] font-mono text-neutral-700 group-hover:text-neutral-500 transition-colors">
                    {sub}
                  </span>
                  <span className="text-[#D4AF37] text-sm opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </span>
                </div>
              </motion.a>
            ))}

            {/* Copy email button */}
            <button
              onClick={copy}
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl border text-[11px] font-mono uppercase tracking-widest transition-all duration-300 mt-1"
              style={{
                borderColor: copied ? "rgba(39,201,63,0.5)" : "rgba(212,175,55,0.2)",
                background: copied ? "rgba(39,201,63,0.06)" : "rgba(255,255,255,0.02)",
                color: copied ? "#27c93f" : "rgba(212,175,55,0.6)",
              }}
            >
              {copied ? <FaCheck size={11} /> : <FaCopy size={11} />}
              {copied ? "Email copied!" : "Copy email address"}
            </button>

            {/* Response time hint */}
            <p className="text-[11px] font-mono text-neutral-700 text-center mt-1">
              Typically replies within 24 hours
            </p>
          </motion.div>
        </div>
      </div>

      {/* MARQUEE — CSS animation (no JS RAF) */}
      <div className="relative overflow-hidden border-t border-b border-[#111] py-4">
        <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg,#050505,transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(-90deg,#050505,transparent)" }} />
        <div
          className="marquee-css font-black uppercase tracking-widest text-transparent select-none"
          style={{ WebkitTextStroke: "1px rgba(212,175,55,0.18)", fontSize: "clamp(1rem, 1.8vw, 1.4rem)", animationDuration: "28s" }}
        >
          {[0, 1].map((n) => (
            <span key={n} className="pr-8">
              Let&apos;s work together&nbsp;&nbsp;·&nbsp;&nbsp;Open to mid-level roles&nbsp;&nbsp;·&nbsp;&nbsp;Full stack developer&nbsp;&nbsp;·&nbsp;&nbsp;Available now&nbsp;&nbsp;·&nbsp;&nbsp;Remote · CET&nbsp;&nbsp;·&nbsp;&nbsp;Warsaw · Poland&nbsp;&nbsp;·&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 py-7">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-neutral-700 font-mono">
          <p>© 2026 Mateusz Goszczycki · All rights reserved</p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse inline-block" />
            Working globally · CET timezone
          </p>
        </div>
      </div>
    </section>
  );
}
