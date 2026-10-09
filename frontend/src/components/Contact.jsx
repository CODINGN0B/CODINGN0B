import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import { COMPANY } from "@/lib/site";

export default function Contact({ prefillService, onPrefillConsumed }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-20% 0px -30% 0px" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (inView || prefillService) setOpen(true);
  }, [inView, prefillService]);

  return (
    <section
      id="contact"
      className="relative border-t border-[color:var(--hairline)] py-24 md:py-32"
      data-testid="contact-section"
    >
      <div className="tech-grid-fine pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1340px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionLabel index="05">Contact</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-7 max-w-md font-display text-3xl font-light leading-[1.1] tracking-tight text-[color:var(--graphite)] md:text-4xl lg:text-[2.9rem]">
                Interested? Let&apos;s make it happen.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-md text-sm leading-relaxed text-[color:var(--slate)] md:text-base">
                Send your drawing, specification or requirement. Every inquiry is saved with a
                reference ID, acknowledged by email and reviewed by our team.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-11 border border-[color:var(--hairline)] bg-white p-7 shadow-card" data-testid="contact-details">
                <p className="font-display text-base font-normal tracking-tight text-[color:var(--graphite)]">
                  {COMPANY.name}
                </p>
                <div className="mt-6 flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[color:var(--gold-deep)]" />
                  <address className="text-sm not-italic leading-relaxed text-[color:var(--slate)]">
                    {COMPANY.address.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </address>
                </div>
                <div className="mt-7 border-t border-[color:var(--hairline)] pt-5">
                  <p className="label-tech">Established</p>
                  <p className="mt-1.5 text-sm text-[color:var(--graphite-soft)]">
                    {COMPANY.establishedPlace} — {COMPANY.established}
                  </p>
                </div>
                <p className="mt-6 text-xs leading-relaxed text-[color:var(--slate)]">
                  Telephone and general email will be published here once confirmed by the company.
                </p>
              </div>
            </Reveal>
          </div>

          <div ref={ref}>
            <AnimatePresence initial={false} mode="wait">
              {open ? (
                <motion.div
                  key="form"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <InquiryForm prefillService={prefillService} onPrefillConsumed={onPrefillConsumed} />
                </motion.div>
              ) : (
                <motion.button
                  key="teaser"
                  type="button"
                  onClick={() => setOpen(true)}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  data-testid="open-inquiry-form-btn"
                  className="flex w-full flex-col items-start border border-dashed border-[color:var(--hairline-strong)] bg-white/60 p-10 text-left"
                >
                  <span className="label-tech">Project inquiry</span>
                  <span className="mt-4 font-display text-xl font-light tracking-tight text-[color:var(--graphite)]">
                    Open the inquiry form
                  </span>
                  <span className="mt-6 flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--gold-deep)]">
                    Scroll or select <ArrowDown size={13} />
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
