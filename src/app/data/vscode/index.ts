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
export { matchdaysFiles } from "./matchdays/index";
export { windowsXpFiles } from "./windows_xp/index";
