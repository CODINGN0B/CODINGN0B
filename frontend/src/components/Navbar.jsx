import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { COMPANY, NAV_LINKS, scrollToId } from "@/lib/site";

export default function Navbar() {
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
        className={`mx-auto flex max-w-[1340px] items-center justify-between rounded-sm px-4 py-3 transition-[background-color,box-shadow,border-color] duration-500 sm:px-6 ${
          scrolled ? "glass-nav-solid" : "glass-nav"
        }`}
      >
        <a
          href="#top"
          onClick={(e) => go(e, "#top")}
          className="group flex flex-col leading-none"
          data-testid="nav-brand"
          aria-label={`${COMPANY.name} — back to top`}
        >
          <span className="font-display text-[17px] font-medium tracking-[0.26em] text-[color:var(--graphite)] transition-colors duration-300 group-hover:text-[color:var(--gold-deep)]">
            {COMPANY.short}
          </span>
          <span className="mt-1 hidden font-tech text-[8px] uppercase tracking-[0.2em] text-[color:var(--slate)] sm:block">
            {COMPANY.sub}
          </span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation" data-testid="nav-links">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              aria-current={active === l.id ? "true" : undefined}
              data-active={active === l.id ? "true" : "false"}
              data-testid={`nav-link-${l.id}`}
              className={`relative py-1 font-tech text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                active === l.id
                  ? "text-[color:var(--graphite)]"
                  : "text-[color:var(--slate)] hover:text-[color:var(--graphite)]"
              }`}
            >
              {l.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-[color:var(--gold)] transition-[width] duration-300 ${
                  active === l.id ? "w-full" : "w-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={(e) => go(e, "#contact")}
            data-testid="nav-inquiry-btn"
            className="group hidden items-center gap-2.5 rounded-sm bg-[color:var(--graphite)] px-5 py-3 font-tech text-[10px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[color:var(--gold-deep)] sm:flex"
          >
            Make an Inquiry
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <button
            className="rounded-sm p-2 text-[color:var(--graphite)] transition-colors hover:text-[color:var(--gold-deep)] lg:hidden"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
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
            className="glass-nav-solid mx-auto mt-2 flex max-w-[1340px] flex-col rounded-sm p-3 lg:hidden"
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
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              data-testid="mobile-inquiry-btn"
              className="mt-3 flex items-center justify-center gap-2 rounded-sm bg-[color:var(--graphite)] px-4 py-3.5 font-tech text-[11px] uppercase tracking-[0.18em] text-white"
            >
              Make an Inquiry <ArrowRight size={14} />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
