import { format } from "date-fns";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import ProductCard from "@/components/ProductCard";
import { useProducts, useLowStockProducts } from "@/hooks/use-api";
import CreateCustomerDialog from "@/components/CreateCustomerDialog";
import CreateSaleDialog from "@/components/CreateSaleDialog";

export default function DashboardPage() {
  const { data: products = [] } = useProducts();
  const { data: lowStock = [] } = useLowStockProducts();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalProducts = products.length;
  const lowStockCount = lowStock.length;
  const inStockCount = totalProducts - lowStockCount;
  const maxStock = Math.max(...products.map((p) => p.stockQuantity), 1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Overview header container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Welcome back! Here is a summary of your workspace products status.</p>
        </div>
        <div className="flex items-center gap-3 bg-card/40 dark:bg-zinc-950/45 border border-border/45 px-4 py-2 rounded-2xl backdrop-blur-md self-start sm:self-auto">
          <span className="text-xs font-semibold text-muted-foreground">
            {format(new Date(), "MMMM dd, yyyy")}
          </span>
        </div>
      </div>

      {/* Responsive Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard value={inStockCount} label="In Stock" type="success" />
        <StatCard value={lowStockCount} label="Low Stock" type="warning" />
        <StatCard value={totalProducts} label="Total Products" type="info" />
      </div>

      {/* Products Grid/List section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Featured Stocks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Quick status preview of items available in inventory.</p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <CreateSaleDialog triggerClassName="rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md shadow-primary/10 hover:shadow-primary/20" />
            <CreateCustomerDialog triggerClassName="rounded-xl px-4 py-2 text-xs font-bold border-border/80 transition-all hover:bg-muted" />
            
            <div className="h-8 w-[1px] bg-border/40 mx-1 hidden sm:block" />
            
            <div className="flex items-center rounded-xl bg-muted/50 p-1 border border-border/30">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-1.5 transition-all ${viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-1.5 transition-all ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product, i) => (
              <ProductCard
                key={product.id}
                name={product.name}
                category={product.category}
                stock={product.stockQuantity}
                maxStock={maxStock}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {products.slice(0, 6).map((product, i) => (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-4 glass-card rounded-2xl bg-card/25 dark:bg-zinc-900/10 hover:-translate-x-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs uppercase">
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{product.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">{product.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-semibold">Stock Quantity</p>
                    <p className="text-sm font-bold text-foreground">{product.stockQuantity} units</p>
                  </div>
                  {product.stockQuantity <= product.lowStockThreshold && (
                    <span className="rounded-xl bg-destructive/10 border border-destructive/20 px-2.5 py-1 text-[9px] font-bold text-destructive animate-pulse uppercase tracking-wide">
                      Low Stock
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

