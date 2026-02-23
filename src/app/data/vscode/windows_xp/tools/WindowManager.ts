export const windowManagerCode = `import React, { useState, useRef, useEffect, ReactNode } from 'react';

type WindowType = 'windowed' | 'fullscreen' | 'dialog';

interface WindowConfig {
  id: string;
  title: string;
  icon: string;
  type: WindowType;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
}

interface WindowState {
  id: string;
  title: string;
  icon: string;
  type: WindowType;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  resizable: boolean;
  minimizable: boolean;
  maximizable: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isVisible: boolean;
  zIndex: number;
  currentSize: { width: number; height: number };
  currentPosition: { x: number; y: number };
}

export type { WindowConfig, WindowState };

// Hook for managing windows
export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);

  const openWindow = (config: WindowConfig) => {
    const existingWindow = windows.find((w) => w.id === config.id);
    if (existingWindow) {
      updateWindow(config.id, {
        isMinimized: false,
        isVisible: true,
        zIndex: nextZIndex,
      });
      setNextZIndex((prev) => prev + 1);
      return;
    }

    const newWindow: WindowState = {
      id: config.id,
      title: config.title,
      icon: config.icon,
      type: config.type,
      defaultSize: config.defaultSize,
      defaultPosition: config.defaultPosition,
      resizable: config.resizable ?? true,
      minimizable: config.minimizable ?? true,
      maximizable: config.maximizable ?? config.type !== 'fullscreen',
      isMinimized: false,
      isMaximized: config.type === 'fullscreen',
      isVisible: true,
      zIndex: nextZIndex,
      currentSize: config.defaultSize,
      currentPosition: config.defaultPosition,
    };

    setWindows((prev) => [...prev, newWindow]);
    setNextZIndex((prev) => prev + 1);
  };

  const updateWindow = (windowId: string, updates: Partial<WindowState>) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, ...updates } : w))
    );
  };

  const closeWindow = (windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  const focusWindow = (windowId: string) => {
    updateWindow(windowId, { zIndex: nextZIndex });
    setNextZIndex((prev) => prev + 1);
  };

  return { windows, openWindow, updateWindow, closeWindow, focusWindow };
}

// Draggable window component
function DraggableWindow({ window, onUpdate, onClose, onMinimize, onMaximize, onFocus, children }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
      onFocus();
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        const newX = Math.max(0, Math.min(
          globalThis.innerWidth - window.currentSize.width,
          e.clientX - dragOffset.x
        ));
        const newY = Math.max(0, Math.min(
          globalThis.innerHeight - window.currentSize.height - 30,
          e.clientY - dragOffset.y
        ));
        onUpdate({ currentPosition: { x: newX, y: newY } });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window, onUpdate]);

  if (window.isMinimized || !window.isVisible) return null;

  return (
    <div
      ref={windowRef}
      style={{
        position: 'fixed',
        left: window.isMaximized ? 0 : window.currentPosition.x,
        top: window.isMaximized ? 0 : window.currentPosition.y,
        width: window.isMaximized ? '100vw' : window.currentSize.width,
        height: window.isMaximized ? 'calc(100vh - 30px)' : window.currentSize.height,
        zIndex: window.zIndex,
        backgroundColor: '#C0C0C0',
        border: '2px outset #C0C0C0',
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '11px',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        style={{
          height: '18px',
          background: 'linear-gradient(to bottom, #0050A0, #003875)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: 'white',
        }}
        onMouseDown={handleMouseDown}
      >
        <span>{window.icon} {window.title}</span>
        <div style={{ display: 'flex', gap: '2px' }}>
          {window.minimizable && (
            <button onClick={onMinimize}>_</button>
          )}
          {window.maximizable && (
            <button onClick={onMaximize}>{window.isMaximized ? '❐' : '□'}</button>
          )}
          <button onClick={onClose}>✕</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
        {children}
      </div>
    </div>
  );
}

// Main WindowManager component
export default function WindowManager({ windows, onWindowUpdate, onWindowClose, onWindowFocus, children }) {
  return (
    <>
      {windows.map((windowState) => (
        <DraggableWindow
          key={windowState.id}
          window={windowState}
          onUpdate={(updates) => onWindowUpdate(windowState.id, updates)}
          onClose={() => onWindowClose(windowState.id)}
          onMinimize={() => onWindowUpdate(windowState.id, { isMinimized: true })}
          onMaximize={() => onWindowUpdate(windowState.id, { isMaximized: !windowState.isMaximized })}
          onFocus={() => onWindowFocus(windowState.id)}
        >
          {children(windowState.id, windowState)}
        </DraggableWindow>
      ))}
    </>
  );
}

// Application configurations
export const APP_CONFIGS = {
  winamp: {
    id: 'winamp', title: 'Winamp', icon: '🎵', type: 'windowed',
    defaultSize: { width: 275, height: 220 }, defaultPosition: { x: 100, y: 100 },
    resizable: false, minimizable: true, maximizable: false,
  },
  winampPlaylist: {
    id: 'winampPlaylist', title: 'Winamp Playlist', icon: '📜', type: 'windowed',
    defaultSize: { width: 275, height: 280 }, defaultPosition: { x: 390, y: 100 },
    resizable: false, minimizable: true, maximizable: false,
  },
  gaduGadu: {
    id: 'gaduGadu', title: 'Gadu-Gadu', icon: '💬', type: 'windowed',
    defaultSize: { width: 250, height: 400 }, defaultPosition: { x: 50, y: 50 },
    resizable: true, minimizable: true, maximizable: true,
  },
  counterStrike: {
    id: 'counterStrike', title: 'Counter-Strike 1.6', icon: '🎯', type: 'fullscreen',
    defaultSize: { width: 0, height: 0 }, defaultPosition: { x: 0, y: 0 },
  },
  internetExplorer: {
    id: 'internetExplorer', title: 'Internet Explorer', icon: '🌐', type: 'windowed',
    defaultSize: { width: 800, height: 600 }, defaultPosition: { x: 100, y: 100 },
    resizable: true, minimizable: true, maximizable: true,
  },
  aboutMe: {
    id: 'aboutMe', title: 'About_Me', icon: '📁', type: 'windowed',
    defaultSize: { width: 800, height: 600 }, defaultPosition: { x: 100, y: 50 },
    resizable: true, minimizable: true, maximizable: true,
  },
  projects: {
    id: 'projects', title: 'Projects', icon: '📁', type: 'windowed',
    defaultSize: { width: 800, height: 600 }, defaultPosition: { x: 120, y: 70 },
    resizable: true, minimizable: true, maximizable: true,
  },
};`;
