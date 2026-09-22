import { useEffect, useState, useCallback } from "react";
import Lenis from "lenis";
import "@/App.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBento from "@/components/StatsBento";
import Marquee from "@/components/Marquee";
import Vision from "@/components/Vision";
import History from "@/components/History";
import Capabilities from "@/components/Capabilities";
import Integrated from "@/components/Integrated";
import Tolerance from "@/components/Tolerance";
import Footer from "@/components/Footer";
import RFQModal from "@/components/RFQModal";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [rfqOpen, setRfqOpen] = useState(false);
  const openRfq = useCallback(() => setRfqOpen(true), []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100" data-testid="app-root">
      <Toaster theme="dark" position="bottom-right" />
      <Navbar onQuote={openRfq} />
      <main>
        <Hero onQuote={openRfq} />
        <StatsBento />
        <Marquee />
        <Vision />
        <History />
        <Capabilities />
        <Integrated />
        <Tolerance />
      </main>
      <Footer onQuote={openRfq} />
      <RFQModal open={rfqOpen} onOpenChange={setRfqOpen} />
    </div>
  );
}

export default App;
