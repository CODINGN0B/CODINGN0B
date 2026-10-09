import { ArrowRight } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { SERVICES } from "@/lib/site";

export default function Service({ onInquire }) {
  return (
    <section
      id="service"
      className="relative border-t border-[color:var(--hairline)] py-24 md:py-32"
      data-testid="service-section"
    >
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="03">Service</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-7 max-w-2xl font-display text-3xl font-light leading-[1.1] tracking-tight text-[color:var(--graphite)] md:text-4xl lg:text-[2.9rem]">
                Four manufacturing services
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-[color:var(--slate)]">
              Choose the service closest to your project and the inquiry form will open with it
              selected. Process detail is confirmed once we have reviewed your drawing.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.key} delay={0.06 * i}>
              <article
                className="group flex h-full flex-col overflow-hidden border border-[color:var(--hairline)] bg-white transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-[color:var(--gold)]/50 hover:shadow-card-hover"
                data-testid={`service-card-${s.key}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[color:var(--pale)]">
                  <img
                    src={s.image}
                    alt={s.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span
                    className="absolute left-0 top-0 bg-white/92 px-3 py-2 font-tech text-[9px] uppercase tracking-[0.18em] text-[color:var(--graphite)] backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <h3 className="font-display text-xl font-normal tracking-tight text-[color:var(--graphite)]">
                    {s.name}
                  </h3>
                  <span className="mt-4 block h-px w-10 rule-gold" aria-hidden="true" />
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-[color:var(--slate)]">{s.blurb}</p>
                  <button
                    type="button"
                    onClick={() => onInquire(s.key)}
                    data-testid={`service-inquire-btn-${s.key}`}
                    className="mt-8 flex items-center gap-2 self-start font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--graphite)] transition-colors duration-300 hover:text-[color:var(--gold-deep)]"
                  >
                    Make an Inquiry
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
