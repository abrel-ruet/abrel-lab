"use client";

import CrudPage from "@/components/admin/crud-page";
import type { FieldConfig } from "@/components/admin/entity-form";
import { COLLECTIONS } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

const fields: FieldConfig[] = [
  { key: "coverImage", label: "Cover Image", type: "image" },
  { key: "title", label: "Title", type: "text", required: true },
  { key: "slug", label: "Slug", type: "text", required: true, slugFrom: "title", half: true },
  { key: "category", label: "Category", type: "text", required: true, placeholder: "e.g., Lab News", half: true },
  { key: "author", label: "Author", type: "text", required: true, half: true },
  { key: "publishedDate", label: "Publish Date", type: "date", required: true, half: true },
  { key: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 3 },
  { key: "content", label: "Content", type: "richtext" },
  { key: "tags", label: "Tags", type: "tags" },
  { key: "featured", label: "Feature this article", type: "checkbox" },
];

export default function AdminNewsPage() {
  return (
    <CrudPage<NewsArticle>
      collection={COLLECTIONS.news}
      title="News"
      description="Articles and updates shown on the news page and homepage."
      itemLabel="Article"
      fields={fields}
      orderByField="publishedDate"
      orderDirection="desc"
      defaults={() => ({ publishedDate: new Date().toISOString().slice(0, 10), author: "ABREL Communications", featured: false })}
      searchKeys={["title", "category", "author"]}
      describe={(r) => r.title}
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="text-white font-medium line-clamp-2 max-w-md block">{r.title}</span> },
        { key: "category", label: "Category", render: (r) => <span className="chip">{r.category}</span> },
        { key: "publishedDate", label: "Date", render: (r) => formatDate(r.publishedDate, { month: "short", day: "numeric", year: "numeric" }) },
        { key: "featured", label: "Featured", render: (r) => (r.featured ? <span className="chip chip-leaf">Yes</span> : <span className="text-ink-500">—</span>) },
      ]}
    />
  );
}
