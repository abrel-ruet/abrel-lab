import { Loader2, Sprout } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-400">
      <Loader2 className="w-7 h-7 text-aqua-400 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center text-center gap-3 px-6 py-20">
      <div className="w-14 h-14 rounded-2xl bg-leaf-500/10 border border-leaf-400/20 flex items-center justify-center">
        <Sprout className="w-6 h-6 text-leaf-300" />
      </div>
      <p className="text-white font-semibold">{title}</p>
      {description && <p className="text-sm text-ink-400 max-w-md">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="glass-card border-red-400/20 px-6 py-10 text-center">
      <p className="text-red-300 font-medium mb-1">Couldn&apos;t load content</p>
      <p className="text-sm text-ink-400">{message}</p>
    </div>
  );
}
