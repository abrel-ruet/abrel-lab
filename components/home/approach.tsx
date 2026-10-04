"use client";

import { motion } from "framer-motion";
import { Search, Dna, Factory, Globe2 } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";

const steps = [
  {
    icon: Search,
    title: "Discover",
    text: "Screen indigenous microbes, enzymes, and biomass to find untapped bio-resources.",
    color: "text-leaf-300 border-leaf-400/30 bg-leaf-500/10",
  },
  {
    icon: Dna,
    title: "Engineer",
    text: "Improve strains, enzymes, and pathways with molecular tools and computational design.",
    color: "text-aqua-300 border-aqua-400/30 bg-aqua-500/10",
  },
  {
    icon: Factory,
    title: "Scale",
    text: "Optimize and scale processes from shake flasks to bench-top bioreactors and pilot plants.",
    color: "text-gear-300 border-gear-400/30 bg-gear-500/10",
  },
  {
    icon: Globe2,
    title: "Impact",
    text: "Translate results into technologies for industry, agriculture, and communities.",
    color: "text-aqua-200 border-aqua-300/30 bg-aqua-400/10",
  },
];

export default function Approach() {
  return (
    <section className="section-pad relative overflow-hidden bg-ink-900/40 border-y border-white/[0.05]">
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div className="container-xl relative">
        <SectionHeading
          eyebrow="Our approach"
          title="From Bench to"
          highlight="Bioreactor"
          description="A research pipeline that connects fundamental discovery with engineering scale-up and real-world deployment."
        />

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-leaf-400/40 via-aqua-400/40 to-gear-400/40" />
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="relative text-center flex flex-col items-center"
              >
                <div className={`relative z-10 w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 bg-ink-950 ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-xs font-display text-ink-500 mb-1">STEP 0{i + 1}</p>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-ink-300 leading-relaxed max-w-[16rem]">{s.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
