"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, ArrowUpRight, Star, Users } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import PageHero from "@/components/ui/page-hero";
import FilterBar from "@/components/ui/filter-bar";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import type { Project, ProjectStatus } from "@/lib/types";

const statusChip: Record<ProjectStatus, string> = {
  active: "chip-leaf",
  ongoing: "chip-aqua",
  completed: "chip-gear",
};

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
    >
      <Link href={`/projects/${p.slug}`} className="group glass-card glass-card-hover flex flex-col h-full overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-leaf-600/20 via-aqua-700/20 to-gear-700/30">
          {p.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FlaskConical className="w-10 h-10 text-aqua-300/40" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`chip ${statusChip[p.status] ?? ""} capitalize backdrop-blur`}>{p.status}</span>
            {p.featured && (
              <span className="chip backdrop-blur"><Star className="w-3 h-3 text-leaf-300" /> Featured</span>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 p-6">
          <p className="text-xs text-aqua-300 font-medium mb-2">{p.researchArea}</p>
          <h3 className="font-semibold text-white text-lg leading-snug mb-3 group-hover:text-aqua-200 transition-colors">{p.title}</h3>
          <p className="text-sm text-ink-300 line-clamp-3 mb-5">{p.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.technologies?.slice(0, 4).map((t) => (
              <span key={t} className="chip !text-[11px]">{t}</span>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs text-ink-400">
            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {p.team?.length ?? 0} members</span>
            <ArrowUpRight className="w-4 h-4 group-hover:text-aqua-300 transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const { data, loading, error } = useLiveCollection<Project>(COLLECTIONS.projects, {
    orderByField: "startDate",
    orderDirection: "desc",
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data
      .filter(
        (p) =>
          (filter === "all" || p.status === filter || p.type === filter) &&
          (!q ||
            p.title.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.researchArea?.toLowerCase().includes(q) ||
            p.technologies?.some((t) => t.toLowerCase().includes(q)))
      )
      .sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [data, search, filter]);

  const count = (fn: (p: Project) => boolean) => data.filter(fn).length;
  const options = [
    { label: "All", value: "all", count: data.length },
    { label: "Active", value: "active", count: count((p) => p.status === "active") },
    { label: "Ongoing", value: "ongoing", count: count((p) => p.status === "ongoing") },
    { label: "Completed", value: "completed", count: count((p) => p.status === "completed") },
    { label: "Industry", value: "industry", count: count((p) => p.type === "industry") },
    { label: "Student", value: "student", count: count((p) => p.type === "student") },
  ];

  return (
    <PageShell>
      <PageHero
        icon={FlaskConical}
        eyebrow="Research in action"
        title="Research"
        highlight="Projects"
        description="Funded research, industry collaborations, and student projects spanning bioprocessing, bioenergy, environment, and agriculture."
      />
      <section className="pb-24">
        <div className="container-xl">
          <FilterBar search={search} onSearch={setSearch} placeholder="Search projects..." options={options} value={filter} onChange={setFilter} />
          {loading ? (
            <LoadingState label="Loading projects..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No projects found" description="Try a different search or filter." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
