export const windowContentCode = `'use client';

import React from 'react';
import GaduGaduWindow from '@/components/Applications/GaduGadu/gadugaduWindow';
import WinampPlayer from '@/components/Applications/Winamp/WinampPlayer';
import WinampPlaylist from '@/components/Applications/Winamp/WinampPlaylist';
import { WindowState, WindowConfig, APP_CONFIGS } from '@/components/Tools/WindowManager';
import FolderView from '@/components/DesktopXP/Folders/components/FolderView';

interface WinampState {
  currentIndex: number | null;
  isPlaying: boolean;
}

interface WindowContentProps {
  windowId: string;
  windowState: WindowState;
  onClose: (windowId: string) => void;
  onOpenWindow: (config: WindowConfig) => void;
  winampState: WinampState;
  setWinampState: React.Dispatch<React.SetStateAction<WinampState>>;
}

export function WindowContent({
  windowId,
  windowState,
  onClose,
  onOpenWindow,
  winampState,
  setWinampState,
}: WindowContentProps) {
  // Tracks shared between WinampPlayer and WinampPlaylist
  const tracks = [
    { title: 'Bring Me to Life', artist: 'Evanescence', url: '/sound/Evanescence - Bring Me To Life.mp3' },
    { title: 'In the End', artist: 'Linkin Park', url: '/sound/Linkin Park - In The End.mp3' },
    { title: 'Oops!... I Did It Again', artist: 'Britney Spears', url: '/sound/Britney Spears - Oops!...I Did It Again.mp3' },
    { title: '...Baby One More Time', artist: 'Britney Spears', url: '/sound/Britney Spears - ...Baby One More Time.mp3' },
    { title: 'The Real Slim Shady', artist: 'Eminem', url: '/sound/Eminem - The Real Slim Shady.mp3' },
    { title: 'Without Me', artist: 'Eminem', url: '/sound/Eminem - Without Me.mp3' },
    { title: 'Dragostea Din Tei', artist: 'O-Zone', url: '/sound/O-Zone - Dragostea Din Tei.mp3' },
    { title: 'Numb', artist: 'Linkin Park', url: '/sound/Numb - Linkin Park.mp3' },
    { title: 'Axel F', artist: 'Crazy Frog', url: '/sound/Crazy Frog - Axel F.mp3' },
  ];

  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const currentTrack =
    winampState.currentIndex !== null ? tracks[winampState.currentIndex] : null;

  switch (windowId) {
    case 'winamp':
      return (
        <WinampPlayer
          currentTrack={currentTrack}
          currentTime={currentTime}
          duration={duration}
          isPlaying={winampState.isPlaying}
          onPlay={() => {
            if (winampState.currentIndex === null) {
              setWinampState({ currentIndex: 0, isPlaying: true });
            } else {
              setWinampState({ ...winampState, isPlaying: true });
            }
          }}
          onPause={() => setWinampState({ ...winampState, isPlaying: false })}
          onStop={() => { setWinampState({ ...winampState, isPlaying: false }); setCurrentTime(0); }}
          onNext={() => {
            const nextIndex = winampState.currentIndex === null
              ? 0 : (winampState.currentIndex + 1) % tracks.length;
            setWinampState({ currentIndex: nextIndex, isPlaying: true });
          }}
          onPrev={() => {
            const prevIndex = winampState.currentIndex === null
              ? tracks.length - 1
              : (winampState.currentIndex - 1 + tracks.length) % tracks.length;
            setWinampState({ currentIndex: prevIndex, isPlaying: true });
          }}
          onTimeUpdate={setCurrentTime}
          onLoadedMetadata={setDuration}
          onTrackEnded={() => {
            const nextIndex = winampState.currentIndex === null
              ? 0 : (winampState.currentIndex + 1) % tracks.length;
            setWinampState({ currentIndex: nextIndex, isPlaying: true });
          }}
          onClose={() => onClose(windowId)}
        />
      );

    case 'winampPlaylist':
      return (
        <WinampPlaylist
          tracks={tracks}
          currentIndex={winampState.currentIndex}
          isPlaying={winampState.isPlaying}
          onTrackSelect={(index) => {
            setWinampState({ currentIndex: index, isPlaying: true });
            onOpenWindow(APP_CONFIGS.winamp);
          }}
          onClose={() => onClose(windowId)}
          isVisible={true}
        />
      );

    case 'gaduGadu':
      return <GaduGaduWindow onClose={() => onClose(windowId)} />;

    case 'aboutMe':
      return (
        <FolderView title="About_Me">
          <AboutMeContent />
        </FolderView>
      );

    case 'projects':
      return (
        <FolderView title="My_Projects">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '24px', padding: '8px' }}>
            <div onClick={() => onOpenWindow({ ...APP_CONFIGS.projects, id: 'marketplace', title: 'Marketplace' })}>
              <span style={{ fontSize: '120px' }}>📁</span>
              <div>Marketplace</div>
            </div>
            <div onClick={() => onOpenWindow({ ...APP_CONFIGS.projects, id: 'portfolioxp', title: 'Portfolio XP' })}>
              <span style={{ fontSize: '120px' }}>📁</span>
              <div>Portfolio XP</div>
            </div>
          </div>
        </FolderView>
      );

    case 'internetExplorer':
      return (
        <div style={{ padding: '20px' }}>
          <div style={{ background: '#f0f0f0', padding: '5px', marginBottom: '10px', border: '1px inset #ccc' }}>
            🌐 http://www.onet.pl
          </div>
          <h2>🇵🇱 Onet.pl - Portal internetowy</h2>
          <ul>
            <li>📰 Wiadomości</li>
            <li>📧 Poczta Onet</li>
            <li>⚽ Sport</li>
            <li>🌤️ Pogoda</li>
          </ul>
        </div>
      );

    default:
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>🚧 W budowie</h2>
          <p>Aplikacja <strong>{windowState.title}</strong> jest w trakcie tworzenia.</p>
        </div>
      );
  }
}`;
