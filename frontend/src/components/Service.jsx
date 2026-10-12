import { ArrowRight } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { SERVICES } from "@/lib/site";
import { useT } from "@/context/SettingsContext";

export default function Service({ onInquire }) {
  const t = useT();
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
              <SectionLabel index="03">{t.service.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-7 max-w-2xl font-display text-3xl font-light leading-[1.18] tracking-tight text-[color:var(--graphite)] md:text-4xl lg:text-[2.9rem]">
                {t.service.h2}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-[color:var(--slate)]">
              {t.service.note}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.key} delay={0.06 * i}>
              <article
                className="group flex h-full flex-col overflow-hidden border border-[color:var(--hairline)] bg-[color:var(--surface)] transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-[color:var(--gold)]/50 hover:shadow-card-hover"
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
                    className="absolute left-0 top-0 surface-soft px-3 py-2 font-tech text-[9px] uppercase tracking-[0.18em] text-[color:var(--graphite)] backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <h3 className="font-display text-xl font-normal tracking-tight text-[color:var(--graphite)]">
                    {t.service.items[i].name}
                  </h3>
                  <span className="mt-4 block h-px w-10 rule-gold" aria-hidden="true" />
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-[color:var(--slate)]">{t.service.items[i].blurb}</p>
                  <button
                    type="button"
                    onClick={() => onInquire(s.key)}
                    data-testid={`service-inquire-btn-${s.key}`}
                    className="btn-press mt-8 flex items-center gap-2 self-start rounded-sm border border-[color:var(--hairline-strong)] px-4 py-2.5 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--graphite)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-deep)]"
                  >
                    {t.service.cta}
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
