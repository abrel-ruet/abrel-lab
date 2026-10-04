"use client";

import CrudPage from "@/components/admin/crud-page";
import type { FieldConfig } from "@/components/admin/entity-form";
import { COLLECTIONS } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/lib/types";

const fields: FieldConfig[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "date", label: "Date", type: "date", required: true, half: true },
  { key: "link", label: "Link (optional)", type: "text", placeholder: "/recruitment or https://...", half: true },
  { key: "description", label: "Description", type: "textarea", required: true, rows: 3 },
];

export default function AdminAnnouncementsPage() {
  return (
    <CrudPage<Announcement>
      collection={COLLECTIONS.announcements}
      title="Announcements"
      description="Short notices shown on the homepage. The four most recent are displayed."
      itemLabel="Announcement"
      fields={fields}
      orderByField="date"
      orderDirection="desc"
      defaults={() => ({ date: new Date().toISOString().slice(0, 10) })}
      searchKeys={["title"]}
      describe={(r) => r.title}
      columns={[
        { key: "title", label: "Title", render: (r) => <span className="text-white font-medium">{r.title}</span> },
        { key: "description", label: "Description", render: (r) => <span className="line-clamp-1 max-w-md block">{r.description}</span> },
        { key: "date", label: "Date", render: (r) => formatDate(r.date, { month: "short", day: "numeric", year: "numeric" }) },
      ]}
    />
  );
}
