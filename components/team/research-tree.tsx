"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Crown, GitBranch, Users } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import type { DomainGroup, TreeNode } from "@/lib/team-tree";
import type { TeamMember } from "@/lib/types";

const depthTone = [
  { ring: "border-leaf-400/35", text: "text-leaf-300", line: "bg-leaf-400/35", rail: "border-leaf-400/25" },
  { ring: "border-aqua-400/35", text: "text-aqua-300", line: "bg-aqua-400/35", rail: "border-aqua-400/25" },
  { ring: "border-gear-400/35", text: "text-gear-300", line: "bg-gear-400/35", rail: "border-gear-400/25" },
];

function countDescendants(n: TreeNode): number {
  return n.children.reduce((s, c) => s + 1 + countDescendants(c), 0);
}

function Node({ node, depth, supervisorName }: { node: TreeNode; depth: number; supervisorName?: string }) {
  const [open, setOpen] = useState(true);
  const tone = depthTone[depth % depthTone.length];
  const m = node.member;
  const mentees = countDescendants(node);

  return (
    <li className="relative">
      {depth > 0 && <span className={`absolute -left-6 top-8 w-6 h-px ${tone.line}`} aria-hidden />}
      <div className={`group flex items-center gap-3 rounded-xl border ${tone.ring} bg-ink-900/70 px-3 py-2.5 hover:bg-ink-800/80 transition-colors`}>
        <Avatar name={m.name} image={m.image} size="sm" />
        <Link href={`/team/${m.slug}`} className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate group-hover:text-aqua-200 transition-colors">{m.name}</p>
          <p className={`text-xs truncate ${tone.text}`}>
            {m.designation}
            {supervisorName && <span className="text-ink-400"> · under {supervisorName}</span>}
          </p>
        </Link>
        {node.children.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-ink-300 hover:text-white hover:bg-white/[0.05]"
            aria-expanded={open}
            aria-label={open ? "Collapse mentees" : "Expand mentees"}
          >
            <Users className="w-3.5 h-3.5" /> {mentees}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "" : "-rotate-90"}`} />
          </button>
        )}
      </div>

      {open && node.children.length > 0 && (
        <ul className={`mt-2 ml-5 pl-6 border-l ${tone.rail} space-y-2`}>
          {node.children.map((c) => (
            <Node key={c.member.id} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function DomainTree({ group, index, membersById }: { group: DomainGroup; index: number; membersById: Map<string, TeamMember> }) {
  const { domain, leads, roots, size } = group;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 2) * 0.08 }}
      className="glass-card relative overflow-hidden p-5 sm:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-brand-gradient opacity-60" />
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-[11px] font-display text-ink-500 mb-1">{domain ? `DOMAIN ${String(index + 1).padStart(2, "0")}` : "OTHER"}</p>
          <h3 className="text-lg font-semibold text-white leading-snug">{domain?.name ?? "Unassigned"}</h3>
          {domain?.description && <p className="text-sm text-ink-400 mt-1">{domain.description}</p>}
        </div>
        <span className="chip chip-aqua shrink-0"><GitBranch className="w-3 h-3" /> {size}</span>
      </div>

      {leads.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
          <span className="flex items-center gap-1.5 text-xs text-ink-400 mr-1"><Crown className="w-3.5 h-3.5 text-leaf-300" /> Led by</span>
          {leads.map((l) => (
            <Link key={l.id} href={`/team/${l.slug}`} className="chip chip-leaf hover:brightness-125 transition">{l.name}</Link>
          ))}
        </div>
      )}

      {roots.length === 0 ? (
        <p className="text-sm text-ink-500 py-4 text-center">No students in this domain yet.</p>
      ) : (
        <ul className="space-y-2">
          {roots.map((r) => {
            const sup = r.member.supervisorId ? membersById.get(r.member.supervisorId) : undefined;
            const showSup = sup && sup.memberType === "professor" && !leads.some((l) => l.id === sup.id);
            return <Node key={r.member.id} node={r} depth={0} supervisorName={showSup ? sup.name : undefined} />;
          })}
        </ul>
      )}
    </motion.div>
  );
}
