"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper, CalendarDays, ArrowRight, User } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import PageHero from "@/components/ui/page-hero";
import FilterBar from "@/components/ui/filter-bar";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

function Cover({ a, className }: { a: NewsArticle; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-leaf-600/20 via-aqua-700/20 to-gear-700/30 ${className}`}>
      {a.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Newspaper className="w-10 h-10 text-aqua-300/40" />
        </div>
      )}
    </div>
  );
}

export default function NewsPage() {
  const { data, loading, error } = useLiveCollection<NewsArticle>(COLLECTIONS.news, {
    orderByField: "publishedDate",
    orderDirection: "desc",
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const categories = useMemo(() => Array.from(new Set(data.map((a) => a.category).filter(Boolean))), [data]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(
      (a) =>
        (filter === "all" || a.category === filter) &&
        (!q || a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q) || a.tags?.some((t) => t.toLowerCase().includes(q)))
    );
  }, [data, search, filter]);

  const featured = filter === "all" && !search ? filtered.find((a) => a.featured) : undefined;
  const rest = filtered.filter((a) => a.id !== featured?.id);

  const options = [
    { label: "All", value: "all", count: data.length },
    ...categories.map((c) => ({ label: c, value: c, count: data.filter((a) => a.category === c).length })),
  ];

  return (
    <PageShell>
      <PageHero
        icon={Newspaper}
        eyebrow="Newsroom"
        title="News &"
        highlight="Updates"
        description="Research milestones, publications, events, and stories from the ABREL community."
      />
      <section className="pb-24">
        <div className="container-xl">
          <FilterBar search={search} onSearch={setSearch} placeholder="Search news..." options={options} value={filter} onChange={setFilter} />
          {loading ? (
            <LoadingState label="Loading news..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No articles found" description="Try a different search or filter." />
          ) : (
            <>
              {featured && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                  <Link href={`/news/${featured.slug}`} className="group glass-card glass-card-hover grid md:grid-cols-2 overflow-hidden">
                    <Cover a={featured} className="aspect-[16/10] md:aspect-auto md:min-h-[320px]" />
                    <div className="p-7 sm:p-10 flex flex-col justify-center">
                      <div className="flex gap-2 mb-4">
                        <span className="chip chip-leaf">Featured</span>
                        <span className="chip chip-aqua">{featured.category}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-aqua-200 transition-colors">{featured.title}</h2>
                      <p className="text-ink-300 leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-ink-400">
                        <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(featured.publishedDate)}</span>
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {featured.author}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
                  >
                    <Link href={`/news/${a.slug}`} className="group glass-card glass-card-hover flex flex-col h-full overflow-hidden">
                      <Cover a={a} className="aspect-[16/9]" />
                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="chip chip-aqua">{a.category}</span>
                          <span className="text-xs text-ink-400">{formatDate(a.publishedDate, { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <h3 className="font-semibold text-white leading-snug mb-3 group-hover:text-aqua-200 transition-colors line-clamp-2">{a.title}</h3>
                        <p className="text-sm text-ink-300 line-clamp-3 mb-5">{a.excerpt}</p>
                        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-aqua-300 group-hover:gap-2.5 transition-all">
                          Read article <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
