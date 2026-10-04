"use client";

import Link from "next/link";
import {
  Users,
  BookOpen,
  FolderKanban,
  Database,
  Newspaper,
  ClipboardList,
  Mail,
  Send,
  ArrowUpRight,
} from "lucide-react";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { ContactMessage, RecruitmentApplication } from "@/lib/types";

type WithId = { id: string };

export default function AdminDashboardPage() {
  const { data: team } = useLiveCollection<WithId>(COLLECTIONS.team);
  const { data: publications } = useLiveCollection<WithId>(COLLECTIONS.publications);
  const { data: projects } = useLiveCollection<WithId>(COLLECTIONS.projects);
  const { data: resources } = useLiveCollection<WithId>(COLLECTIONS.resources);
  const { data: news } = useLiveCollection<WithId>(COLLECTIONS.news);
  const { data: recruitment } = useLiveCollection<RecruitmentApplication>(COLLECTIONS.recruitment, { orderByField: "submittedAt", orderDirection: "desc" });
  const { data: contact } = useLiveCollection<ContactMessage>(COLLECTIONS.contact, { orderByField: "submittedAt", orderDirection: "desc" });
  const { data: newsletter } = useLiveCollection<WithId>(COLLECTIONS.newsletter);

  const pendingApps = recruitment.filter((r) => (r.status ?? "pending") === "pending").length;
  const unread = contact.filter((c) => !c.read).length;

  const cards = [
    { label: "Team Members", value: team.length, icon: Users, href: "/admin/team", tone: "text-leaf-300" },
    { label: "Publications", value: publications.length, icon: BookOpen, href: "/admin/publications", tone: "text-aqua-300" },
    { label: "Projects", value: projects.length, icon: FolderKanban, href: "/admin/projects", tone: "text-gear-300" },
    { label: "Resources", value: resources.length, icon: Database, href: "/admin/resources", tone: "text-aqua-200" },
    { label: "News Articles", value: news.length, icon: Newspaper, href: "/admin/news", tone: "text-leaf-200" },
    { label: "Applications", value: recruitment.length, icon: ClipboardList, href: "/admin/recruitment", tone: "text-gear-200", badge: pendingApps ? `${pendingApps} pending` : undefined },
    { label: "Messages", value: contact.length, icon: Mail, href: "/admin/contact", tone: "text-aqua-300", badge: unread ? `${unread} unread` : undefined },
    { label: "Subscribers", value: newsletter.length, icon: Send, href: "/admin/newsletter", tone: "text-leaf-300" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-ink-400 mb-8">Overview of ABREL&apos;s live content and submissions.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} href={c.href} className="glass-card glass-card-hover p-5 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-ink-800 border border-white/[0.06] flex items-center justify-center">
                  <Icon className={`w-4.5 h-4.5 ${c.tone}`} />
                </div>
                {c.badge ? <span className="chip chip-leaf !text-[10px]">{c.badge}</span> : <ArrowUpRight className="w-4 h-4 text-ink-500 group-hover:text-aqua-300" />}
              </div>
              <p className="text-3xl font-display font-bold text-white">{c.value}</p>
              <p className="text-xs text-ink-400 mt-1">{c.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent applications</h2>
            <Link href="/admin/recruitment" className="text-xs text-aqua-300 hover:underline">View all</Link>
          </div>
          {recruitment.length === 0 ? (
            <p className="text-sm text-ink-400 py-6 text-center">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {recruitment.slice(0, 5).map((r) => (
                <li key={r.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{r.name}</p>
                    <p className="text-xs text-ink-400 truncate">{r.researchTrack}</p>
                  </div>
                  <span className="text-xs text-ink-500 shrink-0">{formatDate(r.submittedAt, { month: "short", day: "numeric" })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent messages</h2>
            <Link href="/admin/contact" className="text-xs text-aqua-300 hover:underline">View all</Link>
          </div>
          {contact.length === 0 ? (
            <p className="text-sm text-ink-400 py-6 text-center">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {contact.slice(0, 5).map((m) => (
                <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    {!m.read && <span className="w-2 h-2 rounded-full bg-leaf-400 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{m.subject}</p>
                      <p className="text-xs text-ink-400 truncate">{m.name}</p>
                    </div>
                  </div>
                  <span className="text-xs text-ink-500 shrink-0">{formatDate(m.submittedAt, { month: "short", day: "numeric" })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
