import { Reveal, ChapterTag } from "./Reveal";

const MILESTONES = [
  { year: "1984", en: "Founded in Hong Kong", tc: "香港創立", body: "A two-man tool & die workshop with one milling machine and an obsession with fit and finish." },
  { year: "1992", en: "First Export Tooling Programs", tc: "模具出口", body: "Precision molds shipped to Japan and Germany — our tolerances earn their first international audience." },
  { year: "2001", en: "Dongguan Plant Opens", tc: "東莞廠房", body: "Injection molding at scale: 40 machines, in-house toolroom, and our first 24/7 production shifts." },
  { year: "2010", en: "Automotive Tier-1 Certification", tc: "車規認證", body: "IATF 16949 certified. First safety-relevant stamping and molding programs for global OEM supply chains." },
  { year: "2018", en: "2K Molding & Automated Assembly", tc: "雙色成型", body: "Rotary-platen 2K cells and vision-guided robotic assembly bring multi-material parts in-house." },
  { year: "2026", en: "Lights-Out Manufacturing", tc: "無人工廠", body: "Fully automated cells with CMM digital-twin QA — every part measured, every measurement traceable." },
];

export default function History() {
  return (
    <section id="history" className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-36 lg:px-24" data-testid="history-section">
      <Reveal>
        <ChapterTag no="02" en="History" tc="沿革" />
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display mt-10 max-w-3xl text-3xl font-semibold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl" data-testid="history-headline">
          40 Years of <span className="text-[#D4AF37]">Manufacturing Pedigree</span>
          <span className="mt-2 block text-lg font-medium normal-case tracking-normal text-zinc-500">四十年製造傳承</span>
        </h2>
      </Reveal>

      <div className="relative mt-16">
        <span className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-[#D4AF37]/60 via-white/10 to-transparent md:left-1/2" aria-hidden />
        <div className="flex flex-col gap-12">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.year} delay={0.05 * i}>
              <div className={`relative flex flex-col gap-3 pl-10 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"}`} data-testid={`history-milestone-${m.year}`}>
                <span className={`absolute top-1 h-[15px] w-[15px] rounded-full border-2 border-[#D4AF37] bg-[#0A0A0A] shadow-[0_0_14px_rgba(212,175,55,0.5)] ${i % 2 === 0 ? "left-0 md:-right-[7.5px] md:left-auto" : "left-0 md:-left-[7.5px]"}`} />
                <p className="font-tech text-2xl font-medium text-[#D4AF37] md:text-3xl">{m.year}</p>
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-zinc-100 md:text-xl">
                  {m.en} <span className="ml-2 text-sm font-normal normal-case text-[#D4AF37]/70">{m.tc}</span>
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-zinc-500 md:inline-block">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
