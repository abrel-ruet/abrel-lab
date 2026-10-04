"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Loader2, Pencil, Trash2, Eye, Search } from "lucide-react";
import ConfirmDialog from "./confirm-dialog";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  error,
  onEdit,
  onDelete,
  deleteMessage,
  onView,
  searchKeys,
  emptyMessage = "No records yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void | Promise<void>;
  deleteMessage?: (row: T) => string;
  onView?: (row: T) => void;
  /** Fields matched by the table's search box. Omit to hide search. */
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
}) {
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchKeys) return rows;
    return rows.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)));
  }, [rows, query, searchKeys]);

  const confirmDelete = async () => {
    if (!pendingDelete || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const hasActions = onEdit || onDelete || onView;

  return (
    <div>
      {searchKeys && (
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="input-field !pl-10 !py-2.5" />
        </div>
      )}

      {loading ? (
        <div className="glass-card p-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-aqua-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="glass-card p-10 text-center">
          <p className="text-red-300 font-medium mb-1">Failed to load</p>
          <p className="text-sm text-ink-400">{error}</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="glass-card p-16 text-center text-ink-400">
          <p>{query ? "No matching records." : emptyMessage}</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ink-900/50">
                  {columns.map((col) => (
                    <th key={col.key} className="text-left font-medium text-ink-400 uppercase tracking-wider text-[11px] px-5 py-3.5 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  {hasActions && (
                    <th className="text-right font-medium text-ink-400 uppercase tracking-wider text-[11px] px-5 py-3.5">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-5 py-4 text-ink-200 align-middle ${col.className || ""}`}>
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "-")}
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {onView && (
                            <button onClick={() => onView(row)} className="p-2 rounded-lg text-ink-400 hover:text-aqua-300 hover:bg-aqua-400/10 transition-colors" aria-label="View">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button onClick={() => onEdit(row)} className="p-2 rounded-lg text-ink-400 hover:text-aqua-300 hover:bg-aqua-400/10 transition-colors" aria-label="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => setPendingDelete(row)} className="p-2 rounded-lg text-ink-400 hover:text-red-300 hover:bg-red-500/10 transition-colors" aria-label="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        message={pendingDelete ? deleteMessage?.(pendingDelete) ?? "Delete this record? This cannot be undone." : ""}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
