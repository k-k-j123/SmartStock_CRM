import { useBestProducts, useRestockSuggestions, useLoyalCustomers } from "@/hooks/use-api";
import { TrendingUp, AlertTriangle, Crown, Award, DollarSign, PackagePlus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const { data: bestProducts = [] } = useBestProducts();
  const { data: restock = [] } = useRestockSuggestions();
  const { data: loyalCustomers = [] } = useLoyalCustomers();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">AI Business Intelligence</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Explore best-selling metrics, predictive restock analysis, and loyal customer insights.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Best Selling Products Chart */}
        <div className="glass-panel rounded-3xl p-6 bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40 shadow-xl">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Top Performing Products (Sales Qty)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bestProducts} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "1rem",
                  fontSize: 11,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}
              />
              <Bar dataKey="quantitySold" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="glass-panel rounded-3xl p-6 bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40 shadow-xl">
          <div className="mb-6 flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-500" />
            <h3 className="text-sm font-bold text-foreground">Product Revenue Distribution (INR)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bestProducts} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  borderRadius: "1rem",
                  fontSize: 11,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}
              />
              <Bar dataKey="totalRevenue" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Restock Suggestions */}
        <div className="glass-panel rounded-3xl p-6 bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40 shadow-xl">
          <div className="mb-6 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">Predictive Restock Indicators</h3>
          </div>
          <div className="space-y-4">
            {restock.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 transition-all">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">{r.product}</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Current Inventory: <span className="font-semibold text-foreground">{r.currentStock}</span> · Predicted demand: <span className="font-semibold text-foreground">{r.predictedDemand}</span>
                  </p>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-1.5 px-3 font-bold text-[10px] uppercase tracking-wide flex items-center gap-1">
                  <PackagePlus size={11} /> Order +{r.suggestedOrder}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Loyal Customers */}
        <div className="glass-panel rounded-3xl p-6 bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40 shadow-xl">
          <div className="mb-6 flex items-center gap-2">
            <Crown size={18} className="text-purple-500" />
            <h3 className="text-sm font-bold text-foreground">Top Loyal Accounts Rank</h3>
          </div>
          <div className="space-y-4">
            {loyalCustomers.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-border/50 bg-card/10 hover:bg-card/25 p-4 sm:p-5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Award size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{c.phone}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-black text-foreground bg-muted/40 border-border/60 py-1 px-2.5">
                  Spent: {formatCurrency(c.totalSpent)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

