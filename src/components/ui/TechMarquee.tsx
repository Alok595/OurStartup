import { Marquee, Spark } from "@/components/ui/motion";

const TECH = ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "PostgreSQL", "GraphQL", "AWS", "Docker", "Framer Motion", "Python"];

export default function TechMarquee() {
  const half = Math.ceil(TECH.length / 2);
  return (
    <section aria-label="Our tech stack" className="relative overflow-hidden border-t-2 border-[var(--edge)] bg-[var(--bg)] py-12 sm:py-16">
      <p className="label mb-8 text-center text-[var(--sub)]">(04) The toolbox</p>

      <div className="relative">
        <div className="relative z-10 -mx-4 rotate-[2deg] border-y-[3px] border-[var(--edge)] bg-[#0E0E10] py-4 text-[#F3EFE6] dark:bg-[var(--yolk)] dark:text-[#0E0E10]">
          <Marquee speed={40}>
            {TECH.slice(0, half).concat(TECH.slice(0, half)).map((t, i) => (
              <span key={i} className="flex items-center gap-8 pr-8">
                <span className="f-display whitespace-nowrap text-3xl sm:text-5xl">{t}</span>
                <Spark size={26} color="#34D399" />
              </span>
            ))}
          </Marquee>
        </div>
        <div className="-mx-4 -mt-3 -rotate-[2deg] border-y-[3px] border-[var(--edge)] bg-[var(--cobalt)] py-4 text-[#F3EFE6]">
          <Marquee speed={46} reverse>
            {TECH.slice(half).concat(TECH.slice(half)).map((t, i) => (
              <span key={i} className="flex items-center gap-8 pr-8">
                <span className="f-display whitespace-nowrap text-4xl text-transparent sm:text-6xl" style={{ WebkitTextStroke: "1.5px #F3EFE6" }}>
                  {t}
                </span>
                <Spark size={26} color="#FFD23F" />
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
