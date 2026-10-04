import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Tag, ArrowLeft, User } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { fetchDocByField, COLLECTIONS } from "@/lib/firestore";
import { formatDate, toHtml } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  return fetchDocByField<NewsArticle>(COLLECTIONS.news, "slug", decodeURIComponent(slug));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await getArticle((await params).slug).catch(() => null);
  return {
    title: article?.title ?? "News",
    description: article?.excerpt,
    openGraph: article?.coverImage ? { images: [{ url: article.coverImage }] } : undefined,
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <PageShell>
      <article className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 grid-bg" />
        <div className="glow-orb w-[480px] h-[480px] -top-56 left-1/2 -translate-x-1/2 bg-aqua-500/15" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-white mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>

          <span className="chip chip-aqua mb-6"><Tag className="w-3 h-3" /> {article.category}</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-400 mb-10 pb-8 border-b border-white/[0.06]">
            <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {formatDate(article.publishedDate)}</span>
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {article.author}</span>
          </div>

          {article.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverImage} alt={article.title} className="w-full aspect-video object-cover rounded-2xl mb-10 border border-white/[0.08]" />
          )}

          <div
            className="prose prose-lg prose-invert max-w-none prose-p:text-ink-200 prose-headings:text-white prose-a:text-aqua-300 hover:prose-a:text-aqua-200 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: toHtml(article.content) }}
          />

          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/[0.06]">
              {article.tags.map((tag) => <span key={tag} className="chip">#{tag}</span>)}
            </div>
          )}
        </div>
      </article>
    </PageShell>
  );
}
