import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Analytics from "@/components/layout/analytics";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const title = `${siteConfig.name} | ${siteConfig.shortName}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: title, template: `%s | ${siteConfig.shortName}` },
  description: siteConfig.description,
  keywords: [
    "ABREL",
    "Advanced Bio-Resources Engineering Lab",
    "Bioprocess Engineering",
    "Bioenergy",
    "Environmental Biotechnology",
    "Bio-resources",
    "Research Lab",
  ],
  openGraph: {
    title,
    description: siteConfig.description,
    type: "website",
    images: [{ url: siteConfig.logo }],
  },
  twitter: {
    card: "summary",
    title,
    description: siteConfig.description,
    images: [siteConfig.logo],
  },
};

export const viewport: Viewport = {
  themeColor: "#040a10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${grotesk.variable} antialiased min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
