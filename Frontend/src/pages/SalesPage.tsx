import { useSales, useDeleteSale } from "@/hooks/use-api";
import { format } from "date-fns";
import { Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SalesPage() {
  const { data: sales = [] } = useSales();
  const deleteSale = useDeleteSale();

  const handleDelete = (id: string) => {
    deleteSale.mutate(id, { onSuccess: () => toast.success("Sale deleted") });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Sales History</h2>

      <div className="rounded-2xl bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="p-4">Sale ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ShoppingBag size={14} className="text-primary" />
                    </div>
                    <span className="text-sm font-mono text-foreground">{sale.id}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{sale.customerId}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {sale.items.map((item, i) => (
                      <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {item.name || item.productId} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-sm font-semibold text-foreground">${sale.totalAmount.toFixed(2)}</td>
                <td className="p-4 text-sm text-muted-foreground">{format(new Date(sale.createdAt), "MMM dd, HH:mm")}</td>
                <td className="p-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(sale.id)}>
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
