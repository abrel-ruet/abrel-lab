"use client";

import CrudPage from "@/components/admin/crud-page";
import type { FieldConfig } from "@/components/admin/entity-form";
import { COLLECTIONS } from "@/lib/firestore";
import type { Resource } from "@/lib/types";

const fields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true, slugFrom: "title", half: true },
  {
    key: "resourceType",
    label: "Type",
    type: "select",
    required: true,
    half: true,
    options: [
      { label: "Dataset", value: "dataset" },
      { label: "Protocol", value: "protocol" },
      { label: "Tool", value: "tool" },
      { label: "Code", value: "code" },
      { label: "Paper", value: "paper" },
    ],
  },
  { key: "category", label: "Category", type: "text", required: true, placeholder: "e.g., Bioenergy", half: true },
  { key: "externalUrl", label: "External Link", type: "text", placeholder: "https://...", half: true },
  { key: "description", label: "Short Description", type: "textarea", required: true, rows: 3 },
  { key: "content", label: "Details", type: "richtext" },
  { key: "fileUrl", label: "Downloadable File", type: "file" },
  { key: "coverImage", label: "Cover Image", type: "image" },
  { key: "tags", label: "Tags", type: "tags" },
  { key: "featured", label: "Feature this resource", type: "checkbox" },
];

export default function AdminResourcesPage() {
  return (
    <CrudPage<Resource>
      collection={COLLECTIONS.resources}
      title="Resources"
      description="Datasets, protocols, tools, and code shared publicly."
      itemLabel="Resource"
      fields={fields}
      defaults={() => ({ featured: false })}
      searchKeys={["title", "category"]}
      describe={(r) => r.title}
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="text-white font-medium">{r.title}</span> },
        { key: "resourceType", label: "Type", render: (r) => <span className="chip capitalize">{r.resourceType}</span> },
        { key: "category", label: "Category" },
        { key: "featured", label: "Featured", render: (r) => (r.featured ? <span className="chip chip-leaf">Yes</span> : <span className="text-ink-500">—</span>) },
      ]}
    />
  );
}
