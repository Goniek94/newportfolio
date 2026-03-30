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

export { autosellFiles } from "./autosell/index";

// Matchdays — sports auction marketplace
export { matchdaysFiles } from "./matchdays/index";

export { newEcomatiFiles } from "./newEcomatiFiles";
export { portfolioFiles } from "./portfolioFiles";

// Windows XP — interactive OS portfolio
export { windowsXpFiles } from "./windows_xp/index";
