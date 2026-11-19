"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * A square cursor that trails the pointer and grows over anything clickable.
 * Runs on one rAF loop writing a single transform, so it never triggers
 * layout. Skipped entirely on touch devices and for reduced-motion users.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAdmin = ["/login", "/dashboard", "/leads", "/portfolio", "/settings", "/stories", "/clients", "/interested-clients"].some((r) =>
    pathname?.startsWith(r)
  );

  useEffect(() => {
    if (isAdmin) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !dot.current || !ring.current) return;

    const d = dot.current;
    const r = ring.current;
    let mx = -100, my = -100, rx = -100, ry = -100;
    let scale = 1, targetScale = 1;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        rx = mx;
        ry = my;
        d.style.opacity = "1";
        r.style.opacity = "1";
      }
      const t = e.target as HTMLElement | null;
      targetScale = t?.closest("a, button, [role='button'], input, textarea, label, select") ? 2.4 : 1;
    };
    const onLeave = () => {
      visible = false;
      d.style.opacity = "0";
      r.style.opacity = "0";
    };
    const onDown = () => (targetScale *= 0.7);
    const onUp = () => (targetScale /= 0.7);

    const tick = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      scale += (targetScale - scale) * 0.18;
      d.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
      r.style.transform = `translate3d(${rx - 14}px, ${ry - 14}px, 0) scale(${scale}) rotate(${(scale - 1) * 32}deg)`;
      raf = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add("has-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-7 w-7 border-2 border-[var(--yolk)] opacity-0 mix-blend-difference [@media(pointer:fine)]:block"
        style={{ transition: "opacity 200ms" }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[201] hidden h-1.5 w-1.5 bg-[var(--yolk)] opacity-0 mix-blend-difference [@media(pointer:fine)]:block"
        style={{ transition: "opacity 200ms" }}
      />
    </>
  );
}
