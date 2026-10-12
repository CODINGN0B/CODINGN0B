import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Moon, Settings, Sun } from "lucide-react";
import { LOCALES } from "@/lib/i18n";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsMenu() {
  const { theme, setTheme, locale, setLocale, t } = useSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const itemCls = (active) =>
    `flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-xs transition-colors duration-200 ${
      active
        ? "bg-[color:var(--gold-soft)] text-[color:var(--gold-deep)]"
        : "text-[color:var(--graphite-soft)] hover:bg-[color:var(--pale)]"
    }`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.settings.title}
        aria-expanded={open}
        aria-haspopup="true"
        data-testid="settings-btn"
        className="btn-press btn-press-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[color:var(--hairline-strong)] text-[color:var(--graphite)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold-deep)]"
      >
        <Settings size={16} strokeWidth={1.7} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            data-testid="settings-menu"
            className="absolute right-0 top-12 w-60 origin-top-right rounded-sm border border-[color:var(--hairline)] bg-[color:var(--surface)] p-3 shadow-card-hover"
          >
            <p className="label-tech px-3 pb-2">{t.settings.theme}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["light", Sun, t.settings.light],
                ["dark", Moon, t.settings.dark],
              ].map(([value, Icon, label]) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  data-testid={`theme-${value}-btn`}
                  className={`flex items-center justify-center gap-2 rounded-sm border px-3 py-2.5 font-tech text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                    theme === value
                      ? "border-[color:var(--gold)] bg-[color:var(--gold-soft)] text-[color:var(--gold-deep)]"
                      : "border-[color:var(--hairline-strong)] text-[color:var(--slate)] hover:border-[color:var(--gold)]"
                  }`}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            <p className="label-tech mt-5 px-3 pb-2">{t.settings.language}</p>
            <div className="max-h-64 overflow-y-auto">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  data-testid={`locale-${l.code}-btn`}
                  className={itemCls(locale === l.code)}
                  role="menuitemradio"
                  aria-checked={locale === l.code}
                >
                  <span>{l.label}</span>
                  {locale === l.code ? (
                    <Check size={13} />
                  ) : (
                    <span className="font-tech text-[9px] tracking-[0.14em] text-[color:var(--slate)]">{l.short}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
