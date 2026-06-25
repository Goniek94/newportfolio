"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import AsciiLoader from "./components/AsciiLoader";
// import AinoLoader from "./components/AinoLoader";       // ← wariant reveal tekstu
// import InitialLoader from "./components/InitialLoader"; // ← kosmos: przywróć i zamień niżej
import IntroWork from "./components/IntroWork";
import Journey from "./components/Journey";
// import Hero from "./components/Hero"; // ← pitch hero: odkomentuj, by przywrócić
// import AboutMe from "./components/AboutMe"; // ← revert: re-enable & swap below
// import ProfileCockpit from "./components/ProfileCockpit"; // ← noir cockpit: odkomentuj, by przywrócić
import Projects from "./components/Projects";
import Contact from "./components/Contacts";
import CustomCursor from "./components/CustomCursor";

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
          <AsciiLoader finishLoading={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Custom crosshair cursor — visible from the first frame */}
      <CustomCursor />

      {/* Dopiero gdy loader zniknie (lub pod kurtyną), pokazujemy resztę */}
      <div className="relative z-0">
        {/* One connected section: about morphs into the project showroom */}
        <IntroWork
          start={!isLoading}
          onSelect={() =>
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />

        {/* 2 — animated career timeline */}
        <Journey />

        {/* Pitch hero / noir cockpit folded out; uncomment imports to bring back */}
        {/* <Hero /> */}
        {/* <ProfileCockpit /> */}
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
