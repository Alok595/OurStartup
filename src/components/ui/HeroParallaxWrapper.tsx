"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroParallaxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="relative h-auto w-full overflow-hidden sm:h-screen">
      <motion.div style={{ y: heroY }} className="h-full w-full sm:absolute sm:inset-0">
        {children}
      </motion.div>
    </div>
  );
}
