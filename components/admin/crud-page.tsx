"use client";

import { useState } from "react";
import PageHeader from "./page-header";
import DataTable, { type Column } from "./data-table";
import EntityFormModal, { type FieldConfig } from "./entity-form";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { createDoc, updateDocById, deleteDocById } from "@/lib/firestore";

/** Standard list + create/edit/delete screen for a Firestore collection. */
export default function CrudPage<T extends { id: string }>({
  collection,
  title,
  description,
  itemLabel,
  fields,
  columns,
  orderByField,
  orderDirection,
  sort,
  defaults,
  searchKeys,
  describe,
  transform,
}: {
  collection: string;
  title: string;
  description: string;
  /** Singular noun used in buttons and modal titles, e.g. "Publication". */
  itemLabel: string;
  /** Static fields, or a function of the current rows and the record being edited (for dynamic options). */
  fields: FieldConfig[] | ((rows: T[], editing: T | null) => FieldConfig[]);
  columns: Column<T>[];
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  sort?: (rows: T[]) => T[];
  defaults?: (rows: T[]) => Partial<T>;
  searchKeys?: (keyof T)[];
  /** Name shown in the delete confirmation. */
  describe: (row: T) => string;
  /** Normalize form values before they're saved. */
  transform?: (values: Record<string, unknown>) => Record<string, unknown>;
}) {
  const { data: raw, loading, error } = useLiveCollection<T>(collection, { orderByField, orderDirection });
  const data = sort ? sort(raw) : raw;
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);

  const handleSubmit = async (input: Record<string, unknown>) => {
    const values = transform ? transform(input) : input;
    if (editing) await updateDocById(collection, editing.id, values);
    else await createDoc(collection, values);
  };

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actionLabel={`Add ${itemLabel}`}
        onAction={() => {
          setEditing(null);
          setModalOpen(true);
        }}
      />
      <DataTable
        columns={columns}
        rows={data}
        loading={loading}
        error={error}
        searchKeys={searchKeys}
        onEdit={(row) => {
          setEditing(row);
          setModalOpen(true);
        }}
        onDelete={(row) => deleteDocById(collection, row.id)}
        deleteMessage={(r) => `Delete "${describe(r)}"? This cannot be undone.`}
        emptyMessage={`No ${title.toLowerCase()} yet. Click "Add ${itemLabel}" to create one.`}
      />
      <EntityFormModal
        open={modalOpen}
        title={editing ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
        fields={typeof fields === "function" ? fields(data, editing) : fields}
        initialValues={editing ?? defaults?.(data) ?? {}}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
