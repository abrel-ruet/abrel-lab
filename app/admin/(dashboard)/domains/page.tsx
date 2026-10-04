"use client";

import { useMemo } from "react";
import CrudPage from "@/components/admin/crud-page";
import type { FieldConfig } from "@/components/admin/entity-form";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import { sortByHierarchy, type ResearchDomain, type TeamMember } from "@/lib/types";

const fields: FieldConfig[] = [
  { key: "name", label: "Domain Name", type: "text", required: true, placeholder: "e.g., Environmental Biotechnology" },
  { key: "slug", label: "Slug", type: "text", required: true, slugFrom: "name", half: true },
  { key: "order", label: "Display Order", type: "number", required: true, half: true },
  { key: "description", label: "Short Description", type: "textarea", rows: 3 },
];

export default function AdminDomainsPage() {
  const { data: members } = useLiveCollection<TeamMember>(COLLECTIONS.team);
  const counts = useMemo(() => {
    const c = new Map<string, number>();
    members.forEach((m) => m.domainId && c.set(m.domainId, (c.get(m.domainId) ?? 0) + 1));
    return c;
  }, [members]);

  return (
    <CrudPage<ResearchDomain>
      collection={COLLECTIONS.domains}
      title="Research Domains"
      description="Subject domains that group students in the team hierarchy. Assign members to a domain from Team Members."
      itemLabel="Domain"
      fields={fields}
      sort={(rows) => sortByHierarchy(rows.map((r) => ({ ...r, name: r.name ?? "" })))}
      defaults={(rows) => ({ order: rows.length + 1 })}
      searchKeys={["name"]}
      describe={(r) => `${r.name}${counts.get(r.id) ? ` — ${counts.get(r.id)} members will become unassigned` : ""}`}
      columns={[
        { key: "name", label: "Domain", render: (r) => <span className="text-white font-medium">{r.name}</span> },
        { key: "description", label: "Description", render: (r) => <span className="line-clamp-1 max-w-md block">{r.description}</span> },
        { key: "members", label: "Members", render: (r) => <span className="chip chip-aqua">{counts.get(r.id) ?? 0}</span> },
        { key: "order", label: "Order" },
      ]}
    />
  );
}
