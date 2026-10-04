"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2, Mail } from "lucide-react";
import { createDoc, COLLECTIONS } from "@/lib/firestore";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      await createDoc(COLLECTIONS.newsletter, { email: email.trim().toLowerCase(), subscribedAt: new Date().toISOString() });
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="pb-24">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card relative overflow-hidden px-6 py-12 sm:px-12 text-center"
        >
          <div className="glow-orb w-96 h-96 -top-48 left-1/2 -translate-x-1/2 bg-aqua-500/20" />
          <div className="relative max-w-xl mx-auto">
            <div className="mx-auto mb-5 w-12 h-12 rounded-xl bg-aqua-500/15 border border-aqua-400/25 flex items-center justify-center">
              <Mail className="w-5 h-5 text-aqua-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Subscribe to the <span className="gradient-text">ABREL Newsletter</span>
            </h2>
            <p className="text-ink-300 mb-8">Research highlights, publications, events, and openings — delivered occasionally.</p>

            {state === "done" ? (
              <div className="inline-flex items-center gap-2 text-leaf-300 font-medium">
                <CheckCircle2 className="w-5 h-5" /> Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field flex-1"
                  aria-label="Email address"
                />
                <button type="submit" disabled={state === "loading"} className="btn-primary shrink-0">
                  {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Subscribe
                </button>
              </form>
            )}
            {state === "error" && <p className="text-sm text-red-300 mt-3">Subscription failed. Please try again.</p>}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
