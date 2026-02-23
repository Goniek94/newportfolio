"use client";

import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="relative w-full bg-[#050505] text-white py-20 md:py-32 px-4 md:px-12 overflow-hidden border-t border-[#222]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_1200px_at_50%_50%,#1a1a1a,transparent)] opacity-60" />

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* HEADER */}
        <div className="flex items-center gap-3 md:gap-4 mb-10 md:mb-12">
          <div className="h-[2px] w-10 md:w-16 bg-[#D4AF37] shrink-0" />
          <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] md:tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
            Let's Connect
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
          {/* LEFT */}
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
              <span className="text-white">Ready to</span>
              <br />
              <span className="text-[#D4AF37]">Build</span>
              <br />
              <span className="text-white">Something</span>
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                Great?
              </span>
            </h2>

            <p className="text-lg md:text-xl lg:text-2xl text-neutral-400 font-light leading-relaxed max-w-xl">
              I'm currently{" "}
              <span className="text-[#D4AF37] font-bold">
                open to full-time opportunities
              </span>{" "}
              and challenging freelance projects. Let's create something
              extraordinary together.
            </p>

            <div className="inline-flex items-center gap-3 bg-[#0a0a0a] border border-[#222] px-4 md:px-6 py-2.5 md:py-3 rounded-full">
              <div className="relative">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#27c93f] rounded-full" />
                <div className="absolute inset-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#27c93f] rounded-full animate-ping" />
              </div>
              <span className="text-xs md:text-sm font-mono text-neutral-400">
                Available for work •{" "}
                <span className="text-white">Immediate start</span>
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3 md:space-y-4">
            {/* EMAIL */}
            <a
              href="mailto:mateusz.goszczycki1994@gmail.com"
              className="relative block bg-[#0a0a0a] border border-[#D4AF37] p-5 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                      <FaEnvelope className="text-black" size={18} />
                    </div>
                    <span className="text-[10px] md:text-xs font-mono text-neutral-500 uppercase tracking-widest">
                      Primary Contact
                    </span>
                  </div>
                  <h3 className="text-base md:text-2xl font-black text-[#D4AF37] mb-1 md:mb-2 break-all">
                    mateusz.goszczycki1994@gmail.com
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-500">
                    Fastest response time • Usually within 24h
                  </p>
                </div>
                <span className="text-[#D4AF37] text-lg md:text-xl shrink-0">
                  →
                </span>
              </div>
            </a>

            {/* PHONE */}
            <a
              href="tel:+48516223029"
              className="relative block bg-[#0a0a0a] border border-[#D4AF37] p-5 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                      <FaPhone className="text-black" size={16} />
                    </div>
                    <span className="text-[10px] md:text-xs font-mono text-neutral-500 uppercase tracking-widest">
                      Direct Line
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#D4AF37] mb-1 md:mb-2 font-mono tracking-wider">
                    +48 516 223 029
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-500">
                    Available Mon-Fri • 9:00 - 18:00 CET
                  </p>
                </div>
                <span className="text-[#D4AF37] text-lg md:text-xl shrink-0">
                  →
                </span>
              </div>
            </a>

            {/* SOCIAL */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 pt-1 md:pt-2">
              <a
                href="https://github.com/Goniek94"
                target="_blank"
                className="flex items-center justify-center gap-2 md:gap-3 bg-[#0a0a0a] border border-[#D4AF37] px-4 md:px-6 py-4 md:py-5 rounded-xl md:rounded-2xl"
              >
                <FaGithub className="text-[#D4AF37]" size={20} />
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-white">
                  GitHub
                </span>
              </a>
              <a
                href="https://linkedin.com/in/mateusz-goszczycki"
                target="_blank"
                className="flex items-center justify-center gap-2 md:gap-3 bg-[#0a0a0a] border border-[#D4AF37] px-4 md:px-6 py-4 md:py-5 rounded-xl md:rounded-2xl"
              >
                <FaLinkedin className="text-[#D4AF37]" size={20} />
                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-white">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="mt-16 md:mt-24 overflow-hidden">
          <motion.div
            className="flex gap-6 md:gap-8 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-transparent uppercase whitespace-nowrap"
            style={{ WebkitTextStroke: "1.5px #D4AF37" }}
            animate={{ x: [0, -1500] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            LET'S WORK TOGETHER • OPEN FOR OPPORTUNITIES • LET'S WORK TOGETHER •
            OPEN FOR OPPORTUNITIES • LET'S WORK TOGETHER • OPEN FOR
            OPPORTUNITIES •
          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-[1800px] mx-auto mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[#222] relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-neutral-600 text-center md:text-left">
          <p>© 2026 Mateusz Goszczycki • All rights reserved</p>
          <p className="font-mono">
            Based in Łowicz/Warsaw, Poland 🇵🇱 • Working globally 🌍
          </p>
        </div>
      </div>
    </section>
  );
}
