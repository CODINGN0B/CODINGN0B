import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, ChapterTag } from "./Reveal";

const PILLARS = [
  {
    en: "Automotive-Grade DNA",
    tc: "車規級基因",
    body: "Every resin pellet and steel coil is treated like it belongs in a safety-critical assembly — because it does.",
  },
  {
    en: "Engineering First",
    tc: "工程為本",
    body: "DFM before quotation. Moldflow before steel. Data before opinion. We sell certainty, not promises.",
  },
  {
    en: "One Roof, Zero Excuses",
    tc: "一站式承擔",
    body: "Tooling, molding, stamping, finishing and assembly under one roof. One accountable partner, no hand-off gaps.",
  },
];

export default function Vision() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="vision" ref={ref} className="relative mx-auto max-w-[1600px] overflow-hidden px-6 py-24 md:px-12 md:py-36 lg:px-24" data-testid="vision-section">
      <motion.span
        style={{ y }}
        className="font-display pointer-events-none absolute -right-6 top-8 select-none text-[16rem] font-semibold leading-none text-white/[0.03] md:text-[24rem]"
        aria-hidden
      >
        01
      </motion.span>

      <Reveal>
        <ChapterTag no="01" en="Vision & Identity" tc="願景與標識" />
      </Reveal>

      <div className="mt-12 grid gap-16 lg:grid-cols-2">
        <Reveal delay={0.1}>
          <h2 className="font-display text-4xl font-semibold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl" data-testid="vision-headline">
            We don't make parts.
            <span className="mt-2 block text-[#D4AF37]">We make certainty.</span>
            <span className="mt-4 block text-xl font-medium normal-case tracking-normal text-zinc-500 md:text-2xl">
              我們製造的不僅是零件，而是確定性。
            </span>
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-zinc-400 md:text-lg">
            Since 1984, Yue Fung has existed for one reason: to remove doubt from manufacturing.
            When a Tier-1 automotive program launches with our tooling, or a flagship electronics
            device ships with our enclosures, nobody wonders whether the parts will fit. They know.
          </p>
        </Reveal>

        <div className="flex flex-col justify-center gap-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.en} delay={0.15 + i * 0.1}>
              <div
                className="glass metallic-edge group rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/30 md:p-8"
                data-testid={`vision-pillar-${i}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold tracking-wide text-zinc-100 md:text-2xl">{p.en}</h3>
                  <span className="shrink-0 text-sm text-[#D4AF37]/80">{p.tc}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{p.body}</p>
                <span className="mt-4 block h-px w-0 bg-gradient-to-r from-[#00F3FF] to-transparent transition-all duration-700 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
