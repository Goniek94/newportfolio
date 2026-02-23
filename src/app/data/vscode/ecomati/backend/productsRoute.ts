export const productsRouteCode = `import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/product";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

// GET - Fetch all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isAvailable = searchParams.get("isAvailable");

    // Build dynamic Prisma where clause
    const where: any = { deletedAt: null };

    if (category) where.category = category;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isAvailable !== null && isAvailable !== undefined) {
      where.isAvailable = isAvailable === "true";
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Serialize BigInt fields for JSON response
    const serializedProducts = products.map((product) => ({
      ...product,
      id: product.id.toString(),
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || null,
    }));

    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting per IP
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, remaining, reset } = await checkRateLimit(
      \`products_create_\${ip}\`,
    );

    if (!success) {
      return NextResponse.json(
        { error: "Zbyt wiele żądań. Spróbuj ponownie za chwilę.", rateLimit: { limit, remaining, reset: new Date(reset).toISOString() } },
        { status: 429, headers: { "X-RateLimit-Limit": limit.toString(), "X-RateLimit-Remaining": remaining.toString(), "X-RateLimit-Reset": reset.toString() } },
      );
    }

    const body = await request.json();

    // Zod validation with detailed error mapping
    let validated;
    try {
      validated = createProductSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Nieprawidłowe dane", details: error.issues.map((e: z.ZodIssue) => ({ field: e.path.join("."), message: e.message })) },
          { status: 400 },
        );
      }
      throw error;
    }

    // Auto-generate slug from name if not provided
    const slug = validated.slug || validated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({ data: { ...validated, slug } });

    const serializedProduct = {
      ...product,
      id: product.id.toString(),
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || null,
    };

    return NextResponse.json(serializedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}`;
