export const bootScreenCode = `import React, { useEffect, useState, useRef } from 'react';

interface BootScreenProps {
  onFinish?: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [showStartupText, setShowStartupText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const onFinishRef = useRef(onFinish);

  useEffect(() => { onFinishRef.current = onFinish; }, [onFinish]);

  useEffect(() => {
    const startTime = Date.now();
    const loadingDuration = 5000;

    // Phase 1: progress bar fills over 5 seconds
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min((elapsed / loadingDuration) * 100, 100);
      setProgress(calculatedProgress);
      if (calculatedProgress >= 100) clearInterval(progressInterval);
    }, 50);

    // Ensure bar reaches 100% at exactly 5s
    const set100Timer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
    }, 5000);

    // Phase 2: show "Uruchamianie Windows..." text after 0.5s pause
    const showTextTimer = setTimeout(() => setShowStartupText(true), 5500);

    // Phase 3: fade out and call onFinish at 7.5s
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
      onFinishRef.current?.();
    }, 7500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(set100Timer);
      clearTimeout(showTextTimer);
      clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-sans relative"
      style={{
        background: 'linear-gradient(to bottom, #245edb 0%, #1941a5 100%)',
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh', zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 1s ease-out',
      }}
    >
      {/* Windows XP logo — 4 colored flag panels */}
      <div className="mb-20">
        <div className="relative mb-6 mx-auto w-20 h-12">
          {[
            { color: 'from-red-400 to-red-600', left: '0px', top: '0px' },
            { color: 'from-green-400 to-green-600', left: '40px', top: '0px' },
            { color: 'from-blue-400 to-blue-700', left: '0px', top: '20px' },
            { color: 'from-yellow-300 to-yellow-500', left: '40px', top: '20px' },
          ].map(({ color, left, top }, i) => (
            <div
              key={i}
              className={\`absolute w-12 h-8 bg-gradient-to-br \${color}\`}
              style={{ clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)', left, top }}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="text-white text-base font-normal tracking-wider mb-2">
            Microsoft<span className="text-xs align-top">®</span>
          </div>
          <div className="flex items-baseline justify-center">
            <span className="text-white text-5xl font-light tracking-wide">Windows</span>
            <span className="text-orange-500 text-2xl font-bold ml-1 align-top">XP</span>
          </div>
        </div>
      </div>

      {/* Loading bar or startup text */}
      <div className="w-72">
        {!showStartupText ? (
          <>
            <div className="w-full h-3 bg-gray-900 border border-gray-700 rounded-sm overflow-hidden mb-2">
              <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 relative transition-all duration-200 ease-out"
                  style={{ width: \`\${Math.min(progress, 100)}%\` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-blue-200 opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <span className="text-white text-sm font-mono">{Math.floor(progress)}%</span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-white mb-8" style={{ fontSize: '14px', animation: 'fadeInText 0.8s ease-in-out' }}>
              Uruchamianie Windows...
            </p>
            <div className="flex justify-center space-x-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  style={{ animation: \`dotPulse 1.4s ease-in-out \${delay}s infinite\` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-6 text-gray-300 text-xs font-light">
        Copyright © Microsoft Corporation
      </div>

      <style jsx>{\`
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      \`}</style>
    </div>
  );
};

export default BootScreen;`;
