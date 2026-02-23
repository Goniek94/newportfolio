export const useDesktopStateCode = `'use client';

import { useState } from 'react';

interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
}

export function useDesktopState() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    visible: false,
  });
  const [showStartMenu, setShowStartMenu] = useState(false);

  const openContextMenu = (x: number, y: number) => {
    setContextMenu({ x, y, visible: true });
  };

  const closeContextMenu = () => {
    setContextMenu({ x: 0, y: 0, visible: false });
  };

  const toggleStartMenu = () => setShowStartMenu((prev) => !prev);
  const closeStartMenu = () => setShowStartMenu(false);

  return {
    contextMenu,
    showStartMenu,
    openContextMenu,
    closeContextMenu,
    toggleStartMenu,
    closeStartMenu,
  };
}`;
