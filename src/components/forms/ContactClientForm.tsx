"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Boxes, Check, Copy, Globe, PenTool, Smartphone, Sparkles, Workflow } from "lucide-react";
import FAQSection from "@/components/ui/FAQSection";
import PageHero from "@/components/ui/PageHero";
import { Arrow, EASE, Spark } from "@/components/ui/motion";

const SOCIALS = [
  { name: "Instagram", link: "#", color: "#FF8FB4" },
  { name: "Email", link: "mailto:genzdevworks@gmail.com", color: "#FFD23F" },
  { name: "WhatsApp", link: "https://wa.me/916202585952", color: "#34D399" },
  { name: "LinkedIn", link: "#", color: "#60A5FA" },
];

const PROJECT_TYPES = [
  { id: "web", label: "Web Development", icon: Globe, color: "#34D399" },
  { id: "mobile", label: "Mobile App", icon: Smartphone, color: "#60A5FA" },
  { id: "ai", label: "AI Solutions", icon: Sparkles, color: "#C4B5FD" },
  { id: "automation", label: "Automation", icon: Workflow, color: "#FF9A6B" },
  { id: "branding", label: "Branding", icon: PenTool, color: "#FF8FB4" },
  { id: "custom", label: "Custom Software", icon: Boxes, color: "#FFD23F" },
];

const BUDGETS = ["$10k – $25k", "$25k – $50k", "$50k – $100k", "$100k+"];
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Flexible"];

const FAQS = [
  {
    q: "What's the typical budget range?",
    a: "Most engagements land between $10k and $100k depending on scope. Tell us your range and we'll shape the proposal around it rather than the other way around.",
  },
  {
    q: "How fast do you respond?",
    a: "Within one business day, usually much sooner. You'll hear from a person, not an autoresponder — we'll follow up with clarifying questions if needed before proposing a plan.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, happy to sign an NDA before any detailed discussion if your project is early-stage or sensitive. Just mention it in the details field.",
  },
  {
    q: "Can you work with our in-house team?",
    a: "Regularly. We slot in alongside existing engineering, design, or product teams and adjust our process to fit however you already work.",
  },
];

const STEPS = ["Basics", "Project", "Scope", "Details"];

export default function ContactClientForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    types: [] as string[],
    budget: "",
    timeline: "",
    details: "",
  });

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  };

  const canAdvance =
    (step === 0 && form.name.trim() && form.email.trim()) ||
    (step === 1 && form.types.length > 0) ||
    (step === 2 && form.budget && form.timeline) ||
    step === 3;

  const goTo = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdvance) return;
    if (step < STEPS.length - 1) {
      goTo(step + 1);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setIsSuccess(true);
      else alert("Something went wrong. Please try again.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleType = (id: string) =>
    setForm((f) => ({ ...f, types: f.types.includes(id) ? f.types.filter((t) => t !== id) : [...f.types, id] }));

  return (
    <main className="relative min-h-screen bg-[var(--bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
          }),
        }}
      />

      {/* Hero */}
      <PageHero
        label="Contact"
        labelColor="var(--emerald)"
        line1="Let's build"
        line2="the"
        highlight="future."
        highlightBg="var(--yolk)"
        description="Tell us what you're building. Four quick steps, under two minutes, straight to a real person on the team."
        chips={[{ text: "Accepting new projects", bg: "#34D399" }, { text: "Reply < 24h", bg: "#FFD23F" }, { text: "NDA on request" }]}
        actions={
          <>
            <a href="#brief" className="btn btn-yolk !px-7 !py-5">
              Fill the brief <Arrow size={15} />
            </a>
            <a href="https://wa.me/916202585952" target="_blank" rel="noopener noreferrer" className="btn btn-paper !px-7 !py-5">
              WhatsApp us
            </a>
          </>
        }
        aside={
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 6 }}
            whileHover={{ rotate: -4, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.3 }}
            className="relative border-[3px] border-[#0E0E10] bg-[var(--yolk)] p-5 shadow-[10px_10px_0_var(--shadow)]"
          >
            <Spark size={40} color="#FF3D7F" className="spin-slow absolute -left-5 -top-5" />
            <Image src="/images/logo-modified.png" alt="GenZDevWorks logo" width={320} height={320} priority className="h-40 w-40 object-contain lg:h-56 lg:w-56" />
          </motion.div>
        }
      />

      {/* Body */}
      <div id="brief" className="scroll-mt-20 border-t-2 border-[var(--edge)] bg-[var(--paper)] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="panel-emerald halftone flex min-h-[460px] flex-col items-start justify-end border-2 border-[var(--edge)] p-8 shadow-[10px_10px_0_var(--shadow)] sm:p-12"
              >
                <span className="grid h-16 w-16 place-items-center border-2 border-[#0E0E10] bg-[var(--yolk)] text-[#0E0E10]">
                  <Check size={32} strokeWidth={3} />
                </span>
                <h2 className="f-display mt-8 text-5xl sm:text-6xl">Brief received.</h2>
                <p className="mt-4 max-w-md text-lg text-white/85">
                  Thanks, {form.name.split(" ")[0]}. We&apos;ll read it properly and get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="border-2 border-[var(--edge)] bg-[var(--bg)] shadow-[10px_10px_0_var(--shadow)]">
                {/* step tabs */}
                <div className="grid grid-cols-4 border-b-2 border-[var(--edge)]">
                  {STEPS.map((label, i) => {
                    const done = i < step;
                    const current = i === step;
                    return (
                      <button
                        key={label}
                        type="button"
                        disabled={i > step}
                        onClick={() => goTo(i)}
                        className={`relative flex flex-col items-start gap-1 px-3 py-3 text-left transition-colors sm:px-5 sm:py-4 ${i > 0 ? "border-l-2 border-[var(--edge)]" : ""} ${
                          current ? "bg-[var(--yolk)] text-[#0E0E10]" : done ? "bg-[var(--ink)] text-[var(--bg)]" : "text-[var(--sub)]"
                        }`}
                      >
                        <span className="label !text-[10px] opacity-70">{done ? "✓ done" : `Step ${i + 1}`}</span>
                        <span className="f-display-narrow text-sm sm:text-lg">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative min-h-[340px] overflow-hidden p-6 sm:p-10">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      initial={{ opacity: 0, x: dir * 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: dir * -40 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      {step === 0 && (
                        <div className="flex flex-col gap-8">
                          <BigInput id="name" label="What's your name?" placeholder="Alex Rivera" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                          <BigInput
                            id="email"
                            type="email"
                            label="Where can we reach you?"
                            placeholder="alex@startup.com"
                            value={form.email}
                            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                          />
                        </div>
                      )}

                      {step === 1 && (
                        <div>
                          <p className="f-display-narrow text-2xl text-[var(--ink)] sm:text-3xl">What are we building?</p>
                          <p className="label mt-2 text-[var(--sub)]">Pick all that apply</p>
                          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {PROJECT_TYPES.map((t) => {
                              const active = form.types.includes(t.id);
                              return (
                                <motion.button
                                  key={t.id}
                                  type="button"
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleType(t.id)}
                                  aria-pressed={active}
                                  className={`relative flex flex-col items-start gap-6 border-2 p-4 text-left transition-all duration-200 ${
                                    active ? "-translate-x-0.5 -translate-y-0.5 border-[#0E0E10] text-[#0E0E10] shadow-[4px_4px_0_#0E0E10]" : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--edge)]"
                                  }`}
                                  style={{ backgroundColor: active ? t.color : "transparent" }}
                                >
                                  <t.icon size={22} strokeWidth={2} />
                                  <span className="text-[15px] font-semibold leading-tight">{t.label}</span>
                                  {active && <Check size={16} strokeWidth={3} className="absolute right-3 top-3" />}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="flex flex-col gap-10">
                          <ChipGroup label="Estimated budget" options={BUDGETS} value={form.budget} onPick={(b) => setForm((f) => ({ ...f, budget: b }))} />
                          <ChipGroup label="Timeline" options={TIMELINES} value={form.timeline} onPick={(t) => setForm((f) => ({ ...f, timeline: t }))} />
                        </div>
                      )}

                      {step === 3 && (
                        <div className="flex flex-col gap-4">
                          <label htmlFor="details" className="f-display-narrow text-2xl text-[var(--ink)] sm:text-3xl">
                            Anything else we should know?
                          </label>
                          <textarea
                            id="details"
                            rows={6}
                            value={form.details}
                            onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                            placeholder="Links, references, constraints, existing tech stack…"
                            className="field resize-none"
                          />
                          <p className="text-sm text-[var(--sub)]">By submitting, you agree to our Privacy Policy.</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between border-t-2 border-[var(--edge)] p-4 sm:px-10 sm:py-5">
                  <button
                    type="button"
                    onClick={() => goTo(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="label flex items-center gap-2 text-[var(--sub)] transition-colors hover:text-[var(--ink)] disabled:invisible"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button type="submit" disabled={!canAdvance} className="btn btn-ink">
                      Continue <Arrow size={14} />
                    </button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="btn btn-yolk">
                      {isSubmitting ? "Sending…" : "Send brief"} {!isSubmitting && <Arrow size={14} />}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Side */}
          <aside className="flex flex-col gap-10 lg:sticky lg:top-28 lg:col-span-5 lg:h-fit">
            {/* receipt */}
            <div className="relative -rotate-1 bg-[#FFFDF8] px-6 pb-8 pt-6 text-[#0E0E10] shadow-[6px_6px_0_var(--shadow)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),95%_100%,90%_calc(100%-10px),85%_100%,80%_calc(100%-10px),75%_100%,70%_calc(100%-10px),65%_100%,60%_calc(100%-10px),55%_100%,50%_calc(100%-10px),45%_100%,40%_calc(100%-10px),35%_100%,30%_calc(100%-10px),25%_100%,20%_calc(100%-10px),15%_100%,10%_calc(100%-10px),5%_100%,0_calc(100%-10px))]">
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#0E0E10]/40 pb-3">
                <span className="f-display-narrow text-lg">YOUR BRIEF</span>
                <span className="f-mono text-xs opacity-60">GENZDEVWORKS</span>
              </div>
              <dl className="f-mono mt-3 flex flex-col gap-2.5 text-[13px]">
                <ReceiptRow label="FROM" value={form.name} />
                <ReceiptRow label="EMAIL" value={form.email} />
                <ReceiptRow label="PROJECT" value={PROJECT_TYPES.filter((t) => form.types.includes(t.id)).map((t) => t.label).join(", ")} />
                <ReceiptRow label="BUDGET" value={form.budget} />
                <ReceiptRow label="TIMELINE" value={form.timeline} />
              </dl>
              <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-[#0E0E10]/40 pt-3">
                <span className="f-mono text-xs">STATUS</span>
                <span className="f-mono text-xs font-semibold">{isSuccess ? "SENT ✓" : `STEP ${step + 1}/4`}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="label text-[var(--sub)]">Rather skip the form?</p>
              {[
                { v: "genzdevworks@gmail.com", k: "email" },
                { v: "+91 6202 585 952", k: "phone" },
              ].map((c) => (
                <button
                  key={c.k}
                  onClick={() => copy(c.v, c.k)}
                  className="group flex items-center justify-between gap-4 border-2 border-[var(--edge)] bg-[var(--bg)] px-5 py-4 text-left transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow)]"
                >
                  <span className="f-display-narrow truncate text-lg text-[var(--ink)] sm:text-xl">{c.v}</span>
                  <span className={`label flex shrink-0 items-center gap-1.5 ${copied === c.k ? "text-[var(--accent)]" : "text-[var(--sub)]"}`}>
                    {copied === c.k ? <Check size={14} /> : <Copy size={14} />}
                    {copied === c.k ? "Copied" : "Copy"}
                  </span>
                </button>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-[var(--edge)] p-4">
                  <span className="f-display text-2xl text-[var(--ink)] sm:text-3xl">&lt;24h</span>
                  <span className="label mt-1 block text-[var(--sub)]">Avg. reply</span>
                </div>
                <div className="border-2 border-[var(--edge)] p-4">
                  <span className="f-display text-2xl text-[var(--ink)] sm:text-3xl">Remote</span>
                  <span className="label mt-1 block text-[var(--sub)]">All time zones</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.link}
                  target={s.link.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="label border-2 border-[var(--edge)] px-4 py-2.5 text-[var(--ink)] transition-all hover:-translate-y-0.5 hover:border-[#0E0E10] hover:text-[#0E0E10]"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = s.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                >
                  {s.name} ↗
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="border-t-2 border-[var(--edge)]">
        <FAQSection faqs={FAQS} title="Before you send it." />
      </div>
    </main>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="shrink-0 opacity-60">{label}</dt>
      <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-[#0E0E10]/40" />
      <dd className="max-w-[60%] truncate text-right font-medium">{value || "—"}</dd>
    </div>
  );
}

function ChipGroup({ label, options, value, onPick }: { label: string; options: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <div>
      <p className="f-display-narrow text-2xl text-[var(--ink)]">{label}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onPick(o)}
              aria-pressed={active}
              className={`f-mono border-2 px-4 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                active ? "-translate-y-0.5 border-[#0E0E10] bg-[var(--yolk)] text-[#0E0E10] shadow-[3px_3px_0_#0E0E10]" : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--edge)]"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BigInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="group flex flex-col gap-2">
      <label htmlFor={id} className="label text-[var(--sub)] transition-colors group-focus-within:text-[var(--accent)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={type === "email" ? "email" : "name"}
        className="f-display-narrow w-full border-b-[3px] border-[var(--edge)] bg-transparent pb-2 text-3xl text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--sub)]/30 focus:border-[var(--accent)] sm:text-4xl"
      />
    </div>
  );
}
