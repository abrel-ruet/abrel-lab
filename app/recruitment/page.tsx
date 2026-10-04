"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, CheckCircle2, Loader2, Paperclip, X, FlaskConical, BookOpen, Users, Award } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import PageHero from "@/components/ui/page-hero";
import { createDoc, COLLECTIONS } from "@/lib/firestore";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { researchAreas } from "@/lib/site-config";

const initial = {
  name: "",
  email: "",
  phone: "",
  university: "",
  degree: "",
  cgpa: "",
  batch: "",
  researchTrack: "",
  interests: "",
  experience: "",
  proposalTitle: "",
  proposalDesc: "",
  sop: "",
};

type FormState = typeof initial;

const highlights = [
  { icon: FlaskConical, title: "Real lab experience", text: "Work with bioreactors, analytical instruments, and pilot-scale systems." },
  { icon: BookOpen, title: "Publish your work", text: "Co-author papers in reputable journals and conferences." },
  { icon: Users, title: "Collaborative culture", text: "Weekly meetings, journal clubs, and peer mentoring." },
  { icon: Award, title: "Career growth", text: "Alumni continue to top graduate programs and industry roles." },
];

function Field({ label, required, children, full }: { label: string; required?: boolean; children: ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-ink-200 mb-2">
        {label} {required && <span className="text-leaf-400">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function RecruitmentPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [cv, setCv] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormState) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (cv && cv.size > 10 * 1024 * 1024) {
      setError("CV must be smaller than 10 MB.");
      return;
    }
    setState("loading");
    try {
      const cvUrl = cv ? await uploadFileToCloudinary(cv) : "";
      await createDoc(COLLECTIONS.recruitment, {
        ...form,
        email: form.email.trim().toLowerCase(),
        cvUrl,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
      setState("done");
      setForm(initial);
      setCv(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setState("idle");
    }
  };

  return (
    <PageShell>
      <PageHero
        icon={GraduationCap}
        eyebrow="Join the lab"
        title="Research"
        highlight="Opportunities"
        description="ABREL recruits motivated BSc thesis students, MSc and PhD researchers, and visiting scholars every year."
      />

      <section className="pb-24">
        <div className="container-xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {highlights.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="glass-card p-5"
              >
                <Icon className="w-5 h-5 text-aqua-300 mb-3" />
                <p className="font-semibold text-white mb-1">{title}</p>
                <p className="text-sm text-ink-400">{text}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            {state === "done" ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center">
                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-leaf-500/15 border border-leaf-400/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-leaf-300" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Application submitted!</h2>
                <p className="text-ink-300 mb-8">Thank you for your interest in ABREL. We review applications regularly and will contact shortlisted candidates by email.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setState("idle")} className="btn-ghost">Submit another</button>
                  <Link href="/" className="btn-primary">Back to home</Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-10 space-y-10">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Personal information</h2>
                  <p className="text-sm text-ink-400 mb-6">How can we reach you?</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Full name" required><input required value={form.name} onChange={set("name")} className="input-field" /></Field>
                    <Field label="Email" required><input required type="email" value={form.email} onChange={set("email")} className="input-field" /></Field>
                    <Field label="Phone" required><input required type="tel" value={form.phone} onChange={set("phone")} className="input-field" /></Field>
                    <Field label="University / Institution" required><input required value={form.university} onChange={set("university")} className="input-field" /></Field>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Academic background</h2>
                  <p className="text-sm text-ink-400 mb-6">Your current or most recent program.</p>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <Field label="Degree" required>
                      <select required value={form.degree} onChange={set("degree")} className="input-field cursor-pointer">
                        <option value="">Select...</option>
                        <option>BSc</option>
                        <option>MSc / MS</option>
                        <option>PhD</option>
                        <option>Postdoc / Visiting</option>
                      </select>
                    </Field>
                    <Field label="CGPA"><input value={form.cgpa} onChange={set("cgpa")} placeholder="e.g., 3.75 / 4.00" className="input-field" /></Field>
                    <Field label="Batch / Year"><input value={form.batch} onChange={set("batch")} placeholder="e.g., 2022" className="input-field" /></Field>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Research interests</h2>
                  <p className="text-sm text-ink-400 mb-6">Tell us what excites you.</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Preferred research track" required full>
                      <select required value={form.researchTrack} onChange={set("researchTrack")} className="input-field cursor-pointer">
                        <option value="">Select a track...</option>
                        {researchAreas.map((a) => <option key={a.key}>{a.title}</option>)}
                        <option>Undecided / Open to suggestions</option>
                      </select>
                    </Field>
                    <Field label="Specific interests" full>
                      <input value={form.interests} onChange={set("interests")} placeholder="e.g., anaerobic digestion, enzyme kinetics" className="input-field" />
                    </Field>
                    <Field label="Prior research / lab experience" full>
                      <textarea rows={3} value={form.experience} onChange={set("experience")} className="input-field resize-none" />
                    </Field>
                    <Field label="Proposed research title (optional)" full>
                      <input value={form.proposalTitle} onChange={set("proposalTitle")} className="input-field" />
                    </Field>
                    <Field label="Brief research idea (optional)" full>
                      <textarea rows={4} value={form.proposalDesc} onChange={set("proposalDesc")} className="input-field resize-none" />
                    </Field>
                    <Field label="Statement of purpose" required full>
                      <textarea required rows={5} value={form.sop} onChange={set("sop")} placeholder="Why do you want to join ABREL? What are your goals?" className="input-field resize-none" />
                    </Field>
                    <Field label="CV / Resume (PDF, optional)" full>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost !py-2.5">
                          <Paperclip className="w-4 h-4" /> {cv ? "Change file" : "Attach file"}
                        </button>
                        {cv && (
                          <span className="flex items-center gap-2 text-sm text-ink-200 min-w-0">
                            <span className="truncate">{cv.name}</span>
                            <button type="button" onClick={() => setCv(null)} aria-label="Remove file" className="text-ink-400 hover:text-red-300">
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        )}
                        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setCv(e.target.files?.[0] ?? null)} />
                      </div>
                    </Field>
                  </div>
                </div>

                {error && <p className="text-sm text-red-300">{error}</p>}

                <button type="submit" disabled={state === "loading"} className="btn-primary w-full !py-4">
                  {state === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
