import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { COMPANY, NAV_LINKS, scrollToId } from "@/lib/site";
import { useSettings } from "@/context/SettingsContext";
import SettingsMenu from "@/components/SettingsMenu";

export default function Navbar() {
  const { t, theme } = useSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-6 sm:pt-5" data-testid="site-header">
      <div
        className={`mx-auto flex h-[60px] max-w-[1340px] items-center justify-between gap-4 rounded-xl px-2.5 sm:px-4 ${
          scrolled ? "glass-nav-solid" : "glass-nav"
        }`}
      >
        <a
          href="#top"
          onClick={(e) => go(e, "#top")}
          className="group flex shrink-0 items-center gap-3"
          data-testid="nav-brand"
          aria-label={`${COMPANY.name} — top`}
        >
          <img
            src={theme === "dark" ? "/brand/yuefung-logo-dark.png" : "/brand/yuefung-logo.png"}
            alt={`${COMPANY.name} logo`}
            width="321"
            height="162"
            className="h-7 w-auto sm:h-8"
            data-testid="nav-logo"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-medium tracking-[0.24em] text-[color:var(--graphite)] transition-colors duration-300 group-hover:text-[color:var(--gold-deep)] sm:text-[17px]">
              {COMPANY.short}
            </span>
            <span className="mt-1 hidden font-tech text-[8px] uppercase tracking-[0.2em] text-[color:var(--slate)] sm:block">
              {COMPANY.sub}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation" data-testid="nav-links">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              aria-current={active === l.id ? "true" : undefined}
              data-active={active === l.id ? "true" : "false"}
              data-testid={`nav-link-${l.id}`}
              className={`relative py-1 font-tech text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active === l.id
                  ? "text-[color:var(--graphite)]"
                  : "text-[color:var(--slate)] hover:text-[color:var(--graphite)]"
              }`}
            >
              {t.nav[l.id]}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-[color:var(--gold)] transition-[width] duration-300 ${
                  active === l.id ? "w-full" : "w-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <SettingsMenu />
          <a
            href="#contact"
            onClick={(e) => go(e, "#contact")}
            data-testid="nav-inquiry-btn"
            className="btn-press btn-press-sm group hidden h-10 items-center gap-2.5 rounded-sm bg-[color:var(--graphite)] px-5 font-tech text-[10px] uppercase tracking-[0.18em] leading-none text-[color:var(--porcelain)] hover:bg-[color:var(--gold-deep)] md:flex"
          >
            {t.nav.cta}
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <button
            className="btn-press btn-press-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[color:var(--hairline-strong)] text-[color:var(--graphite)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-deep)] lg:hidden"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-btn"
            aria-label={open ? "Close menu" : t.nav.menu}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-nav-solid mx-auto mt-2 flex max-w-[1340px] flex-col rounded-xl p-3 lg:hidden"
            aria-label="Mobile navigation"
            data-testid="mobile-menu"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                data-testid={`mobile-nav-link-${l.id}`}
                className={`border-b border-[color:var(--hairline)] px-3 py-4 font-display text-base tracking-[0.1em] transition-colors ${
                  active === l.id ? "text-[color:var(--gold-deep)]" : "text-[color:var(--graphite)]"
                }`}
              >
                {t.nav[l.id]}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              data-testid="mobile-inquiry-btn"
              className="btn-press mt-3 flex items-center justify-center gap-2 rounded-sm bg-[color:var(--graphite)] px-4 py-4 font-tech text-[11px] uppercase tracking-[0.18em] text-[color:var(--porcelain)]"
            >
              {t.nav.cta} <ArrowRight size={14} />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
