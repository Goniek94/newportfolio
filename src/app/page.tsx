"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import InitialLoader from "./components/InitialLoader";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import Projects from "./components/Projects";
import Contact from "./components/Contacts";
import GoldenGlow from "./components/GoldenGlow";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Blokujemy scroll tylko kiedy loader jest aktywny
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isLoading]);

  return (
    <main className="bg-[#050505] min-h-screen text-white relative selection:bg-[#D4AF37] selection:text-black">
      <AnimatePresence mode="wait">
        {isLoading && (
          <InitialLoader finishLoading={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Golden cursor glow effect */}
      {!isLoading && <GoldenGlow />}

      {/* Dopiero gdy loader zniknie (lub pod kurtyną), pokazujemy resztę */}
      <div className="relative z-0">
        <Hero />
        <AboutMe />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
