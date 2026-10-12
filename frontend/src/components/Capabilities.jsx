import { Reveal, SectionLabel } from "@/components/Reveal";
import { IMAGES } from "@/lib/site";
import { useT } from "@/context/SettingsContext";

export default function Capabilities() {
  const t = useT();
  return (
    <section
      id="capabilities"
      className="relative border-t border-[color:var(--hairline)] bg-[color:var(--ivory)] py-24 md:py-32"
      data-testid="capabilities-section"
    >
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="02">{t.capabilities.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-7 max-w-2xl font-display text-3xl font-medium leading-[1.18] tracking-tight text-[color:var(--gold-deep)] md:text-4xl lg:text-[2.9rem]">
                {t.capabilities.h2}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-[color:var(--slate)]">
              {t.capabilities.note}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {IMAGES.capabilities.map((c, i) => (
            <Reveal key={c.image} delay={0.05 * i} className={c.span}>
              <article
                className={`group relative h-full overflow-hidden border border-[color:var(--hairline)] bg-[color:var(--pale)] ${c.height}`}
                data-testid={`capability-card-${i}`}
              >
                <img
                  src={c.image}
                  alt={c.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full transform-gpu object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.07]"
                />
                <div className="image-ink absolute inset-0" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="block h-px w-10 rule-gold" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-xl font-light tracking-tight text-white">
                    {t.capabilities.cards[i].title}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-white/75">
                    {t.capabilities.cards[i].body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
