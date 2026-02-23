export const cartPageCode = `"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, ArrowRight, ArrowLeft, CheckCircle,
  Package, Truck, FileText, Plus, Minus, Tag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import HeroNav from "@/components/hero/HeroNav";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, cartCount, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"dpd" | "inpost">("inpost");
  const [wantInvoice, setWantInvoice] = useState(false);

  const FREE_DELIVERY_THRESHOLD = 120;
  const deliveryCost = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : deliveryMethod === "dpd" ? 15 : 12;
  const finalPrice = totalPrice + deliveryCost;
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - totalPrice;

  const [formData, setFormData] = useState({
    email: "", imie: "", nazwisko: "", telefon: "",
    ulica: "", kod: "", miasto: "",
    nip: "", firma: "", metodaPlatnosci: "blik",
  });

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customerEmail: formData.email,
        customerName: \`\${formData.imie} \${formData.nazwisko}\`,
        customerPhone: formData.telefon,
        shippingAddress: {
          street: formData.ulica,
          city: formData.miasto,
          postalCode: formData.kod,
        },
        cart: cart.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price.replace(" zł", "").replace(",", "."),
          quantity: item.quantity,
          selectedSize: item.selectedSize,
        })),
        deliveryMethod: deliveryMethod === "inpost" ? "Paczkomat InPost" : "Kurier DPD",
        deliveryCost,
        totalPrice: finalPrice,
        paymentMethod: formData.metodaPlatnosci,
        invoiceData: wantInvoice ? { nip: formData.nip, company: formData.firma } : null,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Order failed");

      setOrderNumber(result.order.orderNumber);
      clearCart();
      setStep(2);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (step === 2) {
    return (
      <main className="min-h-screen bg-[#F6F5EE] flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full">
          <div className="w-20 h-20 bg-[#1F2A14] rounded-full flex items-center justify-center mx-auto mb-8 text-[#FFD966]">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-serif text-[#1F2A14] mb-4">Dziękujemy!</h1>
          {orderNumber && (
            <p className="text-sm text-[#6B705C] mb-2">
              Numer zamówienia: <span className="font-bold text-[#1F2A14]">{orderNumber}</span>
            </p>
          )}
          <p className="text-[#6B705C] mb-8">
            Twoje zamówienie zostało przyjęte. Szczegóły wysłaliśmy na email.
          </p>
          <Link href="/" className="block w-full py-4 bg-[#1F2A14] text-[#F6F5EE] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#3A4A22] transition-colors">
            Wróć na stronę główną
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F5EE] text-[#1F2A14]">
      <HeroNav variant="dark" />
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 pt-32 pb-20">
        <h1 className="text-3xl md:text-4xl font-serif mb-8">Koszyk i Dostawa</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <p className="text-xl mb-6">Twój koszyk jest pusty.</p>
            <Link href="/sklep" className="text-sm font-bold uppercase tracking-widest border-b border-[#1F2A14] pb-1">
              Wróć do zakupów
            </Link>
          </div>
        ) : (
          <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: FORMS */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Delivery options, payment methods, address form... */}
            </div>

            {/* RIGHT: ORDER SUMMARY (STICKY) */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-serif mb-6">Twój Koszyk ({cartCount})</h3>

                {/* Free delivery progress */}
                {amountToFreeDelivery > 0 && (
                  <div className="mb-4 p-3 bg-[#FFD966]/10 border border-[#FFD966]/30 rounded-lg">
                    <p className="text-xs text-[#1F2A14]">
                      Dodaj produkty za <span className="font-bold">{amountToFreeDelivery.toFixed(2)} zł</span>,
                      aby otrzymać <span className="font-bold text-[#3A4A22]">darmową dostawę</span>!
                    </p>
                  </div>
                )}

                {/* Totals */}
                <div className="flex justify-between items-center py-6 border-t border-[#1F2A14]/10 mb-6">
                  <span className="text-lg font-serif">Do zapłaty</span>
                  <span className="text-2xl font-bold">{finalPrice.toFixed(2)} zł</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1F2A14] text-[#F6F5EE] py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#3A4A22] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? "Przetwarzanie..." : "Zamawiam i płacę"}
                  {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
}`;
