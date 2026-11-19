"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/motion";

export type FAQItem = { q: string; a: string };

export default function FAQSection({ faqs, title = "Frequently asked" }: { faqs: FAQItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <p className="label text-[var(--sub)]">FAQ</p>
        <h2 className="f-display-narrow mt-4 text-4xl leading-[1.02] text-[var(--ink)] sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-xs text-[var(--sub)]">
          Still curious?{" "}
          <a href="/contact" className="link-wipe font-semibold text-[var(--ink)]">
            Ask us directly
          </a>
          .
        </p>
      </Reveal>

      <div className="border-t-2 border-[var(--edge)] lg:col-span-8">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q} className="relative border-b-2 border-[var(--edge)]">
              <motion.span
                aria-hidden
                initial={false}
                animate={{ scaleY: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 top-0 h-full w-1.5 origin-top bg-[var(--accent)]"
              />
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center gap-5 py-6 pl-5 pr-1 text-left sm:pl-7"
              >
                <span className="label text-[var(--sub)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-lg font-semibold text-[var(--ink)] transition-transform duration-300 group-hover:translate-x-1 sm:text-xl">{faq.q}</span>
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center border-2 border-[var(--edge)] transition-colors duration-300 ${
                    isOpen ? "bg-[var(--yolk)] text-[#0E0E10]" : "text-[var(--ink)]"
                  }`}
                >
                  <motion.svg animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                    <path d="M12 4v16M4 12h16" />
                  </motion.svg>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-7 pl-[3.6rem] pr-4 text-[16px] leading-relaxed text-[var(--sub)] sm:pl-[4.1rem]">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
