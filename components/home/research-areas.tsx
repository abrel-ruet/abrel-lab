"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cog, Leaf, Droplets, Wheat, Bug, Binary, ArrowUpRight, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { researchAreas } from "@/lib/site-config";

const visuals: Record<string, { icon: LucideIcon; tone: string }> = {
  bioprocess: { icon: Cog, tone: "text-gear-300 from-gear-500/25" },
  bioenergy: { icon: Leaf, tone: "text-leaf-300 from-leaf-500/25" },
  environmental: { icon: Droplets, tone: "text-aqua-300 from-aqua-500/25" },
  agrifood: { icon: Wheat, tone: "text-leaf-200 from-leaf-400/20" },
  microbial: { icon: Bug, tone: "text-aqua-200 from-aqua-400/20" },
  computational: { icon: Binary, tone: "text-gear-200 from-gear-400/20" },
};

export default function ResearchAreas() {
  return (
    <section id="research" className="section-pad relative">
      <div className="container-xl">
        <SectionHeading
          eyebrow="What we do"
          title="Research"
          highlight="Focus Areas"
          description="Six interconnected themes that take biology from the bench to the bioreactor, and from the bioreactor to real-world impact."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {researchAreas.map((area, i) => {
            const v = visuals[area.key];
            const Icon = v.icon;
            const [text, from] = v.tone.split(" ");
            return (
              <motion.div
                key={area.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              >
                <Link href="/projects" className="group glass-card glass-card-hover block h-full p-7 relative overflow-hidden">
                  <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${from} to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${from} to-transparent border border-white/[0.08] flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${text}`} />
                      </div>
                      <span className="font-display text-sm text-ink-500">0{i + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2.5">{area.title}</h3>
                    <p className="text-sm text-ink-300 leading-relaxed mb-5">{area.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-aqua-300 group-hover:gap-2.5 transition-all">
                      Related projects <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
