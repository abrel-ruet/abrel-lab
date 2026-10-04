"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Menu, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AdminSidebar from "@/components/admin/sidebar";
import { siteConfig } from "@/lib/site-config";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-aqua-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-red-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Not authorized</h1>
          <p className="text-sm text-ink-300 mb-2">
            You&apos;re signed in as <span className="text-white">{user.email}</span>, but this account isn&apos;t an ABREL admin.
          </p>
          <p className="text-xs text-ink-500 mb-6 break-all">
            To grant access, create a document in the Firestore <code className="text-aqua-300">admins</code> collection with ID <code className="text-aqua-300">{user.uid}</code>.
          </p>
          <button onClick={logout} className="btn-ghost">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 flex">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-ink-950/90 backdrop-blur">
          <button onClick={() => setMenuOpen(true)} className="p-2 -ml-2 text-ink-200 hover:text-white" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-display font-bold text-white">{siteConfig.shortName} <span className="gradient-text">Admin</span></p>
        </div>
        <main className="px-4 py-8 sm:px-8 lg:px-10 lg:py-10 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
