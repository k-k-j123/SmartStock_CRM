import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Eye, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCustomers, useDeleteSale, useSales } from "@/hooks/use-api";
import type { Sale } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SalesPage() {
  const { data: sales = [] } = useSales();
  const { data: customers = [] } = useCustomers();
  const deleteSale = useDeleteSale();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const customerNamesById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer.name])),
    [customers],
  );

  const handleDelete = (id: string) => {
    deleteSale.mutate(id, { onSuccess: () => toast.success("Sale deleted") });
  };

  const selectedCustomerName = selectedSale
    ? customerNamesById.get(selectedSale.customerId) || selectedSale.customerId
    : "";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Sales History</h2>

      <div className="overflow-hidden rounded-2xl bg-card">
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
              <tr key={sale.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ShoppingBag size={14} className="text-primary" />
                    </div>
                    <span className="font-mono text-sm text-foreground">{sale.id}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {customerNamesById.get(sale.customerId) || sale.customerId}
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    className="h-auto justify-start gap-2 rounded-lg px-2 py-1 text-left hover:bg-primary/10"
                    onClick={() => setSelectedSale(sale)}
                  >
                    <Eye size={14} />
                    <span className="text-sm font-medium">{sale.items.length} item(s)</span>
                  </Button>
                </td>
                <td className="p-4 text-sm font-semibold text-foreground">${sale.totalAmount.toFixed(2)}</td>
                <td className="p-4 text-sm text-muted-foreground">{format(new Date(sale.createdAt), "MMM dd, HH:mm")}</td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(sale.id)}
                    disabled={deleteSale.isPending}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(selectedSale)} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag size={18} />
              Sale Details
            </DialogTitle>
            <DialogDescription>
              {selectedSale ? `${selectedCustomerName} - ${format(new Date(selectedSale.createdAt), "MMM dd, yyyy h:mm a")}` : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedSale ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="p-3">Item</th>
                      <th className="p-3 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item, index) => (
                      <tr key={`${item.productId}-${index}`} className="border-b border-border last:border-0">
                        <td className="p-3 text-sm font-medium text-foreground">{item.name || item.productId}</td>
                        <td className="p-3 text-right text-sm text-muted-foreground">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-muted p-4">
                <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                <span className="text-lg font-bold text-foreground">${selectedSale.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
