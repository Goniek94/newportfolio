export const statisticsRouteCode = `import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const range = request.nextUrl.searchParams.get("range") || "30d";

    // Calculate date range from query param
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case "7d":  startDate.setDate(now.getDate() - 7); break;
      case "30d": startDate.setDate(now.getDate() - 30); break;
      case "90d": startDate.setDate(now.getDate() - 90); break;
      case "1y":  startDate.setFullYear(now.getFullYear() - 1); break;
      default:    startDate.setDate(now.getDate() - 30);
    }

    // Previous period for % change comparison
    const periodLength = now.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodLength);

    // Fetch current + previous period orders in parallel
    const [currentOrders, previousOrders, totalProducts] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: startDate, lte: now } },
        include: { items: { include: { product: true } } },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: previousStartDate, lt: startDate } },
      }),
      prisma.product.count({ where: { deletedAt: null } }),
    ]);

    // Revenue aggregation
    const totalRevenue = currentOrders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
    const previousRevenue = previousOrders.reduce((sum: number, o: any) => sum + Number(o.total), 0);

    const revenueChange = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const ordersChange = previousOrders.length > 0
      ? ((currentOrders.length - previousOrders.length) / previousOrders.length) * 100
      : 0;

    const averageOrderValue = currentOrders.length > 0 ? totalRevenue / currentOrders.length : 0;

    // Top selling products — aggregate by productId
    const productSales = new Map<string, { id: string; name: string; totalSold: number; revenue: number; image: string | null }>();

    currentOrders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const productId = item.productId.toString();
        const existing = productSales.get(productId);
        if (existing) {
          existing.totalSold += item.quantity;
          existing.revenue += Number(item.subtotal);
        } else {
          productSales.set(productId, { id: productId, name: item.productName, totalSold: item.quantity, revenue: Number(item.subtotal), image: item.productImage });
        }
      });
    });

    const topSellingProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);

    // Sales by category
    const categorySales = new Map<string, { category: string; count: number; revenue: number }>();

    currentOrders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const category = item.product.category || "Bez kategorii";
        const existing = categorySales.get(category);
        if (existing) {
          existing.count += item.quantity;
          existing.revenue += Number(item.subtotal);
        } else {
          categorySales.set(category, { category, count: item.quantity, revenue: Number(item.subtotal) });
        }
      });
    });

    const salesByCategory = Array.from(categorySales.values()).sort((a: any, b: any) => b.revenue - a.revenue);

    // Recent orders (last 10, sorted by date)
    const recentOrders = currentOrders
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((order: any) => ({
        id: order.id.toString(),
        orderNumber: order.orderNumber,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      }));

    return NextResponse.json({
      totalRevenue,
      totalOrders: currentOrders.length,
      totalProducts,
      averageOrderValue,
      revenueChange,
      ordersChange,
      topSellingProducts,
      recentOrders,
      salesByCategory,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}`;
