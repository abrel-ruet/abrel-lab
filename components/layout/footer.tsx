import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { siteConfig, researchAreas } from "@/lib/site-config";

const FacebookIcon = () => (
  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ResearchGateIcon = () => (
  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.123 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .077.53h-.005a3.334 3.334 0 0 0 .113.438c.245.743.65 1.303 1.214 1.68.565.376 1.256.564 2.075.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.175-1.65.076-.235.135-.558.177-.93a10.9 10.9 0 0 0 .043-1.207v-.82c0-.095-.047-.142-.14-.142h-3.064c-.094 0-.14.047-.14.141v.956c0 .094.046.14.14.14h1.666c.056 0 .084.03.084.086 0 .36 0 .62-.036.865-.038.244-.07.447-.12.606-.144.453-.385.784-.722 1.019-.336.235-.77.354-1.287.354-.538 0-.988-.13-1.351-.379-.363-.251-.62-.61-.776-1.084a2.75 2.75 0 0 1-.073-.31 6.29 6.29 0 0 1-.05-.43 7.47 7.47 0 0 1-.034-.598c-.008-.24-.012-.52-.012-.856 0-.333.004-.616.012-.856a7.47 7.47 0 0 1 .034-.597 6.03 6.03 0 0 1 .05-.43c.02-.12.046-.226.073-.31.156-.475.408-.836.766-1.084.358-.249.81-.378 1.36-.378.516 0 .93.115 1.264.341.335.227.593.546.776.957.05.093.12.125.21.08l.814-.39c.094-.046.122-.115.084-.208-.248-.6-.637-1.098-1.17-1.47-.542-.375-1.213-.577-2.022-.577zM8.12 7.006c-1.676 0-2.988.59-3.913 1.763-.925 1.174-1.388 2.79-1.388 4.85 0 2.06.463 3.676 1.388 4.85.925 1.173 2.237 1.763 3.913 1.763 1.4 0 2.524-.43 3.375-1.29l2.946 3.79c.11.127.24.19.39.19h1.844c.11 0 .168-.04.168-.12 0-.04-.02-.08-.05-.12l-3.384-4.28c.86-1.11 1.29-2.65 1.29-4.78 0-2.06-.46-3.676-1.388-4.85-.925-1.173-2.236-1.763-3.913-1.763z" />
  </svg>
);

const socialLinks = [
  { icon: FacebookIcon, href: siteConfig.socials.facebook, label: "Facebook" },
  { icon: GithubIcon, href: siteConfig.socials.github, label: "GitHub" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: ResearchGateIcon, href: siteConfig.socials.researchgate, label: "ResearchGate" },
].filter((s) => s.href);

const footerLinks = {
  explore: [
    { label: "Team", href: "/team" },
    { label: "Publications", href: "/publications" },
    { label: "Projects", href: "/projects" },
    { label: "Resources", href: "/resources" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  quickLinks: [
    { label: "Join Our Lab", href: "/recruitment" },
    { label: "Certificate Verification", href: "/certificate" },
    { label: "Faculty Profiles", href: "/team" },
    { label: "Admin Portal", href: "/admin" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950 overflow-hidden">
      <div className="glow-orb w-[480px] h-[480px] -bottom-60 -left-40 bg-leaf-500/10" />
      <div className="glow-orb w-[420px] h-[420px] -bottom-60 -right-32 bg-gear-500/10" />
      <div className="container-xl relative py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-aqua-400/30">
                <Image src={siteConfig.logo} alt={`${siteConfig.shortName} logo`} fill sizes="48px" className="object-cover" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-xl leading-tight">{siteConfig.shortName}</p>
                <p className="text-xs text-ink-300">{siteConfig.name}</p>
              </div>
            </Link>
            <p className="text-ink-300 text-sm leading-relaxed mb-6 max-w-sm">{siteConfig.description}</p>
            <div className="space-y-3 mb-6">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-sm text-ink-200 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-aqua-400 shrink-0" /> {siteConfig.email}
              </a>
              <span className="flex items-start gap-3 text-sm text-ink-200">
                <MapPin className="w-4 h-4 text-leaf-400 shrink-0 mt-0.5" /> {siteConfig.address}
              </span>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-ink-200 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-gear-400 shrink-0" /> {siteConfig.phone}
              </a>
            </div>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl border border-white/[0.08] bg-ink-850 flex items-center justify-center text-ink-200 hover:text-aqua-300 hover:border-aqua-400/40 transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white text-xs uppercase tracking-[0.18em] mb-5">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-300 hover:text-aqua-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white text-xs uppercase tracking-[0.18em] mb-5">Research</h3>
            <ul className="space-y-3">
              {researchAreas.map((area) => (
                <li key={area.key}>
                  <Link href="/projects" className="text-sm text-ink-300 hover:text-aqua-300 transition-colors">
                    {area.short}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white text-xs uppercase tracking-[0.18em] mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-aqua-300 transition-colors">
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-glow mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <p className="text-sm text-ink-400">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
            <p className="text-sm text-ink-400">
              Developed by{" "}
              <a
                href="https://abidhasanrafi.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-aqua-300 hover:text-leaf-300 transition-colors"
              >
                Md. Abid Hasan Rafi
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-ink-400 hover:text-ink-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-ink-400 hover:text-ink-200 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
