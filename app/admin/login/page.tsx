"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { siteConfig } from "@/lib/site-config";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-ink-950 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="glow-orb w-[500px] h-[500px] -top-40 -left-40 bg-leaf-500/15" />
      <div className="glow-orb w-[500px] h-[500px] -bottom-40 -right-40 bg-gear-500/20" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-1 ring-aqua-400/30 shadow-[0_0_40px_-8px] shadow-aqua-400/50 mb-5">
            <Image src={siteConfig.logo} alt={`${siteConfig.shortName} logo`} fill sizes="80px" className="object-cover" priority />
          </div>
          <h1 className="text-2xl font-bold text-white">{siteConfig.shortName} Admin</h1>
          <p className="text-sm text-ink-400 mt-1">Sign in to manage lab content</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-2">Email</label>
            <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-2">Password</label>
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field" />
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full !py-3.5">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-between mt-6 text-xs text-ink-500">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-ink-200 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to site
          </Link>
          <span>Authorized staff only</span>
        </div>
      </motion.div>
    </div>
  );
}
