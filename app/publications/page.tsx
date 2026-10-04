"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, FileText, Quote, ChevronDown } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import PageHero from "@/components/ui/page-hero";
import FilterBar from "@/components/ui/filter-bar";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import type { Publication, PublicationType } from "@/lib/types";

const typeMeta: Record<PublicationType, { label: string; chip: string }> = {
  journal: { label: "Journal", chip: "chip-aqua" },
  conference: { label: "Conference", chip: "chip-gear" },
  "book-chapter": { label: "Book Chapter", chip: "chip-leaf" },
  patent: { label: "Patent", chip: "chip-leaf" },
  thesis: { label: "Thesis", chip: "" },
};

function PublicationCard({ p }: { p: Publication }) {
  const [open, setOpen] = useState(false);
  const meta = typeMeta[p.type] ?? { label: p.type, chip: "" };
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="glass-card glass-card-hover p-6"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`chip ${meta.chip}`}>{meta.label}</span>
        {typeof p.citations === "number" && p.citations > 0 && (
          <span className="chip"><Quote className="w-3 h-3" /> {p.citations} citations</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-white leading-snug mb-2">{p.title}</h3>
      <p className="text-sm text-ink-200 mb-1">{p.authors?.join(", ")}</p>
      <p className="text-sm text-ink-400 italic mb-4">{p.venue}</p>

      {p.abstract && (
        <>
          <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-1 text-sm text-aqua-300 hover:text-aqua-200 mb-2">
            {open ? "Hide abstract" : "Show abstract"}
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && <p className="text-sm text-ink-300 leading-relaxed mb-4">{p.abstract}</p>}
        </>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.06]">
        {p.keywords?.slice(0, 5).map((k) => (
          <span key={k} className="text-xs text-ink-400">#{k}</span>
        ))}
        <div className="ml-auto flex gap-2">
          {p.doi && (
            <a href={p.doi.startsWith("http") ? p.doi : `https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-1.5 !px-3 !text-xs">
              <ExternalLink className="w-3.5 h-3.5" /> DOI
            </a>
          )}
          {p.pdfUrl && (
            <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-1.5 !px-3 !text-xs">
              <FileText className="w-3.5 h-3.5" /> PDF
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function PublicationsPage() {
  const { data, loading, error } = useLiveCollection<Publication>(COLLECTIONS.publications, {
    orderByField: "year",
    orderDirection: "desc",
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(
      (p) =>
        (filter === "all" || p.type === filter) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.venue?.toLowerCase().includes(q) ||
          p.authors?.some((a) => a.toLowerCase().includes(q)) ||
          p.keywords?.some((k) => k.toLowerCase().includes(q)))
    );
  }, [data, search, filter]);

  const byYear = useMemo(() => {
    const map = new Map<number, Publication[]>();
    filtered.forEach((p) => map.set(p.year, [...(map.get(p.year) ?? []), p]));
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const types = Object.keys(typeMeta) as PublicationType[];
  const options = [
    { label: "All", value: "all", count: data.length },
    ...types
      .map((t) => ({ label: typeMeta[t].label, value: t, count: data.filter((p) => p.type === t).length }))
      .filter((o) => o.count > 0),
  ];

  return (
    <PageShell>
      <PageHero
        icon={BookOpen}
        eyebrow="Research output"
        title="Our"
        highlight="Publications"
        description="Peer-reviewed journal articles, conference papers, book chapters, and patents from ABREL researchers."
      />
      <section className="pb-24">
        <div className="container-xl">
          <FilterBar search={search} onSearch={setSearch} placeholder="Search title, author, keyword..." options={options} value={filter} onChange={setFilter} />

          {loading ? (
            <LoadingState label="Loading publications..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No publications found" description="Try a different search or filter." />
          ) : (
            <div className="space-y-14">
              {byYear.map(([year, pubs]) => (
                <div key={year} className="grid lg:grid-cols-[120px_1fr] gap-6">
                  <div className="lg:sticky lg:top-28 h-fit">
                    <p className="font-display text-3xl font-bold gradient-text">{year}</p>
                    <p className="text-xs text-ink-400">{pubs.length} paper{pubs.length > 1 ? "s" : ""}</p>
                  </div>
                  <div className="space-y-4">
                    {pubs.map((p) => <PublicationCard key={p.id} p={p} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
