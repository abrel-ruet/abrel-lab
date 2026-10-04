"use client";

import { TriangleAlert, Loader2 } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Confirm Deletion",
  message,
  confirmLabel = "Delete",
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm glass-card !bg-ink-900 overflow-hidden">
        <div className="p-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-400/25 flex items-center justify-center mb-4">
            <TriangleAlert className="w-5 h-5 text-red-300" />
          </div>
          <h2 className="text-base font-semibold text-white mb-2">{title}</h2>
          <p className="text-sm text-ink-300 leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button type="button" onClick={onCancel} disabled={loading} className="btn-ghost !py-2 !px-4">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/85 text-white text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
