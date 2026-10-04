"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Mail, ArrowUpRight, Network, LayoutGrid } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import PageHero from "@/components/ui/page-hero";
import FilterBar from "@/components/ui/filter-bar";
import Avatar from "@/components/ui/avatar";
import { DomainTree } from "@/components/team/research-tree";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import { buildDomainTrees } from "@/lib/team-tree";
import { sortByHierarchy, type MemberType, type ResearchDomain, type TeamMember } from "@/lib/types";
import { stripHtml } from "@/lib/utils";

const groups: { value: MemberType; label: string; heading: string }[] = [
  { value: "professor", label: "Faculty", heading: "Faculty Members" },
  { value: "researcher", label: "Researchers", heading: "Researchers & Postdocs" },
  { value: "student", label: "Students", heading: "Student Researchers" },
  { value: "alumni", label: "Alumni", heading: "Alumni" },
];

function MemberCard({ m, i, domainName }: { m: TeamMember; i: number; domainName?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
    >
      <Link href={`/team/${m.slug}`} className="group glass-card glass-card-hover flex flex-col h-full p-5">
        <Avatar name={m.name} image={m.image} size="lg" className="mb-5" />
        <h3 className="font-semibold text-white leading-snug group-hover:text-aqua-200 transition-colors">{m.name}</h3>
        <p className="text-sm text-aqua-300 mb-1">{m.designation}</p>
        {domainName && <p className="text-xs text-leaf-300/90 mb-2">{domainName}</p>}
        <p className="text-sm text-ink-400 line-clamp-2 mb-4 mt-1">{stripHtml(m.bio)}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-ink-400 pt-3 border-t border-white/[0.06]">
          {m.email ? (
            <span className="flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{m.email}</span></span>
          ) : <span />}
          <ArrowUpRight className="w-4 h-4 text-ink-500 group-hover:text-aqua-300 transition-colors shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}

function GroupHeading({ title, count, subtitle }: { title: string; count?: number; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="flex-1 divider-glow" />
        {count !== undefined && <span className="text-sm text-ink-400">{count}</span>}
      </div>
      {subtitle && <p className="text-sm text-ink-400 mt-1.5">{subtitle}</p>}
    </div>
  );
}

export default function TeamPage() {
  const { data, loading, error } = useLiveCollection<TeamMember>(COLLECTIONS.team);
  const { data: domains } = useLiveCollection<ResearchDomain>(COLLECTIONS.domains);
  const [view, setView] = useState<"hierarchy" | "directory">("hierarchy");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const domainName = useMemo(() => new Map(domains.map((d) => [d.id, d.name])), [domains]);
  const membersById = useMemo(() => new Map(data.map((m) => [m.id, m])), [data]);
  const trees = useMemo(() => buildDomainTrees(data, domains), [data, domains]);
  const faculty = sortByHierarchy(data.filter((m) => m.memberType === "professor"));
  const alumni = sortByHierarchy(data.filter((m) => m.memberType === "alumni"));

  const members = useMemo(() => {
    const q = search.toLowerCase();
    return sortByHierarchy(data).filter(
      (m) =>
        (filter === "all" || m.memberType === filter) &&
        (!q ||
          m.name.toLowerCase().includes(q) ||
          m.designation?.toLowerCase().includes(q) ||
          domainName.get(m.domainId ?? "")?.toLowerCase().includes(q) ||
          m.researchInterests?.some((r) => r.toLowerCase().includes(q)))
    );
  }, [data, search, filter, domainName]);

  const options = [
    { label: "All", value: "all", count: data.length },
    ...groups.map((g) => ({ label: g.label, value: g.value, count: data.filter((m) => m.memberType === g.value).length })),
  ];

  const viewTabs = [
    { value: "hierarchy" as const, label: "Research Hierarchy", icon: Network },
    { value: "directory" as const, label: "Directory", icon: LayoutGrid },
  ];

  return (
    <PageShell>
      <PageHero
        icon={Users}
        eyebrow="People"
        title="Our"
        highlight="Team"
        description="Faculty, researchers, and students organized by research domain — see who works where, and who mentors whom."
      >
        <div className="mt-8 inline-flex rounded-xl border border-white/[0.08] bg-ink-900/70 p-1">
          {viewTabs.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setView(value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === value ? "bg-aqua-400/15 text-aqua-200" : "text-ink-300 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="pb-24">
        <div className="container-xl">
          {loading ? (
            <LoadingState label="Loading team..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : data.length === 0 ? (
            <EmptyState title="No team members yet" />
          ) : view === "hierarchy" ? (
            <div className="space-y-16">
              {faculty.length > 0 && (
                <div>
                  <GroupHeading title="Faculty" count={faculty.length} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {faculty.map((m, i) => <MemberCard key={m.id} m={m} i={i} domainName={domainName.get(m.domainId ?? "")} />)}
                  </div>
                </div>
              )}

              {trees.length > 0 && (
                <div>
                  <GroupHeading
                    title="Research Domains"
                    count={trees.reduce((s, t) => s + t.size, 0)}
                    subtitle="Each domain shows its student researchers; members nested below someone are working under their supervision."
                  />
                  <div className="grid lg:grid-cols-2 gap-6 items-start">
                    {trees.map((g, i) => (
                      <DomainTree key={g.domain?.id ?? "unassigned"} group={g} index={i} membersById={membersById} />
                    ))}
                  </div>
                </div>
              )}

              {alumni.length > 0 && (
                <div>
                  <GroupHeading title="Alumni" count={alumni.length} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {alumni.map((m, i) => <MemberCard key={m.id} m={m} i={i} domainName={domainName.get(m.domainId ?? "")} />)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <FilterBar search={search} onSearch={setSearch} placeholder="Search by name, domain, interest..." options={options} value={filter} onChange={setFilter} />
              {members.length === 0 ? (
                <EmptyState title="No members found" description="Try a different search or filter." />
              ) : (
                <div className="space-y-16">
                  {groups.map((g) => {
                    const list = members.filter((m) => m.memberType === g.value);
                    if (list.length === 0) return null;
                    return (
                      <div key={g.value}>
                        <GroupHeading title={g.heading} count={list.length} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                          {list.map((m, i) => <MemberCard key={m.id} m={m} i={i} domainName={domainName.get(m.domainId ?? "")} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
