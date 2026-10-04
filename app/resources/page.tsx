"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Database, FileSpreadsheet, ClipboardList, Wrench, Code, FileText, ArrowUpRight, Star, type LucideIcon } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import PageHero from "@/components/ui/page-hero";
import FilterBar from "@/components/ui/filter-bar";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import type { Resource, ResourceType } from "@/lib/types";

const typeMeta: Record<ResourceType, { label: string; icon: LucideIcon; tone: string }> = {
  dataset: { label: "Dataset", icon: FileSpreadsheet, tone: "text-aqua-300 bg-aqua-500/10 border-aqua-400/25" },
  protocol: { label: "Protocol", icon: ClipboardList, tone: "text-leaf-300 bg-leaf-500/10 border-leaf-400/25" },
  tool: { label: "Tool", icon: Wrench, tone: "text-gear-300 bg-gear-500/10 border-gear-400/25" },
  code: { label: "Code", icon: Code, tone: "text-aqua-200 bg-aqua-400/10 border-aqua-300/25" },
  paper: { label: "Paper", icon: FileText, tone: "text-leaf-200 bg-leaf-400/10 border-leaf-300/25" },
};

export default function ResourcesPage() {
  const { data, loading, error } = useLiveCollection<Resource>(COLLECTIONS.resources);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data
      .filter(
        (r) =>
          (filter === "all" || r.resourceType === filter) &&
          (!q ||
            r.title.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q) ||
            r.category?.toLowerCase().includes(q) ||
            r.tags?.some((t) => t.toLowerCase().includes(q)))
      )
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title));
  }, [data, search, filter]);

  const options = [
    { label: "All", value: "all", count: data.length },
    ...(Object.keys(typeMeta) as ResourceType[])
      .map((t) => ({ label: typeMeta[t].label + "s", value: t, count: data.filter((r) => r.resourceType === t).length }))
      .filter((o) => o.count > 0),
  ];

  return (
    <PageShell>
      <PageHero
        icon={Database}
        eyebrow="Open science"
        title="Lab"
        highlight="Resources"
        description="Datasets, laboratory protocols, software tools, and code shared by ABREL to support reproducible bio-resources research."
      />
      <section className="pb-24">
        <div className="container-xl">
          <FilterBar search={search} onSearch={setSearch} placeholder="Search resources..." options={options} value={filter} onChange={setFilter} />
          {loading ? (
            <LoadingState label="Loading resources..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No resources found" description="Try a different search or filter." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((r, i) => {
                const meta = typeMeta[r.resourceType] ?? typeMeta.dataset;
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
                  >
                    <Link href={`/resources/${r.slug}`} className="group glass-card glass-card-hover flex flex-col h-full p-6">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${meta.tone}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {r.featured && <span className="chip"><Star className="w-3 h-3 text-leaf-300" /> Featured</span>}
                      </div>
                      <p className="text-xs text-ink-400 mb-1.5">{meta.label} · {r.category}</p>
                      <h3 className="font-semibold text-white leading-snug mb-2.5 group-hover:text-aqua-200 transition-colors">{r.title}</h3>
                      <p className="text-sm text-ink-300 line-clamp-3 mb-5">{r.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {r.tags?.slice(0, 3).map((t) => <span key={t} className="text-xs text-ink-400">#{t}</span>)}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-ink-500 group-hover:text-aqua-300 transition-colors shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
