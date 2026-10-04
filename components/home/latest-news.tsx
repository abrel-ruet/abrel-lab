"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { useLiveCollection } from "@/lib/hooks/use-collection";
import { COLLECTIONS } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

export default function LatestNews() {
  const { data } = useLiveCollection<NewsArticle>(COLLECTIONS.news, {
    orderByField: "publishedDate",
    orderDirection: "desc",
    limitCount: 3,
  });

  if (data.length === 0) return null;

  return (
    <section className="section-pad">
      <div className="container-xl">
        <SectionHeading
          eyebrow="Stay updated"
          title="Latest"
          highlight="News"
          align="left"
          action={
            <Link href="/news" className="btn-ghost shrink-0">
              All news <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />

        <div className="grid md:grid-cols-3 gap-6">
          {data.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Link href={`/news/${article.slug}`} className="group glass-card glass-card-hover flex flex-col h-full overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-leaf-600/20 via-aqua-700/20 to-gear-700/30">
                  {article.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-aqua-300/40" />
                    </div>
                  )}
                  <span className="chip chip-aqua absolute top-3 left-3 backdrop-blur">{article.category}</span>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 text-xs text-ink-400 mb-3">
                    <CalendarDays className="w-3.5 h-3.5" /> {formatDate(article.publishedDate)}
                  </div>
                  <h3 className="font-semibold text-white leading-snug mb-3 group-hover:text-aqua-200 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-ink-300 line-clamp-3 mb-5">{article.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-aqua-300 group-hover:gap-2.5 transition-all">
                    Read more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
