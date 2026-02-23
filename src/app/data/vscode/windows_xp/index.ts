import { FileNode } from "../index";

// ==========================================
// IMPORTY — BOOT
// ==========================================
import { bootScreenCode } from "./boot/BootScreen";
import { welcomeScreenCode } from "./boot/WelcomeScreen";
import { pageOrchestratorCode } from "./boot/pageOrchestrator";

// ==========================================
// IMPORTY — TOOLS
// ==========================================
import { windowManagerCode } from "./tools/WindowManager";

// ==========================================
// IMPORTY — DESKTOP
// ==========================================
import { desktopIndexCode } from "./desktop/DesktopIndex";
import { windowContentCode } from "./desktop/WindowContent";
import { useDesktopStateCode } from "./desktop/useDesktopState";
import { useGlitchTimerCode } from "./desktop/useGlitchTimer";
import { startMenuCode } from "./desktop/StartMenu";
import { warningCode } from "./desktop/Warning";
import { desktopIconsCode } from "./desktop/DesktopIcons";
import { taskbarStylesCode, useClockCode } from "./desktop/Taskbar";

// ==========================================
// IMPORTY — APPLICATIONS
// ==========================================
import { winampPlayerCode } from "./applications/WinampPlayer";
import { winampPlaylistCode } from "./applications/WinampPlaylist";
import { gaduGaduCode } from "./applications/GaduGadu";

// ==========================================
// IMPORTY — GLITCH
// ==========================================
import { glitchOverlayCode } from "./glitch/GlitchOverlay";

export const windowsXpFiles: FileNode[] = [
  // ── app/page.tsx — main phase orchestrator ──
  {
    name: "app",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "page.tsx",
        language: "typescript",
        content: pageOrchestratorCode,
      },
    ],
  },

  // ── components/ ──
  {
    name: "components",
    language: "typescript",
    isOpen: true,
    children: [
      // ── boot/ ──
      {
        name: "boot",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "BootScreen.tsx",
            language: "typescript",
            content: bootScreenCode,
          },
          {
            name: "WelcomeScreen.tsx",
            language: "typescript",
            content: welcomeScreenCode,
          },
        ],
      },

      // ── Tools/ ──
      {
        name: "Tools",
        language: "typescript",
        isOpen: false,
        children: [
          {
            name: "WindowManager.tsx",
            language: "typescript",
            content: windowManagerCode,
          },
        ],
      },

      // ── common/ ──
      {
        name: "common",
        language: "typescript",
        isOpen: false,
        children: [
          {
            name: "DesktopIcons.tsx",
            language: "typescript",
            content: desktopIconsCode,
          },
        ],
      },

      // ── DesktopXP/ ──
      {
        name: "DesktopXP",
        language: "typescript",
        isOpen: true,
        children: [
          // Desktop/
          {
            name: "Desktop",
            language: "typescript",
            isOpen: true,
            children: [
              {
                name: "index.tsx",
                language: "typescript",
                content: desktopIndexCode,
              },
              {
                name: "components",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "WindowContent.tsx",
                    language: "typescript",
                    content: windowContentCode,
                  },
                ],
              },
              {
                name: "hooks",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "useDesktopState.ts",
                    language: "typescript",
                    content: useDesktopStateCode,
                  },
                  {
                    name: "useGlitchTimer.ts",
                    language: "typescript",
                    content: useGlitchTimerCode,
                  },
                ],
              },
            ],
          },

          // Taskbar/
          {
            name: "Taskbar",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "styles",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "taskbarStyles.ts",
                    language: "typescript",
                    content: taskbarStylesCode,
                  },
                ],
              },
              {
                name: "hooks",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "useClock.ts",
                    language: "typescript",
                    content: useClockCode,
                  },
                ],
              },
            ],
          },

          // StartMenu.tsx
          {
            name: "StartMenu.tsx",
            language: "typescript",
            content: startMenuCode,
          },

          // Warning.tsx (BSOD + Crazy Frog)
          {
            name: "Warning.tsx",
            language: "typescript",
            content: warningCode,
          },

          // Glitch/
          {
            name: "Glitch",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "index.tsx",
                language: "typescript",
                content: glitchOverlayCode,
              },
            ],
          },
        ],
      },

      // ── Applications/ ──
      {
        name: "Applications",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "Winamp",
            language: "typescript",
            isOpen: true,
            children: [
              {
                name: "WinampPlayer.tsx",
                language: "typescript",
                content: winampPlayerCode,
              },
              {
                name: "WinampPlaylist.tsx",
                language: "typescript",
                content: winampPlaylistCode,
              },
            ],
          },
          {
            name: "GaduGadu",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "gadugaduWindow.tsx",
                language: "typescript",
                content: gaduGaduCode,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── README.md ──
  {
    name: "README.md",
    language: "markdown",
    content: `# Windows XP Portfolio

> An interactive web portfolio disguised as a fully functional Windows XP simulation.
> Built solo from scratch using Next.js, React, and TypeScript.

---

## 🎬 Experience Flow

\`\`\`
BootScreen → WelcomeScreen → Desktop → GlitchOverlay → Warning (BSOD) → InfoScreen
\`\`\`

Each phase is a separate component with its own lifecycle, transitions, and logic.

---

## 🏗️ Architecture

\`\`\`
src/
├── app/
│   └── page.tsx                  # Phase orchestrator (boot → welcome → desktop → glitch)
│
└── components/
    ├── boot/
    │   ├── BootScreen.tsx         # XP boot progress bar (5s fill → fade out)
    │   └── WelcomeScreen.tsx      # "Welcome" login screen with XP logo
    │
    ├── common/
    │   └── DesktopIcons.tsx       # Draggable desktop icons with emoji fallback
    │
    ├── Tools/
    │   └── WindowManager.tsx      # Core window engine (drag, z-index, lifecycle)
    │
    ├── DesktopXP/
    │   ├── Desktop/
    │   │   ├── index.tsx          # Main desktop component
    │   │   ├── components/
    │   │   │   └── WindowContent.tsx  # Routes windowId → correct app
    │   │   └── hooks/
    │   │       ├── useDesktopState.ts # Context menu + start menu state
    │   │       └── useGlitchTimer.ts  # 5s countdown → glitch trigger
    │   ├── Taskbar/
    │   │   ├── styles/taskbarStyles.ts  # All XP taskbar CSS-in-JS styles
    │   │   └── hooks/useClock.ts        # Live HH:MM clock (updates every minute)
    │   ├── StartMenu.tsx          # Two-column XP start menu
    │   ├── Warning.tsx            # BSOD screen + Crazy Frog audio
    │   └── Glitch/
    │       └── index.tsx          # Matrix rain, RGB split, screen shake effects
    │
    └── Applications/
        ├── Winamp/
        │   ├── WinampPlayer.tsx   # Retro audio player with real playback
        │   └── WinampPlaylist.tsx # Track list with shared state
        └── GaduGadu/
            └── gadugaduWindow.tsx # Polish IM clone with live chat
\`\`\`

---

## 🪟 Window Manager

The custom \`WindowManager\` + \`useWindowManager\` hook handles:
- **Z-index stacking** — every \`focusWindow()\` increments a global counter
- **Drag & drop** — \`mousedown\` → \`mousemove\` delta with viewport boundary clamping
- **Minimize / Maximize / Close** — full window lifecycle
- **Window types** — \`windowed\`, \`fullscreen\` (CS 1.6, GTA), \`dialog\`
- **Deduplication** — opening an already-open window restores & focuses it

---

## 🎵 Winamp

Faithful recreation of the classic Winamp 2.x skin:
- **Real audio playback** via HTML5 \`<audio>\` element
- **Shared state** between Player and Playlist — track selection starts playback immediately
- **Scrolling track title** — animated marquee via \`setInterval\` + \`translateX\`
- **Spectrum analyzer** — randomized bar heights re-rendered on each tick
- **Volume slider** — live \`audio.volume\` control
- **9 era-appropriate tracks** — Evanescence, Linkin Park, Eminem, O-Zone, Crazy Frog

---

## 💬 Gadu-Gadu

Pixel-perfect clone of the iconic Polish messenger (circa 2005):
- **13 contacts** with authentic early-2000s nicks (\`~ArTuReK~\`, \`•●JuLkA•●\`)
- **Status system** — online / away / busy / offline with color-coded dots
- **Chat view** — pre-seeded message history with timestamps
- **Live messaging** — type and send messages in real time

---

## ✨ Glitch Sequence

After **5 seconds** on the desktop, a narrative glitch triggers automatically:
- Matrix rain canvas animation
- Static noise, RGB split, pixelation blocks
- Screen shake + BSOD error messages
- Smooth fade-out → Warning screen → Info screen

---

## 🛠️ Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Framework   | Next.js 15 (App Router)       |
| Language    | TypeScript 5                  |
| Styling     | Tailwind CSS v4 + inline CSS  |
| Animations  | CSS keyframes + React state   |
| Audio       | HTML5 Web Audio API           |
| Runtime     | React 19                      |
| Deployment  | Vercel                        |
`,
  },
];
