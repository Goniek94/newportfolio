export const toastContextCode = `"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Fixed toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              layout
              className="
                pointer-events-auto
                flex items-center gap-3
                bg-[#1F2A14] text-[#F6F5EE]
                px-6 py-4 rounded-xl shadow-2xl
                border border-[#F6F5EE]/10
                min-w-[300px]
              "
            >
              <div
                className={\`p-1 rounded-full \${
                  toast.type === "success"
                    ? "bg-[#3A4A22] text-[#FFD966]"
                    : "bg-red-900 text-white"
                }\`}
              >
                {toast.type === "success" ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <X size={14} />
                )}
              </div>
              <p className="text-sm font-bold tracking-wide">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto text-[#F6F5EE]/30 hover:text-[#F6F5EE]"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}`;
