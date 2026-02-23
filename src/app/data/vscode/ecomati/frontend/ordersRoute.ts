export const ordersRouteCode = `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate unique order number (timestamp + random suffix)
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return \`ORD-\${timestamp}-\${random}\`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerEmail, customerName, customerPhone,
      shippingAddress, cart, deliveryMethod,
      deliveryCost, totalPrice, paymentMethod, invoiceData,
    } = body;

    // Validate required fields
    if (!customerEmail || !customerName || !customerPhone || !shippingAddress || !cart?.length) {
      return NextResponse.json({ error: "Brak wymaganych danych" }, { status: 400 });
    }

    // Calculate totals server-side (don't trust client)
    const subtotal = cart.reduce(
      (sum: number, item: any) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const shippingCost = deliveryCost || 0;
    const total = subtotal + shippingCost;

    // Create order with nested items in one transaction
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerEmail,
        customerName,
        customerPhone: customerPhone || null,
        shippingAddressLine1: shippingAddress.street,
        shippingCity: shippingAddress.city,
        shippingPostalCode: shippingAddress.postalCode,
        shippingCountry: "Polska",
        subtotal,
        shippingCost,
        total,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: paymentMethod || null,
        customerNotes: \`Metoda dostawy: \${deliveryMethod}\${
          invoiceData?.nip ? \`\\nFaktura VAT: \${invoiceData.company} (NIP: \${invoiceData.nip})\` : ""
        }\`,
        items: {
          create: cart.map((item: any) => ({
            productId: BigInt(item.id),
            productName: item.name,
            productImage: item.image,
            selectedSize: item.selectedSize || null,
            unitPrice: parseFloat(item.price),
            quantity: item.quantity,
            subtotal: parseFloat(item.price) * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Serialize BigInt fields for JSON response
    const serializedOrder = {
      ...order,
      id: order.id.toString(),
      items: order.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        orderId: item.orderId.toString(),
        productId: item.productId.toString(),
      })),
    };

    return NextResponse.json(
      { success: true, order: serializedOrder, message: "Zamówienie złożone pomyślnie" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Błąd podczas tworzenia zamówienia" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email jest wymagany" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    });

    // Serialize BigInt fields
    const serializedOrders = orders.map((order) => ({
      ...order,
      id: order.id.toString(),
      items: order.items.map((item) => ({
        ...item,
        id: item.id.toString(),
        orderId: item.orderId.toString(),
        productId: item.productId.toString(),
      })),
    }));

    return NextResponse.json({ orders: serializedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Błąd podczas pobierania zamówień" }, { status: 500 });
  }
}`;
