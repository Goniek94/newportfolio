export const shopLayoutCode = `"use client";

import { useState } from "react";
import HeroNav from "@/components/hero/HeroNav";
import ShopHeader from "./ShopHeader";
import ShopFilters from "./ShopFilters";
import ProductGrid from "./ProductGrid";
import Footer from "@/components/layout/Footer";
import { products } from "@/components/shop/Products";

export default function ShopLayout() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="bg-[#F6F5EE] min-h-screen">
      {/* Dark nav variant for light background */}
      <HeroNav variant="dark" />

      <section className="pt-48 pb-32">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12">
          <ShopHeader />

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 mt-24">
            {/* STICKY SIDEBAR */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border-2 border-[#3A4A22]/20 shadow-[0_10px_40px_rgba(58,74,34,0.15)] transition-all duration-300">
                <ShopFilters
                  products={products}
                  activeCategory={category}
                  setCategory={setCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
            </aside>

            {/* PRODUCT GRID */}
            <main>
              <ProductGrid
                activeCategory={category}
                searchQuery={searchQuery}
              />
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}`;
