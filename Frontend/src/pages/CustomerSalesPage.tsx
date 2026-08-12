import { format } from "date-fns";
import { LogOut, Package, ReceiptText, Calendar, DollarSign, Loader2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSalesByCustomer } from "@/hooks/use-api";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

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
    <main className="min-h-screen bg-background overflow-x-hidden relative pb-16">
      {/* Background glow blobs */}
      <div className="glow-blob -left-20 -bottom-20 h-[300px] w-[300px] bg-primary/10 dark:bg-primary/5" />
      <div className="glow-blob -right-20 -top-20 h-[300px] w-[300px] bg-purple-500/10 dark:bg-purple-900/5" />

      {/* Floating Glass Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/35 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-md">
              <ReceiptText size={16} />
            </div>
            <div>
              <p className="text-sm font-black text-foreground tracking-tight leading-none">SmartStock Portal</p>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 uppercase tracking-wide">Purchase receipts history</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex text-xs font-semibold text-muted-foreground bg-muted/50 border px-3 py-1.5 rounded-xl">
              Hello, <span className="text-foreground font-bold ml-1">{customer.name}</span>
            </span>
            <Button 
              variant="outline" 
              className="gap-2 rounded-xl text-xs font-bold border-border/80 text-muted-foreground hover:text-foreground transition-all hover:bg-muted" 
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <section className="mx-auto max-w-3xl px-6 py-12 relative z-10">
        <div className="mb-10 text-center sm:text-left">
          <Badge variant="outline" className="mb-2 text-[9px] uppercase font-bold tracking-widest bg-primary/5 text-primary border-primary/20">
            Verified Customer Portal
          </Badge>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Your Purchase History</h1>
          <p className="text-xs text-muted-foreground mt-1">Review chronologically completed purchases, checkout quantities, and pricing summaries.</p>
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-3xl p-10 text-center border border-border/50 bg-card/45 backdrop-blur-xl flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <p className="text-xs font-semibold text-muted-foreground">Retrieving secure transaction invoices...</p>
          </div>
        ) : isError ? (
          <div className="glass-panel rounded-3xl p-10 text-center border border-destructive/20 bg-destructive/5 backdrop-blur-xl">
            <p className="text-xs font-bold text-destructive">Unable to load purchase ledger history. Please try again later.</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-border/50 bg-card/45 backdrop-blur-xl">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/60 mb-4" />
            <h3 className="text-base font-bold text-foreground">No purchases found</h3>
            <p className="mt-1 text-xs text-muted-foreground">Any CRM transactions associated with your phone number will show up here automatically.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sales.map((sale) => (
              <article 
                key={sale.id} 
                className="glass-card overflow-hidden rounded-3xl border border-white/20 dark:border-zinc-800/40 bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl p-6 sm:p-7 shadow-xl hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex flex-col gap-4 border-b border-border/30 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                      <Calendar size={13} className="text-primary" />
                      {format(new Date(sale.createdAt), "MMM dd, yyyy • h:mm a")}
                    </span>
                    <p className="text-[10px] font-mono text-muted-foreground/80 tracking-tight">Receipt ID: #{sale.id}</p>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 border-border/20 pt-3 sm:pt-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-0.5 justify-start sm:justify-end">
                      <DollarSign size={8} /> Gross Total
                    </p>
                    <p className="text-2xl font-black text-foreground mt-0.5">{formatCurrency(sale.totalAmount)}</p>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-border/50">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/40 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/85">
                        <th className="p-3">Purchased Product</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Selling Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {sale.items.map((item, index) => (
                        <tr key={`${sale.id}-${item.productId}-${index}`}>
                          <td className="p-3 text-xs font-bold text-foreground">{item.name || "Apparel Item"}</td>
                          <td className="p-3 text-right text-xs font-medium text-muted-foreground">{item.quantity}</td>
                          <td className="p-3 text-right text-xs font-semibold text-foreground">
                            {typeof item.priceAtSale === "number" ? formatCurrency(item.priceAtSale) : "-"}
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
