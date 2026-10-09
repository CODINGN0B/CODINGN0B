import { ShieldCheck, Ruler, Handshake } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { PlaceholderTag } from "@/components/PlaceholderTag";
import { COMPANY, IMAGES } from "@/lib/site";

const VALUES = [
  {
    icon: Ruler,
    title: "Precision",
    body: "Parts are made to the drawing. Dimensions and finishing notes are reviewed before production starts.",
  },
  {
    icon: ShieldCheck,
    title: "Consistency",
    body: "Repeatable production and checking, so a second order matches the first.",
  },
  {
    icon: Handshake,
    title: "Reliability",
    body: "Clear communication on scope, progress and delivery throughout the project.",
  },
];

export default function Company() {
  return (
    <section id="company" className="relative border-t border-[color:var(--hairline)] py-24 md:py-32" data-testid="company-section">
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionLabel index="01">Company</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-7 max-w-xl font-display text-3xl font-light leading-[1.1] tracking-tight text-[color:var(--graphite)] md:text-4xl lg:text-[2.9rem]">
                Manufacturing experience since 1984
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 max-w-xl space-y-5 text-sm leading-relaxed text-[color:var(--slate)] md:text-base">
              <p>
                {COMPANY.name} was established in Hong Kong in 1984. The company manufactures metal
                and plastic components to the drawings, specifications and requirements supplied by
                its customers.
              </p>
              <p>
                Manufacturing is carried out at our facility in Xincheng Industrial District, HengLi
                Town, Dongguan City, GuangDong, China. Each enquiry is reviewed against the documents
                you provide, so scope, materials and finishing are agreed before anything is made.
              </p>
            </Reveal>

            <Reveal delay={0.14} className="mt-12">
              <div className="relative border border-[color:var(--hairline)] bg-white px-7 py-8 shadow-card" data-testid="history-highlight">
                <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="label-tech">Established</p>
                    <p className="mt-2 font-display text-5xl font-light leading-none tracking-tight text-[color:var(--graphite)] md:text-6xl">
                      1984
                    </p>
                    <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold-deep)]">
                      Hong Kong
                    </p>
                  </div>
                  <div className="hidden flex-1 items-center px-6 pb-3 sm:flex" aria-hidden="true">
                    <span className="h-px w-full rule-gold" />
                  </div>
                  <div className="sm:text-right">
                    <p className="label-tech">Today</p>
                    <p className="mt-2 font-display text-xl font-light tracking-tight text-[color:var(--graphite)] md:text-2xl">
                      Dongguan, GuangDong
                    </p>
                    <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.2em] text-[color:var(--slate)]">
                      Manufacturing facility
                    </p>
                  </div>
                </div>
                <div className="rule-ticks mt-8 h-2 w-full opacity-40" aria-hidden="true" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <figure className="relative h-full min-h-[320px] overflow-hidden border border-[color:var(--hairline)] bg-[color:var(--pale)]" data-testid="company-photo">
              <PlaceholderTag label="Placeholder photo — replace with factory image" />
              <img
                src={IMAGES.company}
                alt={IMAGES.companyAlt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 border-t border-[color:var(--hairline)] bg-white/90 px-6 py-4 backdrop-blur-sm">
                <p className="label-tech">Production environment</p>
                <p className="mt-1.5 text-xs text-[color:var(--slate)]">
                  Reserved for authentic factory, team or production photography.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-20 md:mt-28">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="font-display text-2xl font-light tracking-tight text-[color:var(--graphite)]">
                Core values
              </h3>
              <p className="max-w-sm text-sm text-[color:var(--slate)]">
                Drafted for review — confirm or replace this wording before launch.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={0.07 * i}>
                <article
                  className="group relative h-full border border-[color:var(--hairline)] bg-white p-8 transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-[color:var(--gold)]/50 hover:shadow-card-hover"
                  data-testid={`core-value-card-${i}`}
                >
                  <PlaceholderTag label="For owner review" />
                  <span className="flex h-11 w-11 items-center justify-center border border-[color:var(--hairline)] bg-[color:var(--ivory)] text-[color:var(--gold-deep)] transition-transform duration-500 group-hover:scale-105">
                    <v.icon size={18} strokeWidth={1.6} />
                  </span>
                  <h4 className="mt-7 font-display text-lg font-normal tracking-tight text-[color:var(--graphite)]">
                    {v.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--slate)]">{v.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
