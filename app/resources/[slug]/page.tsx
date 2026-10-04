import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download, ExternalLink, Tag } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { fetchDocByField, COLLECTIONS } from "@/lib/firestore";
import { toHtml } from "@/lib/utils";
import type { Resource } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getResource(slug: string) {
  return fetchDocByField<Resource>(COLLECTIONS.resources, "slug", decodeURIComponent(slug));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resource = await getResource((await params).slug).catch(() => null);
  return { title: resource?.title ?? "Resource", description: resource?.description };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) notFound();

  return (
    <PageShell>
      <article className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 grid-bg" />
        <div className="glow-orb w-[480px] h-[480px] -top-56 left-1/3 bg-gear-500/15" />
        <div className="container-xl relative max-w-3xl">
          <Link href="/resources" className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-white mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="chip chip-aqua capitalize">{resource.resourceType}</span>
            {resource.category && <span className="chip"><Tag className="w-3 h-3" /> {resource.category}</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">{resource.title}</h1>
          <p className="text-lg text-ink-300 leading-relaxed mb-8">{resource.description}</p>

          <div className="flex flex-wrap gap-3 mb-10">
            {resource.fileUrl && (
              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Download className="w-4 h-4" /> Download
              </a>
            )}
            {resource.externalUrl && (
              <a href={resource.externalUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <ExternalLink className="w-4 h-4" /> Open external link
              </a>
            )}
          </div>

          {resource.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resource.coverImage} alt={resource.title} className="w-full aspect-video object-cover rounded-2xl mb-10 border border-white/[0.08]" />
          )}

          {resource.content && (
            <div
              className="glass-card p-6 sm:p-8 prose prose-invert max-w-none prose-p:text-ink-200 prose-a:text-aqua-300 prose-headings:text-white"
              dangerouslySetInnerHTML={{ __html: toHtml(resource.content) }}
            />
          )}

          {resource.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-white/[0.06]">
              {resource.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
            </div>
          )}
        </div>
      </article>
    </PageShell>
  );
}
