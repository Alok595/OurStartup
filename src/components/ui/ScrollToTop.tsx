"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isAdminRoute } from "@/components/ui/motion";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 600));

  if (isAdminRoute(pathname)) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="group fixed bottom-5 right-5 z-50 hidden h-12 w-12 place-items-center overflow-hidden border-2 border-[var(--edge)] bg-[var(--paper)] text-[var(--ink)] shadow-[4px_4px_0_var(--shadow)] transition-transform hover:-translate-y-1 sm:bottom-6 sm:right-6 md:grid"
        >
          {/* fill shows how far down the page you are */}
          <motion.span aria-hidden style={{ scaleY: scrollYProgress }} className="absolute inset-0 origin-bottom bg-[var(--yolk)]" />
          <svg className="relative transition-transform duration-300 group-hover:-translate-y-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <path d="M12 20V4M5 11l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
