"use client";

import CrudPage from "@/components/admin/crud-page";
import type { FieldConfig } from "@/components/admin/entity-form";
import { COLLECTIONS } from "@/lib/firestore";
import type { Publication } from "@/lib/types";

const fields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true, slugFrom: "title", half: true },
  {
    key: "type",
    label: "Type",
    type: "select",
    required: true,
    half: true,
    options: [
      { label: "Journal", value: "journal" },
      { label: "Conference", value: "conference" },
      { label: "Book Chapter", value: "book-chapter" },
      { label: "Patent", value: "patent" },
      { label: "Thesis", value: "thesis" },
    ],
  },
  { key: "authors", label: "Authors", type: "tags", required: true, placeholder: "Comma-separated, in order", helpText: "Use names exactly as on team profiles (without Prof./Dr.) to link publications to members." },
  { key: "venue", label: "Venue (Journal / Conference)", type: "text", required: true },
  { key: "year", label: "Year", type: "number", required: true, half: true },
  { key: "citations", label: "Citations", type: "number", half: true },
  { key: "doi", label: "DOI", type: "text", placeholder: "10.xxxx/xxxxx", half: true },
  { key: "pdfUrl", label: "PDF", type: "file" },
  { key: "abstract", label: "Abstract", type: "textarea", rows: 5 },
  { key: "keywords", label: "Keywords", type: "tags" },
];

export default function AdminPublicationsPage() {
  return (
    <CrudPage<Publication>
      collection={COLLECTIONS.publications}
      title="Publications"
      description="Journal articles, conference papers, chapters, patents, and theses."
      itemLabel="Publication"
      fields={fields}
      orderByField="year"
      orderDirection="desc"
      defaults={() => ({ year: new Date().getFullYear() })}
      searchKeys={["title", "venue"]}
      describe={(r) => r.title}
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="text-white font-medium line-clamp-2 max-w-md block">{r.title}</span> },
        { key: "type", label: "Type", render: (r) => <span className="chip capitalize">{r.type}</span> },
        { key: "venue", label: "Venue", render: (r) => <span className="line-clamp-1 max-w-xs block">{r.venue}</span> },
        { key: "year", label: "Year" },
      ]}
    />
  );
}
