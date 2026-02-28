"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  finishLoading: () => void;
}

// Symbole, które będą "padać" w tle
const snowSymbols = [
  "{ }",
  "</>",
  "&&",
  ";",
  "[]",
  "#",
  "()",
  "01",
  "div",
  "npm",
];

export default function InitialLoader({ finishLoading }: LoaderProps) {
  const [counter, setCounter] = useState(0);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  // Generujemy pozycje śnieżynek tylko raz po załadowaniu komponentu, żeby uniknąć błędów hydratacji
  const [particles, setParticles] = useState<Array<any>>([]);

  useEffect(() => {
    // Generowanie losowych parametrów dla 30 spadających elementów
    const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // Pozycja pozioma %
      delay: Math.random() * 5, // Opóźnienie startu
      duration: Math.random() * 10 + 10, // Jak długo spada (wolno: 10-20s)
      symbol: snowSymbols[Math.floor(Math.random() * snowSymbols.length)], // Losowy symbol
      size: Math.random() * 14 + 10, // Rozmiar czcionki
      opacity: Math.random() * 0.3 + 0.05, // Przezroczystość (bardzo delikatne)
    }));
    setParticles(generatedParticles);
  }, []);

  // 1. Zegar i Data
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pl-PL", { hour12: false }));
      setDate(now.toLocaleDateString("pl-PL"));
    };
    updateTime();
    const timerInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // 2. Licznik zsynchronizowany na 3 sekundy (30ms * 100 = 3000ms) - TYLKO czysta funkcja aktualizująca
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 3. Nasłuchiwacz zakończenia ładowania (uruchamia się jako osobny, bezpieczny efekt)
  useEffect(() => {
    if (counter >= 100) {
      finishLoading();
    }
  }, [counter, finishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.4 } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-[#e1e1e1] overflow-hidden"
    >
      {/* --- BACKGROUND EFFECTS --- */}

      {/* 1. Grid (Siatka) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* 2. Gradient (Winieta) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#1a1a1a,transparent)] pointer-events-none"></div>

      {/* 3. TECH SNOW (Spadające symbole) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: "110vh", opacity: p.opacity }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity, // Zapętlenie
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              fontSize: `${p.size}px`,
              fontFamily: "monospace",
              color: "#555", // Kolor symboli
            }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </div>

      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-20 mix-blend-difference">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-sm md:text-base font-bold tracking-wider uppercase"
        >
          Mateusz Goszczycki
          <span className="block text-[10px] text-neutral-500 font-normal tracking-normal mt-1">
            Personal Portfolio
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-right text-sm md:text-base font-bold tracking-wider uppercase"
        >
          2026 Edition
          <span className="block text-[10px] text-neutral-500 font-normal tracking-normal mt-1">
            v 1.0.0 (RC)
          </span>
        </motion.div>
      </div>

      {/* --- CENTRUM --- */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* FULLSTACK */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-none text-white mix-blend-overlay"
          >
            FULLSTACK
          </motion.h1>
        </div>

        {/* SZLACZEK SVG - Zsynchronizowany z 3 sekundami */}
        <div className="w-full max-w-2xl my-4 md:my-8 relative h-6 md:h-10 flex items-center justify-center">
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 600 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full md:w-[600px]"
          >
            {/* Pulse path definition */}
            <defs>
              <path
                id="pulsePath"
                d="M0 10 H30 L35 5 L40 15 L45 3 L50 17 L55 10 H90 L95 5 L100 15 L105 3 L110 17 L115 10 H150 L155 5 L160 15 L165 3 L170 17 L175 10 H210 L215 5 L220 15 L225 3 L230 17 L235 10 H270 L275 5 L280 15 L285 3 L290 17 L295 10 H330 L335 5 L340 15 L345 3 L350 17 L355 10 H390 L395 5 L400 15 L405 3 L410 17 L415 10 H450 L455 5 L460 15 L465 3 L470 17 L475 10 H510 L515 5 L520 15 L525 3 L530 17 L535 10 H570 L575 5 L580 15 L585 3 L590 17 L595 10 H600"
              />
              {/* Glow filter for the moving dot */}
              <filter
                id="pulseGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Static pulse line - rysuje się równe 2.8 sekundy (startuje w 0.2s) */}
            <motion.use
              href="#pulsePath"
              stroke="#D4AF37"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.8, ease: "easeInOut", delay: 0.2 }}
            />

            {/* Glowing dot - biegnie raz z tą samą prędkością co linia */}
            <circle r="4" fill="#facc15" filter="url(#pulseGlow)" opacity="0">
              <animateMotion
                dur="2.8s"
                repeatCount="1"
                begin="0.2s"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.42 0 0.58 1"
              >
                <mpath href="#pulsePath" />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                keyTimes="0;0.1;0.9;1"
                dur="2.8s"
                repeatCount="1"
                begin="0.2s"
              />
            </circle>
          </motion.svg>
        </div>

        {/* DEVELOPER */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "-110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-none text-neutral-600"
            style={{ WebkitTextStroke: "1px #333" }}
          >
            DEVELOPER
          </motion.h1>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex justify-between items-end z-20 text-[#888]">
        <div className="flex flex-col text-xs md:text-sm font-mono">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            LOCATION: POLAND
          </motion.span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 mt-1 text-white"
          >
            <span>{date}</span>
            <span className="w-[80px]">{time}</span>{" "}
            {/* Stała szerokość dla czasu, żeby nie skakało */}
          </motion.div>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="text-5xl md:text-7xl font-mono font-bold text-white"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {counter}%
          </motion.div>
        </div>
      </div>

      {/* --- KURTYNA --- */}
      <motion.div
        initial={{ height: 0 }}
        exit={{
          height: "100vh",
          transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
        }}
        className="absolute bottom-0 left-0 w-full bg-[#ffffff] z-30"
      />
    </motion.div>
  );
}
