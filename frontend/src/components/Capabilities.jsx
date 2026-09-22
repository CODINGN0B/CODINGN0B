import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, ChapterTag } from "./Reveal";

const TABS = [
  {
    id: "mold",
    en: "Precision Mold Making",
    tc: "精密模具製造",
    headline: "Steel that remembers every micron.",
    body: "From moldflow simulation to final spotting, our in-house toolroom builds Class-101 production molds with conformal cooling and interchangeable inserts — engineered for million-shot life.",
    specs: ["±0.001 mm", "S136 / NAK80 / H13", "1M+ shot life", "Conformal cooling", "Moldflow analysis"],
    image: "https://images.pexels.com/photos/28752153/pexels-photo-28752153.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Precision machined mold components",
  },
  {
    id: "stamping",
    en: "High-Tolerance Metal Stamping",
    tc: "高精密金屬沖壓",
    headline: "600 strokes per minute. Zero drift.",
    body: "Progressive and transfer dies running SPCC, stainless, aluminum and copper alloys with in-die tapping, in-die assembly and 100% vision inspection at full press speed.",
    specs: ["±0.005 mm", "Up to 600 SPM", "SPCC / SUS / Al / Cu", "In-die tapping", "Vision inspection"],
    image: "https://images.pexels.com/photos/159275/macro-focus-cogwheel-gear-159275.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Stamped metal gears close-up",
  },
  {
    id: "overmolding",
    en: "2K / Overmolding",
    tc: "雙色注塑與包膠",
    headline: "Two materials. One seamless part.",
    body: "Rotary-platen 2K and insert molding cells bond rigid PC to soft-touch TPU, seal electronics to IP67, and wrap metal inserts in structural polymer — in a single cycle.",
    specs: ["PC + TPU bonds", "Rotary platen", "Insert molding", "IP67 sealing", "Single-cycle 2K"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70",
    alt: "Electronics enclosure overmolding",
  },
  {
    id: "assembly",
    en: "Automated Assembly",
    tc: "自動化組裝",
    headline: "Robots build it. Data proves it.",
    body: "Vision-guided robotic cells assemble, weld, fasten and functionally test complete sub-assemblies — with serialized traceability from raw coil to finished module.",
    specs: ["Vision-guided robots", "100% EOL test", "Full traceability", "Ultrasonic welding", "24/7 cells"],
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=70",
    alt: "Robotic arm on automated assembly line",
  },
];

export default function Capabilities() {
  const [active, setActive] = useState(TABS[0]);

  return (
    <section id="capabilities" className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36 lg:px-24" data-testid="capabilities-section">
      <Reveal>
        <ChapterTag no="03" en="Core Capabilities" tc="核心能力" />
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display mt-10 text-3xl font-semibold uppercase tracking-tight sm:text-4xl lg:text-5xl" data-testid="capabilities-headline">
          Four disciplines. <span className="text-[#D4AF37]">One standard.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="glass metallic-edge mt-12 flex flex-wrap rounded-xl p-1.5" data-testid="capabilities-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t)}
              data-testid={`capability-tab-${t.id}`}
              className={`relative flex-1 whitespace-nowrap rounded-lg px-4 py-3.5 font-tech text-[10px] uppercase tracking-[0.15em] transition-all duration-300 md:text-[11px] ${
                active.id === t.id ? "text-[#00F3FF]" : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {t.en}
              <span className="ml-1.5 hidden opacity-70 sm:inline">{t.tc}</span>
              {active.id === t.id && (
                <motion.span
                  layoutId="cap-underline"
                  className="absolute inset-x-3 bottom-0 h-[2px] bg-gradient-to-r from-[#00F3FF] to-[#D4AF37] shadow-[0_0_12px_rgba(0,243,255,0.6)]"
                />
              )}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-center gap-10 lg:grid-cols-2"
            data-testid={`capability-panel-${active.id}`}
          >
            <div>
              <h3 className="font-display text-2xl font-semibold uppercase tracking-wide text-zinc-100 md:text-4xl">
                {active.headline}
              </h3>
              <p className="mt-3 text-sm text-[#D4AF37]/80">{active.en} · {active.tc}</p>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400">{active.body}</p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {active.specs.map((s) => (
                  <span
                    key={s}
                    className="glass rounded-md px-3.5 py-2 font-tech text-[10px] uppercase tracking-[0.18em] text-zinc-300 transition-colors duration-300 hover:border-[#00F3FF]/40 hover:text-[#00F3FF]"
                    data-testid={`spec-chip-${s.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.14),transparent_65%)]" aria-hidden />
              <div className="clip-frame relative overflow-hidden border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
                <img src={active.image} alt={active.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" data-testid="capability-image" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent" />
                <p className="glass absolute bottom-4 left-4 rounded-md px-3 py-1.5 font-tech text-[10px] uppercase tracking-[0.25em] text-[#00F3FF]">
                  {active.en}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
