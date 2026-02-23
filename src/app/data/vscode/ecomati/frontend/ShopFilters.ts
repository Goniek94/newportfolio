export const shopFiltersCode = `"use client";

import { useState } from "react";
import { SlidersHorizontal, X, Check } from "lucide-react";

export default function ShopFilters({ categories, activeCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-6 py-3 border border-[#1F2A14]/20 bg-white mb-8 w-full justify-center"
      >
        <SlidersHorizontal size={18} />
        <span className="text-xs font-bold uppercase tracking-widest">Filtruj produkty</span>
      </button>

      {/* Sidebar / Mobile Modal */}
      <div className={\`
        fixed inset-0 z-50 lg:static lg:block lg:z-auto
        \${isOpen ? "block" : "hidden"}
      \`}>
        {/* Mobile Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />

        <div className={\`
          fixed inset-y-0 right-0 w-[300px] bg-white p-8 shadow-2xl lg:shadow-none
          lg:static lg:w-full lg:p-0 lg:bg-transparent lg:inset-auto
          transform transition-transform duration-300 ease-out
          \${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        \`}>
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <span className="font-serif text-xl">Filtry</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-lg mb-6 text-[#1F2A14] flex items-center gap-2">
                Kategorie
                <div className="h-px flex-grow bg-[#1F2A14]/10" />
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onCategoryChange(null);
                    setIsOpen(false);
                  }}
                  className={\`w-full text-left flex items-center justify-between group transition-colors
                    \${!activeCategory ? "text-[#3A4A22] font-bold" : "text-[#1F2A14]/70 hover:text-[#1F2A14]"}\`}
                >
                  <span className="text-sm tracking-wide">Wszystkie produkty</span>
                  {!activeCategory && <Check size={14} />}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onCategoryChange(cat.id);
                      setIsOpen(false);
                    }}
                    className={\`w-full text-left flex items-center justify-between group transition-colors
                      \${activeCategory === cat.id ? "text-[#3A4A22] font-bold" : "text-[#1F2A14]/70 hover:text-[#1F2A14]"}\`}
                  >
                    <span className="text-sm tracking-wide">{cat.name}</span>
                    {activeCategory === cat.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block p-6 bg-[#F6F5EE] border border-[#1F2A14]/5 mt-12">
              <h4 className="font-serif text-[#1F2A14] mb-3">Ekologiczna uprawa</h4>
              <p className="text-xs leading-relaxed text-[#6B705C]">
                Wszystkie nasze produkty pochodzą z certyfikowanych upraw ekologicznych, wolnych od GMO i pestycydów.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}`;
