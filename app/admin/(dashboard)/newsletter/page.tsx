"use client";

import { Download } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import DataTable from "@/components/admin/data-table";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS, deleteDocById } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { NewsletterSubscriber } from "@/lib/types";

export default function AdminNewsletterPage() {
  const { data, loading, error } = useLiveCollection<NewsletterSubscriber>(COLLECTIONS.newsletter, {
    orderByField: "subscribedAt",
    orderDirection: "desc",
  });

  const exportCsv = () => {
    const rows = [["email", "subscribedAt"], ...data.map((d) => [d.email, d.subscribedAt ?? ""])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `abrel-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <PageHeader title="Newsletter Subscribers" description={`${data.length} people subscribed through the homepage form.`} />
        {data.length > 0 && (
          <button onClick={exportCsv} className="btn-ghost !py-2.5 shrink-0">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        )}
      </div>
      <DataTable
        columns={[
          { key: "email", label: "Email", render: (r) => <span className="text-white font-medium">{r.email}</span> },
          { key: "subscribedAt", label: "Subscribed", render: (r) => formatDate(r.subscribedAt, { month: "short", day: "numeric", year: "numeric" }) },
        ]}
        rows={data}
        loading={loading}
        error={error}
        searchKeys={["email"]}
        onDelete={(r) => deleteDocById(COLLECTIONS.newsletter, r.id)}
        deleteMessage={(r) => `Remove "${r.email}" from the newsletter list?`}
        emptyMessage="No subscribers yet."
      />
    </div>
  );
}
