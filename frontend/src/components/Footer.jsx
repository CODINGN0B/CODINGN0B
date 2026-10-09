import { Link } from "react-router-dom";
import { COMPANY, NAV_LINKS, scrollToId } from "@/lib/site";

export default function Footer() {
  const go = (e, href) => {
    e.preventDefault();
    scrollToId(href);
  };

  return (
    <footer className="border-t border-[color:var(--hairline)] bg-[color:var(--ivory)] py-16" data-testid="site-footer">
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="font-display text-xl font-medium tracking-[0.26em] text-[color:var(--graphite)]">
              {COMPANY.short}
            </p>
            <p className="mt-2 font-tech text-[9px] uppercase tracking-[0.2em] text-[color:var(--slate)]">
              {COMPANY.sub}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[color:var(--graphite-soft)]">
              {COMPANY.slogan}
            </p>
            <address className="mt-7 text-sm not-italic leading-relaxed text-[color:var(--slate)]">
              {COMPANY.address.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--slate)]">
              Established in {COMPANY.establishedPlace} — {COMPANY.established}
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                data-testid={`footer-link-${l.id}`}
                className="font-tech text-[11px] uppercase tracking-[0.16em] text-[color:var(--slate)] transition-colors duration-300 hover:text-[color:var(--gold-deep)]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[color:var(--hairline)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)]">
            © {new Date().getFullYear()} {COMPANY.name} All rights reserved.
          </p>
          <Link
            to="/privacy"
            data-testid="footer-privacy-link"
            className="font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)] transition-colors duration-300 hover:text-[color:var(--gold-deep)]"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
