"use client";

import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Arrow, Marquee, Spark } from "@/components/ui/motion";

const TILES = [
  { ch: "4", bg: "#FFD23F", rot: -8 },
  { ch: "0", bg: "#FF3D7F", rot: 5 },
  { ch: "4", bg: "#34D399", rot: -3 },
];

export default function NotFound() {
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--bg)] pt-24">
      <div aria-hidden className="ruled pointer-events-none absolute inset-0 opacity-50" />

      <div ref={box} className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <p className="label text-[var(--sub)]">Error 404 — page not found</p>

        <div className="mt-10 flex gap-3 sm:gap-6">
          {TILES.map((t, i) => (
            <motion.span
              key={i}
              drag
              dragConstraints={box}
              dragElastic={0.3}
              initial={{ y: -300, rotate: 0, opacity: 0 }}
              animate={{ y: 0, rotate: t.rot, opacity: 1 }}
              whileHover={{ rotate: 0, scale: 1.05 }}
              whileDrag={{ scale: 1.12, cursor: "grabbing" }}
              transition={{ type: "spring", stiffness: 180, damping: 12, delay: i * 0.12 }}
              className="f-display grid h-[30vw] w-[24vw] max-h-64 max-w-52 cursor-grab place-items-center border-[3px] border-[#0E0E10] text-[22vw] text-[#0E0E10] shadow-[8px_8px_0_#0E0E10] sm:text-[11rem]"
              style={{ backgroundColor: t.bg }}
            >
              {t.ch}
            </motion.span>
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="f-display-narrow mt-14 text-4xl text-[var(--ink)] sm:text-6xl"
        >
          This page wandered off. <span className="f-serif font-normal text-[var(--accent)]">rude.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="mt-4 max-w-md text-lg text-[var(--sub)]">
          The link might be broken or the page moved. Feel free to throw the numbers around while you&apos;re here.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-yolk">
            Take me home <Arrow size={14} />
          </Link>
          <button onClick={() => router.back()} className="btn btn-paper">
            ← Go back
          </button>
        </motion.div>
      </div>

      <div className="relative border-y-[3px] border-[var(--edge)] bg-[#0E0E10] py-3 text-[#F3EFE6]">
        <Marquee speed={24}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-6 pr-6">
              <span className="f-display whitespace-nowrap text-3xl">Lost & found</span>
              <Spark size={18} color="#FFD23F" />
            </span>
          ))}
        </Marquee>
      </div>
    </main>
  );
}
