"use client";

/**
 * ContactPage.tsx
 * ----------------------------------------------------------------------------
 * Full redesign — different structure, different interaction model from the
 * previous version, same design-token contract (--bg, --ink, --sub, --line,
 * --accent).
 *
 * LAYOUT
 * 1. Hero: giant animated headline + a mouse-reactive gradient blob (mapped
 *    to pointer position via Framer Motion springs) instead of a flat
 *    background wordmark.
 * 2. Split body:
 *    LEFT (sticky) — direct contact with one-click copy, an availability
 *    stat row, social chips, AND a "live brief" card that fills in as the
 *    user progresses through the form on the right — so the page itself
 *    demonstrates the thing being sold (a considered, well-built product).
 *    RIGHT — a 4-step animated form (Basics → Project → Scope → Details)
 *    with a segmented progress bar, selectable chip/card inputs instead of
 *    plain <select>s, and step transitions via AnimatePresence.
 * 3. FAQ accordion addressing the questions people actually have before
 *    submitting a form (budget, timeline, NDA, response time).
 *
 * All motion is Framer Motion — no GSAP needed for this page.
 * ----------------------------------------------------------------------------
 */

import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import {
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Globe,
  Smartphone,
  Sparkles,
  Workflow,
  PenTool,
  Boxes,
  ChevronDown,
  Clock,
  MapPin,
} from "lucide-react";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const InstagramIcon = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const MailIcon = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const WhatsAppIcon = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 24, ...props }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const SOCIALS = [
  { name: "Instagram", icon: InstagramIcon, link: "#" },
  { name: "Email Us", icon: MailIcon, link: "mailto:genzdevworks@gmail.com" },
  { name: "WhatsApp", icon: WhatsAppIcon, link: "https://wa.me/916202585952" },
  { name: "LinkedIn", icon: LinkedinIcon, link: "#" },
];

const PROJECT_TYPES = [
  { id: "web", label: "Web Development", icon: Globe },
  { id: "mobile", label: "Mobile App", icon: Smartphone },
  { id: "ai", label: "AI Solutions", icon: Sparkles },
  { id: "automation", label: "Automation", icon: Workflow },
  { id: "branding", label: "Branding", icon: PenTool },
  { id: "custom", label: "Custom Software", icon: Boxes },
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

export default function ContactPage() {
  const [step, setStep] = useState(0);
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const blobX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const blobY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdvance) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleType = (id: string) => {
    setForm((f) => ({
      ...f,
      types: f.types.includes(id) ? f.types.filter((t) => t !== id) : [...f.types, id],
    }));
  };

  const canAdvance =
    (step === 0 && form.name.trim() && form.email.trim()) ||
    (step === 1 && form.types.length > 0) ||
    (step === 2 && form.budget && form.timeline) ||
    step === 3;

  return (
    <main className={`${display.variable} ${body.variable} ${mono.variable} relative min-h-screen bg-[var(--bg)] pb-24`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a,
              },
            })),
          }),
        }}
      />
      {/* ------------------------------------------------------------------ */}
      {/* HERO — mouse-reactive blob + headline                             */}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden border-b border-[var(--line)] px-6 pb-20 pt-32 sm:px-10 lg:pb-28 lg:pt-40"
      >
        <motion.div
          style={{ x: blobX, y: blobY }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[110px]"
        >
          <div className="h-full w-full rounded-full" style={{ backgroundColor: "var(--accent)" }} />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative z-10 mx-auto max-w-5xl flex items-center justify-between">
          <div className="max-w-lg flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 flex w-fit items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-widest text-[var(--ink)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Accepting new projects
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl font-bold leading-[0.95] tracking-tighter text-[var(--ink)] sm:text-8xl lg:text-[7rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Let's build <br className="hidden sm:block" />
              <span className="text-[var(--sub)]">the future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="mt-6 text-[15px] leading-relaxed text-[var(--sub)]"
            >
              Tell us what you're building. A four-step brief, less than two minutes, straight to a real person on
              the team.
            </motion.p>
          </div>

          {/* Floating Animated Logo (Right Side) */}
          <motion.div
            className="hidden sm:block relative z-20 cursor-pointer pointer-events-auto shrink-0"
            animate={{ 
              y: [0, -30, 0],
              rotateZ: [-2, 4, -2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.25,
              rotateZ: 0,
              filter: "drop-shadow(0px 0px 60px var(--accent))",
              transition: { duration: 0.4, type: "spring", stiffness: 200 }
            }}
          >
            <Image 
              src="/images/logo-modified.png" 
              alt="GenZDevWorks Logo" 
              width={600} 
              height={600} 
              className="w-56 h-56 sm:w-72 sm:h-72 lg:w-[400px] lg:h-[400px] object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BODY — sticky info/live-brief panel + multi-step form              */}
      {/* ------------------------------------------------------------------ */}
      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-20">
        {/* LEFT (Appears Second on Mobile, First on Desktop) */}
        <div className="order-2 flex flex-col gap-12 lg:order-1 lg:sticky lg:top-28 lg:col-span-5 lg:h-fit">
          {/* direct contact */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sub)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Direct contact
            </h3>
            <button
              onClick={() => copy("genzdevworks@gmail.com", "email")}
              className="group flex items-center justify-between rounded-2xl border border-[var(--line)] px-5 py-4 text-left transition-colors hover:border-[var(--ink)]"
            >
              <span
                className="text-xl font-medium text-[var(--ink)] sm:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                genzdevworks@gmail.com
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--sub)] transition-colors group-hover:border-[var(--ink)] group-hover:text-[var(--ink)]">
                {copied === "email" ? <Check size={14} /> : <Copy size={14} />}
              </span>
            </button>
            <button
              onClick={() => copy("+91 6202 585 952", "phone")}
              className="group flex items-center justify-between rounded-2xl border border-[var(--line)] px-5 py-4 text-left transition-colors hover:border-[var(--ink)]"
            >
              <span className="text-lg font-medium text-[var(--ink)] sm:text-xl" style={{ fontFamily: "var(--font-display)" }}>
                +91 6202 585 952
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--sub)] transition-colors group-hover:border-[var(--ink)] group-hover:text-[var(--ink)]">
                {copied === "phone" ? <Check size={14} /> : <Copy size={14} />}
              </span>
            </button>
          </div>

          {/* stat row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[var(--line)] px-4 py-4">
              <Clock size={16} className="mb-2 text-[var(--accent)]" />
              <span className="block text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                &lt; 24h
              </span>
              <span className="text-[11px] text-[var(--sub)]">Avg. response time</span>
            </div>
            <div className="rounded-2xl border border-[var(--line)] px-4 py-4">
              <MapPin size={16} className="mb-2 text-[var(--accent)]" />
              <span className="block text-lg font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                Remote-first
              </span>
              <span className="text-[11px] text-[var(--sub)]">Working across time zones</span>
            </div>
          </div>

          {/* socials */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sub)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Social channels
            </h3>
            <div className="flex flex-wrap gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  className="group flex items-center gap-2.5 rounded-full border border-[var(--line)] px-5 py-3 text-[var(--ink)] transition-all hover:-translate-y-0.5 hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]"
                >
                  <social.icon size={17} strokeWidth={1.75} />
                  <span className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* live brief — fills in as the form on the right is completed */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-6">
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sub)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Your brief, so far
            </h3>
            <div className="flex flex-col gap-3 text-[13.5px]">
              <BriefRow label="From" value={form.name || "—"} />
              <BriefRow label="Email" value={form.email || "—"} />
              <BriefRow
                label="Project"
                value={
                  form.types.length
                    ? PROJECT_TYPES.filter((t) => form.types.includes(t.id))
                        .map((t) => t.label)
                        .join(", ")
                    : "—"
                }
              />
              <BriefRow label="Budget" value={form.budget || "—"} />
              <BriefRow label="Timeline" value={form.timeline || "—"} />
            </div>
          </div>
        </div>

        {/* RIGHT — multi-step form (Appears First on Mobile, Second on Desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2 lg:col-span-7"
        >
          {isSuccess ? (
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-8 shadow-2xl sm:p-12 lg:p-14 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <Check size={40} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--ink)] tracking-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Brief Submitted!
              </h2>
              <p className="text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
                Thanks for reaching out, {form.name.split(' ')[0]}. We'll review your project and get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-8 shadow-2xl sm:p-12 lg:p-14">
              {/* progress */}
            <div className="mb-10 flex items-center gap-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-1 flex-col gap-2">
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--line)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--accent)]"
                      initial={false}
                      animate={{ scaleX: i <= step ? 1 : 0 }}
                      style={{ transformOrigin: "left" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                  <span
                    className="hidden text-[10px] uppercase tracking-widest sm:block"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: i <= step ? "var(--ink)" : "var(--sub)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="min-h-[280px]"
              >
                {step === 0 && (
                  <div className="flex flex-col gap-9">
                    <FormInput
                      id="name"
                      label="What's your name?"
                      placeholder="e.g. Alex Rivera"
                      value={form.name}
                      onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    />
                    <FormInput
                      id="email"
                      label="Email address"
                      placeholder="e.g. alex@startup.com"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <p className="mb-5 text-[13px] uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>
                      What are we building? Pick all that apply.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {PROJECT_TYPES.map((t) => {
                        const active = form.types.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleType(t.id)}
                            className="flex flex-col items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-colors"
                            style={{
                              borderColor: active ? "var(--accent)" : "var(--line)",
                              backgroundColor: active ? (active ? "var(--line)" : "transparent") : "transparent",
                            }}
                          >
                            <t.icon size={18} color={active ? "var(--accent)" : "var(--sub)"} strokeWidth={1.75} />
                            <span className="text-[13.5px] font-medium text-[var(--ink)]">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-9">
                    <div>
                      <p className="mb-4 text-[13px] uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>
                        Estimated budget
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {BUDGETS.map((b) => (
                          <Chip key={b} active={form.budget === b} onClick={() => setForm((f) => ({ ...f, budget: b }))}>
                            {b}
                          </Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-4 text-[13px] uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>
                        Timeline
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {TIMELINES.map((t) => (
                          <Chip key={t} active={form.timeline === t} onClick={() => setForm((f) => ({ ...f, timeline: t }))}>
                            {t}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-4">
                    <label
                      htmlFor="details"
                      className="text-[13px] uppercase tracking-widest text-[var(--sub)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Anything else we should know?
                    </label>
                    <textarea
                      id="details"
                      rows={6}
                      value={form.details}
                      onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
                      placeholder="Links, references, constraints, existing tech stack…"
                      className="w-full resize-none rounded-2xl border border-[var(--line)] bg-transparent p-4 text-[15px] text-[var(--ink)] placeholder-[var(--sub)] outline-none transition-colors focus:border-[var(--accent)]"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                    <p className="text-xs text-[var(--sub)]">By submitting, you agree to our Privacy Policy.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* nav */}
            <div className="mt-10 flex items-center justify-between border-t border-[var(--line)]/15 pt-6">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="flex items-center gap-2 text-[13px] font-semibold text-[var(--sub)] transition-colors hover:text-[var(--ink)] disabled:opacity-0"
                disabled={step === 0}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <ArrowLeft size={15} />
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: canAdvance ? 1.04 : 1 }}
                  whileTap={{ scale: canAdvance ? 0.97 : 1 }}
                  disabled={!canAdvance}
                  onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-[13px] font-semibold text-white transition-opacity disabled:opacity-30"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Continue
                  <ArrowRight size={15} />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.04 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                  className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-[13px] font-semibold text-white shadow-lg shadow-[var(--accent)]/25 disabled:opacity-50"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {isSubmitting ? "Sending..." : "Send brief"}
                  {!isSubmitting && <ArrowRight size={15} />}
                </motion.button>
              )}
            </div>
          </form>
          )}
        </motion.div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FAQ                                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="mx-auto mt-28 max-w-3xl px-6 sm:px-10">
        <h3
          className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--sub)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Before you send it
        </h3>
        <div className="flex flex-col divide-y divide-[var(--line)] border-t border-[var(--line)]">
          {FAQS.map((faq, i) => (
            <div key={faq.q}>
              <button
                type="button"
                onClick={() => setOpenFaq((o) => (o === i ? null : i))}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-[15px] font-medium text-[var(--ink)] sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
                  {faq.q}
                </span>
                <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={18} className="shrink-0 text-[var(--sub)]" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-[13.5px] leading-relaxed text-[var(--sub)]">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] pb-2.5 last:border-b-0 last:pb-0">
      <span className="text-[11px] uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>
        {label}
      </span>
      <span className="truncate text-right text-[13px] font-medium text-[var(--ink)]">{value}</span>
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-4 py-2 text-[13px] font-medium transition-colors"
      style={{
        borderColor: active ? "var(--accent)" : "var(--line)",
        backgroundColor: active ? "var(--line)" : "transparent",
        color: active ? "var(--accent)" : "var(--ink)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {children}
    </button>
  );
}

function FormInput({
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
    <div className="group flex flex-col gap-2 border-b border-[var(--line)] pb-2 transition-colors focus-within:border-[var(--accent)]">
      <label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sub)] transition-colors group-focus-within:text-[var(--accent)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent py-1 text-xl font-medium text-[var(--ink)] placeholder-[var(--sub)]/35 outline-none transition-colors"
        style={{ fontFamily: "var(--font-body)" }}
      />
    </div>
  );
}