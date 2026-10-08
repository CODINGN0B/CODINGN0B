import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { COMPANY, IMAGES, scrollToId } from "@/lib/site";

const HeritageBlock = ({ label, value, testid }) => (
  <div className="border-l border-white/15 pl-4" data-testid={testid}>
    <p className="label-tech">{label}</p>
    <p className="mt-1.5 font-display text-sm font-medium uppercase tracking-[0.14em] text-zinc-100">{value}</p>
  </div>
);

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 120]);
  const imgY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 80]);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-32 sm:pb-20"
      data-testid="hero-section"
    >
      <motion.div className="absolute inset-0 -z-20" style={{ y: imgY }}>
        <img
          src={IMAGES.hero}
          alt="Precision machining of a metal component on a CNC machine"
          className="h-[115%] w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(6,8,10,0.94),rgba(6,8,10,0.78)_55%,rgba(6,8,10,0.55))]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#08090a_6%,transparent_55%)]" />
      <motion.div
        className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
        style={{ y: gridY }}
        aria-hidden="true"
      />

      {/* CAD-style measurement markings */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" aria-hidden="true">
        <div className="absolute left-0 top-1/2 h-px w-20 bg-white/20" />
        <div className="absolute right-0 top-[38%] h-px w-20 bg-white/20" />
        <div className="rule-ticks absolute bottom-0 left-0 h-3 w-full opacity-20" />
        <span className="absolute left-24 top-[calc(50%-18px)] font-tech text-[9px] tracking-[0.2em] text-white/35">
          X 0.000
        </span>
        <span className="absolute right-24 top-[calc(38%-18px)] font-tech text-[9px] tracking-[0.2em] text-white/35">
          Y 0.000
        </span>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="label-tech !text-[color:var(--steel)]"
          data-testid="hero-eyebrow"
        >
          Precision Manufacturing
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-4xl font-display text-5xl font-semibold uppercase leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl"
          data-testid="hero-heading"
        >
          Built to Perform.
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base"
          data-testid="hero-subtext"
        >
          Precision-engineered metal and plastic products manufactured to demanding standards.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <button
            onClick={() => scrollToId("#quote")}
            data-testid="hero-request-quote-btn"
            className="group flex items-center justify-center gap-2.5 rounded-md bg-[color:var(--steel)] px-7 py-4 font-tech text-[11px] uppercase tracking-[0.2em] text-[#06080a] transition-colors duration-300 hover:bg-[#6aa4e6] active:scale-[0.99]"
          >
            Request a Quote
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => scrollToId("#capabilities")}
            data-testid="hero-explore-btn"
            className="group flex items-center justify-center gap-2.5 rounded-md border border-white/15 bg-white/[0.02] px-7 py-4 font-tech text-[11px] uppercase tracking-[0.2em] text-zinc-200 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.06]"
          >
            Explore Capabilities
            <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-1" />
          </button>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid max-w-xl grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:mt-20"
          data-testid="hero-heritage"
        >
          <HeritageBlock label={`Est. ${COMPANY.established}`} value="Hong Kong" testid="hero-heritage-est" />
          <HeritageBlock label="Manufacturing" value="Dongguan, China" testid="hero-heritage-mfg" />
        </motion.div>
      </div>
    </section>
  );
}
