"use client";

import { Plus } from "lucide-react";

export default function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-ink-400 mt-1">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary shrink-0 !py-2.5">
          <Plus className="w-4 h-4" /> {actionLabel}
        </button>
      )}
    </div>
  );
}
