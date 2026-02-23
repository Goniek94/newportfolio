export const winampPlayerCode = `import React, { useRef, useEffect, useState } from 'react';

interface Track {
  title: string;
  artist: string;
  url: string;
}

interface WinampPlayerProps {
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTimeUpdate: (time: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onTrackEnded: () => void;
  onClose: () => void;
}

export default function WinampPlayer({
  currentTrack, currentTime, duration, isPlaying,
  onPlay, onPause, onStop, onNext, onPrev,
  onTimeUpdate, onLoadedMetadata, onTrackEnded, onClose,
}: WinampPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(75);
  const [scrollPosition, setScrollPosition] = useState(0);

  function formatTime(seconds: number) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return \`\${m}:\${s.toString().padStart(2, '0')}\`;
  }

  // Scrolling track title effect
  useEffect(() => {
    if (!currentTrack || !isPlaying) return;
    const text = \`*** \${currentTrack.artist} - \${currentTrack.title} ***  \`;
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % (text.length * 8));
    }, 200);
    return () => clearInterval(interval);
  }, [currentTrack, isPlaying]);

  // Load and play track when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const parts = currentTrack.url.split('/');
    const encodedParts = parts.map((part, i) =>
      i === parts.length - 1 ? encodeURIComponent(part) : part
    );
    const newSrc = window.location.origin + encodedParts.join('/');

    if (audio.src !== newSrc) {
      audio.src = newSrc;
      audio.load();
    }

    if (isPlaying) {
      if (audio.readyState >= 2) {
        audio.play().catch(console.error);
      } else {
        audio.addEventListener('canplay', () => audio.play().catch(console.error), { once: true });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const trackText = currentTrack
    ? \`*** \${currentTrack.artist} - \${currentTrack.title} ***  \`
    : '*** Winamp *** Press Play ***  ';

  return (
    <div style={{ width: 275, background: 'linear-gradient(180deg, #6B7C99 0%, #3D4C63 50%, #2A3747 100%)', fontFamily: 'Arial, sans-serif', userSelect: 'none' }}>
      {/* Title Bar */}
      <div style={{ height: 14, background: 'linear-gradient(180deg, #4A5F7F 0%, #2F3E52 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <span style={{ color: '#D0D8E0', fontSize: 9, fontWeight: 'bold' }}>
          <span style={{ color: '#00FF00' }}>█</span> Winamp
        </span>
        <div style={{ display: 'flex', gap: 2 }}>
          <button style={titleBtnStyle}>_</button>
          <button style={titleBtnStyle}>▴</button>
          <button style={titleBtnStyle} onClick={onClose}>✕</button>
        </div>
      </div>

      {/* Display Area */}
      <div style={{ padding: '4px 8px 8px 8px' }}>
        {/* Visualizer + Time + Track Info */}
        <div style={{ height: 26, backgroundColor: '#0A0F14', border: '2px solid #1A2332', display: 'flex', alignItems: 'center', padding: '2px 4px', gap: 4, marginBottom: 4 }}>
          {/* Visualizer bars */}
          <div style={{ width: 76, height: 16, backgroundColor: '#000', display: 'flex', alignItems: 'flex-end', gap: 1, padding: 1 }}>
            {[...Array(16)].map((_, i) => (
              <div key={i} style={{ width: 3, height: isPlaying ? \`\${Math.random() * 100}%\` : '2px', backgroundColor: '#00FF00', transition: 'height 0.1s ease' }} />
            ))}
          </div>
          {/* Time */}
          <div style={{ width: 50, height: 16, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#00FF41', fontSize: 13, fontFamily: 'monospace', fontWeight: 'bold' }}>
              {formatTime(currentTime)}
            </span>
          </div>
          {/* Scrolling track name */}
          <div style={{ flex: 1, height: 16, backgroundColor: '#000', overflow: 'hidden', position: 'relative' }}>
            <div style={{ color: '#00FF41', fontSize: 9, fontWeight: 'bold', whiteSpace: 'nowrap', position: 'absolute', transform: \`translateX(-\${scrollPosition}px)\`, lineHeight: '16px' }}>
              {trackText.repeat(3)}
            </div>
          </div>
        </div>

        {/* Spectrum Analyzer */}
        <div style={{ height: 12, backgroundColor: '#000', border: '2px solid #1A2332', display: 'flex', alignItems: 'flex-end', padding: '1px 2px', marginBottom: 4 }}>
          {[...Array(75)].map((_, i) => {
            const h = isPlaying ? Math.random() * 10 : 0;
            const color = h > 7 ? '#FF0000' : h > 4 ? '#FFFF00' : '#00FF00';
            return <div key={i} style={{ width: 2, height: h, backgroundColor: color, alignSelf: 'flex-end' }} />;
          })}
        </div>

        {/* Seek Bar */}
        <div style={{ width: '100%', height: 10, backgroundColor: '#1A2332', border: '1px solid #0F1419', position: 'relative', marginBottom: 6 }}>
          <div style={{ height: '100%', background: 'linear-gradient(180deg, #5FB75F 0%, #3A8A3A 100%)', width: duration > 0 ? \`\${(currentTime / duration) * 100}%\` : '0%', transition: 'width 0.1s ease' }} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[{ label: '⏮', fn: onPrev }, { label: '▶', fn: onPlay }, { label: '⏸', fn: onPause }, { label: '⏹', fn: onStop }, { label: '⏭', fn: onNext }].map(({ label, fn }) => (
              <button key={label} onClick={fn} style={{ width: 23, height: 18, backgroundColor: '#3D4C63', border: '1px solid #1A2332', borderRadius: 2, cursor: 'pointer', fontSize: 10, color: '#D0D8E0' }}>
                {label}
              </button>
            ))}
          </div>
          <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={{ flex: 1, height: 8, cursor: 'pointer' }} />
        </div>

        {/* Bottom Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          {['EQ', 'PL', 'ML'].map((label) => (
            <button key={label} style={{ height: 14, padding: '0 8px', fontSize: 7, fontWeight: 'bold', backgroundColor: '#3D4C63', color: '#D0D8E0', border: '1px solid #1A2332', borderRadius: 2, cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={() => audioRef.current && onLoadedMetadata(audioRef.current.duration)}
        onTimeUpdate={() => audioRef.current && onTimeUpdate(audioRef.current.currentTime)}
        onEnded={onTrackEnded}
        preload="metadata"
      />
    </div>
  );
}

const titleBtnStyle: React.CSSProperties = {
  width: 9, height: 9, fontSize: 7, backgroundColor: '#2F3E52',
  color: '#D0D8E0', border: '1px solid #1A2332', cursor: 'pointer', padding: 0,
};`;
