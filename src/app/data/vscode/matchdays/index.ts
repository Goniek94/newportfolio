import { FileNode } from "../index";

// ==========================================
// FRONTEND IMPORTS
// ==========================================
import { authContextCode } from "./frontend/AuthContext";
import { smartFormCode } from "./frontend/SmartForm";
import { smartFormStepsCode } from "./frontend/SmartFormSteps";
import { stepCompletionModeCode } from "./frontend/StepCompletionMode";

// ==========================================
// BACKEND IMPORTS
// ==========================================
import { auctionsServiceCode } from "./backend/auctionsService";
import { auctionsCronServiceCode } from "./backend/auctionsCronService";
import { authServiceCode } from "./backend/authService";
import { bidsGatewayCode } from "./backend/bidsGateway";
import { notificationsGatewayCode } from "./backend/notificationsGateway";
import { schemaCode } from "./backend/schema";

export const matchdaysFiles: FileNode[] = [
  // ─── FRONTEND ─────────────────────────────────────────────────────────────
  {
    name: "FRONTEND (Next.js 14)",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "components",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "add-listing",
            language: "typescript",
            isOpen: true,
            children: [
              {
                name: "smart-steps",
                language: "typescript",
                isOpen: true,
                children: [
                  {
                    name: "SmartForm.tsx",
                    language: "typescript",
                    content: smartFormCode,
                  },
                  {
                    name: "SmartFormSteps.tsx",
                    language: "typescript",
                    content: smartFormStepsCode,
                  },
                  {
                    name: "steps",
                    language: "typescript",
                    isOpen: false,
                    children: [
                      {
                        name: "StepCompletionMode.tsx",
                        language: "typescript",
                        content: stepCompletionModeCode,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "lib",
        language: "typescript",
        isOpen: false,
        children: [
          {
            name: "context",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "AuthContext.tsx",
                language: "typescript",
                content: authContextCode,
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── BACKEND ──────────────────────────────────────────────────────────────
  {
    name: "BACKEND (NestJS)",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "src",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "modules",
            language: "typescript",
            isOpen: true,
            children: [
              {
                name: "auctions",
                language: "typescript",
                isOpen: true,
                children: [
                  {
                    name: "auctions.service.ts",
                    language: "typescript",
                    content: auctionsServiceCode,
                  },
                  {
                    name: "auctions-cron.service.ts",
                    language: "typescript",
                    content: auctionsCronServiceCode,
                  },
                ],
              },
              {
                name: "auth",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "auth.service.ts",
                    language: "typescript",
                    content: authServiceCode,
                  },
                ],
              },
              {
                name: "bids",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "bids.gateway.ts",
                    language: "typescript",
                    content: bidsGatewayCode,
                  },
                ],
              },
              {
                name: "notifications",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "notifications.gateway.ts",
                    language: "typescript",
                    content: notificationsGatewayCode,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "prisma",
        language: "typescript",
        isOpen: false,
        children: [
          {
            name: "schema.prisma",
            language: "prisma",
            content: schemaCode,
          },
        ],
      },
    ],
  },

  // ─── README ───────────────────────────────────────────────────────────────
  {
    name: "README.md",
    language: "markdown",
    content: `# Matchdays — Sports Auction Marketplace

Full-stack sports memorabilia auction platform. Users list, bid on, and buy
authenticated football jerseys and collectibles in real time.

> **Live:** [matchdaysproject.vercel.app](https://www.matchdaysproject.vercel.app)
> Register and try it — bidding, real-time notifications, and AI Legit Check are wired up.

---

## Highlights — what's worth a closer look

### Backend (NestJS)
- **\`auctions.service.ts\` → \`placeBid\`** — the flagship method. Prisma transaction
  with **optimistic locking** (\`where: { id, currentBid }\`), Prisma P2025 race-loss
  handling, **anti-snipe** end-time extension when bids land in the final 5 minutes,
  and post-commit WS broadcast + outbid notification.
- **\`auth.service.ts\`** — login lockout after 4 failed attempts (15min window),
  active-ban check, login history (IP + user-agent), JWT access (15min) + refresh
  (7d) with auto-downgrade of expired paid subscriptions on token refresh.
- **\`notifications.gateway.ts\`** — JWT-authenticated WebSocket. Token extracted
  from cookie / auth object / Authorization header. Per-user rooms (\`user:\${id}\`)
  let services emit to a single user from anywhere in the codebase.
- **\`schema.prisma\`** — replay-attack-safe \`PaymentOrder\` model
  (unique \`tokenId\` from JWT \`jti\`, server-computed amount).

### Frontend (Next.js 14, App Router)
- **\`SmartForm.tsx\`** — AI integration showcase. Multi-step listing flow with
  branching paths (AI vs Manual). On publish: upload photos to Supabase →
  create listing on backend → unblock UX immediately → fire-and-forget AI
  authenticity check (Google Gemini), which PATCHes the listing with the
  score when it returns. Slow AI calls never block the user.
- **\`AuthContext.tsx\`** — HTTP-only-cookie session with a \`localStorage\`
  flag to short-circuit \`/me\` for guests (avoids a 401 on every page load).
  401s are silently swallowed; other failures get logged.

---

## Stack

| Layer        | Tech                                                                |
|--------------|---------------------------------------------------------------------|
| Frontend     | Next.js 14 · TypeScript · TanStack Query · Socket.IO · Tailwind · Framer Motion |
| Backend      | NestJS · TypeScript · Prisma · PostgreSQL (Supabase) · Socket.IO    |
| Auth         | JWT (access 15min + refresh 7d) · HTTP-only cookies · sameSite:strict |
| Real-time    | Socket.IO Gateway · per-auction rooms · per-user rooms              |
| AI           | Google Gemini — jersey authenticity verification (background)       |
| Payments     | Stripe Connect — marketplace payouts                                |
| Storage      | Supabase Storage (listing photos)                                   |
| Deploy       | Vercel (frontend) · Railway (backend + DB)                          |
`,
  },
];
