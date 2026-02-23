export const dashboardPageCode = `import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { OverviewChart } from "@/components/dashboard/OverviewChart";

export default async function DashboardPage() {
  // Parallel data fetching for performance
  const [orderCount, productCount, totalRevenue, activeUsers] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "COMPLETED" },
      }),
      prisma.user.count(),
    ]);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[#1F2A14]">
          Dashboard
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Przychód całkowity"
          value={\`\${totalRevenue._sum.total || 0} PLN\`}
          icon={DollarSign}
          description="+20.1% od ostatniego miesiąca"
        />
        <StatsCard
          title="Zamówienia"
          value={orderCount.toString()}
          icon={ShoppingCart}
          description="+180 od ostatniego miesiąca"
        />
        <StatsCard
          title="Produkty"
          value={productCount.toString()}
          icon={Package}
          description="Aktywne w sklepie"
        />
        <StatsCard
          title="Klienci"
          value={activeUsers.toString()}
          icon={Users}
          description="+12 aktywnych teraz"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Przegląd Sprzedaży
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0 pl-2">
            <OverviewChart />
          </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="tracking-tight text-sm font-medium mb-4">
              Ostatnie zamówienia
            </h3>
            <RecentOrders />
          </div>
        </div>
      </div>
    </div>
  );
}`;
