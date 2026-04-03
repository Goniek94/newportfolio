import { useRef, useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

// Scramble text effect — used for stack pills
export function useScramble(target: string) {
  const [display, setDisplay] = useState(target);
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = () => {
    if (active) return;
    setActive(true);
    let i = 0;
    const total = target.length * 3;
    const run = () => {
      setDisplay(
        target
          .split("")
          .map((ch, idx) => {
            if (ch === " ") return " ";
            if (idx < Math.floor(i / 3)) return target[idx];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );
      i++;
      if (i <= total) timer.current = setTimeout(run, 28);
      else {
        setDisplay(target);
        setActive(false);
      }
    };
    run();
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { display, trigger };
}
