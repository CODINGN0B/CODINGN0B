import { Reveal } from "./Reveal";
import { Mail, Phone, MapPin } from "lucide-react";
import { scrollTo } from "./Navbar";

export default function Footer({ onQuote }) {
  return (
    <footer id="contact" className="relative border-t border-white/5 bg-[#0d0d0f]" data-testid="site-footer">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <Reveal>
          <div className="glass metallic-edge relative overflow-hidden rounded-3xl p-10 text-center md:p-16" data-testid="footer-cta">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.1),transparent_55%)]" aria-hidden />
            <p className="font-tech text-[10px] uppercase tracking-[0.35em] text-[#00F3FF]">Start a program 展開合作</p>
            <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl font-semibold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Have a drawing? <span className="text-[#D4AF37]">Let's make it real.</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-500">有圖紙嗎？讓我們把它變成現實。</p>
            <button
              onClick={onQuote}
              data-testid="footer-request-quote-btn"
              className="gold-glow mt-8 rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37] px-8 py-4 font-tech text-xs font-bold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:-translate-y-0.5"
            >
              Request a Quote 索取報價
            </button>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-lg font-semibold tracking-[0.18em] text-zinc-100">
              YUE FUNG <span className="text-[#D4AF37]">裕豐</span>
            </p>
            <p className="mt-1 font-tech text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Metal &amp; Plastic Products Co. Ltd. · 金屬塑料製品有限公司
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
              Advanced precision tooling, injection molding and metal stamping for automotive and
              electronics programs worldwide — since 1984.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["ISO 9001", "IATF 16949", "ISO 14001"].map((c) => (
                <span key={c} className="glass rounded-md px-3 py-1.5 font-tech text-[10px] tracking-[0.2em] text-[#D4AF37]" data-testid={`footer-cert-${c.replace(/\s/g, "-").toLowerCase()}`}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-zinc-500">Explore 導覽</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-zinc-400">
              {[["#vision", "Vision & Identity 願景"], ["#history", "History 沿革"], ["#capabilities", "Capabilities 能力"], ["#integrated", "Integration 整合"], ["#precision", "Precision 精密"]].map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={(e) => { e.preventDefault(); scrollTo(href); }} className="transition-colors hover:text-[#D4AF37]" data-testid={`footer-link-${href.slice(1)}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-zinc-500">Contact 聯絡</p>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                <span>sales@yuefung.com.hk</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                <span>+852 2345 6788</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                <span>Kwun Tong, Kowloon, Hong Kong 香港九龍觀塘</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#00F3FF]" />
                <span>Chang'an, Dongguan, Guangdong 廣東東莞長安</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-zinc-600" data-testid="footer-copyright">
            © 2026 Yue Fung Metal &amp; Plastic Products Co. Ltd. 裕豐金屬塑料製品有限公司
          </p>
          <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            Precision, proven. 精密，有據可依。
          </p>
        </div>
      </div>
    </footer>
  );
}
