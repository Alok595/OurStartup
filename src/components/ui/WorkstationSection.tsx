"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate, MotionValue } from "framer-motion";
import { Star, X, Check, Loader2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const FALLBACK_TESTIMONIALS = [
  {
    quote: "They didn't just build our platform—they fundamentally rethought how our product should work. The attention to detail and engineering quality is simply unmatched.",
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
  }
];

export default function WorkstationSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", content: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setTestimonials(data.map((d: any) => ({
              quote: d.content,
              name: d.name,
              role: d.company || "Client",
              rating: d.rating || 5
            })));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSuccess(false);
          setForm({ name: "", company: "", content: "", rating: 5 });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[100vh] items-center justify-center overflow-hidden border-b border-[var(--line)] bg-[var(--bg)] px-6 py-24 sm:px-10"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:64px_64px]" />
      
      <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-16 lg:gap-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
          <h2 
            className="text-4xl font-bold tracking-tight text-[var(--ink)] sm:text-5xl lg:text-[4rem]" 
            style={{ fontFamily: "var(--font-display)" }}
          >
            Client Stories.
          </h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 whitespace-nowrap"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Add Your Story
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">
          
          {/* Left Side: Customer Review (Text first on mobile) */}
          <div className="flex flex-col gap-8 order-1 z-10 relative min-h-[400px] lg:min-h-[350px]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--accent)" className="opacity-30">
              <path d="M14.017 21L16.44 14.282C16.63 13.719 16.73 13.119 16.73 12.5V5H21.25V12.5C21.25 15.34 19.866 18.068 17.5 19.897L14.017 21ZM5.017 21L7.44 14.282C7.63 13.719 7.73 13.119 7.73 12.5V5H12.25V12.5C12.25 15.34 10.866 18.068 8.5 19.897L5.017 21Z" />
            </svg>
            
            <div className="relative w-full flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0 flex flex-col gap-8"
                >
                  <p className="text-3xl sm:text-4xl lg:text-[2.5rem] leading-[1.3] font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
                    "{testimonials[currentIndex]?.quote}"
                  </p>
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < (testimonials[currentIndex]?.rating || 5) ? "fill-[var(--accent)] text-[var(--accent)]" : "fill-[var(--line)] text-[var(--line)]"} />
                      ))}
                    </div>
                    <div className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>{testimonials[currentIndex]?.name}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] mt-2 font-semibold" style={{ fontFamily: "var(--font-mono)" }}>{testimonials[currentIndex]?.role}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-[var(--ink)]' : 'w-2 bg-[var(--line)]'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Workstation Scene (SVG second on mobile, scaled up) */}
          <div className="relative w-full order-2 scale-[1.1] sm:scale-[1.15] lg:scale-[1.25]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
              style={{ backgroundColor: "var(--accent)", opacity: 0.12 }}
            />
            <WorkstationScene mouseX={mouseX} mouseY={mouseY} />
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-md bg-[var(--bg)] rounded-3xl shadow-2xl p-6 sm:p-8 border border-[var(--line)] overflow-hidden"
            >
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                    <Check size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: "var(--font-display)" }}>Story Submitted!</h3>
                  <p className="text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>Thank you for sharing your experience. It will be reviewed shortly.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>Share Your Story</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-[var(--sub)] hover:text-[var(--ink)] transition-colors"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ fontFamily: "var(--font-body)" }}>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Your Name *</label>
                      <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="rounded-xl border border-[var(--line)] bg-transparent p-3 text-[var(--ink)] outline-none focus:border-[var(--accent)]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Company / Role</label>
                      <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="rounded-xl border border-[var(--line)] bg-transparent p-3 text-[var(--ink)] outline-none focus:border-[var(--accent)]" placeholder="Optional" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Rating *</label>
                      <div className="flex gap-2 py-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setForm({...form, rating: star})} className="transition-transform hover:scale-110">
                            <Star size={24} className={star <= form.rating ? "fill-[var(--accent)] text-[var(--accent)]" : "fill-[var(--line)] text-[var(--line)]"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]" style={{ fontFamily: "var(--font-mono)" }}>Your Review *</label>
                      <textarea required rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="resize-none rounded-xl border border-[var(--line)] bg-transparent p-3 text-[var(--ink)] outline-none focus:border-[var(--accent)]" placeholder="What was it like working with us?" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] py-3.5 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Submit Story"}
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

function WorkstationScene({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const [revealed, setRevealed] = useState(false);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const handX = useTransform(smoothX, [0, 1], [120, 168]);
  const handY = useTransform(smoothY, [0, 1], [136, 162]);

  const personX = useTransform(smoothX, [0, 1], [-15, 15]);
  const personY = useTransform(smoothY, [0, 1], [-8, 8]);

  const armPath = useMotionTemplate`M103 130 C114 133 128 140 ${handX} ${handY}`;

  const draw = (delay = 0) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: revealed ? { pathLength: 1, opacity: 1 } : {},
    transition: { duration: 0.9, delay, ease: EASE },
  });

  const loop = (keyframes: any, duration: number, delay = 1.6) => ({
    initial: { opacity: 0 },
    animate: revealed ? keyframes : { opacity: 0 },
    transition: revealed
      ? { duration, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const, delay }
      : { duration: 0.4 },
  });

  const line = { stroke: "var(--line)", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const sub = { stroke: "var(--sub)", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const ink = { stroke: "var(--ink)", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const accent = { stroke: "var(--accent)", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

  return (
    <motion.div
      onViewportEnter={() => setRevealed(true)}
      viewport={{ once: true, margin: "-60px" }}
      className="relative aspect-video w-full"
    >
      <svg viewBox="0 0 640 260" className="h-full w-full overflow-visible" fill="none">
        {/* Expanded floor spanning the entire wide scene */}
        <motion.line x1="20" y1="246" x2="620" y2="246" {...sub} strokeWidth={1.2} opacity={0.5} {...draw(0)} />

        {/* LEFT SIDE: Server Rack & Data Nodes */}
        <motion.g>
          {/* server rack */}
          <motion.rect x="50" y="130" width="50" height="116" rx="4" {...line} {...draw(1.1)} />
          <motion.rect x="58" y="140" width="34" height="14" rx="2" {...sub} {...draw(1.2)} />
          <motion.rect x="58" y="162" width="34" height="14" rx="2" {...sub} {...draw(1.3)} />
          <motion.rect x="58" y="184" width="34" height="14" rx="2" {...sub} {...draw(1.4)} />
          <motion.rect x="58" y="206" width="34" height="14" rx="2" {...sub} {...draw(1.5)} />
          
          {/* blinking server lights */}
          <motion.circle cx="84" cy="147" r="2" fill="var(--accent)" {...loop({ opacity: [0.1, 1, 0.1] }, 0.8, 0.2)} />
          <motion.circle cx="84" cy="169" r="2" fill="var(--accent)" {...loop({ opacity: [0.1, 1, 0.1] }, 1.2, 0.7)} />
          <motion.circle cx="84" cy="191" r="2" fill="var(--accent)" {...loop({ opacity: [0.1, 1, 0.1] }, 0.9, 1.1)} />
          <motion.circle cx="84" cy="213" r="2" fill="var(--accent)" {...loop({ opacity: [0.1, 1, 0.1] }, 1.5, 0.4)} />

          {/* floating cloud/data nodes above server */}
          <motion.g {...loop({ y: [0, -6, 0] }, 3.2, 1)}>
            <motion.rect x="65" y="60" width="20" height="20" rx="4" {...accent} {...draw(1.6)} />
            <motion.circle cx="75" cy="70" r="3" fill="var(--sub)" {...draw(1.7)} />
          </motion.g>
          <motion.g {...loop({ y: [0, -4, 0] }, 2.8, 0.5)}>
            <motion.path d="M40 85 l10 -10 l10 10" {...sub} strokeWidth={1.5} {...draw(1.8)} />
          </motion.g>

          {/* data stream connecting server to main desk */}
          <motion.path
            d="M100 230 C 130 230 140 240 220 240"
            stroke="var(--sub)"
            strokeWidth={1.1}
            strokeDasharray="4 6"
            fill="none"
            opacity={revealed ? 0.4 : 0}
            animate={revealed ? { strokeDashoffset: [-30, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 2 }}
          />
        </motion.g>

        {/* RIGHT SIDE: Mobile App / Floating UI */}
        <motion.g>
          <motion.g {...loop({ y: [0, -8, 0] }, 3.8, 0.2)}>
            <motion.rect x="530" y="70" width="56" height="100" rx="8" {...line} {...draw(1.2)} />
            <motion.rect x="538" y="78" width="40" height="66" rx="3" {...sub} {...draw(1.3)} />
            {/* skeleton UI in phone */}
            <motion.line x1="544" y1="88" x2="572" y2="88" {...sub} strokeWidth={2} {...draw(1.4)} />
            <motion.line x1="544" y1="98" x2="560" y2="98" {...sub} strokeWidth={2} {...draw(1.5)} />
            <motion.line x1="544" y1="108" x2="568" y2="108" {...sub} strokeWidth={2} {...draw(1.6)} />
            <motion.circle cx="558" cy="156" r="4" {...accent} {...draw(1.7)} />
          </motion.g>

          {/* floating abstract geometry */}
          <motion.g {...loop({ y: [0, 5, 0], rotate: [0, 10, 0] }, 4.5, 1.5)} style={{ transformOrigin: "520px 165px" }}>
            <motion.path d="M500 180 L520 150 L540 180 Z" {...sub} strokeWidth={1.5} {...draw(1.8)} />
            <motion.circle cx="520" cy="165" r="3" fill="var(--accent)" {...draw(1.9)} />
          </motion.g>
        </motion.g>

        {/* CENTER: The original Workstation Scene */}
        <g transform="translate(150, 0)">
          {/* Character and Chair Group - leans slightly towards mouse */}
          <motion.g style={{ x: personX as any, y: personY as any }}>
          {/* office chair (behind person) */}
          <motion.path d="M78 190 C74 172 76 150 84 134" {...line} {...draw(0.15)} />
          <motion.rect x="70" y="190" width="34" height="8" rx="3" {...line} {...draw(0.25)} />
          <motion.line x1="87" y1="198" x2="87" y2="222" {...sub} {...draw(0.35)} />
          <motion.path d="M87 222 L72 236 M87 222 L102 236 M87 222 L87 238" {...sub} strokeWidth={1.3} {...draw(0.4)} />

          {/* seated person (simplified line figure) */}
          <motion.circle cx="102" cy="112" r="11" {...ink} {...draw(0.3)} />
          <motion.path d="M102 123 C99 140 98 162 103 184" {...ink} {...draw(0.4)} />
          {/* resting arm */}
          <motion.path d="M102 132 C107 145 104 160 98 172" {...ink} {...draw(0.55)} />
          {/* legs, bent sitting */}
          <motion.path d="M103 184 C112 187 120 187 126 184" {...ink} {...draw(0.6)} />
          <motion.path d="M126 184 C128 200 126 216 122 228" {...ink} {...draw(0.65)} />
          <motion.path d="M103 184 C96 187 90 187 86 184" {...ink} {...draw(0.6)} />
          <motion.path d="M86 184 C82 200 82 216 84 228" {...ink} {...draw(0.65)} />

          {/* typing arm + hand — reaches to the keyboard, dynamically tracks the mouse */}
          <motion.path d={armPath} {...ink} {...draw(0.7)} />
          <motion.circle cx={handX as any} cy={handY as any} r="3.4" fill="var(--ink)" />
        </motion.g>

        {/* desk */}
        <motion.rect x="118" y="150" width="184" height="9" rx="2" {...line} {...draw(0.5)} />
        <motion.line x1="132" y1="159" x2="132" y2="222" {...line} {...draw(0.75)} />
        <motion.line x1="288" y1="159" x2="288" y2="222" {...line} {...draw(0.75)} />

        {/* keyboard + mouse */}
        <motion.rect x="126" y="143" width="46" height="9" rx="2" {...sub} {...draw(0.8)} />
        <motion.rect x="178" y="141" width="9" height="13" rx="4" {...sub} {...draw(0.85)} />

        {/* monitor */}
        <motion.ellipse cx="228" cy="150" rx="18" ry="3.5" {...line} {...draw(0.55)} />
        <motion.line x1="228" y1="146.5" x2="228" y2="118" {...line} {...draw(0.6)} />
        <motion.rect x="192" y="60" width="72" height="58" rx="5" {...ink} strokeWidth={1.8} {...draw(0.45)} />
        {/* screen chrome dots */}
        <circle cx="200" cy="68" r="1.6" fill="var(--sub)" />
        <circle cx="206" cy="68" r="1.6" fill="var(--sub)" />
        <circle cx="212" cy="68" r="1.6" fill="var(--sub)" />
        <motion.line x1="200" y1="76" x2="256" y2="76" {...accent} strokeWidth={1.4} {...draw(1.0)} />
        <motion.line x1="200" y1="86" x2="248" y2="86" {...sub} strokeWidth={1.2} {...draw(1.1)} />
        <motion.line x1="200" y1="96" x2="252" y2="96" {...sub} strokeWidth={1.2} {...draw(1.2)} />
        <motion.line x1="200" y1="106" x2="232" y2="106" {...sub} strokeWidth={1.2} {...draw(1.3)} />
        {/* blinking cursor */}
        <motion.rect x="236" y="102" width="7" height="9" fill="var(--accent)" {...loop({ opacity: [1, 0, 1] }, 0.9, 1.6)} />

        {/* CPU tower */}
        <motion.rect x="270" y="164" width="26" height="52" rx="3" {...line} {...draw(0.85)} />
        <motion.line x1="276" y1="176" x2="290" y2="176" {...sub} strokeWidth={1.1} {...draw(1.0)} />
        <motion.line x1="276" y1="184" x2="290" y2="184" {...sub} strokeWidth={1.1} {...draw(1.05)} />
        <motion.g {...loop({ opacity: [0.35, 1, 0.35] }, 1.4, 1.5)}>
          <circle cx="283" cy="200" r="1.8" fill="var(--accent)" />
        </motion.g>

        {/* data cable, CPU to monitor — flows once revealed */}
        <motion.path
          d="M270 178 C 250 175 232 168 228 150"
          stroke="var(--sub)"
          strokeWidth={1.1}
          strokeDasharray="3 4"
          fill="none"
          opacity={revealed ? 0.7 : 0}
          animate={revealed ? { strokeDashoffset: [0, -28] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: 1.8 }}
        />

        {/* coffee cup + steam */}
        <motion.path d="M186 152 L189 143 H201 L204 152 Z" {...sub} strokeWidth={1.3} {...draw(1.0)} />
        <motion.path d="M201 145 C206 145 206 151 201 151" {...sub} strokeWidth={1.1} {...draw(1.1)} />
        <motion.g {...loop({ opacity: [0, 0.8, 0], y: [0, -6] }, 2.2, 1.8)}>
          <path d="M191 141 C189 137 193 135 191 131" stroke="var(--sub)" strokeWidth={1} fill="none" />
        </motion.g>
        <motion.g {...loop({ opacity: [0, 0.8, 0], y: [0, -6] }, 2.2, 2.3)}>
          <path d="M198 141 C196 137 200 135 198 131" stroke="var(--sub)" strokeWidth={1} fill="none" />
        </motion.g>

        {/* floating UI chips — product-building motifs, upper right */}
        <motion.g {...loop({ y: [0, -5, 0] }, 2.6, 1.9)}>
          <rect x="252" y="30" width="30" height="18" rx="6" fill="none" stroke="var(--accent)" strokeWidth={1.4} />
          <path d="M259 39 L256 42 L259 45 M275 39 L278 42 L275 45" stroke="var(--accent)" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>
        <motion.g {...loop({ y: [0, -4, 0] }, 2.1, 2.1)}>
          <path d="M158 34 h20 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-12 l-6 6 v-6 h-2 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4 Z" fill="none" stroke="var(--sub)" strokeWidth={1.3} />
        </motion.g>
        <motion.g {...loop({ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }, 2.4, 2.5)}>
          <circle cx="298" cy="90" r="9" fill="none" stroke="var(--accent)" strokeWidth={1.4} />
          <path d="M294 90 l3 3 l6 -7" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>
        </g>
      </svg>
    </motion.div>
  );
}
