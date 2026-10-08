import { COMPANY, NAV_LINKS, scrollToId } from "@/lib/site";

const LINKS = [...NAV_LINKS.slice(0, 4), { href: "#quote", label: "Request a Quote" }, NAV_LINKS[4]];

export default function Footer() {
  const go = (e, href) => {
    e.preventDefault();
    scrollToId(href);
  };

  return (
    <footer className="relative border-t border-white/8 bg-[#06070a] py-16" data-testid="site-footer">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-display text-xl font-semibold tracking-[0.22em] text-white">{COMPANY.short}</p>
            <p className="mt-2 font-tech text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {COMPANY.sub}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-400">{COMPANY.slogan}</p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-6 gap-y-3 sm:max-w-sm">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-[color:var(--steel)]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-600">
            © 2026 {COMPANY.name} All rights reserved.
          </p>
          <p className="font-tech text-[10px] uppercase tracking-[0.16em] text-zinc-600">
            Established in Hong Kong — {COMPANY.established}
          </p>
        </div>
      </div>
    </footer>
  );
}
