import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Users, Wrench, ExternalLink, Landmark, Layers } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { fetchDocByField, COLLECTIONS } from "@/lib/firestore";
import { toHtml } from "@/lib/utils";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusChip: Record<string, string> = { active: "chip-leaf", ongoing: "chip-aqua", completed: "chip-gear" };

async function getProject(slug: string) {
  return fetchDocByField<Project>(COLLECTIONS.projects, "slug", decodeURIComponent(slug));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = await getProject((await params).slug).catch(() => null);
  return { title: project?.title ?? "Project", description: project?.description };
}

function formatMonth(v?: string) {
  if (!v) return "";
  const d = new Date(v.length === 7 ? `${v}-01` : v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const facts = [
    { icon: CalendarDays, label: "Timeline", value: `${formatMonth(project.startDate)} – ${project.endDate ? formatMonth(project.endDate) : "Present"}` },
    { icon: Layers, label: "Research Area", value: project.researchArea },
    { icon: Landmark, label: "Funding", value: project.funding },
  ].filter((f) => f.value);

  return (
    <PageShell>
      <article className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-96 grid-bg" />
        <div className="glow-orb w-[520px] h-[520px] -top-60 right-0 bg-leaf-500/15" />
        <div className="container-xl relative max-w-5xl">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-white mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`chip ${statusChip[project.status] ?? ""} capitalize`}>{project.status}</span>
            <span className="chip capitalize">{project.type} project</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-5">{project.title}</h1>
          <p className="text-lg text-ink-300 leading-relaxed mb-10 max-w-3xl">{project.description}</p>

          {project.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.coverImage} alt={project.title} className="w-full aspect-video object-cover rounded-2xl mb-10 border border-white/[0.08]" />
          )}

          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white mb-4">About the project</h2>
              <div
                className="prose prose-invert max-w-none prose-p:text-ink-200 prose-a:text-aqua-300 prose-headings:text-white"
                dangerouslySetInnerHTML={{ __html: toHtml(project.fullDescription || project.description) }}
              />
            </div>

            <aside className="space-y-5">
              <div className="glass-card p-5 space-y-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="w-4 h-4 text-aqua-300 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-ink-400">{label}</p>
                      <p className="text-sm text-white">{value}</p>
                    </div>
                  </div>
                ))}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full !py-2.5">
                    <ExternalLink className="w-4 h-4" /> Project website
                  </a>
                )}
              </div>

              {project.team?.length > 0 && (
                <div className="glass-card p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white mb-3"><Users className="w-4 h-4 text-leaf-300" /> Team</p>
                  <ul className="space-y-1.5">
                    {project.team.map((t) => <li key={t} className="text-sm text-ink-200">{t}</li>)}
                  </ul>
                </div>
              )}

              {project.technologies?.length > 0 && (
                <div className="glass-card p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white mb-3"><Wrench className="w-4 h-4 text-gear-300" /> Methods & Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
