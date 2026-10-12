import { useEffect, useState } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Company from "@/components/Company";
import ScrollSequence from "@/components/ScrollSequence";
import Capabilities from "@/components/Capabilities";
import Service from "@/components/Service";
import Standards from "@/components/Standards";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { scrollToId } from "@/lib/site";

export default function Home() {
  const [prefillService, setPrefillService] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      // long, natural ease-out — no abrupt stops, no scroll hijacking
      easing: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      lerp: 0.085,
    });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  const handleInquire = (serviceKey) => {
    setPrefillService(serviceKey);
    scrollToId("#contact");
  };

  return (
    <div className="min-h-screen bg-background" data-testid="app-root">
      <Navbar />
      <main>
        <Hero />
        <Company />
        <ScrollSequence />
        <Capabilities />
        <Service onInquire={handleInquire} />
        <Standards />
        <Contact prefillService={prefillService} onPrefillConsumed={() => setPrefillService(null)} />
      </main>
      <Footer />
    </div>
  );
}
