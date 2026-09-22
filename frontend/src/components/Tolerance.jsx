import { Reveal, ChapterTag } from "./Reveal";
import { XCircle, CheckCircle2 } from "lucide-react";

const PAINS = [
  "Three suppliers, three Cpk values, one assembly that won't close",
  "Tolerance stack-up discovered at pilot build — never at quotation",
  "Tooling tweaks bouncing between vendors for weeks",
  "PPAP paperwork that arrives after your launch date",
];

const FIXES = [
  "Single-source stack-up: one DFM team owns every dimension end-to-end",
  "CMM + CT-scan verification against the same digital twin that cut the steel",
  "In-house toolroom adjusts molds in days, not weeks",
  "Full PPAP / IATF documentation shipped with first article",
];

export default function Tolerance({ onQuote }) {
  return (
    <section id="precision" className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36 lg:px-24" data-testid="tolerance-section">
      <Reveal>
        <ChapterTag no="05" en="The Tolerance Nightmare" tc="公差噩夢" />
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display mt-10 max-w-4xl text-3xl font-semibold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl" data-testid="tolerance-headline">
          Solving the <span className="text-[#D4AF37]">"Tolerance Nightmare"</span>
          <span className="mt-3 block text-lg font-medium normal-case tracking-normal text-zinc-500">
            解決令工程師徹夜難眠的公差難題
          </span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal delay={0.1}>
          <div className="glass metallic-edge h-full rounded-2xl border-red-500/10 p-8 md:p-10" data-testid="tolerance-problem">
            <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-red-400/80">The nightmare 噩夢</p>
            <ul className="mt-6 flex flex-col gap-5">
              {PAINS.map((p, i) => (
                <li key={i} className="flex items-start gap-3.5 text-sm leading-relaxed text-zinc-400 md:text-base">
                  <XCircle size={18} className="mt-0.5 shrink-0 text-red-400/70" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="glass metallic-edge h-full rounded-2xl border-[#D4AF37]/20 p-8 shadow-[0_0_48px_rgba(212,175,55,0.06)] md:p-10" data-testid="tolerance-solution">
            <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">The Yue Fung answer 裕豐方案</p>
            <ul className="mt-6 flex flex-col gap-5">
              {FIXES.map((f, i) => (
                <li key={i} className="flex items-start gap-3.5 text-sm leading-relaxed text-zinc-300 md:text-base">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#00F3FF]" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={onQuote}
              data-testid="tolerance-rfq-btn"
              className="gold-glow mt-8 rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-6 py-3 font-tech text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
            >
              Send us your nightmare drawing →
            </button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <div className="relative mt-14">
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_60%)]" aria-hidden />
          <div className="clip-frame relative overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            <img
              src="https://images.pexels.com/photos/28752153/pexels-photo-28752153.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Micron-precision machined metal components"
              className="aspect-[21/9] w-full object-cover"
              loading="lazy"
              data-testid="tolerance-image"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-transparent to-[#0A0A0A]/40" />
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2.5 md:bottom-8 md:left-10">
              {["CMM ±0.8 µm", "CT Scan Validation", "SPC-Controlled Lines", "Digital Twin QA"].map((c) => (
                <span key={c} className="glass rounded-md px-3.5 py-2 font-tech text-[10px] uppercase tracking-[0.2em] text-[#00F3FF]" data-testid={`qa-chip-${c.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
