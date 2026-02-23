export const statsCardCode = `"use client";

import { motion } from "framer-motion";

// Animated statistics card for admin dashboard
// Features: loading skeleton, color-coded changes, hover effects
export function StatsCard({ title, value, description, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border bg-white text-card-foreground shadow-sm p-6 flex flex-row items-center justify-between space-y-0"
    >
      <div className="flex flex-col gap-1">
        <h3 className="tracking-tight text-sm font-medium text-gray-500">
          {title}
        </h3>
        <div className="text-2xl font-bold text-[#1F2A14]">{value}</div>
        <p className="text-xs text-muted-foreground text-gray-400">
          {description}
        </p>
      </div>
      <div className="h-12 w-12 rounded-full bg-[#1F2A14]/5 flex items-center justify-center">
        <Icon className="h-6 w-6 text-[#1F2A14]" />
      </div>
    </motion.div>
  );
}`;
