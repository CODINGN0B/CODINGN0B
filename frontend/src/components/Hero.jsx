import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { COMPANY, IMAGES, scrollToId } from "@/lib/site";
import { useT } from "@/context/SettingsContext";

const fade = (delay, reduce) => ({
  initial: reduce ? false : { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Hero() {
  const t = useT();
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44" data-testid="hero-section">
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[linear-gradient(to_bottom,var(--ivory),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1340px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <motion.div {...fade(0, reduce)} className="flex items-center gap-4">
            <span className="h-px w-12 rule-gold" />
            <span className="label-tech" data-testid="hero-eyebrow">
              {t.hero.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            {...fade(0.08, reduce)}
            className="mt-8 max-w-2xl font-display text-4xl font-light leading-[1.14] tracking-tight text-[color:var(--graphite)] sm:text-5xl lg:text-[3.6rem]"
            data-testid="hero-heading"
          >
            {t.hero.h1a}{" "}
            <span className="text-[color:var(--gold-deep)]">{t.hero.h1b}</span>
          </motion.h1>

          <motion.p
            {...fade(0.16, reduce)}
            className="mt-8 max-w-lg text-sm leading-relaxed text-[color:var(--slate)] md:text-base"
            data-testid="hero-subtext"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div {...fade(0.24, reduce)} className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => scrollToId("#contact")}
              data-testid="hero-inquiry-btn"
              className="btn-press group flex w-full items-center justify-center gap-2.5 rounded-sm bg-[color:var(--graphite)] px-7 py-4 font-tech text-[11px] uppercase tracking-[0.18em] text-[color:var(--porcelain)] hover:bg-[color:var(--gold-deep)] sm:w-auto"
            >
              {t.nav.cta}
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToId("#capabilities")}
              data-testid="hero-capabilities-btn"
              className="btn-press group flex w-full items-center justify-center gap-2.5 rounded-sm border border-[color:var(--hairline-strong)] bg-[color:var(--surface)]/60 px-7 py-4 font-tech text-[11px] uppercase tracking-[0.18em] text-[color:var(--graphite)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-deep)] sm:w-auto"
            >
              {t.hero.cta2}
              <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-1" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-sm border border-[color:var(--hairline)] bg-[color:var(--surface)] shadow-card">
            <img
              src={IMAGES.hero}
              alt={IMAGES.heroAlt}
              width="1600"
              height="1067"
              loading="eager"
              fetchPriority="high"
              className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[480px]"
            />
            <div className="flex items-center justify-between gap-4 border-t border-[color:var(--hairline)] bg-[color:var(--surface)] px-5 py-4">
              <span className="label-tech">{t.hero.caption}</span>
              <span className="font-tech text-[10px] tracking-[0.18em] text-[color:var(--gold-deep)]">
                MET · PLA
              </span>
            </div>
          </div>
          <span
            className="pointer-events-none absolute -bottom-4 -left-4 hidden h-24 w-24 border-b border-l border-[color:var(--gold)]/50 lg:block"
            aria-hidden="true"
          />
        </motion.div>
      </div>

      <div className="relative mx-auto mt-16 max-w-[1340px] px-5 sm:px-8 md:mt-24">
        <dl className="grid gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] sm:grid-cols-3">
          {t.hero.facts.map(([k, v]) => (
            <div key={k} className="bg-[color:var(--porcelain)] px-6 py-7">
              <dt className="label-tech">{k}</dt>
              <dd className="mt-2 font-display text-base font-light tracking-tight text-[color:var(--graphite)]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
