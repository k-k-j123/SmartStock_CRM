import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Mail, Phone, ArrowLeft, ReceiptText, CalendarClock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useCustomers, useSalesByCustomer, useSendCustomerMail } from "@/hooks/use-api";

export default function CustomerDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: customers = [] } = useCustomers();
  const { data: sales = [] } = useSalesByCustomer(id);
  const sendCustomerMail = useSendCustomerMail();

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
          <Button className="gap-2 rounded-xl" onClick={handleSendMail} disabled={sendCustomerMail.isPending}>
            <Mail size={14} />
            {sendCustomerMail.isPending ? "Sending..." : "Send Email"}
          </Button>
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
                <p className="text-xs text-muted-foreground">{sale.items.length} item(s)</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
