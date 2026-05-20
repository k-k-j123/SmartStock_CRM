import { format } from "date-fns";
import { LogOut, Package, ReceiptText } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSalesByCustomer } from "@/hooks/use-api";
import { useAuth } from "@/lib/auth";

export default function CustomerSalesPage() {
  const { customer, isCustomerAuthenticated, logoutCustomer } = useAuth();
  const navigate = useNavigate();
  const { data: sales = [], isLoading, isError } = useSalesByCustomer(customer?.id ?? "", Boolean(customer?.id));

  if (!isCustomerAuthenticated || !customer) {
    return <Navigate to="/customer-login" replace />;
  }

  const handleLogout = () => {
    logoutCustomer();
    navigate("/customer-login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-lg font-bold text-foreground">SmartStock</p>
            <p className="text-sm text-muted-foreground">Purchase history for {customer.name}</p>
          </div>
          <Button variant="ghost" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Sales History</h1>
            <p className="text-sm text-muted-foreground">Only your completed purchases are shown here.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading your sales...</div>
        ) : isError ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-destructive">
            Unable to load your sales history.
          </div>
        ) : sales.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-medium">No purchases found</p>
            <p className="mt-1 text-sm text-muted-foreground">Sales made with your phone number will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <article key={sale.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{format(new Date(sale.createdAt), "MMM dd, yyyy h:mm a")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Receipt #{sale.id}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-foreground">${sale.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-md border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
                        <th className="p-3">Item</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.items.map((item, index) => (
                        <tr key={`${sale.id}-${item.productId}-${index}`} className="border-b border-border last:border-0">
                          <td className="p-3 text-sm font-medium text-foreground">{item.name || "Purchased item"}</td>
                          <td className="p-3 text-right text-sm text-muted-foreground">{item.quantity}</td>
                          <td className="p-3 text-right text-sm text-muted-foreground">
                            {typeof item.priceAtSale === "number" ? `$${item.priceAtSale.toFixed(2)}` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
