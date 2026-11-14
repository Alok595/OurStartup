"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const REELS = [
  {
    id: 1,
    handle: "alexrivera",
    name: "Alex Rivera",
    company: "Founder, SyncFlow",
    likes: "12.4K",
    comments: "342",
    color: "#D9600A",
  },
  {
    id: 2,
    handle: "sarahjenkins",
    name: "Sarah Jenkins",
    company: "CTO, TechFlow Inc.",
    likes: "8.9K",
    comments: "156",
    color: "#2E5C55",
  },
  {
    id: 3,
    handle: "marcuschen",
    name: "Marcus Chen",
    company: "CEO, Innovate",
    likes: "15.2K",
    comments: "892",
    color: "#5B5F6B",
  },
  {
    id: 4,
    handle: "elenarostova",
    name: "Elena Rostova",
    company: "Director, Global Reach",
    likes: "22.1K",
    comments: "1.2K",
    color: "#1A5276",
  },
  {
    id: 5,
    handle: "davidkim",
    name: "David Kim",
    company: "VP Product, NextGen",
    likes: "5.4K",
    comments: "94",
    color: "#D9600A",
  },
];

export default function ClientReelSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--bg)] py-24">
      <div className="mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="px-6 sm:px-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="flex flex-col gap-4">
            <h2 
              className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-[var(--ink)]" 
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hear from our partners.
            </h2>
            <p className="text-lg text-[var(--sub)]" style={{ fontFamily: "var(--font-body)" }}>
              Real stories from the founders and teams we work with.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Reels Container - Horizontal Scroll */}
        <div className="relative w-full">
          {/* Fading Edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[var(--bg)] to-transparent sm:w-20" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[var(--bg)] to-transparent sm:w-20" />
          
          <div 
            ref={scrollRef}
            className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth px-6 sm:px-10 pb-8 pt-4 hide-scrollbar gap-6 sm:gap-8"
          >
            {REELS.map((reel, idx) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: EASE }}
                className="group relative flex-none snap-center overflow-hidden rounded-3xl bg-[var(--ink)] aspect-[9/16] w-[280px] sm:w-[320px] cursor-pointer shadow-xl"
              >
                {/* Abstract Background Placeholder for Video */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80 transition-opacity duration-700 group-hover:opacity-100" style={{ backgroundColor: `${reel.color}20` }}>
                  <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${reel.color} 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' }} />
                  <div className="h-48 w-48 rounded-full blur-[80px]" style={{ backgroundColor: reel.color }} />
                </div>
                
                {/* Instagram Logo Top Right */}
                <div className="absolute top-4 right-4 z-20 text-white drop-shadow-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-transform duration-300 group-hover:scale-110">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className="ml-1">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>

                {/* Right Edge Actions (Likes, Comments, Share) */}
                <div className="absolute bottom-24 right-4 flex flex-col items-center gap-6 z-20 text-white">
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover/btn:scale-110 drop-shadow-md">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className="text-xs font-semibold drop-shadow-md">{reel.likes}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover/btn:scale-110 drop-shadow-md">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <span className="text-xs font-semibold drop-shadow-md">{reel.comments}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group/btn">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover/btn:scale-110 drop-shadow-md">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="drop-shadow-md">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </div>
                </div>

                {/* Bottom Info Overlay (Instagram Style Profile & Caption) */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16 z-20">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                        <div className="h-full w-full rounded-full border-2 border-black bg-zinc-800 overflow-hidden">
                          {/* Placeholder avatar */}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white drop-shadow-md">@{reel.handle}</span>
                          <span className="text-xs font-medium text-white/90 border border-white/40 rounded px-1.5 py-0.5">Follow</span>
                        </div>
                      </div>
                    </div>
                    <div className="pr-12">
                      <p className="text-sm text-white drop-shadow-md line-clamp-2">
                        Working with the team on {reel.company} was a game changer. We scaled our product 10x in just two months! 🚀✨
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                        <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z"></path>
                      </svg>
                      <span className="text-xs text-white drop-shadow-md">Original Audio - @genzdevworks</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* spacer for the end of scroll */}
            <div className="w-[10px] sm:w-[20px] flex-none" />
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
