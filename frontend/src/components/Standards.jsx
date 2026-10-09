import { FileCheck2, Gauge, Microscope, Repeat2 } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { PlaceholderTag } from "@/components/PlaceholderTag";

const STRENGTHS = [
  {
    icon: Microscope,
    title: "Inspection",
    body: "Finished parts are checked against the requirements agreed for the order. Measurement equipment and inspection records to be confirmed by the company.",
  },
  {
    icon: Repeat2,
    title: "Repeatability",
    body: "Production is set up so that repeat orders match earlier deliveries. Process controls to be confirmed by the company.",
  },
  {
    icon: Gauge,
    title: "Process Control",
    body: "Production steps are reviewed against the approved specification. Documented procedures to be confirmed by the company.",
  },
];

export default function Standards() {
  return (
    <section
      id="standards"
      className="relative border-t border-[color:var(--hairline)] bg-[color:var(--ivory)] py-24 md:py-32"
      data-testid="standards-section"
    >
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <Reveal>
          <SectionLabel index="04">Standards</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 max-w-2xl font-display text-3xl font-light leading-[1.1] tracking-tight text-[color:var(--graphite)] md:text-4xl lg:text-[2.9rem]">
            Standards we work to
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[color:var(--slate)]">
            Nothing on this page is claimed on the company&apos;s behalf. Certificates and quality
            wording below are reserved areas, to be published once the supporting documents are
            supplied.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <h3 className="flex items-center gap-3 font-display text-xl font-light tracking-tight text-[color:var(--graphite)]">
              <FileCheck2 size={17} className="text-[color:var(--gold-deep)]" /> Certifications
            </h3>
            <div className="mt-7 grid grid-cols-2 gap-5">
              {["Certificate 01", "Certificate 02"].map((c, i) => (
                <Reveal key={c} delay={0.06 * i}>
                  <div
                    className="relative flex aspect-[3/4] flex-col items-center justify-center border border-dashed border-[color:var(--hairline-strong)] bg-white/70 p-5 text-center"
                    data-testid={`certificate-placeholder-${i}`}
                  >
                    <PlaceholderTag absolute={false} label="Awaiting document" className="mb-5" />
                    <p className="font-display text-sm font-light tracking-tight text-[color:var(--graphite)]">
                      {c}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[color:var(--slate)]">
                      Upload the certificate image or PDF here once issued.
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-[color:var(--slate)]">
              No certification — including IATF 16949 or ISO standards — is displayed until the
              company supplies verifiable evidence.
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl font-light tracking-tight text-[color:var(--graphite)]">
              Three quality strengths
            </h3>
            <div className="mt-7 space-y-5">
              {STRENGTHS.map((s, i) => (
                <Reveal key={s.title} delay={0.06 * i}>
                  <article
                    className="group relative border border-[color:var(--hairline)] bg-white p-7 transition-[box-shadow,border-color] duration-500 hover:border-[color:var(--gold)]/50 hover:shadow-card-hover md:p-8"
                    data-testid={`quality-strength-${i}`}
                  >
                    <PlaceholderTag label="For owner review" />
                    <div className="flex items-start gap-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[color:var(--hairline)] bg-[color:var(--ivory)] text-[color:var(--gold-deep)] transition-transform duration-500 group-hover:scale-105">
                        <s.icon size={18} strokeWidth={1.6} />
                      </span>
                      <div>
                        <h4 className="font-display text-lg font-normal tracking-tight text-[color:var(--graphite)]">
                          {s.title}
                        </h4>
                        <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-[color:var(--slate)]">
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
