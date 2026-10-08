import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogIn, LayoutDashboard } from "lucide-react";
import { COMPANY, NAV_LINKS, scrollToId } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-5" data-testid="site-header">
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-xl px-4 py-3 transition-colors duration-500 sm:px-6 ${
          scrolled ? "glass-solid shadow-soft" : "glass"
        }`}
      >
        <a href="#top" onClick={(e) => go(e, "#top")} className="group flex flex-col leading-none" data-testid="nav-brand">
          <span className="font-display text-[17px] font-semibold tracking-[0.22em] text-white transition-colors group-hover:text-[color:var(--steel)]">
            {COMPANY.short}
          </span>
          <span className="mt-1 hidden font-tech text-[9px] uppercase tracking-[0.2em] text-zinc-500 sm:block">
            {COMPANY.sub}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation" data-testid="nav-links">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="group relative font-tech text-[11px] uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[color:var(--steel)] transition-[width] duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link
              to="/dashboard"
              data-testid="nav-dashboard-link"
              className="hidden items-center gap-2 rounded-md border border-white/10 px-3 py-2 font-tech text-[10px] uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-white/25 hover:text-white sm:flex"
            >
              <LayoutDashboard size={13} /> Dashboard
            </Link>
          ) : (
            <button
              onClick={signIn}
              data-testid="nav-signin-btn"
              className="hidden items-center gap-2 rounded-md border border-white/10 px-3 py-2 font-tech text-[10px] uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-white/25 hover:text-white sm:flex"
            >
              <LogIn size={13} /> Sign in
            </button>
          )}
          <a
            href="#quote"
            onClick={(e) => go(e, "#quote")}
            data-testid="nav-request-quote-btn"
            className="group hidden items-center gap-2 rounded-md bg-[color:var(--steel)] px-4 py-2.5 font-tech text-[10px] uppercase tracking-[0.18em] text-[#06080a] transition-colors duration-300 hover:bg-[#6aa4e6] sm:flex"
          >
            Request a Quote
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <button
            className="rounded-md p-2 text-zinc-300 transition-colors hover:text-white lg:hidden"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass-solid mx-auto mt-2 flex max-w-[1400px] flex-col rounded-xl p-3 lg:hidden"
            aria-label="Mobile navigation"
            data-testid="mobile-menu"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                className="border-b border-white/5 px-3 py-4 font-display text-base uppercase tracking-[0.12em] text-zinc-200 transition-colors hover:text-[color:var(--steel)]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#quote"
              onClick={(e) => go(e, "#quote")}
              data-testid="mobile-request-quote-btn"
              className="mt-3 flex items-center justify-center gap-2 rounded-md bg-[color:var(--steel)] px-4 py-3.5 font-tech text-[11px] uppercase tracking-[0.18em] text-[#06080a]"
            >
              Request a Quote <ArrowRight size={14} />
            </a>
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                data-testid="mobile-dashboard-link"
                className="mt-2 flex items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-3 font-tech text-[11px] uppercase tracking-[0.18em] text-zinc-300"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            ) : (
              <button
                onClick={() => { setOpen(false); signIn(); }}
                data-testid="mobile-signin-btn"
                className="mt-2 flex items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-3 font-tech text-[11px] uppercase tracking-[0.18em] text-zinc-300"
              >
                <LogIn size={14} /> Sign in
              </button>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
