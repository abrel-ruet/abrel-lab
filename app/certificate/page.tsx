"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, XCircle, ShieldCheck, Loader2, Award, CalendarDays, User, Hash } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import PageHero from "@/components/ui/page-hero";
import { fetchDocByField, COLLECTIONS } from "@/lib/firestore";
import { siteConfig } from "@/lib/site-config";
import type { Certificate } from "@/lib/types";

type VerifyState = "idle" | "loading" | "success" | "error";

export default function CertificatePage() {
  const [certId, setCertId] = useState("");
  const [state, setState] = useState<VerifyState>("idle");
  const [cert, setCert] = useState<Certificate | null>(null);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    const id = certId.trim().toUpperCase();
    if (!id) return;
    setState("loading");
    try {
      const found = await fetchDocByField<Certificate>(COLLECTIONS.certificates, "certId", id);
      setCert(found);
      setState(found ? "success" : "error");
    } catch {
      setCert(null);
      setState("error");
    }
  };

  return (
    <PageShell>
      <PageHero
        icon={ShieldCheck}
        eyebrow="Authenticity check"
        title="Certificate"
        highlight="Verification"
        description={`Verify certificates issued by the ${siteConfig.name} by entering the certificate ID.`}
      />
      <section className="pb-24">
        <div className="container-xl max-w-2xl">
          <form onSubmit={handleVerify} className="glass-card p-6 sm:p-8 mb-8">
            <label className="block text-sm font-medium text-ink-200 mb-3">Certificate ID</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  value={certId}
                  onChange={(e) => {
                    setCertId(e.target.value);
                    if (state !== "loading") setState("idle");
                  }}
                  placeholder={`e.g., ${siteConfig.certificatePrefix}-2025-001`}
                  className="input-field !pl-10 uppercase font-mono tracking-wide"
                />
              </div>
              <button type="submit" disabled={state === "loading" || !certId.trim()} className="btn-primary shrink-0">
                {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Verify
              </button>
            </div>
          </form>

          <AnimatePresence mode="wait">
            {state === "success" && cert && (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card relative overflow-hidden p-6 sm:p-8 !border-leaf-400/30"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-brand-gradient" />
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-7 h-7 text-leaf-300" />
                  <div>
                    <p className="font-semibold text-white">Certificate verified</p>
                    <p className="text-sm text-ink-400">This certificate was issued by {siteConfig.shortName}.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Hash, label: "Certificate ID", value: cert.certId },
                    { icon: User, label: "Recipient", value: cert.name },
                    { icon: Award, label: "Achievement", value: cert.achievement },
                    { icon: CalendarDays, label: "Issue date", value: cert.date },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-xl bg-ink-900/70 border border-white/[0.06] p-4">
                      <p className="flex items-center gap-1.5 text-xs text-ink-400 mb-1"><Icon className="w-3.5 h-3.5" /> {label}</p>
                      <p className="text-white font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {state === "error" && (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-6 sm:p-8 flex items-start gap-3 !border-red-400/25"
              >
                <XCircle className="w-7 h-7 text-red-300 shrink-0" />
                <div>
                  <p className="font-semibold text-white">No certificate found</p>
                  <p className="text-sm text-ink-400">
                    Double-check the ID and try again. If you believe this is an error, contact us at {siteConfig.email}.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageShell>
  );
}
