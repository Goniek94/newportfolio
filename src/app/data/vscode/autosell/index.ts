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
    content: `# 🚗 Autosell.pl — Enterprise Automotive Marketplace

> **Production-grade automotive marketplace built entirely solo — live with real users, active listings, and working payments.**

![Status](https://img.shields.io/badge/status-live-brightgreen) ![Stack](https://img.shields.io/badge/stack-React_18_%7C_Node.js_%7C_MongoDB-blue)

---

## 📋 Overview

Autosell.pl is a full-featured automotive marketplace serving real users with active listings and integrated payments. The platform was designed, developed, and deployed as a solo project — covering everything from UI/UX to backend architecture, security, and DevOps.

A separate **commercial project under NDA** was also delivered using the same stack and architecture patterns.

---

## 🏗️ Architecture

\`\`\`
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (PWA)                     │
│  React 18 · Vite · React Router · Axios · Socket.IO │
├─────────────────────────────────────────────────────┤
│                   BACKEND (API)                      │
│  Node.js · Express · 8 Domain Modules · JWT Auth     │
├─────────────────────────────────────────────────────┤
│                   DATA LAYER                         │
│  MongoDB · Mongoose · Supabase (media storage)       │
└─────────────────────────────────────────────────────┘
\`\`\`

### Backend Domain Modules
| Module           | Responsibility                              |
|------------------|---------------------------------------------|
| \`users\`          | Registration, profiles, account management  |
| \`listings\`       | CRUD, search, filtering, scoring algorithm  |
| \`media\`          | Image upload, optimization, Supabase CDN    |
| \`communication\`  | Real-time messaging via Socket.IO           |
| \`notifications\`  | Push notifications, in-app alerts           |
| \`payments\`       | Payment integration, transaction history    |
| \`external\`       | Third-party API integrations                |
| \`admin\`          | Dashboard, user management, moderation      |

---

## ⚡ Key Features

### Frontend
- **Advanced Multi-Criteria Search** — make, model, year, price range, location radius, fuel type, and more
- **Real-Time Messaging** — instant chat between buyers and sellers via Socket.IO
- **Real-Time Notifications** — live alerts for new messages, listing updates, and promotions
- **Listing Management** — create, edit, promote, and manage listings with multi-image upload
- **Ad Promotion Modules** — featured listings, priority placement, highlight packages
- **PWA Support** — installable, offline-capable progressive web app
- **Responsive Design** — mobile-first approach, works on all devices

### Backend
- **JWT Authentication** — HttpOnly cookies, token rotation, blacklist mechanism
- **8 Domain-Driven Modules** — clean separation of concerns
- **Scoring Algorithm** — intelligent search result ranking
- **Image Optimization** — automatic compression and resizing on upload
- **Admin Dashboard** — full control over users, listings, and platform settings

---

## 🔒 Security Layer

| Feature                    | Implementation                          |
|----------------------------|-----------------------------------------|
| Content Security Policy    | Helmet CSP with strict directives       |
| CORS                       | Whitelist-based strict CORS policy      |
| Rate Limiting              | Per-endpoint configurable rate limits   |
| PII Protection             | HMAC-based encryption for sensitive data|
| Input Sanitization         | NoSQL injection prevention (mongo-sanitize) |
| Authentication             | JWT with HttpOnly cookies + rotation    |
| Token Blacklist            | Redis-backed token invalidation         |
| Security Testing           | Automated test suites for auth flows    |

---

## 🛠️ Tech Stack

| Layer      | Technologies                                          |
|------------|-------------------------------------------------------|
| Frontend   | React 18, Vite, React Router, Axios, Socket.IO Client |
| Backend    | Node.js, Express, Mongoose, Socket.IO                 |
| Database   | MongoDB Atlas                                         |
| Storage    | Supabase (image CDN)                                  |
| Auth       | JWT (HttpOnly cookies, rotation, blacklist)            |
| Security   | Helmet, CORS, rate-limiter, mongo-sanitize, HMAC      |
| DevOps     | PM2, Nginx reverse proxy, SSL/TLS                     |

---

## 📁 Project Structure

\`\`\`
autosell/
├── frontend/
│   └── src/
│       ├── api/           # Axios client, interceptors
│       ├── pages/         # Route-level components
│       ├── components/    # Reusable UI components
│       ├── search/        # Search form, filters, results
│       ├── transactions/  # Payment & transaction hooks
│       └── context/       # Auth, Socket, Notification providers
│
├── backend/
│   └── src/
│       ├── controllers/   # Route handlers per domain
│       ├── middlewares/    # Auth, rate-limit, validation
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express route definitions
│       ├── services/      # Business logic (socket, email, etc.)
│       └── app.js         # Express app configuration
│
└── README.md
\`\`\`

---

## 🚀 Deployment

- **Frontend**: Deployed as static PWA
- **Backend**: Node.js with PM2 process manager behind Nginx reverse proxy
- **Database**: MongoDB Atlas (cloud-hosted cluster)
- **Media**: Supabase Storage with CDN delivery

---

## 👤 Author

**Mateusz Goszczycki** — Full Stack Developer

- 🌐 [Portfolio](https://mateusz-goszczycki.vercel.app)
- 💼 [LinkedIn](https://linkedin.com/in/mateusz-goszczycki)
- 🐙 [GitHub](https://github.com/Goniek94)

---

*Built with passion, shipped to production. Every line of code written solo.*`,
  },
];
