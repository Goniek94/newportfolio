export const productValidationCode = `import { z } from "zod";

// Full schema for creating a new product
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa jest wymagana")
    .max(200, "Nazwa może mieć maksymalnie 200 znaków"),
  slug: z.string().min(1, "Slug jest wymagany").max(200),
  shortDescription: z.string().max(500).optional().nullable(),
  longDescription: z.string().max(5000).optional().nullable(),
  price: z.number().positive("Cena musi być dodatnia").finite(),
  originalPrice: z.number().positive().finite().optional().nullable(),
  currency: z.string().default("PLN"),
  mainImage: z.string().url().optional().nullable(),
  galleryImages: z.array(z.string().url()).default([]),
  category: z.string().min(1, "Kategoria jest wymagana"),
  productGroup: z.string().min(1, "Grupa produktów jest wymagana"),
  tags: z.array(z.string()).default([]),
  weightOptions: z.any().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  nutritionalInfo: z.any().optional().nullable(),
  properties: z.array(z.string()).default([]),
  usageInstructions: z.string().optional().nullable(),
  storageInstructions: z.string().optional().nullable(),
  allergens: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  originCountry: z.string().optional().nullable(),
  producer: z.string().optional().nullable(),
  stockQuantity: z
    .number()
    .int()
    .min(0, "Stan magazynowy nie może być ujemny")
    .default(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.array(z.string()).default([]),
});

// Partial schema for PATCH/PUT — all fields optional
export const updateProductSchema = createProductSchema.partial();

// Inferred TypeScript types from Zod schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;`;
