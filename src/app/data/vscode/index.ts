export type FileNode = {
  name: string;
  language: "javascript" | "typescript" | "json" | "markdown" | "image";
  content?: string;
  imageSrc?: string;
  isOpen?: boolean;
  children?: FileNode[];
};

// Export all project files
export { autosellFiles } from "./autosellFiles";
export { newEcomatiFiles } from "./newEcomatiFiles";
export { portfolioFiles } from "./portfolioFiles";
