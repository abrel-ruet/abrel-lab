"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const navLinks = [
  { href: "/team", label: "Team" },
  { href: "/publications", label: "Publications" },
  { href: "/projects", label: "Projects" },
  { href: "/resources", label: "Resources" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b ${
          isScrolled || mobileOpen
            ? "bg-ink-950/80 backdrop-blur-xl border-white/[0.06] py-2.5"
            : "bg-transparent border-transparent py-4"
        }`}
      >
        <div className="container-xl flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0 group" onClick={() => setMobileOpen(false)}>
            <div className="relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-aqua-400/30 shadow-[0_0_24px_-6px] shadow-aqua-400/50 transition-transform group-hover:scale-105">
              <Image src={siteConfig.logo} alt={`${siteConfig.shortName} logo`} fill sizes="44px" className="object-cover" priority />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-white text-lg tracking-tight">{siteConfig.shortName}</span>
              <span className="hidden sm:block text-[11px] font-medium text-ink-300 tracking-wide">
                {siteConfig.name}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.06] bg-ink-900/50 px-1.5 py-1.5 backdrop-blur">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-aqua-400/15 text-aqua-200"
                    : "text-ink-200 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/recruitment" className="btn-primary !py-2.5 !px-5">
              Join the Lab <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-ink-100 hover:bg-white/[0.06] rounded-lg transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-xl pt-24 px-4 lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl text-lg font-medium transition-colors border ${
                    isActive(link.href)
                      ? "border-aqua-400/30 bg-aqua-400/10 text-aqua-200"
                      : "border-white/[0.05] text-ink-100 hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                  <ChevronRight className="w-5 h-5 text-ink-400" />
                </Link>
              ))}
              <Link href="/recruitment" onClick={() => setMobileOpen(false)} className="btn-primary mt-4 !py-4 !text-base">
                Join the Lab
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
