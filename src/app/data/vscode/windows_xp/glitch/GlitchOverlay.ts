export const glitchOverlayCode = `'use client';

import React from 'react';
import { useGlitchAnimation } from './hooks/useGlitchAnimation';

interface GlitchOverlayProps {
  onFinish: () => void;
}

export default function GlitchOverlay({ onFinish }: GlitchOverlayProps) {
  const { isVisible, isFadingOut, glitchIntensity, handleFinish } = useGlitchAnimation({ onFinish });

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      style={{
        animation: isFadingOut
          ? 'glitchFadeOut 0.6s ease-out forwards'
          : 'glitchFadeIn 0.3s ease-in, screenShakeExtreme 0.1s infinite 0.3s',
      }}
    >
      {/* Matrix Rain Canvas */}
      <MatrixRain />

      {/* Static Noise */}
      <StaticNoise />

      {/* RGB Split Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/img/Windowsxp.jpg")',
          backgroundSize: 'cover',
          mixBlendMode: 'screen',
          opacity: 0.15,
          transform: \`translateX(\${glitchIntensity * 8}px)\`,
          filter: 'hue-rotate(90deg)',
        }}
      />

      {/* Scan Lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          zIndex: 10,
        }}
      />

      {/* Error Messages */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-4">
        <div style={{ color: '#00FF00', fontFamily: 'monospace', fontSize: '14px', textAlign: 'center', textShadow: '0 0 10px #00FF00' }}>
          <div>CRITICAL ERROR: REALITY.EXE HAS STOPPED WORKING</div>
          <div style={{ marginTop: '8px', color: '#FF0000' }}>MEMORY DUMP: 0x0000007E</div>
          <div style={{ marginTop: '4px', color: '#FFFF00' }}>KERNEL_DATA_INPAGE_ERROR</div>
        </div>
      </div>

      {/* Horizontal Glitch Bars */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: \`\${10 + i * 12}%\`,
            height: \`\${2 + Math.random() * 4}px\`,
            backgroundColor: i % 2 === 0 ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)',
            transform: \`translateX(\${(Math.random() - 0.5) * 40}px)\`,
            zIndex: 15,
          }}
        />
      ))}

      {/* Skip Button */}
      <button
        onClick={handleFinish}
        className="absolute bottom-8 right-8 z-30"
        style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#00FF00',
          border: '1px solid #00FF00',
          padding: '8px 16px',
          fontFamily: 'monospace',
          fontSize: '12px',
          cursor: 'pointer',
          textShadow: '0 0 8px #00FF00',
          boxShadow: '0 0 12px rgba(0,255,0,0.3)',
        }}
      >
        [SKIP] →
      </button>

      <style jsx>{\`
        @keyframes glitchFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glitchFadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(1.05); }
        }
        @keyframes screenShakeExtreme {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-3px, 2px); }
          50% { transform: translate(3px, -2px); }
          75% { transform: translate(-2px, -3px); }
        }
      \`}</style>
    </div>
  );
}`;
