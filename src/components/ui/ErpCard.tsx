"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Arrow, EASE } from "@/components/ui/motion";
import { erpCta, erpImages, splitErpTitle } from "@/lib/erp";
import type { ProjectItem } from "@/lib/portfolio";

/** Black or white text, whichever reads better on the given hex colour. */
export function inkOn(hex: string) {
  const h = hex.replace("#", "");
  if (h.length < 6) return "#0E0E10";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55 ? "#0E0E10" : "#FFFFFF";
}

export function hostOf(url?: string) {
  if (!url) return "erp.genzdevworks";
  try {
    return new URL(url).host;
  } catch {
    return "erp.genzdevworks";
  }
}

/** Placeholder "dashboard" drawn in the ERP's colour when no screenshot is uploaded. */
export function ErpMock({ color, letter }: { color: string; letter: string }) {
  const bars = [38, 62, 46, 78, 58, 90, 70];
  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#FFFDF8]">
      <div className="flex w-[18%] flex-col gap-2 border-r-2 border-[#0E0E10] p-3" style={{ backgroundColor: `${color}22` }}>
        <span className="grid aspect-square w-full place-items-center border-2 border-[#0E0E10] f-display text-xl" style={{ backgroundColor: color, color: inkOn(color) }}>
          {letter}
        </span>
        {[0, 1, 2, 3, 4].map((k) => (
          <span key={k} className="h-2 bg-[#0E0E10]" style={{ opacity: k === 0 ? 0.9 : 0.25 }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[color, "#FFD23F", "#FF8FB4"].map((c, k) => (
            <span key={k} className="h-8 border-2 border-[#0E0E10]" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex flex-1 items-end gap-2 border-2 border-[#0E0E10] p-3">
          {bars.map((h, k) => (
            <span key={k} className="flex-1" style={{ height: `${h}%`, backgroundColor: k === bars.length - 2 ? color : "#0E0E10" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ErpCard({ erp, index }: { erp: ProjectItem; index: number }) {
  const color = erp.color || "#4F46E5";
  const fg = inkOn(color);
  const { brand, name } = splitErpTitle(erp.title);
  const cta = erpCta(erp);
  const images = erpImages(erp);
  const href = `/erp/${erp.slug}`;
  const features = (erp.erpFeatures || []).slice(0, 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: EASE }}
      className="group relative flex h-full flex-col border-[3px] border-[#0E0E10] bg-[#FFFDF8] text-[#0E0E10] shadow-[8px_8px_0_#0E0E10] transition-[transform,box-shadow] duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_#0E0E10]"
    >
      {/* status strip */}
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-[#0E0E10] px-4 py-2.5" style={{ backgroundColor: color, color: fg }}>
        <span className="f-mono text-[12px] font-semibold tracking-[0.14em]">ERP / {String(index + 1).padStart(2, "0")}</span>
        <span className="label flex items-center gap-2 !text-[10px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping opacity-70" style={{ backgroundColor: fg }} />
            <span className="relative h-2 w-2" style={{ backgroundColor: fg }} />
          </span>
          {erp.liveUrl ? "Live" : "Demo on request"}
        </span>
      </div>

      {/* app window */}
      <Link href={href} prefetch aria-label={`View ${erp.title}`} className="relative block p-4 pb-0 sm:p-5 sm:pb-0">
        <div className="overflow-hidden border-2 border-[#0E0E10]">
          <div className="flex items-center gap-1.5 border-b-2 border-[#0E0E10] bg-[#F3EFE6] px-2.5 py-1.5">
            {["#FF5A1F", "#FFD23F", "#34D399"].map((c) => (
              <span key={c} className="h-2 w-2 border border-[#0E0E10]" style={{ backgroundColor: c }} />
            ))}
            <span className="f-mono ml-2 truncate text-[10px] opacity-70">{hostOf(erp.liveUrl)}</span>
            {images.length > 1 && <span className="label ml-auto !text-[9px] opacity-70">{images.length} screens</span>}
          </div>
          <div className="relative aspect-[16/9] overflow-hidden">
            {images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[0]}
                alt={`${erp.title} screenshot`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
              />
            ) : (
              <ErpMock color={color} letter={(brand || name).charAt(0)} />
            )}
          </div>
        </div>
        {erp.freeTrial && (
          <span className="label absolute -right-2 top-1 z-10 rotate-[8deg] border-2 border-[#0E0E10] bg-[var(--yolk)] px-2.5 py-1.5 !text-[10px] shadow-[3px_3px_0_#0E0E10] transition-transform duration-300 group-hover:rotate-0 sm:-right-3">
            Free trial
          </span>
        )}
      </Link>

      {/* spec */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {brand && <p className="label text-[#5A5750]">{brand}</p>}
        <h3 className="f-display mt-1 text-2xl uppercase leading-[0.95] sm:text-[1.9rem]">
          <Link href={href} className="link-wipe">
            {name}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-[#3A3833]">{erp.description}</p>

        {features.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t-2 border-dashed border-[#0E0E10]/30 pt-4">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13px] font-semibold leading-snug">
                <span className="mt-[3px] grid h-3.5 w-3.5 shrink-0 place-items-center border-2 border-[#0E0E10] text-[8px]" style={{ backgroundColor: color, color: fg }}>
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* actions */}
      <div className="grid grid-cols-2 border-t-[3px] border-[#0E0E10]">
        <Link href={href} prefetch className="label flex items-center justify-center gap-2 bg-[#0E0E10] px-3 py-4 !text-[11px] text-[#F3EFE6] transition-colors hover:bg-[#2A2A2E]">
          Full details <Arrow size={12} />
        </Link>
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="label flex items-center justify-center gap-2 px-3 py-4 !text-[11px] transition-[filter] hover:brightness-95"
          style={{ backgroundColor: erp.freeTrial ? "var(--yolk)" : "#F3EFE6" }}
        >
          {cta.label} ↗
        </a>
      </div>
    </motion.article>
  );
}

/** Small horizontal ERP card — used in the scrolling list on the home page. */
export function ErpCardCompact({ erp, index }: { erp: ProjectItem; index: number }) {
  const color = erp.color || "#4F46E5";
  const fg = inkOn(color);
  const { brand, name } = splitErpTitle(erp.title);
  const cta = erpCta(erp);
  const cover = erpImages(erp)[0];
  const href = `/erp/${erp.slug}`;

  return (
    <article className="group relative flex border-2 border-[#0E0E10] bg-[#FFFDF8] text-[#0E0E10] shadow-[4px_4px_0_#0E0E10] transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0E0E10]">
      {/* colour spine */}
      <span className="flex w-7 shrink-0 items-center justify-center border-r-2 border-[#0E0E10]" style={{ backgroundColor: color, color: fg }}>
        <span className="f-mono -rotate-90 whitespace-nowrap text-[10px] font-semibold tracking-[0.14em]">ERP/{String(index + 1).padStart(2, "0")}</span>
      </span>

      <Link href={href} prefetch aria-label={`View ${erp.title}`} className="relative hidden w-36 shrink-0 overflow-hidden border-r-2 border-[#0E0E10] sm:block md:w-44">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover object-left-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <ErpMock color={color} letter={(brand || name).charAt(0)} />
        )}
        {erp.freeTrial && (
          <span className="label absolute bottom-1.5 left-1.5 border-2 border-[#0E0E10] bg-[var(--yolk)] px-1.5 py-0.5 !text-[9px]">Free trial</span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 sm:p-4">
        {brand && <p className="label !text-[10px] text-[#5A5750]">{brand}</p>}
        <h3 className="f-display-narrow text-lg uppercase leading-tight sm:text-xl">
          <Link href={href} className="link-wipe">
            {name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[13px] leading-snug text-[#3A3833]">{erp.description}</p>
        {erp.erpFeatures && erp.erpFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {erp.erpFeatures.slice(0, 3).map((f) => (
              <span key={f} className="border border-[#0E0E10]/40 px-1.5 py-0.5 text-[10px] font-semibold">
                {f}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1.5">
          <Link href={href} prefetch className="label inline-flex items-center gap-1.5 bg-[#0E0E10] px-2.5 py-1.5 !text-[10px] text-[#F3EFE6]">
            Details <Arrow size={10} />
          </Link>
          <a href={cta.href} target="_blank" rel="noopener noreferrer" className="label border-2 border-[#0E0E10] px-2 py-1 !text-[10px]" style={{ backgroundColor: erp.freeTrial ? "var(--yolk)" : "transparent" }}>
            {cta.label} ↗
          </a>
        </div>
      </div>
    </article>
  );
}
