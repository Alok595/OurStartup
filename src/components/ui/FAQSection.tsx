"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });

export type FAQItem = { q: string; a: string };

export default function FAQSection({ faqs, title = "Frequently Asked Questions" }: { faqs: FAQItem[], title?: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className={`mx-auto mt-28 mb-28 w-full max-w-3xl px-6 sm:px-10 ${display.variable}`}>
      <h3
        className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sub)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {title}
      </h3>
      <div className="flex flex-col divide-y divide-[var(--line)] border-t border-[var(--line)]">
        {faqs.map((faq, i) => (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpenFaq((o) => (o === i ? null : i))}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-[15px] font-medium text-[var(--ink)] sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
                {faq.q}
              </span>
              <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown size={18} className="shrink-0 text-[var(--sub)]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-[13.5px] leading-relaxed text-[var(--sub)]">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
