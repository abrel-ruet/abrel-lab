"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  action,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 flex flex-col gap-6 ${centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        <p className="eyebrow mb-3">
          <span className="w-6 h-px bg-aqua-400/60" />
          {eyebrow}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          {title} {highlight && <span className="gradient-text">{highlight}</span>}
        </h2>
        {description && <p className="mt-4 text-ink-300 leading-relaxed">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
