import { FileNode } from "./index";

// ============================================
// PORTFOLIO XP - FRONTEND
// ============================================
const portfolioFrontend: FileNode = {
  name: "FRONTEND",
  language: "typescript",
  isOpen: true,
  children: [
    {
      name: "Hero.tsx",
      language: "typescript",
      content: `// TODO: Paste Hero.tsx code here`,
    },
    {
      name: "InitialLoader.tsx",
      language: "typescript",
      content: `// TODO: Paste InitialLoader.tsx code here`,
    },
    {
      name: "Projects.tsx",
      language: "typescript",
      content: `// TODO: Paste Projects.tsx code here`,
    },
    {
      name: "VSCodeViewer.tsx",
      language: "typescript",
      content: `// TODO: Paste VSCodeViewer.tsx code here`,
    },
    {
      name: "Contacts.tsx",
      language: "typescript",
      content: `// TODO: Paste Contacts.tsx code here`,
    },
    {
      name: "Globe3D.tsx",
      language: "typescript",
      content: `// TODO: Paste Globe3D.tsx code here`,
    },
  ],
};

// ============================================
// PORTFOLIO XP - Combined Export
// ============================================
export const portfolioFiles: FileNode[] = [
  portfolioFrontend,
  {
    name: "README.md",
    language: "markdown",
    content: `# Portfolio XP - Interactive Developer Portfolio

## Overview
Windows XP-inspired interactive portfolio with modern animations,
3D globe visualization, and VSCode-style code viewer.

## Architecture
- **FRONTEND**: Next.js 14 + TypeScript, Framer Motion, Three.js

## Key Features
- Windows XP aesthetic with modern performance
- Interactive 3D globe with location markers
- VSCode-style code viewer with syntax highlighting
- Animated loader with tech symbols
- Real-time clock and location display
- Smooth page transitions and animations
`,
  },
];
