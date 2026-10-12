import { Link } from "react-router-dom";
import { COMPANY, NAV_LINKS, scrollToId } from "@/lib/site";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const { t, theme } = useSettings();
  const go = (e, href) => {
    e.preventDefault();
    scrollToId(href);
  };

  return (
    <footer className="border-t border-[color:var(--hairline)] bg-[color:var(--ivory)] pb-14 pt-10" data-testid="site-footer">
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        {/* primary categories across the top of the footer */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-[color:var(--hairline)] pb-7"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              data-testid={`footer-link-${l.id}`}
              className="font-tech text-[11px] uppercase tracking-[0.16em] text-[color:var(--slate)] transition-colors duration-300 hover:text-[color:var(--gold-deep)]"
            >
              {t.nav[l.id]}
            </a>
          ))}
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex items-start gap-5">
            <img
              src={theme === "dark" ? "/brand/yuefung-logo-dark.png" : "/brand/yuefung-logo.png"}
              alt={`${COMPANY.name} logo`}
              width="321"
              height="162"
              loading="lazy"
              className="mt-1 h-10 w-auto"
            />
            <div>
              <p className="font-display text-xl font-medium tracking-[0.26em] text-[color:var(--graphite)]">
                {COMPANY.short}
              </p>
              <p className="mt-2 font-tech text-[9px] uppercase tracking-[0.2em] text-[color:var(--slate)]">
                {COMPANY.sub}
              </p>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[color:var(--graphite-soft)]">
                {COMPANY.slogan}
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="label-tech">{t.footer.addressLabel}</p>
              <address className="mt-3 text-sm not-italic leading-relaxed text-[color:var(--slate)]">
                {COMPANY.hkAddress.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </address>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--slate)]">
                {t.footer.established} — {COMPANY.established}
              </p>
            </div>
            <div>
              <p className="label-tech">{t.footer.mfgLabel}</p>
              <address className="mt-3 text-sm not-italic leading-relaxed text-[color:var(--slate)]">
                {COMPANY.address.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </address>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[color:var(--hairline)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)]">
            © {new Date().getFullYear()} {COMPANY.name} {t.footer.rights}
          </p>
          <Link
            to="/privacy"
            data-testid="footer-privacy-link"
            className="font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)] transition-colors duration-300 hover:text-[color:var(--gold-deep)]"
          >
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
