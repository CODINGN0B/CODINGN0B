import { Reveal, SectionLabel } from "@/components/Reveal";
import { IMAGES } from "@/lib/site";

const PRINCIPLES = [
  { title: "Consistency", body: "Reliable production standards." },
  { title: "Accuracy", body: "Manufacturing according to defined specifications." },
  { title: "Reliability", body: "Focused on dependable products and production processes." },
];

export default function Quality() {
  return (
    <section
      id="quality"
      className="relative isolate overflow-hidden border-t border-white/5 py-24 md:py-32"
      data-testid="quality-section"
    >
      <div className="absolute inset-0 -z-10 bg-[#070809]">
        <img
          src={IMAGES.quality}
          alt="Digital caliper measuring a manufactured component"
          loading="lazy"
          className="h-full w-full object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#070809_20%,rgba(7,8,9,0.82))]" />
        <div className="tech-grid absolute inset-0 opacity-40" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <SectionLabel index="05">Quality</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 max-w-2xl font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-white md:text-4xl lg:text-5xl">
            Precision Is Not Optional.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={0.07 * i} className="bg-[#0b0d0f]">
              <div className="relative h-full p-8 md:p-10" data-testid={`quality-principle-${i}`}>
                <span className="absolute right-6 top-6 font-tech text-[10px] tracking-[0.2em] text-white/20">
                  0{i + 1}
                </span>
                <h3 className="font-display text-lg font-semibold uppercase tracking-[0.18em] text-white">
                  {p.title}
                </h3>
                <span className="mt-5 block h-px w-10 bg-[color:var(--steel)]/70" />
                <p className="mt-5 text-sm leading-relaxed text-zinc-500">{p.body}</p>
                <div className="rule-ticks mt-10 h-2 w-full opacity-15" aria-hidden="true" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div
            className="surface-card mt-5 rounded-lg p-7 md:p-9"
            data-testid="quality-certifications-placeholder"
          >
            <p className="label-tech">Certifications &amp; inspection standards</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
              This area is reserved for the company&apos;s certifications, inspection standards and
              measurement equipment, to be published once the supporting documentation is supplied.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {["Certification — to be supplied", "Inspection standard — to be supplied", "Measurement equipment — to be supplied"].map((t) => (
                <div
                  key={t}
                  className="rounded-md border border-dashed border-white/12 px-4 py-5 font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-600"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
