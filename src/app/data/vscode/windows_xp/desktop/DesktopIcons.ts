export const desktopIconsCode = `'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type IconData = {
  id: number;
  label: string;
  src: string;
  x: number;
  y: number;
};

interface DesktopIconsProps {
  showPortfolioIcons?: boolean;
  onIconDoubleClick?: (icon: IconData) => void;
}

// Default desktop icons — classic early-2000s apps
const DEFAULT_ICONS: IconData[] = [
  { id: 1, label: 'Gadu-Gadu',        src: '/images/chat-icon.png',   x: 32,  y: 32  },
  { id: 2, label: 'Counter-Strike 1.6', src: '/images/game-icon.png', x: 32,  y: 140 },
  { id: 3, label: 'Internet Explorer', src: '/images/winamp-icon.svg', x: 32,  y: 248 },
  { id: 4, label: 'Kosz',             src: '/images/trash-icon.png',  x: 32,  y: 356 },
  { id: 5, label: 'Tibia',            src: '/images/rpg-icon.png',    x: 150, y: 32  },
  { id: 6, label: 'Winamp',           src: '/images/winamp-icon.svg', x: 150, y: 140 },
  { id: 7, label: 'GTA: San Andreas', src: '/images/Gtasaicon.jpg',   x: 150, y: 240 },
  { id: 8, label: 'Need for Speed',   src: '/images/racing-icon.png', x: 150, y: 356 },
  { id: 9, label: 'Icy Tower',        src: '/images/icy-icon.png',    x: 268, y: 32  },
];

// Portfolio icons — revealed after the glitch sequence
const PORTFOLIO_ICONS: IconData[] = [
  { id: 101, label: 'About_Me.txt', src: '/images/document-icon.png', x: 386, y: 32  },
  { id: 102, label: 'Projects.txt', src: '/images/folder-icon.png',   x: 386, y: 140 },
];

export default function DesktopIcons({ showPortfolioIcons = false, onIconDoubleClick }: DesktopIconsProps) {
  const [icons, setIcons] = useState<IconData[]>(DEFAULT_ICONS);
  const [draggingIconId, setDraggingIconId] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // Append portfolio icons once glitch sequence completes
  useEffect(() => {
    if (showPortfolioIcons) {
      setIcons((prev) => {
        const existing = new Set(prev.map((i) => i.id));
        const fresh = PORTFOLIO_ICONS.filter((i) => !existing.has(i.id));
        return [...prev, ...fresh];
      });
    }
  }, [showPortfolioIcons]);

  /* ── Drag & drop ── */
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>, iconId: number) {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    setDraggingIconId(iconId);
    setOffsetX(e.clientX - rect.left);
    setOffsetY(e.clientY - rect.top);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (draggingIconId === null) return;
    e.preventDefault();
    setIcons((prev) =>
      prev.map((icon) =>
        icon.id === draggingIconId
          ? { ...icon, x: e.clientX - offsetX, y: e.clientY - offsetY }
          : icon
      )
    );
  }

  function handleMouseUp() { setDraggingIconId(null); }

  /* ── Emoji fallback when image fails to load ── */
  function getIconEmoji(label: string): string {
    if (label.includes('About') || label.includes('mnie')) return '👤';
    if (label.includes('Project') || label.includes('Projekt')) return '📁';
    if (label.includes('Gadu')) return '💬';
    if (label.includes('Counter')) return '🎯';
    if (label.includes('Internet')) return '🌐';
    if (label.includes('Kosz')) return '🗑️';
    if (label.includes('Tibia')) return '⚔️';
    if (label.includes('Winamp')) return '🎵';
    if (label.includes('GTA')) return '🚗';
    if (label.includes('Need')) return '🏎️';
    if (label.includes('Icy')) return '🧊';
    return '💾';
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute text-center cursor-pointer select-none pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, icon.id)}
          onDoubleClick={() => onIconDoubleClick?.(icon)}
          style={{ left: icon.x, top: icon.y, width: '64px', padding: '4px' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(49,106,197,.3)';
            e.currentTarget.style.border = '1px dotted #316ac5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.border = '1px solid transparent';
          }}
        >
          <div style={{ width: 32, height: 32, margin: '0 auto 2px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Image
              src={icon.src}
              alt={icon.label}
              width={32}
              height={32}
              style={{ objectFit: 'contain', filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = \`<span style="font-size:32px">\${getIconEmoji(icon.label)}</span>\`;
              }}
            />
          </div>
          <div style={{ color: '#fff', fontSize: 11, textShadow: '1px 1px 1px #000, -1px -1px 1px #000', lineHeight: 1.2, wordWrap: 'break-word', maxWidth: 64 }}>
            {icon.label}
          </div>
        </div>
      ))}
    </div>
  );
}`;
