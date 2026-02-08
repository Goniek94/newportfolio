import { FileNode } from "./index";

// ============================================
// ECOMATI.PL - FRONTEND (ecomati-shop)
// ============================================
const ecomatiFrontend: FileNode = {
  name: "SHOP (Frontend)",
  language: "typescript",
  isOpen: true,
  children: [
    {
      name: "ProductCard.tsx",
      language: "typescript",
      content: `"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

// Dynamic product card with variant selection
// Features: hover animations, variant switching, quick add to cart
export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const currentVariant = product.variants?.[selectedVariantIndex];
  const displayPrice = currentVariant?.price || product.price;
  const displaySize = currentVariant?.size || product.sizes?.[0] || "Standard";

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, displaySize, 1);
    showToast(\`Dodano do koszyka: \${product.name} (\${displaySize})\`);
  };

  const handleVariantClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariantIndex(index);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group flex flex-col h-full bg-white relative overflow-hidden cursor-pointer
        border border-[#1F2A14]/15 shadow-sm transition-all duration-500 ease-out
        hover:-translate-y-2 hover:border-[#1F2A14]/40
        hover:shadow-[0_30px_50px_-12px_rgba(31,42,20,0.15)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={\`/sklep/\${product.id}\`} className="flex flex-col h-full">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F6F5EE] border-b border-[#1F2A14]/10">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          {product.featured && (
            <div className="absolute top-0 left-0 bg-[#1F2A14] text-[#F4FFD9] text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 z-10 shadow-sm">
              Bestseller
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow p-6 text-center bg-white relative z-10">
          <h3 className="text-xl font-serif text-[#1F2A14] mb-2 group-hover:text-[#3A4A22] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-[10px] text-[#6B705C] uppercase tracking-widest mb-4">
            {product.desc}
          </p>

          <motion.span
            key={displayPrice}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-bold text-[#1F2A14] mt-auto mb-3"
          >
            {displayPrice}
          </motion.span>

          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={(e) => handleVariantClick(e, index)}
                  className={\`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-all duration-200
                    \${selectedVariantIndex === index
                      ? "bg-[#3A4A22] text-[#F4FFD9] border-[#3A4A22] shadow-md"
                      : "bg-white text-[#1F2A14] border-[#1F2A14]/20 hover:border-[#3A4A22] hover:bg-[#F6F5EE]"
                    }\`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="grid grid-cols-[1fr_60px] border-t border-[#1F2A14]/15 bg-white relative z-10">
        <Link
          href={\`/sklep/\${product.id}\`}
          className="flex items-center justify-center gap-2 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#1F2A14] group-hover:bg-[#1F2A14] group-hover:text-[#F4FFD9] transition-colors duration-300"
        >
          Szczegóły
        </Link>
        <button
          className="flex items-center justify-center border-l border-[#1F2A14]/15 text-[#1F2A14] hover:bg-[#FFD966] transition-colors duration-300 z-20 cursor-pointer"
          onClick={handleQuickAdd}
        >
          <ShoppingBag size={18} strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  );
}`,
    },
    {
      name: "CartContext.tsx",
      language: "typescript",
      content: `"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Shopping cart context with LocalStorage persistence
// Features: add/remove items, update quantities, calculate totals
export interface CartItem {
  cartId: string;
  selectedSize: string;
  quantity: number;
}

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ecomati_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("ecomati_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = {
          ...product,
          cartId: \`\${product.id}-\${size}\`,
          selectedSize: size,
          quantity: quantity,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => {
    const priceNumber = parseFloat(
      item.price.replace(",", ".").replace(/[^0-9.]/g, "")
    );
    return sum + priceNumber * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}`,
    },
    {
      name: "HeroTitle.tsx",
      language: "typescript",
      content: `// Hero title component with elegant typography
// Features: responsive text sizing, decorative line accent
export default function HeroTitle() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
      <h1 className="relative leading-none text-[#F4FFD9]">
        <span className="block text-[clamp(3rem,8vw,8rem)] font-serif tracking-tight">
          Czysta energia
        </span>

        <span className="block text-[clamp(3.5rem,9vw,9.5rem)] italic font-serif">
          natury
        </span>

        <span className="mt-4 block text-sm tracking-[0.3em] text-[#FFD966] uppercase">
          Od nasion do zdrowia
        </span>

        {/* Decorative line - AXIOM style */}
        <span className="absolute top-1/2 left-full ml-6 h-px w-32 bg-[#FFD966]/70" />
      </h1>
    </div>
  );
}`,
    },
    {
      name: "NaturalSelection.tsx",
      language: "typescript",
      content: `// TODO: Paste NaturalSelection.tsx code from ecomati-shop here`,
    },
    {
      name: "ProductDetailClient.tsx",
      language: "typescript",
      content: `// TODO: Paste ProductDetailClient.tsx code from ecomati-shop here`,
    },
    {
      name: "ShopFilters.tsx",
      language: "typescript",
      content: `// TODO: Paste ShopFilters.tsx code from ecomati-shop here`,
    },
  ],
};

// ============================================
// ECOMATI.PL - BACKEND (ecomati-admin)
// ============================================
const ecomatiBackend: FileNode = {
  name: "ADMIN (Backend)",
  language: "typescript",
  isOpen: true,
  children: [
    {
      name: "products/route.ts",
      language: "typescript",
      content: `import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";

// Admin API endpoint for product management
// Features: authentication, rate limiting, CRUD operations

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, remaining } = await checkRateLimit(\`products_\${ip}\`);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests", limit, remaining },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        categoryId: body.categoryId,
        mainImage: body.mainImage,
        isAvailable: body.isAvailable ?? true,
        isFeatured: body.isFeatured ?? false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Soft delete
    await prisma.product.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}`,
    },
    {
      name: "StatsCard.tsx",
      language: "typescript",
      content: `"use client";

import { motion } from "framer-motion";

// Animated statistics card for admin dashboard
// Features: loading skeleton, color-coded changes, hover effects
export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-24 skeleton" />
            <div className="h-8 w-32 skeleton" />
            <div className="h-3 w-20 skeleton" />
          </div>
          <div className="w-12 h-12 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  const changeColor = {
    positive: "text-emerald-600 bg-emerald-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-slate-600 bg-slate-50",
  }[changeType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </p>
          {change && (
            <div
              className={\`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold \${changeColor}\`}
            >
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
    </motion.div>
  );
}`,
    },
    {
      name: "AnimatedDashboard.tsx",
      language: "typescript",
      content: `// TODO: Paste AnimatedDashboard.tsx code from ecomati-admin here`,
    },
    {
      name: "ProductForm.tsx",
      language: "typescript",
      content: `// TODO: Paste ProductForm.tsx code from ecomati-admin here`,
    },
    {
      name: "ProductFilters.tsx",
      language: "typescript",
      content: `// TODO: Paste ProductFilters.tsx code from ecomati-admin here`,
    },
    {
      name: "Switch.tsx",
      language: "typescript",
      content: `// TODO: Paste Switch.tsx code from ecomati-admin here`,
    },
  ],
};

// ============================================
// ECOMATI.PL - Combined Export
// ============================================
export const newEcomatiFiles: FileNode[] = [
  ecomatiFrontend,
  ecomatiBackend,
  {
    name: "README.md",
    language: "markdown",
    content: `# Ecomati.pl - Organic Food E-Commerce Platform

## Overview
Full-stack e-commerce platform for organic food products with 
modern admin dashboard and dynamic product variants.

## Architecture
- **SHOP (Frontend)**: Next.js 14 + TypeScript, Prisma ORM, Framer Motion
- **ADMIN (Backend)**: Next.js 14 Admin Dashboard, NextAuth, Supabase Storage

## Key Features
- Dynamic product variants with real-time stock management
- Shopping cart with LocalStorage persistence
- Admin dashboard with product & order management
- Image upload with Supabase Storage
- Prisma ORM with PostgreSQL
- Rate limiting & authentication
`,
  },
];
