import { FileNode } from "../index";

// ==========================================
// IMPORTY FRONTEND
// ==========================================
import { clientCode } from "./frontend/api/client";
import { listingDetailsPageCode } from "./frontend/pages/ListingDetailsPage";
import { featuredListingsCode } from "./frontend/pages/FeaturedListings";
import { searchFormUpdatedCode } from "./frontend/search/SearchFormUpdated";
import { useTransactionsCode } from "./frontend/transactions/useTransactions";

// ==========================================
// IMPORTY BACKEND
// ==========================================
import { adModelCode } from "./backend/models/ad";
import { rateLimiterCode } from "./backend/middlewares/rateLimiting";
import { socketServiceCode } from "./backend/services/socketService";
import { appCode } from "./backend/app";
import { resetPasswordCode } from "./backend/controllers/passwordResetController";
import { routesIndexCode } from "./backend/routes/index";

export const autosellFiles: FileNode[] = [
  // --- FOLDER FRONTEND ---
  {
    name: "frontend",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "src",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "api",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "client.js",
                language: "javascript",
                content: clientCode,
              },
            ],
          },
          {
            name: "pages",
            language: "typescript",
            isOpen: true,
            children: [
              {
                name: "FeaturedListings.jsx",
                language: "javascript",
                content: featuredListingsCode,
              },
              {
                name: "ListingDetailsPage.jsx",
                language: "javascript",
                content: listingDetailsPageCode,
              },
            ],
          },
          {
            name: "search",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "SearchFormUpdated.jsx",
                language: "javascript",
                content: searchFormUpdatedCode,
              },
            ],
          },
          {
            name: "transactions",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "useTransactions.js",
                language: "javascript",
                content: useTransactionsCode,
              },
            ],
          },
        ],
      },
    ],
  },

  // --- FOLDER BACKEND ---
  {
    name: "backend",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "src",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "app.js",
            language: "javascript",
            content: appCode,
          },
          {
            name: "controllers",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "resetpassword.js",
                language: "javascript",
                content: resetPasswordCode,
              },
            ],
          },
          {
            name: "middlewares",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "rateLimiter.js",
                language: "javascript",
                content: rateLimiterCode,
              },
            ],
          },
          {
            name: "models",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "ad.js",
                language: "javascript",
                content: adModelCode,
              },
            ],
          },
          {
            name: "routes",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "index.js",
                language: "javascript",
                content: routesIndexCode,
              },
            ],
          },
          {
            name: "services",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "socketService.js",
                language: "javascript",
                content: socketServiceCode,
              },
            ],
          },
        ],
      },
    ],
  },

  // --- PLIKI LUZEM ---
  {
    name: "README.md",
    language: "markdown",
    content: `# Autosell.pl\nEnterprise Automotive Marketplace...`,
  },
];
