export const warningCode = `'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WarningProps {
  onFinish: () => void;
}

const AUDIO_FILES = [
  '/sound/CrazyFrog.mp3',
  '/sound/Crazy Frog - Axel F (Official Video) (mp3cut.net).mp3',
];

// BSOD screen with Crazy Frog virus joke — plays audio on mount
export default function Warning({ onFinish }: WarningProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockRef = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadAndPlay = async () => {
      for (const src of AUDIO_FILES) {
        try {
          const a = new Audio(src);
          a.volume = 0.5;
          a.loop = true;

          await new Promise<void>((resolve, reject) => {
            a.addEventListener('loadedmetadata', () => resolve(), { once: true });
            a.addEventListener('error', () => reject(), { once: true });
            a.load();
          });

          if (!mounted) return;
          audioRef.current = a;

          const tryPlay = () =>
            a.play().then(() => setPlaying(true)).catch(() => {});

          unlockRef.current = tryPlay;
          tryPlay();

          // Retry on user interaction if autoplay was blocked
          ['click', 'pointerdown', 'keydown'].forEach((evt) =>
            document.addEventListener(evt, tryPlay)
          );
          break;
        } catch { /* try next file */ }
      }
    };

    loadAndPlay();

    return () => {
      mounted = false;
      audioRef.current?.pause();
      audioRef.current = null;
      if (unlockRef.current) {
        ['click', 'pointerdown', 'keydown'].forEach((evt) =>
          document.removeEventListener(evt, unlockRef.current as () => void)
        );
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-y-scroll z-50"
      style={{ background: '#0000AA', fontFamily: '"Lucida Console", "Courier New", monospace', color: '#FFFFFF' }}
    >
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="max-w-4xl w-full">
          <div className="text-sm sm:text-base font-bold mb-4">
            A problem has been detected and Windows has been shut down to prevent damage to your computer.
          </div>

          <div className="text-base sm:text-lg mb-4 font-bold">CRAZY_FROG_VIRUS_2000</div>

          <div className="text-xs sm:text-sm mb-4">
            If this is the first time you've seen this Stop error screen, restart your computer.
            If this screen appears again, follow these steps:
          </div>

          <div className="text-xs sm:text-sm mb-6 font-mono">
            Technical information:
            <br /><br />
            *** STOP: 0x0000007B (0xF78D2524, 0xC0000034, 0x00000000, 0x00000000)
          </div>

          {/* Crazy Frog warning box */}
          <div className="bg-white text-black p-4 mb-6 border-2 border-gray-400">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold mb-3 text-red-600">
                🐸 YOU'VE BEEN INFECTED WITH THE CRAZY FROG VIRUS FROM THE YEAR 2000! 🐸
              </div>
              {playing && (
                <div className="text-sm mb-3 text-green-600 font-bold animate-bounce">
                  ♪ Ring ding ding daa baa baa aramba baa bom baa barooumba ♪
                </div>
              )}
              <div className="text-sm font-bold text-blue-600">
                To recover your system, check out my CV and portfolio!
              </div>
            </div>
          </div>

          <div className="text-center pb-8">
            <button
              onClick={onFinish}
              className="bg-gray-300 text-black px-6 py-2 text-sm font-bold border-2 border-gray-500 hover:bg-gray-400 transition-colors"
              style={{ fontFamily: 'Tahoma, sans-serif' }}
            >
              [PRESS ANY KEY TO CONTINUE]
            </button>
          </div>
        </div>
      </div>

      {/* CRT scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />
    </div>
  );
}`;
