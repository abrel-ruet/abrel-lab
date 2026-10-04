"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Dna, Leaf, Cog, FlaskConical } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const floatingTags = [
  { icon: Leaf, label: "Sustainable Bio-resources", className: "top-2 -left-6 sm:top-6 sm:left-0 xl:-left-10", color: "text-leaf-300" },
  { icon: Dna, label: "Synthetic & Systems Biology", className: "bottom-6 -left-4 sm:bottom-16 sm:left-0 xl:-left-16", color: "text-aqua-300" },
  { icon: Cog, label: "Bioprocess Engineering", className: "top-1/2 -right-6 sm:top-1/3 sm:right-0 xl:-right-8", color: "text-gear-300" },
];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16 sm:pt-28">
      <div className="absolute inset-0 grid-bg" />
      <div className="glow-orb w-[620px] h-[620px] -top-40 -right-40 bg-gear-500/20" />
      <div className="glow-orb w-[520px] h-[520px] top-1/3 -left-60 bg-leaf-500/15" />
      <div className="glow-orb w-[400px] h-[400px] bottom-0 right-1/3 bg-aqua-500/10" />

      <div className="container-xl relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-10 items-center">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="chip chip-aqua mb-6 lg:mb-7 !py-1.5 !px-3.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-leaf-400" />
            </span>
            {siteConfig.tagline}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[4.1rem] font-bold text-white leading-[1.05] mb-6"
          >
            Advanced <span className="gradient-text whitespace-nowrap">Bio-Resources</span>
            <br />
            Engineering Lab
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-base sm:text-lg text-ink-300 mb-9 lg:mb-10 leading-relaxed max-w-xl lg:border-l-2 lg:border-aqua-400/60 lg:pl-5"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4"
          >
            <Link href="/projects" className="btn-primary">
              <FlaskConical className="w-4 h-4" /> Explore Research
            </Link>
            <Link href="/publications" className="btn-ghost">
              <BookOpen className="w-4 h-4" /> Publications <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative order-first lg:order-none mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] aspect-square"
        >
          <div className="absolute inset-0 rounded-full border border-dashed border-aqua-400/25 animate-spin-slow" />
          <div className="absolute inset-[8%] rounded-full border border-gear-400/20" />
          <div className="absolute inset-[16%] rounded-full bg-gradient-to-br from-leaf-500/20 via-aqua-500/15 to-gear-500/25 blur-2xl" />
          <div className="absolute inset-[18%] rounded-full overflow-hidden ring-1 ring-white/10 shadow-[0_0_80px_-10px] shadow-aqua-400/40 animate-float">
            <Image src={siteConfig.logo} alt={`${siteConfig.name} emblem`} fill sizes="320px" className="object-cover" priority />
          </div>

          {floatingTags.map(({ icon: Icon, label, className, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.15 }}
              className={`absolute ${className} glass-card !rounded-xl px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2.5 shadow-xl`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${color}`} />
              <span className="text-[10px] sm:text-xs font-medium text-ink-100 whitespace-nowrap">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
