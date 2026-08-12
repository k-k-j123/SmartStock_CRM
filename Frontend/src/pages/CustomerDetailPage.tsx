import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Mail, Phone, ArrowLeft, ReceiptText, CalendarClock, ShoppingBag, Trash2, Eye, UserCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCustomers, useDeleteCustomer, useSalesByCustomer, useSendCustomerMail } from "@/hooks/use-api";
import type { Sale } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import EditCustomerDialog from "@/components/EditCustomerDialog";
import { Badge } from "@/components/ui/badge";

export default function CustomerDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: customers = [] } = useCustomers();
  const { data: sales = [] } = useSalesByCustomer(id);
  const sendCustomerMail = useSendCustomerMail();
  const deleteCustomer = useDeleteCustomer();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const customer = useMemo(() => customers.find((entry) => entry.id === id), [customers, id]);
  const lastSale = sales[0];

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  if (!customer) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <Button variant="outline" className="gap-2 rounded-xl" onClick={() => navigate("/customers")}>
          <ArrowLeft size={14} /> Back to Registry
        </Button>
        <div className="glass-panel p-8 text-center rounded-3xl border border-border bg-card/45 backdrop-blur-xl">
          <p className="text-sm font-semibold text-muted-foreground">Customer profile could not be located in directory.</p>
        </div>
      </div>
    );
  }

  const handleSendMail = () => {
    sendCustomerMail.mutate(customer.id, {
      onSuccess: () => toast.success(`Newsletter notification sent to ${customer.name}`),
      onError: () => toast.error("Failed to transmit email notification"),
    });
  };

  const handleDeleteCustomer = () => {
    deleteCustomer.mutate(customer.id, {
      onSuccess: () => {
        toast.success("Customer profile purged from CRM database");
        navigate("/customers");
      },
      onError: () => toast.error("Failed to delete customer profile"),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Back button link */}
      <div>
        <Button 
          variant="outline" 
          className="gap-2 rounded-xl border-border/80 bg-card/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200" 
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft size={14} /> Back to Customer Registry
        </Button>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-card/45 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-border/30 shadow-md">
              <AvatarFallback className="bg-primary/10 text-base font-black text-primary uppercase">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">{customer.name}</h2>
                <Badge variant="outline" className="h-5 text-[9px] font-bold tracking-wide uppercase bg-primary/5 text-primary border-primary/20">
                  CRM Member
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><Phone size={13} className="text-muted-foreground/60" /> {customer.phone}</span>
                <span className="flex items-center gap-1.5"><Mail size={13} className="text-muted-foreground/60" /> {customer.email || "No email registered"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <EditCustomerDialog customer={customer} />
            
            <Button 
              className="gap-2 rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/10 transition-all font-semibold" 
              onClick={handleSendMail} 
              disabled={sendCustomerMail.isPending}
            >
              <Inbox size={14} />
              {sendCustomerMail.isPending ? "Sending..." : "Send Update Email"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 rounded-2xl border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 hover:text-destructive font-semibold transition-all"
                  disabled={deleteCustomer.isPending}
                >
                  <Trash2 size={14} />
                  Purge Profile
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl max-w-md bg-card border border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black tracking-tight text-foreground text-lg">Purge {customer.name}?</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs">
                    This will permanently delete the customer profile and associated invoices logs. This operational change is irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/95 rounded-xl font-semibold"
                    onClick={handleDeleteCustomer}
                  >
                    {deleteCustomer.isPending ? "Purging..." : "Confirm Purge"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
        <div className="glass-card p-5 sm:p-6 rounded-3xl bg-card/30 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Purchases</span>
          <h4 className="mt-2 text-2xl font-black text-foreground">{formatCurrency(customer.totalSpent)}</h4>
        </div>
        <div className="glass-card p-5 sm:p-6 rounded-3xl bg-card/30 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Order Date</span>
          <h4 className="mt-2.5 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground">
            <CalendarClock size={15} className="text-primary" /> 
            {lastSale ? format(new Date(lastSale.createdAt), "MMM dd, yyyy • h:mm a") : "No previous sales logs"}
          </h4>
        </div>
        <div className="glass-card p-5 sm:p-6 rounded-3xl bg-card/30 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Invoices Count</span>
          <h4 className="mt-2 flex items-center gap-1.5 text-2xl font-black text-foreground">
            <ReceiptText size={18} className="text-primary" /> {sales.length}
          </h4>
        </div>
      </div>

      {/* Sales History list */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-card/35 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/40">
        <div className="mb-6 flex items-center gap-2">
          <ShoppingBag size={18} className="text-primary" />
          <h3 className="text-lg font-bold text-foreground">Order Invoices Ledger</h3>
        </div>

        <div className="space-y-4">
          {sales.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground font-semibold">
              This customer has not recorded any transactions.
            </div>
          ) : (
            sales.map((sale) => (
              <div 
                key={sale.id} 
                className="flex flex-col gap-4 rounded-2xl border border-border/50 p-4 sm:p-5 bg-card/10 hover:bg-card/30 dark:hover:bg-zinc-950/20 md:flex-row md:items-center md:justify-between transition-all"
              >
                <div>
                  <p className="text-sm font-black text-foreground">{formatCurrency(sale.totalAmount)}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">{format(new Date(sale.createdAt), "MMM dd, yyyy • h:mm a")}</p>
                </div>
                
                <Button
                  variant="ghost"
                  className="h-auto self-start md:self-auto gap-2 rounded-xl px-4 py-2 border border-border/60 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  onClick={() => setSelectedSale(sale)}
                >
                  <Eye size={13} />
                  <span className="text-xs font-semibold">{sale.items.length} Product item(s)</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sale Details Dialog */}
      <Dialog open={Boolean(selectedSale)} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent className="rounded-3xl max-w-md bg-card/95 backdrop-blur-xl border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-black tracking-tight">
              <ShoppingBag className="h-5 w-5 text-primary" /> Invoice Summary Details
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedSale ? `Invoice associated with ${customer.name} registered on ${format(new Date(selectedSale.createdAt), "MMM dd, yyyy h:mm a")}` : ""}
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
