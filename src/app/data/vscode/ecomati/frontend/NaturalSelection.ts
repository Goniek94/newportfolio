export const naturalSelectionCode = `"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const SELECTION_STEPS = [
  {
    id: 1,
    title: "Selekcja Nasion",
    description: "Wybieramy tylko certyfikowane, ekologiczne nasiona od sprawdzonych dostawców.",
    image: "/Img/Migdały.png"
  },
  {
    id: 2,
    title: "Tłoczenie na Zimno",
    description: "Proces odbywa się w temperaturze do 40°C, zachowując wszystkie wartości odżywcze.",
    image: "/Img/Olejbio.png"
  },
  {
    id: 3,
    title: "Naturalna Filtracja",
    description: "Olej odpoczywa i sedymentuje naturalnie, bez użycia środków chemicznych.",
    image: "/Img/Dynia.png"
  }
];

export default function NaturalSelection() {
  return (
    <section className="py-24 bg-[#1F2A14] text-[#F6F5EE] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 aspect-square rounded-full overflow-hidden border border-[#F6F5EE]/10">
              <Image
                src="/Img/leaves-4337542_1280.jpg"
                alt="Natural process"
                fill
                className="object-cover opacity-80"
              />
            </div>
            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-[#F6F5EE]/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-[#F6F5EE]/5 rounded-full" />
          </motion.div>

          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-[#FFD966] text-sm uppercase tracking-[0.2em]">
                Proces Produkcji
              </span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Od Ziarna do <br />
                <span className="italic text-[#FFD966]">Złotej Kropli</span>
              </h2>
            </div>

            <div className="space-y-8">
              {SELECTION_STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="relative flex-shrink-0 w-16 h-16 bg-[#F6F5EE]/5 rounded-2xl flex items-center justify-center border border-[#F6F5EE]/10 group-hover:border-[#FFD966]/50 transition-colors duration-300">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif mb-2 group-hover:text-[#FFD966] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[#F6F5EE]/60 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`;
