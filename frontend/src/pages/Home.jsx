import { useEffect } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Process from "@/components/Process";
import Products from "@/components/Products";
import Quality from "@/components/Quality";
import QuoteForm from "@/components/QuoteForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
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
    <div className="min-h-screen bg-background text-zinc-100" data-testid="app-root">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Capabilities />
        <Process />
        <Products />
        <Quality />
        <QuoteForm />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
