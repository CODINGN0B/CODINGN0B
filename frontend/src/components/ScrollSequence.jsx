import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useT } from "@/context/SettingsContext";

/**
 * Scroll-driven frame sequence used as the visual transition between Company and Capabilities.
 *
 * - Frames live in /public/sequence/{desktop,mobile}. Replace them with a real Yue Fung
 *   production sequence using the same file names (f00.webp … f35.webp) — no code change needed.
 * - The canvas is driven by scroll position only; the page scroll is never hijacked or locked.
 * - The first frames are loaded eagerly, the rest progressively.
 * - prefers-reduced-motion (or a decode failure) falls back to the static poster image.
 */
const FRAME_COUNT = 36;
const DESKTOP = (i) => `/sequence/desktop/f${String(i).padStart(2, "0")}.webp`;
const MOBILE = (i) => `/sequence/mobile/f${String(i).padStart(2, "0")}.webp`;
const POSTER = "/sequence/poster.webp";

export default function ScrollSequence() {
  const t = useT();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const rafRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    // mobile only ships every second frame — keep the index mapping but reuse the nearest even frame
    const src = (i) => (isMobile ? MOBILE(i - (i % 2)) : DESKTOP(i));

    let cancelled = false;
    const frames = new Array(FRAME_COUNT);
    framesRef.current = frames;

    const load = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve((frames[i] = img));
        img.onerror = () => resolve(null);
        img.src = src(i);
      });

    (async () => {
      // eager: first four frames so the canvas paints immediately
      const first = await Promise.all([load(0), load(1), load(2), load(3)]);
      if (cancelled) return;
      if (!first[0]) {
        setFailed(true);
        return;
      }
      setReady(true);
      draw();
      for (let i = 4; i < FRAME_COUNT; i += 1) {
        if (cancelled) return;
        await load(i); // eslint-disable-line no-await-in-loop
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const draw = () => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    const index = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));

    // nearest already-decoded frame, so progressive loading never flickers
    let img = framesRef.current[index];
    if (!img) {
      for (let d = 1; d < FRAME_COUNT && !img; d += 1) {
        img = framesRef.current[index - d] || framesRef.current[index + d];
      }
    }
    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
    }
    const ctx = canvas.getContext("2d");
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };

  useEffect(() => {
    if (reduce || failed) return;
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, failed, ready]);

  const staticFallback = reduce || failed;

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      data-testid="scroll-sequence"
      className={`relative border-t border-[color:var(--hairline)] bg-[color:var(--porcelain)] ${
        staticFallback ? "" : "h-[220vh]"
      }`}
    >
      <div
        className={`${
          staticFallback ? "relative" : "sticky top-0 flex h-screen items-center"
        } overflow-hidden`}
      >
        <div className="relative w-full">
          {staticFallback ? (
            <img
              src={POSTER}
              alt=""
              loading="lazy"
              className="h-[46vh] w-full object-cover md:h-[70vh]"
              data-testid="sequence-poster"
            />
          ) : (
            <canvas
              ref={canvasRef}
              className="block h-screen w-full"
              data-testid="sequence-canvas"
            />
          )}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,var(--porcelain),transparent)]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,var(--porcelain),transparent)]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto max-w-[1340px] px-5 sm:px-8">
            <div className="inline-block max-w-sm border border-[color:var(--hairline)] bg-[color:var(--surface)]/95 px-4 py-3 shadow-card backdrop-blur-md">
              <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-[color:var(--gold-deep)]">
                {t.sequence.label}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[color:var(--slate)]">
                {t.sequence.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
