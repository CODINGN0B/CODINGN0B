import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Reveal } from "./Reveal";

function Counter({ to, suffix = "", prefix = "", duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

const tile = "glass metallic-edge group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 md:p-8";
const glow = "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.12),transparent_60%)]";

export default function StatsBento() {
  return (
    <section id="stats" className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28 lg:px-24" data-testid="stats-section">
      <Reveal>
        <p className="font-tech text-[10px] uppercase tracking-[0.35em] text-[#00F3FF] md:text-xs">
          Factory Capacity · 工廠實力
        </p>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <Reveal className={`${tile} col-span-2 row-span-2 flex flex-col justify-between`} data-testid="stat-years">
          <div className={glow} />
          <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Manufacturing Pedigree <span className="text-[#D4AF37]/80">製造傳承</span>
          </p>
          <div>
            <p className="font-display text-7xl font-semibold text-[#D4AF37] md:text-9xl">
              <Counter to={40} suffix="+" />
            </p>
            <p className="mt-2 font-tech text-xs uppercase tracking-[0.25em] text-zinc-400">Years · 年</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
              Four decades of manufacturing pedigree, from a Hong Kong workshop to a Tier-1 automotive partner.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className={tile} data-testid="stat-tolerance">
          <div className={glow} />
          <p className="font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">Tolerance 公差</p>
          <p className="font-tech mt-4 text-3xl font-medium text-[#00F3FF] md:text-4xl">±0.001</p>
          <p className="mt-1 font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">mm · micron-level</p>
        </Reveal>

        <Reveal delay={0.15} className={tile} data-testid="stat-parts">
          <div className={glow} />
          <p className="font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">Output 產能</p>
          <p className="font-tech mt-4 text-3xl font-medium text-zinc-100 md:text-4xl">
            <Counter to={10} suffix="M+" />
          </p>
          <p className="mt-1 font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">parts / year 件/年</p>
        </Reveal>

        <Reveal delay={0.2} className={tile} data-testid="stat-machines">
          <div className={glow} />
          <p className="font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">Equipment 設備</p>
          <p className="font-tech mt-4 text-3xl font-medium text-zinc-100 md:text-4xl">
            <Counter to={120} suffix="+" />
          </p>
          <p className="mt-1 font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">presses &amp; molding lines</p>
        </Reveal>

        <Reveal delay={0.25} className={tile} data-testid="stat-certs">
          <div className={glow} />
          <p className="font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">Certified 認證</p>
          <p className="font-tech mt-4 text-lg font-medium leading-snug text-[#D4AF37]">
            ISO 9001<br />IATF 16949<br />ISO 14001
          </p>
        </Reveal>

        <Reveal delay={0.3} className={`${tile} col-span-2`} data-testid="stat-automation">
          <div className={glow} />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">Automation 自動化</p>
              <p className="font-tech mt-3 text-2xl font-medium text-zinc-100 md:text-3xl">24 / 7</p>
              <p className="mt-1 text-xs text-zinc-500">Lights-out production cells 無人化生產</p>
            </div>
            <span className="animate-pulse-dot h-2.5 w-2.5 rounded-full bg-[#00F3FF] shadow-[0_0_12px_#00F3FF]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
