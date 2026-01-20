import { backendFiles } from "../backendFiles";
import { frontendFiles } from "../frontendFiles";

export type FileNode = {
  name: string;
  language: "javascript" | "typescript" | "json" | "markdown" | "image";
  content?: string;
  imageSrc?: string;
  isOpen?: boolean;
  children?: FileNode[];
};

export const autosellFiles: FileNode[] = [
  backendFiles,
  frontendFiles,
  {
    name: "__screenshots__",
    language: "json",
    isOpen: false,
    children: [
      {
        name: "dashboard_admin.webp",
        language: "image",
        imageSrc: "/images/Zrzuty/Panel - Admina Dashboard.webp",
      },
      {
        name: "listings_grid.webp",
        language: "image",
        imageSrc: "/images/Zrzuty/Lista ogłoszeń.webp",
      },
      {
        name: "search_engine.webp",
        language: "image",
        imageSrc: "/images/Zrzuty/Wyszukiwarka.webp",
      },
      {
        name: "user_messages.webp",
        language: "image",
        imageSrc: "/images/Zrzuty/Wiadomości.webp",
      },
    ],
  },
  {
    name: "README.md",
    language: "markdown",
    content: `# Autosell.pl - Enterprise Marketplace

## Overview
This repository contains key components of the Autosell.pl platform.

## Structure
- **BACKEND**: Node.js/Express controllers and services.
- **FRONTEND**: React components with TypeScript.

## Features
- Real-time Sockets
- Advanced Search
- Admin Dashboard
`,
  },
];
