import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#vision", en: "Vision", tc: "願景" },
  { href: "#history", en: "History", tc: "沿革" },
  { href: "#capabilities", en: "Capabilities", tc: "能力" },
  { href: "#integrated", en: "Integration", tc: "整合" },
  { href: "#precision", en: "Precision", tc: "精密" },
];

export const scrollTo = (hash) => {
  if (window.__lenis) window.__lenis.scrollTo(hash, { offset: -80 });
  else document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar({ onQuote }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-[100] px-4"
      data-testid="site-header"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 glass metallic-edge ${
          scrolled ? "glass-deep" : ""
        }`}
      >
        <a
          href="#top"
          onClick={(e) => go(e, "#top")}
          className="group flex items-baseline gap-2"
          data-testid="nav-brand"
        >
          <span className="font-display text-lg font-semibold tracking-[0.18em] text-zinc-100 transition-colors group-hover:text-[#D4AF37]">
            YUE FUNG
          </span>
          <span className="text-sm font-medium text-[#D4AF37]">裕豐</span>
          <span className="hidden font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500 md:inline">
            Metal &amp; Plastic
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" data-testid="nav-links">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              data-testid={`nav-link-${l.en.toLowerCase()}`}
              className="group relative font-tech text-[11px] uppercase tracking-[0.22em] text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {l.en}
              <span className="ml-1 text-[9px] text-[#D4AF37]/70">{l.tc}</span>
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#00F3FF] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onQuote}
            data-testid="nav-request-quote-btn"
            className="gold-glow hidden rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2 font-tech text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black sm:block"
          >
            Request Quote 索取報價
          </button>
          <button
            className="text-zinc-300 lg:hidden"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="glass-deep metallic-edge mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-2xl p-4 lg:hidden"
            data-testid="mobile-menu"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                data-testid={`mobile-nav-link-${l.en.toLowerCase()}`}
                className="rounded-lg px-3 py-3 font-tech text-xs uppercase tracking-[0.22em] text-zinc-300 hover:bg-white/5"
              >
                {l.en} <span className="ml-2 text-[#D4AF37]/70">{l.tc}</span>
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); onQuote(); }}
              data-testid="mobile-request-quote-btn"
              className="mt-2 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 font-tech text-xs uppercase tracking-[0.22em] text-[#D4AF37]"
            >
              Request Quote 索取報價
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
