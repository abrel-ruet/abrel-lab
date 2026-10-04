"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, FlaskConical, Users, Microscope } from "lucide-react";
import { COLLECTIONS, countCollection } from "@/lib/firestore";
import { researchAreas } from "@/lib/site-config";

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const totalFrames = 60;
    const timer = setInterval(() => {
      frame += 1;
      setCount(Math.round((value * frame) / totalFrames));
      if (frame >= totalFrames) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsBar() {
  const [counts, setCounts] = useState({ publications: 0, projects: 0, members: 0 });

  useEffect(() => {
    Promise.all([
      countCollection(COLLECTIONS.publications),
      countCollection(COLLECTIONS.projects),
      countCollection(COLLECTIONS.team),
    ])
      .then(([publications, projects, members]) => setCounts({ publications, projects, members }))
      .catch(() => {});
  }, []);

  const stats = [
    { icon: BookOpen, value: counts.publications, label: "Publications", color: "text-leaf-300", ring: "from-leaf-500/25" },
    { icon: FlaskConical, value: counts.projects, label: "Research Projects", color: "text-aqua-300", ring: "from-aqua-500/25" },
    { icon: Users, value: counts.members, label: "Lab Members", color: "text-gear-300", ring: "from-gear-500/25" },
    { icon: Microscope, value: researchAreas.length, label: "Research Areas", color: "text-aqua-200", ring: "from-aqua-400/20" },
  ];

  return (
    <section className="relative py-14 border-y border-white/[0.06] bg-ink-900/60">
      <div className="container-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.ring} to-transparent border border-white/[0.08] flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-white">
                    <AnimatedCounter value={stat.value} />
                    <span className={stat.color}>+</span>
                  </div>
                  <p className="text-xs text-ink-400 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
