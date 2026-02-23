export const taskbarStylesCode = `import React from 'react';

/* ── Main taskbar bar ── */
export const taskbarStyle: React.CSSProperties = {
  position: 'fixed', left: 0, right: 0, bottom: 0, height: 30,
  display: 'flex', alignItems: 'center',
  background: 'linear-gradient(180deg, #245EDC 0%, #3F8CF3 9%, #245EDC 18%, #245EDC 92%, #1941A5 100%)',
  borderTop: '1px solid #0831D9',
  boxShadow: '0 -1px 1px rgba(255,255,255,0.2) inset',
  fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
  fontSize: '11px', zIndex: 10000,
};

/* ── Start button (green, rounded right) ── */
export const getStartButtonStyle = (isActive: boolean): React.CSSProperties => ({
  marginLeft: 2, height: 24, padding: '0 12px 0 6px',
  background: isActive
    ? 'linear-gradient(180deg, #2D8C2D 0%, #4DB84D 50%, #2D8C2D 100%)'
    : 'linear-gradient(180deg, #5EAC5E 0%, #5EDB5E 18%, #4DB84D 50%, #3FA33F 82%, #2D8C2D 100%)',
  border: isActive ? '1px solid #1A6B1A' : '1px solid #2D8C2D',
  borderRadius: '0 3px 3px 0',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
  color: '#fff', fontSize: 11, fontWeight: 'bold',
  fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
  textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
});

/* ── Taskbar window buttons ── */
export const getWindowButtonStyle = (isActive: boolean): React.CSSProperties => ({
  height: 22, minWidth: 100, maxWidth: 160, padding: '0 8px',
  background: isActive
    ? 'linear-gradient(180deg, #1941A5 0%, #245EDC 50%, #245EDC 100%)'
    : 'linear-gradient(180deg, #3F8CF3 0%, #3F8CF3 9%, #2E75E3 45%, #245EDC 55%, #1D4FB5 100%)',
  border: isActive ? '1px solid #0831D9' : '1px solid rgba(255,255,255,0.2)',
  borderRadius: 3,
  cursor: 'pointer', fontSize: 11, fontWeight: isActive ? 'bold' : 'normal',
  color: '#fff', display: 'flex', alignItems: 'center', gap: 4,
  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  textShadow: '0 1px 1px rgba(0,0,0,0.5)',
});

/* ── System tray ── */
export const systemTrayContainerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, height: 24, padding: '0 8px',
  marginLeft: 4, borderLeft: '2px solid rgba(16,56,150,0.8)',
  background: 'rgba(16,56,150,0.15)',
};

/* ── Clock ── */
export const clockStyle: React.CSSProperties = {
  marginLeft: 4, marginRight: 4, padding: '2px 8px', height: 22,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(16,56,150,0.2)', border: '1px solid rgba(16,56,150,0.3)',
  borderRadius: 2, fontSize: 11, fontWeight: 'bold', color: '#fff',
  textShadow: '0 1px 1px rgba(0,0,0,0.5)', cursor: 'pointer', minWidth: 45,
};`;

export const useClockCode = `'use client';

import { useState, useEffect } from 'react';

// Provides live HH:MM time updated every minute
export function useClock() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }));
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const getFullDate = () =>
    new Date().toLocaleDateString('pl-PL', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  return { time, fullDate: getFullDate() };
}`;
