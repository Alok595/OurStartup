"use client";

import Link from "next/link";
import { Arrow, EASE, Magnetic, Marquee, Reveal, Spark } from "@/components/ui/motion";
import PageHero from "@/components/ui/PageHero";
import ErpCard from "@/components/ui/ErpCard";
import { ERP_CUSTOMISE, ERP_VERTICALS, erpCta, erpDemoLink, splitErpTitle } from "@/lib/erp";
import type { ProjectItem } from "@/lib/portfolio";
import { motion } from "framer-motion";

const MODULE_COLORS = ["#FFD23F", "#34D399", "#60A5FA", "#FF8FB4", "#C4B5FD", "#FF9A6B", "#CCFF2E", "#FFFDF8"];

/** Full-width block per ERP: badges, story, CTAs and every feature as a coloured box. Alternates plain / mint. */
function ErpSpotlight({ erp, index }: { erp: ProjectItem; index: number }) {
  const { brand, name } = splitErpTitle(erp.title);
  const cta = erpCta(erp);
  const tinted = index % 2 === 1;
  const features = erp.erpFeatures || [];

  return (
    <section
      id={erp.slug}
      className={`scroll-mt-24 border-t-2 border-[var(--edge)] px-5 py-16 sm:px-8 sm:py-24 ${tinted ? "bg-[var(--mint)] text-[#0E0E10]" : ""}`}
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="flex flex-wrap gap-2">
            <span className="label border-2 border-[#0E0E10] bg-[var(--yolk)] px-2 py-1 !text-[10px] text-[#0E0E10]">
              ERP {String(index + 1).padStart(2, "0")}
              {erp.category && erp.category !== "ERP System" ? ` — ${erp.category}` : ""}
            </span>
            {erp.freeTrial && <span className="label border-2 border-[#0E0E10] bg-[#FFFDF8] px-2 py-1 !text-[10px] text-[#0E0E10]">Free trial</span>}
            <span className="label border-2 border-[#0E0E10] bg-[#FF8FB4] px-2 py-1 !text-[10px] text-[#0E0E10]">Fully customisable</span>
          </div>
          {brand && <p className={`label mt-6 ${tinted ? "opacity-70" : "text-[var(--sub)]"}`}>{brand}</p>}
          <h2 className={`f-display mt-2 text-5xl uppercase sm:text-6xl ${tinted ? "" : "text-[var(--ink)]"}`}>{name}</h2>
          <p className={`mt-5 text-lg leading-relaxed ${tinted ? "text-[#1F2A24]" : "text-[var(--sub)]"}`}>{erp.overview || erp.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={cta.href} target="_blank" rel="noopener noreferrer" className={tinted ? "btn btn-ink" : "btn btn-yolk"}>
              {cta.label} <Arrow size={14} />
            </a>
            {erp.liveUrl && (
              <a href={erpDemoLink(erp.title)} target="_blank" rel="noopener noreferrer" className="btn btn-paper">
                Book a demo
              </a>
            )}
            <Link href={`/erp/${erp.slug}`} className="btn btn-paper">
              All screens & details
            </Link>
          </div>
        </Reveal>

        {features.length > 0 && (
          <ul className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-7">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: EASE }}
                whileHover={{ y: -4 }}
                className="border-2 border-[#0E0E10] p-5 text-[#0E0E10] shadow-[4px_4px_0_#0E0E10]"
                style={{ backgroundColor: tinted ? "#FFFDF8" : MODULE_COLORS[i % MODULE_COLORS.length] }}
              >
                <span className="f-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="f-display-narrow mt-3 text-xl uppercase">{f}</h3>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Pick an ERP", body: "Open any ERP below, explore every screen and start the free trial where available." },
  { n: "02", title: "Tell us what to change", body: "Branding, modules, invoice format, reports — list what fits your workflow." },
  { n: "03", title: "We customise & migrate", body: "We tailor the ERP, move your old data and train your staff." },
  { n: "04", title: "Go live, we stay on", body: "Launch across your branches with ongoing updates and support." },
];

export default function ErpPage({ erps }: { erps: ProjectItem[] }) {
  const trials = erps.filter((e) => e.freeTrial).length;

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <PageHero
        label="ERP Systems"
        line1="One system"
        line2="for your"
        highlight="business."
        highlightBg="var(--lime)"
        description="Ready-to-run, fully customisable ERP software — billing, inventory, accounts, staff and reports in one place. Explore every ERP we've built, try it free, or let us build one shaped around your industry."
        chips={[
          { text: `${String(erps.length).padStart(2, "0")} ERPs live` },
          ...(trials > 0 ? [{ text: `${trials} with free trial`, bg: "#FFD23F" }] : []),
          { text: "100% customisable", bg: "#FF8FB4" },
        ]}
        actions={
          <>
            <Magnetic>
              <a href="#all-erps" className="btn btn-yolk !px-7 !py-5">
                Browse ERPs <Arrow size={15} />
              </a>
            </Magnetic>
            <Magnetic>
              <Link href="/contact" className="btn btn-paper !px-7 !py-5">
                Get a custom ERP
              </Link>
            </Magnetic>
          </>
        }
      />

      <div className="-mx-4 -rotate-[1.5deg] border-y-[3px] border-[var(--edge)] bg-[var(--yolk)] py-3 text-[#0E0E10]">
        <Marquee speed={30}>
          {["Free trial", "Fully customisable", "GST billing", "Inventory", "Accounts", "Staff & roles", "Multi-branch", "Reports"].map((t) => (
            <span key={t} className="flex items-center gap-6 pr-6">
              <span className="f-display-narrow whitespace-nowrap text-2xl uppercase sm:text-3xl">{t}</span>
              <Spark size={20} color="#0E0E10" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------------------------------------------------------- all ERPs */}
      <section id="all-erps" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <Reveal>
              <p className="label text-[var(--sub)]">The line-up</p>
              <h2 className="f-display mt-4 text-5xl uppercase text-[var(--ink)] sm:text-7xl">
                Our <span className="f-serif normal-case text-[var(--accent)]">ERPs.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-[var(--sub)]">Open any ERP to see every screen, all features and how we can customise it for you.</p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {erps.map((erp, i) => (
              <ErpCard key={erp._id} erp={erp} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- per-ERP spotlight blocks */}
      {erps.map((erp, i) => (
        <ErpSpotlight key={erp._id} erp={erp} index={i} />
      ))}

      {/* ------------------------------------------------- customisation */}
      <section className="border-t-2 border-[var(--edge)] bg-[var(--navy)] px-5 py-16 text-[#F3F4FA] sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="label text-[var(--lime)]">Fully customisable</p>
            <h2 className="f-display mt-4 text-5xl uppercase leading-[0.9] sm:text-7xl">
              Your rules. <span className="text-[var(--bubblegum)]">Your ERP.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-white/75">
              Pick what you need, drop what you don&apos;t. We adapt every screen, report and workflow so the software fits your business
              — not the other way round.
            </p>
            <Link href="/contact" className="btn btn-yolk mt-8">
              Discuss customisation <Arrow size={14} />
            </Link>
          </Reveal>
          <ul className="grid border-l border-t border-white/70 sm:grid-cols-2 lg:col-span-7">
            {ERP_CUSTOMISE.map((c, i) => (
              <Reveal as="li" key={c} delay={(i % 2) * 0.06} className="border-b border-r border-white/70 p-6">
                <span className="f-mono text-sm text-[var(--lime)]">{String(i + 1).padStart(2, "0")}</span>
                <p className="f-display-narrow mt-4 text-xl">{c}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- how it works */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="label text-[var(--sub)]">How it works</p>
            <h2 className="f-display mt-4 text-5xl uppercase text-[var(--ink)] sm:text-7xl">
              Trial to <span className="f-serif normal-case text-[var(--accent)]">live.</span>
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.08} className="border-t-[3px] border-[var(--edge)] pt-5">
                <span className="f-display text-5xl text-[var(--accent)]">{s.n}</span>
                <h3 className="f-display-narrow mt-4 text-2xl text-[var(--ink)]">{s.title}</h3>
                <p className="mt-2 text-[var(--sub)]">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------- verticals */}
      <section className="border-t-2 border-[var(--edge)] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <p className="label text-[var(--sub)]">More ERPs we build</p>
              <h2 className="f-display mt-4 text-5xl uppercase text-[var(--ink)] sm:text-7xl">Any industry.</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/contact" className="btn btn-ink">
                Request your ERP <Arrow size={14} />
              </Link>
            </Reveal>
          </div>
          <ul className="mt-10 grid border-l-2 border-t-2 border-[var(--edge)] sm:grid-cols-2 lg:grid-cols-3">
            {ERP_VERTICALS.map((v, i) => (
              <li key={v.title} className="border-b-2 border-r-2 border-[var(--edge)]">
                <Link href="/contact" className="group relative flex h-full flex-col p-6 sm:p-8">
                  <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-[var(--yolk)] transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100" />
                  <span className="f-mono relative text-sm text-[var(--sub)] group-hover:text-[#0E0E10]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="f-display relative mt-8 text-2xl uppercase text-[var(--ink)] group-hover:text-[#0E0E10] sm:text-3xl">{v.title}</h3>
                  <p className="relative mt-2 text-[var(--sub)] group-hover:text-[#0E0E10]">{v.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="border-t-2 border-[var(--edge)] bg-[var(--lime)] px-5 py-16 text-[#0E0E10] sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <Reveal>
            <h2 className="f-display text-5xl uppercase sm:text-7xl">Need your own ERP?</h2>
            <p className="mt-3 max-w-xl text-lg">Tell us how your business runs — we&apos;ll customise one of ours or build it from scratch.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/contact" className="btn btn-ink !px-8 !py-5">
              Talk to us <Arrow size={15} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
