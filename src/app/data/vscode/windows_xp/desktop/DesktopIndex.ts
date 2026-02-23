export const desktopIndexCode = `'use client';

import React from 'react';
import DesktopIcons from '@/components/common/DesktopIcons';
import Taskbar from '../Taskbar';
import StartMenu from '../StartMenu';
import WindowManager, { useWindowManager } from '@/components/Tools/WindowManager';
import { ContextMenu, DebugInfo, WindowContent } from './components';
import { useDesktopState, useGlitchTimer } from './hooks';
import { createDesktopHandlers, handleWindowRestore } from './handlers';

interface DesktopXPProps {
  showAdditionalIcons?: boolean;
  onGlitchTrigger?: () => void;
}

const desktopStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: 'url("/img/Windowsxp.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
};

export default function DesktopXP({
  showAdditionalIcons = false,
  onGlitchTrigger,
}: DesktopXPProps) {
  const { windows, openWindow, updateWindow, closeWindow, focusWindow } = useWindowManager();

  // Shared Winamp state between player and playlist
  const [winampState, setWinampState] = React.useState({
    currentIndex: null as number | null,
    isPlaying: false,
  });

  const {
    contextMenu,
    showStartMenu,
    openContextMenu,
    closeContextMenu,
    toggleStartMenu,
    closeStartMenu,
  } = useDesktopState();

  const { timeOnDesktop, glitchTriggered } = useGlitchTimer(onGlitchTrigger);

  const { handleIconDoubleClick, handleSortIcons, handleRefresh, handleProperties } =
    createDesktopHandlers({ openWindow, closeContextMenu });

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY);
  };

  const handleDesktopClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      closeContextMenu();
      closeStartMenu();
    }
  };

  return (
    <div onMouseDown={handleDesktopClick} onContextMenu={handleContextMenu} style={desktopStyle}>
      <DesktopIcons
        showPortfolioIcons={showAdditionalIcons}
        onIconDoubleClick={handleIconDoubleClick}
      />

      <WindowManager
        windows={windows}
        onWindowUpdate={updateWindow}
        onWindowClose={closeWindow}
        onWindowFocus={focusWindow}
      >
        {(windowId, windowState) => (
          <WindowContent
            windowId={windowId}
            windowState={windowState}
            onClose={closeWindow}
            onOpenWindow={openWindow}
            winampState={winampState}
            setWinampState={setWinampState}
          />
        )}
      </WindowManager>

      <Taskbar
        windows={windows}
        onWindowRestore={(id) => handleWindowRestore(id, updateWindow, focusWindow)}
        onWindowFocus={focusWindow}
        onStartClick={toggleStartMenu}
        showStartMenu={showStartMenu}
      />

      <StartMenu
        visible={showStartMenu}
        onClose={closeStartMenu}
        onMenuItemClick={(id) => console.log('Start menu item clicked:', id)}
      />

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onSortIcons={handleSortIcons}
        onRefresh={handleRefresh}
        onProperties={handleProperties}
      />

      <DebugInfo
        timeOnDesktop={timeOnDesktop}
        windowsCount={windows.length}
        showAdditionalIcons={showAdditionalIcons}
        glitchTriggered={glitchTriggered}
      />
    </div>
  );
}`;
