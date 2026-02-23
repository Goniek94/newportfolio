export const productGridCode = `"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { products } from "./Products";

interface ProductGridProps {
  activeCategory: string;
  searchQuery: string;
}

export default function ProductGrid({ activeCategory, searchQuery }: ProductGridProps) {
  // FILTERING LOGIC
  const filteredProducts = products.filter((product) => {
    // 1. Category filter (Category OR Group OR All)
    const matchesCategory =
      activeCategory === "all" ||
      product.category === activeCategory ||
      product.group === activeCategory;

    // 2. Search filter (Name OR Description)
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.desc.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-serif text-[#1F2A14] mb-2">
          Nie znaleziono produktów
        </h3>
        <p className="text-[#6B705C]">
          Spróbuj zmienić kategorię lub wpisać inną frazę.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}`;
