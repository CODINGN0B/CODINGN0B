import { FileCheck2, Gauge, Microscope, Repeat2 } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { useT } from "@/context/SettingsContext";

const ICONS = [Microscope, Repeat2, Gauge];

const CERTS = [
  {
    img: "/photos/iatf-16949-2016-en.jpg",
    pdf: "/iatf-16949-2016-en.pdf",
    alt: "IATF 16949:2016 certificate (English)",
  },
  {
    img: "/photos/iatf-16949-2016-zh.jpg",
    pdf: "/iatf-16949-2016-zh.pdf",
    alt: "IATF 16949:2016 certificate (Chinese)",
  },
];

export default function Standards() {
  const t = useT();

  return (
    <section
      id="standards"
      className="relative border-t border-[color:var(--hairline)] bg-[color:var(--ivory)] py-24 md:py-32"
      data-testid="standards-section"
    >
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <Reveal>
          <SectionLabel index="04">{t.standards.label}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-7 max-w-2xl font-display text-3xl font-light leading-[1.18] tracking-tight text-[color:var(--graphite)] md:text-4xl lg:text-[2.9rem]">
            {t.standards.h2}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <figure
            className="relative overflow-hidden border border-[color:var(--hairline)] bg-[color:var(--pale)]"
            data-testid="inspection-photo"
          >
            <img
              src="/photos/cmm-inspection.jpg"
              alt="TESASTAR-m coordinate measuring machine inspecting a precision machined component"
              loading="lazy"
              className="h-[340px] w-full object-cover object-center sm:h-[440px] md:h-[500px]"
            />
            <figcaption className="absolute left-0 top-0 surface-soft px-4 py-2.5 font-tech text-[9px] uppercase tracking-[0.2em] text-[color:var(--graphite)] backdrop-blur-sm">
              CMM &middot; In-process inspection
            </figcaption>
          </figure>
        </Reveal>
        <div className="mt-14 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <h3 className="flex items-center gap-3 font-display text-xl font-light tracking-tight text-[color:var(--graphite)]">
              <FileCheck2 size={17} className="text-[color:var(--gold-deep)]" /> {t.standards.certsTitle}
            </h3>
            <div className="mt-7 grid grid-cols-2 gap-5">
              {t.standards.certs.map((label, i) => (
                <Reveal key={label} delay={0.06 * i}>
                  <a
                    href={CERTS[i].pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex flex-col overflow-hidden border border-[color:var(--hairline)] bg-[color:var(--surface)] transition-[box-shadow,border-color] duration-500 hover:border-[color:var(--gold)]/50 hover:shadow-card-hover"
                    data-testid={`certificate-card-${i}`}
                  >
                    <div className="aspect-[297/210] w-full overflow-hidden bg-[color:var(--pale)]">
                      <img
                        src={CERTS[i].img}
                        alt={CERTS[i].alt}
                        loading="lazy"
                        className="h-full w-full transform-gpu object-cover object-top transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex items-center gap-2.5 border-t border-[color:var(--hairline)] px-4 py-3">
                      <FileCheck2
                        size={15}
                        className="shrink-0 text-[color:var(--gold-deep)]"
                      />
                      <span className="font-tech text-[10px] uppercase tracking-[0.12em] text-[color:var(--graphite)] sm:text-[11px]">
                        {label}
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-[color:var(--slate)]">
              {t.standards.certNote}
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl font-light tracking-tight text-[color:var(--graphite)]">
              {t.standards.strengthsTitle}
            </h3>
            <div className="mt-7 space-y-5">
              {t.standards.strengths.map((s, i) => {
                const Icon = ICONS[i];
                return (
                  <Reveal key={s.title} delay={0.06 * i}>
                    <article
                      className="group relative border border-[color:var(--hairline)] bg-[color:var(--surface)] p-7 transition-[box-shadow,border-color] duration-500 hover:border-[color:var(--gold)]/50 hover:shadow-card-hover md:p-8"
                      data-testid={`quality-strength-${i}`}
                    >
                      <div className="flex items-start gap-5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[color:var(--hairline)] bg-[color:var(--ivory)] text-[color:var(--gold-deep)] transition-transform duration-500 group-hover:scale-105">
                          <Icon size={18} strokeWidth={1.6} />
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
