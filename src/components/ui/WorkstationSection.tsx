"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { EASE, Reveal, SplitWords } from "@/components/ui/motion";

type Testimonial = { quote: string; name: string; role: string; rating: number };

const FALLBACK: Testimonial[] = [
  {
    quote:
      "They didn't just build our platform — they fundamentally rethought how our product should work. The attention to detail and engineering quality is simply unmatched.",
    name: "Sarah Jenkins",
    role: "CTO, TechFlow Inc.",
    rating: 5,
  },
  {
    quote: "Our conversion rate tripled within two months of launching. Their team operates with an intense focus on both aesthetics and raw performance.",
    name: "Marcus Aurelius",
    role: "Founder, Stoic Commerce",
    rating: 5,
  },
  {
    quote: "Working with them was the best technical decision we made this year. They delivered a complex real-time dashboard ahead of schedule.",
    name: "Elena Rodriguez",
    role: "Product Lead, FinSight",
    rating: 5,
  },
];

const CARD_COLORS = ["#FFD23F", "#34D399", "#FF8FB4", "#60A5FA", "#FF9A6B", "#C4B5FD"];

export default function WorkstationSection() {
  const [idx, setIdx] = useState(0);
  const [items, setItems] = useState<Testimonial[]>(FALLBACK);
  const [paused, setPaused] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", content: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setItems(
            data.map((d: { content: string; name: string; company?: string; rating?: number }) => ({
              quote: d.content,
              name: d.name,
              role: d.company || "Client",
              rating: d.rating || 5,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (paused || modalOpen) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length, paused, modalOpen]);

  const go = (d: number) => setIdx((p) => (p + d + items.length) % items.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setModalOpen(false);
          setSuccess(false);
          setForm({ name: "", company: "", content: "", rating: 5 });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const t = items[idx];
  const color = CARD_COLORS[idx % CARD_COLORS.length];

  return (
    <section className="relative overflow-hidden border-t-2 border-[var(--edge)] bg-[var(--bg)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="label flex items-center gap-2 text-[var(--sub)]">
                <span className="inline-block h-3 w-3 bg-[var(--sky)]" /> (05) Client stories
              </p>
            </Reveal>
            <h2 className="f-display mt-6 text-[11vw] text-[var(--ink)] sm:text-7xl lg:text-[6.2rem]">
              <SplitWords text="Kind" />{" "}
              <span className="f-serif text-[var(--accent)]">
                <SplitWords text="words." delay={0.12} />
              </span>
            </h2>
          </div>
          <Reveal delay={0.15}>
            <button onClick={() => setModalOpen(true)} className="btn btn-yolk">
              + Add your story
            </button>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Quote stack */}
          <div className="relative lg:col-span-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <motion.div
              aria-hidden
              animate={{ rotate: idx % 2 ? 3 : -3, backgroundColor: CARD_COLORS[(idx + 1) % CARD_COLORS.length] }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-[var(--edge)]"
            />
            <motion.div
              aria-hidden
              animate={{ rotate: idx % 2 ? -1.5 : 1.5, backgroundColor: color }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0 border-2 border-[var(--edge)]"
            />
            <div className="relative min-h-[340px] border-2 border-[var(--edge)] bg-[var(--paper)] p-7 sm:min-h-[320px] sm:p-10">
              <span aria-hidden className="f-serif pointer-events-none absolute -top-6 right-6 select-none text-[11rem] leading-none" style={{ color }}>
                &rdquo;
              </span>
              <AnimatePresence mode="wait">
                <motion.figure
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative flex h-full flex-col justify-between gap-10"
                >
                  <blockquote className="f-display-narrow text-2xl leading-[1.18] text-[var(--ink)] sm:text-[2rem]">{t?.quote}</blockquote>
                  <figcaption className="flex flex-wrap items-center gap-4">
                    <span className="f-display grid h-14 w-14 place-items-center border-2 border-[#0E0E10] text-2xl text-[#0E0E10]" style={{ backgroundColor: color }}>
                      {t?.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-lg font-semibold text-[var(--ink)]">{t?.name}</span>
                      <span className="label text-[var(--sub)]">{t?.role}</span>
                    </span>
                    <span className="ml-auto flex gap-1" aria-label={`${t?.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="h-3.5 w-3.5 border-2 border-[var(--edge)]" style={{ backgroundColor: i < (t?.rating ?? 5) ? "var(--yolk)" : "transparent" }} />
                      ))}
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          {/* Index */}
          <div className="flex flex-col lg:col-span-4">
            <div className="flex items-center justify-between border-b-2 border-[var(--edge)] pb-4">
              <span className="f-display text-5xl tabular-nums text-[var(--ink)]">
                {String(idx + 1).padStart(2, "0")}
                <span className="text-xl text-[var(--sub)]">/{String(items.length).padStart(2, "0")}</span>
              </span>
              <div className="flex gap-2">
                <button onClick={() => go(-1)} aria-label="Previous story" className="grid h-12 w-12 place-items-center border-2 border-[var(--edge)] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]">
                  ←
                </button>
                <button onClick={() => go(1)} aria-label="Next story" className="grid h-12 w-12 place-items-center border-2 border-[var(--edge)] bg-[var(--ink)] text-[var(--bg)] transition-colors hover:bg-[var(--yolk)] hover:text-[#0E0E10]">
                  →
                </button>
              </div>
            </div>
            <ul className="mt-2 max-h-[300px] overflow-y-auto no-scrollbar" data-lenis-prevent>
              {items.map((it, i) => (
                <li key={`${it.name}-${i}`}>
                  <button
                    onClick={() => setIdx(i)}
                    className={`group flex w-full items-center justify-between gap-3 border-b border-[var(--line)] py-4 text-left transition-colors ${
                      i === idx ? "text-[var(--ink)]" : "text-[var(--sub)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 border-2 border-[var(--edge)] transition-colors"
                        style={{ backgroundColor: i === idx ? CARD_COLORS[i % CARD_COLORS.length] : "transparent" }}
                      />
                      <span className="text-lg font-semibold">{it.name}</span>
                    </span>
                    <span className="label truncate text-right opacity-70">{it.role}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Submit modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" data-lenis-prevent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !submitting && setModalOpen(false)}
              className="absolute inset-0 bg-[#0E0E10]/70"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: 30, rotate: 2 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="relative w-full max-w-md border-2 border-[var(--edge)] bg-[var(--paper)] shadow-[10px_10px_0_var(--yolk)]"
            >
              {success ? (
                <div className="flex flex-col items-center px-8 py-14 text-center">
                  <span className="grid h-16 w-16 place-items-center border-2 border-[#0E0E10] bg-[var(--mint)] text-[#0E0E10]">
                    <Check size={30} strokeWidth={3} />
                  </span>
                  <h3 className="f-display mt-6 text-3xl text-[var(--ink)]">Got it!</h3>
                  <p className="mt-2 text-[var(--sub)]">Thanks for sharing. It&apos;ll go live once we review it.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b-2 border-[var(--edge)] bg-[var(--yolk)] px-6 py-4 text-[#0E0E10]">
                    <h3 className="f-display-narrow text-xl">Share your story</h3>
                    <button onClick={() => setModalOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center border-2 border-[#0E0E10] hover:bg-[#0E0E10] hover:text-[var(--yolk)]">
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
                    <Field label="Your name *">
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" />
                    </Field>
                    <Field label="Company / role">
                      <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="field" placeholder="Optional" />
                    </Field>
                    <Field label="Rating *" group>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm({ ...form, rating: s })}
                            aria-label={`${s} stars`}
                            className="grid h-10 w-10 place-items-center border-2 border-[var(--edge)] text-sm font-bold transition-transform hover:-translate-y-0.5"
                            style={{ backgroundColor: s <= form.rating ? "var(--yolk)" : "transparent", color: s <= form.rating ? "#0E0E10" : "var(--sub)" }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Your review *">
                      <textarea
                        required
                        rows={4}
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        className="field resize-none"
                        placeholder="What was it like working with us?"
                      />
                    </Field>
                    <button type="submit" disabled={submitting} className="btn btn-ink mt-1 w-full">
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : "Submit story →"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Field({ label, children, group = false }: { label: string; children: React.ReactNode; group?: boolean }) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className="flex flex-col gap-2" role={group ? "group" : undefined} aria-label={group ? label : undefined}>
      <span className="label text-[var(--sub)]">{label}</span>
      {children}
    </Tag>
  );
}
