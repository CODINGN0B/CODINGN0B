import { useState } from "react";
import { motion } from "framer-motion";
import CarShowcase, { ModelLoadingOverlay } from "./CarShowcase";
import { scrollTo } from "./Navbar";

const MODES = [
  { id: "default", en: "Default", tc: "標準" },
  { id: "exploded", en: "Exploded", tc: "分解" },
  { id: "xray", en: "X-Ray", tc: "透視" },
  { id: "wireframe", en: "Wireframe", tc: "線框" },
];

const MaskedLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero({ onQuote }) {
  const [mode, setMode] = useState("default");

  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-0 z-0">
        <CarShowcase mode={mode} />
      </div>
      <ModelLoadingOverlay />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,10,10,0.85)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

      <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-6 pb-8 pt-28 md:px-12 lg:px-24">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-tech text-[10px] uppercase tracking-[0.35em] text-[#00F3FF] md:text-xs"
            data-testid="hero-overline"
          >
            裕豐金屬塑料製品有限公司 · Est. 1984 · Hong Kong
          </motion.p>
          <h1 className="font-display mt-6 text-5xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl" data-testid="hero-headline">
            <MaskedLine delay={0.45}>Where</MaskedLine>
            <MaskedLine delay={0.58}>Microns</MaskedLine>
            <MaskedLine delay={0.71}>
              Become <span className="text-[#D4AF37]">Millions</span>
            </MaskedLine>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400 md:text-base"
            data-testid="hero-subcopy"
          >
            Precision tooling, injection molding and high-tolerance metal stamping for the world's
            most demanding automotive and electronics programs.
            <span className="mt-2 block text-[#D4AF37]/80">精密模具 · 注塑成型 · 金屬沖壓</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25 }}
            className="pointer-events-auto mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onQuote}
              data-testid="hero-request-quote-btn"
              className="gold-glow rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37] px-7 py-3.5 font-tech text-xs font-bold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:-translate-y-0.5"
            >
              Request a Quote 索取報價
            </button>
            <button
              onClick={() => scrollTo("#capabilities")}
              data-testid="hero-capabilities-btn"
              className="glass metallic-edge cyan-glow rounded-lg px-7 py-3.5 font-tech text-xs uppercase tracking-[0.22em] text-zinc-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              View Capabilities →
            </button>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.4 }}
            className="pointer-events-auto glass metallic-edge inline-flex flex-wrap rounded-xl p-1.5"
            data-testid="view-mode-toggles"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                data-testid={`mode-toggle-${m.id}`}
                className={`rounded-lg px-4 py-2.5 font-tech text-[10px] uppercase tracking-[0.18em] transition-all duration-300 md:text-[11px] ${
                  mode === m.id
                    ? "bg-[#00F3FF]/15 text-[#00F3FF] shadow-[inset_0_0_0_1px_rgba(0,243,255,0.4),0_0_18px_rgba(0,243,255,0.15)]"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {m.en} <span className="ml-1 opacity-70">{m.tc}</span>
              </button>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            onClick={() => scrollTo("#stats")}
            className="pointer-events-auto hidden items-center gap-3 font-tech text-[10px] uppercase tracking-[0.3em] text-zinc-500 transition-colors hover:text-zinc-200 md:flex"
            data-testid="hero-scroll-cue"
          >
            Scroll 滾動
            <span className="relative h-10 w-px overflow-hidden bg-zinc-700">
              <span className="animate-scanline absolute inset-x-0 h-1/2 bg-[#D4AF37]" />
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
