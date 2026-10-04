import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Mail, Briefcase, GraduationCap, Code, BookOpen, Network, UserRound, Users } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import Avatar from "@/components/ui/avatar";
import { fetchDocByField, fetchDocById, fetchCollection, COLLECTIONS, where } from "@/lib/firestore";
import { toHtml } from "@/lib/utils";
import { sortByHierarchy, type Publication, type ResearchDomain, type TeamMember } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getMember(slug: string) {
  return fetchDocByField<TeamMember>(COLLECTIONS.team, "slug", decodeURIComponent(slug));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const member = await getMember((await params).slug).catch(() => null);
  return { title: member?.name ?? "Team Member" };
}

const typeLabel: Record<string, string> = {
  professor: "Faculty",
  researcher: "Researcher",
  student: "Student Researcher",
  alumni: "Alumni",
};

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getMember(slug);
  if (!member) notFound();

  // Publications are linked by author name (authors are stored without honorifics).
  const plainName = member.name.replace(/^((Prof|Dr|Md|Mr|Ms|Mrs)\.\s*)+/gi, "").trim();
  const pubs = await fetchCollection<Publication>(COLLECTIONS.publications, [
    where("authors", "array-contains-any", Array.from(new Set([member.name, plainName]))),
  ]).catch(() => []);
  pubs.sort((a, b) => b.year - a.year);

  const [domain, supervisor, mentees] = await Promise.all([
    member.domainId ? fetchDocById<ResearchDomain>(COLLECTIONS.domains, member.domainId).catch(() => null) : null,
    member.supervisorId ? fetchDocById<TeamMember>(COLLECTIONS.team, member.supervisorId).catch(() => null) : null,
    fetchCollection<TeamMember>(COLLECTIONS.team, [where("supervisorId", "==", member.id)])
      .then(sortByHierarchy)
      .catch(() => [] as TeamMember[]),
  ]);

  const links = [
    member.email && { href: `mailto:${member.email}`, label: member.email, icon: Mail },
    member.googleScholar && { href: member.googleScholar, label: "Google Scholar", icon: GraduationCap },
    member.researchGate && { href: member.researchGate, label: "ResearchGate", icon: BookOpen },
    member.linkedin && { href: member.linkedin, label: "LinkedIn", icon: Briefcase },
    member.github && { href: member.github, label: "GitHub", icon: Code },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Mail }[];

  return (
    <PageShell>
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 grid-bg" />
        <div className="glow-orb w-[500px] h-[500px] -top-60 left-1/4 bg-aqua-500/15" />
        <div className="container-xl relative">
          <Link href="/team" className="inline-flex items-center gap-2 text-sm text-ink-300 hover:text-white mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Team
          </Link>

          <div className="grid lg:grid-cols-[320px_1fr] gap-10">
            <aside className="glass-card p-6 h-fit lg:sticky lg:top-28">
              <Avatar name={member.name} image={member.image} size="lg" className="mb-6" />
              <span className="chip chip-leaf mb-3">{typeLabel[member.memberType] ?? member.memberType}</span>
              <h1 className="text-2xl font-bold text-white mb-1">{member.name}</h1>
              <p className="text-aqua-300 mb-6">{member.designation}</p>
              {(domain || supervisor) && (
                <div className="space-y-3 pb-5 mb-5 border-b border-white/[0.06]">
                  {domain && (
                    <div className="flex gap-3">
                      <Network className="w-4 h-4 text-leaf-300 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-ink-400">Research domain</p>
                        <p className="text-sm text-white">{domain.name}</p>
                      </div>
                    </div>
                  )}
                  {supervisor && (
                    <div className="flex gap-3">
                      <UserRound className="w-4 h-4 text-aqua-300 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-ink-400">Works under</p>
                        <Link href={`/team/${supervisor.slug}`} className="text-sm text-white hover:text-aqua-300 transition-colors">
                          {supervisor.name}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {links.length > 0 && (
                <div className="space-y-2 pt-5 border-t border-white/[0.06]">
                  {links.map(({ href, label, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-ink-200 hover:text-aqua-300 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" /> <span className="truncate">{label}</span>
                    </a>
                  ))}
                </div>
              )}
            </aside>

            <div className="space-y-8">
              <div className="glass-card p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-white mb-4">Biography</h2>
                <div
                  className="prose prose-invert max-w-none prose-p:text-ink-200 prose-a:text-aqua-300"
                  dangerouslySetInnerHTML={{ __html: toHtml(member.bio) || "<p>No biography yet.</p>" }}
                />
              </div>

              {member.researchInterests && member.researchInterests.length > 0 && (
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-white mb-4">Research Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {member.researchInterests.map((r) => (
                      <span key={r} className="chip chip-aqua">{r}</span>
                    ))}
                  </div>
                </div>
              )}

              {mentees.length > 0 && (
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                    <Users className="w-5 h-5 text-aqua-300" /> Researchers under {member.name.split(" ").slice(-1)[0]}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {mentees.map((m) => (
                      <Link
                        key={m.id}
                        href={`/team/${m.slug}`}
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-ink-900/60 p-3 hover:border-aqua-400/30 transition-colors"
                      >
                        <Avatar name={m.name} image={m.image} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate group-hover:text-aqua-200">{m.name}</p>
                          <p className="text-xs text-ink-400 truncate">{m.designation}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {pubs.length > 0 && (
                <div className="glass-card p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-white mb-5">Selected Publications</h2>
                  <ul className="space-y-4">
                    {pubs.map((p) => (
                      <li key={p.id} className="border-l-2 border-aqua-400/40 pl-4">
                        <p className="text-white font-medium leading-snug">{p.title}</p>
                        <p className="text-sm text-ink-400 mt-1">
                          {p.venue} · {p.year}
                          {p.doi && (
                            <>
                              {" · "}
                              <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="text-aqua-300 hover:underline">
                                DOI
                              </a>
                            </>
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
