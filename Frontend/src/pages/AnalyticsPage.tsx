import { useBestProducts, useRestockSuggestions, useLoyalCustomers } from "@/hooks/use-api";
import { TrendingUp, AlertTriangle, Crown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AnalyticsPage() {
  const { data: bestProducts = [] } = useBestProducts();
  const { data: restock = [] } = useRestockSuggestions();
  const { data: loyalCustomers = [] } = useLoyalCustomers();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">AI Analytics</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Best Selling Products Chart */}
        <div className="rounded-2xl bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Best Selling Products</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bestProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="quantitySold" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-2xl bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[hsl(var(--progress-green))]" />
            <h3 className="text-sm font-semibold text-foreground">Revenue by Product</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bestProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="totalRevenue" fill="hsl(var(--progress-green))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Restock Suggestions */}
        <div className="rounded-2xl bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-[hsl(var(--badge-warning))]" />
            <h3 className="text-sm font-semibold text-foreground">Restock Suggestions</h3>
          </div>
          <div className="space-y-3">
            {restock.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-[hsl(var(--badge-warning-bg))] p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.product}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: {r.currentStock} · Predicted demand: {r.predictedDemand}
                  </p>
                </div>
                <span className="rounded-full bg-[hsl(var(--badge-warning))] px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Order {r.suggestedOrder}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Loyal Customers */}
        <div className="rounded-2xl bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Crown size={18} className="text-[hsl(var(--progress-orange))]" />
            <h3 className="text-sm font-semibold text-foreground">Top Loyal Customers</h3>
          </div>
          <div className="space-y-3">
            {loyalCustomers.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-muted p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground">${c.totalSpent.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
