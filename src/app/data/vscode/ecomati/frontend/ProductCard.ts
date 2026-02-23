export const productCardCode = `"use client";

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
    console.log(\`Added \${product.name} (\${displaySize}) to cart\`);
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
}`;
