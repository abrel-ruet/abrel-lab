"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderKanban,
  Newspaper,
  Megaphone,
  ShieldCheck,
  ClipboardList,
  Mail,
  Send,
  Database,
  Network,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { siteConfig } from "@/lib/site-config";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/team", label: "Team Members", icon: Users },
      { href: "/admin/domains", label: "Research Domains", icon: Network },
      { href: "/admin/publications", label: "Publications", icon: BookOpen },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/resources", label: "Resources", icon: Database },
      { href: "/admin/news", label: "News", icon: Newspaper },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/admin/certificates", label: "Certificates", icon: ShieldCheck },
    ],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/recruitment", label: "Recruitment", icon: ClipboardList },
      { href: "/admin/contact", label: "Contact Messages", icon: Mail },
      { href: "/admin/newsletter", label: "Newsletter", icon: Send },
    ],
  },
];

export default function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 shrink-0 h-screen flex flex-col border-r border-white/[0.06] bg-ink-900 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/[0.06] flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-aqua-400/30 shrink-0">
            <Image src={siteConfig.logo} alt="" fill sizes="40px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-white leading-tight">
              {siteConfig.shortName} <span className="gradient-text">Admin</span>
            </p>
            {user?.email && <p className="text-[11px] text-ink-400 truncate">{user.email}</p>}
          </div>
          <button onClick={onClose} className="lg:hidden text-ink-400 hover:text-white" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-aqua-400/12 text-aqua-200 border border-aqua-400/25"
                          : "text-ink-300 border border-transparent hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-300 hover:text-white hover:bg-white/[0.04] transition-colors">
            <ExternalLink className="w-4 h-4" /> View Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300/80 hover:text-red-300 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
