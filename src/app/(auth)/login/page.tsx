"use client";

/**
 * LoginPage.tsx
 * ----------------------------------------------------------------------------
 * Full-viewport (h-screen) split layout:
 *   LEFT  — a rich, always-animating line-art scene: a rocket idling on its
 *           launch pad next to a gantry tower with a blinking beacon, a
 *           ringed planet, a slow orbiting satellite, drifting stars, and a
 *           dot-grid horizon. Pure atmosphere while the visitor fills the
 *           form.
 *   RIGHT — the actual sign-in form. Same next-auth logic as before
 *           (credentials + Google), untouched.
 *
 * THE "PLAY" MOMENT
 * On a successful credentials sign-in (or right before the Google redirect),
 * instead of navigating immediately, `triggerLaunch()` mounts a full-screen
 * `LaunchOverlay`: an ignition flash, a brief camera-shake, then the rocket
 * streaks from off-screen left to off-screen right on a rising arc, trailing
 * flickering flame and puffed smoke, with a couple of speed-line streaks for
 * motion. The instant that flight tween finishes (`onAnimationComplete`) the
 * queued navigation actually runs — so the "launch" always finishes before
 * the app opens, never before, never after.
 *
 * Mobile: the h-screen split doesn't work well under 1024px (the scene needs
 * real room to read), so below `lg` the layout stacks — a shorter scene up
 * top, the form below, page scrolls normally.
 * ----------------------------------------------------------------------------
 */

import { useRef, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState(errorParam === "AccessDenied" ? "Unauthorized Google Account." : "");
  const [isLaunching, setIsLaunching] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const triggerLaunch = (action: () => void) => {
    pendingAction.current = action;
    setIsLaunching(true);
  };

  const handleFlightComplete = () => {
    pendingAction.current?.();
    pendingAction.current = null;
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setIsLoading(false);
      } else {
        triggerLaunch(() => router.push(callbackUrl));
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // signIn will redirect to google and then callback to next-auth
    triggerLaunch(() => signIn("google", { callbackUrl }));
  };

  return (
    <main className={`${display.variable} ${body.variable} ${mono.variable} relative min-h-screen bg-[var(--bg)] lg:h-screen lg:overflow-hidden`}>
      <div className="grid min-h-screen grid-cols-1 lg:h-screen lg:grid-cols-2">
        {/* -------------------------------------------------------------- */}
        {/* LEFT — animated mission-control scene                          */}
        {/* -------------------------------------------------------------- */}
        <div className="relative h-[42vh] overflow-hidden border-b border-[var(--line)] lg:h-full lg:border-b-0 lg:border-r">
          <MissionScene />
          <div className="pointer-events-none absolute bottom-6 left-6 right-6 z-10 sm:bottom-10 sm:left-10">
            <span
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sub)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Status: standing by
            </span>
            <h2
              className="max-w-xs text-2xl font-bold leading-tight tracking-tight text-[var(--ink)] sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cleared for launch, admin.
            </h2>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* RIGHT — sign-in form                                           */}
        {/* -------------------------------------------------------------- */}
        <div className="flex items-center justify-center px-6 py-12 lg:overflow-y-auto lg:py-16">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--sub)] transition-colors hover:text-[var(--ink)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <ArrowRight size={16} className="rotate-180" />
              Back to Site
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8 flex flex-col gap-2">
                <h1
                  className="text-3xl font-bold tracking-tight text-[var(--ink)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Admin Portal
                </h1>
                <p className="text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
                  Sign in to manage projects and leads.
                </p>
              </div>

              {error && (
                <div
                  className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-medium text-red-500"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleCredentialsLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 text-[var(--ink)] outline-none transition-all placeholder:text-[var(--sub)]/50 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/50"
                    placeholder="admin@agency.com"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 text-[var(--ink)] outline-none transition-all placeholder:text-[var(--sub)]/50 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/50"
                    placeholder="••••••••"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading || isLaunching}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--ink)] font-semibold text-[var(--bg)] transition-all hover:bg-[var(--sub)] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-[var(--line)]" />
                <span
                  className="text-xs font-semibold uppercase tracking-widest text-[var(--sub)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Or
                </span>
                <div className="h-px flex-1 bg-[var(--line)]" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading || isLaunching}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] font-semibold text-[var(--ink)] transition-all hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/[0.02]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {isGoogleLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <p
                className="mt-8 text-center text-[11px] uppercase tracking-widest text-[var(--sub)]/60"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Encrypted session · Access logged
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>{isLaunching && <LaunchOverlay onComplete={handleFlightComplete} />}</AnimatePresence>
    </main>
  );
}

// ---------------------------------------------------------------------------
// LaunchOverlay — ignition flash + camera shake, then the rocket streaks
// left → right across the full viewport on a rising arc, trailing flame and
// smoke, before onComplete fires the queued navigation.
// ---------------------------------------------------------------------------
function LaunchOverlay({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-hidden bg-[var(--bg)]"
    >
      {/* ignition flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      {/* camera shake wrapper */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, -3, 3, -2, 2, 0], y: [0, 2, -2, 1, -1, 0] }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* starfield */}
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(var(--sub)_1px,transparent_1px)] [background-size:34px_34px]" />

        {/* speed-line streaks */}
        {[18, 34, 52, 68, 82].map((top, i) => (
          <motion.div
            key={top}
            className="absolute h-px bg-[var(--line)]"
            style={{ top: `${top}%`, left: "-20%" }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: ["0%", "50%", "0%"], opacity: [0, 0.8, 0], x: ["0vw", "140vw"] }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease: "easeIn" }}
          />
        ))}

        {/* the rocket itself */}
        <motion.div
          className="absolute left-0 top-1/2"
          style={{ marginLeft: "-8vw", marginTop: "-6vw", transform: "scale(1.5)" }}
          initial={{ x: "-20vw", y: 0, rotate: 15 }}
          animate={{ x: "120vw", y: [-4, -100, -200], rotate: [15, 5, -5] }}
          transition={{ duration: 1.0, delay: 0.1, ease: [0.5, 0, 0.85, 0.35] }}
          onAnimationComplete={onComplete}
        >
          <RocketSVG />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 text-[13px] font-semibold uppercase tracking-[0.25em] text-[var(--sub)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Launching your dashboard…
      </motion.p>
    </motion.div>
  );
}

function RocketSVG() {
  return (
    <svg viewBox="0 0 160 120" width="160" height="120" fill="none" className="overflow-visible">
      {/* smoke puffs, continuously emitted from the tail */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.circle
          key={i}
          cx="18"
          cy="60"
          r="4"
          fill="var(--sub)"
          initial={{ opacity: 0 }}
          animate={{ x: [0, -18, -42], y: [0, 8, 18], opacity: [0.6, 0.3, 0], scale: [0.5, 1, 1.6] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.13, ease: "easeOut" }}
        />
      ))}

      {/* flame */}
      <motion.path
        d="M22 52 C10 56, 6 62, 14 68 C6 66, 2 60, 10 50 C4 54, 4 46, 14 44 C10 40, 16 34, 24 40 C22 46, 26 50, 22 52 Z"
        fill="var(--accent)"
        opacity={0.85}
        animate={{ scaleX: [1, 1.25, 0.9, 1.15, 1], scaleY: [1, 0.85, 1.2, 0.95, 1] }}
        transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "20px 55px" }}
      />

      {/* rocket body */}
      <g>
        <path d="M40 55 H100 C112 55 122 50 132 42 C122 60 122 68 132 78 C122 70 112 65 100 65 H40 Z" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="88" cy="60" r="9" stroke="var(--accent)" strokeWidth="2.5" />
        <path d="M40 55 L30 46 L36 55 Z" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M40 65 L30 74 L36 65 Z" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MissionScene — idle left-panel illustration: rocket on the pad, gantry
// tower with a blinking beacon, a ringed planet, an orbiting satellite,
// drifting stars, dot-grid horizon.
// ---------------------------------------------------------------------------
const SCENE_STARS = [
  { x: 30, y: 40, r: 1.3, d: 2.6 }, { x: 80, y: 20, r: 1, d: 3.2 },
  { x: 140, y: 60, r: 1.4, d: 2.3 }, { x: 200, y: 30, r: 1, d: 3.6 },
  { x: 260, y: 70, r: 1.2, d: 2.8 }, { x: 320, y: 25, r: 1, d: 3.1 },
  { x: 360, y: 90, r: 1.3, d: 2.5 }, { x: 60, y: 110, r: 1, d: 3.4 },
  { x: 300, y: 130, r: 1.1, d: 2.9 }, { x: 180, y: 100, r: 1, d: 3.3 },
];

function MissionScene() {
  return (
    <div className="absolute inset-0 bg-[var(--bg)]">
      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(var(--line)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-[0.08] blur-[110px]" />

      <svg viewBox="0 0 400 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* stars */}
        {SCENE_STARS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="var(--sub)"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: s.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        ))}

        {/* ringed planet, upper right */}
        <g transform="translate(320 55)">
          <motion.circle
            r="22"
            stroke="var(--line)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.ellipse
            rx="36"
            ry="9"
            stroke="var(--accent)"
            strokeWidth="1.1"
            opacity={0.4}
            transform="rotate(-16)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
        </g>

        {/* orbiting satellite around the planet */}
        <motion.g
          style={{ transformOrigin: "320px 55px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="358" cy="55" r="3.5" fill="var(--accent)" />
        </motion.g>

        {/* dashed distant orbit trail, lower area */}
        <motion.ellipse
          cx="150"
          cy="250"
          rx="150"
          ry="46"
          stroke="var(--line)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity={0.7}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />

        {/* ground line */}
        <line x1="0" y1="360" x2="400" y2="360" stroke="var(--line)" strokeWidth="1.5" />

        {/* gantry tower */}
        <g transform="translate(230 200)">
          <line x1="0" y1="0" x2="0" y2="160" stroke="var(--sub)" strokeWidth="1.6" />
          <line x1="0" y1="20" x2="18" y2="20" stroke="var(--sub)" strokeWidth="1.2" />
          <line x1="0" y1="60" x2="18" y2="60" stroke="var(--sub)" strokeWidth="1.2" />
          <line x1="0" y1="100" x2="18" y2="100" stroke="var(--sub)" strokeWidth="1.2" />
          <line x1="0" y1="140" x2="18" y2="140" stroke="var(--sub)" strokeWidth="1.2" />
          <motion.circle
            cx="0"
            cy="0"
            r="3"
            fill="var(--accent)"
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>

        {/* rocket idling on the pad */}
        <motion.g
          transform="translate(150 260) scale(1.15)"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* idle flame flicker */}
          <motion.path
            d="M-4 96 C-14 100, -18 108, -8 112 C-16 110, -20 102, -10 94 Z"
            fill="var(--accent)"
            opacity={0.9}
            animate={{ scaleY: [1, 1.4, 0.75, 1], opacity: [0.7, 1, 0.6, 0.7] }}
            transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "-8px 100px" }}
          />
          {/* fins */}
          <path d="M-14 70 L-26 96 L-14 90 Z" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M14 70 L26 96 L14 90 Z" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
          {/* body */}
          <motion.path
            d="M0 0 C16 20, 16 70, 16 90 L-16 90 C-16 70, -16 20, 0 0 Z"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
          <circle cx="0" cy="34" r="10" stroke="var(--accent)" strokeWidth="2.5" />
        </motion.g>
      </svg>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}