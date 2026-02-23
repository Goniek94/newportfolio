import { FileNode } from "../index";

// Importujemy tylko gotowe "drzewa" z poszczególnych folderów
import { frontendFolder } from "./frontend/index";
import { backendFolder } from "./backend/index";

export const autosellFiles: FileNode[] = [
  frontendFolder,
  backendFolder,
  {
    name: "README.md",
    language: "markdown",
    content: `# Autosell.pl\nEnterprise Automotive Marketplace. Poniżej możesz przeglądać architekturę i kod źródłowy całego projektu...`,
  },
];
