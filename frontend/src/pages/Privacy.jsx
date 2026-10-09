import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { COMPANY } from "@/lib/site";
import { useT } from "@/context/SettingsContext";

export default function Privacy() {
  const t = useT();
  return (
    <div className="min-h-screen bg-background" data-testid="privacy-page">
      <div className="mx-auto max-w-[760px] px-5 py-20 sm:px-8 md:py-28">
        <Link
          to="/"
          data-testid="privacy-back-link"
          className="flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--slate)] transition-colors hover:text-[color:var(--gold-deep)]"
        >
          <ArrowLeft size={12} /> {t.privacy.back}
        </Link>

        <h1 className="mt-10 font-display text-3xl font-light tracking-tight text-[color:var(--graphite)] md:text-4xl">
          {t.privacy.title}
        </h1>

        <p className="mt-6 text-sm leading-relaxed text-[color:var(--slate)]">{t.privacy.intro}</p>

        <div className="mt-12 space-y-10">
          {t.privacy.sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-normal tracking-tight text-[color:var(--graphite)]">
                {s.title}
              </h2>
              <span className="mt-4 block h-px w-10 rule-gold" aria-hidden="true" />
              <p className="mt-5 text-sm leading-relaxed text-[color:var(--slate)]">{s.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-[color:var(--hairline)] pt-7 font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)]">
          {COMPANY.name} · {COMPANY.address.join(", ")}
        </p>
      </div>
    </div>
  );
}
