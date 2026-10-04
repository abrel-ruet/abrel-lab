"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";

const faqs = [
  {
    q: "Who can join ABREL?",
    a: "We welcome undergraduate thesis students, MSc and PhD researchers, and visiting scholars with a background in biotechnology, chemical/biochemical engineering, microbiology, agriculture, environmental science, or computational biology.",
  },
  {
    q: "How do I apply for a research position?",
    a: "Submit the application form on the Join the Lab page with your academic details, research interests, and a short statement of purpose. Shortlisted candidates are contacted for an interview.",
  },
  {
    q: "Do I need prior lab experience?",
    a: "Prior experience helps but is not required. Motivation, curiosity, and willingness to learn matter most — new members receive training in lab safety, core techniques, and data analysis.",
  },
  {
    q: "Does the lab collaborate with industry?",
    a: "Yes. We partner with industries and organizations on bioprocess optimization, waste valorization, and environmental treatment. Reach out through the Contact page to discuss collaboration.",
  },
  {
    q: "How can I verify a certificate issued by ABREL?",
    a: "Use the Certificate Verification page and enter the certificate ID printed on your certificate.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad">
      <div className="container-xl grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked"
            highlight="Questions"
            align="left"
            description="Everything you need to know about joining, collaborating with, and working at ABREL."
          />
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`glass-card transition-colors ${isOpen ? "!border-aqua-400/30" : ""}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-white">{f.q}</span>
                  <Plus className={`w-5 h-5 shrink-0 text-aqua-300 transition-transform ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-ink-300 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
