"use client";

import { useMemo } from "react";
import Link from "next/link";
import CrudPage from "@/components/admin/crud-page";
import type { FieldConfig } from "@/components/admin/entity-form";
import Avatar from "@/components/ui/avatar";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import { descendantIds } from "@/lib/team-tree";
import { sortByHierarchy, type ResearchDomain, type TeamMember } from "@/lib/types";

const typeLabel: Record<string, string> = { professor: "Faculty", researcher: "Researcher", student: "Student", alumni: "Alumni" };

function buildFields(domains: ResearchDomain[], members: TeamMember[], editing: TeamMember | null): FieldConfig[] {
  // A member can't report to themselves or to anyone already below them.
  const blocked = editing ? descendantIds(members, editing.id) : new Set<string>();
  const supervisorOptions = sortByHierarchy(members)
    .filter((m) => !blocked.has(m.id) && m.memberType !== "alumni")
    .map((m) => ({ label: `${m.name} — ${typeLabel[m.memberType] ?? m.memberType}`, value: m.id }));

  return [
    { key: "image", label: "Photo", type: "image" },
    { key: "name", label: "Full Name", type: "text", required: true, placeholder: "e.g., Dr. Jane Doe", half: true },
    { key: "slug", label: "URL Slug", type: "text", required: true, placeholder: "e.g., jane-doe", slugFrom: "name", half: true, helpText: "Used in the profile URL. Click the wand to generate." },
    {
      key: "memberType",
      label: "Member Type",
      type: "select",
      required: true,
      half: true,
      options: [
        { label: "Faculty / Professor", value: "professor" },
        { label: "Researcher / Postdoc", value: "researcher" },
        { label: "Student", value: "student" },
        { label: "Alumni", value: "alumni" },
      ],
    },
    { key: "designation", label: "Designation", type: "text", required: true, placeholder: "e.g., PhD Researcher", half: true },
    {
      key: "domainId",
      label: "Research Domain",
      type: "select",
      half: true,
      options: sortByHierarchy(domains).map((d) => ({ label: d.name, value: d.id })),
      helpText: domains.length ? "Faculty assigned to a domain appear as its leads." : "Create domains under Research Domains first.",
    },
    {
      key: "supervisorId",
      label: "Works Under (Supervisor)",
      type: "select",
      half: true,
      options: supervisorOptions,
      helpText: "Choose a student to nest this member under them in the hierarchy, or a faculty member.",
    },
    { key: "order", label: "Display Order", type: "number", required: true, half: true, helpText: "Lower numbers appear first among siblings." },
    { key: "email", label: "Email", type: "text", half: true },
    { key: "bio", label: "Biography", type: "richtext" },
    { key: "researchInterests", label: "Research Interests", type: "tags", placeholder: "e.g., Bioprocess, Fermentation, Biogas" },
    { key: "googleScholar", label: "Google Scholar URL", type: "text", half: true },
    { key: "researchGate", label: "ResearchGate URL", type: "text", half: true },
    { key: "linkedin", label: "LinkedIn URL", type: "text", half: true },
    { key: "github", label: "GitHub URL", type: "text", half: true },
  ];
}

export default function AdminTeamPage() {
  const { data: domains } = useLiveCollection<ResearchDomain>(COLLECTIONS.domains);
  const { data: members } = useLiveCollection<TeamMember>(COLLECTIONS.team);
  const domainName = useMemo(() => new Map(domains.map((d) => [d.id, d.name])), [domains]);
  const memberName = useMemo(() => new Map(members.map((m) => [m.id, m.name])), [members]);

  return (
    <CrudPage<TeamMember>
      collection={COLLECTIONS.team}
      title="Team Members"
      description="Manage faculty, researchers, students, and alumni — and who works under whom in each research domain."
      itemLabel="Member"
      fields={(rows, editing) => buildFields(domains, rows, editing)}
      sort={sortByHierarchy}
      defaults={(rows) => ({ order: rows.length + 1 })}
      searchKeys={["name", "designation", "email"]}
      describe={(r) => r.name}
      columns={[
        {
          key: "name",
          label: "Name",
          render: (r) => (
            <div className="flex items-center gap-3">
              <Avatar name={r.name} image={r.image} size="sm" />
              <div className="min-w-0">
                <Link href={`/team/${r.slug}`} target="_blank" className="text-white font-medium hover:text-aqua-300">{r.name}</Link>
                <p className="text-xs text-ink-400">{r.designation}</p>
              </div>
            </div>
          ),
        },
        { key: "memberType", label: "Type", render: (r) => <span className="chip">{typeLabel[r.memberType] ?? r.memberType}</span> },
        { key: "domainId", label: "Domain", render: (r) => <span className="line-clamp-1 max-w-[12rem] block">{domainName.get(r.domainId ?? "") ?? <span className="text-ink-500">—</span>}</span> },
        { key: "supervisorId", label: "Works Under", render: (r) => memberName.get(r.supervisorId ?? "") ?? <span className="text-ink-500">—</span> },
        { key: "order", label: "Order" },
      ]}
    />
  );
}
