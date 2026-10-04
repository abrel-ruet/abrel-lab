"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import Avatar from "@/components/ui/avatar";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import { sortByHierarchy, type TeamMember } from "@/lib/types";
import { stripHtml } from "@/lib/utils";

export default function ProfessorsSection() {
  const { data } = useLiveCollection<TeamMember>(COLLECTIONS.team);
  const professors = sortByHierarchy(data.filter((m) => m.memberType === "professor")).slice(0, 3);

  if (professors.length === 0) return null;

  return (
    <section className="section-pad relative">
      <div className="glow-orb w-[500px] h-[500px] top-20 right-0 bg-gear-500/10" />
      <div className="container-xl relative">
        <SectionHeading
          eyebrow="Leadership"
          title="Meet Our"
          highlight="Faculty"
          align="left"
          description="Our faculty guide ABREL's research vision and mentor the next generation of bio-resource engineers."
          action={
            <Link href="/team" className="btn-ghost shrink-0">
              Full team <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Link href={`/team/${p.slug}`} className="group glass-card glass-card-hover flex flex-col h-full p-6">
                <div className="flex items-center gap-4 mb-5">
                  <Avatar name={p.name} image={p.image} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-lg leading-snug group-hover:text-aqua-200 transition-colors">{p.name}</h3>
                    <p className="text-sm text-aqua-300">{p.designation}</p>
                  </div>
                </div>
                <p className="text-sm text-ink-300 leading-relaxed line-clamp-3 mb-5">{stripHtml(p.bio)}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {p.researchInterests?.slice(0, 3).map((r) => (
                    <span key={r} className="chip">{r}</span>
                  ))}
                </div>
                {p.email && (
                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-ink-400">
                    <Mail className="w-3.5 h-3.5" /> {p.email}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
