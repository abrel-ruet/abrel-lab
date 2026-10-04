"use client";

import { Search } from "lucide-react";

export default function FilterBar({
  search,
  onSearch,
  placeholder = "Search...",
  options,
  value,
  onChange,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  options: { label: string; value: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="glass-card p-3 sm:p-4 mb-10 flex flex-col lg:flex-row gap-3 lg:items-center">
      <div className="relative lg:w-80 shrink-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="input-field !pl-10"
          aria-label={placeholder}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                active
                  ? "bg-aqua-400/15 border-aqua-400/40 text-aqua-200"
                  : "border-white/[0.06] text-ink-300 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {o.label}
              {o.count !== undefined && <span className={`ml-1.5 text-xs ${active ? "text-aqua-300" : "text-ink-500"}`}>{o.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
