import { ArrowUpRight, Cog, Layers, Ruler, Wrench } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { scrollToId } from "@/lib/site";

const CARDS = [
  {
    icon: Cog,
    title: "Metal Products",
    body: "Precision metal components manufactured according to customer requirements.",
  },
  {
    icon: Layers,
    title: "Plastic Products",
    body: "Custom plastic components and production solutions.",
  },
  {
    icon: Wrench,
    title: "Custom Manufacturing",
    body: "Manufacturing based on customer drawings, specifications, materials and requirements.",
  },
  {
    icon: Ruler,
    title: "Quality Assurance",
    body: "Consistent production and inspection processes focused on meeting defined requirements.",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative border-t border-white/5 bg-[#0a0c0e] py-24 md:py-32"
      data-testid="capabilities-section"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <SectionLabel index="02">Capabilities</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-7 max-w-2xl font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-white md:text-4xl lg:text-5xl">
                Engineered for Your Application
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
              Manufacturing scope is defined by the drawings and specifications supplied with each
              enquiry.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={0.06 * i}>
              <button
                type="button"
                onClick={() => scrollToId("#quote")}
                data-testid={`capability-card-${i}`}
                className="group relative flex h-full w-full flex-col items-start overflow-hidden rounded-lg border border-white/[0.07] bg-[#101214] p-7 text-left transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-[color:var(--steel)]/40 hover:bg-[#13171a]"
              >
                <div
                  className="tech-grid-fine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30"
                  aria-hidden="true"
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-[color:var(--steel)] transition-transform duration-500 group-hover:scale-110">
                  <c.icon size={19} strokeWidth={1.6} />
                </span>
                <h3 className="relative mt-7 font-display text-lg font-medium uppercase tracking-[0.06em] text-white">
                  {c.title}
                </h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-zinc-500">{c.body}</p>
                <span className="relative mt-8 flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.2em] text-zinc-400 transition-colors group-hover:text-[color:var(--steel)]">
                  Enquire
                  <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
