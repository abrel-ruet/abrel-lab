"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Megaphone, ArrowRight, CalendarDays } from "lucide-react";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/lib/types";

export default function Announcements() {
  const { data: announcements } = useLiveCollection<Announcement>(COLLECTIONS.announcements, {
    orderByField: "date",
    orderDirection: "desc",
    limitCount: 4,
  });

  if (announcements.length === 0) return null;

  return (
    <section className="pb-8">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card relative overflow-hidden p-6 sm:p-8"
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-brand-gradient" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-leaf-500/15 border border-leaf-400/25 flex items-center justify-center">
              <Megaphone className="w-4.5 h-4.5 text-leaf-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Announcements</h2>
              <p className="text-xs text-ink-400">Latest notices from the lab</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {announcements.map((a) => {
              const body = (
                <>
                  <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> {formatDate(a.date, { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <p className="font-medium text-white mb-1 group-hover:text-aqua-200 transition-colors">{a.title}</p>
                  <p className="text-sm text-ink-300 line-clamp-2">{a.description}</p>
                  {a.link && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-aqua-300">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </>
              );
              const cls = "group block rounded-xl border border-white/[0.06] bg-ink-900/60 p-4 transition-colors hover:border-aqua-400/30";
              if (!a.link) return <div key={a.id} className={cls}>{body}</div>;
              return a.link.startsWith("/") ? (
                <Link key={a.id} href={a.link} className={cls}>{body}</Link>
              ) : (
                <a key={a.id} href={a.link} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
