"use client";

import CrudPage from "@/components/admin/crud-page";
import type { FieldConfig } from "@/components/admin/entity-form";
import { COLLECTIONS } from "@/lib/firestore";
import { siteConfig } from "@/lib/site-config";
import type { Certificate } from "@/lib/types";

const fields: FieldConfig[] = [
  {
    key: "certId",
    label: "Certificate ID",
    type: "text",
    required: true,
    placeholder: `${siteConfig.certificatePrefix}-2025-001`,
    half: true,
    helpText: "Must be uppercase and unique. This is what recipients enter to verify.",
  },
  { key: "date", label: "Issue Date", type: "text", required: true, placeholder: "e.g., September 15, 2025", half: true },
  { key: "name", label: "Recipient Name", type: "text", required: true },
  { key: "achievement", label: "Achievement / Program", type: "text", required: true },
];

export default function AdminCertificatesPage() {
  return (
    <CrudPage<Certificate>
      collection={COLLECTIONS.certificates}
      title="Certificates"
      description="Issued certificates that can be verified on the public verification page."
      itemLabel="Certificate"
      fields={fields}
      defaults={(rows) => ({ certId: `${siteConfig.certificatePrefix}-${new Date().getFullYear()}-${String(rows.length + 1).padStart(3, "0")}` })}
      searchKeys={["certId", "name", "achievement"]}
      describe={(r) => r.certId}
      transform={(v) => ({ ...v, certId: String(v.certId ?? "").trim().toUpperCase() })}
      columns={[
        { key: "certId", label: "ID", render: (r) => <span className="font-mono text-aqua-300">{r.certId}</span> },
        { key: "name", label: "Recipient", render: (r) => <span className="text-white">{r.name}</span> },
        { key: "achievement", label: "Achievement", render: (r) => <span className="line-clamp-1 max-w-sm block">{r.achievement}</span> },
        { key: "date", label: "Date" },
      ]}
    />
  );
}
