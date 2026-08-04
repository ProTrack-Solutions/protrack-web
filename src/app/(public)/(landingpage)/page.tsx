"use client";

import { useEffect, useState } from "react";
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
import "./landing-theme.css";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setOffset(window.scrollY);
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="landing-light min-h-screen overflow-x-hidden">
        <Navbar scrolled={scrolled} />

        <main>
          <Hero offset={offset} />
          <Marquee />
          <ModulesSection />
          <FeaturesSection />
          <HowItWorksSection />
          <PricingSection />
          <FaqSection />
          <FinalCta />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
