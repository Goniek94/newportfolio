export const productDetailClientCode = `"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Leaf, Droplets, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductDetailClient({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, selectedVariant.size, quantity);
    showToast(\`Dodano \${product.name} do koszyka\`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
      {/* Left: Image Gallery */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-[4/5] bg-[#F6F5EE] rounded-sm overflow-hidden border border-[#1F2A14]/10"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {product.isNew && (
              <span className="bg-[#1F2A14] text-[#F4FFD9] text-[10px] uppercase font-bold px-3 py-1.5 tracking-wider">
                Nowość
              </span>
            )}
            {product.isOrganic && (
              <span className="bg-[#3A4A22] text-[#F4FFD9] text-[10px] uppercase font-bold px-3 py-1.5 tracking-wider">
                BIO 100%
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-2 text-[#6B705C] uppercase tracking-[0.2em] text-xs font-bold">
            {product.category?.name || "Sklep"}
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif text-[#1F2A14] mb-6">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold text-[#1F2A14]">
              {selectedVariant.price} PLN
            </span>
            <div className="h-px flex-grow bg-[#1F2A14]/10" />
            <div className="flex text-[#FFD966]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
          </div>

          <p className="text-[#1F2A14]/70 leading-relaxed mb-10 font-light">
            {product.description}
          </p>

          {/* Variants */}
          <div className="mb-8">
            <span className="block text-xs uppercase font-bold tracking-wider text-[#1F2A14] mb-3">
              Wybierz pojemność
            </span>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={\`px-6 py-3 border transition-all duration-300 relative overflow-hidden
                    \${selectedVariant.id === variant.id
                      ? "border-[#1F2A14] bg-[#1F2A14] text-[#F4FFD9]"
                      : "border-[#1F2A14]/20 hover:border-[#1F2A14] text-[#1F2A14]"
                    }\`}
                >
                  <span className="relative z-10 text-sm font-bold tracking-wide">
                    {variant.size}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-8 border-t border-[#1F2A14]/10">
            <div className="w-32 border border-[#1F2A14]/20 flex items-center justify-between px-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-xl text-[#1F2A14] hover:text-[#3A4A22]"
              >
                -
              </button>
              <span className="font-bold text-[#1F2A14]">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-xl text-[#1F2A14] hover:text-[#3A4A22]"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex-grow bg-[#1F2A14] text-[#F4FFD9] flex items-center justify-center gap-3 
                uppercase tracking-[0.15em] text-xs font-bold hover:bg-[#3A4A22] transition-all duration-300"
            >
              <ShoppingBag size={18} />
              Do koszyka
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-[#1F2A14]/10">
            <div className="text-center">
              <Leaf className="mx-auto mb-2 text-[#3A4A22]" size={24} />
              <span className="text-[10px] uppercase font-bold tracking-wider">Organiczne</span>
            </div>
            <div className="text-center border-l border-r border-[#1F2A14]/10">
              <Droplets className="mx-auto mb-2 text-[#3A4A22]" size={24} />
              <span className="text-[10px] uppercase font-bold tracking-wider">Tłoczone na zimno</span>
            </div>
            <div className="text-center">
              <ShieldCheck className="mx-auto mb-2 text-[#3A4A22]" size={24} />
              <span className="text-[10px] uppercase font-bold tracking-wider">Certyfikowane</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}`;
