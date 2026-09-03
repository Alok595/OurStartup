"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Loader2, ArrowRight, Smartphone, Monitor, Phone, Camera, Lock, Globe, Mail } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showMonkey, setShowMonkey] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(errorParam === "AccessDenied" ? "Unauthorized Google Account." : "");
  
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet'>('phone');
  const [activeApp, setActiveApp] = useState<'login' | 'homescreen' | 'call' | 'camera'>('login');
  const [dialNumber, setDialNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const handleNavBack = () => {
    if (activeApp === 'homescreen') {
      router.push('/');
    } else {
      setActiveApp('homescreen');
    }
  };

  const handleNavHome = () => {
    setActiveApp('homescreen');
  };

  const handleNavRecent = () => {
    setActiveApp('homescreen');
  };
  
  const [batteryLevel, setBatteryLevel] = useState(10);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCharging) {
      interval = setInterval(() => {
        setBatteryLevel(prev => (prev < 100 ? prev + 10 : 100));
      }, 300);
    } else {
      interval = setInterval(() => {
        setBatteryLevel(prev => (prev > 0 ? prev - 1 : 0));
      }, 200); // Dramatically faster drain
    }
    return () => clearInterval(interval);
  }, [isCharging]);

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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setShowMonkey(false);
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setShowFlash(true);
        try {
          const audio = new Audio("/sounds/shutter.mp3");
          audio.volume = 0.5;
          audio.play();
        } catch(e) {}
        setTimeout(() => {
          setShowFlash(false);
          setShowMonkey(true);
          setLoginError("Caught you! Password incorrect, you cheeky monkey 🐒📸");
          setLoading(false);
        }, 150);
      } else {
        setLoginSuccess(true);
        triggerLaunch(() => router.push(callbackUrl));
      }
    } catch (error: any) {
      setShowFlash(true);
      try {
        const audio = new Audio("/sounds/shutter.mp3");
        audio.volume = 0.5;
        audio.play();
      } catch(e) {}
      setTimeout(() => {
        setShowFlash(false);
        setShowMonkey(true);
        setLoginError("Caught you! Password incorrect, you cheeky monkey 🐒📸");
        setLoading(false);
      }, 150);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    triggerLaunch(() => signIn("google", { callbackUrl }));
  };

  return (
    <main className={`immersive-wrapper ${display.variable} ${body.variable} ${mono.variable}`}>
      
      {/* 3D Scene Container */}
      <div className="scene3d">
        {/* Floating Device Frame */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20, rotateY: -15, scale: 0.9 }}
          animate={
            loginSuccess 
              ? { opacity: 0, scale: 4, filter: 'blur(10px)', transition: { duration: 0.8, ease: 'easeInOut' } }
              : { opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }
          }
          transition={!loginSuccess ? { duration: 1.2, type: 'spring', bounce: 0.3 } : undefined}
          className={`device-frame ${deviceType}`}
        >
          {/* Dynamic Island Notch */}
          {deviceType === 'phone' && (
            <div className="dynamic-island">
              <div className="camera-lens"></div>
            </div>
          )}

          {/* Glare effect on the phone screen */}
          <div className="screen-glare"></div>
          
          {/* Hardware Buttons */}
          <div className="volume-up"></div>
          <div className="volume-down"></div>
          <div className="power-button"></div>

          {/* Actual Phone Screen (The App UI) */}
          <div className="device-screen">
            {/* Status Bar */}
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-50 text-[var(--ink)] opacity-70 text-[10px] font-medium pointer-events-none" style={{ fontFamily: "var(--font-mono)" }}>
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                <div className="relative flex items-center border border-current rounded-[3px] w-6 h-3 p-[1px]">
                  <div className={`h-full transition-all duration-300 rounded-[1.5px] ${batteryLevel <= 20 && !isCharging ? 'bg-red-500' : 'bg-current'}`} style={{ width: `${batteryLevel}%` }} />
                  {isCharging && <span className="absolute -left-4 text-green-500 text-[12px]">⚡</span>}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showFlash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1, exit: { duration: 0.6 } }}
                  className="absolute inset-0 bg-white z-[9999] pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Dead Battery Black Screen */}
            <AnimatePresence>
              {batteryLevel === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-[#09090b] z-[9000] flex flex-col items-center justify-center p-6 text-white text-center select-none"
                >
                  {/* Empty Battery Graphic */}
                  <div className="relative w-20 h-10 border-4 border-red-500 rounded-lg flex items-center p-1 mb-4 shadow-[0_0_24px_rgba(239,68,68,0.4)]">
                    <div className="w-2.5 h-full bg-red-500 rounded-sm animate-pulse" />
                    {/* Battery terminal pip */}
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-4 bg-red-500 rounded-r-sm" />
                  </div>

                  {/* Pulsing Cable / Plug Icon */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="flex items-center gap-1.5 text-red-400 mb-2"
                  >
                    <span className="text-2xl">🔌</span>
                    <span className="text-lg font-mono">⚡</span>
                  </motion.div>

                  <h3 className="text-sm font-semibold tracking-wider uppercase text-red-400" style={{ fontFamily: "var(--font-display)" }}>
                    Battery Exhausted
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 max-w-[210px] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    Device powered off. Turn on the wall socket switch to recharge.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsCharging(true)}
                    className="mt-6 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 active:scale-95 border border-red-500/40 rounded-xl text-xs text-red-200 font-medium tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-red-500/20"
                  >
                    <span>⚡</span> Turn On Charger Switch
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Screen Content Based on Active App */}
            {activeApp === 'login' && (
              <>
                {/* Soft UI Login Background */}
                <div className="phone-wallpaper"></div>
                
                <div className="login-card-inner">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="brand-header"
                  >
                    <div className="logo-container">
                      <img 
                        src="/images/logo-modified.png" 
                        alt="Logo" 
                        style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} 
                      />
                    </div>
                    <h1 className="brand-title" style={{ fontFamily: "var(--font-display)" }}>
                      Admin <span className="brand-subtitle">Portal</span>
                    </h1>
                    <p className="brand-description" style={{ fontFamily: "var(--font-body)" }}>GenZDevWorks Workspace</p>
                  </motion.div>

                  {showMonkey ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="flex flex-col items-center gap-6 w-full mt-4 z-20 relative"
                    >
                      <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-2 border-[var(--line)]">
                        <img src="/images/monkey.jpg" alt="Caught you!" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-center font-mono text-sm leading-relaxed text-[var(--accent)] max-w-[200px]">
                        {loginError}
                      </p>
                      <button 
                        type="button" 
                        onClick={() => { setShowMonkey(false); setLoginError(''); setPassword(''); }} 
                        className="solid-btn w-full mt-2"
                      >
                        <div className="btn-content">
                          <span style={{ fontFamily: "var(--font-mono)" }}>Try Again</span>
                        </div>
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <motion.form 
                        onSubmit={handleEmailLogin} 
                        className="login-form"
                        animate={loginError ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <AnimatePresence>
                          {loginError && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }} 
                              exit={{ opacity: 0, height: 0 }}
                              className="error-message"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {loginError}
                            </motion.div>
                          )}
                        </AnimatePresence>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="input-group"
                    >
                      <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''}`}>
                        <span className="input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Admin Email"
                          required
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="clean-input"
                          style={{ fontFamily: "var(--font-body)" }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="input-group"
                    >
                      <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''}`}>
                        <span className="input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Passcode"
                          required
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          className="clean-input"
                          style={{ fontFamily: "var(--font-body)" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="eye-toggle"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {showPassword ? (
                              <motion.svg
                                key="eye-off"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.15 }}
                                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              >
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </motion.svg>
                            ) : (
                              <motion.svg
                                key="eye"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.15 }}
                                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </motion.svg>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      style={{ marginTop: '16px' }}
                    >
                      <button
                        type="submit"
                        disabled={loading || isLaunching}
                        className="solid-btn"
                      >
                        <div className="btn-content">
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                              className="spinner"
                            />
                          ) : null}
                          <span style={{ fontFamily: "var(--font-mono)" }}>{loading ? 'Authenticating...' : 'Unlock System'}</span>
                        </div>
                      </button>
                    </motion.div>
                  </motion.form>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="google-btn-wrapper"
                  >
                    <div className="divider">
                      <div className="line" />
                      <span style={{ fontFamily: "var(--font-mono)" }}>Or</span>
                      <div className="line" />
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading || isGoogleLoading || isLaunching}
                      className="google-btn"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {isGoogleLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="spinner google-spinner"
                        />
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          Continue with Google
                        </>
                      )}
                    </button>
                  </motion.div>
                    </>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="footer-info"
                  >
                    <div className="status-dot" />
                    <span style={{ fontFamily: "var(--font-mono)" }}>Encrypted Session Active</span>
                  </motion.div>
                </div>
              </>
            )}

            {/* Home Screen View */}
            {activeApp === 'homescreen' && (
              <>
                <div className="phone-wallpaper"></div>
                <HomeScreen 
                  onOpenApp={(app) => setActiveApp(app)} 
                  onOpenSite={() => router.push('/')}
                />
              </>
            )}

            {/* Phone Dialer App */}
            {activeApp === 'call' && (
              <>
                <div className="phone-wallpaper"></div>
                <PhoneDialerApp 
                  dialNumber={dialNumber}
                  setDialNumber={setDialNumber}
                  isCalling={isCalling}
                  setIsCalling={setIsCalling}
                />
              </>
            )}

            {/* Camera App */}
            {activeApp === 'camera' && (
              <CameraApp 
                onSnap={() => {
                  setShowFlash(true);
                  try {
                    const audio = new Audio("/sounds/shutter.mp3");
                    audio.volume = 0.5;
                    audio.play();
                  } catch(e) {}
                  setTimeout(() => setShowFlash(false), 150);
                }}
              />
            )}
            
            {/* Mobile Soft Navigation Bar (Back, Home, Recent/Minimize) */}
            <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-around px-10 py-1 z-50 text-[var(--ink)] opacity-50 hover:opacity-90 transition-opacity">
              {/* Back Button (App Back / Cut) */}
              <button
                type="button"
                onClick={handleNavBack}
                className="p-2 hover:scale-125 active:scale-95 transition-all text-current cursor-pointer flex items-center justify-center rounded-full hover:bg-black/5"
                title="Back"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="18,4 6,12 18,20" />
                </svg>
              </button>

              {/* Home Button (Minimize / Home) */}
              <button
                type="button"
                onClick={handleNavHome}
                className="p-2 hover:scale-125 active:scale-95 transition-all text-current cursor-pointer flex items-center justify-center rounded-full hover:bg-black/5"
                title="Home Screen"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              </button>

              {/* Recent Apps / Minimize Button */}
              <button
                type="button"
                onClick={handleNavRecent}
                className="p-2 hover:scale-125 active:scale-95 transition-all text-current cursor-pointer flex items-center justify-center rounded-full hover:bg-black/5"
                title="Overview / Home"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <AmbientBackground />
      </div>

      <div className="absolute top-6 right-6 z-50 flex gap-2 bg-[var(--bg)]/80 backdrop-blur-md p-2 rounded-2xl border border-[var(--line)] shadow-lg">
        <button 
          onClick={() => setDeviceType('phone')}
          className={`p-2 rounded-xl transition-all ${deviceType === 'phone' ? 'bg-[#ff6600] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Smartphone size={18} strokeWidth={2.5} />
        </button>
        <button 
          onClick={() => setDeviceType('tablet')}
          className={`p-2 rounded-xl transition-all ${deviceType === 'tablet' ? 'bg-[#ff6600] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Monitor size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Curved Cable */}
      <div className="fixed z-[5] pointer-events-none hidden md:block" style={{
         top: deviceType === 'tablet' ? "calc(50vh + 250px)" : "calc(50vh + 360px)", 
         left: "calc(50% - 3px)", 
         width: "calc(50vw - 6rem)", 
         bottom: "7rem",
         minHeight: "40px"
      }}>
         <div className="w-full h-full border-l-[6px] border-b-[6px] border-gray-400 rounded-bl-[40px] opacity-90 shadow-md" />
      </div>

      {/* Permanently Plugged Charger Head */}
      <div className="fixed z-[5] hidden md:block pointer-events-none" style={{
          left: "50%",
          bottom: deviceType === 'tablet' ? "calc(50vh - 280px - 15px)" : "calc(50vh - 360px - 15px)",
          transform: "translateX(-50%) rotate(-90deg)"
      }}>
        <div className="w-10 h-16 bg-gray-100 border-2 border-gray-300 rounded-lg shadow-xl flex flex-col items-center justify-center relative z-10">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-6 bg-gray-400 rounded-l-md border-y border-l border-gray-500" />
          <div className="text-[10px] font-bold text-gray-400 rotate-90 tracking-widest opacity-50">65W</div>
        </div>
      </div>

      {/* Interactive Socket with Switch */}
      <div className="absolute bottom-16 right-16 z-[100] hidden md:block">
        <div className="relative w-16 h-20 bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl shadow-2xl border-2 border-gray-400 flex flex-col items-center justify-center gap-2">
          {/* Socket holes (covered by imaginary plug) */}
          <div className="flex gap-2">
            <div className="w-2 h-4 bg-gray-700 rounded-sm" />
            <div className="w-2 h-4 bg-gray-700 rounded-sm" />
          </div>
          <div className="w-3 h-3 bg-gray-700 rounded-full mt-1" />

          {/* Connected Plug Block inside socket */}
          <div className="absolute inset-x-2 bottom-2 top-4 bg-white border-2 border-gray-300 rounded-lg shadow-md z-10" />

          {/* Wall Switch */}
          <button 
            type="button"
            onClick={() => setIsCharging(!isCharging)}
            className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-12 bg-[#e0e0e0] rounded-md border-2 border-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col cursor-pointer transition-transform relative items-center"
          >
            {/* Red ON indicator background */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-red-500" />
            
            {/* The Rocker */}
            <div className={`absolute left-0 right-0 h-[70%] bg-white rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out border-b-2 border-gray-300 flex items-center justify-center font-bold text-[8px] ${isCharging ? 'top-[30%] text-gray-600' : 'top-0 text-gray-400'}`}>
              <span className={isCharging ? "mt-[-5px]" : "mt-[5px]"}>{isCharging ? "ON" : "OFF"}</span>
            </div>
          </button>
        </div>
      </div>
      
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[var(--sub)] transition-colors hover:text-[var(--ink)] bg-[var(--bg)]/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-[var(--line)] shadow-lg"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <ArrowRight size={16} className="rotate-180" />
        Back to Site
      </Link>

      <AnimatePresence>{isLaunching && <LaunchOverlay onComplete={handleFlightComplete} />}</AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        /* Full Immersive Environment */
        .immersive-wrapper {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          background-color: var(--bg);
          overflow: hidden;
        }

        /* 3D Scene setup */
        .scene3d {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          transform-style: preserve-3d;
          pointer-events: none; /* Let background clicks pass through */
        }
        
        .scene3d > * {
          pointer-events: auto; /* Re-enable for the device frame */
        }

        /* ==================================
           THE DEVICE FRAME
           ================================== */
        .device-frame {
          position: relative;
          background: transparent;
          border: 12px solid #3d3e42;
          box-shadow: 
            0 0 0 1px #5c5d61,
            -15px 25px 45px rgba(0, 0, 0, 0.4), 
            inset 0 0 8px rgba(0, 0, 0, 0.5); 
          transform-style: preserve-3d;
          overflow: visible;
          transition: width 0.4s ease, height 0.4s ease, border-radius 0.4s ease;
        }
        
        @media (max-width: 768px) {
          .device-frame.tablet {
            transform: scale(0.6) !important;
          }
          .device-frame.phone {
            transform: scale(0.8) !important;
          }
        }
        
        .device-frame.phone {
          width: 350px;
          height: 720px;
          border-radius: 50px;
        }
        
        .device-frame.tablet {
          width: 700px;
          height: 500px;
          border-radius: 32px;
        }

        /* Glare Effect */
        .screen-glare {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            110deg,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.05) 45%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0) 55%
          );
          pointer-events: none;
          z-index: 100;
        }

        /* Dynamic Island */
        .dynamic-island {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 30px;
          background: #000;
          border-radius: 20px;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          box-shadow: inset 0 0 2px rgba(255,255,255,0.1);
        }
        .camera-lens {
          width: 12px;
          height: 12px;
          background: #0d111e;
          border-radius: 50%;
          border: 2px solid #222;
          box-shadow: inset 2px 2px 4px rgba(255,255,255,0.1);
        }

        /* Hardware Buttons */
        .volume-up, .volume-down, .power-button {
          position: absolute;
          background: #3d3e42;
          border-radius: 4px;
          box-shadow: inset 1px 1px 1px rgba(255,255,255,0.2);
        }
        
        .device-frame.phone .volume-up { width: 4px; height: 50px; left: -16px; top: 150px; }
        .device-frame.phone .volume-down { width: 4px; height: 50px; left: -16px; top: 215px; }
        .device-frame.phone .power-button { width: 4px; height: 70px; right: -16px; top: 180px; }
        
        .device-frame.tablet .volume-up { height: 4px; width: 50px; top: -16px; left: 150px; }
        .device-frame.tablet .volume-down { height: 4px; width: 50px; top: -16px; left: 215px; }
        .device-frame.tablet .power-button { width: 4px; height: 70px; right: -16px; top: 80px; }

        /* Home Indicator */
        .home-indicator {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 4px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 10px;
          z-index: 50;
        }

        /* Actual Screen UI */
        .device-screen {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 38px; 
          overflow: hidden;
          z-index: 10;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: border-radius 0.4s ease;
        }
        
        .device-frame.tablet .device-screen {
          border-radius: 20px;
        }
        
        .phone-wallpaper {
          position: absolute;
          inset: 0;
          background: var(--bg);
          opacity: 0.4;
          z-index: 1;
        }

        /* Login Layout within Phone */
        .login-card-inner {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          padding: 64px 24px 20px; 
          display: flex;
          flex-direction: column;
          gap: 22px;
          align-items: center; 
        }
        
        .device-frame.tablet .login-card-inner {
          padding-top: 24px;
          padding-bottom: 28px;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
        }

        .brand-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .device-frame.tablet .brand-header {
          gap: 4px;
        }
        
        .logo-container {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .device-frame.tablet .logo-container {
          width: 48px;
          height: 48px;
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          text-align: center;
          background: #fef2f2;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #fee2e2;
          margin-bottom: 4px;
        }
        .brand-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--ink);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .brand-subtitle {
          color: var(--accent);
        }
        .brand-description {
          font-size: 13px;
          color: var(--sub);
          margin: 0;
        }

        /* Form & Inputs */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 320px;
        }
        .input-group {
          position: relative;
        }
        .input-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 6px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .input-wrapper.focused {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(217, 96, 10, 0.15); 
        }
        .input-icon {
          padding: 0 12px;
          color: var(--sub);
          display: flex;
          transition: color 0.2s ease;
        }
        .input-wrapper.focused .input-icon {
          color: var(--accent);
        }
        .clean-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 12px 16px 12px 0;
          color: var(--ink);
          font-size: 15px;
          outline: none;
          width: 100%;
        }
        .clean-input::placeholder {
          color: var(--sub);
          opacity: 0.6;
        }
        
        /* Fix Chrome Autocomplete Background */
        .clean-input:-webkit-autofill,
        .clean-input:-webkit-autofill:hover, 
        .clean-input:-webkit-autofill:focus, 
        .clean-input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px transparent inset !important;
            -webkit-text-fill-color: var(--ink) !important;
            transition: background-color 5000s ease-in-out 0s;
        }
        
        .eye-toggle {
          background: none;
          border: none;
          padding: 0 12px;
          color: var(--sub);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }
        .eye-toggle:hover {
          color: var(--ink);
        }

        /* Solid App Button */
        .solid-btn {
          width: 100%;
          background: var(--ink);
          border: none;
          padding: 0;
          cursor: pointer;
          outline: none;
          border-radius: 14px;
          transition: transform 0.1s ease, background 0.2s ease;
        }
        .solid-btn:hover {
          background: var(--sub);
          transform: translateY(-1px);
        }
        .solid-btn:active {
          transform: translateY(1px);
        }
        .btn-content {
          padding: 16px;
          color: var(--bg);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #ffffff;
          border-radius: 50%;
        }
        
        /* Google Button Styles */
        .google-btn-wrapper {
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--sub);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.6;
        }
        
        .divider .line {
          flex: 1;
          height: 1px;
          background: var(--line);
        }
        
        .google-btn {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--line);
          padding: 12px;
          cursor: pointer;
          outline: none;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
          transition: transform 0.1s ease, background 0.2s ease, border-color 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        
        .google-btn:hover {
          background: rgba(0,0,0,0.02);
          border-color: var(--sub);
          transform: translateY(-1px);
        }
        
        .google-btn:active {
          transform: translateY(1px);
        }
        
        .google-spinner {
          border: 2px solid rgba(0,0,0,0.1);
          border-top-color: var(--ink);
        }

        /* Footer Status */
        .footer-info {
          margin-top: auto;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--sub);
          font-weight: 500;
        }
        
        .device-frame.tablet .footer-info {
          position: relative;
          bottom: auto;
          left: auto;
          transform: none;
          margin-top: 4px;
          margin-bottom: 12px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(217, 96, 10, 0.4);
        }
        `
      }} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// LaunchOverlay
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
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, -3, 3, -2, 2, 0], y: [0, 2, -2, 1, -1, 0] }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(var(--sub)_1px,transparent_1px)] [background-size:34px_34px]" />
        {[18, 34, 52, 68, 82].map((top, i) => (
          <motion.div
            key={top}
            className="absolute h-px bg-[var(--line)]"
            style={{ top: `${top}%`, left: "-20%" }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: ["0%", "40%", "0%"], opacity: [0, 0.5, 0], x: ["0vw", "140vw"] }}
            transition={{ duration: 1.1, delay: 0.5 + i * 0.08, ease: "easeIn" }}
          />
        ))}
        <motion.div
          className="absolute left-0 top-1/2"
          style={{ marginLeft: "-8vw", marginTop: "-6vw" }}
          initial={{ x: "-10vw", y: 0, rotate: 12 }}
          animate={{ x: "115vw", y: [-4, -80, -170], rotate: [12, 4, -6] }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.5, 0, 0.85, 0.35] }}
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
      <motion.path
        d="M22 52 C10 56, 6 62, 14 68 C6 66, 2 60, 10 50 C4 54, 4 46, 14 44 C10 40, 16 34, 24 40 C22 46, 26 50, 22 52 Z"
        fill="var(--accent)"
        opacity={0.85}
        animate={{ scaleX: [1, 1.25, 0.9, 1.15, 1], scaleY: [1, 0.85, 1.2, 0.95, 1] }}
        transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "20px 55px" }}
      />
      <g>
        <path d="M40 55 H100 C112 55 122 50 132 42 C122 60 122 68 132 78 C122 70 112 65 100 65 H40 Z" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="88" cy="60" r="9" stroke="var(--accent)" strokeWidth="2.5" />
        <path d="M40 55 L30 46 L36 55 Z" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M40 65 L30 74 L36 65 Z" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function AmbientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--bg)] pointer-events-none">
      <div className="absolute inset-0 blur-[100px] opacity-60">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 100, -50, 0], y: [0, -100, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{ background: 'var(--accent)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], x: [0, -100, 100, 0], y: [0, 150, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{ background: '#4F46E5' }} 
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, 50, -100, 0], y: [0, 100, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full"
          style={{ background: '#EC4899' }}
        />
      </div>
      <div className="absolute inset-0 z-20 opacity-[0.03] [background-image:radial-gradient(var(--ink)_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile Sub-Apps (Home Screen, Phone Dialer, Camera)
// ---------------------------------------------------------------------------
function HomeScreen({ onOpenApp, onOpenSite }: { onOpenApp: (app: 'login' | 'call' | 'camera') => void; onOpenSite: () => void }) {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 pt-16 pb-16 px-6 flex flex-col justify-between z-20 text-[var(--ink)] select-none"
    >
      {/* Clock & Date Widget */}
      <div className="flex flex-col items-center mt-2">
        <h2 className="text-4xl font-light tracking-tight text-[var(--ink)]" style={{ fontFamily: "var(--font-display)" }}>
          {timeStr}
        </h2>
        <p className="text-xs text-[var(--sub)] font-medium mt-1" style={{ fontFamily: "var(--font-mono)" }}>
          Thursday, Sep 3 • 24°C ☀️
        </p>

        {/* Quick Search Bar Widget */}
        <div className="w-full mt-5 bg-[var(--bg)]/80 backdrop-blur-md border border-[var(--line)] shadow-sm rounded-full py-2 px-4 flex items-center justify-between text-xs text-[var(--sub)]">
          <span className="flex items-center gap-2">
            <span className="text-sm">🔍</span> Search apps or web...
          </span>
          <span className="text-xs opacity-60">🎙️</span>
        </div>
      </div>

      {/* Main Apps Grid (2 Rows of 3) */}
      <div className="grid grid-cols-3 gap-y-5 gap-x-4 max-w-[260px] mx-auto w-full px-1 my-auto">
        {/* Admin Login App */}
        <button
          type="button"
          onClick={() => onOpenApp('login')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 active:scale-95 transition-transform relative">
            <Lock className="w-6 h-6 text-white stroke-[2.5]" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
          </div>
          <span className="text-[11px] font-medium text-[var(--ink)] tracking-tight">Admin</span>
        </button>

        {/* Phone / Call App */}
        <button
          type="button"
          onClick={() => onOpenApp('call')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 active:scale-95 transition-transform">
            <Phone className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-medium text-[var(--ink)] tracking-tight">Phone</span>
        </button>

        {/* WhatsApp App */}
        <a
          href="https://wa.me/916202585952"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg shadow-green-600/25 group-hover:scale-105 active:scale-95 transition-transform">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12.05 20.21c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.214 8.214 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.28-8.22 8.28zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.3z" />
            </svg>
          </div>
          <span className="text-[11px] font-medium text-[var(--ink)] tracking-tight">WhatsApp</span>
        </a>

        {/* Gmail App (Opens direct in Gmail web) */}
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=genzdevworks@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-105 active:scale-95 transition-transform">
            <Mail className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-medium text-[var(--ink)] tracking-tight">Gmail</span>
        </a>

        {/* Camera App */}
        <button
          type="button"
          onClick={() => onOpenApp('camera')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 group-hover:scale-105 active:scale-95 transition-transform">
            <Camera className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-medium text-[var(--ink)] tracking-tight">Camera</span>
        </button>

        {/* Startup Website App */}
        <button
          type="button"
          onClick={onOpenSite}
          className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 active:scale-95 transition-transform">
            <Globe className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-medium text-[var(--ink)] tracking-tight">Startup</span>
        </button>
      </div>
    </motion.div>
  );
}

function PhoneDialerApp({
  dialNumber,
  setDialNumber,
  isCalling,
  setIsCalling
}: {
  dialNumber: string;
  setDialNumber: React.Dispatch<React.SetStateAction<string>>;
  isCalling: boolean;
  setIsCalling: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [callState, setCallState] = useState<'ringing' | 'connected'>('ringing');
  const [funnyQuote, setFunnyQuote] = useState('');

  const funnyQuotes = [
    "🐒 \"Hello? Who gave you this private number?! I'm in the middle of fixing production code!\"",
    "🚀 \"GenZDevWorks AI Hotline: Your project valuation just increased by $10M. How can we build your vision?\"",
    "🍕 \"Thank you for calling. Your 10x developer is currently eating pizza and generating Next.js pages.\"",
    "☕ \"Warning: You have reached the caffeine emergency response unit. Drink coffee and keep shipping!\"",
  ];

  const playDTMFTone = (key: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const freqs: Record<string, [number, number]> = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
      };

      const [f1, f2] = freqs[key] || [800, 1200];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = f1;
      osc2.frequency.value = f2;
      osc1.type = 'sine';
      osc2.type = 'sine';

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.16);
      osc2.stop(ctx.currentTime + 0.16);
    } catch (e) {}
  };

  const playRingtone = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playRing = (startTime: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.value = 440;
        osc2.frequency.value = 480;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.1);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + 1.1);
        osc2.stop(startTime + 1.1);
      };

      playRing(ctx.currentTime);
      playRing(ctx.currentTime + 1.6);
    } catch (e) {}
  };

  const handleKeyClick = (key: string) => {
    playDTMFTone(key);
    setDialNumber(prev => prev + key);
  };

  const handleStartCall = () => {
    setIsCalling(true);
    setCallState('ringing');
    setFunnyQuote(funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)]);
    playRingtone();

    setTimeout(() => {
      setCallState('connected');
    }, 2800);
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setCallState('ringing');
  };

  const handleBackspace = () => {
    playDTMFTone('#');
    setDialNumber(prev => prev.slice(0, -1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 pt-16 pb-16 px-6 flex flex-col justify-between z-20 text-[var(--ink)] select-none"
    >
      {/* Calling Active State */}
      {isCalling ? (
        <div className="my-auto flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${callState === 'ringing' ? 'bg-amber-500/20 border-2 border-amber-500 animate-pulse' : 'bg-emerald-500/20 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20'}`}>
              {callState === 'ringing' ? '📳' : '📞'}
            </div>
            {callState === 'connected' && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {dialNumber || "GenZDevWorks HQ"}
          </h3>

          <p className="text-xs font-mono mt-1 font-semibold">
            {callState === 'ringing' ? (
              <span className="text-amber-500 animate-pulse">Ringing... 🔔</span>
            ) : (
              <span className="text-emerald-600">00:14 • Connected 🟢</span>
            )}
          </p>

          <div className="mt-4 p-3.5 bg-[var(--bg)]/90 border border-[var(--line)] rounded-2xl max-w-[230px] shadow-sm">
            {callState === 'ringing' ? (
              <p className="text-[11px] text-[var(--sub)] font-mono animate-pulse">
                Connecting to agency switchboard...
              </p>
            ) : (
              <p className="text-[11px] text-[var(--ink)] font-medium leading-relaxed italic">
                {funnyQuote}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleEndCall}
            className="mt-6 w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Phone className="w-7 h-7 rotate-[135deg]" />
          </button>
        </div>
      ) : (
        <>
          {/* Top Number Display */}
          <div className="flex flex-col items-center mt-2 min-h-[55px] justify-center">
            <span className="text-2xl font-mono tracking-widest text-[var(--ink)] font-semibold">
              {dialNumber || <span className="opacity-30 text-lg font-sans">Enter number...</span>}
            </span>
            {dialNumber && (
              <button 
                type="button"
                onClick={() => setDialNumber('')}
                className="text-[11px] text-[var(--accent)] font-mono mt-1 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[230px] mx-auto w-full my-auto">
            {[
              { num: '1', sub: '' },
              { num: '2', sub: 'ABC' },
              { num: '3', sub: 'DEF' },
              { num: '4', sub: 'GHI' },
              { num: '5', sub: 'JKL' },
              { num: '6', sub: 'MNO' },
              { num: '7', sub: 'PQRS' },
              { num: '8', sub: 'TUV' },
              { num: '9', sub: 'WXYZ' },
              { num: '*', sub: '' },
              { num: '0', sub: '+' },
              { num: '#', sub: '' },
            ].map(({ num, sub }) => (
              <button
                type="button"
                key={num}
                onClick={() => handleKeyClick(num)}
                className="w-13 h-13 rounded-full bg-[var(--bg)] border border-[var(--line)] shadow-sm hover:bg-black/5 active:scale-90 transition-all flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-lg font-semibold leading-none">{num}</span>
                {sub && <span className="text-[7px] text-[var(--sub)] font-bold tracking-widest leading-none mt-0.5">{sub}</span>}
              </button>
            ))}
          </div>

          {/* Call, WhatsApp & Backspace Action */}
          <div className="flex items-center justify-center gap-4 mt-1 relative">
            {/* WhatsApp Direct */}
            <a
              href={`https://wa.me/${dialNumber ? dialNumber.replace(/\D/g, '') || '916202585952' : '916202585952'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Chat on WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12.05 20.21c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.214 8.214 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.28-8.22 8.28zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.3z" />
              </svg>
            </a>

            {/* Voice Call */}
            <button
              type="button"
              onClick={handleStartCall}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Phone className="w-6 h-6 stroke-[2.5]" />
            </button>

            {dialNumber ? (
              <button
                type="button"
                onClick={handleBackspace}
                className="w-12 h-12 rounded-full text-lg text-[var(--sub)] hover:text-[var(--ink)] active:scale-90 transition-all cursor-pointer flex items-center justify-center"
              >
                ⌫
              </button>
            ) : (
              <div className="w-12 h-12" />
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

function CameraApp({ onSnap }: { onSnap: () => void }) {
  const [photoCount, setPhotoCount] = useState(0);

  const handleCapture = () => {
    setPhotoCount(prev => prev + 1);
    onSnap();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 pt-14 pb-14 bg-black flex flex-col justify-between z-20 text-white select-none overflow-hidden"
    >
      {/* Top Camera Controls */}
      <div className="flex justify-between items-center px-6 py-2 z-10">
        <span className="text-xs font-mono text-yellow-400">⚡ AUTO</span>
        <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded-full">4K • 60FPS</span>
        <span className="text-xs font-mono text-emerald-400 font-bold">● LIVE</span>
      </div>

      {/* Viewfinder with Live Monkey Video */}
      <div className="relative flex-1 mx-3 my-1 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex flex-col items-center justify-center">
        {/* Live Monkey Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/monkey.mp4" type="video/mp4" />
        </video>

        {/* Viewfinder Reticle Grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div />
        </div>

        {/* Live Face Detection Tracking Bracket */}
        <div className="w-24 h-24 border-2 border-yellow-400/90 rounded-lg relative flex items-center justify-center animate-pulse pointer-events-none">
          <span className="absolute -top-5 left-0 text-[9px] font-mono text-yellow-300 bg-black/60 px-1.5 py-0.5 rounded">
            🐵 Face Detected
          </span>
          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
        </div>

        {/* Bottom Viewfinder Overlay Text */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
          <span className="text-[10px] font-mono bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-gray-200">
            1.0x • Main Lens (24mm f/1.78)
          </span>
        </div>
      </div>

      {/* Bottom Shutter Controls */}
      <div className="flex items-center justify-around px-8 py-2 z-10">
        {/* Gallery Preview Thumbnail */}
        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center text-xs shadow-md">
          {photoCount > 0 ? (
            <img src="/images/monkey.jpg" alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-sm">🖼️</span>
          )}
        </div>

        {/* Shutter Button */}
        <button
          type="button"
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-90 transition-transform cursor-pointer shadow-lg"
          title="Take Photo"
        >
          <div className="w-full h-full bg-white rounded-full active:bg-gray-200" />
        </button>

        {/* Switch Lens Button */}
        <button 
          type="button" 
          onClick={handleCapture}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg active:rotate-180 transition-transform cursor-pointer"
          title="Switch Lens"
        >
          🔄
        </button>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--accent)]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}