import { ArrowRight, MapPin } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import { COMPANY, scrollToId } from "@/lib/site";

export default function Contact() {
  return (
    <section id="contact" className="relative border-t border-white/5 py-24 md:py-32" data-testid="contact-section">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <SectionLabel index="07">Contact</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-7 max-w-xl font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight text-white md:text-4xl lg:text-5xl">
              Let&apos;s Build Something Precise.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-sm leading-relaxed text-zinc-400 md:text-base">
              Have a drawing, specification, or manufacturing requirement? Send us your project details
              and request a quotation.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <button
              onClick={() => scrollToId("#quote")}
              data-testid="contact-request-quote-btn"
              className="group mt-10 flex items-center gap-2.5 rounded-md bg-[color:var(--steel)] px-7 py-4 font-tech text-[11px] uppercase tracking-[0.2em] text-[#06080a] transition-colors duration-300 hover:bg-[#6aa4e6]"
            >
              Request a Quote
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="surface-card relative h-full rounded-lg p-8 md:p-10" data-testid="contact-details">
            <div className="tech-grid-fine pointer-events-none absolute inset-0 rounded-lg opacity-25" aria-hidden="true" />
            <div className="relative">
              <p className="font-display text-base font-medium uppercase tracking-[0.1em] text-white">
                {COMPANY.name}
              </p>
              <div className="mt-8 flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[color:var(--steel)]" />
                <address className="text-sm not-italic leading-relaxed text-zinc-400">
                  {COMPANY.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
              <div className="mt-10 border-t border-white/8 pt-6">
                <p className="label-tech">Established</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Established in Hong Kong — {COMPANY.established}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
