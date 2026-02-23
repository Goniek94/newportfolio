export const welcomeScreenCode = `import React, { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onFinish?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Display for 2 seconds, then fade out and call onFinish
    const welcomeTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onFinish?.(), 800);
    }, 2000);

    return () => clearTimeout(welcomeTimer);
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center font-sans"
      style={{
        backgroundImage: 'url("/img/Windowsxp.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
      }}
    >
      {/* Blue radial overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(135,206,235,0.9) 0%, rgba(65,105,225,0.8) 50%, rgba(30,60,114,0.9) 100%)',
        }}
      />

      {/* Logo + text */}
      <div className="flex flex-col items-center relative z-10">
        {/* Windows flag — 4 colored panels with perspective */}
        <div className="relative mb-8" style={{ width: '150px', height: '120px' }}>
          {[
            { bg: 'linear-gradient(135deg, #ff4444 0%, #cc1111 50%, #aa0000 100%)', radius: '8px 0 0 8px', left: '8px', top: '15px' },
            { bg: 'linear-gradient(135deg, #44ff44 0%, #22cc22 50%, #009900 100%)', radius: '0 8px 8px 0', left: '74px', top: '15px' },
            { bg: 'linear-gradient(135deg, #4488ff 0%, #2266cc 50%, #0044aa 100%)', radius: '8px 0 0 8px', left: '8px', top: '58px' },
            { bg: 'linear-gradient(135deg, #ffdd44 0%, #ddaa22 50%, #bb8800 100%)', radius: '0 8px 8px 0', left: '74px', top: '58px' },
          ].map(({ bg, radius, left, top }, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: '68px', height: '45px',
                background: bg,
                borderRadius: radius,
                left, top,
                transform: \`perspective(200px) rotateY(\${i % 2 === 0 ? '-15deg' : '15deg'})\`,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
              }}
            />
          ))}
        </div>

        {/* Microsoft Windows XP text */}
        <div className="text-center">
          <div className="mb-2">
            <span style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '16px', color: '#ffffff', letterSpacing: '1px' }}>
              Microsoft<span style={{ fontSize: '12px', verticalAlign: 'super' }}>®</span>
            </span>
          </div>
          <div className="flex items-end justify-center">
            <span style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '52px', fontWeight: '300', color: '#ffffff', letterSpacing: '2px' }}>
              Windows
            </span>
            <span style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '36px', fontWeight: 'bold', color: '#ff6600', marginLeft: '8px' }}>
              XP
            </span>
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.4) 100%)' }}
      />
    </div>
  );
};

export default WelcomeScreen;`;
