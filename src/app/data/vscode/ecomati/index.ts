import { FileNode } from "../index";

// ==========================================
// IMPORTY FRONTEND — HERO
// ==========================================
import { heroCode } from "./frontend/Hero";
import { heroTitleCode } from "./frontend/HeroTitle";

// ==========================================
// IMPORTY FRONTEND — SHOP
// ==========================================
import { productCardCode } from "./frontend/ProductCard";
import { productDetailClientCode } from "./frontend/ProductDetailClient";
import { featuredProductsCode } from "./frontend/FeaturedProducts";
import { productGridCode } from "./frontend/ProductGrid";
import { shopFiltersCode } from "./frontend/ShopFilters";
import { shopLayoutCode } from "./frontend/ShopLayout";

// ==========================================
// IMPORTY FRONTEND — SECTIONS
// ==========================================
import { naturalSelectionCode } from "./frontend/NaturalSelection";

// ==========================================
// IMPORTY FRONTEND — CONTEXT
// ==========================================
import { cartContextCode } from "./frontend/CartContext";
import { toastContextCode } from "./frontend/ToastContext";

// ==========================================
// IMPORTY FRONTEND — PAGES
// ==========================================
import { cartPageCode } from "./frontend/CartPage";
import { layoutCode } from "./frontend/rootLayout";

// ==========================================
// IMPORTY FRONTEND — API
// ==========================================
import { ordersRouteCode } from "./frontend/ordersRoute";

// ==========================================
// IMPORTY BACKEND (ADMIN)
// ==========================================
import { authCode } from "./backend/auth";
import { productsRouteCode } from "./backend/productsRoute";
import { productIdRouteCode } from "./backend/productIdRoute";
import { productValidationCode } from "./backend/productValidation";
import { statisticsRouteCode } from "./backend/statisticsRoute";
import { uploadRouteCode } from "./backend/uploadRoute";
import { rateLimitCode } from "./backend/rateLimit";
import { productFormCode } from "./backend/ProductForm";
import { dashboardPageCode } from "./backend/DashboardPage";
import { schemaCode } from "./backend/schema";
import { statsCardCode } from "./backend/StatsCard";

export const newEcomatiFiles: FileNode[] = [
  // --- FOLDER FRONTEND (SKLEP) ---
  {
    name: "SHOP (Frontend)",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "app",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "layout.tsx",
            language: "typescript",
            content: layoutCode,
          },
          {
            name: "koszyk",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "page.tsx",
                language: "typescript",
                content: cartPageCode,
              },
            ],
          },
          {
            name: "api",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "orders",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "route.ts",
                    language: "typescript",
                    content: ordersRouteCode,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "components",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "hero",
            language: "typescript",
            isOpen: true,
            children: [
              {
                name: "Hero.tsx",
                language: "typescript",
                content: heroCode,
              },
              {
                name: "HeroTitle.tsx",
                language: "typescript",
                content: heroTitleCode,
              },
            ],
          },
          {
            name: "shop",
            language: "typescript",
            isOpen: true,
            children: [
              {
                name: "ProductCard.tsx",
                language: "typescript",
                content: productCardCode,
              },
              {
                name: "ProductDetailClient.tsx",
                language: "typescript",
                content: productDetailClientCode,
              },
              {
                name: "FeaturedProducts.tsx",
                language: "typescript",
                content: featuredProductsCode,
              },
              {
                name: "ProductGrid.tsx",
                language: "typescript",
                content: productGridCode,
              },
              {
                name: "ShopFilters.tsx",
                language: "typescript",
                content: shopFiltersCode,
              },
              {
                name: "ShopLayout.tsx",
                language: "typescript",
                content: shopLayoutCode,
              },
            ],
          },
          {
            name: "sections",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "NaturalSelection.tsx",
                language: "typescript",
                content: naturalSelectionCode,
              },
            ],
          },
        ],
      },
      {
        name: "context",
        language: "typescript",
        isOpen: false,
        children: [
          {
            name: "CartContext.tsx",
            language: "typescript",
            content: cartContextCode,
          },
          {
            name: "ToastContext.tsx",
            language: "typescript",
            content: toastContextCode,
          },
        ],
      },
    ],
  },

  // --- FOLDER BACKEND (ADMIN) ---
  {
    name: "ADMIN (Backend)",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "lib",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "auth.ts",
            language: "typescript",
            content: authCode,
          },
          {
            name: "rate-limit.ts",
            language: "typescript",
            content: rateLimitCode,
          },
          {
            name: "validations",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "product.ts",
                language: "typescript",
                content: productValidationCode,
              },
            ],
          },
        ],
      },
      {
        name: "app",
        language: "typescript",
        isOpen: true,
        children: [
          {
            name: "api",
            language: "typescript",
            isOpen: true,
            children: [
              {
                name: "products",
                language: "typescript",
                isOpen: true,
                children: [
                  {
                    name: "route.ts",
                    language: "typescript",
                    content: productsRouteCode,
                  },
                  {
                    name: "[id]",
                    language: "typescript",
                    isOpen: false,
                    children: [
                      {
                        name: "route.ts",
                        language: "typescript",
                        content: productIdRouteCode,
                      },
                    ],
                  },
                ],
              },
              {
                name: "statistics",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "route.ts",
                    language: "typescript",
                    content: statisticsRouteCode,
                  },
                ],
              },
              {
                name: "upload",
                language: "typescript",
                isOpen: false,
                children: [
                  {
                    name: "route.ts",
                    language: "typescript",
                    content: uploadRouteCode,
                  },
                ],
              },
            ],
          },
          {
            name: "dashboard",
            language: "typescript",
            isOpen: false,
            children: [
              {
                name: "page.tsx",
                language: "typescript",
                content: dashboardPageCode,
              },
            ],
          },
        ],
      },
      {
        name: "components",
        language: "typescript",
        isOpen: false,
        children: [
          {
            name: "ProductForm.tsx",
            language: "typescript",
            content: productFormCode,
          },
          {
            name: "StatsCard.tsx",
            language: "typescript",
            content: statsCardCode,
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

  // --- README ---
  {
    name: "README.md",
    language: "markdown",
    content: `# Ecomati.pl — Organic Food E-Commerce Platform

> Two-app full-stack platform for a cold-pressed oil brand, built solo from scratch.
> Public storefront + standalone admin dashboard, sharing one PostgreSQL database.

---

## 🏗️ Architecture

\`\`\`
ecomati/
├── ecomati-shop/      # Public storefront  (Next.js 16, port 3000)
└── ecomati-admin/     # Admin dashboard    (Next.js 16, port 3001)
\`\`\`

Both apps connect to the same **PostgreSQL** database via **Prisma ORM**
and use **Supabase Storage** for product images.

---

## 🛒 Storefront — Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 16 (App Router)             |
| Language     | TypeScript 5                        |
| Styling      | Tailwind CSS v4                     |
| Animations   | Framer Motion 12                    |
| Database     | PostgreSQL + Prisma ORM 6           |
| Storage      | Supabase Storage                    |
| Runtime      | React 19                            |

### Key Features
- **Dynamic product variants** — size/weight selector with per-variant pricing
  and animated price transitions (\`ProductCard.tsx\`)
- **Persistent cart** — React Context + LocalStorage, survives page refresh
  (\`CartContext.tsx\`)
- **Toast notifications** — animated Framer Motion toasts (\`ToastContext.tsx\`)
- **Full checkout flow** — address form, delivery options, payment method,
  VAT invoice toggle, free delivery threshold (\`koszyk/page.tsx\`)
- **Orders API** — server-side total calculation, BigInt serialization,
  Prisma nested create (\`api/orders/route.ts\`)
- **SSR product pages** — fast initial load, SEO-friendly

---

## ⚡ Admin Dashboard — Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | Next.js 16 (App Router)           |
| Language       | TypeScript 5                      |
| Styling        | Tailwind CSS v4                   |
| Auth           | NextAuth v4 (credentials)         |
| Database       | PostgreSQL + Prisma ORM 6         |
| Validation     | Zod 4                             |
| Charts         | Recharts 3                        |
| Rate Limiting  | Upstash Redis + @upstash/ratelimit|
| Security       | bcryptjs (password hashing)       |
| Storage        | Supabase Storage                  |

---

## 🗄️ Database Schema (Prisma)

\`\`\`
Product ──< ProductVariant   (size, price, stock)
Product >── Category
Product ──< OrderItem >── Order
Order ── OrderStatus (PENDING | PAID | SHIPPED | COMPLETED | CANCELLED)
\`\`\`
`,
  },
];
