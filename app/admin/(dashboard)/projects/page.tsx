"use client";

import CrudPage from "@/components/admin/crud-page";
import type { FieldConfig } from "@/components/admin/entity-form";
import { COLLECTIONS } from "@/lib/firestore";
import { researchAreas } from "@/lib/site-config";
import type { Project } from "@/lib/types";

const fields: FieldConfig[] = [
  { key: "coverImage", label: "Cover Image", type: "image" },
  { key: "title", label: "Title", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true, slugFrom: "title", half: true },
  {
    key: "researchArea",
    label: "Research Area",
    type: "select",
    required: true,
    half: true,
    options: researchAreas.map((a) => ({ label: a.title, value: a.title })),
  },
  {
    key: "type",
    label: "Project Type",
    type: "select",
    required: true,
    half: true,
    options: [
      { label: "Research", value: "research" },
      { label: "Industry", value: "industry" },
      { label: "Student", value: "student" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    half: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Ongoing", value: "ongoing" },
      { label: "Completed", value: "completed" },
    ],
  },
  { key: "startDate", label: "Start", type: "month", required: true, half: true },
  { key: "endDate", label: "End (leave blank if ongoing)", type: "month", half: true },
  { key: "description", label: "Short Description", type: "textarea", required: true, rows: 3 },
  { key: "fullDescription", label: "Full Description", type: "richtext" },
  { key: "team", label: "Team Members", type: "tags" },
  { key: "technologies", label: "Methods & Tools", type: "tags" },
  { key: "funding", label: "Funding Source", type: "text", half: true },
  { key: "liveUrl", label: "Project Website", type: "text", half: true },
  { key: "featured", label: "Feature this project", type: "checkbox" },
];

export default function AdminProjectsPage() {
  return (
    <CrudPage<Project>
      collection={COLLECTIONS.projects}
      title="Projects"
      description="Research, industry, and student projects."
      itemLabel="Project"
      fields={fields}
      orderByField="startDate"
      orderDirection="desc"
      defaults={() => ({ status: "active", type: "research", featured: false })}
      searchKeys={["title", "researchArea"]}
      describe={(r) => r.title}
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="text-white font-medium">{r.title}</span> },
        { key: "researchArea", label: "Area", render: (r) => <span className="line-clamp-1 max-w-[14rem] block">{r.researchArea}</span> },
        { key: "status", label: "Status", render: (r) => <span className="chip capitalize">{r.status}</span> },
        { key: "featured", label: "Featured", render: (r) => (r.featured ? <span className="chip chip-leaf">Yes</span> : <span className="text-ink-500">-</span>) },
      ]}
    />
  );
}
