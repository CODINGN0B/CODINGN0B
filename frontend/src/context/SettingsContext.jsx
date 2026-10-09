import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS, HTML_LANG } from "@/lib/i18n";

const SettingsContext = createContext(null);
const THEME_KEY = "yf-theme";
const LOCALE_KEY = "yf-locale";

const initialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initialLocale = () => {
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored && TRANSLATIONS[stored]) return stored;
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return /tw|hk|hant/.test(nav) ? "zh-TW" : "zh";
  if (nav.startsWith("cs")) return "cs";
  if (nav.startsWith("es")) return "es";
  return "en";
};

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(initialTheme);
  const [locale, setLocale] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale] || "en";
    localStorage.setItem(LOCALE_KEY, locale);
  }, [locale]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, locale, setLocale, t: TRANSLATIONS[locale] || TRANSLATIONS.en }),
    [theme, toggleTheme, locale]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
export const useT = () => useContext(SettingsContext).t;
