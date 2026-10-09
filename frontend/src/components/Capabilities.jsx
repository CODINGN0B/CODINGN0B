import { Reveal, SectionLabel } from "@/components/Reveal";
import { PlaceholderTag } from "@/components/PlaceholderTag";
import { IMAGES } from "@/lib/site";

export default function Capabilities() {
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
              <SectionLabel index="02">Capabilities</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-7 max-w-2xl font-display text-3xl font-light leading-[1.1] tracking-tight text-[color:var(--graphite)] md:text-4xl lg:text-[2.9rem]">
                Can we handle your project?
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-[color:var(--slate)]">
              Send the drawing and we will tell you plainly. Tolerances, materials, capacity and lead
              times are confirmed per project — we do not publish figures we cannot stand behind.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {IMAGES.capabilities.map((c, i) => (
            <Reveal key={c.title} delay={0.05 * i} className={c.span}>
              <article
                className={`group relative h-full overflow-hidden border border-[color:var(--hairline)] bg-white ${c.height}`}
                data-testid={`capability-card-${i}`}
              >
                {c.placeholder && <PlaceholderTag label="Figures pending confirmation" />}
                <img
                  src={c.image}
                  alt={c.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,15,16,0.86),rgba(14,15,16,0.25)_60%,rgba(14,15,16,0.08))]"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="block h-px w-10 rule-gold" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-xl font-light tracking-tight text-white">
                    {c.title}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-white/75">{c.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
