export const useGlitchTimerCode = `'use client';

import { useState, useEffect } from 'react';

// Trigger glitch after 5 seconds on desktop
const GLITCH_TRIGGER_TIME = 5;

export function useGlitchTimer(onGlitchTrigger?: () => void) {
  const [timeOnDesktop, setTimeOnDesktop] = useState(0);
  const [glitchTriggered, setGlitchTriggered] = useState(false);

  // Increment timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnDesktop((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger glitch when time threshold is reached
  useEffect(() => {
    if (timeOnDesktop >= GLITCH_TRIGGER_TIME && !glitchTriggered && onGlitchTrigger) {
      setGlitchTriggered(true);
      onGlitchTrigger();
    }
  }, [timeOnDesktop, glitchTriggered, onGlitchTrigger]);

  return { timeOnDesktop, glitchTriggered };
}`;
