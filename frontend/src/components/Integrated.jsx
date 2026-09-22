import { Reveal, ChapterTag } from "./Reveal";

const STEPS = [
  { no: "01", en: "Design & DFM", tc: "設計評審", body: "Moldflow, tolerance stack-up and feasibility before a single quote is signed." },
  { no: "02", en: "Tooling", tc: "模具製造", body: "In-house toolroom cuts every cavity, core and die set — no outsourced surprises." },
  { no: "03", en: "Molding & Stamping", tc: "成型沖壓", body: "120+ machines and presses running SPC-controlled processes around the clock." },
  { no: "04", en: "Finishing", tc: "表面處理", body: "Painting, plating, laser etching and texture — cosmetics matched to automotive standards." },
  { no: "05", en: "Assembly", tc: "自動組裝", body: "Robotic cells turn components into tested, serialized sub-assemblies." },
  { no: "06", en: "QA & Logistics", tc: "品質物流", body: "CMM verification, PPAP documentation and direct shipment to your line side." },
];

export default function Integrated() {
  return (
    <section id="integrated" className="relative border-y border-white/5 bg-[#0d0d0f]" data-testid="integrated-section">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36 lg:px-24">
        <div className="grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Reveal>
              <ChapterTag no="04" en="Vertically Integrated Power" tc="垂直整合實力" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display mt-10 text-3xl font-semibold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl" data-testid="integrated-headline">
                From resin to <span className="text-[#D4AF37]">road-ready.</span>
                <span className="mt-3 block text-lg font-medium normal-case tracking-normal text-zinc-500">
                  從原料到成品，一廠完成。
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400">
                Every hand-off between suppliers is where tolerances die. So we eliminated the
                hand-offs. Six disciplines, one roof, one accountable team — and a part history
                you can trace to the minute it was made.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative mt-10 hidden lg:block">
                <div className="absolute -inset-8 bg-[radial-gradient(circle_at_40%_30%,rgba(0,243,255,0.08),transparent_60%)]" aria-hidden />
                <div className="clip-frame relative overflow-hidden border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=70"
                    alt="Engineer inspecting production line"
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                    data-testid="integrated-image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
                  <p className="glass absolute bottom-4 left-4 rounded-md px-3 py-1.5 font-tech text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                    Dongguan Plant · 東莞廠房
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.no} delay={0.08 * i}>
                <div
                  className="glass metallic-edge group relative h-full overflow-hidden rounded-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#00F3FF]/25 md:p-7"
                  data-testid={`integration-step-${s.no}`}
                >
                  <span className="font-display text-4xl font-semibold text-white/[0.07] transition-colors duration-500 group-hover:text-[#D4AF37]/25">
                    {s.no}
                  </span>
                  <h3 className="font-display mt-3 text-lg font-semibold uppercase tracking-wide text-zinc-100">
                    {s.en} <span className="ml-1.5 text-xs font-normal normal-case text-[#D4AF37]/70">{s.tc}</span>
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-500">{s.body}</p>
                  <span className="absolute right-5 top-6 font-tech text-[10px] tracking-[0.2em] text-zinc-600 transition-colors duration-300 group-hover:text-[#00F3FF]">
                    {i < STEPS.length - 1 ? "→" : "■"}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
