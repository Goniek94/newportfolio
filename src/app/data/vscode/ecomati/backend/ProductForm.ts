export const productFormCode = `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/products/ImageUpload";
import { productSchema } from "@/lib/validations/product";

// Comprehensive product form with dynamic variants and image upload
export default function ProductForm({ initialData, categories }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      images: [],
      variants: [{ size: "250ml", price: 0, stock: 10 }],
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const url = initialData
        ? \`/api/products/\${initialData.id}\`
        : "/api/products";

      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Something went wrong");

      router.refresh();
      router.push("/dashboard/products");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nazwa produktu</label>
              <Input {...form.register("name")} placeholder="Np. Olej Lniany BIO" />
            </div>
            <div>
              <label className="text-sm font-medium">Cena bazowa (PLN)</label>
              <Input
                type="number"
                step="0.01"
                {...form.register("price", { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Kategoria</label>
              <select
                {...form.register("categoryId")}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Wybierz kategorię</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Zdjęcia produktu</label>
            <ImageUpload
              value={form.watch("images")}
              onChange={(url) => {
                const current = form.getValues("images");
                form.setValue("images", [...current, url]);
              }}
              onRemove={(url) => {
                const current = form.getValues("images");
                form.setValue(
                  "images",
                  current.filter((i) => i !== url)
                );
              }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Opis</label>
          <Textarea
            {...form.register("description")}
            className="h-32 mt-2"
            placeholder="Opisz właściwości produktu..."
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Warianty produktu</h3>
          <p className="text-sm text-gray-500 italic">
            Zarządzanie wariantami (Pojemność / Waga) dostępne w pełnej wersji.
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Anuluj
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#1F2A14] hover:bg-[#3A4A22]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Zapisz zmiany" : "Utwórz produkt"}
          </Button>
        </div>
      </form>
    </div>
  );
}`;
