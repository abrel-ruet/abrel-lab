import PageShell from "@/components/ui/page-shell";

export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <PageShell>
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 grid-bg" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <p className="eyebrow mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{title}</h1>
          <p className="text-sm text-ink-400 mb-12">Last updated: {updated}</p>
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl font-semibold text-white mb-3">{s.heading}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-ink-300 leading-relaxed mb-3">{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
