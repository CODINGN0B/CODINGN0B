import { IMAGES, COMPANY } from "@/lib/site";
import { Reveal, SectionLabel } from "@/components/Reveal";

export default function About() {
  return (
    <section id="about" className="relative border-t border-white/5 py-24 md:py-32" data-testid="about-section">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <Reveal>
            <SectionLabel index="01">Company</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-7 max-w-xl font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-white md:text-4xl lg:text-5xl">
              Engineering Experience Since 1984
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-xl space-y-5 text-sm leading-relaxed text-zinc-400 md:text-base">
            <p>
              {COMPANY.name} was established in Hong Kong in 1984. The company manufactures metal and
              plastic products to customer drawings, specifications and requirements.
            </p>
            <p>
              Manufacturing activities are carried out at our facility in Xincheng Industrial District,
              HengLi Town, Dongguan City, Guangdong, China — supporting customers who require
              consistent production and repeatable results.
            </p>
            <p className="text-zinc-500">
              Decades of continuous manufacturing experience inform how we review drawings, plan
              production and verify finished parts.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-14">
            <div className="relative surface-card rounded-lg p-7 md:p-9" data-testid="heritage-timeline">
              <div className="tech-grid-fine pointer-events-none absolute inset-0 rounded-lg opacity-[0.35]" aria-hidden="true" />
              <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-10">
                <div>
                  <p className="label-tech">Established</p>
                  <p className="mt-2 font-display text-6xl font-semibold leading-none tracking-tight text-white md:text-7xl">
                    1984
                  </p>
                  <p className="mt-3 font-tech text-[11px] uppercase tracking-[0.2em] text-[color:var(--steel)]">
                    Hong Kong
                  </p>
                </div>
                <div className="hidden flex-1 items-center gap-3 pb-3 sm:flex">
                  <span className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/25 to-[color:var(--steel)]" />
                  <span className="font-tech text-[10px] tracking-[0.2em] text-zinc-500">→</span>
                </div>
                <div className="sm:text-right">
                  <p className="label-tech">Present</p>
                  <p className="mt-2 font-display text-2xl font-semibold uppercase leading-tight tracking-tight text-white md:text-3xl">
                    Dongguan
                  </p>
                  <p className="mt-3 font-tech text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                    Guangdong, China
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative h-full min-h-[340px] overflow-hidden rounded-lg border border-white/10">
            <img
              src={IMAGES.about}
              alt="Production floor with manufacturing equipment in operation"
              className="h-full w-full object-cover opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,9,10,0.85),rgba(8,9,10,0.1))]" />
            <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-black/40 px-6 py-4 backdrop-blur-sm">
              <p className="label-tech">Manufacturing facility</p>
              <p className="mt-1.5 text-xs text-zinc-300">
                Xincheng Industrial District, HengLi Town, Dongguan City
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
