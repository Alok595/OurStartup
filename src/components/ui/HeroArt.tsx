"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";

/**
 * Hand-drawn style poster that swaps with the hero's rotating word.
 * Flat shapes, hard ink outlines, square joins — matches the rest of the site.
 */

const INK = "#0E0E10";
const PAPER = "#FFFDF8";
const YOLK = "#FFD23F";
const LIME = "#CCFF2E";
const GUM = "#FF3D7F";
const MINT = "#34D399";
const SKY = "#60A5FA";
const FLAME = "#FF5A1F";

const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: "miter" as const, strokeLinecap: "square" as const };
const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Infinity, ease: "easeInOut" as const });

/** solid ink block offset behind a shape — the site's "hard shadow" */
function Shadow({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x + 6} y={y + 6} width={w} height={h} fill={INK} />;
}

function Website() {
  return (
    <>
      <Shadow x={24} y={34} w={188} h={160} />
      <rect x={24} y={34} width={188} height={160} fill={PAPER} {...S} />
      <rect x={24} y={34} width={188} height={22} fill={YOLK} {...S} />
      <rect x={33} y={41} width={8} height={8} fill={FLAME} stroke={INK} strokeWidth={2} />
      <rect x={45} y={41} width={8} height={8} fill={MINT} stroke={INK} strokeWidth={2} />
      <rect x={57} y={41} width={8} height={8} fill={SKY} stroke={INK} strokeWidth={2} />
      <rect x={76} y={40} width={124} height={10} fill={PAPER} stroke={INK} strokeWidth={2} />

      <motion.rect x={36} y={68} width={78} height={54} fill={GUM} {...S}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ originY: 1 }} />
      <motion.path d="M75 80 L79 91 L90 95 L79 99 L75 110 L71 99 L60 95 L71 91 Z" fill={YOLK} stroke={INK} strokeWidth={2}
        animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

      {[0, 1, 2].map((k) => (
        <motion.rect key={k} x={124} y={70 + k * 12} height={k === 0 ? 8 : 6} fill={INK} opacity={k === 0 ? 1 : 0.35}
          initial={{ width: 0 }} animate={{ width: [70, 52, 62][k] }} transition={{ duration: 0.5, delay: 0.3 + k * 0.1 }} />
      ))}
      <rect x={124} y={108} width={44} height={14} fill={LIME} stroke={INK} strokeWidth={2.5} />

      {[SKY, MINT, YOLK].map((c, k) => (
        <motion.rect key={c} x={36 + k * 58} y={134} width={50} height={46} fill={c} {...S}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 + k * 0.08 }} />
      ))}

      {/* cursor drifting in to click the button */}
      <motion.g animate={{ x: [190, 150, 150, 190], y: [210, 116, 116, 210] }} transition={loop(3.2, 0.6)}>
        <path d="M0 0 L0 24 L7 17 L11 27 L16 25 L12 15 L21 15 Z" fill={INK} stroke={PAPER} strokeWidth={1.5} />
      </motion.g>
    </>
  );
}

function Phone() {
  return (
    <>
      <Shadow x={78} y={18} w={88} h={196} />
      <rect x={78} y={18} width={88} height={196} fill={INK} {...S} />
      <rect x={86} y={32} width={72} height={168} fill={PAPER} />
      <rect x={110} y={23} width={24} height={4} fill={PAPER} opacity={0.4} />
      <rect x={86} y={32} width={72} height={26} fill={YOLK} stroke={INK} strokeWidth={2} />
      <rect x={93} y={41} width={30} height={7} fill={INK} />

      {[MINT, SKY, PAPER].map((c, k) => (
        <motion.rect key={k} x={93} y={66 + k * 32} width={58} height={26} fill={c} stroke={INK} strokeWidth={2.5}
          initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45, delay: 0.2 + k * 0.1 }} />
      ))}
      <rect x={86} y={176} width={72} height={24} fill={PAPER} stroke={INK} strokeWidth={2} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={97 + k * 20} y={183} width={10} height={10} fill={k === 0 ? INK : "none"} stroke={INK} strokeWidth={2} />
      ))}

      {/* push notification bobbing beside the phone */}
      <motion.g animate={{ y: [0, -8, 0] }} transition={loop(2.4)}>
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.5 }}>
          <Shadow x={18} y={56} w={78} h={34} />
          <rect x={18} y={56} width={78} height={34} fill={GUM} {...S} />
          <rect x={26} y={64} width={10} height={10} fill={PAPER} stroke={INK} strokeWidth={2} />
          <rect x={42} y={64} width={44} height={6} fill={INK} />
          <rect x={42} y={76} width={30} height={5} fill={INK} opacity={0.45} />
        </motion.g>
      </motion.g>
      <motion.g animate={{ y: [0, 8, 0], rotate: [0, 8, 0] }} transition={loop(2.8, 0.4)}>
        <Shadow x={174} y={120} w={44} h={44} />
        <rect x={174} y={120} width={44} height={44} fill={LIME} {...S} />
        <path d="M196 131 V153 M185 142 H207" stroke={INK} strokeWidth={4} />
      </motion.g>
    </>
  );
}

function Chip() {
  const pins = [0, 1, 2, 3, 4];
  return (
    <>
      <g stroke={INK} strokeWidth={3}>
        {pins.map((k) => {
          const p = 74 + k * 21;
          return (
            <g key={k}>
              <line x1={p} y1={42} x2={p} y2={60} />
              <line x1={p} y1={176} x2={p} y2={194} />
              <line x1={42} y1={p} x2={60} y2={p} />
              <line x1={176} y1={p} x2={194} y2={p} />
            </g>
          );
        })}
      </g>
      <Shadow x={60} y={60} w={116} h={116} />
      <rect x={60} y={60} width={116} height={116} fill={PAPER} {...S} />
      <rect x={68} y={68} width={8} height={8} fill={INK} />
      <motion.rect x={88} y={88} width={60} height={60} fill={LIME} {...S}
        animate={{ fill: [LIME, YOLK, LIME] }} transition={loop(2)} />
      <motion.path d="M118 96 L123 113 L140 118 L123 123 L118 140 L113 123 L96 118 L113 113 Z" fill={INK}
        animate={{ rotate: [0, 90, 180] }} transition={{ duration: 2.4, repeat: Infinity, ease: [0.7, 0, 0.2, 1] }}
        />

      {/* "typing…" bubble */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}>
        <Shadow x={150} y={14} w={74} h={34} />
        <path d="M150 14 H224 V48 H176 L164 60 V48 H150 Z" fill={GUM} {...S} />
        {[0, 1, 2].map((k) => (
          <motion.rect key={k} x={168 + k * 14} y={27} width={8} height={8} fill={INK}
            animate={{ y: [27, 22, 27] }} transition={{ duration: 0.6, delay: k * 0.15, repeat: Infinity, repeatDelay: 0.4 }} />
        ))}
      </motion.g>
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.6 }}>
        <Shadow x={12} y={186} w={80} h={34} />
        <rect x={12} y={186} width={80} height={34} fill={YOLK} {...S} />
        <rect x={20} y={195} width={54} height={6} fill={INK} />
        <rect x={20} y={206} width={36} height={5} fill={INK} opacity={0.45} />
      </motion.g>
    </>
  );
}

function Robot() {
  return (
    <>
      <line x1={120} y1={30} x2={120} y2={54} {...S} />
      <motion.rect x={111} y={16} width={18} height={18} {...S} animate={{ fill: [YOLK, PAPER, YOLK] }} transition={loop(1.2)} />

      <rect x={44} y={84} width={14} height={32} fill={SKY} {...S} />
      <rect x={182} y={84} width={14} height={32} fill={SKY} {...S} />
      <Shadow x={58} y={54} w={124} h={96} />
      <rect x={58} y={54} width={124} height={96} fill={PAPER} {...S} />

      {/* eyes: blink + look around */}
      <motion.g animate={{ scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}>
        <rect x={80} y={78} width={28} height={28} fill={INK} />
        <rect x={132} y={78} width={28} height={28} fill={INK} />
        <motion.g animate={{ x: [0, 8, 8, -2, 0] }} transition={loop(3)}>
          <rect x={86} y={84} width={9} height={9} fill={PAPER} />
          <rect x={138} y={84} width={9} height={9} fill={PAPER} />
        </motion.g>
      </motion.g>
      <rect x={86} y={118} width={68} height={18} fill={LIME} {...S} />
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1={100 + k * 13} y1={118} x2={100 + k * 13} y2={136} stroke={INK} strokeWidth={2.5} />
      ))}

      <rect x={104} y={150} width={32} height={10} fill={INK} />
      <Shadow x={70} y={160} w={100} h={58} />
      <rect x={70} y={160} width={100} height={58} fill={YOLK} {...S} />
      {[GUM, MINT, SKY].map((c, k) => (
        <motion.rect key={c} x={84 + k * 26} y={176} width={16} height={16} fill={c} stroke={INK} strokeWidth={2.5}
          animate={{ opacity: [1, 0.25, 1] }} transition={loop(1.5, k * 0.25)} />
      ))}

      {/* spinning cog */}
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
        <rect x={192} y={182} width={28} height={28} fill={PAPER} {...S} />
        <rect x={192} y={182} width={28} height={28} fill={PAPER} {...S} transform="rotate(45 206 196)" />
        <rect x={201} y={191} width={10} height={10} fill={INK} />
      </motion.g>
    </>
  );
}

function Brand() {
  return (
    <>
      <Shadow x={20} y={22} w={112} h={112} />
      <rect x={20} y={22} width={112} height={112} fill={PAPER} {...S} />
      <text x={32} y={108} fontSize={66} fill={INK} style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
        Aa
      </text>
      <rect x={28} y={30} width={7} height={7} fill={GUM} />

      {[INK, YOLK, LIME, SKY].map((c, k) => (
        <motion.rect key={c} x={20 + k * 30} y={152} width={26} height={26} fill={c} {...S}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.25 + k * 0.08 }} />
      ))}
      <rect x={20} y={190} width={116} height={6} fill={INK} />
      <rect x={20} y={202} width={80} height={5} fill={INK} opacity={0.4} />

      {/* pen tool drawing a curve */}
      <line x1={160} y1={204} x2={150} y2={150} stroke={INK} strokeWidth={1.5} />
      <line x1={212} y1={58} x2={222} y2={110} stroke={INK} strokeWidth={1.5} />
      <motion.path d="M160 204 C150 150, 222 110, 212 58" fill="none" stroke={INK} strokeWidth={5}
        animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.45, 0.8, 1], ease: "easeInOut" }} />
      <rect x={146} y={146} width={8} height={8} fill={INK} />
      <rect x={218} y={106} width={8} height={8} fill={INK} />
      <rect x={154} y={198} width={12} height={12} fill={PAPER} stroke={INK} strokeWidth={2.5} />
      <rect x={206} y={52} width={12} height={12} fill={PAPER} stroke={INK} strokeWidth={2.5} />
    </>
  );
}

function Terminal() {
  const lines = [
    [{ w: 26, c: GUM }, { w: 48, c: SKY }],
    [{ w: 18, c: PAPER, o: 0.4 }, { w: 40, c: MINT }, { w: 30, c: PAPER, o: 0.4 }],
    [{ w: 18, c: PAPER, o: 0.4 }, { w: 58, c: YOLK }],
    [{ w: 34, c: GUM }, { w: 22, c: PAPER, o: 0.4 }],
  ];
  return (
    <>
      <Shadow x={16} y={28} w={170} h={128} />
      <rect x={16} y={28} width={170} height={128} fill={INK} {...S} />
      <rect x={16} y={28} width={170} height={20} fill="#26262B" {...S} />
      {[FLAME, YOLK, MINT].map((c, k) => (
        <rect key={c} x={24 + k * 12} y={34} width={8} height={8} fill={c} />
      ))}
      <text x={28} y={70} fontSize={11} fill={LIME} style={{ fontFamily: "var(--font-mono)" }}>
        $ ship --prod
      </text>
      {lines.map((row, r) => {
        let x = 28;
        return row.map((seg, k) => {
          const el = (
            <motion.rect key={`${r}-${k}`} x={x} y={82 + r * 13} height={7} fill={seg.c} opacity={seg.o ?? 1}
              initial={{ width: 0 }} animate={{ width: seg.w }} transition={{ duration: 0.25, delay: 0.2 + r * 0.18 + k * 0.06 }} />
          );
          x += seg.w + 6;
          return el;
        });
      })}
      <motion.text x={28} y={146} fontSize={11} fill={MINT} style={{ fontFamily: "var(--font-mono)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        ✓ live in 42s
      </motion.text>
      <motion.rect x={118} y={137} width={7} height={12} fill={LIME}
        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />

      {/* server stack */}
      {[PAPER, SKY, GUM].map((c, k) => (
        <motion.g key={c} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 + k * 0.1 }}>
          <Shadow x={130} y={142 + k * 28} w={92} h={24} />
          <rect x={130} y={142 + k * 28} width={92} height={24} fill={c} {...S} />
          <motion.rect x={140} y={150 + k * 28} width={8} height={8} fill={k === 1 ? INK : MINT} stroke={INK} strokeWidth={2}
            animate={{ opacity: [1, 0.2, 1] }} transition={loop(1, k * 0.3)} />
          <rect x={156} y={152 + k * 28} width={52} height={4} fill={INK} opacity={0.5} />
        </motion.g>
      ))}
    </>
  );
}

const ART = [Website, Phone, Chip, Robot, Brand, Terminal];

export default function HeroArt({ index, bg, fg, tag }: { index: number; bg: string; fg: string; tag: string }) {
  const Art = ART[index % ART.length];
  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative aspect-square w-full overflow-hidden border-[3px] border-[var(--edge)] shadow-[8px_8px_0_var(--shadow)] transition-colors duration-500"
        style={{ backgroundColor: bg }}
      >
        <div aria-hidden className="ruled absolute inset-0 opacity-25" />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3" style={{ color: fg }}>
          <span className="f-mono text-[11px] uppercase tracking-[0.18em]">fig. {String(index + 1).padStart(2, "0")}</span>
          <span className="f-mono text-[11px] uppercase tracking-[0.18em] opacity-80">{tag}</span>
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.svg
            key={index}
            viewBox="0 0 240 240"
            aria-hidden
            className="absolute inset-[7%] top-[11%] h-[84%] w-[86%] overflow-visible"
            initial={{ y: "18%", opacity: 0, rotate: 6, scale: 0.85 }}
            animate={{ y: "0%", opacity: 1, rotate: 0, scale: 1 }}
            exit={{ y: "-18%", opacity: 0, rotate: -6, scale: 0.85 }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
          >
            <Art />
          </motion.svg>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
