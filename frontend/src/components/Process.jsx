import { Reveal, SectionLabel } from "@/components/Reveal";

const STAGES = [
  { no: "01", title: "Inquiry", body: "Submit drawings, specifications, quantities and project requirements." },
  { no: "02", title: "Engineering Review", body: "Requirements are reviewed to determine an appropriate manufacturing approach." },
  { no: "03", title: "Production", body: "Products are manufactured according to approved specifications." },
  { no: "04", title: "Quality Control", body: "Products are inspected according to the applicable requirements." },
  { no: "05", title: "Delivery", body: "Completed products are prepared for delivery." },
];

export default function Process() {
  return (
    <section id="process" className="relative border-t border-white/5 py-24 md:py-32" data-testid="process-section">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <SectionLabel index="03">Process</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 max-w-2xl font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-white md:text-4xl lg:text-5xl">
            From Specification to Production
          </h2>
        </Reveal>

        <div className="relative mt-16 md:mt-20">
          {/* connector line: vertical on mobile, horizontal on desktop */}
          <span
            className="absolute left-[15px] top-2 h-[calc(100%-2rem)] w-px bg-[linear-gradient(to_bottom,rgba(79,143,217,0.6),rgba(255,255,255,0.16)_55%,rgba(255,255,255,0.05))] md:left-0 md:top-[15px] md:h-px md:w-full md:bg-[linear-gradient(to_right,rgba(79,143,217,0.6),rgba(255,255,255,0.16)_55%,rgba(255,255,255,0.05))]"
            aria-hidden="true"
          />
          <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
            {STAGES.map((s, i) => (
              <Reveal as="li" key={s.no} delay={0.08 * i} className="relative pl-12 md:pl-0">
                <span
                  className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--steel)]/60 bg-[#08090a] font-tech text-[10px] text-[color:var(--steel)] md:relative"
                  data-testid={`process-node-${s.no}`}
                >
                  {s.no}
                </span>
                <h3 className="mt-0 font-display text-base font-medium uppercase tracking-[0.08em] text-white md:mt-7">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500 md:max-w-none">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
