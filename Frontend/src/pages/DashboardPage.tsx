import { format } from "date-fns";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import StatCard from "@/components/StatCard";
import ProductCard from "@/components/ProductCard";
import CustomerMessage from "@/components/CustomerMessage";
import { useProducts, useLowStockProducts } from "@/hooks/use-api";
import CreateCustomerDialog from "@/components/CreateCustomerDialog";
import CreateSaleDialog from "@/components/CreateSaleDialog";

const fakeMessages = [
  { name: "Rahul Sharma", message: "Great service! Will visit again soon. 🤝", date: "Mar, 12" },
  { name: "Priya Patel", message: "Can you check my last order? Waiting for update.", date: "Mar, 12" },
  { name: "Amit Kumar", message: "Awesome! 🤩 Loved the new products in store.", date: "Mar, 11" },
  { name: "Sneha Reddy", message: "Really impressed! Can't wait for the sale event.", date: "Mar, 11" },
];

export default function DashboardPage() {
  const { data: products = [] } = useProducts();
  const { data: lowStock = [] } = useLowStockProducts();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalProducts = products.length;
  const lowStockCount = lowStock.length;
  const inStockCount = totalProducts - lowStockCount;
  const maxStock = Math.max(...products.map((p) => p.stockQuantity), 1);

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 space-y-6">
        <div className="rounded-2xl bg-card p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground">Products</h2>
              <div className="flex gap-8">
                <StatCard value={inStockCount} label="In Stock" />
                <StatCard value={lowStockCount} label="Low Stock" />
                <StatCard value={totalProducts} label="Total Products" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <p className="mr-2 text-sm text-muted-foreground">
                {format(new Date(), "MMMM, dd")}
              </p>
              <CreateSaleDialog triggerClassName="rounded-xl" />
              <CreateCustomerDialog triggerClassName="rounded-xl" />
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-2 ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-2 ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          <div className={viewMode === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col gap-3"}>
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
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-80 shrink-0">
        <div className="rounded-2xl bg-card p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">Client Messages</h3>
          {fakeMessages.map((msg, i) => (
            <CustomerMessage key={i} name={msg.name} message={msg.message} date={msg.date} />
          ))}
        </div>
      </div>
    </div>
  );
}
