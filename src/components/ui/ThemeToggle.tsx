"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ThemeToggle() {
  // false on the server, true once hydrated — avoids a theme-icon mismatch
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) return <div className="h-10 w-10 border-2 border-[var(--edge)]" />;

  const dark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-10 w-10 place-items-center overflow-hidden border-2 border-[var(--edge)] text-[var(--ink)] transition-colors hover:bg-[var(--yolk)] hover:text-[#0E0E10]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={dark ? "sun" : "moon"}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        >
          {dark ? (
            <>
              <rect x="8" y="8" width="8" height="8" fill="currentColor" />
              <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
            </>
          ) : (
            <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="currentColor" />
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}
