export type FileNode = {
  name: string;
  language:
    | "javascript"
    | "typescript"
    | "json"
    | "markdown"
    | "image"
    | "prisma";
  content?: string;
  imageSrc?: string;
  isOpen?: boolean;
  children?: FileNode[];
};

// Zmieniona ścieżka - teraz wskazuje na Twój nowy folder i plik index.ts w nim
export { autosellFiles } from "./autosell/index";

// Pozostałe projekty na razie zostawiamy bez zmian (dopóki ich też nie podzielisz)
export { newEcomatiFiles } from "./newEcomatiFiles";
export { portfolioFiles } from "./portfolioFiles";

// Windows XP — interactive OS portfolio
export { windowsXpFiles } from "./windows_xp/index";
