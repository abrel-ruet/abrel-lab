"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, Send, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import PageHero from "@/components/ui/page-hero";
import { createDoc, COLLECTIONS } from "@/lib/firestore";
import { siteConfig } from "@/lib/site-config";

const initial = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const set = (k: keyof typeof initial) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      await createDoc(COLLECTIONS.contact, { ...form, read: false, submittedAt: new Date().toISOString() });
      setForm(initial);
      setState("done");
    } catch {
      setState("error");
    }
  };

  const info = [
    { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}`, tone: "text-aqua-300" },
    { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}`, tone: "text-gear-300" },
    { icon: MapPin, label: "Address", value: siteConfig.address, tone: "text-leaf-300" },
    { icon: Clock, label: "Office hours", value: siteConfig.officeHours, tone: "text-aqua-200" },
  ];

  return (
    <PageShell>
      <PageHero
        icon={MessageSquare}
        eyebrow="Get in touch"
        title="Contact"
        highlight="ABREL"
        description="Questions about our research, collaboration opportunities, or joining the lab? We'd love to hear from you."
      />
      <section className="pb-24">
        <div className="container-xl grid lg:grid-cols-[0.85fr_1.15fr] gap-8">
          <div className="space-y-4">
            {info.map(({ icon: Icon, label, value, href, tone }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="glass-card p-5 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-ink-800 border border-white/[0.06] flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${tone}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-ink-400 mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-white hover:text-aqua-300 transition-colors break-words">{value}</a>
                  ) : (
                    <p className="text-white">{value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {state === "done" ? (
              <div className="glass-card p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="mb-5 w-16 h-16 rounded-2xl bg-leaf-500/15 border border-leaf-400/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-leaf-300" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Message sent</h2>
                <p className="text-ink-300 mb-6">Thanks for reaching out — we&apos;ll get back to you soon.</p>
                <button onClick={() => setState("idle")} className="btn-ghost">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
                <h2 className="text-xl font-semibold text-white">Send us a message</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-ink-200 mb-2">Name</label>
                    <input required value={form.name} onChange={set("name")} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-200 mb-2">Email</label>
                    <input required type="email" value={form.email} onChange={set("email")} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-200 mb-2">Subject</label>
                  <input required value={form.subject} onChange={set("subject")} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-200 mb-2">Message</label>
                  <textarea required rows={6} value={form.message} onChange={set("message")} className="input-field resize-none" />
                </div>
                {state === "error" && <p className="text-sm text-red-300">Something went wrong. Please try again.</p>}
                <button type="submit" disabled={state === "loading"} className="btn-primary w-full !py-3.5">
                  {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
