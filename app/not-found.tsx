import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import PageShell from "@/components/ui/page-shell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 grid-bg" />
        <div className="glow-orb w-[480px] h-[480px] top-1/4 left-1/2 -translate-x-1/2 bg-aqua-500/15" />
        <div className="relative text-center px-4">
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
            <Sprout className="w-7 h-7 text-leaf-300" />
          </div>
          <p className="font-display text-7xl sm:text-8xl font-bold gradient-text mb-4">404</p>
          <h1 className="text-2xl font-semibold text-white mb-3">This page hasn&apos;t grown yet</h1>
          <p className="text-ink-300 mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
          <Link href="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
