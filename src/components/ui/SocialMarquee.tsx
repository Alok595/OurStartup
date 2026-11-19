"use client";

import { Arrow, Reveal } from "@/components/ui/motion";

const SOCIALS = [
  { name: "Instagram", handle: "@genzdevworks", link: "#", color: "#FF3D7F" },
  { name: "Email", handle: "genzdevworks@gmail.com", link: "mailto:genzdevworks@gmail.com", color: "#FFD23F" },
  { name: "WhatsApp", handle: "+91 6202 585 952", link: "https://wa.me/916202585952", color: "#34D399" },
  { name: "LinkedIn", handle: "GenZDevWorks", link: "#", color: "#60A5FA" },
];

export default function SocialMarquee() {
  return (
    <section className="border-t-2 border-[var(--edge)] bg-[var(--bg)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="label flex items-center gap-2 text-[var(--sub)]">
            <span className="inline-block h-3 w-3 bg-[var(--mint)]" /> (07) Find us
          </p>
        </Reveal>
        <ul className="mt-8 border-t-2 border-[var(--edge)]">
          {SOCIALS.map((s, i) => (
            <Reveal as="li" key={s.name} delay={i * 0.06} className="border-b-2 border-[var(--edge)]">
              <a
                href={s.link}
                target={s.link.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between gap-4 overflow-hidden px-2 py-4 sm:py-5"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100"
                  style={{ backgroundColor: s.color }}
                />
                <span className="relative flex items-baseline gap-4 transition-[transform,color] duration-500 ease-[var(--ease-out)] group-hover:translate-x-4 group-hover:text-[#0E0E10] sm:gap-8">
                  <span className="label opacity-50">0{i + 1}</span>
                  <span className="f-display text-[10vw] text-[var(--ink)] transition-colors group-hover:text-[#0E0E10] sm:text-6xl lg:text-7xl">{s.name}</span>
                </span>
                <span className="relative flex items-center gap-4 transition-colors group-hover:text-[#0E0E10]">
                  <span className="f-mono hidden text-sm text-[var(--sub)] transition-colors group-hover:text-[#0E0E10] md:block">{s.handle}</span>
                  <span className="grid h-12 w-12 place-items-center border-2 border-[var(--edge)] text-[var(--ink)] transition-transform duration-500 group-hover:rotate-45 group-hover:border-[#0E0E10] group-hover:bg-[#0E0E10] group-hover:text-[#FFFDF8] sm:h-16 sm:w-16">
                    <Arrow size={22} />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
