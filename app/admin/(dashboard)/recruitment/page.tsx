"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/page-header";
import DataTable from "@/components/admin/data-table";
import DetailModal, { DetailField } from "@/components/admin/detail-modal";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS, updateDocById, deleteDocById } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { RecruitmentApplication, RecruitmentStatus } from "@/lib/types";

const statusStyles: Record<RecruitmentStatus, string> = {
  pending: "text-leaf-300 border-leaf-400/30 bg-leaf-500/10",
  reviewed: "text-aqua-300 border-aqua-400/30 bg-aqua-500/10",
  accepted: "text-gear-200 border-gear-400/30 bg-gear-500/15",
  rejected: "text-red-300 border-red-400/30 bg-red-500/10",
};

function StatusSelect({ row, onChange }: { row: RecruitmentApplication; onChange: (s: RecruitmentStatus) => void }) {
  const status = row.status || "pending";
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as RecruitmentStatus)}
      className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize cursor-pointer focus:outline-none ${statusStyles[status]}`}
    >
      <option value="pending">Pending</option>
      <option value="reviewed">Reviewed</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
  );
}

export default function AdminRecruitmentPage() {
  const { data, loading, error } = useLiveCollection<RecruitmentApplication>(COLLECTIONS.recruitment, {
    orderByField: "submittedAt",
    orderDirection: "desc",
  });
  const [viewingId, setViewingId] = useState<string | null>(null);
  const viewing = data.find((d) => d.id === viewingId) ?? null;

  const setStatus = (row: RecruitmentApplication, status: RecruitmentStatus) =>
    updateDocById(COLLECTIONS.recruitment, row.id, { status });

  return (
    <div>
      <PageHeader title="Recruitment Applications" description="Applications submitted through the Join the Lab form." />
      <DataTable
        columns={[
          { key: "name", label: "Name", render: (r) => <span className="text-white font-medium">{r.name}</span> },
          { key: "email", label: "Email" },
          { key: "researchTrack", label: "Track", render: (r) => <span className="line-clamp-1 max-w-[14rem] block">{r.researchTrack}</span> },
          { key: "degree", label: "Degree" },
          { key: "submittedAt", label: "Submitted", render: (r) => formatDate(r.submittedAt, { month: "short", day: "numeric", year: "numeric" }) },
          { key: "status", label: "Status", render: (r) => <StatusSelect row={r} onChange={(s) => setStatus(r, s)} /> },
        ]}
        rows={data}
        loading={loading}
        error={error}
        searchKeys={["name", "email", "researchTrack", "university"]}
        onView={(r) => setViewingId(r.id)}
        onDelete={(r) => deleteDocById(COLLECTIONS.recruitment, r.id)}
        deleteMessage={(r) => `Delete application from "${r.name}"? This cannot be undone.`}
        emptyMessage="No applications yet."
      />

      <DetailModal open={!!viewing} title="Application Details" onClose={() => setViewingId(null)}>
        {viewing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2 flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <p className="text-lg font-semibold text-white">{viewing.name}</p>
                <p className="text-xs text-ink-400">Submitted {formatDate(viewing.submittedAt)}</p>
              </div>
              <StatusSelect row={viewing} onChange={(s) => setStatus(viewing, s)} />
            </div>
            <DetailField label="Email" value={viewing.email} href={`mailto:${viewing.email}`} />
            <DetailField label="Phone" value={viewing.phone} />
            <DetailField label="University" value={viewing.university} />
            <DetailField label="Degree" value={viewing.degree} />
            <DetailField label="CGPA" value={viewing.cgpa} />
            <DetailField label="Batch / Year" value={viewing.batch} />
            <div className="sm:col-span-2"><DetailField label="Research Track" value={viewing.researchTrack} /></div>
            <div className="sm:col-span-2"><DetailField label="Specific Interests" value={viewing.interests} /></div>
            <div className="sm:col-span-2"><DetailField label="Prior Experience" value={viewing.experience} /></div>
            <div className="sm:col-span-2"><DetailField label="Proposed Research Title" value={viewing.proposalTitle} /></div>
            <div className="sm:col-span-2"><DetailField label="Research Idea" value={viewing.proposalDesc} /></div>
            <div className="sm:col-span-2"><DetailField label="Statement of Purpose" value={viewing.sop} /></div>
            {viewing.cvUrl && <div className="sm:col-span-2"><DetailField label="CV / Resume" value="Open attached file" href={viewing.cvUrl} /></div>}
          </div>
        )}
      </DetailModal>
    </div>
  );
}
