export const winampPlaylistCode = `import React from 'react';

interface Track {
  title: string;
  artist: string;
  url: string;
}

interface WinampPlaylistProps {
  tracks: Track[];
  currentIndex: number | null;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
  onClose: () => void;
  isVisible: boolean;
}

export default function WinampPlaylist({
  tracks, currentIndex, onTrackSelect, onClose, isVisible,
}: WinampPlaylistProps) {
  if (!isVisible) return null;

  const mockTimes = ['3:52', '3:47', '4:35', '3:33', '2:58', '3:27', '4:12', '3:17', '2:45', '4:38'];
  const totalTime = tracks.length * 3.5;
  const totalMinutes = Math.floor(totalTime);
  const totalSeconds = Math.floor((totalTime % 1) * 60);

  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #6B7C99 0%, #3D4C63 50%, #2A3747 100%)', fontFamily: 'Arial, sans-serif', userSelect: 'none', display: 'flex', flexDirection: 'column' }}>
      {/* Title Bar */}
      <div style={{ height: 14, background: 'linear-gradient(180deg, #4A5F7F 0%, #2F3E52 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', borderBottom: '1px solid #000' }}>
        <span style={{ color: '#D0D8E0', fontSize: 9, fontWeight: 'bold' }}>
          <span style={{ color: '#00FF00' }}>█</span> WINAMP PLAYLIST
        </span>
        <div style={{ display: 'flex', gap: 2 }}>
          <button style={titleBtnStyle}>_</button>
          <button style={titleBtnStyle}>▴</button>
          <button style={titleBtnStyle} onClick={onClose}>✕</button>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 8px 8px 8px' }}>
        {/* Header */}
        <div style={{ height: 14, display: 'flex', backgroundColor: '#1A2332', border: '1px solid #0F1419', marginBottom: 2 }}>
          <div style={{ width: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #0F1419' }}>
            <span style={{ color: '#7F8FA0', fontSize: 8, fontWeight: 'bold' }}>#</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 4, borderRight: '1px solid #0F1419' }}>
            <span style={{ color: '#7F8FA0', fontSize: 8, fontWeight: 'bold' }}>Title</span>
          </div>
          <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#7F8FA0', fontSize: 8, fontWeight: 'bold' }}>Time</span>
          </div>
        </div>

        {/* Track List */}
        <div style={{ flex: 1, backgroundColor: '#000', border: '2px solid #1A2332', overflow: 'auto', marginBottom: 4 }}>
          {tracks.map((track, index) => {
            const isCurrentTrack = index === currentIndex;
            return (
              <div
                key={index}
                style={{ display: 'flex', height: 13, cursor: 'pointer', borderBottom: '1px solid #0A0F14', backgroundColor: isCurrentTrack ? '#0000FF' : '#000' }}
                onClick={() => onTrackSelect(index)}
                onMouseEnter={(e) => { if (!isCurrentTrack) e.currentTarget.style.backgroundColor = '#1A2332'; }}
                onMouseLeave={(e) => { if (!isCurrentTrack) e.currentTarget.style.backgroundColor = '#000'; }}
              >
                <div style={{ width: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #0A0F14' }}>
                  <span style={{ color: '#00FF41', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {(index + 1).toString().padStart(2, ' ')}
                  </span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: 4, borderRight: '1px solid #0A0F14', overflow: 'hidden' }}>
                  <span style={{ color: '#00FF41', fontSize: 9, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.artist} - {track.title}
                  </span>
                </div>
                <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#00FF41', fontSize: 9, fontWeight: 'bold' }}>
                    {mockTimes[index % mockTimes.length]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 4, justifyContent: 'center' }}>
          {['ADD', 'REM', 'SEL', 'MISC', 'LIST'].map((label) => (
            <button key={label} style={{ height: 14, padding: '0 8px', fontSize: 7, fontWeight: 'bold', backgroundColor: '#3D4C63', color: '#D0D8E0', border: '1px solid #1A2332', borderRadius: 2, cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Info Bar */}
        <div style={{ height: 14, backgroundColor: '#1A2332', border: '1px solid #0F1419', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
          <span style={{ color: '#7F8FA0', fontSize: 8, fontWeight: 'bold' }}>
            {tracks.length} files • {totalMinutes}:{totalSeconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}

const titleBtnStyle: React.CSSProperties = {
  width: 9, height: 9, fontSize: 7, backgroundColor: '#2F3E52',
  color: '#D0D8E0', border: '1px solid #1A2332', cursor: 'pointer', padding: 0,
};`;
