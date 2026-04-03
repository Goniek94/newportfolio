"use client";

import { motion } from "framer-motion";
import { useScramble } from "./useScramble";

// Single technology pill with scramble effect on hover
export default function StackPill({
  label,
  delay = 0,
}: {
  label: string;
  delay?: number;
}) {
  const { display, trigger } = useScramble(label.toUpperCase());

  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      onMouseEnter={trigger}
      className="px-3 py-1.5 bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] rounded-lg text-[10px] font-mono text-neutral-500 uppercase tracking-widest transition-all duration-200 cursor-default select-none"
    >
      {display}
    </motion.span>
  );
}
