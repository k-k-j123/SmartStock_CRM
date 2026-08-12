import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Eye, ShoppingBag, Trash2, Calendar, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { useCustomers, useDeleteSale, useSales } from "@/hooks/use-api";
import type { Sale } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
    if (confirm("Are you sure you want to delete this sale record? This action is permanent.")) {
      deleteSale.mutate(id, { 
        onSuccess: () => toast.success("Sale transaction deleted successfully"),
        onError: () => toast.error("Failed to delete sale transaction")
      });
    }
  };

  const selectedCustomerName = selectedSale
    ? customerNamesById.get(selectedSale.customerId) || selectedSale.customerId
    : "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Sales Ledger</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Review chronological checkout transactions, itemized sales receipts, and total revenue logs.</p>
      </div>

      {/* Table grid layout */}
      <div className="glass-panel rounded-3xl overflow-hidden bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/40 text-left text-xs text-muted-foreground/80 font-bold uppercase tracking-widest bg-muted/20">
                <th className="p-4 sm:p-5">Transaction ID</th>
                <th className="p-4 sm:p-5">Customer Profile</th>
                <th className="p-4 sm:p-5">Itemized List</th>
                <th className="p-4 sm:p-5 text-right">Invoice Total</th>
                <th className="p-4 sm:p-5">Purchase Date</th>
                <th className="p-4 sm:p-5 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-muted/30 dark:hover:bg-zinc-950/20 transition-colors">
                  <td className="p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShoppingBag size={14} />
                      </div>
                      <span className="font-mono text-xs font-semibold text-foreground tracking-tight">{sale.id.slice(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-sm font-bold text-foreground">
                    {customerNamesById.get(sale.customerId) || (
                      <span className="text-muted-foreground font-normal">Walk-in Customer</span>
                    )}
                  </td>
                  <td className="p-4 sm:p-5">
                    <Button
                      variant="ghost"
                      className="h-auto justify-start gap-2 rounded-xl px-3 py-1.5 border border-border/50 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <Eye size={13} />
                      <span className="text-xs font-semibold">{sale.items.length} item(s)</span>
                    </Button>
                  </td>
                  <td className="p-4 sm:p-5 text-sm font-black text-right text-foreground">{formatCurrency(sale.totalAmount)}</td>
                  <td className="p-4 sm:p-5 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-muted-foreground/60" />
                      {format(new Date(sale.createdAt), "MMM dd, yyyy • HH:mm")}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
      </div>

      {/* Sale Details Dialog */}
      <Dialog open={Boolean(selectedSale)} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent className="rounded-3xl max-w-md bg-card/95 backdrop-blur-xl border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-black tracking-tight">
              <ShoppingBag className="h-5 w-5 text-primary" /> Checkout Summary Details
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedSale ? `Invoice transactions summary of ${selectedCustomerName || "Guest User"} logged on ${format(new Date(selectedSale.createdAt), "MMM dd, yyyy h:mm a")}` : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedSale ? (
            <div className="space-y-4 py-2">
              <div className="overflow-hidden rounded-2xl border border-border/60">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/40">
                      <th className="p-3">Item Name</th>
                      <th className="p-3 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {selectedSale.items.map((item, index) => (
                      <tr key={`${item.productId}-${index}`}>
                        <td className="p-3 text-xs font-bold text-foreground">{item.name || item.productId}</td>
                        <td className="p-3 text-right text-xs font-medium text-muted-foreground">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-muted p-4 border border-border/60">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Total</span>
                <span className="text-base font-black text-foreground">{formatCurrency(selectedSale.totalAmount)}</span>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
