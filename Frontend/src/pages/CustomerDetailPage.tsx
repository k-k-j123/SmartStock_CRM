import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Mail, Phone, ArrowLeft, ReceiptText, CalendarClock, ShoppingBag, Trash2, Eye } from "lucide-react";
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
import EditCustomerDialog from "@/components/EditCustomerDialog";

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

  if (!customer) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" className="gap-2" onClick={() => navigate("/customers")}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">Customer not found.</CardContent>
        </Card>
      </div>
    );
  }

  const handleSendMail = () => {
    sendCustomerMail.mutate(customer.id, {
      onSuccess: () => toast.success("Mail sent successfully"),
      onError: () => toast.error("Failed to send mail"),
    });
  };

  const handleDeleteCustomer = () => {
    deleteCustomer.mutate(customer.id, {
      onSuccess: () => {
        toast.success("Customer deleted");
        navigate("/customers");
      },
      onError: () => toast.error("Failed to delete customer"),
    });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2 px-0 hover:bg-transparent" onClick={() => navigate("/customers")}>
        <ArrowLeft size={16} />
        Back to customers
      </Button>

      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {customer.name.split(" ").map((w) => w[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{customer.name}</CardTitle>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Phone size={14} /> {customer.phone}</span>
                <span className="flex items-center gap-2"><Mail size={14} /> {customer.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <EditCustomerDialog customer={customer} />
            <Button className="gap-2 rounded-xl" onClick={handleSendMail} disabled={sendCustomerMail.isPending}>
              <Mail size={14} />
              {sendCustomerMail.isPending ? "Sending..." : "Send Email"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={deleteCustomer.isPending}
                >
                  <Trash2 size={14} />
                  Delete Customer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {customer.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes the customer from the CRM. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteCustomer}
                  >
                    {deleteCustomer.isPending ? "Deleting..." : "Delete Customer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Spent</p>
            <p className="mt-2 text-2xl font-bold">${customer.totalSpent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Last Sale</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium">
              <CalendarClock size={16} /> {lastSale ? format(new Date(lastSale.createdAt), "MMM dd, yyyy h:mm a") : "No sales yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Sales Count</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
              <ReceiptText size={18} /> {sales.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag size={18} />
            Sales History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sales.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales history yet.</p>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="flex flex-col gap-2 rounded-xl border border-border p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">${sale.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(sale.createdAt), "MMM dd, yyyy h:mm a")}</p>
                </div>
                <Button
                  variant="ghost"
                  className="h-auto justify-start gap-2 rounded-lg px-2 py-1 text-left hover:bg-primary/10"
                  onClick={() => setSelectedSale(sale)}
                >
                  <Eye size={14} />
                  <span className="text-sm font-medium">{sale.items.length} item(s)</span>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedSale)} onOpenChange={(open) => !open && setSelectedSale(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag size={18} />
              Sale Details
            </DialogTitle>
            <DialogDescription>
              {selectedSale ? `${customer.name} - ${format(new Date(selectedSale.createdAt), "MMM dd, yyyy h:mm a")}` : ""}
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
