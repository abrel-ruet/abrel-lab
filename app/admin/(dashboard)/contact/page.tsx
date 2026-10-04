"use client";

import { useState } from "react";
import { Reply } from "lucide-react";
import PageHeader from "@/components/admin/page-header";
import DataTable from "@/components/admin/data-table";
import DetailModal, { DetailField } from "@/components/admin/detail-modal";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS, updateDocById, deleteDocById } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/lib/types";

export default function AdminContactPage() {
  const { data, loading, error } = useLiveCollection<ContactMessage>(COLLECTIONS.contact, {
    orderByField: "submittedAt",
    orderDirection: "desc",
  });
  const [viewing, setViewing] = useState<ContactMessage | null>(null);

  const handleView = async (row: ContactMessage) => {
    setViewing(row);
    if (!row.read) await updateDocById(COLLECTIONS.contact, row.id, { read: true });
  };

  return (
    <div>
      <PageHeader title="Contact Messages" description="Messages submitted through the public contact form." />
      <DataTable
        columns={[
          {
            key: "name",
            label: "From",
            render: (r) => (
              <div className="flex items-center gap-2">
                {!r.read && <span className="w-2 h-2 rounded-full bg-leaf-400 shrink-0" title="Unread" />}
                <span className={r.read ? "text-ink-200" : "text-white font-semibold"}>{r.name}</span>
              </div>
            ),
          },
          { key: "email", label: "Email" },
          { key: "subject", label: "Subject", render: (r) => <span className="line-clamp-1 max-w-xs block">{r.subject}</span> },
          { key: "submittedAt", label: "Received", render: (r) => formatDate(r.submittedAt, { month: "short", day: "numeric", year: "numeric" }) },
        ]}
        rows={data}
        loading={loading}
        error={error}
        searchKeys={["name", "email", "subject"]}
        onView={handleView}
        onDelete={(r) => deleteDocById(COLLECTIONS.contact, r.id)}
        deleteMessage={(r) => `Delete message from "${r.name}"? This cannot be undone.`}
        emptyMessage="No messages yet."
      />

      <DetailModal open={!!viewing} title="Message" onClose={() => setViewing(null)}>
        {viewing && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <DetailField label="Name" value={viewing.name} />
              <DetailField label="Email" value={viewing.email} />
              <DetailField label="Received" value={formatDate(viewing.submittedAt)} />
            </div>
            <DetailField label="Subject" value={viewing.subject} />
            <DetailField label="Message" value={viewing.message} />
            <a href={`mailto:${viewing.email}?subject=${encodeURIComponent("Re: " + viewing.subject)}`} className="btn-primary !py-2.5">
              <Reply className="w-4 h-4" /> Reply by email
            </a>
          </div>
        )}
      </DetailModal>
    </div>
  );
}
