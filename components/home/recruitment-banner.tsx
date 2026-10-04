"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Sparkles, Users, FlaskConical } from "lucide-react";

const perks = [
  { icon: FlaskConical, label: "Hands-on wet-lab & pilot-scale work" },
  { icon: Users, label: "Mentorship from experienced faculty" },
  { icon: Sparkles, label: "Publish in leading journals" },
];

export default function RecruitmentBanner() {
  return (
    <section className="py-10">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl border border-aqua-400/20 p-6 sm:p-12"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-leaf-600/25 via-aqua-700/25 to-gear-700/40" />
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="glow-orb w-80 h-80 -top-20 -right-20 bg-aqua-400/25" />

          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="chip chip-leaf mb-5">
                <GraduationCap className="w-3.5 h-3.5" /> Now recruiting
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Grow your research career with <span className="gradient-text">ABREL</span>
              </h2>
              <p className="text-ink-200 leading-relaxed mb-8 max-w-xl">
                We welcome curious BSc, MSc, and PhD researchers who want to engineer biology for real-world impact,
                from biorefineries and bioremediation to bioinformatics.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                <Link href="/recruitment" className="btn-primary">
                  Apply now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/projects" className="btn-ghost">
                  See current projects
                </Link>
              </div>
            </div>

            <ul className="space-y-3">
              {perks.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 rounded-xl bg-ink-950/50 border border-white/[0.08] px-4 py-3.5 backdrop-blur">
                  <Icon className="w-5 h-5 text-aqua-300 shrink-0" />
                  <span className="text-sm text-ink-100">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
