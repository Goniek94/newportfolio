"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Cosmos from "./loader/Cosmos";
import { useIsTouch } from "../hooks/useIsTouch";

interface LoaderProps {
  finishLoading: () => void;
}

const BASE_RATE = 360 / 25_000;
const DRAG_SENSITIVITY = 0.45;
const HOLD_RAMP = 2.4;
// How fast holding closes the gap to Earth (fraction of the journey per second).
const APPROACH_RATE = 0.05;
// Starting distance to Earth (≈ distance to the Moon) — just for the HUD.
const MAX_DIST_KM = 384_400;

// Story beats revealed as you close the distance home (the dev's journey).
const STORY: { at: number; text: string }[] = [
  { at: 0.06, text: "Every system I built started a long way from home." },
  { at: 0.3, text: "Six years in a kitchen taught me to ship under pressure." },
  { at: 0.55, text: "Then autosell.pl went live — for a real, paying client." },
  { at: 0.78, text: "Three production apps. Solo. Schema to prod." },
  { at: 0.93, text: "Almost home. Let's build something." },
];

export default function InitialLoader({ finishLoading }: LoaderProps) {
  const [counter, setCounter] = useState(0);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [flying, setFlying] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [beat, setBeat] = useState("");
  const isTouch = useIsTouch();

  const rotation = useMotionValue(0);
  const dragOffset = useMotionValue(0);
  const approach = useMotionValue(0); // 0 = far dot, 1 = docked at Earth
  const rawBoost = useMotionValue(0);
  const smoothBoost = useSpring(rawBoost, {
    damping: 22,
    stiffness: 160,
    mass: 0.6,
  });

  // Steering yoke rotation — driven by drag, dampened
  const wheelRotation = useTransform(dragOffset, (v) => v * 0.4);

  const isHoldingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const pointerRef = useRef({ x: -200, y: -200 });
  const dismissingRef = useRef(false);
  const arrivedRef = useRef(false);
  const counterRef = useRef(0);
  const lastApproachRef = useRef(0);
  const speedSmoothRef = useRef(0);
  const beatRef = useRef("");

  // Telemetry HUD — animated via direct DOM writes (no React re-renders per frame)
  const velRef = useRef<HTMLSpanElement>(null);
  const distRef = useRef<HTMLSpanElement>(null);
  const speedoRef = useRef<HTMLSpanElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pl-PL", { hour12: false }));
      setDate(now.toLocaleDateString("pl-PL"));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Main loop — throttle, approach progress, rotation, telemetry, reticle
  useAnimationFrame((_t, delta) => {
    const dt = Math.max(delta / 1000, 0.0001);

    // Throttle (boost) ramps while holding, decays when released
    if (isHoldingRef.current) {
      rawBoost.set(rawBoost.get() + dt * HOLD_RAMP);
    } else {
      rawBoost.set(rawBoost.get() * 0.94);
    }
    const boostMag = Math.abs(smoothBoost.get());

    // Holding closes the distance to Earth — faster the harder you push
    if (isHoldingRef.current && !dismissingRef.current) {
      const inc = dt * (APPROACH_RATE + boostMag * 0.12);
      approach.set(Math.min(1, approach.get() + inc));
    }
    const a = approach.get();

    // Globe keeps spinning, faster under throttle
    rotation.set(rotation.get() + delta * BASE_RATE * (1 + boostMag * 6));

    // Follow the pointer with the steering reticle
    if (reticleRef.current) {
      reticleRef.current.style.transform = `translate(${pointerRef.current.x}px, ${pointerRef.current.y}px)`;
    }

    // Progress % is the journey home
    const pct = Math.round(a * 99);
    if (pct !== counterRef.current && !dismissingRef.current) {
      counterRef.current = pct;
      setCounter(pct);
    }

    // Arrived?
    const isArr = a >= 0.999;
    if (isArr !== arrivedRef.current) {
      arrivedRef.current = isArr;
      setArrived(isArr);
    }

    // Current story beat for this progress
    let txt = "";
    for (const s of STORY) if (a >= s.at) txt = s.text;
    if (txt !== beatRef.current) {
      beatRef.current = txt;
      setBeat(txt);
    }

    // Telemetry: distance shrinks, speed = how fast the gap is closing
    const distKm = Math.round((1 - a) * MAX_DIST_KM);
    const rate = (a - lastApproachRef.current) / dt; // per second
    lastApproachRef.current = a;
    const closing = rate * MAX_DIST_KM; // km/s
    speedSmoothRef.current += (closing - speedSmoothRef.current) * 0.18;
    const spd = Math.max(0, Math.round(speedSmoothRef.current));

    if (velRef.current) velRef.current.textContent = spd.toLocaleString();
    if (speedoRef.current) speedoRef.current.textContent = spd.toLocaleString();
    if (distRef.current) distRef.current.textContent = distKm.toLocaleString();
  });

  const dismiss = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;
    approach.set(1);
    rawBoost.set(rawBoost.get() + 8);
    setCounter(100);
  }, [approach, rawBoost]);

  // Keyboard: hold Space/Enter to fly in; once arrived, Enter enters the site
  useEffect(() => {
    const isHoldKey = (k: string) =>
      k === " " || k === "Enter" || k === "ArrowDown" || k === "PageDown";
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isHoldKey(e.key)) return;
      e.preventDefault();
      if (arrivedRef.current) {
        dismiss();
        return;
      }
      isHoldingRef.current = true;
      setFlying(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!isHoldKey(e.key)) return;
      isHoldingRef.current = false;
      setFlying(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [dismiss]);

  // Pointer hold (accelerate) + drag (steer) + reticle tracking
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button")) return;
      isHoldingRef.current = true;
      setFlying(true);
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (!isHoldingRef.current || !lastPointerRef.current) return;
      const dx = e.clientX - lastPointerRef.current.x;
      if (Math.abs(dx) > 1) {
        dragOffset.set(dragOffset.get() + dx * DRAG_SENSITIVITY);
      }
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      isHoldingRef.current = false;
      setFlying(false);
      lastPointerRef.current = null;
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragOffset]);

  // While the loader owns the screen, hide the global crosshair cursor — the
  // loader draws its own flight reticle instead.
  useEffect(() => {
    window.dispatchEvent(new Event("cursor:hide"));
    return () => {
      window.dispatchEvent(new Event("cursor:show"));
    };
  }, []);

  useEffect(() => {
    if (counter >= 100) finishLoading();
  }, [counter, finishLoading]);

  // Auto-enter the portfolio shortly after docking (ENTER stays as a skip).
  useEffect(() => {
    if (!arrived) return;
    const id = setTimeout(() => dismiss(), 1600);
    return () => clearTimeout(id);
  }, [arrived, dismiss]);

  const ready = arrived;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.4 } }}
      className="fixed inset-0 z-[9999] bg-black text-[#e1e1e1] overflow-hidden cursor-none"
    >
      {/* Full-screen cosmic scene */}
      <Cosmos
        rotation={rotation}
        dragOffset={dragOffset}
        boost={smoothBoost}
        approach={approach}
        lowPower={isTouch}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle at center, transparent 38%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* COCKPIT CORNERS — sci-fi viewfinder brackets */}
      <CockpitCorners />

      {/* FLIGHT RETICLE — follows the pointer; a crosshair that morphs into a
          steering yoke while holding (banks left/right with drag). */}
      {!isTouch && (
        <div
          ref={reticleRef}
          className="absolute top-0 left-0 z-40 pointer-events-none"
          style={{ willChange: "transform" }}
        >
          {/* idle crosshair */}
          <motion.div
            animate={{ opacity: flying ? 0 : 1, scale: flying ? 0.5 : 1 }}
            transition={{ duration: 0.2 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative h-9 w-9">
              <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/50" />
              <div className="absolute left-1/2 top-1/2 h-[1px] w-3 -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37]/70" />
              <div className="absolute left-1/2 top-1/2 h-3 w-[1px] -translate-x-1/2 -translate-y-1/2 bg-[#D4AF37]/70" />
              <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
            </div>
          </motion.div>

          {/* steering yoke (while flying) — banks with drag */}
          <motion.div
            animate={{ opacity: flying ? 1 : 0, scale: flying ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <motion.svg
              viewBox="0 0 100 100"
              className="h-24 w-24 md:h-28 md:w-28 drop-shadow-[0_0_8px_rgba(212,175,55,0.45)]"
              style={{ rotate: wheelRotation }}
            >
              <circle cx="50" cy="50" r="44" fill="none" stroke="#D4AF37" strokeOpacity="0.7" strokeWidth="2" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#D4AF37" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="6" y1="50" x2="94" y2="50" stroke="#D4AF37" strokeOpacity="0.65" strokeWidth="2.4" />
              <line x1="50" y1="6" x2="50" y2="30" stroke="#D4AF37" strokeOpacity="0.65" strokeWidth="2.4" />
              {[0, 90, 180, 270].map((deg) => (
                <line key={deg} x1="50" y1="6" x2="50" y2="13" stroke="#D4AF37" strokeWidth="3" transform={`rotate(${deg} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="6" fill="#D4AF37" />
              <circle cx="50" cy="50" r="2.5" fill="#0a0a0a" />
            </motion.svg>
          </motion.div>
        </div>
      )}

      {/* TOP-LEFT — vessel info */}
      <div className="absolute top-0 left-0 p-6 md:p-10 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="font-mono"
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/70 mb-1">
            ◆ VESSEL · MG-2026
          </div>
          <div className="text-sm md:text-base font-bold uppercase tracking-wider text-white">
            Mateusz Goszczycki
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5 tracking-wider">
            Personal Portfolio
          </div>
        </motion.div>
      </div>

      {/* TOP-RIGHT — telemetry HUD */}
      <div className="absolute top-0 right-0 p-6 md:p-10 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-mono text-right"
        >
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/70 mb-2">
            ◆ Re-entry Telemetry
          </div>
          <div className="flex flex-col gap-1 text-[11px] md:text-xs">
            <div className="flex items-center justify-end gap-2">
              <span className="text-neutral-500 uppercase tracking-widest text-[9px]">
                VEL
              </span>
              <span ref={velRef} className="text-white tabular-nums min-w-[7ch] text-right">
                0
              </span>
              <span className="text-neutral-600 text-[9px]">km/s</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-neutral-500 uppercase tracking-widest text-[9px]">
                DIST
              </span>
              <span ref={distRef} className="text-white tabular-nums min-w-[7ch] text-right">
                {MAX_DIST_KM.toLocaleString()}
              </span>
              <span className="text-neutral-600 text-[9px]">km</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CENTER — story narration that unfolds as you fly home */}
      <div className="absolute inset-x-0 top-[18%] z-20 pointer-events-none flex justify-center px-6">
        <AnimatePresence mode="wait">
          {arrived ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-center select-none"
            >
              <div
                className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#D4AF37]"
                style={{ textShadow: "0 0 24px rgba(212,175,55,0.55)" }}
              >
                Welcome home
              </div>
            </motion.div>
          ) : beat ? (
            <motion.div
              key={beat}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl text-center select-none text-xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white"
              style={{ textShadow: "0 0 18px rgba(0,0,0,0.8)" }}
            >
              {beat}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-center select-none"
            >
              <div
                className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white"
                style={{ textShadow: "0 0 16px rgba(255,255,255,0.2)" }}
              >
                Hold to return to Earth
              </div>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="mt-3 font-mono text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80"
              >
                ⤓ press &amp; hold anywhere
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM-CENTER — speedometer + ENTER, sitting right under the planet */}
      <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-5">
        {/* Speedometer — reacts to hold/acceleration */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="pointer-events-none flex select-none items-baseline gap-2 font-mono"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-500">
            SPD
          </span>
          <span
            ref={speedoRef}
            className="text-2xl md:text-4xl font-black tabular-nums text-[#D4AF37] [text-shadow:0_0_18px_rgba(212,175,55,0.45)]"
          >
            0
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            km/s
          </span>
        </motion.div>

        {/* ENTER button — appears when arrived */}
        <motion.button
          type="button"
          onClick={dismiss}
          aria-label="Enter portfolio"
          initial={{ opacity: 0, y: 14, scale: 0.92 }}
          animate={{
            opacity: ready ? 1 : 0,
            y: ready ? 0 : 14,
            scale: ready ? 1 : 0.92,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="relative group"
          style={{ pointerEvents: ready ? "auto" : "none" }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#D4AF37]/30 blur-2xl"
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative inline-flex items-center gap-3 px-10 md:px-12 py-3.5 md:py-4 rounded-full bg-[#D4AF37] text-black font-black text-sm md:text-base uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(212,175,55,0.45)] group-hover:bg-white group-hover:shadow-[0_0_60px_rgba(212,175,55,0.7)] transition-colors duration-300">
            Enter
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              →
            </motion.span>
          </span>
        </motion.button>

        {/* Hint — always visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pointer-events-none text-center text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 md:text-[11px]"
        >
          {ready ? (
            <>
              press <span className="text-[#D4AF37]">enter</span> to land
            </>
          ) : (
            <>hold to fly · drag to steer</>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex justify-between items-end z-20 text-[#888] pointer-events-none">
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
            <span className="w-[80px]">{time}</span>
          </motion.div>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="text-5xl md:text-7xl font-mono font-bold text-white tabular-nums"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {counter}%
          </motion.div>
        </div>
      </div>

      {/* Curtain on exit — fade to black (not white) */}
      <motion.div
        initial={{ opacity: 0 }}
        exit={{
          opacity: 1,
          transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
        }}
        className="absolute inset-0 bg-[#050505] z-30 pointer-events-none"
      />
    </motion.div>
  );
}

/** Sci-fi viewfinder bracket corners — gold L-shapes at the inset frame */
function CockpitCorners() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
      className="absolute inset-4 md:inset-8 pointer-events-none z-10"
    >
      {(
        [
          ["top-0 left-0", "border-t-2 border-l-2"],
          ["top-0 right-0", "border-t-2 border-r-2"],
          ["bottom-0 left-0", "border-b-2 border-l-2"],
          ["bottom-0 right-0", "border-b-2 border-r-2"],
        ] as const
      ).map(([pos, border]) => (
        <div
          key={pos}
          className={`absolute ${pos} w-10 h-10 md:w-14 md:h-14 ${border} border-[#D4AF37]/35`}
        />
      ))}
    </motion.div>
  );
}
