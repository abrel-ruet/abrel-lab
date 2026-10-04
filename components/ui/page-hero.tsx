"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Header band used at the top of every inner public page. */
export default function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-40 sm:pb-20">
      <div className="absolute inset-0 grid-bg" />
      <div className="glow-orb w-[520px] h-[520px] -top-56 left-1/2 -translate-x-1/2 bg-aqua-500/15" />
      <div className="glow-orb w-[300px] h-[300px] top-10 -left-24 bg-leaf-500/10" />
      <div className="container-xl relative text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {Icon && (
            <div className="mx-auto mb-6 w-14 h-14 rounded-2xl glass-card flex items-center justify-center">
              <Icon className="w-6 h-6 text-aqua-300" />
            </div>
          )}
          <p className="eyebrow mb-4">
            <span className="w-6 h-px bg-aqua-400/60" /> {eyebrow} <span className="w-6 h-px bg-aqua-400/60" />
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5">
            {title} {highlight && <span className="gradient-text">{highlight}</span>}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">{description}</p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
