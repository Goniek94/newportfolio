import { FileNode } from "./index";

// ============================================
// AUTOSELL.PL - Frontend Files
// ============================================
const autosellFrontend: FileNode = {
  name: "FRONTEND",
  language: "typescript",
  isOpen: true,
  children: [
    {
      name: "SocketContext.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "NotificationContext.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "AuthContext.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "useSearchForm.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "SearchForm.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "ListingDetails.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
  ],
};

// ============================================
// AUTOSELL.PL - Backend Files
// ============================================
const autosellBackend: FileNode = {
  name: "BACKEND",
  language: "typescript",
  isOpen: true,
  children: [
    {
      name: "adController.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "socketService.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "conversations.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "profileController.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "rateLimiting.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
    {
      name: "notificationManager.js",
      language: "javascript",
      content: `// TODO: Paste real code here`,
    },
  ],
};

// ============================================
// AUTOSELL.PL - Combined Export
// ============================================
export const autosellFiles: FileNode[] = [
  autosellFrontend,
  autosellBackend,
  {
    name: "__screenshots__",
    language: "json",
    isOpen: false,
    children: [
      {
        name: "dashboard_admin.webp",
        language: "image",
        imageSrc: "/img/Panel - Admina Dashboard.webp",
      },
      {
        name: "listings_grid.webp",
        language: "image",
        imageSrc: "/img/Lista ogłoszeń.webp",
      },
      {
        name: "search_engine.webp",
        language: "image",
        imageSrc: "/img/Wyszukiwarka.webp",
      },
      {
        name: "messages.webp",
        language: "image",
        imageSrc: "/img/Wiadomości.webp",
      },
    ],
  },
  {
    name: "README.md",
    language: "markdown",
    content: `# Autosell.pl - Enterprise Automotive Marketplace

## Overview
Full-stack automotive marketplace with real-time features, 
advanced search engine, and professional admin dashboard.

## Architecture
- **FRONTEND**: React 18 + TypeScript, Socket.IO Client, React Router
- **BACKEND**: Node.js + Express, MongoDB, Socket.IO, Redis

## Key Features
- Real-time WebSocket notifications & messaging
- Advanced vehicle search with 30+ filter parameters
- Admin dashboard with user management
- Rate limiting & security middleware
- Image upload with Supabase Storage
`,
  },
];
