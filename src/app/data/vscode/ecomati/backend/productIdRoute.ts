export const productIdRouteCode = `import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/lib/validations/product";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

// GET - Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id: BigInt(id) } });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({
      ...product,
      id: product.id.toString(),
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || null,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT - Update product with Zod validation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await checkRateLimit(\`products_update_\${ip}\`);
    if (!success) return NextResponse.json({ error: "Zbyt wiele żądań." }, { status: 429 });

    const { id } = await params;
    const body = await request.json();

    let validated;
    try {
      validated = updateProductSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Nieprawidłowe dane", details: error.issues.map((e: z.ZodIssue) => ({ field: e.path.join("."), message: e.message })) },
          { status: 400 },
        );
      }
      throw error;
    }

    const existingProduct = await prisma.product.findUnique({ where: { id: BigInt(id) } });
    if (!existingProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (existingProduct.deletedAt) return NextResponse.json({ error: "Cannot update deleted product" }, { status: 410 });

    const product = await prisma.product.update({ where: { id: BigInt(id) }, data: validated });

    return NextResponse.json({
      ...product,
      id: product.id.toString(),
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || null,
    });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (error.code === "P2002") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE - Soft delete (sets deletedAt, keeps data in DB)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await checkRateLimit(\`products_delete_\${ip}\`);
    if (!success) return NextResponse.json({ error: "Zbyt wiele żądań." }, { status: 429 });

    const { id } = await params;

    // Soft delete — preserves data, hides from storefront
    await prisma.product.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date(), isAvailable: false },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}`;
