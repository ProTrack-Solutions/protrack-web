"use client";

import { useEffect, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { ModulesSection } from "./components/ModulesSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { PricingSection } from "./components/PricingSection";
import { FaqSection } from "./components/FaqSection";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";
import { ScrollProgress } from "./components/ScrollProgress";
import { WaveDivider } from "./components/WaveDivider";
import "./landing-theme.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Só o booleano vira estado: evita re-renderizar a página a cada pixel rolado
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`landing-light ${display.variable} min-h-screen overflow-x-clip`}
    >
      <ScrollProgress />
      <Navbar scrolled={scrolled} />

      <main>
        <Hero />
        <Marquee />
        <ModulesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WaveDivider from="text-background" to="text-secondary" />
        <PricingSection />
        <WaveDivider from="text-secondary" to="text-background" />
        <FaqSection />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
